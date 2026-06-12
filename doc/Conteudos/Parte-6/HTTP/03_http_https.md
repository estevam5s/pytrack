# HTTP/HTTPS: Protocolo Web, APIs, TLS e Clientes Python

HTTP é o protocolo base da web e de muitas APIs. HTTPS é HTTP sobre TLS, oferecendo confidencialidade, integridade e autenticação do servidor.

Em Python, você normalmente usa bibliotecas como `requests`, `httpx`, `aiohttp`, FastAPI, Flask ou Django, mas entender o protocolo ajuda a depurar e projetar APIs melhores.

---

## Estrutura de uma Request

```http
GET /api/v1/tarefas?limit=10 HTTP/1.1
Host: api.example.com
Accept: application/json
Authorization: Bearer token
```

Com corpo:

```http
POST /api/v1/tarefas HTTP/1.1
Host: api.example.com
Content-Type: application/json

{"titulo": "Estudar HTTP"}
```

---

## Métodos HTTP

- `GET`: consulta.
- `POST`: criação/operação.
- `PUT`: substituição completa.
- `PATCH`: atualização parcial.
- `DELETE`: remoção.
- `HEAD`: headers sem corpo.
- `OPTIONS`: capacidades/preflight CORS.

---

## Status Codes

- `200 OK`;
- `201 Created`;
- `204 No Content`;
- `400 Bad Request`;
- `401 Unauthorized`;
- `403 Forbidden`;
- `404 Not Found`;
- `409 Conflict`;
- `422 Unprocessable Entity`;
- `429 Too Many Requests`;
- `500 Internal Server Error`;
- `503 Service Unavailable`.

Status code é parte do contrato da API.

---

## Headers Importantes

- `Content-Type`: formato do corpo enviado.
- `Accept`: formato esperado.
- `Authorization`: credenciais.
- `Cache-Control`: cache.
- `ETag`: validação de cache/concorrência.
- `Location`: recurso criado.
- `Retry-After`: retry em 429/503.
- `X-Request-ID`: correlação de logs.

---

## Cliente com requests

```python
import requests


response = requests.get(
    "https://api.github.com",
    headers={"Accept": "application/json"},
    timeout=10,
)
response.raise_for_status()
print(response.json())
```

Sempre use timeout.

---

## Session e Reuso de Conexões

```python
import requests


session = requests.Session()
session.headers.update({"User-Agent": "MinhaApp/1.0"})

response = session.get("https://example.com", timeout=10)
```

`Session` reaproveita conexões e cookies.

---

## Retry com Backoff

```python
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
import requests


retry = Retry(
    total=3,
    backoff_factor=0.5,
    status_forcelist=[429, 500, 502, 503, 504],
    allowed_methods=["GET", "HEAD", "OPTIONS"],
)

session = requests.Session()
session.mount("https://", HTTPAdapter(max_retries=retry))
```

Não aplique retry cego em `POST` não idempotente.

---

## httpx Async

```python
import httpx


async def buscar(url: str) -> dict:
    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.get(url)
        response.raise_for_status()
        return response.json()
```

Use async quando sua aplicação já é async e há muitas operações I/O concorrentes.

---

## HTTPS e TLS

HTTPS protege dados em trânsito. O cliente valida certificado do servidor.

Evite:

```python
requests.get("https://example.com", verify=False)
```

Isso remove validação TLS e abre espaço para ataques man-in-the-middle.

---

## HTTP/2 e HTTP/3

HTTP/2:

- multiplexação;
- compressão de headers;
- melhor uso de conexão;
- base para gRPC.

HTTP/3:

- usa QUIC sobre UDP;
- melhora cenários com perda/latência;
- depende de suporte de infraestrutura.

No Python, bibliotecas e servidores têm suporte variado.

---

## Cache HTTP

```http
Cache-Control: public, max-age=3600
ETag: "abc123"
```

Request condicional:

```http
If-None-Match: "abc123"
```

Resposta:

```http
304 Not Modified
```

Cache bem configurado reduz latência e custo.

---

## CORS

CORS é política de navegador, não autenticação.

```http
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Credentials: true
```

Evite liberar tudo sem necessidade.

---

## Debug com curl

```bash
curl -v https://example.com
curl -X POST https://api.example.com/tarefas \
  -H "Content-Type: application/json" \
  -d '{"titulo":"teste"}'
```

`-v` mostra handshake, headers e detalhes úteis.

---

## Checklist HTTP/HTTPS

- métodos e status codes estão corretos?
- timeout está configurado no cliente?
- retries respeitam idempotência?
- TLS verification está ativa?
- headers de autenticação não aparecem em logs?
- cache foi considerado?
- CORS está restrito?
- erros de API são padronizados?
- curl consegue reproduzir o problema?

