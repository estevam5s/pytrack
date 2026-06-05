# Fixtures e parametrização

Recursos do pytest para testes limpos e abrangentes.

## Pontos-chave

- Fixtures para setup/teardown
- Escopo de fixtures (function/module/session)
- @pytest.mark.parametrize
- conftest.py compartilhado

## Exemplo

```python
import pytest

@pytest.fixture
def cliente():
    return {'saldo': 100}

@pytest.mark.parametrize('valor,ok', [(50, True), (200, False)])
def test_saque(cliente, valor, ok):
    assert (valor <= cliente['saldo']) == ok
```

## Boas práticas

- Teste comportamento, não implementação
- Mantenha fixtures pequenas

## Saiba mais

- [Documentação oficial](https://docs.pytest.org/)
