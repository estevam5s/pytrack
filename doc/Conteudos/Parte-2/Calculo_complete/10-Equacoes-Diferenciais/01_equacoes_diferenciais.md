# Equações Diferenciais com Python

Equações diferenciais modelam taxas de variação. Elas aparecem em crescimento populacional, circuitos, dinâmica, calor, epidemias, finanças, química, biologia e controle.

---

## EDO de Primeira Ordem

```text
dy/dt = f(t, y)
```

Exemplo: crescimento exponencial.

```text
dy/dt = ky
```

```python
import sympy as sp

t = sp.symbols("t")
y = sp.Function("y")
k = sp.symbols("k")

sol = sp.dsolve(sp.diff(y(t), t) - k * y(t))
print(sol)
```

---

## Solução Numérica

```python
import numpy as np
from scipy.integrate import solve_ivp
import matplotlib.pyplot as plt

def modelo(t, y):
    k = 0.5
    return k * y

sol = solve_ivp(modelo, (0, 10), [1], t_eval=np.linspace(0, 10, 100))

plt.plot(sol.t, sol.y[0])
plt.grid(True)
plt.show()
```

---

## Modelo Logístico

```text
dy/dt = r y (1 - y/K)
```

```python
def logistico(t, y):
    r = 0.8
    K = 100
    return r * y * (1 - y / K)

sol = solve_ivp(logistico, (0, 20), [5], t_eval=np.linspace(0, 20, 200))
```

---

## EDO Linear de Primeira Ordem

```text
y' + p(t)y = q(t)
```

Pode ser resolvida por fator integrante.

```python
t = sp.symbols("t")
y = sp.Function("y")
eq = sp.Eq(sp.diff(y(t), t) + y(t), sp.exp(t))
print(sp.dsolve(eq))
```

---

## Sistemas de EDOs

Exemplo predador-presa:

```python
def lotka_volterra(t, z):
    presa, predador = z
    alpha, beta, delta, gamma = 1.1, 0.4, 0.1, 0.4
    d_presa = alpha * presa - beta * presa * predador
    d_predador = delta * presa * predador - gamma * predador
    return [d_presa, d_predador]

sol = solve_ivp(lotka_volterra, (0, 30), [10, 5], t_eval=np.linspace(0, 30, 500))
```

---

## Estabilidade

Pontos de equilíbrio ocorrem quando derivadas são zero.

```text
dy/dt = f(y)
equilíbrio: f(y*) = 0
```

Estabilidade analisa se soluções próximas se aproximam ou se afastam do equilíbrio.

---

## Exercícios

1. Resolva `dy/dt = 2y` simbolicamente.
2. Simule crescimento exponencial numericamente.
3. Simule modelo logístico.
4. Simule sistema predador-presa.
5. Encontre pontos de equilíbrio de uma EDO simples.
