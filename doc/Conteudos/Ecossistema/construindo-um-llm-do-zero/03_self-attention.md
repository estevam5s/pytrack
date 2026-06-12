# Self-attention

O coração do Transformer: cada token olha para os outros e decide no que prestar atenção.

> **Tema:** IA Generativa · **Nível:** avancado · **Trilha:** Construindo um LLM do Zero

## Conceitos-chave

Nesta lição você vai entender:

- **Query, Key e Value são projeções lineares do input**
- **Atenção = softmax(QK^T / sqrt(d)) V**
- **Máscara causal impede ver o futuro (modelos GPT)**
- **Complexidade O(n^2) no tamanho da sequência**

## Exemplo prático

```python
import torch, torch.nn.functional as F

def attention(q, k, v, mask=None):
    d = q.size(-1)
    scores = q @ k.transpose(-2, -1) / d**0.5
    if mask is not None:
        scores = scores.masked_fill(mask == 0, float('-inf'))
    return F.softmax(scores, dim=-1) @ v
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Use máscara causal para geração autoregressiva
- Flash Attention acelera muito o treino

## Pratique

Para fixar, escreva um pequeno script que combine **query, key e value são projeções lineares do input** e **atenção = softmax(qk^t / sqrt(d)) v** em um caso do seu dia a dia. Depois refatore aplicando "Use máscara causal para geração autoregressiva".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Query, Key e Value são projeções lineares do input
- [ ] Explicar e aplicar: Atenção = softmax(QK^T / sqrt(d)) V
- [ ] Explicar e aplicar: Máscara causal impede ver o futuro (modelos GPT)
- [ ] Explicar e aplicar: Complexidade O(n^2) no tamanho da sequência

## Saiba mais

- [Documentação oficial](https://arxiv.org/abs/1706.03762)
