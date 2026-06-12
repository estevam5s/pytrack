# Matemática simbólica com SymPy

Quando você precisa de respostas exatas, não numéricas.

> **Tema:** Científico · **Nível:** avancado · **Trilha:** SciPy, Simulação e Monte Carlo

## Conceitos-chave

Nesta lição você vai entender:

- **Símbolos, expressões e simplificação**
- **Derivadas, integrais e limites exatos**
- **Resolver equações algébricas e EDOs**
- **Gerar código a partir de fórmulas (lambdify)**

## Exemplo prático

```python
import sympy as sp

x = sp.symbols('x')
expr = sp.integrate(sp.sin(x) * x, x)
print(expr)  # -x*cos(x) + sin(x)
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Use SymPy para deduzir, NumPy para calcular em massa
- lambdify converte fórmula simbólica em função rápida

## Pratique

Para fixar, escreva um pequeno script que combine **símbolos, expressões e simplificação** e **derivadas, integrais e limites exatos** em um caso do seu dia a dia. Depois refatore aplicando "Use SymPy para deduzir, NumPy para calcular em massa".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Símbolos, expressões e simplificação
- [ ] Explicar e aplicar: Derivadas, integrais e limites exatos
- [ ] Explicar e aplicar: Resolver equações algébricas e EDOs
- [ ] Explicar e aplicar: Gerar código a partir de fórmulas (lambdify)

## Saiba mais

- [Documentação oficial](https://docs.sympy.org/)
