# Cache com Redis

Redis é um armazenamento em memória usado para cache, filas, locks e pub/sub.

## Pontos-chave

- Strings, hashes, lists, sets e sorted sets
- TTL e expiração para cache
- Padrão cache-aside
- Cliente redis-py (sync e async)

## Exemplo

```python
import redis
r = redis.Redis()
r.set('user:1', 'Ana', ex=60)  # expira em 60s
print(r.get('user:1'))
```

## Boas práticas

- Defina TTL para evitar cache infinito
- Planeje a invalidação do cache

## Saiba mais

- [Documentação oficial](https://redis.io/docs/)
