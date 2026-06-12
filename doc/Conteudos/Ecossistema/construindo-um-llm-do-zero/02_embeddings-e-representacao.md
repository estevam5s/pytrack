# Embeddings e representação

Cada token vira um vetor denso (embedding) que o modelo aprende durante o treino.

> **Tema:** IA Generativa · **Nível:** avancado · **Trilha:** Construindo um LLM do Zero

## Conceitos-chave

Nesta lição você vai entender:

- **nn.Embedding mapeia id de token para vetor**
- **Dimensão do embedding (d_model): 256, 768, 4096**
- **Vetores próximos = significados próximos**
- **Embeddings são treináveis (aprendidos por gradiente)**

## Exemplo prático

```python
import torch, torch.nn as nn

emb = nn.Embedding(num_embeddings=50000, embedding_dim=768)
ids = torch.tensor([10, 42, 7])
print(emb(ids).shape)  # [3, 768]
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Compartilhe pesos entre embedding e camada de saída
- Normalize embeddings quando fizer sentido

## Pratique

Para fixar, escreva um pequeno script que combine **nn.embedding mapeia id de token para vetor** e **dimensão do embedding (d_model): 256, 768, 4096** em um caso do seu dia a dia. Depois refatore aplicando "Compartilhe pesos entre embedding e camada de saída".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: nn.Embedding mapeia id de token para vetor
- [ ] Explicar e aplicar: Dimensão do embedding (d_model): 256, 768, 4096
- [ ] Explicar e aplicar: Vetores próximos = significados próximos
- [ ] Explicar e aplicar: Embeddings são treináveis (aprendidos por gradiente)

## Saiba mais

- [Documentação oficial](https://pytorch.org/docs/stable/generated/torch.nn.Embedding.html)
