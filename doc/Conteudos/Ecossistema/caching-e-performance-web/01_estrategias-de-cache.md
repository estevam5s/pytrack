# Estratégias de cache

Reduza latência e carga com cache consciente.

> **Tema:** Performance · **Nível:** avancado · **Trilha:** Caching e Performance Web

## Conceitos-chave

Nesta lição você vai entender:

- **Cache-aside, write-through e write-behind**
- **Invalidação e TTL**
- **Cache em camadas (CDN, app, DB)**
- **Cache de respostas HTTP**

## Exemplo prático

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

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Planeje a invalidação
- Meça hit ratio

## Pratique

Para fixar, escreva um pequeno script que combine **cache-aside, write-through e write-behind** e **invalidação e ttl** em um caso do seu dia a dia. Depois refatore aplicando "Planeje a invalidação".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Cache-aside, write-through e write-behind
- [ ] Explicar e aplicar: Invalidação e TTL
- [ ] Explicar e aplicar: Cache em camadas (CDN, app, DB)
- [ ] Explicar e aplicar: Cache de respostas HTTP

## Saiba mais

- [Documentação oficial](https://redis.io/docs/manual/patterns/)
