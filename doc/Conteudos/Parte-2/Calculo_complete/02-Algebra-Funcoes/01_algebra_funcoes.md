# Álgebra e Funções com Python

Álgebra organiza símbolos, expressões, equações e funções. É a linguagem operacional de cálculo: antes de derivar ou integrar, você precisa manipular expressões corretamente.

---

## Expressões Algébricas

```text
2x + 3x = 5x
x^2 * x^3 = x^5
(x + 2)(x - 2) = x^2 - 4
```

Com SymPy:

```python
import sympy as sp

x = sp.symbols("x")
expr = (x + 2) * (x - 2)
print(sp.expand(expr))
print(sp.factor(x**2 - 4))
```

---

## Equações

```python
import sympy as sp

x = sp.symbols("x")
solucao = sp.solve(sp.Eq(2 * x + 3, 11), x)
print(solucao)
```

Equações podem ter nenhuma, uma ou várias soluções.

---

## Inequações

```python
import sympy as sp

x = sp.symbols("x")
print(sp.solve_univariate_inequality(x**2 - 4 > 0, x))
```

Inequações exigem cuidado com multiplicação por números negativos, domínio e intervalos.

---

## Polinômios

Polinômio:

```text
p(x) = a_n x^n + ... + a_1 x + a_0
```

```python
import numpy as np

coeficientes = [1, 0, -4]  # x^2 - 4
raizes = np.roots(coeficientes)
print(raizes)
```

Com SymPy:

```python
x = sp.symbols("x")
print(sp.solve(x**2 - 4, x))
```

---

## Funções

Uma função associa entradas a saídas.

```text
f: A -> B
f(x) = x^2 + 1
```

```python
def f(x):
    return x**2 + 1

print(f(3))
```

Conceitos importantes:

- domínio;
- contradomínio;
- imagem;
- raiz;
- crescimento;
- paridade;
- composição;
- inversa.

---

## Gráficos

```python
import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(-5, 5, 400)
y = x**2 - 4

plt.axhline(0, color="black", linewidth=0.8)
plt.plot(x, y)
plt.title("f(x) = x² - 4")
plt.grid(True)
plt.show()
```

Gráfico não substitui prova, mas ajuda a formar intuição.

---

## Exponenciais

```text
f(x) = a^x
```

Aplicações:

- crescimento populacional;
- juros compostos;
- decaimento radioativo;
- modelos epidemiológicos;
- escala logarítmica.

```python
import math

def crescimento(valor_inicial, taxa, tempo):
    return valor_inicial * math.exp(taxa * tempo)

print(crescimento(100, 0.05, 10))
```

---

## Logaritmos

```text
log_b(x) = y  <=>  b^y = x
```

Propriedades:

```text
log(ab) = log(a) + log(b)
log(a/b) = log(a) - log(b)
log(a^k) = k log(a)
```

```python
import math

print(math.log(100, 10))
print(math.log(math.e))
```

---

## Modelagem

Modelar é transformar um problema em função, equação ou sistema.

Exemplo: custo total.

```text
C(q) = custo_fixo + custo_variavel * q
```

```python
def custo_total(q, fixo=1000, variavel=12):
    return fixo + variavel * q
```

---

## Exercícios

1. Fatore `x² - 5x + 6` com SymPy.
2. Resolva uma equação quadrática.
3. Plote uma função quadrática.
4. Modele juros compostos como função exponencial.
5. Resolva uma inequação e represente a solução em intervalo.
