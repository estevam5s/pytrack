# Lint e formatação ultrarrápidos

Ruff substitui flake8, isort e black com performance em Rust.

## Pontos-chave

- Lint + format em um só tool
- Regras configuráveis em pyproject.toml
- Autofix de muitos problemas
- Integração com pre-commit e CI

## Exemplo

```python
# pyproject.toml
[tool.ruff]
line-length = 100
[tool.ruff.lint]
select = ['E', 'F', 'I', 'UP']
# ruff check --fix .  e  ruff format .
```

## Boas práticas

- Rode ruff no pre-commit e no CI
- Padronize a config em pyproject.toml

## Saiba mais

- [Documentação oficial](https://docs.astral.sh/ruff/)
