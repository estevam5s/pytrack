# Filtragem colaborativa e de conteúdo

Recomende itens relevantes a usuários.

## Pontos-chave

- Baseada em conteúdo (similaridade)
- Filtragem colaborativa (usuários/itens)
- Matriz de utilidade e fatoração
- Avaliação (precision@k, recall@k)

## Exemplo

```python
from sklearn.metrics.pairwise import cosine_similarity
sim = cosine_similarity(matriz_itens)
# recomenda itens mais similares aos já curtidos
```

## Boas práticas

- Trate o cold start
- Cuide de viés e diversidade

## Saiba mais

- [Documentação oficial](https://scikit-learn.org/stable/modules/metrics.html)
