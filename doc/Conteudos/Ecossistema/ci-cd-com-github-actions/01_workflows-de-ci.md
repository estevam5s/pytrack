# Workflows de CI

Automatize lint, testes e build a cada push.

## Pontos-chave

- Eventos (push, pull_request)
- Jobs e steps
- Cache de dependências
- Matriz de versões

## Exemplo

```python
name: ci
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pip install -e '.[dev]'
      - run: ruff check . && pytest
```

## Boas práticas

- Falhe rápido: lint e testes primeiro
- Use secrets do GitHub

## Saiba mais

- [Documentação oficial](https://docs.github.com/actions)
