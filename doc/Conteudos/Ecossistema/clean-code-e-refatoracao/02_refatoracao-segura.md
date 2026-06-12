# Refatoração segura

Melhore o design sem mudar o comportamento.

> **Tema:** Qualidade · **Nível:** intermediario · **Trilha:** Clean Code e Refatoração

## Conceitos-chave

Nesta lição você vai entender:

- **Tenha testes antes de refatorar**
- **Pequenos passos reversíveis**
- **Extrair função/classe**
- **Reduzir complexidade ciclomática**

## Exemplo prático

```python
# extrair função
def calcular_desconto(valor, cupom):
    if not cupom:
        return valor
    return valor * (1 - cupom.percentual)
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Refatore com a rede de testes ligada
- Um motivo por commit

## Pratique

Para fixar, escreva um pequeno script que combine **tenha testes antes de refatorar** e **pequenos passos reversíveis** em um caso do seu dia a dia. Depois refatore aplicando "Refatore com a rede de testes ligada".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Tenha testes antes de refatorar
- [ ] Explicar e aplicar: Pequenos passos reversíveis
- [ ] Explicar e aplicar: Extrair função/classe
- [ ] Explicar e aplicar: Reduzir complexidade ciclomática

## Saiba mais

- [Documentação oficial](https://refactoring.guru/)
