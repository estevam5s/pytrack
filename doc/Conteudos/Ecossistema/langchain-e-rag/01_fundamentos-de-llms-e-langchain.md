# Fundamentos de LLMs e LangChain

LangChain orquestra chamadas a modelos de linguagem (LLMs), conectando prompts, modelos e ferramentas em cadeias.

## Pontos-chave

- LLMs geram texto a partir de prompts e contexto
- Prompt templates parametrizam instruções
- Chains encadeiam prompt -> modelo -> parser
- Integração com OpenAI, Anthropic, Ollama e outros

## Exemplo

```python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

llm = ChatOpenAI(model='gpt-4o-mini')
prompt = ChatPromptTemplate.from_template('Explique {tema} em uma frase')
chain = prompt | llm
print(chain.invoke({'tema': 'RAG'}).content)
```

## Boas práticas

- Versione e teste seus prompts
- Ajuste a temperatura conforme a tarefa

## Saiba mais

- [Documentação oficial](https://python.langchain.com/)
