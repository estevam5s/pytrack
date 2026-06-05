# Geometria e Trigonometria com Python

Geometria e trigonometria conectam forma, distância, ângulo e movimento. Elas aparecem em cálculo vetorial, física, computação gráfica, robótica, engenharia e aprendizado de máquina.

---

## Plano Cartesiano

Ponto:

```text
P = (x, y)
```

Distância entre dois pontos:

```text
d = sqrt((x2 - x1)^2 + (y2 - y1)^2)
```

```python
import math

def distancia(p1, p2):
    return math.dist(p1, p2)

print(distancia((0, 0), (3, 4)))
```

---

## Retas

Forma reduzida:

```text
y = mx + b
```

`m` é o coeficiente angular.

```python
def reta(x, m, b):
    return m * x + b
```

Retas paralelas têm mesmo coeficiente angular. Retas perpendiculares têm produto dos coeficientes igual a `-1`, quando ambos existem.

---

## Áreas e Volumes

```python
import math

area_circulo = math.pi * 3**2
volume_esfera = 4 / 3 * math.pi * 3**3

print(area_circulo)
print(volume_esfera)
```

Fórmulas precisam ser acompanhadas de unidades.

---

## Vetores

Vetor representa magnitude e direção.

```python
import numpy as np

u = np.array([3, 4])
v = np.array([1, 2])

print(u + v)
print(np.linalg.norm(u))
print(np.dot(u, v))
```

Produto escalar:

```text
u · v = ||u|| ||v|| cos(theta)
```

---

## Produto Vetorial

Em 3D:

```python
import numpy as np

u = np.array([1, 0, 0])
v = np.array([0, 1, 0])

print(np.cross(u, v))
```

O resultado é perpendicular aos dois vetores.

---

## Trigonometria

No triângulo retângulo:

```text
sen(theta) = cateto_oposto / hipotenusa
cos(theta) = cateto_adjacente / hipotenusa
tan(theta) = sen(theta) / cos(theta)
```

```python
import math

angulo = math.radians(30)
print(math.sin(angulo))
print(math.cos(angulo))
print(math.tan(angulo))
```

Python usa radianos.

---

## Identidades Importantes

```text
sen²(x) + cos²(x) = 1
tan(x) = sen(x)/cos(x)
sen(2x) = 2sen(x)cos(x)
cos(2x) = cos²(x) - sen²(x)
```

Verificação simbólica:

```python
import sympy as sp

x = sp.symbols("x")
expr = sp.sin(x)**2 + sp.cos(x)**2
print(sp.simplify(expr))
```

---

## Visualização

```python
import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0, 2 * np.pi, 500)
plt.plot(x, np.sin(x), label="sen")
plt.plot(x, np.cos(x), label="cos")
plt.legend()
plt.grid(True)
plt.show()
```

---

## Exercícios

1. Calcule distância entre dois pontos.
2. Encontre a equação da reta por dois pontos.
3. Calcule ângulo entre dois vetores.
4. Plote seno e cosseno.
5. Verifique identidades trigonométricas com SymPy.
