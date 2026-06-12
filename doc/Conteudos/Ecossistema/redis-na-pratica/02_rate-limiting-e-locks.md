# Rate limiting e locks

Use Redis para limitar requisições e coordenar processos.

## Pontos-chave

- INCR + EXPIRE para janela fixa
- Locks distribuídos com SET NX
- Filas simples com listas (LPUSH/BRPOP)
- Pub/Sub para eventos em tempo real

## Exemplo

```python
async def allow(r, key, limit, window):
    n = await r.incr(key)
    if n == 1:
        await r.expire(key, window)
    return n <= limit
```

## Boas práticas

- Cuidado com locks sem expiração (deadlock)
- Monitore memória e política de evicção

## Saiba mais

- [Documentação oficial](https://redis.io/docs/manual/patterns/)
