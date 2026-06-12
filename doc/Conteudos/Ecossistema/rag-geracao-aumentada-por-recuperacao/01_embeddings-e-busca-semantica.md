# Embeddings e busca semântica

RAG dá ao LLM acesso aos seus dados buscando trechos relevantes por significado.

> **Tema:** LLMs Aplicados · **Nível:** avancado · **Trilha:** RAG: Geração Aumentada por Recuperação

## Conceitos-chave

Nesta lição você vai entender:

- **Embeddings transformam texto em vetores**
- **Busca por similaridade (cosseno) acha trechos relevantes**
- **Vector DBs: FAISS, Chroma, pgvector**
- **Chunking: dividir documentos em pedaços úteis**

## Exemplo prático

```python
from sentence_transformers import SentenceTransformer
import numpy as np

m = SentenceTransformer('all-MiniLM-L6-v2')
vs = m.encode(['gato', 'felino', 'carro'])
print(np.dot(vs[0], vs[1]))  # alto: gato~felino
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Ajuste o tamanho do chunk ao seu conteúdo
- Guarde metadados junto dos vetores para filtrar

## Pratique

Para fixar, escreva um pequeno script que combine **embeddings transformam texto em vetores** e **busca por similaridade (cosseno) acha trechos relevantes** em um caso do seu dia a dia. Depois refatore aplicando "Ajuste o tamanho do chunk ao seu conteúdo".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Embeddings transformam texto em vetores
- [ ] Explicar e aplicar: Busca por similaridade (cosseno) acha trechos relevantes
- [ ] Explicar e aplicar: Vector DBs: FAISS, Chroma, pgvector
- [ ] Explicar e aplicar: Chunking: dividir documentos em pedaços úteis

## Saiba mais

- [Documentação oficial](https://www.sbert.net/)
