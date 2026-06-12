# Aiohttp, Clientes HTTP e APIs Assíncronas

`aiohttp` permite criar clientes e servidores HTTP assíncronos. Este arquivo foca no uso profissional para chamadas concorrentes, timeouts, sessões, retries, paginação, rate limit e consumo de APIs.

---

## Sumário

1. [Quando Usar Aiohttp](#quando-usar-aiohttp)
2. [Cliente HTTP Básico](#cliente-http-básico)
3. [Sessões](#sessões)
4. [Chamadas Concorrentes](#chamadas-concorrentes)
5. [Timeouts](#timeouts)
6. [Tratamento de Erros](#tratamento-de-erros)
7. [Retry e Backoff](#retry-e-backoff)
8. [Rate Limit e Semáforos](#rate-limit-e-semáforos)
9. [Paginação](#paginação)
10. [Servidor Aiohttp](#servidor-aiohttp)
11. [HTTPX em Relação ao Aiohttp](#httpx-em-relação-ao-aiohttp)
12. [Boas Práticas](#boas-práticas)
13. [Exercícios](#exercícios)

---

## Quando Usar Aiohttp

Use `aiohttp` quando você precisa:

- fazer muitas chamadas HTTP;
- consultar APIs externas;
- baixar muitos recursos;
- consumir endpoints com latência;
- criar cliente HTTP assíncrono;
- construir servidor async leve.

Para poucas chamadas simples, `requests` pode ser suficiente.

---

## Cliente HTTP Básico

```python
import aiohttp
import asyncio

async def buscar_json(url: str) -> dict:
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            response.raise_for_status()
            return await response.json()

async def main():
    dados = await buscar_json("https://api.github.com")
    print(dados)

asyncio.run(main())
```

`await response.json()` é assíncrono porque lê corpo da resposta.

---

## Sessões

Não crie uma sessão para cada request em lote. Reutilize `ClientSession`.

```python
async def buscar_usuario(session: aiohttp.ClientSession, user_id: int) -> dict:
    url = f"https://example.com/users/{user_id}"
    async with session.get(url) as response:
        response.raise_for_status()
        return await response.json()

async def main():
    async with aiohttp.ClientSession() as session:
        usuario = await buscar_usuario(session, 1)
        print(usuario)
```

Sessão gerencia conexões, pooling e recursos.

---

## Chamadas Concorrentes

```python
async def main():
    ids = range(1, 101)

    async with aiohttp.ClientSession() as session:
        resultados = await asyncio.gather(
            *(buscar_usuario(session, user_id) for user_id in ids)
        )

    print(len(resultados))
```

Isso dispara muitas chamadas. Em produção, limite concorrência.

---

## Timeouts

```python
timeout = aiohttp.ClientTimeout(total=10, connect=3, sock_read=5)

async with aiohttp.ClientSession(timeout=timeout) as session:
    ...
```

Timeouts importantes:

- total;
- conexão;
- leitura;
- pool.

Sem timeout, uma chamada pode travar o pipeline por tempo indeterminado.

---

## Tratamento de Erros

```python
async def buscar_json(session: aiohttp.ClientSession, url: str) -> dict:
    try:
        async with session.get(url) as response:
            response.raise_for_status()
            return await response.json()
    except aiohttp.ClientResponseError as erro:
        raise RuntimeError(f"HTTP inválido: {erro.status}") from erro
    except aiohttp.ClientError as erro:
        raise RuntimeError("falha de cliente HTTP") from erro
    except asyncio.TimeoutError as erro:
        raise RuntimeError("timeout HTTP") from erro
```

Trate:

- status HTTP;
- timeout;
- conexão;
- JSON inválido;
- rate limit;
- autenticação.

---

## Retry e Backoff

```python
import random

async def buscar_com_retry(session, url, tentativas=3):
    ultimo_erro = None

    for tentativa in range(1, tentativas + 1):
        try:
            async with session.get(url) as response:
                if response.status in {429, 500, 502, 503, 504}:
                    raise aiohttp.ClientResponseError(
                        request_info=response.request_info,
                        history=response.history,
                        status=response.status,
                        message="erro recuperável",
                        headers=response.headers,
                    )
                response.raise_for_status()
                return await response.json()
        except (aiohttp.ClientError, asyncio.TimeoutError) as erro:
            ultimo_erro = erro
            if tentativa == tentativas:
                break
            espera = min(2 ** tentativa, 30) + random.random()
            await asyncio.sleep(espera)

    raise RuntimeError(f"falha após {tentativas} tentativas") from ultimo_erro
```

Retry deve ser usado para falhas transitórias, não para erro permanente de validação.

---

## Rate Limit e Semáforos

```python
async def buscar_limitado(session, semaforo, url):
    async with semaforo:
        return await buscar_com_retry(session, url)

async def main():
    semaforo = asyncio.Semaphore(10)
    urls = [f"https://example.com/items/{i}" for i in range(1000)]

    async with aiohttp.ClientSession() as session:
        resultados = await asyncio.gather(
            *(buscar_limitado(session, semaforo, url) for url in urls)
        )
```

Concorrência sem limite pode derrubar sua aplicação ou violar limites da API.

---

## Paginação

```python
async def coletar_paginas(session, base_url: str):
    pagina = 1

    while True:
        url = f"{base_url}?page={pagina}"
        dados = await buscar_com_retry(session, url)
        itens = dados.get("items", [])

        if not itens:
            break

        for item in itens:
            yield item

        pagina += 1
```

Uso:

```python
async with aiohttp.ClientSession() as session:
    async for item in coletar_paginas(session, "https://example.com/api"):
        print(item)
```

---

## Servidor Aiohttp

```python
from aiohttp import web

async def health(request):
    return web.json_response({"status": "ok"})

app = web.Application()
app.router.add_get("/health", health)

if __name__ == "__main__":
    web.run_app(app, port=8080)
```

Para APIs modernas, FastAPI costuma ser mais comum, mas `aiohttp.web` é útil e direto.

---

## HTTPX em Relação ao Aiohttp

`httpx` também é um cliente HTTP moderno com suporte síncrono e assíncrono. Ele é muito usado quando você quer uma API parecida com `requests`, mas com suporte a async.

Exemplo:

```python
import asyncio
import httpx

async def buscar_json(url: str) -> dict:
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(url)
        response.raise_for_status()
        return response.json()

asyncio.run(buscar_json("https://api.github.com"))
```

Comparação prática:

| Critério | `aiohttp` | `httpx` |
| --- | --- | --- |
| Cliente async | Sim | Sim |
| Cliente síncrono na mesma lib | Não como foco principal | Sim |
| API parecida com `requests` | Menos | Mais |
| Servidor HTTP | Sim, com `aiohttp.web` | Não é o foco |
| Uso comum | clientes e servidores async | clientes HTTP sync/async, testes e SDKs |

Para exemplos completos de `httpx`, veja `08_clientes_drivers_async.md`.

---

## Boas Práticas

- Reutilize `ClientSession`.
- Defina timeout.
- Limite concorrência.
- Trate status HTTP explicitamente.
- Use retry apenas para erro transitório.
- Respeite rate limit.
- Não bloqueie o event loop.
- Registre latência, status e quantidade de retries.
- Cuidado com payloads muito grandes em memória.

---

## Exercícios

1. Crie cliente `aiohttp` para buscar JSON.
2. Reutilize `ClientSession`.
3. Faça 50 chamadas concorrentes.
4. Adicione timeout.
5. Adicione retry com backoff.
6. Controle concorrência com semáforo.
7. Implemente paginação assíncrona.
8. Crie servidor `aiohttp` com rota `/health`.
9. Reescreva o cliente básico usando `httpx.AsyncClient`.
