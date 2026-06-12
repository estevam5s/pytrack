# Positional encoding

Atenção não tem noção de ordem; a posição precisa ser injetada (senoidal ou RoPE).

## Pontos-chave

- Encoding senoidal (Transformer original)
- Embeddings de posição aprendidos (GPT-2)
- RoPE (rotary) usado em LLaMA e modelos modernos
- ALiBi como alternativa para extrapolar contexto

## Exemplo

```python
import torch, math

def pos_encoding(seq_len, d):
    pe = torch.zeros(seq_len, d)
    pos = torch.arange(seq_len).unsqueeze(1)
    div = torch.exp(torch.arange(0, d, 2) * -(math.log(10000)/d))
    pe[:, 0::2] = torch.sin(pos*div)
    pe[:, 1::2] = torch.cos(pos*div)
    return pe
```

## Boas práticas

- RoPE generaliza melhor para sequências longas
- Some o encoding aos embeddings antes do primeiro bloco

## Saiba mais

- [Documentação oficial](https://arxiv.org/abs/2104.09864)
