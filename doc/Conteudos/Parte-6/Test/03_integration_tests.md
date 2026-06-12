# Integration Tests: Banco, APIs, Filas e Serviços Externos

Testes de integração verificam se partes reais do sistema funcionam juntas: aplicação com banco, API com autenticação, repository com SQL, worker com Redis, endpoint com serialização, serviço com HTTP externo simulado.

Eles são mais lentos e caros que unit tests, mas capturam problemas que testes unitários não veem.

---

## O Que Testar em Integração

Bons candidatos:

- queries SQL e migrations;
- repositories reais;
- endpoints HTTP;
- autenticação;
- serialização/deserialização;
- transações;
- cache Redis;
- filas;
- contratos com APIs externas;
- permissões e policies.

---

## Pirâmide de Testes

```text
E2E                 poucos, caros
Integration         alguns, foco em bordas reais
Unit                muitos, rápidos
```

Não transforme tudo em integração. Regra de negócio pura deve ter unit tests.

---

## Testando API FastAPI

```python
from fastapi import FastAPI
from fastapi.testclient import TestClient

app = FastAPI()


@app.get("/health")
def health():
    return {"status": "ok"}


def test_health():
    client = TestClient(app)
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
```

---

## Testando Flask

```python
import pytest
from app import create_app


@pytest.fixture
def client():
    app = create_app("test")
    return app.test_client()


def test_health(client):
    response = client.get("/health")
    assert response.status_code == 200
```

---

## Banco de Dados em Testes

Opções:

- SQLite em memória: rápido, mas pode divergir de PostgreSQL/MySQL;
- banco real local;
- Docker Compose;
- testcontainers;
- serviço do CI;
- banco temporário por suite.

Para queries específicas de PostgreSQL, teste em PostgreSQL.

---

## Fixture de Session SQLAlchemy

```python
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.models import Base


@pytest.fixture
def session():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    db = Session()
    try:
        yield db
    finally:
        db.close()
```

Use isso para testes simples. Para produção com PostgreSQL, prefira banco real em CI.

---

## Testando Repository

```python
def test_salvar_e_buscar_cliente(session):
    repo = SQLAlchemyClienteRepository(session)

    cliente = repo.salvar(Cliente(nome="Ana", email="ana@example.com"))
    encontrado = repo.buscar_por_email("ana@example.com")

    assert encontrado.id == cliente.id
    assert encontrado.nome == "Ana"
```

Esse teste valida mapping, insert, query e conversão.

---

## Docker Compose para Integração

`compose.test.yml`:

```yaml
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: app_test
      POSTGRES_USER: app
      POSTGRES_PASSWORD: app
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app -d app_test"]
      interval: 5s
      timeout: 5s
      retries: 10
```

Execução:

```bash
docker compose -f compose.test.yml up -d
pytest -m integration
```

---

## Testando APIs Externas com responses

```bash
pip install responses requests
```

```python
import responses
import requests


def buscar_cep(cep: str) -> dict:
    response = requests.get(f"https://viacep.com.br/ws/{cep}/json/", timeout=5)
    response.raise_for_status()
    return response.json()


@responses.activate
def test_buscar_cep():
    responses.add(
        responses.GET,
        "https://viacep.com.br/ws/01001000/json/",
        json={"cep": "01001-000", "localidade": "São Paulo"},
        status=200,
    )

    assert buscar_cep("01001000")["localidade"] == "São Paulo"
```

Isso testa sua integração sem depender da internet.

---

## Testando HTTP Async com respx

```bash
pip install respx httpx
```

```python
import httpx
import pytest
import respx


async def buscar_usuario(usuario_id: int):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"https://api.example.com/users/{usuario_id}")
        response.raise_for_status()
        return response.json()


@pytest.mark.asyncio
@respx.mock
async def test_buscar_usuario():
    respx.get("https://api.example.com/users/1").mock(
        return_value=httpx.Response(200, json={"id": 1})
    )
    assert await buscar_usuario(1) == {"id": 1}
```

---

## Testando Redis

```python
def test_cache_set_get(redis_client):
    redis_client.setex("x", 60, "1")
    assert redis_client.get("x") == "1"
```

Use banco Redis separado para testes e limpe antes/depois:

```python
@pytest.fixture(autouse=True)
def limpar_redis(redis_client):
    redis_client.flushdb()
```

---

## Testes Flakey

Teste flakey passa ou falha sem mudança no código.

Causas comuns:

- dependência de horário;
- ordem de execução;
- concorrência;
- rede real;
- sleeps fixos;
- recursos compartilhados;
- banco não limpo.

Evite:

```python
time.sleep(2)
```

Prefira polling com timeout:

```python
def esperar(condicao, timeout=5):
    ...
```

---

## Checklist Integration Tests

- testa integração real que importa?
- serviços externos são controlados?
- banco é limpo entre testes?
- testes lentos estão marcados?
- CI sobe dependências necessárias?
- falhas são reproduzíveis localmente?
- não há dependência de ordem?
- timeouts são explícitos?
- migrations são testadas?
- suite não substitui unit tests desnecessariamente?

