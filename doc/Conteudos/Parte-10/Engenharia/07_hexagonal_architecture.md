# Hexagonal Architecture: Ports, Adapters e Domínio Protegido

Arquitetura hexagonal, também chamada Ports and Adapters, organiza o sistema para proteger o domínio de detalhes externos como banco, framework web, fila, API de terceiros e interface.

A ideia principal: regras de negócio ficam no centro. O mundo externo se comunica com elas por portas. Adaptadores implementam essas portas usando tecnologias concretas.

---

## Problema que Ela Resolve

Em muitos projetos, a regra de negócio depende diretamente do framework:

```python
@router.post("/pedidos")
def criar_pedido(payload: dict, session: Session):
    produto = session.query(ProdutoModel).get(payload["produto_id"])
    pedido = PedidoModel(...)
    session.add(pedido)
    session.commit()
    requests.post("https://pagamentos.example.com", json={...})
    return {"id": pedido.id}
```

Esse código mistura:

- HTTP;
- ORM;
- transação;
- regra de pedido;
- integração externa;
- serialização;
- resposta da API.

Fica difícil testar regra de negócio sem banco, servidor e rede.

---

## Estrutura Mental

```text
                 Adaptador HTTP
                      |
                      v
Adaptador CLI -> Porta de entrada -> Caso de uso -> Porta de saída -> Adaptador Banco
                                      Dominio      -> Porta de saída -> Adaptador Pagamento
                      ^
                      |
                 Adaptador Worker
```

O domínio não conhece FastAPI, SQLAlchemy, RabbitMQ ou requests.

---

## Camadas

Uma organização comum:

```text
app/
├── domain/
│   ├── pedido.py
│   └── eventos.py
├── application/
│   ├── ports.py
│   └── use_cases.py
├── adapters/
│   ├── http_api.py
│   ├── sqlalchemy_pedidos.py
│   ├── pagamentos_http.py
│   └── event_publisher.py
└── main.py
```

Dependências devem apontar para dentro:

```text
adapters -> application -> domain
```

O domínio não importa adapters.

---

## Domínio

```python
# app/domain/pedido.py
from dataclasses import dataclass, field
from decimal import Decimal
from uuid import UUID


@dataclass(frozen=True)
class ItemPedido:
    produto_id: UUID
    quantidade: int
    preco_unitario: Decimal

    @property
    def subtotal(self) -> Decimal:
        return self.preco_unitario * self.quantidade


@dataclass
class Pedido:
    id: UUID
    cliente_id: UUID
    itens: list[ItemPedido] = field(default_factory=list)
    status: str = "rascunho"

    @property
    def total(self) -> Decimal:
        return sum((item.subtotal for item in self.itens), Decimal("0"))

    def confirmar(self) -> None:
        if not self.itens:
            raise ValueError("Pedido sem itens")
        self.status = "confirmado"
```

Esse arquivo não depende de banco, API ou framework.

---

## Portas de Saída

Portas de saída descrevem o que a aplicação precisa do mundo externo.

```python
# app/application/ports.py
from typing import Protocol
from uuid import UUID

from app.domain.pedido import Pedido


class PedidoRepository(Protocol):
    def obter(self, pedido_id: UUID) -> Pedido:
        ...

    def salvar(self, pedido: Pedido) -> None:
        ...


class PagamentoGateway(Protocol):
    def autorizar(self, pedido: Pedido) -> bool:
        ...


class EventPublisher(Protocol):
    def publicar(self, evento: object) -> None:
        ...
```

Use `Protocol` para expressar contrato sem herança obrigatória.

---

## Caso de Uso

```python
# app/application/use_cases.py
from dataclasses import dataclass
from uuid import UUID

from app.application.ports import EventPublisher, PagamentoGateway, PedidoRepository


@dataclass(frozen=True)
class ConfirmarPedidoCommand:
    pedido_id: UUID


class ConfirmarPedido:
    def __init__(
        self,
        pedidos: PedidoRepository,
        pagamentos: PagamentoGateway,
        eventos: EventPublisher,
    ):
        self.pedidos = pedidos
        self.pagamentos = pagamentos
        self.eventos = eventos

    def executar(self, command: ConfirmarPedidoCommand) -> None:
        pedido = self.pedidos.obter(command.pedido_id)
        pedido.confirmar()

        pagamento_aprovado = self.pagamentos.autorizar(pedido)
        if not pagamento_aprovado:
            pedido.status = "pagamento_recusado"

        self.pedidos.salvar(pedido)
        self.eventos.publicar({"tipo": "PedidoConfirmado", "pedido_id": str(pedido.id)})
```

O caso de uso coordena portas. Ele não sabe se o banco é PostgreSQL, MongoDB ou memória.

---

## Adaptador HTTP

```python
# app/adapters/http_api.py
from uuid import UUID

from fastapi import APIRouter

from app.application.use_cases import ConfirmarPedido, ConfirmarPedidoCommand

router = APIRouter()


def criar_router(confirmar_pedido: ConfirmarPedido) -> APIRouter:
    @router.post("/pedidos/{pedido_id}/confirmar")
    def confirmar(pedido_id: UUID) -> dict:
        confirmar_pedido.executar(ConfirmarPedidoCommand(pedido_id=pedido_id))
        return {"status": "ok"}

    return router
```

HTTP é só uma forma de entrada. O mesmo caso de uso poderia ser chamado por CLI, worker ou teste.

---

## Adaptador de Banco

```python
# app/adapters/sqlalchemy_pedidos.py
from uuid import UUID

from app.domain.pedido import Pedido


class SqlAlchemyPedidoRepository:
    def __init__(self, session):
        self.session = session

    def obter(self, pedido_id: UUID) -> Pedido:
        model = self.session.get(PedidoModel, pedido_id)
        if model is None:
            raise LookupError("Pedido nao encontrado")
        return model.to_domain()

    def salvar(self, pedido: Pedido) -> None:
        model = PedidoModel.from_domain(pedido)
        self.session.merge(model)
```

Mapeamento pode ser trabalhoso, mas impede que detalhes do ORM dominem o domínio.

---

## Adaptador de API Externa

```python
import httpx


class HttpPagamentoGateway:
    def __init__(self, base_url: str):
        self.base_url = base_url

    def autorizar(self, pedido) -> bool:
        response = httpx.post(
            f"{self.base_url}/autorizacoes",
            json={"pedido_id": str(pedido.id), "valor": str(pedido.total)},
            timeout=3,
        )
        response.raise_for_status()
        return response.json()["status"] == "aprovado"
```

Timeout, retries e mapeamento de erro pertencem ao adaptador ou a políticas próximas dele, não ao domínio.

---

## Injeção de Dependências

Montagem da aplicação:

```python
from fastapi import FastAPI


def create_app(session_factory, pagamentos_url: str) -> FastAPI:
    app = FastAPI()

    session = session_factory()
    pedidos_repo = SqlAlchemyPedidoRepository(session)
    pagamentos = HttpPagamentoGateway(pagamentos_url)
    eventos = LogEventPublisher()

    confirmar_pedido = ConfirmarPedido(
        pedidos=pedidos_repo,
        pagamentos=pagamentos,
        eventos=eventos,
    )

    app.include_router(criar_router(confirmar_pedido))
    return app
```

O ponto de composição conhece tudo. O restante do sistema conhece apenas o necessário.

---

## Testes

Teste do caso de uso sem banco e sem HTTP:

```python
class FakePedidosRepo:
    def __init__(self, pedido):
        self.pedido = pedido
        self.salvo = None

    def obter(self, pedido_id):
        return self.pedido

    def salvar(self, pedido):
        self.salvo = pedido


class FakePagamentos:
    def autorizar(self, pedido):
        return True


class FakeEventos:
    def __init__(self):
        self.publicados = []

    def publicar(self, evento):
        self.publicados.append(evento)
```

Teste:

```python
def test_confirmar_pedido():
    pedido = Pedido(id=pedido_id, cliente_id=cliente_id, itens=[item])
    repo = FakePedidosRepo(pedido)
    eventos = FakeEventos()

    use_case = ConfirmarPedido(repo, FakePagamentos(), eventos)
    use_case.executar(ConfirmarPedidoCommand(pedido_id=pedido_id))

    assert repo.salvo.status == "confirmado"
    assert eventos.publicados
```

Esse teste é rápido porque não sobe banco, servidor nem broker.

---

## Hexagonal vs Clean Architecture

Elas são parecidas em intenção:

- proteger domínio;
- inverter dependências;
- separar casos de uso de infraestrutura;
- facilitar testes.

Diferença prática:

- Hexagonal enfatiza portas e adaptadores.
- Clean Architecture enfatiza círculos/camadas e regras de dependência.

Em projetos reais, os estilos frequentemente se misturam.

---

## Quando Usar

Use arquitetura hexagonal quando:

- regras de negócio são importantes;
- o sistema tem integrações externas;
- você precisa testar casos de uso isoladamente;
- frameworks podem mudar;
- a aplicação terá múltiplas entradas, como HTTP, fila e CLI;
- você quer reduzir acoplamento com banco/ORM.

Evite aplicar de forma pesada quando:

- é um CRUD simples;
- o projeto é pequeno e descartável;
- a equipe não entende as camadas;
- há mais interfaces que regras;
- a abstração não protege nada real.

---

## Erros Comuns

- criar interface para tudo automaticamente;
- colocar DTO de HTTP dentro do domínio;
- deixar domínio importar ORM;
- fazer adaptador chamar adaptador diretamente;
- esconder lógica em mappers gigantes;
- transformar use case em repasse sem regra;
- confundir hexagonal com excesso de pastas.

---

## Checklist Avançado

- Domínio não depende de framework?
- Casos de uso expressam ações do negócio?
- Portas representam necessidades reais?
- Adaptadores contêm detalhes técnicos?
- Testes de aplicação rodam sem infraestrutura externa?
- O ponto de composição é claro?
- Erros externos são traduzidos antes de chegar ao domínio?
- A arquitetura reduz acoplamento mensurável?

Arquitetura hexagonal é uma forma disciplinada de manter o centro do sistema protegido. Ela não elimina complexidade, mas coloca cada tipo de complexidade no lugar correto.

