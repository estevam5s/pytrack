# Rate limiting e locks

Use Redis para limitar requisições e coordenar processos.

> **Tema:** Cache & Filas · **Nível:** intermediario · **Trilha:** Redis na Prática

## Conceitos-chave

Nesta lição você vai entender:

- **INCR + EXPIRE para janela fixa**
- **Locks distribuídos com SET NX**
- **Filas simples com listas (LPUSH/BRPOP)**
- **Pub/Sub para eventos em tempo real**

## Exemplo prático

```python
async def allow(r, key, limit, window):
    n = await r.incr(key)
    if n == 1:
        await r.expire(key, window)
    return n <= limit
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Cuidado com locks sem expiração (deadlock)
- Monitore memória e política de evicção

## Pratique

Para fixar, escreva um pequeno script que combine **incr + expire para janela fixa** e **locks distribuídos com set nx** em um caso do seu dia a dia. Depois refatore aplicando "Cuidado com locks sem expiração (deadlock)".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: INCR + EXPIRE para janela fixa
- [ ] Explicar e aplicar: Locks distribuídos com SET NX
- [ ] Explicar e aplicar: Filas simples com listas (LPUSH/BRPOP)
- [ ] Explicar e aplicar: Pub/Sub para eventos em tempo real

## Saiba mais

- [Documentação oficial](https://redis.io/docs/manual/patterns/)
