# Dunder methods e modelo de dados

Métodos especiais (dunder) integram seus objetos à linguagem: operadores, iteração e contexto.

## Pontos-chave

- __init__, __repr__, __eq__ e __hash__
- __len__, __getitem__, __iter__ para coleções
- __enter__/__exit__ para context managers
- Sobrecarga de operadores com __add__ etc.

## Exemplo

```python
class Vetor:
    def __init__(self, x, y): self.x, self.y = x, y
    def __add__(self, o): return Vetor(self.x + o.x, self.y + o.y)
    def __repr__(self): return f'Vetor({self.x}, {self.y})'

print(Vetor(1, 2) + Vetor(3, 4))
```

## Boas práticas

- Implemente __repr__ em toda classe
- __eq__ e __hash__ andam juntos

## Saiba mais

- [Documentação oficial](https://docs.python.org/3/reference/datamodel.html)
