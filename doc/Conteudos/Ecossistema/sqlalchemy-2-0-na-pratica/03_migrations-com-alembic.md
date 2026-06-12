# Migrations com Alembic

Versione o schema do banco de forma reproduzível.

> **Tema:** ORM · **Nível:** avancado · **Trilha:** SQLAlchemy 2.0 na Prática

## Conceitos-chave

Nesta lição você vai entender:

- **alembic init e autogenerate**
- **revisões versionadas (upgrade/downgrade)**
- **Revise migrations geradas antes de aplicar**
- **Integre ao pipeline de deploy**

## Exemplo prático

```python
# alembic revision --autogenerate -m 'add users'
# alembic upgrade head
def upgrade():
    op.create_table('users', sa.Column('id', sa.Integer, primary_key=True))
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Nunca edite migrations já aplicadas em produção
- Teste upgrade e downgrade

## Pratique

Para fixar, escreva um pequeno script que combine **alembic init e autogenerate** e **revisões versionadas (upgrade/downgrade)** em um caso do seu dia a dia. Depois refatore aplicando "Nunca edite migrations já aplicadas em produção".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: alembic init e autogenerate
- [ ] Explicar e aplicar: revisões versionadas (upgrade/downgrade)
- [ ] Explicar e aplicar: Revise migrations geradas antes de aplicar
- [ ] Explicar e aplicar: Integre ao pipeline de deploy

## Saiba mais

- [Documentação oficial](https://alembic.sqlalchemy.org/)
