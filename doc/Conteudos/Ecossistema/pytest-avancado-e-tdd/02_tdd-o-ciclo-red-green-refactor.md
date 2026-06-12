# TDD: o ciclo red-green-refactor

Test-Driven Development guia o design escrevendo o teste antes do código.

> **Tema:** Testes · **Nível:** intermediario · **Trilha:** Pytest Avançado e TDD

## Conceitos-chave

Nesta lição você vai entender:

- **Red: escreva um teste que falha**
- **Green: o código mínimo para passar**
- **Refactor: melhore sem quebrar os testes**
- **Testes viram especificação executável**

## Exemplo prático

```python
# 1) Red
def test_soma():
    assert soma(2, 3) == 5  # soma ainda não existe

# 2) Green
def soma(a, b):
    return a + b

# 3) Refactor com a rede de segurança dos testes
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Escreva o menor teste que captura o próximo comportamento
- Refatore só com a suíte verde

## Pratique

Para fixar, escreva um pequeno script que combine **red: escreva um teste que falha** e **green: o código mínimo para passar** em um caso do seu dia a dia. Depois refatore aplicando "Escreva o menor teste que captura o próximo comportamento".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Red: escreva um teste que falha
- [ ] Explicar e aplicar: Green: o código mínimo para passar
- [ ] Explicar e aplicar: Refactor: melhore sem quebrar os testes
- [ ] Explicar e aplicar: Testes viram especificação executável

## Saiba mais

- [Documentação oficial](https://docs.pytest.org/en/stable/explanation/goodpractices.html)
