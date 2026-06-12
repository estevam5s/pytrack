# Mapeamento declarativo moderno

O estilo 2.0 usa DeclarativeBase, Mapped e mapped_column para modelos tipados.

## Pontos-chave

- DeclarativeBase + Mapped[tipo] para tipagem
- Engine, Session e o padrão de unidade de trabalho
- Relacionamentos com relationship()
- select() em vez de query() legado

## Exemplo

```python
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

class Base(DeclarativeBase): pass

class User(Base):
    __tablename__ = 'users'
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(unique=True)
```

## Boas práticas

- Use sessões com escopo curto (context manager)
- Evite acessar atributos lazy fora da sessão

## Saiba mais

- [Documentação oficial](https://docs.sqlalchemy.org/en/20/)
