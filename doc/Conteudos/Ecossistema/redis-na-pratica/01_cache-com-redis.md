# Cache com Redis

Redis é um armazenamento em memória usado para cache, filas, locks e pub/sub.

> **Tema:** Cache & Filas · **Nível:** intermediario · **Trilha:** Redis na Prática

## Conceitos-chave

Nesta lição você vai entender:

- **Strings, hashes, lists, sets e sorted sets**
- **TTL e expiração para cache**
- **Padrão cache-aside**
- **Cliente redis-py (sync e async)**

## Exemplo prático

```python
import redis
r = redis.Redis()
r.set('user:1', 'Ana', ex=60)  # expira em 60s
print(r.get('user:1'))
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Defina TTL para evitar cache infinito
- Planeje a invalidação do cache

## Pratique

Para fixar, escreva um pequeno script que combine **strings, hashes, lists, sets e sorted sets** e **ttl e expiração para cache** em um caso do seu dia a dia. Depois refatore aplicando "Defina TTL para evitar cache infinito".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Strings, hashes, lists, sets e sorted sets
- [ ] Explicar e aplicar: TTL e expiração para cache
- [ ] Explicar e aplicar: Padrão cache-aside
- [ ] Explicar e aplicar: Cliente redis-py (sync e async)

## Saiba mais

- [Documentação oficial](https://redis.io/docs/)
