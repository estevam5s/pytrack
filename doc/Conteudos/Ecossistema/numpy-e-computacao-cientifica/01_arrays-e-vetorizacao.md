# Arrays e vetorização

NumPy fornece arrays n-dimensionais e operações vetorizadas eficientes.

## Pontos-chave

- ndarray, dtype e shape
- Broadcasting para operações sem loops
- Slicing e indexação avançada
- Funções universais (ufuncs)

## Exemplo

```python
import numpy as np
a = np.arange(12).reshape(3, 4)
print(a.mean(axis=0))
print(a[a > 5])
```

## Boas práticas

- Vetorize: evite loops Python
- Cuidado com cópias vs views

## Saiba mais

- [Documentação oficial](https://numpy.org/doc/)
