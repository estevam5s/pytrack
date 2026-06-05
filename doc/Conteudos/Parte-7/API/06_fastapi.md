# FastAPI: APIs Modernas, Async, OpenAPI e Produção

FastAPI é um framework moderno para construir APIs com Python. Ele usa type hints, Pydantic, Starlette e gera documentação OpenAPI automaticamente.

É excelente para REST APIs, serviços async, validação robusta, documentação interativa, integração com OAuth2/JWT, WebSockets e aplicações que precisam de alto desempenho com ergonomia.

---

## Instalação

```bash
pip install fastapi uvicorn[standard]
```

Primeira API:

```python
from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def home() -> dict[str, str]:
    return {"message": "Olá, FastAPI"}
```

Execução:

```bash
uvicorn app:app --reload
```

Documentação:

```text
http://localhost:8000/docs
http://localhost:8000/redoc
```

---

## Path e Query Parameters

```python
from fastapi import FastAPI, Query

app = FastAPI()


@app.get("/tarefas/{tarefa_id}")
def buscar_tarefa(tarefa_id: int):
    return {"id": tarefa_id}


@app.get("/tarefas")
def listar_tarefas(
    concluida: bool | None = None,
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
):
    return {"concluida": concluida, "limit": limit, "offset": offset}
```

FastAPI valida tipos automaticamente.

---

## Schemas com Pydantic

```python
from pydantic import BaseModel, Field


class TarefaCreate(BaseModel):
    titulo: str = Field(min_length=1, max_length=120)
    descricao: str | None = None


class TarefaOut(BaseModel):
    id: int
    titulo: str
    descricao: str | None
    concluida: bool
```

Endpoint:

```python
@app.post("/tarefas", response_model=TarefaOut, status_code=201)
def criar_tarefa(payload: TarefaCreate):
    return {
        "id": 1,
        "titulo": payload.titulo,
        "descricao": payload.descricao,
        "concluida": False,
    }
```

---

## HTTPException

```python
from fastapi import HTTPException


@app.get("/tarefas/{tarefa_id}", response_model=TarefaOut)
def buscar_tarefa(tarefa_id: int):
    tarefa = buscar_no_banco(tarefa_id)
    if tarefa is None:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")
    return tarefa
```

Para APIs grandes, padronize erro com exception handlers.

---

## Routers

Estrutura:

```text
app/
├── main.py
├── routers/
│   └── tarefas.py
├── schemas.py
├── services.py
└── database.py
```

`routers/tarefas.py`:

```python
from fastapi import APIRouter

router = APIRouter(prefix="/tarefas", tags=["tarefas"])


@router.get("")
def listar_tarefas():
    return {"items": []}
```

`main.py`:

```python
from fastapi import FastAPI
from app.routers import tarefas

app = FastAPI(title="API de Tarefas")
app.include_router(tarefas.router, prefix="/api/v1")
```

---

## Dependency Injection

```python
from typing import Annotated
from fastapi import Depends


def get_current_user():
    return {"id": 1, "nome": "Ana"}


@app.get("/me")
def me(user: Annotated[dict, Depends(get_current_user)]):
    return user
```

Dependencies são usadas para:

- autenticação;
- banco de dados;
- permissões;
- paginação;
- configurações;
- serviços.

---

## SQLAlchemy com FastAPI

```python
from collections.abc import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker


engine = create_engine("postgresql+psycopg://user:pass@localhost/app")
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

Endpoint:

```python
from typing import Annotated
from fastapi import Depends


@router.get("/{tarefa_id}")
def buscar_tarefa(tarefa_id: int, db: Annotated[Session, Depends(get_db)]):
    tarefa = db.get(TarefaModel, tarefa_id)
    if tarefa is None:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")
    return tarefa
```

---

## Async vs Sync

Use `async def` quando:

- usa driver async;
- chama serviços async;
- usa WebSockets;
- faz I/O concorrente.

Use `def` quando:

- usa SQLAlchemy sync;
- chama bibliotecas bloqueantes;
- endpoint é simples e CPU leve.

Não colocar `async` em tudo automaticamente. Código bloqueante dentro de `async def` bloqueia o event loop.

---

## Autenticação OAuth2/JWT

```python
from typing import Annotated
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
import jwt


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token")


def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    try:
        payload = jwt.decode(token, "segredo", algorithms=["HS256"])
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Token inválido")
    return payload
```

Em produção, use expiração, refresh token quando necessário, issuer, audience, algoritmo seguro e rotação de chaves.

---

## Middleware

```python
import time
import uuid
from fastapi import Request


@app.middleware("http")
async def add_request_id(request: Request, call_next):
    request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
    inicio = time.perf_counter()
    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    response.headers["X-Process-Time"] = str(time.perf_counter() - inicio)
    return response
```

---

## Testes

```python
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
```

Override de dependency:

```python
app.dependency_overrides[get_db] = get_test_db
```

---

## Background Tasks

```python
from fastapi import BackgroundTasks


def enviar_email(email: str) -> None:
    print(f"Enviando email para {email}")


@app.post("/convites")
def criar_convite(email: str, background_tasks: BackgroundTasks):
    background_tasks.add_task(enviar_email, email)
    return {"status": "agendado"}
```

Para tarefas críticas, use fila real como Celery, RQ, Dramatiq, RabbitMQ, SQS ou Kafka.

---

## Produção

Com Uvicorn:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Com Gunicorn:

```bash
gunicorn app.main:app \
  -k uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000 \
  --workers 4
```

Docker:

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app ./app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## Checklist FastAPI Profissional

- schemas de entrada e saída são separados?
- routers estão organizados por domínio?
- dependencies controlam banco, auth e permissões?
- endpoints usam status codes corretos?
- erros são padronizados?
- OpenAPI não expõe campos internos?
- sync/async foi escolhido conscientemente?
- testes usam dependency overrides?
- logs incluem request id?
- health/readiness endpoints existem?
- produção usa workers adequados?
- tarefas críticas usam fila real?

---

## Aprofundamento: FastAPI, ASGI, Tipagem e OpenAPI

FastAPI foi desenhado para APIs modernas. Ele usa type hints para validar dados, gerar documentação e melhorar a experiência de desenvolvimento.

Pilares:

- ASGI para suportar async, WebSockets e alta concorrência I/O-bound;
- Pydantic para validação e serialização;
- OpenAPI automático;
- documentação interativa em `/docs`;
- `response_model` para controlar saída;
- dependency injection para banco, autenticação e serviços.

FastAPI não elimina a necessidade de arquitetura. Ele facilita contratos e validação, mas regras de negócio, persistência, testes e segurança continuam sendo responsabilidade do projeto.

---

## FastAPI: GET, POST, PUT, PATCH e DELETE

```python
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel, Field

app = FastAPI(title="API de Tarefas")
TAREFAS: dict[int, dict] = {}


class TarefaCreate(BaseModel):
    titulo: str = Field(min_length=1, max_length=120)


class TarefaUpdate(BaseModel):
    titulo: str | None = Field(default=None, min_length=1, max_length=120)
    concluida: bool | None = None


@app.get("/tarefas")
def listar_tarefas():
    return {"items": list(TAREFAS.values())}


@app.post("/tarefas", status_code=status.HTTP_201_CREATED)
def criar_tarefa(payload: TarefaCreate):
    tarefa_id = len(TAREFAS) + 1
    tarefa = {"id": tarefa_id, "titulo": payload.titulo, "concluida": False}
    TAREFAS[tarefa_id] = tarefa
    return tarefa


@app.get("/tarefas/{tarefa_id}")
def buscar_tarefa(tarefa_id: int):
    tarefa = TAREFAS.get(tarefa_id)
    if tarefa is None:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")
    return tarefa


@app.patch("/tarefas/{tarefa_id}")
def atualizar_tarefa(tarefa_id: int, payload: TarefaUpdate):
    tarefa = TAREFAS.get(tarefa_id)
    if tarefa is None:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")

    dados = payload.model_dump(exclude_unset=True)
    tarefa.update(dados)
    return tarefa


@app.delete("/tarefas/{tarefa_id}", status_code=status.HTTP_204_NO_CONTENT)
def remover_tarefa(tarefa_id: int):
    TAREFAS.pop(tarefa_id, None)
    return None
```

FastAPI valida path params, query params e body automaticamente com base nos tipos declarados.

---

## Quando FastAPI é uma Boa Escolha

Use FastAPI quando:

- a API precisa de contrato OpenAPI desde o início;
- entrada e saída precisam de validação forte;
- o time usa type hints;
- há integração com frontends, SDKs ou outros serviços;
- endpoints async são relevantes;
- documentação interativa reduz custo de integração;
- o projeto é API-first.

Cuidados:

- não misture bibliotecas bloqueantes dentro de `async def`;
- separe schemas de entrada e saída;
- não exponha modelos do banco diretamente;
- configure exception handlers para erro padronizado;
- revise o OpenAPI para não vazar campos internos.
