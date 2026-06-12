# Transformers e Hugging Face

Modelos de linguagem pré-treinados para NLP.

> **Tema:** IA · **Nível:** avancado · **Trilha:** NLP e LLMs

## Conceitos-chave

Nesta lição você vai entender:

- **pipeline() para tarefas prontas**
- **Tokenização e modelos pré-treinados**
- **Fine-tuning quando necessário**
- **Datasets da Hugging Face**

## Exemplo prático

```python
from transformers import pipeline
clf = pipeline('sentiment-analysis')
print(clf('Eu amo Python!'))
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Comece com modelos prontos
- Avalie custo/latência do modelo

## Pratique

Para fixar, escreva um pequeno script que combine **pipeline() para tarefas prontas** e **tokenização e modelos pré-treinados** em um caso do seu dia a dia. Depois refatore aplicando "Comece com modelos prontos".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: pipeline() para tarefas prontas
- [ ] Explicar e aplicar: Tokenização e modelos pré-treinados
- [ ] Explicar e aplicar: Fine-tuning quando necessário
- [ ] Explicar e aplicar: Datasets da Hugging Face

## Saiba mais

- [Documentação oficial](https://huggingface.co/docs/transformers)
