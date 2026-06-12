# Ferramentas e function calling

Function calling permite que o modelo invoque funções tipadas com argumentos estruturados.

> **Tema:** IA Generativa · **Nível:** avancado · **Trilha:** Agentes de IA com Python

## Conceitos-chave

Nesta lição você vai entender:

- **Defina tools com tipos e descrições claras**
- **O modelo retorna a função e os argumentos**
- **Você executa e devolve o resultado**
- **Valide as saídas com Pydantic**

## Exemplo prático

```python
@tool
def buscar_clima(cidade: str) -> str:
    'Retorna o clima atual de uma cidade.'
    return api_clima(cidade)

llm_tools = llm.bind_tools([buscar_clima])
resp = llm_tools.invoke('Como está o tempo em SP?')
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Trate erros das ferramentas com mensagens úteis
- Nunca confie cegamente na saída do agente

## Pratique

Para fixar, escreva um pequeno script que combine **defina tools com tipos e descrições claras** e **o modelo retorna a função e os argumentos** em um caso do seu dia a dia. Depois refatore aplicando "Trate erros das ferramentas com mensagens úteis".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Defina tools com tipos e descrições claras
- [ ] Explicar e aplicar: O modelo retorna a função e os argumentos
- [ ] Explicar e aplicar: Você executa e devolve o resultado
- [ ] Explicar e aplicar: Valide as saídas com Pydantic

## Saiba mais

- [Documentação oficial](https://python.langchain.com/docs/concepts/tool_calling/)
