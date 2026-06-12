# Pipeline RAG completo

Combine recuperação e geração para responder com base nos seus dados, reduzindo alucinações.

## Pontos-chave

- Retriever busca contexto relevante
- Prompt injeta contexto e pergunta
- LLM gera resposta fundamentada
- Cite fontes e avalie a qualidade

## Exemplo

```python
from langchain_core.runnables import RunnablePassthrough

rag = (
    {'contexto': retriever, 'pergunta': RunnablePassthrough()}
    | prompt | llm
)
print(rag.invoke('Qual a política de reembolso?'))
```

## Boas práticas

- Avalie com perguntas de teste (RAGAS)
- Limite o contexto ao essencial

## Saiba mais

- [Documentação oficial](https://python.langchain.com/docs/tutorials/rag/)
