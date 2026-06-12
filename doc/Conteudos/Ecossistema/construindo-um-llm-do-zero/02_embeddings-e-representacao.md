# Embeddings e representação

Cada token vira um vetor denso (embedding) que o modelo aprende durante o treino.

## Pontos-chave

- nn.Embedding mapeia id de token para vetor
- Dimensão do embedding (d_model): 256, 768, 4096
- Vetores próximos = significados próximos
- Embeddings são treináveis (aprendidos por gradiente)

## Exemplo

```python
import torch, torch.nn as nn

emb = nn.Embedding(num_embeddings=50000, embedding_dim=768)
ids = torch.tensor([10, 42, 7])
print(emb(ids).shape)  # [3, 768]
```

## Boas práticas

- Compartilhe pesos entre embedding e camada de saída
- Normalize embeddings quando fizer sentido

## Saiba mais

- [Documentação oficial](https://pytorch.org/docs/stable/generated/torch.nn.Embedding.html)
