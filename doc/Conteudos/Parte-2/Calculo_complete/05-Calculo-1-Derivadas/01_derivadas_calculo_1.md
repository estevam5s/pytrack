# Cálculo 1: Derivadas com Python

Derivada mede taxa de variação instantânea. Ela conecta geometria, movimento, otimização e sensibilidade de modelos.

---

## Definição

```text
f'(a) = lim h->0 [f(a+h) - f(a)] / h
```

```python
def derivada_numerica(f, x, h=1e-5):
    return (f(x + h) - f(x)) / h

def f(x):
    return x**2

print(derivada_numerica(f, 3))
```

---

## Derivada Simbólica

```python
import sympy as sp

x = sp.symbols("x")
expr = x**3 + 2 * x**2 - 5

print(sp.diff(expr, x))
```

---

## Regras de Derivação

```text
(c)' = 0
(x^n)' = n x^(n-1)
(f + g)' = f' + g'
(fg)' = f'g + fg'
(f/g)' = (f'g - fg') / g²
(f(g(x)))' = f'(g(x))g'(x)
```

```python
expr = sp.sin(x**2)
print(sp.diff(expr, x))
```

---

## Reta Tangente

```text
y = f(a) + f'(a)(x - a)
```

```python
x = sp.symbols("x")
f = x**2
a = 2
coef = sp.diff(f, x).subs(x, a)
tangente = f.subs(x, a) + coef * (x - a)
print(tangente)
```

---

## Crescimento e Decrescimento

- `f'(x) > 0`: função crescente.
- `f'(x) < 0`: função decrescente.
- `f'(x) = 0`: ponto crítico candidato.

```python
f = x**3 - 3 * x
criticos = sp.solve(sp.diff(f, x), x)
print(criticos)
```

---

## Otimização

Passos:

1. modele a função objetivo;
2. defina domínio e restrições;
3. encontre pontos críticos;
4. avalie extremos e fronteiras;
5. interprete o resultado.

```python
x = sp.symbols("x")
lucro = -x**2 + 100 * x - 500
critico = sp.solve(sp.diff(lucro, x), x)
print(critico)
print(lucro.subs(x, critico[0]))
```

---

## Concavidade

- `f''(x) > 0`: concavidade para cima.
- `f''(x) < 0`: concavidade para baixo.
- troca de sinal em `f''`: ponto de inflexão.

```python
f = x**3
print(sp.diff(f, x, 2))
```

---

## Derivada Implícita

```python
x, y = sp.symbols("x y")
expr = x**2 + y**2 - 1
dy_dx = sp.idiff(expr, y, x)
print(dy_dx)
```

---

## Exercícios

1. Calcule derivada simbólica de polinômios.
2. Compare derivada numérica e simbólica.
3. Encontre reta tangente em um ponto.
4. Resolva um problema de maximização.
5. Analise crescimento, decrescimento e concavidade.
