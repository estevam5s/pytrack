# Tool use e function calling

Um agente é um LLM que decide chamar ferramentas (funções) para agir no mundo.

> **Tema:** LLMs Aplicados · **Nível:** avancado · **Trilha:** Agentes de IA com Tool Use

## Conceitos-chave

Nesta lição você vai entender:

- **O modelo escolhe a função e os argumentos**
- **Você define ferramentas com schema (nome, params)**
- **O loop: pensar → chamar tool → observar → repetir**
- **Ferramentas: busca, código, APIs, banco de dados**

## Exemplo prático

```python
def buscar_clima(cidade: str) -> str:
    '''Retorna o clima atual de uma cidade.'''
    return consultar_api(cidade)

# o LLM recebe o schema e decide chamar buscar_clima('SP')
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Descreva bem cada ferramenta — o modelo lê a docstring
- Valide os argumentos antes de executar a ação

## Pratique

Para fixar, escreva um pequeno script que combine **o modelo escolhe a função e os argumentos** e **você define ferramentas com schema (nome, params)** em um caso do seu dia a dia. Depois refatore aplicando "Descreva bem cada ferramenta — o modelo lê a docstring".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: O modelo escolhe a função e os argumentos
- [ ] Explicar e aplicar: Você define ferramentas com schema (nome, params)
- [ ] Explicar e aplicar: O loop: pensar → chamar tool → observar → repetir
- [ ] Explicar e aplicar: Ferramentas: busca, código, APIs, banco de dados

## Saiba mais

- [Documentação oficial](https://docs.anthropic.com/en/docs/build-with-claude/tool-use)
