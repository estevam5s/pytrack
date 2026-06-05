# JWT e OAuth2

Proteja APIs com tokens e fluxos padronizados.

## Pontos-chave

- JWT assinado com claims e expiração
- OAuth2 password e authorization code
- Hash de senha com bcrypt
- Refresh tokens

## Exemplo

```python
from passlib.hash import bcrypt
hash = bcrypt.hash('senha')
assert bcrypt.verify('senha', hash)
```

## Boas práticas

- Expiração curta + refresh
- Nunca guarde senha em texto puro

## Saiba mais

- [Documentação oficial](https://fastapi.tiangolo.com/tutorial/security/)
