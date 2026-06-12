# NumPy, SciPy e Computação Científica

NumPy e SciPy formam a base científica do ecossistema Python. NumPy fornece arrays, vetorização e álgebra linear. SciPy amplia com estatística, otimização, interpolação, sinais, distância e métodos numéricos.

---

## Sumário

1. [NumPy](#numpy)
2. [Arrays](#arrays)
3. [Vetorização](#vetorização)
4. [Broadcasting](#broadcasting)
5. [Máscaras Booleanas](#máscaras-booleanas)
6. [Agregações](#agregações)
7. [Álgebra Linear](#álgebra-linear)
8. [Aleatoriedade](#aleatoriedade)
9. [SciPy](#scipy)
10. [Estatística com SciPy](#estatística-com-scipy)
11. [Otimização](#otimização)
12. [Boas Práticas](#boas-práticas)
13. [Exercícios](#exercícios)

---

## NumPy

NumPy é usado quando você precisa de operações numéricas eficientes.

```python
import numpy as np

valores = np.array([10, 20, 30])
print(valores * 2)
```

Arrays NumPy são mais eficientes que listas para operações numéricas homogêneas.

---

## Arrays

```python
import numpy as np

a = np.array([1, 2, 3])
b = np.array([[1, 2], [3, 4]])
```

Propriedades:

```python
print(a.shape)
print(b.shape)
print(a.dtype)
print(b.ndim)
```

Criação:

```python
np.zeros((3, 2))
np.ones((2, 2))
np.arange(0, 10, 2)
np.linspace(0, 1, 5)
```

Reshape:

```python
valores = np.arange(12)
matriz = valores.reshape(3, 4)
```

---

## Vetorização

Evite loops Python quando operação vetorizada é possível.

```python
valores = np.array([100, 200, 300])
desconto = 0.10

resultado = valores * (1 - desconto)
```

Normalização:

```python
def normalizar(x: np.ndarray) -> np.ndarray:
    return (x - x.mean()) / x.std()
```

---

## Broadcasting

Broadcasting permite combinar arrays de formas compatíveis.

```python
matriz = np.array([[1, 2, 3], [4, 5, 6]])
pesos = np.array([10, 20, 30])

print(matriz * pesos)
```

Exemplo com padronização por coluna:

```python
dados = np.array(
    [
        [10, 100],
        [20, 200],
        [30, 300],
    ]
)

z = (dados - dados.mean(axis=0)) / dados.std(axis=0)
```

---

## Máscaras Booleanas

```python
valores = np.array([10, 20, 30, 40])
filtro = valores >= 25

print(valores[filtro])
```

Winsorização simples:

```python
def limitar_outliers(x: np.ndarray, minimo: float, maximo: float) -> np.ndarray:
    return np.clip(x, minimo, maximo)
```

---

## Agregações

```python
valores = np.array([10, 20, 30])

valores.sum()
valores.mean()
valores.std()
valores.min()
valores.max()
```

Por eixo:

```python
matriz = np.array([[1, 2], [3, 4]])

matriz.sum(axis=0)
matriz.sum(axis=1)
```

---

## Álgebra Linear

```python
A = np.array([[1, 2], [3, 4]])
b = np.array([1, 0])

x = np.linalg.solve(A, b)
```

Produto matricial:

```python
A @ b
```

Autovalores:

```python
valores, vetores = np.linalg.eig(A)
```

---

## Aleatoriedade

Use gerador moderno:

```python
rng = np.random.default_rng(seed=42)

amostra = rng.normal(loc=0, scale=1, size=1000)
inteiros = rng.integers(0, 10, size=20)
```

Separar seed melhora reprodutibilidade.

---

## SciPy

SciPy complementa NumPy.

Áreas:

- `scipy.stats`;
- `scipy.optimize`;
- `scipy.linalg`;
- `scipy.spatial`;
- `scipy.signal`;
- `scipy.interpolate`;
- `scipy.integrate`.

---

## Estatística com SciPy

```python
from scipy import stats
import numpy as np

grupo_a = np.array([10, 12, 13, 15, 16])
grupo_b = np.array([11, 13, 14, 18, 20])

resultado = stats.ttest_ind(grupo_a, grupo_b, equal_var=False)
print(resultado.statistic, resultado.pvalue)
```

Correlação:

```python
coef, pvalor = stats.pearsonr(grupo_a, grupo_b)
```

Distribuições:

```python
prob = stats.norm.cdf(1.96)
critico = stats.norm.ppf(0.975)
```

---

## Otimização

```python
from scipy.optimize import minimize

def objetivo(x):
    return (x[0] - 3) ** 2 + (x[1] + 2) ** 2

resultado = minimize(objetivo, x0=[0, 0])
print(resultado.x)
```

Uso típico:

- ajuste de parâmetros;
- calibração;
- mínimos quadrados;
- otimização de custo;
- experimentos científicos.

---

## Boas Práticas

- Prefira vetorização a loops Python.
- Controle seed para reprodutibilidade.
- Conheça `shape`, `dtype` e `axis`.
- Use `float64` por padrão em análise científica.
- Use SciPy para testes estatísticos e otimização.
- Valide pressupostos antes de interpretar teste estatístico.
- Meça memória quando arrays forem grandes.

---

## Exercícios

1. Crie arrays 1D e 2D e inspecione `shape`, `dtype` e `ndim`.
2. Normalize uma coluna com NumPy.
3. Aplique máscara booleana para remover valores extremos.
4. Resolva um sistema linear.
5. Gere amostras normais com seed.
6. Faça teste t entre dois grupos.
7. Otimize uma função quadrática.
8. Reescreva um loop usando vetorização.

