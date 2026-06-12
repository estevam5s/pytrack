# Filtragem colaborativa e de conteúdo

Recomende itens relevantes a usuários.

> **Tema:** Recomendação · **Nível:** avancado · **Trilha:** Sistemas de Recomendação

## Conceitos-chave

Nesta lição você vai entender:

- **Baseada em conteúdo (similaridade)**
- **Filtragem colaborativa (usuários/itens)**
- **Matriz de utilidade e fatoração**
- **Avaliação (precision@k, recall@k)**

## Exemplo prático

```python
from sklearn.metrics.pairwise import cosine_similarity
sim = cosine_similarity(matriz_itens)
# recomenda itens mais similares aos já curtidos
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Trate o cold start
- Cuide de viés e diversidade

## Pratique

Para fixar, escreva um pequeno script que combine **baseada em conteúdo (similaridade)** e **filtragem colaborativa (usuários/itens)** em um caso do seu dia a dia. Depois refatore aplicando "Trate o cold start".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Baseada em conteúdo (similaridade)
- [ ] Explicar e aplicar: Filtragem colaborativa (usuários/itens)
- [ ] Explicar e aplicar: Matriz de utilidade e fatoração
- [ ] Explicar e aplicar: Avaliação (precision@k, recall@k)

## Saiba mais

- [Documentação oficial](https://scikit-learn.org/stable/modules/metrics.html)
