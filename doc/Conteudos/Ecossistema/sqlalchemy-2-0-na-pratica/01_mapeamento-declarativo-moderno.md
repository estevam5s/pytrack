# Mapeamento declarativo moderno

O estilo 2.0 usa DeclarativeBase, Mapped e mapped_column para modelos tipados.

> **Tema:** ORM · **Nível:** avancado · **Trilha:** SQLAlchemy 2.0 na Prática

## Conceitos-chave

Nesta lição você vai entender:

- **DeclarativeBase + Mapped[tipo] para tipagem**
- **Engine, Session e o padrão de unidade de trabalho**
- **Relacionamentos com relationship()**
- **select() em vez de query() legado**

## Exemplo prático

```python
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

class Base(DeclarativeBase): pass

class User(Base):
    __tablename__ = 'users'
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(unique=True)
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Use sessões com escopo curto (context manager)
- Evite acessar atributos lazy fora da sessão

## Pratique

Para fixar, escreva um pequeno script que combine **declarativebase + mapped[tipo] para tipagem** e **engine, session e o padrão de unidade de trabalho** em um caso do seu dia a dia. Depois refatore aplicando "Use sessões com escopo curto (context manager)".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: DeclarativeBase + Mapped[tipo] para tipagem
- [ ] Explicar e aplicar: Engine, Session e o padrão de unidade de trabalho
- [ ] Explicar e aplicar: Relacionamentos com relationship()
- [ ] Explicar e aplicar: select() em vez de query() legado

## Saiba mais

- [Documentação oficial](https://docs.sqlalchemy.org/en/20/)
