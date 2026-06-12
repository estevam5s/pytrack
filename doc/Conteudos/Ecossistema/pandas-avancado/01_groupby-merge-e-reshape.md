# GroupBy, merge e reshape

Operações poderosas para transformar dados tabulares.

## Pontos-chave

- groupby + agg para estatísticas por grupo
- merge/join entre DataFrames
- pivot_table e melt para reshape
- Operações vetorizadas em vez de loops

## Exemplo

```python
import pandas as pd
resumo = (df.groupby('categoria')
            .agg(total=('valor','sum'), media=('valor','mean'))
            .reset_index())
```

## Boas práticas

- Vetorize: evite apply linha a linha
- Use categorias para colunas de baixa cardinalidade

## Saiba mais

- [Documentação oficial](https://pandas.pydata.org/docs/)
