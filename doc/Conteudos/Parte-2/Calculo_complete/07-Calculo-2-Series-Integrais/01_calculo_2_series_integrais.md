# Cálculo 2: Séries e Integrais Avançadas com Python

Cálculo 2 aprofunda acumulação, aproximação e convergência. Séries e integrais impróprias são essenciais para análise, física, probabilidade, métodos numéricos e aproximações.

---

## Sequências

Uma sequência é uma função dos naturais nos reais.

```text
a_n = 1/n
```

```python
import sympy as sp

n = sp.symbols("n", positive=True, integer=True)
print(sp.limit(1 / n, n, sp.oo))
```

---

## Séries

Uma série soma termos de uma sequência.

```text
Σ a_n
```

```python
n = sp.symbols("n", positive=True, integer=True)
serie = sp.summation(1 / n**2, (n, 1, sp.oo))
print(serie)
```

---

## Convergência

Ideias importantes:

- termo geral deve tender a zero;
- série geométrica converge se `|r| < 1`;
- série harmônica diverge;
- comparação ajuda a decidir convergência.

```python
r = sp.Rational(1, 2)
print(sp.summation(r**n, (n, 0, sp.oo)))
```

---

## Série de Taylor

Taylor aproxima funções por polinômios.

```text
f(x) ≈ f(a) + f'(a)(x-a) + f''(a)(x-a)²/2! + ...
```

```python
x = sp.symbols("x")
print(sp.series(sp.sin(x), x, 0, 7))
```

---

## Aproximação Numérica

```python
import math

def seno_taylor(x, termos=5):
    total = 0
    for k in range(termos):
        total += (-1)**k * x**(2 * k + 1) / math.factorial(2 * k + 1)
    return total

print(seno_taylor(1, 6))
print(math.sin(1))
```

---

## Integrais Impróprias

Ocorrem com intervalo infinito ou descontinuidade no intervalo.

```python
x = sp.symbols("x", positive=True)
print(sp.integrate(1 / x**2, (x, 1, sp.oo)))
```

---

## Coordenadas Polares

```text
x = r cos(theta)
y = r sin(theta)
dA = r dr dtheta
```

```python
r, theta = sp.symbols("r theta", positive=True)
area_circulo = sp.integrate(r, (r, 0, 1), (theta, 0, 2 * sp.pi))
print(area_circulo)
```

---

## Exercícios

1. Verifique convergência de sequências.
2. Calcule soma de série geométrica.
3. Compare série harmônica e série `1/n²`.
4. Aproxime `sin(x)` com Taylor.
5. Calcule área em coordenadas polares.
