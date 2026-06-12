# Multi-head attention e bloco Transformer

Várias cabeças de atenção em paralelo capturam relações diferentes; o bloco junta atenção + MLP.

## Pontos-chave

- Multi-head divide d_model em h cabeças
- Residual connections + LayerNorm estabilizam o treino
- Feed-forward (MLP) expande e contrai a dimensão
- Empilhar N blocos forma o modelo

## Exemplo

```python
import torch.nn as nn

class Bloco(nn.Module):
    def __init__(self, d, h):
        super().__init__()
        self.attn = nn.MultiheadAttention(d, h, batch_first=True)
        self.ln1, self.ln2 = nn.LayerNorm(d), nn.LayerNorm(d)
        self.mlp = nn.Sequential(nn.Linear(d, 4*d), nn.GELU(), nn.Linear(4*d, d))
    def forward(self, x):
        a, _ = self.attn(self.ln1(x), self.ln1(x), self.ln1(x))
        x = x + a
        return x + self.mlp(self.ln2(x))
```

## Boas práticas

- Pre-norm treina mais estável que post-norm
- GELU costuma superar ReLU em Transformers

## Saiba mais

- [Documentação oficial](https://nlp.seas.harvard.edu/annotated-transformer/)
