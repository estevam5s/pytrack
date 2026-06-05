# DataFrames rápidos e lazy

Polars é uma engine de DataFrame em Rust com execução lazy e paralela.

## Pontos-chave

- API expressiva com expressões
- LazyFrame e otimização de query
- Muito mais rápido que Pandas em grandes volumes
- Leitura direta de Parquet/CSV

## Exemplo

```python
import polars as pl
q = (pl.scan_csv('dados.csv')
       .filter(pl.col('valor') > 0)
       .group_by('categoria').agg(pl.col('valor').sum()))
print(q.collect())
```

## Boas práticas

- Use scan_* + collect() para lazy
- Prefira expressões a apply

## Saiba mais

- [Documentação oficial](https://docs.pola.rs/)
