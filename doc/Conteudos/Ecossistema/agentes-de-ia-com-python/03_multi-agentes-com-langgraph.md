# Multi-agentes com LangGraph

Sistemas multi-agente coordenam vários agentes especializados via um grafo de estados.

## Pontos-chave

- LangGraph modela fluxos como grafos de estado
- Nós são agentes/ferramentas; arestas são transições
- Estado compartilhado entre os passos
- Um supervisor roteia tarefas entre agentes

## Exemplo

```python
from langgraph.graph import StateGraph, END

g = StateGraph(Estado)
g.add_node('pesquisar', pesquisar)
g.add_node('escrever', escrever)
g.add_edge('pesquisar', 'escrever')
g.add_edge('escrever', END)
app = g.compile()
```

## Boas práticas

- Comece com 1 agente; só adicione mais se necessário
- Persista o estado para retomar execuções

## Saiba mais

- [Documentação oficial](https://langchain-ai.github.io/langgraph/)
