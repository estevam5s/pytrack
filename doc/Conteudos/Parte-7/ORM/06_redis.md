# Redis: Cache, Filas, Locks e Estruturas em Memória

Redis é um banco em memória usado para cache, sessões, filas simples, rate limit, locks distribuídos, contadores, rankings, pub/sub e armazenamento temporário de baixa latência.

Redis é rápido, mas não deve ser tratado como solução mágica. É preciso entender expiração, persistência, memória, concorrência, atomicidade e invalidação de cache.

---

## Instalação do Cliente

```bash
pip install redis
```

Conexão:

```python
import redis


r = redis.Redis(host="localhost", port=6379, db=0, decode_responses=True)
r.set("ping", "pong")
print(r.get("ping"))
```

---

## Strings

```python
r.set("usuario:1:nome", "Ana")
nome = r.get("usuario:1:nome")
```

Com expiração:

```python
r.setex("token:abc", 3600, "dados")
```

Incremento atômico:

```python
r.incr("contador:visitas")
```

---

## Hashes

```python
r.hset("usuario:1", mapping={
    "nome": "Ana",
    "email": "ana@example.com",
    "plano": "pro",
})

usuario = r.hgetall("usuario:1")
```

Hashes são úteis para objetos pequenos.

---

## Lists como Fila Simples

Produtor:

```python
r.lpush("fila:emails", "email-123")
```

Consumidor:

```python
tarefa = r.brpop("fila:emails", timeout=10)
```

Para filas críticas, avalie Redis Streams, Celery/RQ ou broker dedicado.

---

## Sets

```python
r.sadd("usuario:1:permissoes", "admin", "relatorios")
r.sismember("usuario:1:permissoes", "admin")
```

Útil para permissões, tags e deduplicação.

---

## Sorted Sets

```python
r.zadd("ranking:vendas", {"ana": 1500, "bruno": 900})
top = r.zrevrange("ranking:vendas", 0, 9, withscores=True)
```

Use para rankings, prioridades e timelines simples.

---

## Cache Aside

Padrão comum:

1. tenta ler do cache;
2. se não existe, busca no banco;
3. salva no cache com TTL;
4. retorna.

```python
import json


def buscar_cliente(cliente_id: int) -> dict:
    chave = f"cliente:{cliente_id}"
    cached = r.get(chave)
    if cached:
        return json.loads(cached)

    cliente = buscar_cliente_no_banco(cliente_id)
    r.setex(chave, 300, json.dumps(cliente))
    return cliente
```

---

## Invalidação de Cache

```python
def atualizar_cliente(cliente_id: int, dados: dict) -> None:
    atualizar_cliente_no_banco(cliente_id, dados)
    r.delete(f"cliente:{cliente_id}")
```

Estratégias:

- TTL curto;
- invalidação explícita;
- versionamento de chave;
- cache por evento;
- stale-while-revalidate em cenários específicos.

O problema mais difícil de cache é invalidar corretamente.

---

## Rate Limit

```python
def permitir_requisicao(usuario_id: int, limite: int = 100, janela: int = 60) -> bool:
    chave = f"rate:{usuario_id}"
    atual = r.incr(chave)
    if atual == 1:
        r.expire(chave, janela)
    return atual <= limite
```

Esse modelo é simples. Para precisão maior, use sliding window com sorted sets ou algoritmos especializados.

---

## Lock Distribuído Simples

```python
import uuid


def adquirir_lock(chave: str, ttl: int = 30) -> str | None:
    token = str(uuid.uuid4())
    ok = r.set(chave, token, nx=True, ex=ttl)
    return token if ok else None


def liberar_lock(chave: str, token: str) -> None:
    script = """
    if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
    else
        return 0
    end
    """
    r.eval(script, 1, chave, token)
```

O token evita apagar lock de outra execução.

---

## Redis Streams

Produtor:

```python
r.xadd("stream:pedidos", {"pedido_id": "100", "evento": "criado"})
```

Consumidor simples:

```python
mensagens = r.xread({"stream:pedidos": "0-0"}, count=10, block=1000)
```

Consumer group:

```python
r.xgroup_create("stream:pedidos", "workers", id="0", mkstream=True)

msgs = r.xreadgroup(
    "workers",
    "worker-1",
    {"stream:pedidos": ">"},
    count=10,
    block=5000,
)
```

Streams são melhores que lists para processamento com confirmação e reprocessamento.

---

## Pub/Sub

```python
pubsub = r.pubsub()
pubsub.subscribe("notificacoes")

for mensagem in pubsub.listen():
    print(mensagem)
```

Pub/Sub não é fila persistente. Se o consumidor estiver offline, perde mensagens.

---

## Persistência

Redis pode persistir com:

- RDB snapshots;
- AOF append-only file;
- combinação dos dois.

Para cache puro, perda pode ser aceitável. Para filas e locks críticos, avalie cuidadosamente persistência, replicação e failover.

---

## Checklist Profissional

- chaves têm padrão de nome consistente?
- valores têm TTL quando são temporários?
- cache tem estratégia de invalidação?
- memória máxima e política de eviction estão configuradas?
- locks usam token e TTL?
- filas críticas usam confirmação/reprocessamento?
- dados sensíveis têm proteção?
- Redis tem autenticação e TLS quando necessário?
- métricas de hit rate e memória são monitoradas?
- o sistema funciona se o cache cair?

