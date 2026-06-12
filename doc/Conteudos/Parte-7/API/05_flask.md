# Flask: Do Básico ao Backend Profissional

Flask é um microframework web para Python. Ele é simples, flexível e extensível. Por ser minimalista, Flask deixa muitas decisões para a equipe: estrutura de projeto, validação, autenticação, ORM, migrations, serialização, documentação e padrões de erro.

Essa liberdade é útil, mas exige disciplina para projetos profissionais.

---

## Instalação

```bash
pip install flask
```

Primeira aplicação:

```python
from flask import Flask

app = Flask(__name__)


@app.get("/")
def home():
    return {"message": "Olá, Flask"}


if __name__ == "__main__":
    app.run(debug=True)
```

Execução:

```bash
python app.py
```

---

## Rotas e Métodos

```python
from flask import Flask, request

app = Flask(__name__)


@app.get("/tarefas")
def listar_tarefas():
    return {"items": []}


@app.post("/tarefas")
def criar_tarefa():
    payload = request.get_json()
    return {"id": 1, **payload}, 201
```

---

## Parâmetros

Path parameter:

```python
@app.get("/tarefas/<int:tarefa_id>")
def buscar_tarefa(tarefa_id: int):
    return {"id": tarefa_id, "titulo": "Estudar Flask"}
```

Query parameter:

```python
@app.get("/tarefas")
def listar_tarefas():
    concluida = request.args.get("concluida")
    limit = request.args.get("limit", default=20, type=int)
    return {"concluida": concluida, "limit": limit}
```

---

## Validação com Pydantic

```bash
pip install pydantic
```

```python
from pydantic import BaseModel, ValidationError, Field


class CriarTarefaSchema(BaseModel):
    titulo: str = Field(min_length=1, max_length=120)
    descricao: str | None = None


@app.post("/tarefas")
def criar_tarefa():
    try:
        dados = CriarTarefaSchema.model_validate(request.get_json())
    except ValidationError as exc:
        return {"erro": {"codigo": "VALIDACAO_INVALIDA", "campos": exc.errors()}}, 422

    return {"id": 1, "titulo": dados.titulo, "descricao": dados.descricao}, 201
```

---

## Application Factory

Estrutura profissional:

```text
app/
├── __init__.py
├── config.py
├── routes.py
├── extensions.py
├── models.py
└── services.py
```

`app/__init__.py`:

```python
from flask import Flask


def create_app(config_object: str | None = None) -> Flask:
    app = Flask(__name__)

    if config_object:
        app.config.from_object(config_object)

    from app.routes import bp as api_bp
    app.register_blueprint(api_bp, url_prefix="/api/v1")

    return app
```

`wsgi.py`:

```python
from app import create_app

app = create_app("app.config.ProductionConfig")
```

---

## Blueprints

```python
from flask import Blueprint

bp = Blueprint("tarefas", __name__)


@bp.get("/tarefas")
def listar_tarefas():
    return {"items": []}
```

Blueprints organizam rotas por domínio.

---

## Flask com SQLAlchemy

```bash
pip install flask-sqlalchemy flask-migrate
```

`extensions.py`:

```python
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

db = SQLAlchemy()
migrate = Migrate()
```

`models.py`:

```python
from app.extensions import db


class Tarefa(db.Model):
    __tablename__ = "tarefas"

    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(120), nullable=False)
    concluida = db.Column(db.Boolean, nullable=False, default=False)
```

Inicialização:

```python
from app.extensions import db, migrate

db.init_app(app)
migrate.init_app(app, db)
```

---

## CRUD com Banco

```python
from flask import Blueprint, request
from app.extensions import db
from app.models import Tarefa

bp = Blueprint("tarefas", __name__)


@bp.get("/tarefas")
def listar():
    tarefas = Tarefa.query.order_by(Tarefa.id).limit(50).all()
    return {"items": [
        {"id": t.id, "titulo": t.titulo, "concluida": t.concluida}
        for t in tarefas
    ]}


@bp.post("/tarefas")
def criar():
    payload = request.get_json()
    tarefa = Tarefa(titulo=payload["titulo"])
    db.session.add(tarefa)
    db.session.commit()
    return {"id": tarefa.id, "titulo": tarefa.titulo, "concluida": tarefa.concluida}, 201
```

---

## Tratamento de Erros

```python
class APIError(Exception):
    status_code = 400
    code = "ERRO_API"

    def __init__(self, message: str, status_code: int | None = None) -> None:
        self.message = message
        if status_code:
            self.status_code = status_code


@app.errorhandler(APIError)
def handle_api_error(error: APIError):
    return {
        "erro": {
            "codigo": error.code,
            "mensagem": error.message,
        }
    }, error.status_code
```

---

## Autenticação com JWT

```bash
pip install pyjwt
```

```python
from functools import wraps
from flask import request
import jwt


def login_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        header = request.headers.get("Authorization", "")
        if not header.startswith("Bearer "):
            return {"erro": {"codigo": "NAO_AUTENTICADO"}}, 401

        token = header.removeprefix("Bearer ").strip()
        try:
            request.user = jwt.decode(token, "segredo", algorithms=["HS256"])
        except jwt.PyJWTError:
            return {"erro": {"codigo": "TOKEN_INVALIDO"}}, 401

        return func(*args, **kwargs)

    return wrapper
```

Em produção, use segredo forte, rotação, expiração, issuer/audience e HTTPS.

---

## Testes

```python
import pytest
from app import create_app


@pytest.fixture
def client():
    app = create_app("app.config.TestConfig")
    return app.test_client()


def test_health(client):
    response = client.get("/health")
    assert response.status_code == 200
```

---

## Produção com Gunicorn

```bash
pip install gunicorn
gunicorn "app:create_app()" --bind 0.0.0.0:8000 --workers 4
```

Docker:

```dockerfile
CMD ["gunicorn", "app:create_app()", "--bind", "0.0.0.0:8000", "--workers", "4"]
```

---

## Checklist Flask Profissional

- usa application factory?
- rotas estão organizadas por Blueprints?
- validação de entrada é consistente?
- erros têm formato padrão?
- banco usa migrations?
- sessions são fechadas corretamente?
- autenticação e autorização estão centralizadas?
- testes cobrem rotas críticas?
- configuração vem de ambiente?
- produção usa Gunicorn/uWSGI, não servidor debug?
- logs vão para stdout/stderr?
- CORS e rate limit estão configurados quando necessário?

---

## Aprofundamento: Flask Como Microframework Síncrono

Flask é propositalmente pequeno. Ele entrega roteamento, request/response, contexto de aplicação, templates e extensibilidade. O restante fica a cargo do projeto.

Isso significa que uma API Flask profissional precisa escolher explicitamente:

- biblioteca de validação;
- ORM;
- migrations;
- autenticação;
- autorização;
- serialização;
- documentação OpenAPI;
- tratamento de erros;
- estrutura de pastas;
- testes;
- configuração por ambiente.

Flask é síncrono por padrão e tradicionalmente executa sobre WSGI. Para APIs CRUD, painéis internos, serviços simples e backends com bibliotecas síncronas, isso é suficiente e previsível.

---

## Flask: GET, POST, PUT, PATCH e DELETE

```python
from flask import Flask, request

app = Flask(__name__)
TAREFAS = {}


@app.get("/tarefas")
def listar():
    return {"items": list(TAREFAS.values())}


@app.post("/tarefas")
def criar():
    payload = request.get_json()
    tarefa_id = len(TAREFAS) + 1
    tarefa = {"id": tarefa_id, "titulo": payload["titulo"], "concluida": False}
    TAREFAS[tarefa_id] = tarefa
    return tarefa, 201, {"Location": f"/tarefas/{tarefa_id}"}


@app.patch("/tarefas/<int:tarefa_id>")
def atualizar_parcial(tarefa_id):
    tarefa = TAREFAS.get(tarefa_id)
    if tarefa is None:
        return {"erro": {"codigo": "TAREFA_NAO_ENCONTRADA"}}, 404

    payload = request.get_json()
    tarefa.update(payload)
    return tarefa


@app.delete("/tarefas/<int:tarefa_id>")
def remover(tarefa_id):
    TAREFAS.pop(tarefa_id, None)
    return "", 204
```

Esse exemplo é didático. Em produção, separe regra de negócio, validação e persistência.

---

## Quando Flask é uma Boa Escolha

Use Flask quando:

- a API é pequena ou média;
- a equipe quer controle total;
- o projeto é síncrono;
- a validação será definida pela equipe;
- documentação automática não é obrigatória no primeiro momento;
- o domínio é simples;
- a empresa já tem padrão Flask.

Evite improvisar em projetos grandes. Flask escala bem quando há disciplina arquitetural.
