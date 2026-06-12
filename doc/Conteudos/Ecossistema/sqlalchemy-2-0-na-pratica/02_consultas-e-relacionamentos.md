# Consultas e relacionamentos

Selects, joins e carregamento eager para evitar N+1.

> **Tema:** ORM · **Nível:** avancado · **Trilha:** SQLAlchemy 2.0 na Prática

## Conceitos-chave

Nesta lição você vai entender:

- **select(), where(), join() e order_by()**
- **selectinload/joinedload para eager loading**
- **scalars() para obter objetos**
- **Transações explícitas com session.begin()**

## Exemplo prático

```python
from sqlalchemy import select
from sqlalchemy.orm import selectinload

stmt = select(User).options(selectinload(User.posts)).where(User.email == 'a@x.com')
usuarios = session.scalars(stmt).all()
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Resolva N+1 com eager loading consciente
- Meça queries com echo=True em dev

## Pratique

Para fixar, escreva um pequeno script que combine **select(), where(), join() e order_by()** e **selectinload/joinedload para eager loading** em um caso do seu dia a dia. Depois refatore aplicando "Resolva N+1 com eager loading consciente".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: select(), where(), join() e order_by()
- [ ] Explicar e aplicar: selectinload/joinedload para eager loading
- [ ] Explicar e aplicar: scalars() para obter objetos
- [ ] Explicar e aplicar: Transações explícitas com session.begin()

## Saiba mais

- [Documentação oficial](https://docs.sqlalchemy.org/en/20/orm/queryguide/)
