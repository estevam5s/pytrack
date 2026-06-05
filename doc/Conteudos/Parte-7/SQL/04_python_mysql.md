# Conexão Python com MySQL: Drivers, SQLAlchemy e Segurança

Aplicações Python acessam MySQL por drivers diretos ou por camadas como SQLAlchemy. O ponto mais importante é manter conexão segura, queries parametrizadas, tratamento de erro, controle de transação e configuração fora do código.

---

## Opções de Driver

Principais opções:

- `mysql-connector-python`: driver oficial Oracle, simples de instalar.
- `PyMySQL`: driver puro Python, usado com SQLAlchemy.
- `mysqlclient`: wrapper C, performático, exige bibliotecas nativas.
- `SQLAlchemy`: toolkit/ORM que usa drivers por baixo.

Para aprender SQL, driver direto ajuda. Para aplicações maiores, SQLAlchemy costuma organizar melhor.

---

## Configuração por Ambiente

`.env`:

```bash
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=usuario
MYSQL_PASSWORD=senha123
MYSQL_DATABASE=empresa
```

Leitura:

```python
from dataclasses import dataclass
import os

from dotenv import load_dotenv

load_dotenv()


@dataclass(frozen=True)
class DatabaseSettings:
    host: str
    port: int
    user: str
    password: str
    database: str


def get_database_settings() -> DatabaseSettings:
    return DatabaseSettings(
        host=os.environ["MYSQL_HOST"],
        port=int(os.getenv("MYSQL_PORT", "3306")),
        user=os.environ["MYSQL_USER"],
        password=os.environ["MYSQL_PASSWORD"],
        database=os.environ["MYSQL_DATABASE"],
    )
```

Nunca coloque credenciais fixas no código.

---

## Conexão com mysql-connector-python

```python
import mysql.connector
from mysql.connector import Error


def conectar_mysql():
    settings = get_database_settings()
    try:
        return mysql.connector.connect(
            host=settings.host,
            port=settings.port,
            user=settings.user,
            password=settings.password,
            database=settings.database,
        )
    except Error as exc:
        raise RuntimeError(f"Erro ao conectar ao MySQL: {exc}") from exc
```

Uso:

```python
conexao = conectar_mysql()
try:
    cursor = conexao.cursor(dictionary=True)
    cursor.execute("SELECT id, nome, email FROM funcionarios")
    funcionarios = cursor.fetchall()
finally:
    cursor.close()
    conexao.close()
```

---

## Query Parametrizada

Nunca monte SQL com f-string quando houver entrada externa.

Errado:

```python
query = f"SELECT * FROM funcionarios WHERE email = '{email}'"
cursor.execute(query)
```

Correto:

```python
query = "SELECT id, nome, email FROM funcionarios WHERE email = %s"
cursor.execute(query, (email,))
```

Isso evita SQL Injection e problemas de escaping.

---

## INSERT, UPDATE e DELETE

```python
def criar_funcionario(conexao, dados: dict) -> int:
    query = """
        INSERT INTO funcionarios
            (departamento_id, nome, email, cargo, salario, data_contratacao)
        VALUES
            (%s, %s, %s, %s, %s, %s)
    """

    cursor = conexao.cursor()
    try:
        cursor.execute(
            query,
            (
                dados["departamento_id"],
                dados["nome"],
                dados["email"],
                dados["cargo"],
                dados["salario"],
                dados["data_contratacao"],
            ),
        )
        conexao.commit()
        return cursor.lastrowid
    except Exception:
        conexao.rollback()
        raise
    finally:
        cursor.close()
```

Toda escrita relacionada deve ter commit/rollback claro.

---

## Context Manager

```python
from contextlib import contextmanager


@contextmanager
def mysql_connection():
    conexao = conectar_mysql()
    try:
        yield conexao
    finally:
        conexao.close()
```

Transação:

```python
@contextmanager
def transaction():
    with mysql_connection() as conexao:
        try:
            yield conexao
            conexao.commit()
        except Exception:
            conexao.rollback()
            raise
```

Uso:

```python
with transaction() as conexao:
    cursor = conexao.cursor()
    cursor.execute("UPDATE funcionarios SET salario = salario * 1.1 WHERE id = %s", (1,))
```

---

## SQLAlchemy Engine

```python
from sqlalchemy import create_engine, text


def create_mysql_engine():
    settings = get_database_settings()
    url = (
        f"mysql+pymysql://{settings.user}:{settings.password}"
        f"@{settings.host}:{settings.port}/{settings.database}"
    )
    return create_engine(
        url,
        pool_pre_ping=True,
        pool_size=5,
        max_overflow=10,
        echo=False,
    )
```

`pool_pre_ping=True` ajuda a evitar conexões mortas reaproveitadas.

---

## SQLAlchemy Core

```python
engine = create_mysql_engine()

with engine.connect() as conn:
    result = conn.execute(
        text("SELECT id, nome FROM funcionarios WHERE departamento_id = :departamento_id"),
        {"departamento_id": 1},
    )
    funcionarios = result.mappings().all()
```

Para escrita:

```python
with engine.begin() as conn:
    conn.execute(
        text("""
            UPDATE funcionarios
            SET salario = salario * :fator
            WHERE departamento_id = :departamento_id
        """),
        {"fator": 1.10, "departamento_id": 1},
    )
```

`engine.begin()` abre transação e faz commit/rollback automaticamente.

---

## SQLAlchemy ORM

```python
from datetime import date
from decimal import Decimal

from sqlalchemy import Date, ForeignKey, Numeric, String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship, sessionmaker


class Base(DeclarativeBase):
    pass


class Departamento(Base):
    __tablename__ = "departamentos"

    id: Mapped[int] = mapped_column(primary_key=True)
    nome: Mapped[str] = mapped_column(String(100), unique=True)
    funcionarios: Mapped[list["Funcionario"]] = relationship(back_populates="departamento")


class Funcionario(Base):
    __tablename__ = "funcionarios"

    id: Mapped[int] = mapped_column(primary_key=True)
    departamento_id: Mapped[int | None] = mapped_column(ForeignKey("departamentos.id"))
    nome: Mapped[str] = mapped_column(String(150))
    email: Mapped[str] = mapped_column(String(150), unique=True)
    salario: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    data_contratacao: Mapped[date] = mapped_column(Date)

    departamento: Mapped[Departamento | None] = relationship(back_populates="funcionarios")
```

Session:

```python
engine = create_mysql_engine()
SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)
```

Uso:

```python
with SessionLocal() as session:
    funcionario = session.get(Funcionario, 1)
```

---

## Pool de Conexões

Cada processo pode abrir várias conexões. Em web apps, calcule:

```text
workers x pool_size + max_overflow
```

Se você tem 4 workers e pool 10, pode abrir 40 conexões ou mais. Isso pode derrubar MySQL.

Configure pool de acordo com:

- limite do banco;
- número de instâncias;
- concorrência;
- tempo médio de query;
- uso de workers.

---

## Tratamento de Erros

Erros comuns:

- conexão recusada;
- credencial errada;
- tabela inexistente;
- constraint violada;
- deadlock;
- timeout;
- duplicate key.

Capture quando há ação útil:

```python
from mysql.connector import IntegrityError


try:
    criar_funcionario(conexao, dados)
except IntegrityError as exc:
    raise ValueError("Email ja cadastrado") from exc
```

Não engula exceções silenciosamente.

---

## Segurança

- use queries parametrizadas;
- valide entrada na aplicação;
- não exponha credenciais;
- use usuário de banco com menor privilégio;
- configure TLS quando necessário;
- registre erros sem vazar senha;
- evite retornar erro SQL cru para usuário;
- não aceite nomes de tabela/coluna diretamente do usuário sem allowlist.

Allowlist:

```python
ORDER_COLUMNS = {"nome", "salario", "data_contratacao"}

if order_by not in ORDER_COLUMNS:
    raise ValueError("Ordenacao invalida")
```

Parâmetros protegem valores, não identificadores SQL.

---

## Checklist

- Credenciais vêm de ambiente?
- Queries usam parâmetros?
- Conexões são fechadas?
- Transações fazem rollback em erro?
- Pool é compatível com capacidade do banco?
- Erros são traduzidos sem vazar detalhes?
- SQLAlchemy é usado com `text()` e parâmetros nomeados?
- Usuário do banco tem menor privilégio?

Python com MySQL exige disciplina em segurança, transação e ciclo de vida de conexão. O código mais importante não é só o que consulta, mas o que fecha, desfaz e protege.

