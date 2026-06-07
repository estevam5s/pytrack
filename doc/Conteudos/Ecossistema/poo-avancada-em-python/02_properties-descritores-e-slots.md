# Properties, descritores e slots

Controle de acesso a atributos e otimização de memória.

## Pontos-chave

- @property cria getters/setters pythônicos
- Descritores reutilizam lógica de atributos
- __slots__ economiza memória
- Validação no setter

## Exemplo

```python
class Conta:
    def __init__(self): self._saldo = 0
    @property
    def saldo(self): return self._saldo
    @saldo.setter
    def saldo(self, v):
        if v < 0: raise ValueError('negativo')
        self._saldo = v
```

## Boas práticas

- Use property só quando há lógica real
- __slots__ em classes com muitas instâncias

## Saiba mais

- [Documentação oficial](https://docs.python.org/3/howto/descriptor.html)
