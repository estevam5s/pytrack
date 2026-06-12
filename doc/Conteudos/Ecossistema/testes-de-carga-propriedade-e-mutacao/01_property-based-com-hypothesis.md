# Property-based com Hypothesis

Em vez de exemplos fixos, gere centenas de entradas e teste invariantes.

> **Tema:** Testes · **Nível:** avancado · **Trilha:** Testes de Carga, Propriedade e Mutação

## Conceitos-chave

Nesta lição você vai entender:

- **@given gera dados aleatórios estruturados**
- **Strategies descrevem o espaço de entradas**
- **Hypothesis encolhe (shrink) o contra-exemplo mínimo**
- **Ótimo para encontrar casos de borda esquecidos**

## Exemplo prático

```python
from hypothesis import given, strategies as st

@given(st.lists(st.integers()))
def test_reverso_duplo(xs):
    assert list(reversed(list(reversed(xs)))) == xs
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Teste invariantes (propriedades), não saídas exatas
- Deixe o Hypothesis achar o menor caso que quebra

## Pratique

Para fixar, escreva um pequeno script que combine **@given gera dados aleatórios estruturados** e **strategies descrevem o espaço de entradas** em um caso do seu dia a dia. Depois refatore aplicando "Teste invariantes (propriedades), não saídas exatas".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: @given gera dados aleatórios estruturados
- [ ] Explicar e aplicar: Strategies descrevem o espaço de entradas
- [ ] Explicar e aplicar: Hypothesis encolhe (shrink) o contra-exemplo mínimo
- [ ] Explicar e aplicar: Ótimo para encontrar casos de borda esquecidos

## Saiba mais

- [Documentação oficial](https://hypothesis.readthedocs.io/)
