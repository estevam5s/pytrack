# Embeddings e bancos vetoriais

RAG (Retrieval-Augmented Generation) busca trechos relevantes em um banco vetorial e injeta no prompt.

## Pontos-chave

- Embeddings transformam texto em vetores
- Bancos vetoriais (Chroma, FAISS, pgvector) buscam por similaridade
- Chunking divide documentos em pedaços
- Top-k recupera os trechos mais relevantes

## Exemplo

```python
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings

db = Chroma.from_texts(textos, OpenAIEmbeddings())
docs = db.similarity_search('como fazer deploy?', k=4)
```

## Boas práticas

- Ajuste o tamanho do chunk ao domínio
- Guarde metadados para filtrar a busca

## Saiba mais

- [Documentação oficial](https://python.langchain.com/docs/concepts/rag/)
