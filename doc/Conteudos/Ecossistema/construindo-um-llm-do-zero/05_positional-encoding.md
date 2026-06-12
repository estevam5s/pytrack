# Positional encoding

Atenção não tem noção de ordem; a posição precisa ser injetada (senoidal ou RoPE).

> **Tema:** IA Generativa · **Nível:** avancado · **Trilha:** Construindo um LLM do Zero

## Conceitos-chave

Nesta lição você vai entender:

- **Encoding senoidal (Transformer original)**
- **Embeddings de posição aprendidos (GPT-2)**
- **RoPE (rotary) usado em LLaMA e modelos modernos**
- **ALiBi como alternativa para extrapolar contexto**

## Exemplo prático

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

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- RoPE generaliza melhor para sequências longas
- Some o encoding aos embeddings antes do primeiro bloco

## Pratique

Para fixar, escreva um pequeno script que combine **encoding senoidal (transformer original)** e **embeddings de posição aprendidos (gpt-2)** em um caso do seu dia a dia. Depois refatore aplicando "RoPE generaliza melhor para sequências longas".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Encoding senoidal (Transformer original)
- [ ] Explicar e aplicar: Embeddings de posição aprendidos (GPT-2)
- [ ] Explicar e aplicar: RoPE (rotary) usado em LLaMA e modelos modernos
- [ ] Explicar e aplicar: ALiBi como alternativa para extrapolar contexto

## Saiba mais

- [Documentação oficial](https://arxiv.org/abs/2104.09864)
