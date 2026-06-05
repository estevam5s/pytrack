# Middlewares, CORS e Rate Limiting

Middlewares interceptam requests e responses. Eles são ideais para preocupações transversais: logs, request id, autenticação, métricas, CORS, compressão, headers de segurança e rate limiting.

---

## Middleware

Fluxo:

```text
Request -> Middleware A -> Middleware B -> Endpoint -> Middleware B -> Middleware A -> Response
```

Exemplo FastAPI:

```python
import time
import uuid
from fastapi import FastAPI, Request

app = FastAPI()


@app.middleware("http")
async def request_id_middleware(request: Request, call_next):
    request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
    inicio = time.perf_counter()

    response = await call_next(request)

    response.headers["X-Request-ID"] = request_id
    response.headers["X-Process-Time"] = f"{time.perf_counter() - inicio:.4f}"
    return response
```

---

## Middleware Flask

```python
import time
import uuid
from flask import Flask, g, request

app = Flask(__name__)


@app.before_request
def before_request():
    g.request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
    g.start_time = time.perf_counter()


@app.after_request
def after_request(response):
    response.headers["X-Request-ID"] = g.request_id
    response.headers["X-Process-Time"] = str(time.perf_counter() - g.start_time)
    return response
```

---

## CORS

CORS controla quais origens no navegador podem acessar sua API.

Origem:

```text
scheme + host + port
https://app.exemplo.com
```

FastAPI:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://app.exemplo.com"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)
```

Flask:

```bash
pip install flask-cors
```

```python
from flask_cors import CORS

CORS(
    app,
    origins=["https://app.exemplo.com"],
    supports_credentials=True,
)
```

Evite `allow_origins=["*"]` com credenciais.

---

## Preflight

Navegadores enviam `OPTIONS` antes de requests com certos métodos/headers.

```http
OPTIONS /api/v1/tarefas
Origin: https://app.exemplo.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Authorization, Content-Type
```

A API precisa responder headers adequados.

---

## Headers de Segurança

```python
@app.middleware("http")
async def security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response
```

Para aplicações com browser, avalie CSP.

---

## Rate Limiting

Rate limiting limita requisições por usuário, IP, token ou rota.

Exemplo simples com Redis:

```python
import time
import redis

client = redis.Redis.from_url("redis://localhost:6379/0", decode_responses=True)


def permitir(chave: str, limite: int, janela_segundos: int) -> bool:
    bucket = int(time.time() // janela_segundos)
    redis_key = f"rate:{chave}:{bucket}"
    total = client.incr(redis_key)
    if total == 1:
        client.expire(redis_key, janela_segundos + 5)
    return total <= limite
```

Uso:

```python
from fastapi import HTTPException, Request


@app.middleware("http")
async def rate_limit(request: Request, call_next):
    ip = request.client.host if request.client else "unknown"
    if not permitir(ip, limite=100, janela_segundos=60):
        raise HTTPException(status_code=429, detail="Muitas requisições")
    return await call_next(request)
```

---

## Algoritmos de Rate Limit

- Fixed window: simples, menos preciso em bordas.
- Sliding window: mais justo, mais caro.
- Token bucket: permite rajadas controladas.
- Leaky bucket: suaviza taxa.

Para produção, rate limit pode ficar em API Gateway, Nginx, Envoy, Kong, Traefik, Cloudflare ou biblioteca da aplicação.

---

## Rate Limit no Nginx

```nginx
http {
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

    server {
        location /api/ {
            limit_req zone=api_limit burst=20 nodelay;
            proxy_pass http://app;
        }
    }
}
```

Camada de borda é eficiente para proteção inicial. Ainda pode existir limite por usuário na aplicação.

---

## Checklist

- middlewares têm responsabilidade clara?
- request id é propagado?
- CORS lista origens específicas?
- preflight funciona?
- headers de segurança básicos existem?
- rate limit diferencia usuário autenticado e IP anônimo?
- resposta 429 inclui mensagem clara?
- logs mostram bloqueios?
- Redis/gateway suporta volume esperado?
- middlewares não engolem exceções indevidamente?

