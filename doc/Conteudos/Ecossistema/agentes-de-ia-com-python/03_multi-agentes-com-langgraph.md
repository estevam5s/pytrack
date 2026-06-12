# Multi-agentes com LangGraph

Sistemas multi-agente coordenam vários agentes especializados via um grafo de estados.

> **Tema:** IA Generativa · **Nível:** avancado · **Trilha:** Agentes de IA com Python

## Conceitos-chave

Nesta lição você vai entender:

- **LangGraph modela fluxos como grafos de estado**
- **Nós são agentes/ferramentas; arestas são transições**
- **Estado compartilhado entre os passos**
- **Um supervisor roteia tarefas entre agentes**

## Exemplo prático

```python
from langgraph.graph import StateGraph, END

g = StateGraph(Estado)
g.add_node('pesquisar', pesquisar)
g.add_node('escrever', escrever)
g.add_edge('pesquisar', 'escrever')
g.add_edge('escrever', END)
app = g.compile()
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Comece com 1 agente; só adicione mais se necessário
- Persista o estado para retomar execuções

## Pratique

Para fixar, escreva um pequeno script que combine **langgraph modela fluxos como grafos de estado** e **nós são agentes/ferramentas; arestas são transições** em um caso do seu dia a dia. Depois refatore aplicando "Comece com 1 agente; só adicione mais se necessário".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: LangGraph modela fluxos como grafos de estado
- [ ] Explicar e aplicar: Nós são agentes/ferramentas; arestas são transições
- [ ] Explicar e aplicar: Estado compartilhado entre os passos
- [ ] Explicar e aplicar: Um supervisor roteia tarefas entre agentes

## Saiba mais

- [Documentação oficial](https://langchain-ai.github.io/langgraph/)
