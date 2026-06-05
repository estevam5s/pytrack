# Tornado: Async Web, WebSockets e Alta Concorrência

Tornado é um framework web e biblioteca de rede assíncrona para Python. Ele nasceu com foco em conexões longas, alta concorrência e WebSockets antes de async/await se popularizar no ecossistema.

Hoje, Tornado é útil quando você precisa de controle fino de I/O assíncrono, aplicações com conexões persistentes, servidores internos, streaming e sistemas que já usam seu ecossistema.

---

## Instalação

```bash
pip install tornado
```

Primeira aplicação:

```python
import tornado.ioloop
import tornado.web


class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.write({"message": "Olá, Tornado"})


def make_app():
    return tornado.web.Application([
        (r"/", MainHandler),
    ])


if __name__ == "__main__":
    app = make_app()
    app.listen(8000)
    tornado.ioloop.IOLoop.current().start()
```

---

## RequestHandler

```python
class TarefaHandler(tornado.web.RequestHandler):
    def get(self, tarefa_id: str):
        self.write({"id": int(tarefa_id), "titulo": "Estudar Tornado"})


app = tornado.web.Application([
    (r"/tarefas/([0-9]+)", TarefaHandler),
])
```

---

## JSON Request

```python
import json


class CriarTarefaHandler(tornado.web.RequestHandler):
    def post(self):
        try:
            payload = json.loads(self.request.body.decode("utf-8"))
        except json.JSONDecodeError:
            self.set_status(400)
            self.write({"erro": {"codigo": "JSON_INVALIDO"}})
            return

        self.set_status(201)
        self.write({"id": 1, "titulo": payload["titulo"]})
```

---

## Handlers Assíncronos

```python
import tornado.httpclient


class ProxyHandler(tornado.web.RequestHandler):
    async def get(self):
        client = tornado.httpclient.AsyncHTTPClient()
        response = await client.fetch("https://example.com")
        self.write({"status": response.code})
```

Não use bibliotecas bloqueantes dentro de handlers async se espera alta concorrência.

---

## Validação com Pydantic

```python
from pydantic import BaseModel, Field, ValidationError


class CriarTarefaSchema(BaseModel):
    titulo: str = Field(min_length=1, max_length=120)


class CriarTarefaHandler(tornado.web.RequestHandler):
    def post(self):
        try:
            payload = json.loads(self.request.body.decode("utf-8"))
            dados = CriarTarefaSchema.model_validate(payload)
        except (json.JSONDecodeError, ValidationError) as exc:
            self.set_status(422)
            self.write({"erro": {"codigo": "VALIDACAO_INVALIDA", "detalhes": str(exc)}})
            return

        self.set_status(201)
        self.write({"id": 1, "titulo": dados.titulo})
```

---

## WebSocket com Tornado

```python
import tornado.websocket


class ChatWebSocket(tornado.websocket.WebSocketHandler):
    clients: set["ChatWebSocket"] = set()

    def open(self):
        self.clients.add(self)
        self.write_message({"tipo": "sistema", "texto": "Conectado"})

    def on_message(self, message):
        for client in self.clients.copy():
            client.write_message({"tipo": "mensagem", "texto": message})

    def on_close(self):
        self.clients.discard(self)


app = tornado.web.Application([
    (r"/ws/chat", ChatWebSocket),
])
```

---

## CORS

```python
class BaseHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "https://app.exemplo.com")
        self.set_header("Access-Control-Allow-Headers", "Authorization, Content-Type")
        self.set_header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS")

    def options(self, *args, **kwargs):
        self.set_status(204)
        self.finish()
```

Evite liberar `*` com credenciais em produção.

---

## Erros Padronizados

```python
class APIError(tornado.web.HTTPError):
    def __init__(self, status_code: int, code: str, message: str) -> None:
        super().__init__(status_code= status_code, reason=message)
        self.code = code
        self.message = message


class BaseHandler(tornado.web.RequestHandler):
    def write_error(self, status_code: int, **kwargs):
        exc_info = kwargs.get("exc_info")
        error = exc_info[1] if exc_info else None
        code = getattr(error, "code", "ERRO_INTERNO")
        message = getattr(error, "message", "Erro inesperado")
        self.write({"erro": {"codigo": code, "mensagem": message}})
```

---

## Configuração

```python
import os


class Settings:
    port = int(os.environ.get("PORT", "8000"))
    debug = os.environ.get("DEBUG", "false").lower() == "true"
    database_url = os.environ["DATABASE_URL"]
```

Aplicação:

```python
def make_app(settings: Settings):
    return tornado.web.Application(
        [(r"/", MainHandler)],
        debug=settings.debug,
    )
```

---

## Integração com Async Database

Exemplo conceitual com asyncpg:

```python
import asyncpg


class ListarTarefasHandler(tornado.web.RequestHandler):
    async def get(self):
        pool = self.application.settings["db_pool"]
        async with pool.acquire() as conn:
            rows = await conn.fetch("SELECT id, titulo, concluida FROM tarefas LIMIT 50")
        self.write({"items": [dict(row) for row in rows]})


async def main():
    pool = await asyncpg.create_pool(os.environ["DATABASE_URL"])
    app = tornado.web.Application(
        [(r"/tarefas", ListarTarefasHandler)],
        db_pool=pool,
    )
    app.listen(8000)
    await tornado.ioloop.IOLoop.current().asyncio_loop.create_future()
```

---

## Testes

```python
from tornado.testing import AsyncHTTPTestCase


class AppTest(AsyncHTTPTestCase):
    def get_app(self):
        return make_app()

    def test_home(self):
        response = self.fetch("/")
        assert response.code == 200
```

---

## Produção

Tornado pode rodar diretamente:

```bash
python -m app.main
```

Para múltiplos processos:

```python
import tornado.process


server = tornado.httpserver.HTTPServer(app)
server.bind(8000)
server.start(0)
tornado.ioloop.IOLoop.current().start()
```

Em containers e Kubernetes, muitas equipes preferem uma réplica por processo e escalam via orquestrador.

---

## Quando Escolher Tornado

Tornado faz sentido quando:

- WebSockets são centrais;
- conexões longas são muitas;
- você quer controle async direto;
- projeto já usa Tornado;
- servidor precisa fazer streaming;
- há integração com bibliotecas async.

FastAPI costuma ser mais produtivo para APIs REST modernas com OpenAPI automática. Flask é mais simples para aplicações pequenas e tradicionais. Tornado é forte em I/O assíncrono e conexões persistentes.

---

## Checklist Tornado Profissional

- handlers async não chamam código bloqueante?
- mensagens WebSocket são validadas?
- conexões são removidas corretamente?
- erros têm formato padrão?
- CORS está restrito?
- banco usa driver async ou executor adequado?
- logs incluem request id?
- timeouts e limites de payload existem?
- testes usam `AsyncHTTPTestCase`?
- produção tem estratégia de múltiplos processos ou réplicas?
- health check está disponível?

