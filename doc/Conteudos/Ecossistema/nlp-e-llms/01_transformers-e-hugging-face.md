# Transformers e Hugging Face

Modelos de linguagem pré-treinados para NLP.

## Pontos-chave

- pipeline() para tarefas prontas
- Tokenização e modelos pré-treinados
- Fine-tuning quando necessário
- Datasets da Hugging Face

## Exemplo

```python
from transformers import pipeline
clf = pipeline('sentiment-analysis')
print(clf('Eu amo Python!'))
```

## Boas práticas

- Comece com modelos prontos
- Avalie custo/latência do modelo

## Saiba mais

- [Documentação oficial](https://huggingface.co/docs/transformers)
