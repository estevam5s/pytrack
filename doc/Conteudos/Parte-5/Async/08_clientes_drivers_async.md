# Clientes e Drivers Assíncronos: HTTPX, AsyncPG, Aiomysql e Redis

Este módulo cobre bibliotecas assíncronas usadas em sistemas reais: clientes HTTP, drivers de banco e cache. O objetivo é evitar um erro comum: escrever código `async`, mas chamar bibliotecas bloqueantes por dentro.

---

## Sumário

1. [Regra Central](#regra-central)
2. [HTTPX Async](#httpx-async)
3. [HTTPX com Concorrência Controlada](#httpx-com-concorrência-controlada)
4. [Aiohttp vs HTTPX](#aiohttp-vs-httpx)
5. [AsyncPG](#asyncpg)
6. [Aiomysql](#aiomysql)
7. [Redis Asyncio e Aioredis](#redis-asyncio-e-aioredis)
8. [Pool de Conexões](#pool-de-conexões)
9. [Transações e Timeouts](#transações-e-timeouts)
10. [Boas Práticas](#boas-práticas)
11. [Exercícios](#exercícios)

---

## Regra Central

Dentro de uma coroutine, prefira bibliotecas que também sejam assíncronas:

- HTTP: `aiohttp` ou `httpx.AsyncClient`;
- PostgreSQL: `asyncpg`;
- MySQL: `aiomysql`;
- Redis: `redis.asyncio`;
- arquivos locais: normalmente use síncrono ou mova para thread se bloquear muito;
- CPU-bound: use processo, não async.

Errado:

```python
import requests

async def buscar():
    return requests.get("https://example.com").json()
```

`requests.get` bloqueia a thread do event loop.

Correto:

```python
import httpx

async def buscar():
    async with httpx.AsyncClient() as client:
        response = await client.get("https://example.com")
        response.raise_for_status()
        return response.json()
```

---

## HTTPX Async

Instalação:

```bash
python -m pip install httpx
```

Cliente básico:

```python
import asyncio
import httpx

async def buscar_usuario(user_id: int) -> dict:
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(f"https://example.com/users/{user_id}")
        response.raise_for_status()
        return response.json()

asyncio.run(buscar_usuario(1))
```

Reutilize o client em lote:

```python
async def buscar_usuario(client: httpx.AsyncClient, user_id: int) -> dict:
    response = await client.get(f"https://example.com/users/{user_id}")
    response.raise_for_status()
    return response.json()

async def main():
    async with httpx.AsyncClient(timeout=10.0) as client:
        dados = await buscar_usuario(client, 1)
        print(dados)
```

---

## HTTPX com Concorrência Controlada

```python
import asyncio
import httpx

async def buscar_limitado(client, semaforo, url):
    async with semaforo:
        response = await client.get(url)
        response.raise_for_status()
        return response.json()

async def main():
    urls = [f"https://example.com/items/{i}" for i in range(100)]
    semaforo = asyncio.Semaphore(10)

    async with httpx.AsyncClient(timeout=10.0) as client:
        resultados = await asyncio.gather(
            *(buscar_limitado(client, semaforo, url) for url in urls)
        )

    print(len(resultados))
```

`httpx.AsyncClient` também permite configurar limites:

```python
limits = httpx.Limits(max_connections=20, max_keepalive_connections=10)
client = httpx.AsyncClient(timeout=10.0, limits=limits)
```

---

## Aiohttp vs HTTPX

| Critério | `aiohttp` | `httpx` |
| --- | --- | --- |
| Cliente HTTP async | Sim | Sim |
| Servidor HTTP | Sim | Não é o foco |
| API sync e async na mesma biblioteca | Não como foco principal | Sim |
| API parecida com `requests` | Menos | Mais |
| Uso em SDKs | Bom | Muito comum |
| HTTP/2 | Depende de configuração/ecossistema | Suporte via extras |

Escolha prática:

- use `httpx` para clientes HTTP modernos, SDKs internos e código que precisa de versão sync e async;
- use `aiohttp` quando também quer servidor HTTP leve ou já está no ecossistema `aiohttp`;
- em ambos, configure timeout, limite concorrência e reutilize sessão/client.

---

## AsyncPG

`asyncpg` é um driver PostgreSQL assíncrono de alta performance.

Instalação:

```bash
python -m pip install asyncpg
```

Consulta simples:

```python
import asyncio
import asyncpg

async def main():
    conn = await asyncpg.connect("postgresql://user:pass@localhost:5432/app")
    try:
        rows = await conn.fetch("select id, nome from usuarios limit 10")
        for row in rows:
            print(row["id"], row["nome"])
    finally:
        await conn.close()

asyncio.run(main())
```

Com pool:

```python
async def buscar_usuario(pool, user_id: int):
    async with pool.acquire() as conn:
        return await conn.fetchrow(
            "select id, nome from usuarios where id = $1",
            user_id,
        )

async def main():
    pool = await asyncpg.create_pool(
        "postgresql://user:pass@localhost:5432/app",
        min_size=1,
        max_size=10,
    )
    try:
        usuario = await buscar_usuario(pool, 1)
        print(usuario)
    finally:
        await pool.close()
```

Use parâmetros (`$1`, `$2`) e nunca concatene SQL com entrada do usuário.

---

## Aiomysql

`aiomysql` é um driver MySQL assíncrono.

Instalação:

```bash
python -m pip install aiomysql
```

Consulta com pool:

```python
import asyncio
import aiomysql

async def main():
    pool = await aiomysql.create_pool(
        host="localhost",
        port=3306,
        user="app",
        password="secret",
        db="app",
        minsize=1,
        maxsize=10,
        autocommit=True,
    )

    async with pool.acquire() as conn:
        async with conn.cursor(aiomysql.DictCursor) as cursor:
            await cursor.execute(
                "select id, nome from usuarios where ativo = %s",
                (True,),
            )
            usuarios = await cursor.fetchall()
            print(usuarios)

    pool.close()
    await pool.wait_closed()

asyncio.run(main())
```

Use parâmetros (`%s`) em vez de interpolar strings.

---

## Redis Asyncio e Aioredis

`aioredis` foi incorporado ao pacote oficial `redis` em versões modernas. Em projetos novos, prefira `redis.asyncio`.

Instalação:

```bash
python -m pip install redis
```

Uso:

```python
import asyncio
import redis.asyncio as redis

async def main():
    client = redis.Redis.from_url("redis://localhost:6379/0", decode_responses=True)
    try:
        await client.set("usuario:1:nome", "Ana", ex=60)
        nome = await client.get("usuario:1:nome")
        print(nome)
    finally:
        await client.aclose()

asyncio.run(main())
```

Exemplo com lock simples:

```python
async with client.lock("job:relatorio", timeout=300):
    await gerar_relatorio()
```

Redis async é útil para cache, rate limit, locks, filas simples e estado temporário.

---

## Pool de Conexões

Pools evitam abrir conexão a cada operação.

Regras:

- crie o pool na inicialização da aplicação;
- injete o pool nas funções que precisam dele;
- feche o pool no shutdown;
- limite tamanho conforme banco, carga e workers;
- não crie pool dentro de cada request.

Em APIs async, pools normalmente vivem no lifecycle da aplicação.

---

## Transações e Timeouts

Transação com `asyncpg`:

```python
async with pool.acquire() as conn:
    async with conn.transaction():
        await conn.execute("update contas set saldo = saldo - $1 where id = $2", 100, 1)
        await conn.execute("update contas set saldo = saldo + $1 where id = $2", 100, 2)
```

Timeout com `asyncio.timeout`:

```python
import asyncio

async with asyncio.timeout(3):
    usuario = await buscar_usuario(pool, 1)
```

Timeout deve existir em HTTP, banco, cache e chamadas externas.

---

## Boas Práticas

- Não chame bibliotecas síncronas dentro de coroutines sem mover para thread.
- Reutilize clients, sessions e pools.
- Configure timeout em I/O externo.
- Limite concorrência com semáforo, pool ou rate limit.
- Use queries parametrizadas.
- Não mantenha transação aberta durante chamada HTTP externa.
- Feche conexões no shutdown.
- Registre latência, erro, timeout e quantidade de conexões.
- Trate cancelamento e faça limpeza de recursos.

---

## Exercícios

1. Reescreva um cliente `requests` usando `httpx.AsyncClient`.
2. Faça 100 chamadas HTTP com semáforo de 10.
3. Crie consulta PostgreSQL com `asyncpg`.
4. Crie consulta MySQL com `aiomysql`.
5. Crie cache com `redis.asyncio`.
6. Adicione timeout com `asyncio.timeout`.
7. Compare `aiohttp` e `httpx` em um caso real.
8. Explique por que criar pool por request é ruim.
