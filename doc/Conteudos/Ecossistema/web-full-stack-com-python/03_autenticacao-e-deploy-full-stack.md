# Autenticação e deploy full-stack

Sessões, senhas com hash e deploy de uma app full-stack Python.

## Pontos-chave

- Sessões com cookies assinados
- Hash de senha com passlib/bcrypt
- Middleware de autenticação
- Deploy com Uvicorn/Gunicorn atrás de Nginx

## Exemplo

```python
from passlib.hash import bcrypt

hashed = bcrypt.hash('senha123')
assert bcrypt.verify('senha123', hashed)
```

## Boas práticas

- Nunca armazene senha em texto puro
- Use HTTPS e cookies HttpOnly/Secure

## Saiba mais

- [Documentação oficial](https://fastapi.tiangolo.com/tutorial/security/)
