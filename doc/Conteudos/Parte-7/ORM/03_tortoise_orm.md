# Tortoise ORM: Async ORM para APIs Modernas

Tortoise ORM é um ORM assíncrono inspirado no Django ORM. Ele é comum em aplicações async com FastAPI, Starlette, aiohttp e serviços que usam drivers assíncronos para PostgreSQL, MySQL e SQLite.

Use Tortoise quando a aplicação já é async e você quer uma API simples para models, relações e consultas. Não use async apenas por moda: ele traz benefícios quando há muitas operações de I/O concorrentes.

---

## Instalação

```bash
pip install tortoise-orm asyncpg aerich
```

- `asyncpg`: driver PostgreSQL async.
- `aerich`: ferramenta de migrations para Tortoise.

---

## Model Básico

```python
from tortoise import fields, models


class Cliente(models.Model):
    id = fields.IntField(pk=True)
    nome = fields.CharField(max_length=120)
    email = fields.CharField(max_length=160, unique=True)
    ativo = fields.BooleanField(default=True)
    criado_em = fields.DatetimeField(auto_now_add=True)
    atualizado_em = fields.DatetimeField(auto_now=True)

    pedidos: fields.ReverseRelation["Pedido"]

    def __str__(self) -> str:
        return self.nome
```

---

## Relacionamentos

```python
class Pedido(models.Model):
    id = fields.IntField(pk=True)
    cliente = fields.ForeignKeyField(
        "models.Cliente",
        related_name="pedidos",
        on_delete=fields.RESTRICT,
    )
    status = fields.CharField(max_length=30, default="aberto")
    total = fields.DecimalField(max_digits=12, decimal_places=2)
    criado_em = fields.DatetimeField(auto_now_add=True)
```

Many-to-many:

```python
class Grupo(models.Model):
    id = fields.IntField(pk=True)
    nome = fields.CharField(max_length=80)


class Usuario(models.Model):
    id = fields.IntField(pk=True)
    nome = fields.CharField(max_length=120)
    grupos = fields.ManyToManyField("models.Grupo", related_name="usuarios")
```

---

## Inicialização

```python
from tortoise import Tortoise


async def init_db() -> None:
    await Tortoise.init(
        db_url="postgres://user:pass@localhost:5432/app",
        modules={"models": ["app.models"]},
    )
    await Tortoise.generate_schemas()
```

`generate_schemas` é útil em desenvolvimento e testes. Para produção, use migrations.

---

## Integração com FastAPI

```python
from fastapi import FastAPI
from tortoise.contrib.fastapi import register_tortoise


app = FastAPI()

register_tortoise(
    app,
    db_url="postgres://user:pass@localhost:5432/app",
    modules={"models": ["app.models"]},
    generate_schemas=False,
    add_exception_handlers=True,
)
```

---

## CRUD Básico

Create:

```python
cliente = await Cliente.create(nome="Ana Souza", email="ana@example.com")
```

Read:

```python
cliente = await Cliente.get_or_none(id=1)
clientes = await Cliente.filter(ativo=True).order_by("nome").limit(20)
```

Update:

```python
cliente.nome = "Ana Maria"
await cliente.save(update_fields=["nome", "atualizado_em"])
```

Update em massa:

```python
await Cliente.filter(ativo=False).update(ativo=True)
```

Delete:

```python
await cliente.delete()
```

---

## Filtros

```python
await Cliente.filter(nome__icontains="ana")
await Cliente.filter(email__iexact="ana@example.com")
await Pedido.filter(total__gte=100, status="pago")
await Pedido.exclude(status="cancelado")
```

Paginação:

```python
clientes = await Cliente.filter(ativo=True).order_by("id").offset(40).limit(20)
```

Para alta escala, prefira keyset:

```python
clientes = await Cliente.filter(ativo=True, id__gt=ultimo_id).order_by("id").limit(20)
```

---

## Relações e Prefetch

```python
pedido = await Pedido.get(id=10).select_related("cliente")
print(pedido.cliente.nome)
```

Coleções:

```python
clientes = await Cliente.filter(ativo=True).prefetch_related("pedidos")
for cliente in clientes:
    print(cliente.pedidos)
```

Use `select_related` para ForeignKey e `prefetch_related` para coleções.

---

## Agregações

```python
from tortoise.functions import Count, Sum


clientes = await Cliente.annotate(
    quantidade_pedidos=Count("pedidos"),
    total_gasto=Sum("pedidos__total"),
).filter(ativo=True)
```

---

## Transações

```python
from tortoise.transactions import in_transaction


async def criar_pedido(cliente_id: int, itens: list[dict]) -> Pedido:
    async with in_transaction():
        pedido = await Pedido.create(cliente_id=cliente_id, status="aberto", total=0)
        total = 0

        for item in itens:
            total += item["quantidade"] * item["preco_unitario"]
            await ItemPedido.create(
                pedido=pedido,
                produto_id=item["produto_id"],
                quantidade=item["quantidade"],
                preco_unitario=item["preco_unitario"],
            )

        pedido.total = total
        await pedido.save(update_fields=["total"])
        return pedido
```

Transações são essenciais para operações compostas.

---

## Migrations com Aerich

Configuração típica:

```python
TORTOISE_ORM = {
    "connections": {"default": "postgres://user:pass@localhost:5432/app"},
    "apps": {
        "models": {
            "models": ["app.models", "aerich.models"],
            "default_connection": "default",
        }
    },
}
```

Comandos:

```bash
aerich init -t app.config.TORTOISE_ORM
aerich init-db
aerich migrate --name add_clientes
aerich upgrade
```

Revise migrations em projetos críticos.

---

## Pydantic e APIs

```python
from tortoise.contrib.pydantic import pydantic_model_creator


ClienteOut = pydantic_model_creator(Cliente, name="ClienteOut")
```

Em APIs maiores, muitas equipes preferem schemas Pydantic escritos manualmente para controlar contrato público.

---

## Consultas Raw

```python
rows = await Cliente.raw("""
    SELECT id, nome, email
    FROM clientes
    WHERE ativo = TRUE
    ORDER BY nome
""")
```

Use raw SQL quando a consulta fica mais clara ou quando o ORM não expressa bem a operação.

---

## Boas Práticas Async

- não use bibliotecas bloqueantes dentro de rotas async;
- configure pool de conexões corretamente;
- mantenha transações curtas;
- evite lazy loading inesperado em loops;
- use timeouts em chamadas externas;
- monitore número de conexões;
- não crie conexão por requisição manualmente se o framework já gerencia.

---

## Checklist Profissional

- o projeto realmente se beneficia de async?
- migrations estão configuradas?
- relações críticas usam `select_related` ou `prefetch_related`?
- transações protegem operações compostas?
- schemas de API não expõem campos internos?
- raw SQL é parametrizado quando recebe entrada externa?
- pool de conexões está adequado?
- testes async cobrem persistência?
- há índices no banco para filtros reais?
- a aplicação não mistura sync bloqueante com async indiscriminadamente?

