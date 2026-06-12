# Padrões de agentes e orquestração

Do agente único a sistemas multi-agente com memória e planejamento.

> **Tema:** LLMs Aplicados · **Nível:** avancado · **Trilha:** Agentes de IA com Tool Use

## Conceitos-chave

Nesta lição você vai entender:

- **ReAct: alterna raciocínio e ação**
- **Memória de curto e longo prazo**
- **Planejar-executar para tarefas complexas**
- **Multi-agente: especialistas que colaboram**

## Exemplo prático

```python
while not tarefa.concluida:
    pensamento = llm.pensar(estado)
    acao = pensamento.acao
    obs = executar(acao)
    estado.adicionar(obs)
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Limite o número de passos para evitar loops infinitos
- Comece com um agente simples antes de multi-agente

## Pratique

Para fixar, escreva um pequeno script que combine **react: alterna raciocínio e ação** e **memória de curto e longo prazo** em um caso do seu dia a dia. Depois refatore aplicando "Limite o número de passos para evitar loops infinitos".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: ReAct: alterna raciocínio e ação
- [ ] Explicar e aplicar: Memória de curto e longo prazo
- [ ] Explicar e aplicar: Planejar-executar para tarefas complexas
- [ ] Explicar e aplicar: Multi-agente: especialistas que colaboram

## Saiba mais

- [Documentação oficial](https://www.anthropic.com/research/building-effective-agents)
