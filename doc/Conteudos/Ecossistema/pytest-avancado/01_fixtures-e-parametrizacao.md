# Fixtures e parametrização

Recursos do pytest para testes limpos e abrangentes.

> **Tema:** Testes · **Nível:** intermediario · **Trilha:** Pytest Avançado

## Conceitos-chave

Nesta lição você vai entender:

- **Fixtures para setup/teardown**
- **Escopo de fixtures (function/module/session)**
- **@pytest.mark.parametrize**
- **conftest.py compartilhado**

## Exemplo prático

```python
import pytest

@pytest.fixture
def cliente():
    return {'saldo': 100}

@pytest.mark.parametrize('valor,ok', [(50, True), (200, False)])
def test_saque(cliente, valor, ok):
    assert (valor <= cliente['saldo']) == ok
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Teste comportamento, não implementação
- Mantenha fixtures pequenas

## Pratique

Para fixar, escreva um pequeno script que combine **fixtures para setup/teardown** e **escopo de fixtures (function/module/session)** em um caso do seu dia a dia. Depois refatore aplicando "Teste comportamento, não implementação".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Fixtures para setup/teardown
- [ ] Explicar e aplicar: Escopo de fixtures (function/module/session)
- [ ] Explicar e aplicar: @pytest.mark.parametrize
- [ ] Explicar e aplicar: conftest.py compartilhado

## Saiba mais

- [Documentação oficial](https://docs.pytest.org/)
