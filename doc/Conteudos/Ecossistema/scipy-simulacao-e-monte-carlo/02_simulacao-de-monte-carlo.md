# Simulação de Monte Carlo

Resolver problemas por amostragem aleatória — de risco financeiro a física.

> **Tema:** Científico · **Nível:** avancado · **Trilha:** SciPy, Simulação e Monte Carlo

## Conceitos-chave

Nesta lição você vai entender:

- **Amostragem aleatória para estimar valores**
- **Lei dos grandes números garante convergência**
- **Estimar π, integrais e risco**
- **Reprodutibilidade com seed fixa**

## Exemplo prático

```python
import numpy as np

rng = np.random.default_rng(42)
pontos = rng.random((1_000_000, 2))
dentro = (pontos ** 2).sum(axis=1) <= 1
print(4 * dentro.mean())  # estimativa de pi
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Mais amostras = menos variância (custa tempo)
- Vetorize a simulação com NumPy para velocidade

## Pratique

Para fixar, escreva um pequeno script que combine **amostragem aleatória para estimar valores** e **lei dos grandes números garante convergência** em um caso do seu dia a dia. Depois refatore aplicando "Mais amostras = menos variância (custa tempo)".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Amostragem aleatória para estimar valores
- [ ] Explicar e aplicar: Lei dos grandes números garante convergência
- [ ] Explicar e aplicar: Estimar π, integrais e risco
- [ ] Explicar e aplicar: Reprodutibilidade com seed fixa

## Saiba mais

- [Documentação oficial](https://numpy.org/doc/stable/reference/random/)
