# O que são agentes de IA

Agentes usam um LLM como cérebro que decide quais ferramentas chamar para cumprir um objetivo.

> **Tema:** IA Generativa · **Nível:** avancado · **Trilha:** Agentes de IA com Python

## Conceitos-chave

Nesta lição você vai entender:

- **O LLM raciocina e escolhe ações (tools)**
- **Ferramentas dão acesso a APIs, busca e código**
- **Loop: pensar -> agir -> observar -> repetir**
- **Frameworks: LangGraph, CrewAI, AutoGen**

## Exemplo prático

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

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Descreva bem cada ferramenta (o LLM lê a docstring)
- Limite o número de passos para evitar loops

## Pratique

Para fixar, escreva um pequeno script que combine **o llm raciocina e escolhe ações (tools)** e **ferramentas dão acesso a apis, busca e código** em um caso do seu dia a dia. Depois refatore aplicando "Descreva bem cada ferramenta (o LLM lê a docstring)".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: O LLM raciocina e escolhe ações (tools)
- [ ] Explicar e aplicar: Ferramentas dão acesso a APIs, busca e código
- [ ] Explicar e aplicar: Loop: pensar -> agir -> observar -> repetir
- [ ] Explicar e aplicar: Frameworks: LangGraph, CrewAI, AutoGen

## Saiba mais

- [Documentação oficial](https://python.langchain.com/docs/concepts/agents/)
