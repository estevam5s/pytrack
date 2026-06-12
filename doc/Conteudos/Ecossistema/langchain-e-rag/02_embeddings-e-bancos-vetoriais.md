# Embeddings e bancos vetoriais

RAG (Retrieval-Augmented Generation) busca trechos relevantes em um banco vetorial e injeta no prompt.

> **Tema:** IA Generativa · **Nível:** avancado · **Trilha:** LangChain e RAG

## Conceitos-chave

Nesta lição você vai entender:

- **Embeddings transformam texto em vetores**
- **Bancos vetoriais (Chroma, FAISS, pgvector) buscam por similaridade**
- **Chunking divide documentos em pedaços**
- **Top-k recupera os trechos mais relevantes**

## Exemplo prático

```python
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings

db = Chroma.from_texts(textos, OpenAIEmbeddings())
docs = db.similarity_search('como fazer deploy?', k=4)
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Ajuste o tamanho do chunk ao domínio
- Guarde metadados para filtrar a busca

## Pratique

Para fixar, escreva um pequeno script que combine **embeddings transformam texto em vetores** e **bancos vetoriais (chroma, faiss, pgvector) buscam por similaridade** em um caso do seu dia a dia. Depois refatore aplicando "Ajuste o tamanho do chunk ao domínio".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Embeddings transformam texto em vetores
- [ ] Explicar e aplicar: Bancos vetoriais (Chroma, FAISS, pgvector) buscam por similaridade
- [ ] Explicar e aplicar: Chunking divide documentos em pedaços
- [ ] Explicar e aplicar: Top-k recupera os trechos mais relevantes

## Saiba mais

- [Documentação oficial](https://python.langchain.com/docs/concepts/rag/)
