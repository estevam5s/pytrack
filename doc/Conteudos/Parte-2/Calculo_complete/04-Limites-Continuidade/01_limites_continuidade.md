# Limites e Continuidade com Python

Limite descreve o comportamento de uma função quando a variável se aproxima de um valor. É a base formal de derivadas, integrais, continuidade e análise.

---

## Ideia Intuitiva

```text
lim x->a f(x) = L
```

Significa que `f(x)` se aproxima de `L` quando `x` se aproxima de `a`.

```python
def f(x):
    return (x**2 - 1) / (x - 1)

for valor in [0.9, 0.99, 0.999, 1.001, 1.01, 1.1]:
    print(valor, f(valor))
```

Mesmo que `f(1)` não esteja definida, o limite pode existir.

---

## Limite com SymPy

```python
import sympy as sp

x = sp.symbols("x")
expr = (x**2 - 1) / (x - 1)

print(sp.limit(expr, x, 1))
```

---

## Limites Laterais

```python
print(sp.limit(1 / x, x, 0, dir="+"))
print(sp.limit(1 / x, x, 0, dir="-"))
```

O limite bilateral só existe se os limites laterais forem iguais.

---

## Indeterminações

Formas comuns:

- `0/0`;
- `∞/∞`;
- `0 * ∞`;
- `∞ - ∞`;
- `1^∞`;
- `0^0`;
- `∞^0`.

Indeterminação não é resultado. É sinal de que precisamos transformar a expressão.

---

## Continuidade

Uma função é contínua em `a` quando:

1. `f(a)` existe;
2. `lim x->a f(x)` existe;
3. `lim x->a f(x) = f(a)`.

```python
x = sp.symbols("x")
expr = sp.Piecewise((x**2, x < 1), (2, x >= 1))

lim_esq = sp.limit(expr, x, 1, dir="-")
lim_dir = sp.limit(expr, x, 1, dir="+")
valor = expr.subs(x, 1)

print(lim_esq, lim_dir, valor)
```

---

## Assíntotas

Assíntota vertical:

```text
lim x->a f(x) = ±∞
```

Assíntota horizontal:

```text
lim x->∞ f(x) = L
```

```python
expr = (2 * x + 1) / (x - 3)
print(sp.limit(expr, x, 3, dir="+"))
print(sp.limit(expr, x, sp.oo))
```

---

## Visualização

```python
import numpy as np
import matplotlib.pyplot as plt

x_vals = np.linspace(-5, 5, 1000)
y_vals = (x_vals**2 - 1) / (x_vals - 1)

plt.plot(x_vals, y_vals)
plt.ylim(-10, 10)
plt.grid(True)
plt.show()
```

Evite plotar diretamente em pontos de descontinuidade sem tratar o domínio.

---

## Exercícios

1. Calcule `lim x->2 (x² - 4)/(x - 2)`.
2. Calcule limites laterais de `1/x` em zero.
3. Verifique continuidade de uma função por partes.
4. Encontre assíntotas de uma função racional.
5. Compare aproximação numérica e limite simbólico.
