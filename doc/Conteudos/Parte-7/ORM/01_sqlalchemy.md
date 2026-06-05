# SQLAlchemy: Core, ORM, Sessions e Arquitetura

SQLAlchemy é uma das bibliotecas mais completas do ecossistema Python para trabalhar com bancos relacionais. Ela oferece duas camadas principais:

- **SQLAlchemy Core**: construção explícita de SQL com objetos Python.
- **SQLAlchemy ORM**: mapeamento de classes Python para tabelas relacionais.

SQLAlchemy é poderoso porque permite ir do CRUD simples até arquiteturas robustas com Unit of Work, repositories, transações, migrations com Alembic e controle fino de performance.

---

## Instalação

```bash
pip install sqlalchemy psycopg[binary] alembic
```

Para SQLite, nenhuma dependência extra é necessária além do SQLAlchemy.

---

## Engine e Conexão

```python
from sqlalchemy import create_engine, text


engine = create_engine("sqlite:///app.db", echo=True)

with engine.connect() as conn:
    result = conn.execute(text("SELECT 1"))
    print(result.scalar_one())
```

Conceitos:

- `Engine`: gerencia conexões e pool.
- `Connection`: representa uma conexão ativa.
- `text`: permite SQL textual parametrizado.
- `echo=True`: mostra SQL gerado, útil em estudo.

---

## Declarative Mapping

```python
from sqlalchemy import String, Numeric, ForeignKey
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class Cliente(Base):
    __tablename__ = "clientes"

    id: Mapped[int] = mapped_column(primary_key=True)
    nome: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(160), unique=True, nullable=False)

    pedidos: Mapped[list["Pedido"]] = relationship(back_populates="cliente")


class Pedido(Base):
    __tablename__ = "pedidos"

    id: Mapped[int] = mapped_column(primary_key=True)
    cliente_id: Mapped[int] = mapped_column(ForeignKey("clientes.id"), nullable=False)
    total: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    status: Mapped[str] = mapped_column(String(30), nullable=False, default="aberto")

    cliente: Mapped[Cliente] = relationship(back_populates="pedidos")
```

Esse estilo com `Mapped` e `mapped_column` é o padrão moderno do SQLAlchemy 2.x.

---

## Criando Tabelas

```python
engine = create_engine("sqlite:///app.db")
Base.metadata.create_all(engine)
```

Em produção, prefira migrations com Alembic. `create_all` é útil em protótipos, testes e exemplos.

---

## Session

```python
from sqlalchemy.orm import Session


with Session(engine) as session:
    cliente = Cliente(nome="Ana Souza", email="ana@example.com")
    session.add(cliente)
    session.commit()
```

A `Session`:

- rastreia objetos carregados;
- agrupa alterações;
- controla transações;
- executa flush antes do commit quando necessário.

---

## CRUD Básico

Create:

```python
with Session(engine) as session:
    cliente = Cliente(nome="Bruno Lima", email="bruno@example.com")
    session.add(cliente)
    session.commit()
    session.refresh(cliente)
    print(cliente.id)
```

Read:

```python
from sqlalchemy import select


with Session(engine) as session:
    stmt = select(Cliente).where(Cliente.email == "bruno@example.com")
    cliente = session.execute(stmt).scalar_one_or_none()
```

Update:

```python
with Session(engine) as session:
    cliente = session.get(Cliente, 1)
    if cliente:
        cliente.nome = "Bruno Rocha"
        session.commit()
```

Delete:

```python
with Session(engine) as session:
    cliente = session.get(Cliente, 1)
    if cliente:
        session.delete(cliente)
        session.commit()
```

---

## Consultas com Select

```python
stmt = (
    select(Cliente)
    .where(Cliente.nome.ilike("ana%"))
    .order_by(Cliente.nome)
    .limit(20)
)

with Session(engine) as session:
    clientes = session.execute(stmt).scalars().all()
```

Selecionando colunas:

```python
stmt = select(Cliente.id, Cliente.email).where(Cliente.email.ilike("%@example.com"))
rows = session.execute(stmt).all()
```

---

## Joins

```python
stmt = (
    select(Cliente.nome, Pedido.id, Pedido.total)
    .join(Pedido, Pedido.cliente_id == Cliente.id)
    .where(Pedido.status == "pago")
)

rows = session.execute(stmt).all()
```

Com relacionamento:

```python
stmt = select(Pedido).join(Pedido.cliente).where(Cliente.email == "ana@example.com")
pedidos = session.execute(stmt).scalars().all()
```

---

## Evitando N+1 Queries

Problema:

```python
clientes = session.execute(select(Cliente)).scalars().all()
for cliente in clientes:
    print(cliente.pedidos)  # pode gerar uma query por cliente
```

Solução com `selectinload`:

```python
from sqlalchemy.orm import selectinload


stmt = select(Cliente).options(selectinload(Cliente.pedidos))
clientes = session.execute(stmt).scalars().all()
```

Solução com `joinedload`:

```python
from sqlalchemy.orm import joinedload


stmt = select(Cliente).options(joinedload(Cliente.pedidos))
clientes = session.execute(stmt).unique().scalars().all()
```

Use:

- `selectinload` para coleções;
- `joinedload` para relações 1:1 ou N:1;
- `lazy="raise"` em projetos rigorosos para detectar lazy loading acidental.

---

## Transações

```python
with Session(engine) as session:
    with session.begin():
        cliente = Cliente(nome="Carla", email="carla@example.com")
        session.add(cliente)
        session.add(Pedido(cliente=cliente, total=150, status="aberto"))
```

Se houver exceção, a transação é revertida.

---

## Constraints e Índices

```python
from sqlalchemy import Index, UniqueConstraint


class Produto(Base):
    __tablename__ = "produtos"
    __table_args__ = (
        UniqueConstraint("sku", name="uq_produtos_sku"),
        Index("idx_produtos_nome", "nome"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    sku: Mapped[str] = mapped_column(String(40), nullable=False)
    nome: Mapped[str] = mapped_column(String(120), nullable=False)
```

Defina constraints no banco, não apenas em validações Python.

---

## Alembic

Inicialização:

```bash
alembic init migrations
```

Criar migration:

```bash
alembic revision --autogenerate -m "create clientes pedidos"
```

Aplicar:

```bash
alembic upgrade head
```

Boas práticas:

- revise migrations autogeradas;
- não edite banco manualmente em produção;
- mantenha migrations pequenas;
- teste downgrade quando sua equipe usa rollback;
- cuidado com alterações destrutivas em tabelas grandes.

---

## Repository Pattern

```python
class ClienteRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def adicionar(self, cliente: Cliente) -> None:
        self.session.add(cliente)

    def buscar_por_email(self, email: str) -> Cliente | None:
        stmt = select(Cliente).where(Cliente.email == email)
        return self.session.execute(stmt).scalar_one_or_none()

    def listar_ativos(self, limite: int = 50) -> list[Cliente]:
        stmt = select(Cliente).order_by(Cliente.id).limit(limite)
        return list(self.session.execute(stmt).scalars())
```

Repository ajuda a isolar persistência, mas não deve virar camada inútil que apenas repete todos os métodos do ORM.

---

## Unit of Work

```python
class UnitOfWork:
    def __init__(self, session_factory) -> None:
        self.session_factory = session_factory

    def __enter__(self):
        self.session = self.session_factory()
        self.clientes = ClienteRepository(self.session)
        return self

    def __exit__(self, exc_type, exc, tb):
        if exc_type:
            self.session.rollback()
        else:
            self.session.commit()
        self.session.close()
```

Uso:

```python
with UnitOfWork(SessionLocal) as uow:
    uow.clientes.adicionar(Cliente(nome="Ana", email="ana@example.com"))
```

---

## Async SQLAlchemy

```python
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker


engine = create_async_engine("postgresql+psycopg://user:pass@localhost/db")
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)


async def listar_clientes():
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(Cliente).order_by(Cliente.id))
        return result.scalars().all()
```

Use async quando sua aplicação é async de ponta a ponta. Não misture sem necessidade.

---

## Checklist Profissional

- sessions são curtas e por request/tarefa?
- transações envolvem operações consistentes?
- migrations são versionadas?
- constraints estão no banco?
- N+1 queries são monitoradas?
- queries críticas foram analisadas com `EXPLAIN`?
- relacionamentos têm estratégia de loading explícita?
- modelos não carregam regra de negócio excessiva?
- camada de persistência é testável?
- conexões usam pool adequado para o ambiente?

