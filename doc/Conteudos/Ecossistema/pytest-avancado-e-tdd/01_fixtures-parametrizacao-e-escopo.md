# Fixtures, parametrização e escopo

Pytest escala de testes simples a suítes complexas com fixtures reutilizáveis.

> **Tema:** Testes · **Nível:** intermediario · **Trilha:** Pytest Avançado e TDD

## Conceitos-chave

Nesta lição você vai entender:

- **@pytest.fixture injeta dependências nos testes**
- **scope (function/module/session) controla o ciclo de vida**
- **@pytest.mark.parametrize roda o mesmo teste com vários dados**
- **conftest.py compartilha fixtures entre arquivos**

## Exemplo prático

```python
import pytest

@pytest.fixture
def carrinho():
    return Carrinho()

@pytest.mark.parametrize('itens,total', [([10,20],30), ([],0)])
def test_total(carrinho, itens, total):
    for i in itens: carrinho.add(i)
    assert carrinho.total() == total
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Fixtures pequenas e compostas são melhores que setups gigantes
- Parametrize para cobrir casos de borda sem duplicar código

## Pratique

Para fixar, escreva um pequeno script que combine **@pytest.fixture injeta dependências nos testes** e **scope (function/module/session) controla o ciclo de vida** em um caso do seu dia a dia. Depois refatore aplicando "Fixtures pequenas e compostas são melhores que setups gigantes".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: @pytest.fixture injeta dependências nos testes
- [ ] Explicar e aplicar: scope (function/module/session) controla o ciclo de vida
- [ ] Explicar e aplicar: @pytest.mark.parametrize roda o mesmo teste com vários dados
- [ ] Explicar e aplicar: conftest.py compartilha fixtures entre arquivos

## Saiba mais

- [Documentação oficial](https://docs.pytest.org/)
