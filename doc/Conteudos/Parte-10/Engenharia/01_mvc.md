# MVC: Model-View-Controller na Prática

MVC significa Model-View-Controller. É um padrão de organização que separa dados e regras, apresentação e fluxo de entrada. Ele aparece em frameworks web, aplicações desktop e sistemas com interface gráfica.

Em backend Python, MVC costuma ser adaptado. Em Django, por exemplo, a nomenclatura real se aproxima de MTV: Model, Template e View. Em APIs com FastAPI ou Flask, a "View" frequentemente vira resposta JSON, e o Controller aparece como endpoint/handler.

---

## Problema que o MVC Resolve

Sem separação, uma função pode misturar validação, SQL, regra de negócio, HTML, autenticação e formatação de resposta:

```python
def criar_pedido(request):
    cliente_id = request.form["cliente_id"]
    itens = request.form.getlist("itens")
    total = 0

    for item in itens:
        preco = db.execute("select preco from produtos where id = ?", [item]).fetchone()
        total += preco["preco"]

    db.execute(
        "insert into pedidos (cliente_id, total, status) values (?, ?, ?)",
        [cliente_id, total, "criado"],
    )

    return render_template("pedido_ok.html", total=total)
```

O código funciona, mas fica difícil testar, mudar e reutilizar. MVC força uma divisão:

- **Model**: dados, persistência e regras próximas ao estado.
- **View**: representação para o usuário ou cliente.
- **Controller**: recebe entrada, chama o modelo/casos de uso e escolhe resposta.

---

## Model

O Model representa o estado e, dependendo do estilo usado, também regras de negócio.

Exemplo simples com dataclass:

```python
from dataclasses import dataclass
from decimal import Decimal


@dataclass
class ItemPedido:
    produto_id: int
    quantidade: int
    preco_unitario: Decimal

    @property
    def subtotal(self) -> Decimal:
        return self.preco_unitario * self.quantidade


@dataclass
class Pedido:
    cliente_id: int
    itens: list[ItemPedido]
    status: str = "rascunho"

    @property
    def total(self) -> Decimal:
        return sum((item.subtotal for item in self.itens), Decimal("0"))

    def confirmar(self) -> None:
        if not self.itens:
            raise ValueError("Pedido sem itens nao pode ser confirmado")
        self.status = "confirmado"
```

Esse modelo não depende de HTTP, HTML ou banco. A regra de confirmação fica perto do dado que ela protege.

---

## View

A View transforma dados em uma representação.

Em aplicação web tradicional:

```html
<h1>Pedido confirmado</h1>
<p>Total: {{ total }}</p>
```

Em API:

```python
def pedido_response(pedido: Pedido) -> dict:
    return {
        "cliente_id": pedido.cliente_id,
        "total": str(pedido.total),
        "status": pedido.status,
        "itens": [
            {
                "produto_id": item.produto_id,
                "quantidade": item.quantidade,
                "subtotal": str(item.subtotal),
            }
            for item in pedido.itens
        ],
    }
```

View não deve decidir regra de negócio. Ela pode formatar, traduzir campos e adaptar saída.

---

## Controller

O Controller coordena a entrada:

```python
from decimal import Decimal
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class ItemEntrada(BaseModel):
    produto_id: int
    quantidade: int
    preco_unitario: Decimal


class CriarPedidoEntrada(BaseModel):
    cliente_id: int
    itens: list[ItemEntrada]


@router.post("/pedidos")
def criar_pedido(payload: CriarPedidoEntrada) -> dict:
    pedido = Pedido(
        cliente_id=payload.cliente_id,
        itens=[
            ItemPedido(
                produto_id=item.produto_id,
                quantidade=item.quantidade,
                preco_unitario=item.preco_unitario,
            )
            for item in payload.itens
        ],
    )
    pedido.confirmar()
    return pedido_response(pedido)
```

O endpoint valida entrada HTTP, monta objetos e retorna resposta. A regra principal continua no Model.

---

## MVC em Django

Django usa:

- **Model**: classes ORM.
- **Template**: HTML.
- **View**: função ou classe que recebe request e retorna response.

Exemplo:

```python
from django.db import models


class Pedido(models.Model):
    cliente_id = models.IntegerField()
    total = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=30, default="rascunho")

    def confirmar(self) -> None:
        if self.total <= 0:
            raise ValueError("Pedido sem valor nao pode ser confirmado")
        self.status = "confirmado"
```

View Django:

```python
from django.shortcuts import get_object_or_404, render


def detalhe_pedido(request, pedido_id: int):
    pedido = get_object_or_404(Pedido, id=pedido_id)
    return render(request, "pedidos/detalhe.html", {"pedido": pedido})
```

Em projetos pequenos, isso é suficiente. Em projetos grandes, colocar regra demais em models Django pode gerar acoplamento forte ao ORM.

---

## MVC em APIs

Em APIs, a View costuma ser um serializer/schema:

```python
from pydantic import BaseModel


class PedidoSaida(BaseModel):
    cliente_id: int
    total: str
    status: str
```

Controller:

```python
@router.get("/pedidos/{pedido_id}", response_model=PedidoSaida)
def obter_pedido(pedido_id: int) -> PedidoSaida:
    pedido = repositorio.buscar(pedido_id)
    return PedidoSaida(
        cliente_id=pedido.cliente_id,
        total=str(pedido.total),
        status=pedido.status,
    )
```

O erro comum é transformar endpoint em "deus": ele valida, calcula, consulta banco, envia email e formata resposta. MVC ajuda a evitar isso.

---

## Camadas Profissionais

Em sistemas maiores, MVC puro geralmente evolui para:

```text
Interface HTTP
    Controller / Router
Aplicacao
    Caso de uso / Service
Dominio
    Entidades / Regras
Infraestrutura
    ORM / Banco / Email / APIs externas
```

Exemplo:

```python
class CriarPedido:
    def __init__(self, pedidos, produtos):
        self.pedidos = pedidos
        self.produtos = produtos

    def executar(self, cliente_id: int, itens: list[dict]) -> Pedido:
        itens_pedido = []
        for item in itens:
            produto = self.produtos.buscar(item["produto_id"])
            itens_pedido.append(
                ItemPedido(
                    produto_id=produto.id,
                    quantidade=item["quantidade"],
                    preco_unitario=produto.preco,
                )
            )

        pedido = Pedido(cliente_id=cliente_id, itens=itens_pedido)
        pedido.confirmar()
        self.pedidos.salvar(pedido)
        return pedido
```

O Controller chama o caso de uso. O caso de uso coordena regra e persistência.

---

## Testes

Teste do Model:

```python
from decimal import Decimal


def test_pedido_total():
    pedido = Pedido(
        cliente_id=1,
        itens=[ItemPedido(10, 2, Decimal("15.00"))],
    )

    assert pedido.total == Decimal("30.00")
```

Teste do Controller deve focar contrato HTTP:

```python
def test_criar_pedido(client):
    response = client.post(
        "/pedidos",
        json={
            "cliente_id": 1,
            "itens": [{"produto_id": 10, "quantidade": 2, "preco_unitario": "15.00"}],
        },
    )

    assert response.status_code == 200
    assert response.json()["status"] == "confirmado"
```

MVC bem aplicado facilita testar regra sem subir servidor.

---

## Quando Usar

Use MVC quando:

- a aplicação tem interface clara;
- o framework já segue esse padrão;
- você quer organização simples e reconhecível;
- o domínio ainda não exige DDD ou hexagonal completa;
- o time precisa de um padrão fácil de entender.

Evite MVC ingênuo quando:

- controllers estão enormes;
- models viraram mistura de ORM, regra, integração e apresentação;
- regras precisam ser reutilizadas fora do HTTP;
- existe muita integração externa;
- testes dependem demais de banco e framework.

---

## Erros Comuns

- colocar regra de negócio na View/template;
- colocar regra demais no Controller;
- deixar Model dependente de request HTTP;
- usar Model apenas como tabela sem comportamento;
- não separar DTOs de entidades;
- retornar objeto ORM diretamente como contrato público;
- confundir organização de pastas com arquitetura.

---

## Checklist Avançado

- Controllers são finos e fáceis de ler?
- Regras importantes estão testadas fora do HTTP?
- Views/serializers apenas transformam dados?
- Models protegem invariantes?
- O banco não vaza como contrato da API?
- Mudanças de interface não quebram regra de negócio?
- Existe separação entre entrada externa e objetos internos?

MVC é um ponto de partida forte. Em sistemas profissionais, ele costuma ser combinado com casos de uso, serviços de aplicação, DDD ou arquitetura hexagonal.

