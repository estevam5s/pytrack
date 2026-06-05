# Logging: Logs Estruturados, Contexto e Produção

Logging é o registro de eventos relevantes que acontecem dentro de uma aplicação. Logs ajudam a entender comportamento, investigar incidentes, auditar ações, depurar erros e reconstruir fluxos de execução.

Em produção, logging não é `print()`. Logs precisam ter nível, contexto, formato pesquisável, cuidado com dados sensíveis e relação com métricas, traces e erros.

---

## Por que Logs Existem

Logs respondem perguntas como:

- qual requisição falhou?
- qual usuário foi afetado?
- qual payload foi rejeitado?
- quanto tempo uma operação levou?
- qual dependência externa retornou erro?
- qual versão da aplicação estava rodando?
- qual correlation id liga múltiplos serviços?

Um log bom encurta investigação. Um log ruim cria ruído.

---

## `print()` vs `logging`

Errado para produção:

```python
print("pedido criado")
```

Melhor:

```python
import logging

logger = logging.getLogger(__name__)


def criar_pedido(pedido_id: int) -> None:
    logger.info("pedido_criado", extra={"pedido_id": pedido_id})
```

O módulo `logging` permite níveis, handlers, formatters, filtros e integração com ferramentas externas.

---

## Níveis de Log

Use níveis com critério:

- **DEBUG**: detalhe útil em desenvolvimento ou investigação controlada.
- **INFO**: evento normal importante.
- **WARNING**: situação inesperada, mas recuperável.
- **ERROR**: falha que impediu uma operação.
- **CRITICAL**: falha grave que ameaça o serviço.

Exemplo:

```python
logger.debug("calculando_total_pedido", extra={"pedido_id": pedido_id})
logger.info("pedido_confirmado", extra={"pedido_id": pedido_id})
logger.warning("pagamento_lento", extra={"pedido_id": pedido_id, "duration_ms": 2300})
logger.error("falha_ao_confirmar_pedido", extra={"pedido_id": pedido_id})
```

Não use `ERROR` para fluxo esperado, como login inválido. Isso distorce alertas.

---

## Configuração Básica

```python
import logging


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)

logger = logging.getLogger("app")
logger.info("aplicacao_iniciada")
```

Em produção, prefira logs em stdout/stderr para que container, systemd ou plataforma colete.

---

## Logs Estruturados

Logs em texto livre são difíceis de consultar. Logs estruturados usam campos.

Exemplo desejável:

```json
{
  "timestamp": "2026-05-16T22:00:00Z",
  "level": "INFO",
  "event": "pedido_confirmado",
  "pedido_id": 123,
  "cliente_id": 456,
  "trace_id": "abc",
  "duration_ms": 41
}
```

Com `python-json-logger`:

```bash
pip install python-json-logger
```

```python
import logging
from pythonjsonlogger import jsonlogger


handler = logging.StreamHandler()
formatter = jsonlogger.JsonFormatter(
    "%(asctime)s %(levelname)s %(name)s %(message)s %(request_id)s %(trace_id)s"
)
handler.setFormatter(formatter)

root = logging.getLogger()
root.handlers.clear()
root.addHandler(handler)
root.setLevel(logging.INFO)
```

---

## Contexto de Requisição

Logs sem contexto não ajudam muito.

Campos úteis:

- `request_id`;
- `correlation_id`;
- `trace_id`;
- `span_id`;
- `user_id`;
- `tenant_id`;
- `method`;
- `path`;
- `status_code`;
- `duration_ms`;
- `service`;
- `env`;
- `version`.

Middleware FastAPI:

```python
import time
import uuid
from contextvars import ContextVar

from fastapi import FastAPI, Request

request_id_ctx: ContextVar[str | None] = ContextVar("request_id", default=None)

app = FastAPI()


@app.middleware("http")
async def add_request_context(request: Request, call_next):
    request_id = request.headers.get("x-request-id", str(uuid.uuid4()))
    token = request_id_ctx.set(request_id)
    started = time.perf_counter()

    try:
        response = await call_next(request)
        return response
    finally:
        duration_ms = round((time.perf_counter() - started) * 1000, 2)
        logger.info(
            "http_request",
            extra={
                "request_id": request_id,
                "method": request.method,
                "path": request.url.path,
                "duration_ms": duration_ms,
            },
        )
        request_id_ctx.reset(token)
```

`ContextVar` evita misturar contexto entre requisições concorrentes.

---

## Filtro para Injetar Contexto

```python
class RequestContextFilter(logging.Filter):
    def filter(self, record: logging.LogRecord) -> bool:
        record.request_id = request_id_ctx.get()
        return True


handler.addFilter(RequestContextFilter())
```

Assim todos os logs emitidos durante a requisição carregam o mesmo `request_id`.

---

## Exceptions

Use `logger.exception()` dentro de blocos `except`. Ele inclui stack trace.

```python
try:
    pagamento.autorizar(pedido)
except TimeoutError:
    logger.exception(
        "timeout_ao_autorizar_pagamento",
        extra={"pedido_id": pedido.id},
    )
    raise
```

Evite:

```python
logger.error(f"erro: {exc}")
```

Isso perde stack trace e dificulta diagnóstico.

---

## Dados Sensíveis

Nunca grave:

- senha;
- token;
- chave de API;
- CPF completo quando não necessário;
- cartão;
- segredo de sessão;
- payloads de autenticação;
- dados médicos ou financeiros sensíveis sem política clara.

Filtro simples:

```python
SENSITIVE_KEYS = {"password", "token", "authorization", "api_key"}


def sanitize(data: dict) -> dict:
    return {
        key: "***" if key.lower() in SENSITIVE_KEYS else value
        for key, value in data.items()
    }
```

Privacidade é requisito de observabilidade.

---

## Logging em Bibliotecas

Bibliotecas devem criar loggers por módulo e não configurar handlers globais:

```python
logger = logging.getLogger(__name__)
```

Aplicações configuram handlers. Bibliotecas apenas emitem logs.

---

## Logs em Containers

Em containers:

- escreva em stdout/stderr;
- não grave arquivo local como estratégia principal;
- use JSON quando possível;
- inclua `service`, `env` e `version`;
- deixe a plataforma coletar: Docker, Kubernetes, Fluent Bit, Vector, Loki, Elasticsearch.

Exemplo:

```text
Aplicacao -> stdout -> runtime/container -> collector -> armazenamento -> consulta
```

---

## Amostragem

Logs muito volumosos custam caro e atrapalham.

Estratégias:

- reduzir logs DEBUG em produção;
- amostrar eventos repetitivos;
- logar agregados quando possível;
- elevar nível apenas temporariamente;
- usar métricas para contagem, logs para contexto.

Não use log para tudo que deveria ser métrica.

---

## Logs, Métricas e Traces

Logs explicam eventos específicos. Métricas mostram tendência. Traces mostram caminho de uma requisição.

Exemplo:

```text
Metrica: taxa de erro subiu para 8%
Trace: erro ocorre no span pagamento.autorizar
Log: pagamento recusado por timeout no provedor X
```

O ideal é correlacionar usando `trace_id` e `request_id`.

---

## Erros Comuns

- usar `print()` em produção;
- logar sem nível;
- logar texto livre sem campos;
- registrar dados sensíveis;
- gerar logs demais;
- não incluir request id;
- usar `ERROR` para comportamento esperado;
- esconder exceções sem stack trace;
- depender de log local em arquivo dentro de container;
- não padronizar nomes de eventos.

---

## Checklist Avançado

- Logs são estruturados?
- Todo fluxo HTTP tem request id?
- Logs carregam `service`, `env` e `version`?
- Exceções incluem stack trace?
- Dados sensíveis são removidos ou mascarados?
- Eventos têm nomes consistentes?
- Logs conseguem ser correlacionados com traces?
- Volume e custo são monitorados?
- Existe política de retenção?

Logging profissional não é escrever mais mensagens. É registrar os fatos certos, no formato certo, com contexto suficiente para investigar produção.

