# Cálculo 1: Integrais com Python

Integral conecta área, acumulação, soma contínua e antiderivada. É uma das ideias centrais da matemática aplicada.

---

## Antiderivada

Se `F'(x) = f(x)`, então `F` é uma primitiva de `f`.

```python
import sympy as sp

x = sp.symbols("x")
f = 3 * x**2
print(sp.integrate(f, x))
```

---

## Integral Definida

```text
∫[a,b] f(x) dx
```

Representa área líquida sob a curva.

```python
x = sp.symbols("x")
area = sp.integrate(x**2, (x, 0, 2))
print(area)
```

---

## Soma de Riemann

```python
def riemann(f, a, b, n):
    dx = (b - a) / n
    total = 0
    for i in range(n):
        x_i = a + i * dx
        total += f(x_i) * dx
    return total

print(riemann(lambda x: x**2, 0, 2, 10000))
```

Quanto maior `n`, melhor a aproximação, em geral.

---

## Teorema Fundamental do Cálculo

Se `F` é primitiva de `f`, então:

```text
∫[a,b] f(x) dx = F(b) - F(a)
```

Esse teorema conecta derivada e integral.

---

## Substituição

Útil quando há composição de funções.

```text
∫ 2x cos(x²) dx
u = x²
du = 2x dx
∫ cos(u) du = sen(u) + C
```

```python
expr = 2 * x * sp.cos(x**2)
print(sp.integrate(expr, x))
```

---

## Integração por Partes

```text
∫ u dv = uv - ∫ v du
```

```python
expr = x * sp.exp(x)
print(sp.integrate(expr, x))
```

---

## Integração Numérica com SciPy

```python
from scipy.integrate import quad

resultado, erro = quad(lambda t: t**2, 0, 2)
print(resultado, erro)
```

Use integração numérica quando a integral simbólica é difícil ou impossível.

---

## Aplicações

- área;
- deslocamento a partir de velocidade;
- trabalho;
- massa com densidade variável;
- probabilidade contínua;
- valor acumulado;
- centro de massa.

---

## Exercícios

1. Calcule primitivas com SymPy.
2. Aproxime área por soma de Riemann.
3. Compare Riemann, SymPy e SciPy.
4. Resolva uma integral por substituição.
5. Modele deslocamento a partir de uma função velocidade.
