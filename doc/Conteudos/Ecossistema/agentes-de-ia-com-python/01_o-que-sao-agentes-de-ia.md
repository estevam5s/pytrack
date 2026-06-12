# O que são agentes de IA

Agentes usam um LLM como cérebro que decide quais ferramentas chamar para cumprir um objetivo.

## Pontos-chave

- O LLM raciocina e escolhe ações (tools)
- Ferramentas dão acesso a APIs, busca e código
- Loop: pensar -> agir -> observar -> repetir
- Frameworks: LangGraph, CrewAI, AutoGen

## Exemplo

```python
from langchain.agents import create_react_agent, AgentExecutor
from langchain_core.tools import tool

@tool
def somar(a: int, b: int) -> int:
    'Soma dois números.'
    return a + b

agent = create_react_agent(llm, [somar], prompt)
executor = AgentExecutor(agent=agent, tools=[somar])
```

## Boas práticas

- Descreva bem cada ferramenta (o LLM lê a docstring)
- Limite o número de passos para evitar loops

## Saiba mais

- [Documentação oficial](https://python.langchain.com/docs/concepts/agents/)
