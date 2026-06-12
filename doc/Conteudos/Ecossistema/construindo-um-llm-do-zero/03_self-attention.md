# Self-attention

O coração do Transformer: cada token olha para os outros e decide no que prestar atenção.

## Pontos-chave

- Query, Key e Value são projeções lineares do input
- Atenção = softmax(QK^T / sqrt(d)) V
- Máscara causal impede ver o futuro (modelos GPT)
- Complexidade O(n^2) no tamanho da sequência

## Exemplo

```python
import torch, torch.nn.functional as F

def attention(q, k, v, mask=None):
    d = q.size(-1)
    scores = q @ k.transpose(-2, -1) / d**0.5
    if mask is not None:
        scores = scores.masked_fill(mask == 0, float('-inf'))
    return F.softmax(scores, dim=-1) @ v
```

## Boas práticas

- Use máscara causal para geração autoregressiva
- Flash Attention acelera muito o treino

## Saiba mais

- [Documentação oficial](https://arxiv.org/abs/1706.03762)
