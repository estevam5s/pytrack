# JWT e OAuth2

Proteja APIs com tokens e fluxos padronizados.

> **Tema:** Segurança · **Nível:** avancado · **Trilha:** Autenticação e Autorização

## Conceitos-chave

Nesta lição você vai entender:

- **JWT assinado com claims e expiração**
- **OAuth2 password e authorization code**
- **Hash de senha com bcrypt**
- **Refresh tokens**

## Exemplo prático

```python
from passlib.hash import bcrypt
hash = bcrypt.hash('senha')
assert bcrypt.verify('senha', hash)
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Expiração curta + refresh
- Nunca guarde senha em texto puro

## Pratique

Para fixar, escreva um pequeno script que combine **jwt assinado com claims e expiração** e **oauth2 password e authorization code** em um caso do seu dia a dia. Depois refatore aplicando "Expiração curta + refresh".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: JWT assinado com claims e expiração
- [ ] Explicar e aplicar: OAuth2 password e authorization code
- [ ] Explicar e aplicar: Hash de senha com bcrypt
- [ ] Explicar e aplicar: Refresh tokens

## Saiba mais

- [Documentação oficial](https://fastapi.tiangolo.com/tutorial/security/)
