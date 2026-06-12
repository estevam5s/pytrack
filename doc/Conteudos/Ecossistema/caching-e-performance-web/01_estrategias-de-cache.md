# Estratégias de cache

Reduza latência e carga com cache consciente.

## Pontos-chave

- Cache-aside, write-through e write-behind
- Invalidação e TTL
- Cache em camadas (CDN, app, DB)
- Cache de respostas HTTP

## Exemplo

```python
import redis
r = redis.Redis()

def get_user(uid):
    cached = r.get(f'u:{uid}')
    if cached:
        return cached
    user = db_buscar(uid)
    r.set(f'u:{uid}', user, ex=300)
    return user
```

## Boas práticas

- Planeje a invalidação
- Meça hit ratio

## Saiba mais

- [Documentação oficial](https://redis.io/docs/manual/patterns/)
