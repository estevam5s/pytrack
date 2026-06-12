# SOLID na prática

Os cinco princípios SOLID guiam um design orientado a objetos sustentável.

## Pontos-chave

- SRP: uma única razão para mudar por classe
- OCP: aberto p/ extensão, fechado p/ modificação
- LSP: subtipos substituíveis
- ISP e DIP: interfaces enxutas e inversão de dependência

## Exemplo

```python
from typing import Protocol

class Repo(Protocol):
    def salvar(self, x) -> None: ...

class Servico:
    def __init__(self, repo: Repo):  # DIP: depende da abstração
        self.repo = repo
```

## Boas práticas

- Aplique SOLID onde há mudança real
- Não exagere: comece simples

## Saiba mais

- [Documentação oficial](https://en.wikipedia.org/wiki/SOLID)
