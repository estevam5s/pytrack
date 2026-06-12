# Tokenização e vocabulário (BPE)

Antes de treinar um modelo de linguagem, o texto vira tokens. O Byte-Pair Encoding (BPE) é o algoritmo padrão.

> **Tema:** IA Generativa · **Nível:** avancado · **Trilha:** Construindo um LLM do Zero

## Conceitos-chave

Nesta lição você vai entender:

- **Tokens são subpalavras, não letras nem palavras inteiras**
- **BPE funde os pares mais frequentes iterativamente**
- **Vocabulário típico: 30k a 100k tokens**
- **tiktoken (OpenAI) e o tokenizer do HuggingFace**

## Exemplo prático

```python
from collections import Counter

def pares(tokens):
    return Counter(zip(tokens, tokens[1:]))

toks = list('banana')
print(pares(toks).most_common(1))
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Reutilize um tokenizer treinado quando possível
- O tamanho do vocabulário afeta memória e velocidade

## Pratique

Para fixar, escreva um pequeno script que combine **tokens são subpalavras, não letras nem palavras inteiras** e **bpe funde os pares mais frequentes iterativamente** em um caso do seu dia a dia. Depois refatore aplicando "Reutilize um tokenizer treinado quando possível".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Tokens são subpalavras, não letras nem palavras inteiras
- [ ] Explicar e aplicar: BPE funde os pares mais frequentes iterativamente
- [ ] Explicar e aplicar: Vocabulário típico: 30k a 100k tokens
- [ ] Explicar e aplicar: tiktoken (OpenAI) e o tokenizer do HuggingFace

## Saiba mais

- [Documentação oficial](https://huggingface.co/learn/nlp-course/chapter6/5)
