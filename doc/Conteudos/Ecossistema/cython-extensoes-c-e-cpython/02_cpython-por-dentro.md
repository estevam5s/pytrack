# CPython por dentro

Entender o interpretador explica o desempenho e os limites do Python.

> **Tema:** Performance · **Nível:** avancado · **Trilha:** Cython, Extensões C e CPython

## Conceitos-chave

Nesta lição você vai entender:

- **Tudo é objeto (PyObject) com contagem de referência**
- **Bytecode executado pela máquina virtual (ceval)**
- **GIL protege o gerenciamento de memória**
- **dis mostra o bytecode de qualquer função**

## Exemplo prático

```python
import dis

def f(x):
    return x + 1

dis.dis(f)  # mostra LOAD_FAST, BINARY_OP, RETURN_VALUE...
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Use dis para entender por que algo é lento
- Conheça as otimizações do CPython (ex.: interning de ints)

## Pratique

Para fixar, escreva um pequeno script que combine **tudo é objeto (pyobject) com contagem de referência** e **bytecode executado pela máquina virtual (ceval)** em um caso do seu dia a dia. Depois refatore aplicando "Use dis para entender por que algo é lento".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Tudo é objeto (PyObject) com contagem de referência
- [ ] Explicar e aplicar: Bytecode executado pela máquina virtual (ceval)
- [ ] Explicar e aplicar: GIL protege o gerenciamento de memória
- [ ] Explicar e aplicar: dis mostra o bytecode de qualquer função

## Saiba mais

- [Documentação oficial](https://docs.python.org/3/library/dis.html)
