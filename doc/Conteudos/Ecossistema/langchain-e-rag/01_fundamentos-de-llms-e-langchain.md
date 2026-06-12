# Fundamentos de LLMs e LangChain

LangChain orquestra chamadas a modelos de linguagem (LLMs), conectando prompts, modelos e ferramentas em cadeias.

> **Tema:** IA Generativa · **Nível:** avancado · **Trilha:** LangChain e RAG

## Conceitos-chave

Nesta lição você vai entender:

- **LLMs geram texto a partir de prompts e contexto**
- **Prompt templates parametrizam instruções**
- **Chains encadeiam prompt -> modelo -> parser**
- **Integração com OpenAI, Anthropic, Ollama e outros**

## Exemplo prático

```python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

llm = ChatOpenAI(model='gpt-4o-mini')
prompt = ChatPromptTemplate.from_template('Explique {tema} em uma frase')
chain = prompt | llm
print(chain.invoke({'tema': 'RAG'}).content)
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Versione e teste seus prompts
- Ajuste a temperatura conforme a tarefa

## Pratique

Para fixar, escreva um pequeno script que combine **llms geram texto a partir de prompts e contexto** e **prompt templates parametrizam instruções** em um caso do seu dia a dia. Depois refatore aplicando "Versione e teste seus prompts".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: LLMs geram texto a partir de prompts e contexto
- [ ] Explicar e aplicar: Prompt templates parametrizam instruções
- [ ] Explicar e aplicar: Chains encadeiam prompt -> modelo -> parser
- [ ] Explicar e aplicar: Integração com OpenAI, Anthropic, Ollama e outros

## Saiba mais

- [Documentação oficial](https://python.langchain.com/)
