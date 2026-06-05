# Refatoração segura

Melhore o design sem mudar o comportamento.

## Pontos-chave

- Tenha testes antes de refatorar
- Pequenos passos reversíveis
- Extrair função/classe
- Reduzir complexidade ciclomática

## Exemplo

```python
# extrair função
def calcular_desconto(valor, cupom):
    if not cupom:
        return valor
    return valor * (1 - cupom.percentual)
```

## Boas práticas

- Refatore com a rede de testes ligada
- Um motivo por commit

## Saiba mais

- [Documentação oficial](https://refactoring.guru/)
