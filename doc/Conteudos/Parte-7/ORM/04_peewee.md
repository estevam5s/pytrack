# Peewee: ORM Leve, Simples e Poderoso

Peewee é um ORM pequeno, direto e produtivo. Ele é uma boa escolha para scripts, CLIs, aplicações pequenas e médias, serviços internos e projetos que querem menos abstração que SQLAlchemy ou Django ORM.

Apesar de simples, Peewee suporta relacionamentos, transações, migrations, consultas compostas, agregações, joins e integração com SQLite, PostgreSQL e MySQL.

---

## Instalação

```bash
pip install peewee psycopg2-binary
```

Para SQLite, basta:

```bash
pip install peewee
```

---

## Banco e Model Base

```python
from peewee import *


db = SqliteDatabase("app.db")


class BaseModel(Model):
    class Meta:
        database = db
```

PostgreSQL:

```python
db = PostgresqlDatabase(
    "app",
    user="user",
    password="pass",
    host="localhost",
    port=5432,
)
```

---

## Models

```python
class Cliente(BaseModel):
    nome = CharField(max_length=120)
    email = CharField(max_length=160, unique=True)
    ativo = BooleanField(default=True)
    criado_em = DateTimeField(constraints=[SQL("DEFAULT CURRENT_TIMESTAMP")])


class Pedido(BaseModel):
    cliente = ForeignKeyField(Cliente, backref="pedidos", on_delete="RESTRICT")
    status = CharField(max_length=30, default="aberto")
    total = DecimalField(max_digits=12, decimal_places=2)
```

Criando tabelas:

```python
db.connect()
db.create_tables([Cliente, Pedido])
```

---

## CRUD Básico

Create:

```python
cliente = Cliente.create(nome="Ana Souza", email="ana@example.com")
```

Read:

```python
cliente = Cliente.get_or_none(Cliente.email == "ana@example.com")
clientes = Cliente.select().where(Cliente.ativo == True).order_by(Cliente.nome)
```

Update:

```python
cliente.nome = "Ana Maria"
cliente.save()
```

Update em massa:

```python
Cliente.update(ativo=True).where(Cliente.ativo == False).execute()
```

Delete:

```python
cliente.delete_instance()
```

---

## Consultas

```python
query = (
    Cliente
    .select()
    .where(Cliente.nome.contains("Ana"))
    .order_by(Cliente.nome)
    .limit(20)
)

for cliente in query:
    print(cliente.nome)
```

Selecionando colunas:

```python
query = Cliente.select(Cliente.id, Cliente.email).where(Cliente.ativo == True)
```

---

## Joins

```python
query = (
    Pedido
    .select(Pedido, Cliente)
    .join(Cliente)
    .where(Pedido.status == "pago")
)

for pedido in query:
    print(pedido.cliente.nome, pedido.total)
```

Join reverso:

```python
query = (
    Cliente
    .select(Cliente, Pedido)
    .join(Pedido)
    .where(Pedido.total > 100)
)
```

---

## Agregações

```python
query = (
    Cliente
    .select(
        Cliente,
        fn.COUNT(Pedido.id).alias("quantidade_pedidos"),
        fn.SUM(Pedido.total).alias("total_gasto"),
    )
    .join(Pedido, JOIN.LEFT_OUTER)
    .group_by(Cliente)
)

for cliente in query:
    print(cliente.nome, cliente.quantidade_pedidos, cliente.total_gasto)
```

---

## Evitando N+1

Problema:

```python
for pedido in Pedido.select():
    print(pedido.cliente.nome)
```

Solução:

```python
query = Pedido.select(Pedido, Cliente).join(Cliente)
for pedido in query:
    print(pedido.cliente.nome)
```

Para coleções, use `prefetch`:

```python
from peewee import prefetch


clientes = Cliente.select()
pedidos = Pedido.select()

for cliente in prefetch(clientes, pedidos):
    print(cliente.nome, list(cliente.pedidos))
```

---

## Transações

```python
with db.atomic():
    cliente = Cliente.create(nome="Bruno", email="bruno@example.com")
    Pedido.create(cliente=cliente, status="aberto", total=100)
```

Rollback automático em exceção.

Savepoint:

```python
with db.atomic() as txn:
    try:
        Cliente.create(nome="Duplicado", email="ana@example.com")
    except IntegrityError:
        txn.rollback()
```

---

## Índices e Constraints

```python
class Produto(BaseModel):
    sku = CharField(unique=True)
    nome = CharField(index=True)
    preco = DecimalField(max_digits=12, decimal_places=2)

    class Meta:
        indexes = (
            (("nome", "preco"), False),
        )
        constraints = [Check("preco >= 0")]
```

---

## Migrations

Peewee tem módulo de migrations:

```python
from playhouse.migrate import SqliteMigrator, migrate


migrator = SqliteMigrator(db)

migrate(
    migrator.add_column("cliente", "telefone", CharField(max_length=30, null=True)),
)
```

Em projetos maiores, organize migrations em arquivos versionados e execute por ferramenta própria do projeto.

---

## Conexões em Aplicações Web

```python
def before_request():
    db.connect(reuse_if_open=True)


def after_request():
    if not db.is_closed():
        db.close()
```

Use pool em produção:

```python
from playhouse.pool import PooledPostgresqlDatabase


db = PooledPostgresqlDatabase(
    "app",
    max_connections=20,
    stale_timeout=300,
    user="user",
    password="pass",
)
```

---

## Quando Peewee é Boa Escolha

- scripts com persistência;
- CLIs;
- aplicações pequenas;
- serviços internos;
- protótipos que podem crescer moderadamente;
- equipes que querem ORM simples e SQL próximo.

Para domínios muito grandes, SQLAlchemy ou Django ORM podem oferecer ecossistema mais amplo.

---

## Checklist Profissional

- conexão abre e fecha corretamente?
- há transações em operações compostas?
- queries evitam N+1?
- índices e constraints estão definidos?
- migrations são versionadas?
- erros de integridade são tratados?
- queries críticas foram medidas?
- modelos não misturam regra demais?
- pool está configurado em produção?
- SQL raw é usado quando melhora clareza ou performance?

