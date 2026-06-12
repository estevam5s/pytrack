# UX de terminal com Rich

Saída bonita: tabelas, progresso e cores.

> **Tema:** CLI · **Nível:** basico · **Trilha:** CLIs Modernas com Typer

## Conceitos-chave

Nesta lição você vai entender:

- **Console e markup**
- **Tabelas e painéis**
- **Barras de progresso**
- **Logs formatados**

## Exemplo prático

```python
from rich.table import Table
from rich import print
t = Table('Nome', 'Idade')
t.add_row('Ana', '30')
print(t)
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Não abuse de cores
- Mantenha saída legível em logs

## Pratique

Para fixar, escreva um pequeno script que combine **console e markup** e **tabelas e painéis** em um caso do seu dia a dia. Depois refatore aplicando "Não abuse de cores".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Console e markup
- [ ] Explicar e aplicar: Tabelas e painéis
- [ ] Explicar e aplicar: Barras de progresso
- [ ] Explicar e aplicar: Logs formatados

## Saiba mais

- [Documentação oficial](https://rich.readthedocs.io/)
