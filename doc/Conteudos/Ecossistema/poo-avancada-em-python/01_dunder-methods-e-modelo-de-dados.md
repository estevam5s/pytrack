# Dunder methods e modelo de dados

Métodos especiais (dunder) integram seus objetos à linguagem: operadores, iteração e contexto.

> **Tema:** POO · **Nível:** avancado · **Trilha:** POO Avançada em Python

## Conceitos-chave

Nesta lição você vai entender:

- **__init__, __repr__, __eq__ e __hash__**
- **__len__, __getitem__, __iter__ para coleções**
- **__enter__/__exit__ para context managers**
- **Sobrecarga de operadores com __add__ etc.**

## Exemplo prático

```python
class Vetor:
    def __init__(self, x, y): self.x, self.y = x, y
    def __add__(self, o): return Vetor(self.x + o.x, self.y + o.y)
    def __repr__(self): return f'Vetor({self.x}, {self.y})'

print(Vetor(1, 2) + Vetor(3, 4))
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Implemente __repr__ em toda classe
- __eq__ e __hash__ andam juntos

## Pratique

Para fixar, escreva um pequeno script que combine **__init__, __repr__, __eq__ e __hash__** e **__len__, __getitem__, __iter__ para coleções** em um caso do seu dia a dia. Depois refatore aplicando "Implemente __repr__ em toda classe".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: __init__, __repr__, __eq__ e __hash__
- [ ] Explicar e aplicar: __len__, __getitem__, __iter__ para coleções
- [ ] Explicar e aplicar: __enter__/__exit__ para context managers
- [ ] Explicar e aplicar: Sobrecarga de operadores com __add__ etc.

## Saiba mais

- [Documentação oficial](https://docs.python.org/3/reference/datamodel.html)
