# Gunicorn e Uvicorn

Gunicorn e Uvicorn são servidores usados para rodar aplicações Python web em produção.

- **Gunicorn**: servidor WSGI/gerenciador de processos robusto.
- **Uvicorn**: servidor ASGI rápido para async, FastAPI, Starlette e WebSockets.
- **Gunicorn + UvicornWorker**: combinação comum para FastAPI em produção.

---

## WSGI vs ASGI

WSGI:

- padrão tradicional;
- Flask e Django clássico;
- request/response síncrono;
- não suporta WebSockets nativamente.

ASGI:

- suporta async;
- WebSockets;
- lifespan;
- FastAPI, Starlette, Django async.

---

## Gunicorn com Flask

```bash
pip install gunicorn flask
gunicorn "app:create_app()" --bind 127.0.0.1:8000 --workers 4
```

Com módulo:

```bash
gunicorn wsgi:app --bind 127.0.0.1:8000 --workers 4
```

---

## Uvicorn com FastAPI

```bash
pip install uvicorn fastapi
uvicorn app.main:app --host 127.0.0.1 --port 8000
```

Desenvolvimento:

```bash
uvicorn app.main:app --reload
```

Não use `--reload` em produção.

---

## Gunicorn com Uvicorn Workers

```bash
pip install gunicorn uvicorn
gunicorn app.main:app \
  -k uvicorn.workers.UvicornWorker \
  --bind 127.0.0.1:8000 \
  --workers 4 \
  --timeout 60
```

Esse padrão usa Gunicorn para gerenciar processos e Uvicorn para protocolo ASGI.

---

## Quantidade de Workers

Regra inicial comum:

```text
workers = (2 x CPU) + 1
```

Mas ajuste por medição.

Para aplicações Python:

- CPU-bound precisa cuidado com GIL e processos;
- I/O-bound pode se beneficiar de async;
- memória por worker importa;
- workers demais podem piorar performance.

---

## Timeouts

```bash
gunicorn app.main:app --timeout 60 --graceful-timeout 30
```

Timeout curto demais mata requests legítimas. Longo demais esconde travamentos.

---

## Logs

```bash
gunicorn app.main:app \
  --access-logfile - \
  --error-logfile - \
  --log-level info
```

`-` envia para stdout/stderr, ideal para systemd, Docker e Kubernetes.

---

## Proxy Headers

Quando atrás de Nginx:

```bash
uvicorn app.main:app --proxy-headers --forwarded-allow-ips="127.0.0.1"
```

Ou com Gunicorn:

```bash
gunicorn app.main:app -k uvicorn.workers.UvicornWorker --forwarded-allow-ips="127.0.0.1"
```

Isso permite interpretar `X-Forwarded-Proto` e IP corretamente. Configure somente proxies confiáveis.

---

## Config Gunicorn

`gunicorn.conf.py`:

```python
bind = "127.0.0.1:8000"
workers = 4
worker_class = "uvicorn.workers.UvicornWorker"
timeout = 60
graceful_timeout = 30
accesslog = "-"
errorlog = "-"
loglevel = "info"
```

Execução:

```bash
gunicorn app.main:app -c gunicorn.conf.py
```

---

## Lifespan em FastAPI

```python
from contextlib import asynccontextmanager
from fastapi import FastAPI


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.pool = await criar_pool()
    yield
    await app.state.pool.close()


app = FastAPI(lifespan=lifespan)
```

Use lifespan para abrir/fechar recursos.

---

## Checklist

- framework é WSGI ou ASGI?
- servidor debug está desativado?
- app escuta em localhost atrás do proxy?
- workers foram definidos por medição?
- timeouts são adequados?
- logs vão para stdout/stderr?
- proxy headers vêm apenas de proxies confiáveis?
- processo encerra graciosamente?
- health check existe?
- systemd/Docker/Kubernetes reinicia em falha?

