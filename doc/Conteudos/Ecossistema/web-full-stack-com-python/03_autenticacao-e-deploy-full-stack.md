# Autenticação e deploy full-stack

Sessões, senhas com hash e deploy de uma app full-stack Python.

> **Tema:** Web · **Nível:** intermediario · **Trilha:** Web Full-Stack com Python

## Conceitos-chave

Nesta lição você vai entender:

- **Sessões com cookies assinados**
- **Hash de senha com passlib/bcrypt**
- **Middleware de autenticação**
- **Deploy com Uvicorn/Gunicorn atrás de Nginx**

## Exemplo prático

```python
from passlib.hash import bcrypt

hashed = bcrypt.hash('senha123')
assert bcrypt.verify('senha123', hashed)
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Nunca armazene senha em texto puro
- Use HTTPS e cookies HttpOnly/Secure

## Pratique

Para fixar, escreva um pequeno script que combine **sessões com cookies assinados** e **hash de senha com passlib/bcrypt** em um caso do seu dia a dia. Depois refatore aplicando "Nunca armazene senha em texto puro".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Sessões com cookies assinados
- [ ] Explicar e aplicar: Hash de senha com passlib/bcrypt
- [ ] Explicar e aplicar: Middleware de autenticação
- [ ] Explicar e aplicar: Deploy com Uvicorn/Gunicorn atrás de Nginx

## Saiba mais

- [Documentação oficial](https://fastapi.tiangolo.com/tutorial/security/)
