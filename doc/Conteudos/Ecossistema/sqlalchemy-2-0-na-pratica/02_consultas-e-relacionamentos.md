# Consultas e relacionamentos

Selects, joins e carregamento eager para evitar N+1.

## Pontos-chave

- select(), where(), join() e order_by()
- selectinload/joinedload para eager loading
- scalars() para obter objetos
- Transações explícitas com session.begin()

## Exemplo

```python
from sqlalchemy import select
from sqlalchemy.orm import selectinload

stmt = select(User).options(selectinload(User.posts)).where(User.email == 'a@x.com')
usuarios = session.scalars(stmt).all()
```

## Boas práticas

- Resolva N+1 com eager loading consciente
- Meça queries com echo=True em dev

## Saiba mais

- [Documentação oficial](https://docs.sqlalchemy.org/en/20/orm/queryguide/)
