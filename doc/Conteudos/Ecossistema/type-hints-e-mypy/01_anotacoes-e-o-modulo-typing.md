# Anotações e o módulo typing

Tipagem estática melhora legibilidade e captura erros cedo.

> **Tema:** Tipagem · **Nível:** intermediario · **Trilha:** Type Hints e mypy

## Conceitos-chave

Nesta lição você vai entender:

- **Anotações em variáveis, parâmetros e retorno**
- **Optional, Union, Literal, TypedDict**
- **Generics com TypeVar**
- **Protocols (tipagem estrutural)**

## Exemplo prático

```python
from typing import Protocol

class Repo(Protocol):
    def salvar(self, x: dict) -> None: ...

def usar(repo: Repo, dado: dict) -> None:
    repo.salvar(dado)
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Tipe APIs públicas primeiro
- Ative mypy no CI

## Pratique

Para fixar, escreva um pequeno script que combine **anotações em variáveis, parâmetros e retorno** e **optional, union, literal, typeddict** em um caso do seu dia a dia. Depois refatore aplicando "Tipe APIs públicas primeiro".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Anotações em variáveis, parâmetros e retorno
- [ ] Explicar e aplicar: Optional, Union, Literal, TypedDict
- [ ] Explicar e aplicar: Generics com TypeVar
- [ ] Explicar e aplicar: Protocols (tipagem estrutural)

## Saiba mais

- [Documentação oficial](https://mypy.readthedocs.io/)
