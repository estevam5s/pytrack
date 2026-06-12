# Swagger/OpenAPI: Contratos de APIs, Schemas e Documentação Interativa

OpenAPI é uma especificação para descrever APIs HTTP. Swagger é um conjunto de ferramentas em torno desse ecossistema, como Swagger UI e Swagger Editor.

Uma especificação OpenAPI documenta endpoints, métodos, parâmetros, autenticação, payloads, respostas, erros e schemas. Ela serve como contrato entre backend, frontend, QA, integrações e consumidores externos.

---

## OpenAPI vs Swagger

- **OpenAPI**: especificação.
- **Swagger UI**: interface interativa para explorar a API.
- **Swagger Editor**: editor/validador.
- **Swagger Codegen/OpenAPI Generator**: geração de clientes/servidores.

---

## Exemplo OpenAPI Mínimo

```yaml
openapi: 3.1.0
info:
  title: API de Tarefas
  version: 1.0.0
paths:
  /tarefas:
    get:
      summary: Lista tarefas
      responses:
        "200":
          description: Lista de tarefas
          content:
            application/json:
              schema:
                type: object
                properties:
                  items:
                    type: array
                    items:
                      $ref: "#/components/schemas/Tarefa"
components:
  schemas:
    Tarefa:
      type: object
      required: [id, titulo, concluida]
      properties:
        id:
          type: integer
        titulo:
          type: string
        concluida:
          type: boolean
```

---

## FastAPI e OpenAPI Automático

```python
from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI(title="API de Tarefas", version="1.0.0")


class TarefaCreate(BaseModel):
    titulo: str = Field(min_length=1, max_length=120)


class TarefaOut(BaseModel):
    id: int
    titulo: str
    concluida: bool


@app.post("/tarefas", response_model=TarefaOut, status_code=201)
def criar_tarefa(payload: TarefaCreate):
    return {"id": 1, "titulo": payload.titulo, "concluida": False}
```

URLs:

```text
/docs
/redoc
/openapi.json
```

---

## Metadados

```python
app = FastAPI(
    title="API de Pedidos",
    summary="API para gestão de pedidos",
    description="Documentação pública da API de pedidos.",
    version="1.2.0",
    contact={"name": "Equipe Backend", "email": "backend@example.com"},
    license_info={"name": "Proprietary"},
)
```

---

## Tags

```python
from fastapi import APIRouter

router = APIRouter(prefix="/pedidos", tags=["Pedidos"])
```

Tags organizam Swagger UI.

---

## Responses Documentadas

```python
from fastapi import HTTPException


@app.get(
    "/tarefas/{tarefa_id}",
    response_model=TarefaOut,
    responses={
        404: {
            "description": "Tarefa não encontrada",
            "content": {
                "application/json": {
                    "example": {"detail": "Tarefa não encontrada"}
                }
            },
        }
    },
)
def buscar_tarefa(tarefa_id: int):
    raise HTTPException(status_code=404, detail="Tarefa não encontrada")
```

Documente erros relevantes, não apenas sucesso.

---

## Autenticação Bearer no OpenAPI

FastAPI com OAuth2:

```python
from typing import Annotated
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")


@app.get("/me")
def me(token: Annotated[str, Depends(oauth2_scheme)]):
    return {"token": token}
```

Swagger UI passa a mostrar botão `Authorize`.

---

## Flasgger no Flask

```bash
pip install flasgger
```

```python
from flask import Flask
from flasgger import Swagger

app = Flask(__name__)
swagger = Swagger(app)


@app.get("/health")
def health():
    """Health check.
    ---
    responses:
      200:
        description: OK
    """
    return {"status": "ok"}
```

Flask não gera contrato tão naturalmente quanto FastAPI. Avalie Flask-Smorest ou apispec para projetos maiores.

---

## Contract First vs Code First

Code first:

- código gera OpenAPI;
- produtivo em FastAPI;
- risco de contrato mudar sem revisão.

Contract first:

- OpenAPI é escrito antes;
- clientes e mocks podem ser gerados;
- melhor para APIs públicas e equipes grandes;
- exige disciplina para manter implementação alinhada.

---

## Validação do Contrato

Ferramentas:

```bash
npx @redocly/cli lint openapi.yaml
```

Ou:

```bash
docker run --rm -v "$PWD:/spec" redocly/cli lint /spec/openapi.yaml
```

Valide em CI.

---

## Versionamento de API

```text
/api/v1/pedidos
/api/v2/pedidos
```

OpenAPI deve indicar versão:

```yaml
info:
  version: 2.0.0
```

Mudanças incompatíveis precisam de nova versão ou plano de depreciação.

---

## Checklist OpenAPI

- todos endpoints públicos aparecem?
- schemas de request e response estão corretos?
- erros comuns estão documentados?
- autenticação aparece no Swagger?
- exemplos são realistas?
- versionamento está claro?
- contrato é validado em CI?
- consumidores sabem o que mudou?
- dados sensíveis não aparecem em exemplos?

