# Cálculo 3: Multivariável com Python

Cálculo 3 estuda funções com várias variáveis, superfícies, campos, derivadas parciais, integrais múltiplas e operadores vetoriais.

---

## Funções de Várias Variáveis

```text
f(x, y) = x² + y²
```

```python
import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(-3, 3, 100)
y = np.linspace(-3, 3, 100)
X, Y = np.meshgrid(x, y)
Z = X**2 + Y**2

ax = plt.figure().add_subplot(projection="3d")
ax.plot_surface(X, Y, Z, cmap="viridis")
plt.show()
```

---

## Derivadas Parciais

```python
import sympy as sp

x, y = sp.symbols("x y")
f = x**2 * y + sp.sin(y)

print(sp.diff(f, x))
print(sp.diff(f, y))
```

Derivada parcial mede variação em uma direção coordenada mantendo as outras variáveis fixas.

---

## Gradiente

```text
∇f = (∂f/∂x, ∂f/∂y, ∂f/∂z)
```

```python
grad = [sp.diff(f, var) for var in (x, y)]
print(grad)
```

O gradiente aponta a direção de maior crescimento local.

---

## Plano Tangente

Para `z = f(x, y)` no ponto `(a, b)`:

```text
z = f(a,b) + fx(a,b)(x-a) + fy(a,b)(y-b)
```

```python
a, b = 1, 2
fx = sp.diff(f, x)
fy = sp.diff(f, y)
plano = f.subs({x: a, y: b}) + fx.subs({x: a, y: b}) * (x - a) + fy.subs({x: a, y: b}) * (y - b)
print(plano)
```

---

## Integrais Duplas

```python
expr = x + y
resultado = sp.integrate(expr, (x, 0, 1), (y, 0, 2))
print(resultado)
```

Integrais múltiplas acumulam grandezas sobre regiões.

---

## Campos Vetoriais

```python
x_vals = np.linspace(-2, 2, 15)
y_vals = np.linspace(-2, 2, 15)
X, Y = np.meshgrid(x_vals, y_vals)
U = -Y
V = X

plt.quiver(X, Y, U, V)
plt.axis("equal")
plt.grid(True)
plt.show()
```

---

## Divergente e Rotacional

Divergente mede fonte ou sumidouro.

Rotacional mede tendência de giro.

```python
P = x**2
Q = y**2
div = sp.diff(P, x) + sp.diff(Q, y)
rot = sp.diff(Q, x) - sp.diff(P, y)
print(div, rot)
```

---

## Exercícios

1. Plote uma superfície `z = x² - y²`.
2. Calcule derivadas parciais.
3. Calcule gradiente em um ponto.
4. Monte plano tangente.
5. Calcule integral dupla sobre retângulo.
