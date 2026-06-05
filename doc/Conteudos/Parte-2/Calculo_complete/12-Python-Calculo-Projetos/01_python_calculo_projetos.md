# Python para Cálculo e Projetos

Esta categoria mostra como transformar matemática em código organizado, visualização, experimentos, validação e projetos.

---

## Ferramentas

```python
import math
import numpy as np
import sympy as sp
import matplotlib.pyplot as plt
from scipy.integrate import quad, solve_ivp
from scipy.optimize import minimize, root_scalar
```

Use a ferramenta certa:

- `math`: cálculo escalar;
- `numpy`: cálculo vetorizado;
- `sympy`: simbólico;
- `matplotlib`: visualização;
- `scipy`: métodos numéricos.

---

## Funções Reutilizáveis

```python
def derivada_central(f, x, h=1e-5):
    return (f(x + h) - f(x - h)) / (2 * h)

def integral_trapezio(f, a, b, n=1000):
    xs = np.linspace(a, b, n + 1)
    ys = f(xs)
    dx = (b - a) / n
    return dx * (ys[0] / 2 + ys[1:-1].sum() + ys[-1] / 2)
```

Funções matemáticas devem ter nomes claros, parâmetros explícitos e testes.

---

## Visualização Padrão

```python
def plotar_funcao(f, a, b, n=400, titulo="Função"):
    x = np.linspace(a, b, n)
    y = f(x)
    plt.plot(x, y)
    plt.axhline(0, color="black", linewidth=0.8)
    plt.axvline(0, color="black", linewidth=0.8)
    plt.title(titulo)
    plt.grid(True)
    plt.show()
```

---

## Testes de Cálculo

```python
import math

def test_derivada_central():
    resultado = derivada_central(lambda x: x**2, 3)
    assert math.isclose(resultado, 6, rel_tol=1e-5)
```

Para floats, use tolerância.

---

## Projeto 1: Explorador de Funções

Funcionalidades:

- receber função;
- plotar gráfico;
- calcular raízes;
- calcular derivada simbólica;
- calcular integral definida;
- gerar relatório.

---

## Projeto 2: Simulador de EDO

Funcionalidades:

- escolher modelo;
- configurar parâmetros;
- resolver com `solve_ivp`;
- plotar solução;
- comparar condições iniciais.

---

## Projeto 3: Calculadora de Álgebra Linear

Funcionalidades:

- resolver sistemas;
- calcular determinante;
- calcular posto;
- encontrar autovalores;
- aplicar SVD.

---

## Projeto 4: Aproximações Numéricas

Funcionalidades:

- derivada progressiva, regressiva e central;
- integração por retângulos, trapézio e Simpson;
- comparação com solução exata;
- análise de erro conforme `h` ou `n`.

---

## Estrutura Recomendada

```text
calculo-projetos/
├── README.md
├── notebooks/
├── src/
│   └── calculo/
│       ├── derivadas.py
│       ├── integrais.py
│       ├── graficos.py
│       ├── edo.py
│       └── algebra_linear.py
└── tests/
```

---

## Checklist de Projeto

- funções matemáticas isoladas;
- exemplos reproduzíveis;
- gráficos com título e eixos;
- tolerância em comparações numéricas;
- README com fórmulas usadas;
- testes para casos conhecidos;
- separação entre cálculo, visualização e interface.

---

## Exercícios

1. Crie módulo `derivadas.py`.
2. Crie módulo `integrais.py`.
3. Teste derivada numérica de `x²`.
4. Compare integral por trapézio com `quad`.
5. Monte um notebook explicando um problema completo.
