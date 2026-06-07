# Ferramentas e function calling

Function calling permite que o modelo invoque funções tipadas com argumentos estruturados.

## Pontos-chave

- Defina tools com tipos e descrições claras
- O modelo retorna a função e os argumentos
- Você executa e devolve o resultado
- Valide as saídas com Pydantic

## Exemplo

```python
@tool
def buscar_clima(cidade: str) -> str:
    'Retorna o clima atual de uma cidade.'
    return api_clima(cidade)

llm_tools = llm.bind_tools([buscar_clima])
resp = llm_tools.invoke('Como está o tempo em SP?')
```

## Boas práticas

- Trate erros das ferramentas com mensagens úteis
- Nunca confie cegamente na saída do agente

## Saiba mais

- [Documentação oficial](https://python.langchain.com/docs/concepts/tool_calling/)
