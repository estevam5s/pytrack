# Herança, mixins e ABCs

Estruture hierarquias com classes abstratas, mixins e composição.

## Pontos-chave

- ABCs definem interfaces com @abstractmethod
- Mixins adicionam comportamento reutilizável
- MRO e super() em herança múltipla
- Prefira composição a herança profunda

## Exemplo

```python
from abc import ABC, abstractmethod

class Notificador(ABC):
    @abstractmethod
    def enviar(self, msg: str) -> None: ...

class Email(Notificador):
    def enviar(self, msg): print('email:', msg)
```

## Boas práticas

- Composição costuma vencer herança
- Use ABCs para contratos claros

## Saiba mais

- [Documentação oficial](https://docs.python.org/3/library/abc.html)
