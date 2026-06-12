# UX de terminal com Rich

Saída bonita: tabelas, progresso e cores.

## Pontos-chave

- Console e markup
- Tabelas e painéis
- Barras de progresso
- Logs formatados

## Exemplo

```python
from rich.table import Table
from rich import print
t = Table('Nome', 'Idade')
t.add_row('Ana', '30')
print(t)
```

## Boas práticas

- Não abuse de cores
- Mantenha saída legível em logs

## Saiba mais

- [Documentação oficial](https://rich.readthedocs.io/)
