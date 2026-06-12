# Herança, mixins e ABCs

Estruture hierarquias com classes abstratas, mixins e composição.

> **Tema:** POO · **Nível:** avancado · **Trilha:** POO Avançada em Python

## Conceitos-chave

Nesta lição você vai entender:

- **ABCs definem interfaces com @abstractmethod**
- **Mixins adicionam comportamento reutilizável**
- **MRO e super() em herança múltipla**
- **Prefira composição a herança profunda**

## Exemplo prático

```python
from abc import ABC, abstractmethod

class Notificador(ABC):
    @abstractmethod
    def enviar(self, msg: str) -> None: ...

class Email(Notificador):
    def enviar(self, msg): print('email:', msg)
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Composição costuma vencer herança
- Use ABCs para contratos claros

## Pratique

Para fixar, escreva um pequeno script que combine **abcs definem interfaces com @abstractmethod** e **mixins adicionam comportamento reutilizável** em um caso do seu dia a dia. Depois refatore aplicando "Composição costuma vencer herança".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: ABCs definem interfaces com @abstractmethod
- [ ] Explicar e aplicar: Mixins adicionam comportamento reutilizável
- [ ] Explicar e aplicar: MRO e super() em herança múltipla
- [ ] Explicar e aplicar: Prefira composição a herança profunda

## Saiba mais

- [Documentação oficial](https://docs.python.org/3/library/abc.html)
