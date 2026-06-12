# SOLID Aplicado: Arquitetura Limpa, Padrões, Testes e Refatoração

SOLID fica mais valioso quando aplicado em sistemas reais: APIs, serviços de domínio, repositórios, filas, integrações, jobs, comandos e regras de negócio. Este módulo conecta os princípios a arquitetura limpa, separação de camadas, ports and adapters, patterns, testes e refatoração.

---

## Separação de Camadas

Uma organização comum:

```text
app/
├── domain/
│   ├── entities.py
│   ├── value_objects.py
│   └── services.py
├── application/
│   ├── use_cases.py
│   └── ports.py
├── infrastructure/
│   ├── repositories.py
│   ├── email.py
│   └── database.py
└── interfaces/
    ├── api.py
    └── cli.py
```

Direção das dependências:

```text
interfaces -> application -> domain
infrastructure -> application/domain contracts
```

O núcleo não depende da infraestrutura.

---

## Entidade de Domínio

```python
from dataclasses import dataclass, field
from datetime import datetime


@dataclass
class Pedido:
    cliente_email: str
    total: float
    id: int | None = None
    criado_em: datetime = field(default_factory=datetime.utcnow)
    status: str = "aberto"

    def fechar(self) -> None:
        if self.total <= 0:
            raise ValueError("Pedido sem total válido")
        if self.status != "aberto":
            raise ValueError("Apenas pedidos abertos podem ser fechados")
        self.status = "fechado"
```

Entidade protege invariantes. Ela não sabe sobre banco ou HTTP.

---

## Serviço de Domínio

Use quando a regra envolve múltiplas entidades ou não pertence naturalmente a uma entidade.

```python
class PoliticaDesconto:
    def calcular(self, cliente_vip: bool, total: float) -> float:
        if cliente_vip and total >= 500:
            return total * 0.15
        if total >= 1000:
            return total * 0.10
        return 0
```

Serviço de domínio deve continuar puro quando possível.

---

## Ports and Adapters

Port é contrato. Adapter é implementação.

`application/ports.py`:

```python
from typing import Protocol


class PedidoRepository(Protocol):
    def salvar(self, pedido) -> object:
        ...


class PublicadorEventos(Protocol):
    def publicar(self, evento: dict) -> None:
        ...
```

`infrastructure/repositories.py`:

```python
class SQLAlchemyPedidoRepository:
    def __init__(self, session) -> None:
        self.session = session

    def salvar(self, pedido):
        model = PedidoModel(
            cliente_email=pedido.cliente_email,
            total=pedido.total,
            status=pedido.status,
        )
        self.session.add(model)
        self.session.flush()
        pedido.id = model.id
        return pedido
```

---

## Caso de Uso

```python
class FecharPedido:
    def __init__(self, pedidos: PedidoRepository, eventos: PublicadorEventos) -> None:
        self.pedidos = pedidos
        self.eventos = eventos

    def executar(self, pedido: Pedido) -> Pedido:
        pedido.fechar()
        pedido = self.pedidos.salvar(pedido)
        self.eventos.publicar({"tipo": "pedido_fechado", "pedido_id": pedido.id})
        return pedido
```

SRP: coordena uma operação.

OCP: publicador pode ser Redis, Kafka, RabbitMQ ou fake.

DIP: depende de abstrações.

---

## Adapter HTTP

```python
from fastapi import APIRouter, Depends

router = APIRouter()


@router.post("/pedidos/{pedido_id}/fechar")
def fechar_pedido(pedido_id: int, use_case: FecharPedido = Depends(get_fechar_pedido)):
    pedido = buscar_pedido_ou_404(pedido_id)
    fechado = use_case.executar(pedido)
    return {"id": fechado.id, "status": fechado.status}
```

O endpoint adapta HTTP para caso de uso. Não concentra regra de negócio.

---

## Strategy Pattern

```python
class RegraDesconto(Protocol):
    def calcular(self, pedido: Pedido) -> float:
        ...


class DescontoVip:
    def calcular(self, pedido: Pedido) -> float:
        return pedido.total * 0.15


class DescontoNenhum:
    def calcular(self, pedido: Pedido) -> float:
        return 0


class CalculadoraPreco:
    def __init__(self, regra: RegraDesconto) -> None:
        self.regra = regra

    def total_final(self, pedido: Pedido) -> float:
        return pedido.total - self.regra.calcular(pedido)
```

---

## Factory Pattern

```python
def criar_regra_desconto(tipo_cliente: str) -> RegraDesconto:
    if tipo_cliente == "vip":
        return DescontoVip()
    return DescontoNenhum()
```

Factory fica na borda ou camada de composição, não espalhada pela regra.

---

## Adapter Pattern

```python
class SendGridClient:
    def send(self, to: str, subject: str, html: str) -> None:
        ...


class EmailAdapter:
    def __init__(self, client: SendGridClient) -> None:
        self.client = client

    def enviar(self, email: str, assunto: str, corpo: str) -> None:
        self.client.send(to=email, subject=assunto, html=corpo)
```

Adapter protege o núcleo da API externa.

---

## Template Method

```python
from abc import ABC, abstractmethod


class ImportadorBase(ABC):
    def importar(self, caminho: str) -> int:
        linhas = self.ler(caminho)
        registros = self.parsear(linhas)
        return self.salvar(registros)

    @abstractmethod
    def ler(self, caminho: str) -> list[str]:
        raise NotImplementedError

    @abstractmethod
    def parsear(self, linhas: list[str]) -> list[dict]:
        raise NotImplementedError

    @abstractmethod
    def salvar(self, registros: list[dict]) -> int:
        raise NotImplementedError
```

Use com cuidado. Herança pode ser rígida. Muitas vezes composição com Strategy é melhor.

---

## Testes: Mocks, Stubs e Fakes

Stub retorna resposta fixa:

```python
class StubRepositorio:
    def buscar(self, id: int):
        return Pedido(cliente_email="ana@example.com", total=100, id=id)
```

Fake tem comportamento funcional simples:

```python
class FakePedidoRepository:
    def __init__(self) -> None:
        self.pedidos = {}

    def salvar(self, pedido):
        pedido.id = pedido.id or len(self.pedidos) + 1
        self.pedidos[pedido.id] = pedido
        return pedido
```

Mock verifica interação:

```python
from unittest.mock import Mock


def test_publica_evento():
    repo = FakePedidoRepository()
    eventos = Mock()
    use_case = FecharPedido(repo, eventos)

    pedido = Pedido(cliente_email="ana@example.com", total=100)
    use_case.executar(pedido)

    eventos.publicar.assert_called_once()
```

Prefira fakes para comportamento de domínio e mocks para integrações externas.

---

## Refatorando Código Legado

Estratégia segura:

1. Escreva testes de caracterização do comportamento atual.
2. Extraia funções puras.
3. Separe infraestrutura da regra.
4. Introduza protocolos pequenos.
5. Injete dependências.
6. Substitua condicionais por estratégias quando a variação for real.
7. Mantenha commits pequenos.

Antes:

```python
def processar_pedido(payload):
    validar_payload(payload)
    salvar_no_banco(payload)
    enviar_email(payload["email"])
    return {"ok": True}
```

Depois:

```python
class ProcessarPedido:
    def __init__(self, repositorio, notificador) -> None:
        self.repositorio = repositorio
        self.notificador = notificador

    def executar(self, comando):
        pedido = Pedido(cliente_email=comando.email, total=comando.total)
        self.repositorio.salvar(pedido)
        self.notificador.pedido_criado(pedido.cliente_email, pedido.id)
        return pedido
```

---

## SOLID e Python Idiomático

Use SOLID sem transformar Python em Java burocrático.

Prefira:

- funções simples para comportamento simples;
- `Protocol` para contratos estruturais;
- dataclasses para dados;
- composição para variação;
- factories simples;
- injeção explícita;
- testes de comportamento.

Evite:

- interface para tudo;
- classe sem estado e sem motivo;
- hierarquia profunda;
- container global escondendo dependências;
- abstração antes da segunda implementação;
- mocks excessivos que testam implementação, não comportamento.

---

## Checklist de Especialista

- responsabilidades estão separadas por motivo de mudança?
- novas variantes entram por extensão, não edição do núcleo?
- subtipos preservam contratos comportamentais?
- interfaces são pequenas e orientadas ao consumidor?
- domínio depende de abstrações, não detalhes?
- infraestrutura está isolada por adapters?
- casos de uso são testáveis com fakes?
- regras críticas têm testes unitários rápidos?
- integrações têm testes próprios?
- padrões foram usados para reduzir complexidade real?
- há menos acoplamento depois da refatoração?
- o design continua simples para o tamanho do problema?

