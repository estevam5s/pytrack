# Montando o pipeline RAG

Recuperar contexto, montar o prompt e gerar a resposta fundamentada.

> **Tema:** LLMs Aplicados · **Nível:** avancado · **Trilha:** RAG: Geração Aumentada por Recuperação

## Conceitos-chave

Nesta lição você vai entender:

- **Indexar: documentos → chunks → embeddings → DB**
- **Recuperar: top-k trechos mais similares à pergunta**
- **Aumentar: injetar trechos no prompt do LLM**
- **Gerar: resposta citando as fontes**

## Exemplo prático

```python
def responder(pergunta, db, llm):
    trechos = db.buscar(pergunta, k=4)
    contexto = '\n'.join(trechos)
    prompt = f'Contexto:\n{contexto}\n\nPergunta: {pergunta}'
    return llm(prompt)
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Cite as fontes para o usuário confiar
- Recupere o suficiente, sem estourar a janela de contexto

## Pratique

Para fixar, escreva um pequeno script que combine **indexar: documentos → chunks → embeddings → db** e **recuperar: top-k trechos mais similares à pergunta** em um caso do seu dia a dia. Depois refatore aplicando "Cite as fontes para o usuário confiar".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Indexar: documentos → chunks → embeddings → DB
- [ ] Explicar e aplicar: Recuperar: top-k trechos mais similares à pergunta
- [ ] Explicar e aplicar: Aumentar: injetar trechos no prompt do LLM
- [ ] Explicar e aplicar: Gerar: resposta citando as fontes

## Saiba mais

- [Documentação oficial](https://python.langchain.com/docs/tutorials/rag/)
