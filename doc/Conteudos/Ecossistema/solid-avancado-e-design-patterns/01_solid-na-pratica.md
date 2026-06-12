# SOLID na prática

Os cinco princípios SOLID guiam um design orientado a objetos sustentável.

> **Tema:** Arquitetura · **Nível:** avancado · **Trilha:** SOLID Avançado e Design Patterns

## Conceitos-chave

Nesta lição você vai entender:

- **SRP: uma única razão para mudar por classe**
- **OCP: aberto p/ extensão, fechado p/ modificação**
- **LSP: subtipos substituíveis**
- **ISP e DIP: interfaces enxutas e inversão de dependência**

## Exemplo prático

```python
from typing import Protocol

class Repo(Protocol):
    def salvar(self, x) -> None: ...

class Servico:
    def __init__(self, repo: Repo):  # DIP: depende da abstração
        self.repo = repo
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Aplique SOLID onde há mudança real
- Não exagere: comece simples

## Pratique

Para fixar, escreva um pequeno script que combine **srp: uma única razão para mudar por classe** e **ocp: aberto p/ extensão, fechado p/ modificação** em um caso do seu dia a dia. Depois refatore aplicando "Aplique SOLID onde há mudança real".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: SRP: uma única razão para mudar por classe
- [ ] Explicar e aplicar: OCP: aberto p/ extensão, fechado p/ modificação
- [ ] Explicar e aplicar: LSP: subtipos substituíveis
- [ ] Explicar e aplicar: ISP e DIP: interfaces enxutas e inversão de dependência

## Saiba mais

- [Documentação oficial](https://en.wikipedia.org/wiki/SOLID)
