# pyproject.toml e ambientes

Estruture, isole e publique pacotes Python.

## Pontos-chave

- pyproject.toml centraliza metadados e ferramentas
- venv, pip e pipx
- Poetry/uv para lockfile reprodutível
- Versionamento semântico

## Exemplo

```python
[project]
name = 'meu-pacote'
version = '0.1.0'
requires-python = '>=3.11'
dependencies = ['httpx']
```

## Boas práticas

- Use lockfile para reprodutibilidade
- Mantenha um changelog

## Saiba mais

- [Documentação oficial](https://packaging.python.org/)
