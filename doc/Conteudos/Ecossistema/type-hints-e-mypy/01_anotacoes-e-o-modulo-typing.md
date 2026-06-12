# Anotações e o módulo typing

Tipagem estática melhora legibilidade e captura erros cedo.

## Pontos-chave

- Anotações em variáveis, parâmetros e retorno
- Optional, Union, Literal, TypedDict
- Generics com TypeVar
- Protocols (tipagem estrutural)

## Exemplo

```python
from typing import Protocol

class Repo(Protocol):
    def salvar(self, x: dict) -> None: ...

def usar(repo: Repo, dado: dict) -> None:
    repo.salvar(dado)
```

## Boas práticas

- Tipe APIs públicas primeiro
- Ative mypy no CI

## Saiba mais

- [Documentação oficial](https://mypy.readthedocs.io/)
