# Pipeline RAG completo

Combine recuperação e geração para responder com base nos seus dados, reduzindo alucinações.

> **Tema:** IA Generativa · **Nível:** avancado · **Trilha:** LangChain e RAG

## Conceitos-chave

Nesta lição você vai entender:

- **Retriever busca contexto relevante**
- **Prompt injeta contexto e pergunta**
- **LLM gera resposta fundamentada**
- **Cite fontes e avalie a qualidade**

## Exemplo prático

```python
from langchain_core.runnables import RunnablePassthrough

rag = (
    {'contexto': retriever, 'pergunta': RunnablePassthrough()}
    | prompt | llm
)
print(rag.invoke('Qual a política de reembolso?'))
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Avalie com perguntas de teste (RAGAS)
- Limite o contexto ao essencial

## Pratique

Para fixar, escreva um pequeno script que combine **retriever busca contexto relevante** e **prompt injeta contexto e pergunta** em um caso do seu dia a dia. Depois refatore aplicando "Avalie com perguntas de teste (RAGAS)".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Retriever busca contexto relevante
- [ ] Explicar e aplicar: Prompt injeta contexto e pergunta
- [ ] Explicar e aplicar: LLM gera resposta fundamentada
- [ ] Explicar e aplicar: Cite fontes e avalie a qualidade

## Saiba mais

- [Documentação oficial](https://python.langchain.com/docs/tutorials/rag/)
