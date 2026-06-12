# Avaliação e qualidade do RAG

Sem avaliação, você não sabe se o RAG ajuda ou alucina.

> **Tema:** LLMs Aplicados · **Nível:** avancado · **Trilha:** RAG: Geração Aumentada por Recuperação

## Conceitos-chave

Nesta lição você vai entender:

- **Relevância da recuperação (recall@k)**
- **Fidelidade: a resposta vem do contexto?**
- **Frameworks: RAGAS, DeepEval**
- **Conjunto de perguntas-resposta de referência**

## Exemplo prático

```python
# métrica simples de recuperação
def recall_at_k(esperados, recuperados, k):
    return len(set(esperados) & set(recuperados[:k])) / len(esperados)
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Monte um dataset de avaliação cedo
- Meça recuperação e geração separadamente

## Pratique

Para fixar, escreva um pequeno script que combine **relevância da recuperação (recall@k)** e **fidelidade: a resposta vem do contexto?** em um caso do seu dia a dia. Depois refatore aplicando "Monte um dataset de avaliação cedo".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Relevância da recuperação (recall@k)
- [ ] Explicar e aplicar: Fidelidade: a resposta vem do contexto?
- [ ] Explicar e aplicar: Frameworks: RAGAS, DeepEval
- [ ] Explicar e aplicar: Conjunto de perguntas-resposta de referência

## Saiba mais

- [Documentação oficial](https://docs.ragas.io/)
