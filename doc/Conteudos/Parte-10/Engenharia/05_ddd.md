# DDD: Domain-Driven Design do Básico ao Avançado

DDD, Domain-Driven Design, é uma abordagem para construir software em torno do domínio do negócio. A ideia central é que sistemas complexos devem refletir a linguagem, regras, processos e limites reais do negócio.

DDD não é uma pasta chamada `domain`. Também não é usar entidades sofisticadas em qualquer CRUD. DDD é mais valioso quando o domínio é complexo, muda com frequência e exige colaboração profunda entre engenharia e especialistas do negócio.

---

## Domínio

Domínio é a área de conhecimento que o software atende.

Exemplos:

- logística;
- crédito;
- educação;
- saúde;
- seguros;
- e-commerce;
- contabilidade;
- streaming.

Um sistema pode ter vários subdomínios:

```text
E-commerce
├── Catalogo
├── Carrinho
├── Pedidos
├── Pagamentos
├── Estoque
├── Entrega
└── Atendimento
```

Cada subdomínio tem linguagem e regras próprias.

---

## Linguagem Ubíqua

Linguagem ubíqua é o vocabulário compartilhado entre negócio e tecnologia.

Se o negócio fala "pedido confirmado", "pagamento autorizado" e "estoque reservado", o código deve refletir isso:

```python
pedido.confirmar()
pagamento.autorizar()
estoque.reservar()
```

Evite nomes genéricos:

```python
obj.processar()
manager.update_status()
data_handler.execute()
```

Código com linguagem fraca esconde regra de negócio.

---

## Entidade

Entidade possui identidade e ciclo de vida.

```python
from dataclasses import dataclass, field
from decimal import Decimal
from uuid import UUID


@dataclass
class Pedido:
    id: UUID
    cliente_id: UUID
    itens: list["ItemPedido"] = field(default_factory=list)
    status: str = "rascunho"

    def adicionar_item(self, item: "ItemPedido") -> None:
        if self.status != "rascunho":
            raise ValueError("Nao e possivel alterar pedido fora de rascunho")
        self.itens.append(item)

    def confirmar(self) -> None:
        if not self.itens:
            raise ValueError("Pedido sem itens nao pode ser confirmado")
        self.status = "confirmado"

    @property
    def total(self) -> Decimal:
        return sum((item.subtotal for item in self.itens), Decimal("0"))
```

Dois pedidos com mesmo conteúdo mas IDs diferentes são entidades diferentes.

---

## Value Object

Value Object não tem identidade própria. Ele é definido por seus valores e deve ser imutável quando possível.

```python
from dataclasses import dataclass
from decimal import Decimal


@dataclass(frozen=True)
class Dinheiro:
    valor: Decimal
    moeda: str = "BRL"

    def __post_init__(self) -> None:
        if self.valor < 0:
            raise ValueError("Dinheiro nao pode ser negativo")

    def somar(self, outro: "Dinheiro") -> "Dinheiro":
        if self.moeda != outro.moeda:
            raise ValueError("Moedas diferentes")
        return Dinheiro(self.valor + outro.valor, self.moeda)
```

Value Objects reduzem validações repetidas e tornam invariantes explícitas.

---

## Agregado

Agregado é um conjunto de objetos tratado como unidade de consistência. Ele possui uma raiz, chamada aggregate root.

```text
Pedido (aggregate root)
├── ItemPedido
├── DescontoAplicado
└── Evento de domínio
```

Regra: objetos externos devem modificar o agregado pela raiz.

```python
@dataclass
class ItemPedido:
    produto_id: UUID
    quantidade: int
    preco: Dinheiro

    def __post_init__(self) -> None:
        if self.quantidade <= 0:
            raise ValueError("Quantidade deve ser positiva")

    @property
    def subtotal(self) -> Dinheiro:
        return Dinheiro(self.preco.valor * self.quantidade, self.preco.moeda)
```

O agregado protege invariantes:

```python
def confirmar(self) -> None:
    if not self.itens:
        raise ValueError("Pedido sem itens")
    if self.total.valor <= 0:
        raise ValueError("Total invalido")
    self.status = "confirmado"
```

---

## Serviços de Domínio

Use serviço de domínio quando uma regra não pertence naturalmente a uma entidade ou value object.

```python
class PoliticaDeFrete:
    def calcular(self, pedido: Pedido, cep: str) -> Dinheiro:
        if pedido.total.valor >= Decimal("300"):
            return Dinheiro(Decimal("0"))

        if cep.startswith("01"):
            return Dinheiro(Decimal("15.00"))

        return Dinheiro(Decimal("30.00"))
```

Serviço de domínio contém regra de negócio, mas não deve orquestrar banco, HTTP e filas. Isso é papel da aplicação.

---

## Serviço de Aplicação

Coordena caso de uso:

```python
class ConfirmarPedido:
    def __init__(self, pedidos, pagamentos, eventos):
        self.pedidos = pedidos
        self.pagamentos = pagamentos
        self.eventos = eventos

    def executar(self, pedido_id: UUID) -> None:
        pedido = self.pedidos.obter(pedido_id)
        pedido.confirmar()

        autorizacao = self.pagamentos.autorizar(pedido.id, pedido.total)
        if not autorizacao.aprovada:
            pedido.cancelar("pagamento recusado")

        self.pedidos.salvar(pedido)
        self.eventos.publicar_todos(pedido.eventos)
```

Serviço de aplicação fala com repositórios, gateways e transações. Ele não deve esconder regra que pertence ao domínio.

---

## Repositório

Repository abstrai persistência de agregados.

```python
from typing import Protocol


class PedidoRepository(Protocol):
    def obter(self, pedido_id: UUID) -> Pedido:
        ...

    def salvar(self, pedido: Pedido) -> None:
        ...
```

Implementação com ORM fica fora do domínio:

```python
class SqlAlchemyPedidoRepository:
    def __init__(self, session):
        self.session = session

    def obter(self, pedido_id: UUID) -> Pedido:
        model = self.session.get(PedidoModel, pedido_id)
        return mapear_model_para_dominio(model)

    def salvar(self, pedido: Pedido) -> None:
        model = mapear_dominio_para_model(pedido)
        self.session.merge(model)
```

O domínio não precisa importar SQLAlchemy.

---

## Eventos de Domínio

Evento de domínio representa algo relevante que aconteceu.

```python
from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class PedidoConfirmado:
    pedido_id: UUID
    cliente_id: UUID
    total: Dinheiro
    occurred_at: datetime
```

Entidade registrando evento:

```python
def confirmar(self) -> None:
    if not self.itens:
        raise ValueError("Pedido sem itens")

    self.status = "confirmado"
    self.eventos.append(
        PedidoConfirmado(
            pedido_id=self.id,
            cliente_id=self.cliente_id,
            total=self.total,
            occurred_at=datetime.utcnow(),
        )
    )
```

Eventos ajudam a desacoplar efeitos colaterais como email, nota fiscal e analytics.

---

## Bounded Context

Bounded Context é um limite onde uma linguagem e um modelo são consistentes.

Exemplo:

```text
Contexto de Vendas
  Pedido significa intenção de compra

Contexto de Logística
  Pedido significa pacote a separar e entregar

Contexto Financeiro
  Pedido pode ser uma obrigação de cobrança
```

Não force um único modelo universal. O mesmo termo pode ter significado diferente em contextos diferentes.

---

## Context Map

Context Map descreve relações entre contextos.

```text
Catalogo -> Vendas: fornecedor de dados de produto
Vendas -> Pagamentos: solicita autorizacao
Vendas -> Logistica: publica pedido confirmado
Financeiro -> Vendas: consome eventos para faturamento
```

Padrões comuns:

- **Customer/Supplier**: um contexto fornece contrato para outro;
- **Conformist**: um contexto aceita o modelo de outro;
- **Anti-Corruption Layer**: camada traduz modelo externo para interno;
- **Shared Kernel**: pequena parte compartilhada, com cuidado extremo.

---

## Anti-Corruption Layer

Protege o domínio contra modelos externos.

```python
class GatewayPagamentoExterno:
    def __init__(self, client):
        self.client = client

    def autorizar(self, pedido: Pedido) -> "ResultadoPagamento":
        resposta = self.client.post(
            "/charge",
            json={
                "amount": str(pedido.total.valor),
                "currency": pedido.total.moeda,
                "reference": str(pedido.id),
            },
        )

        return ResultadoPagamento(
            aprovado=resposta["status"] == "approved",
            codigo=resposta.get("authorization_code"),
        )
```

O domínio não precisa conhecer nomes, códigos e inconsistências da API externa.

---

## Quando Usar DDD

Use DDD quando:

- o domínio é complexo;
- regras mudam bastante;
- há especialistas disponíveis;
- linguagem do negócio importa;
- erros de regra custam caro;
- múltiplos contextos existem;
- CRUD simples não representa o problema.

Evite DDD pesado quando:

- o sistema é basicamente cadastro;
- regras são triviais;
- a equipe não entende o domínio;
- camadas extras não trazem clareza;
- a arquitetura vira cerimônia.

---

## Erros Comuns

- chamar qualquer classe de entidade;
- criar repository para tudo sem necessidade;
- anemizar o domínio com getters e setters;
- colocar regra de negócio em service genérico;
- misturar ORM com domínio sem critério;
- ignorar bounded contexts;
- modelar banco antes de modelar comportamento;
- transformar DDD em excesso de abstrações.

---

## Checklist Avançado

- O código usa a linguagem real do negócio?
- Entidades protegem invariantes?
- Value Objects eliminam validações repetidas?
- Agregados têm limites pequenos e consistentes?
- Serviços de aplicação não escondem regra de domínio?
- Repositories persistem agregados, não tabelas soltas?
- Contextos têm fronteiras claras?
- Integrações externas passam por camada anticorrupção?

DDD é uma ferramenta para dominar complexidade de negócio. O resultado esperado não é mais camadas, mas um modelo que torna regras importantes explícitas, testáveis e evolutivas.

