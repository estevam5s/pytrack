# Arrays e vetorização

NumPy fornece arrays n-dimensionais e operações vetorizadas eficientes.

> **Tema:** Científico · **Nível:** intermediario · **Trilha:** NumPy e Computação Científica

## Conceitos-chave

Nesta lição você vai entender:

- **ndarray, dtype e shape**
- **Broadcasting para operações sem loops**
- **Slicing e indexação avançada**
- **Funções universais (ufuncs)**

## Exemplo prático

```python
import numpy as np
a = np.arange(12).reshape(3, 4)
print(a.mean(axis=0))
print(a[a > 5])
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Vetorize: evite loops Python
- Cuidado com cópias vs views

## Pratique

Para fixar, escreva um pequeno script que combine **ndarray, dtype e shape** e **broadcasting para operações sem loops** em um caso do seu dia a dia. Depois refatore aplicando "Vetorize: evite loops Python".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: ndarray, dtype e shape
- [ ] Explicar e aplicar: Broadcasting para operações sem loops
- [ ] Explicar e aplicar: Slicing e indexação avançada
- [ ] Explicar e aplicar: Funções universais (ufuncs)

## Saiba mais

- [Documentação oficial](https://numpy.org/doc/)
