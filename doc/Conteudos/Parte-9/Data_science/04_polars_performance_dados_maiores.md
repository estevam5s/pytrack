# Polars, Performance e Dados Maiores

Polars é uma biblioteca moderna de DataFrames com foco em performance, execução preguiçosa, paralelismo e processamento eficiente de dados colunares.

---

## Sumário

1. [Quando Usar Polars](#quando-usar-polars)
2. [DataFrame Polars](#dataframe-polars)
3. [Expressões](#expressões)
4. [Filtros e Seleções](#filtros-e-seleções)
5. [GroupBy](#groupby)
6. [Lazy Execution](#lazy-execution)
7. [Parquet e Scan](#parquet-e-scan)
8. [Joins](#joins)
9. [Performance](#performance)
10. [Pandas vs Polars](#pandas-vs-polars)
11. [Boas Práticas](#boas-práticas)
12. [Exercícios](#exercícios)

---

## Quando Usar Polars

Use Polars quando:

- dados são maiores;
- performance importa;
- você usa Parquet;
- quer lazy execution;
- precisa de pipelines colunares rápidos;
- quer reduzir uso de memória;
- operações são tabulares e vetorizadas.

Pandas continua excelente para:

- exploração rápida;
- ecossistema amplo;
- integração com bibliotecas antigas;
- notebooks e análises menores.

---

## DataFrame Polars

```python
import polars as pl

df = pl.DataFrame(
    {
        "produto": ["A", "B", "A"],
        "valor": [10, 20, 30],
        "categoria": ["livro", "curso", "livro"],
    }
)
```

Inspeção:

```python
df.head()
df.schema
df.describe()
```

---

## Expressões

Polars usa expressões.

```python
resultado = df.with_columns(
    (pl.col("valor") * 1.1).alias("valor_com_taxa")
)
```

Múltiplas colunas:

```python
resultado = df.with_columns(
    pl.col("produto").str.to_uppercase().alias("produto"),
    (pl.col("valor") >= 20).alias("ticket_alto"),
)
```

---

## Filtros e Seleções

```python
df_filtrado = df.filter(pl.col("valor") >= 20)
```

Seleção:

```python
df.select(["produto", "valor"])
```

Filtros compostos:

```python
df.filter(
    (pl.col("categoria") == "livro") &
    (pl.col("valor") > 10)
)
```

---

## GroupBy

```python
relatorio = (
    df
    .group_by("categoria")
    .agg(
        pl.col("valor").sum().alias("receita"),
        pl.col("valor").mean().alias("ticket_medio"),
        pl.len().alias("pedidos"),
    )
    .sort("receita", descending=True)
)
```

---

## Lazy Execution

Lazy execution monta um plano e só executa no final.

```python
lazy = (
    df.lazy()
    .filter(pl.col("valor") > 10)
    .with_columns((pl.col("valor") * 1.1).alias("valor_com_taxa"))
    .group_by("categoria")
    .agg(pl.col("valor_com_taxa").sum().alias("receita"))
)

resultado = lazy.collect()
```

Vantagens:

- otimização de plano;
- predicate pushdown;
- projection pushdown;
- execução mais eficiente;
- leitura parcial de dados.

---

## Parquet e Scan

Leitura eager:

```python
df = pl.read_parquet("vendas.parquet")
```

Leitura lazy:

```python
lazy = pl.scan_parquet("data/silver/vendas/*.parquet")
```

Pipeline:

```python
resultado = (
    pl.scan_parquet("data/silver/vendas/*.parquet")
    .filter(pl.col("data") >= pl.date(2026, 1, 1))
    .group_by("categoria")
    .agg(pl.col("valor").sum().alias("receita"))
    .collect()
)
```

`scan_parquet` evita carregar tudo de uma vez.

---

## Joins

```python
pedidos = pl.DataFrame({"cliente_id": [1, 2], "valor": [100, 200]})
clientes = pl.DataFrame({"cliente_id": [1, 2], "nome": ["Ana", "Bia"]})

df = pedidos.join(clientes, on="cliente_id", how="left")
```

---

## Performance

Estratégias:

- prefira expressões Polars a loops Python;
- use lazy para pipelines;
- leia Parquet com `scan_parquet`;
- selecione apenas colunas necessárias;
- filtre cedo;
- evite conversões repetidas Pandas/Polars;
- use tipos adequados;
- particione dados quando fizer sentido.

---

## Pandas vs Polars

| Critério | Pandas | Polars |
|---|---|---|
| Ecossistema | Muito amplo | Crescente |
| Performance | Boa | Excelente |
| Lazy execution | Limitado | Nativo |
| Parquet grande | Bom | Muito bom |
| Sintaxe | Mais tradicional | Expressões |
| Adoção | Muito alta | Alta e crescente |

Use a ferramenta que melhor resolve o problema e que seu time consegue manter.

---

## Boas Práticas

- Aprenda o modelo de expressões.
- Use lazy para pipelines maiores.
- Use `scan_*` para leitura eficiente.
- Salve intermediários em Parquet.
- Faça benchmark com dados reais.
- Não otimize antes de medir.
- Documente conversões entre Pandas e Polars.

---

## Exercícios

1. Crie DataFrame Polars.
2. Faça filtros e colunas derivadas.
3. Agrupe por categoria.
4. Crie pipeline lazy.
5. Leia Parquet com `scan_parquet`.
6. Compare conceitualmente Pandas e Polars.
7. Reescreva uma análise Pandas em Polars.

