# Multi-head attention e bloco Transformer

Várias cabeças de atenção em paralelo capturam relações diferentes; o bloco junta atenção + MLP.

> **Tema:** IA Generativa · **Nível:** avancado · **Trilha:** Construindo um LLM do Zero

## Conceitos-chave

Nesta lição você vai entender:

- **Multi-head divide d_model em h cabeças**
- **Residual connections + LayerNorm estabilizam o treino**
- **Feed-forward (MLP) expande e contrai a dimensão**
- **Empilhar N blocos forma o modelo**

## Exemplo prático

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

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Pre-norm treina mais estável que post-norm
- GELU costuma superar ReLU em Transformers

## Pratique

Para fixar, escreva um pequeno script que combine **multi-head divide d_model em h cabeças** e **residual connections + layernorm estabilizam o treino** em um caso do seu dia a dia. Depois refatore aplicando "Pre-norm treina mais estável que post-norm".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Multi-head divide d_model em h cabeças
- [ ] Explicar e aplicar: Residual connections + LayerNorm estabilizam o treino
- [ ] Explicar e aplicar: Feed-forward (MLP) expande e contrai a dimensão
- [ ] Explicar e aplicar: Empilhar N blocos forma o modelo

## Saiba mais

- [Documentação oficial](https://nlp.seas.harvard.edu/annotated-transformer/)
