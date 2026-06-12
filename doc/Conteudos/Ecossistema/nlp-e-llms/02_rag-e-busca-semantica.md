# RAG e busca semântica

Recuperação aumentada por geração com bancos vetoriais.

> **Tema:** IA · **Nível:** avancado · **Trilha:** NLP e LLMs

## Conceitos-chave

Nesta lição você vai entender:

- **Embeddings representam significado**
- **Bancos vetoriais (FAISS, Qdrant, Chroma)**
- **Recupera contexto e gera resposta fundamentada**
- **Guardrails e avaliação**

## Exemplo prático

```python
from sentence_transformers import SentenceTransformer
model = SentenceTransformer('all-MiniLM-L6-v2')
vecs = model.encode(['texto 1', 'texto 2'])
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Fundamente respostas em fontes
- Monitore qualidade e custo

## Pratique

Para fixar, escreva um pequeno script que combine **embeddings representam significado** e **bancos vetoriais (faiss, qdrant, chroma)** em um caso do seu dia a dia. Depois refatore aplicando "Fundamente respostas em fontes".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Embeddings representam significado
- [ ] Explicar e aplicar: Bancos vetoriais (FAISS, Qdrant, Chroma)
- [ ] Explicar e aplicar: Recupera contexto e gera resposta fundamentada
- [ ] Explicar e aplicar: Guardrails e avaliação

## Saiba mais

- [Documentação oficial](https://www.sbert.net/)
