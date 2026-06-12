# Álgebra Linear com Python

Álgebra linear é a matemática de vetores, matrizes, transformações lineares e sistemas. É essencial para cálculo multivariável, machine learning, computação gráfica, otimização e métodos numéricos.

---

## Vetores

```python
import numpy as np

u = np.array([1, 2, 3])
v = np.array([4, 5, 6])

print(u + v)
print(2 * u)
print(np.dot(u, v))
print(np.linalg.norm(u))
```

---

## Matrizes

```python
A = np.array([[1, 2], [3, 4]])
B = np.array([[2, 0], [1, 2]])

print(A + B)
print(A @ B)
```

Multiplicação de matrizes representa composição de transformações lineares.

---

## Sistemas Lineares

```text
Ax = b
```

```python
A = np.array([[2, 1], [1, -1]], dtype=float)
b = np.array([5, 1], dtype=float)

x = np.linalg.solve(A, b)
print(x)
```

Evite calcular inversa explicitamente quando o objetivo é resolver sistema.

---

## Determinante

```python
A = np.array([[1, 2], [3, 4]], dtype=float)
print(np.linalg.det(A))
```

Determinante indica escala orientada da transformação. Determinante zero indica matriz singular.

---

## Base, Dimensão e Independência

Vetores são linearmente independentes quando nenhum deles pode ser escrito como combinação dos outros.

```python
A = np.array([[1, 0], [0, 1]], dtype=float)
rank = np.linalg.matrix_rank(A)
print(rank)
```

O posto ajuda a entender dimensão do espaço gerado pelas colunas ou linhas.

---

## Autovalores e Autovetores

```text
Av = λv
```

```python
A = np.array([[2, 0], [0, 3]], dtype=float)
valores, vetores = np.linalg.eig(A)

print(valores)
print(vetores)
```

Autovetores mantêm direção sob transformação linear; autovalores indicam escala.

---

## Decomposições

Decomposições transformam problemas difíceis em partes mais tratáveis.

```python
A = np.array([[1, 2], [3, 4], [5, 6]], dtype=float)
U, S, Vt = np.linalg.svd(A)

print(S)
```

SVD é usada em compressão, redução de dimensionalidade, recomendação e análise numérica.

---

## Exercícios

1. Calcule norma, produto escalar e ângulo entre vetores.
2. Resolva sistemas lineares.
3. Calcule determinante e posto.
4. Encontre autovalores e autovetores.
5. Aplique SVD em uma matriz simples.
