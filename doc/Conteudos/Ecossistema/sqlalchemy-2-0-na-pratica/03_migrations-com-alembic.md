# Migrations com Alembic

Versione o schema do banco de forma reproduzível.

## Pontos-chave

- alembic init e autogenerate
- revisões versionadas (upgrade/downgrade)
- Revise migrations geradas antes de aplicar
- Integre ao pipeline de deploy

## Exemplo

```python
# alembic revision --autogenerate -m 'add users'
# alembic upgrade head
def upgrade():
    op.create_table('users', sa.Column('id', sa.Integer, primary_key=True))
```

## Boas práticas

- Nunca edite migrations já aplicadas em produção
- Teste upgrade e downgrade

## Saiba mais

- [Documentação oficial](https://alembic.sqlalchemy.org/)
