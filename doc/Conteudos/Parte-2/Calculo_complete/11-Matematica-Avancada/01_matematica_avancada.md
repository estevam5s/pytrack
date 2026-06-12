# Matemática Avançada com Python

Esta categoria reúne ferramentas que conectam cálculo com computação científica: métodos numéricos, otimização, interpolação, Fourier, probabilidade contínua e estabilidade.

---

## Métodos Numéricos

Métodos numéricos aproximam soluções quando fórmulas fechadas são difíceis ou inexistentes.

Cuidados:

- erro de arredondamento;
- erro de truncamento;
- convergência;
- estabilidade;
- custo computacional;
- sensibilidade a condições iniciais.

---

## Raízes de Funções

```python
from scipy.optimize import root_scalar

def f(x):
    return x**2 - 2

sol = root_scalar(f, bracket=[1, 2])
print(sol.root)
```

---

## Método de Newton

```text
x_{n+1} = x_n - f(x_n)/f'(x_n)
```

```python
def newton(f, df, x0, iteracoes=10):
    x = x0
    for _ in range(iteracoes):
        x = x - f(x) / df(x)
    return x

print(newton(lambda x: x**2 - 2, lambda x: 2 * x, 1.5))
```

Newton é rápido perto da raiz, mas pode falhar com chute ruim ou derivada próxima de zero.

---

## Interpolação

```python
import numpy as np
from scipy.interpolate import interp1d

x = np.array([0, 1, 2, 3])
y = np.array([0, 1, 4, 9])

interp = interp1d(x, y, kind="linear")
print(interp(1.5))
```

Interpolação estima valores entre pontos conhecidos.

---

## Otimização

```python
from scipy.optimize import minimize

def objetivo(v):
    x, y = v
    return (x - 1)**2 + (y + 2)**2

res = minimize(objetivo, x0=[0, 0])
print(res.x)
```

Otimização aparece em engenharia, estatística, machine learning, finanças e logística.

---

## Fourier

Fourier representa sinais como combinação de senos e cossenos.

```python
import numpy as np

t = np.linspace(0, 1, 500)
sinal = np.sin(2 * np.pi * 5 * t) + 0.5 * np.sin(2 * np.pi * 20 * t)
freq = np.fft.fftfreq(len(t), d=t[1] - t[0])
espectro = np.fft.fft(sinal)
```

Aplicações:

- processamento de sinais;
- áudio;
- imagens;
- equações diferenciais;
- compressão;
- análise de frequência.

---

## Probabilidade Contínua

```python
from scipy.stats import norm

print(norm.cdf(1.96))
print(norm.pdf(0))
```

Integrais aparecem porque probabilidades contínuas são áreas sob densidades.

---

## Estabilidade Numérica

Exemplo ruim:

```python
resultado = (1 - np.cos(1e-8)) / (1e-8**2)
```

Expressões matematicamente equivalentes podem ter comportamentos numéricos diferentes. Em computação científica, forma algébrica importa.

---

## Exercícios

1. Encontre raiz de uma função com `root_scalar`.
2. Implemente Newton.
3. Faça interpolação linear.
4. Resolva uma otimização simples.
5. Calcule FFT de um sinal composto.
