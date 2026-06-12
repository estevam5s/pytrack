# Properties, descritores e slots

Controle de acesso a atributos e otimização de memória.

> **Tema:** POO · **Nível:** avancado · **Trilha:** POO Avançada em Python

## Conceitos-chave

Nesta lição você vai entender:

- **@property cria getters/setters pythônicos**
- **Descritores reutilizam lógica de atributos**
- **__slots__ economiza memória**
- **Validação no setter**

## Exemplo prático

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

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Use property só quando há lógica real
- __slots__ em classes com muitas instâncias

## Pratique

Para fixar, escreva um pequeno script que combine **@property cria getters/setters pythônicos** e **descritores reutilizam lógica de atributos** em um caso do seu dia a dia. Depois refatore aplicando "Use property só quando há lógica real".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: @property cria getters/setters pythônicos
- [ ] Explicar e aplicar: Descritores reutilizam lógica de atributos
- [ ] Explicar e aplicar: __slots__ economiza memória
- [ ] Explicar e aplicar: Validação no setter

## Saiba mais

- [Documentação oficial](https://docs.python.org/3/howto/descriptor.html)
