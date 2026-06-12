# Tokenização e vocabulário (BPE)

Antes de treinar um modelo de linguagem, o texto vira tokens. O Byte-Pair Encoding (BPE) é o algoritmo padrão.

## Pontos-chave

- Tokens são subpalavras, não letras nem palavras inteiras
- BPE funde os pares mais frequentes iterativamente
- Vocabulário típico: 30k a 100k tokens
- tiktoken (OpenAI) e o tokenizer do HuggingFace

## Exemplo

```python
from collections import Counter

def pares(tokens):
    return Counter(zip(tokens, tokens[1:]))

toks = list('banana')
print(pares(toks).most_common(1))
```

## Boas práticas

- Reutilize um tokenizer treinado quando possível
- O tamanho do vocabulário afeta memória e velocidade

## Saiba mais

- [Documentação oficial](https://huggingface.co/learn/nlp-course/chapter6/5)
