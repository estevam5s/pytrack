# RAG e busca semântica

Recuperação aumentada por geração com bancos vetoriais.

## Pontos-chave

- Embeddings representam significado
- Bancos vetoriais (FAISS, Qdrant, Chroma)
- Recupera contexto e gera resposta fundamentada
- Guardrails e avaliação

## Exemplo

```python
from sentence_transformers import SentenceTransformer
model = SentenceTransformer('all-MiniLM-L6-v2')
vecs = model.encode(['texto 1', 'texto 2'])
```

## Boas práticas

- Fundamente respostas em fontes
- Monitore qualidade e custo

## Saiba mais

- [Documentação oficial](https://www.sbert.net/)
