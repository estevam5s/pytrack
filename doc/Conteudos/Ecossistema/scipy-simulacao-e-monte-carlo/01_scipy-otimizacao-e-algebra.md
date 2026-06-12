# SciPy: otimização e álgebra

SciPy estende o NumPy com algoritmos científicos de alto nível.

> **Tema:** Científico · **Nível:** avancado · **Trilha:** SciPy, Simulação e Monte Carlo

## Conceitos-chave

Nesta lição você vai entender:

- **optimize: minimização e ajuste de curvas**
- **integrate: integração numérica e EDOs**
- **stats: distribuições e testes de hipótese**
- **linalg/sparse para álgebra avançada**

## Exemplo prático

```python
from scipy import optimize

def f(x):
    return (x - 3) ** 2

res = optimize.minimize(f, x0=0)
print(res.x)  # ~3
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Escolha o algoritmo conforme o problema (convexo?)
- Forneça gradiente quando possível para convergir melhor

## Pratique

Para fixar, escreva um pequeno script que combine **optimize: minimização e ajuste de curvas** e **integrate: integração numérica e edos** em um caso do seu dia a dia. Depois refatore aplicando "Escolha o algoritmo conforme o problema (convexo?)".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: optimize: minimização e ajuste de curvas
- [ ] Explicar e aplicar: integrate: integração numérica e EDOs
- [ ] Explicar e aplicar: stats: distribuições e testes de hipótese
- [ ] Explicar e aplicar: linalg/sparse para álgebra avançada

## Saiba mais

- [Documentação oficial](https://docs.scipy.org/doc/scipy/)
