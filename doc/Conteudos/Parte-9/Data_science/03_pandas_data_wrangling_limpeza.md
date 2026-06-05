# Pandas, Data Wrangling e Limpeza de Dados

Pandas é a biblioteca central para análise tabular em Python. Este arquivo aprofunda leitura, seleção, transformação, limpeza, agregação, joins, datas, tipos e pipelines de preparação.

---

## Sumário

1. [Pandas Essencial](#pandas-essencial)
2. [Leitura e Escrita](#leitura-e-escrita)
3. [Seleção e Filtros](#seleção-e-filtros)
4. [Tipos de Dados](#tipos-de-dados)
5. [Limpeza de Dados](#limpeza-de-dados)
6. [Data Wrangling](#data-wrangling)
7. [GroupBy e Agregações](#groupby-e-agregações)
8. [Joins e Merges](#joins-e-merges)
9. [Datas e Séries Temporais](#datas-e-séries-temporais)
10. [Pipelines com Pandas](#pipelines-com-pandas)
11. [Boas Práticas](#boas-práticas)
12. [Exercícios](#exercícios)

---

## Pandas Essencial

```python
import pandas as pd

df = pd.DataFrame(
    {
        "produto": ["A", "B", "A"],
        "valor": [10, 20, 30],
        "data": ["2026-01-01", "2026-01-02", "2026-01-03"],
    }
)
```

Inspeção:

```python
df.head()
df.info()
df.describe()
df.shape
df.columns
```

---

## Leitura e Escrita

```python
df = pd.read_csv("vendas.csv")
df.to_csv("saida.csv", index=False)
```

Excel:

```python
df = pd.read_excel("vendas.xlsx", sheet_name="Janeiro")
df.to_excel("relatorio.xlsx", index=False)
```

Parquet:

```python
df.to_parquet("vendas.parquet", index=False)
df = pd.read_parquet("vendas.parquet")
```

JSON:

```python
df = pd.read_json("dados.json")
```

Parquet costuma ser melhor para dados analíticos por preservar tipos e ser colunar.

---

## Seleção e Filtros

```python
df["valor"]
df[["produto", "valor"]]
```

`loc`:

```python
df.loc[df["valor"] > 10, ["produto", "valor"]]
```

`iloc`:

```python
df.iloc[:2, :2]
```

Filtros compostos:

```python
filtro = (df["produto"] == "A") & (df["valor"] >= 20)
df_filtrado = df.loc[filtro]
```

Use parênteses em filtros compostos.

---

## Tipos de Dados

```python
df["data"] = pd.to_datetime(df["data"], errors="coerce")
df["valor"] = pd.to_numeric(df["valor"], errors="coerce")
df["produto"] = df["produto"].astype("category")
```

Tipos importantes:

- `int64`, `float64`;
- `string`;
- `category`;
- `datetime64`;
- `boolean`;
- tipos nullable: `Int64`, `Float64`, `boolean`.

Use tipos nullable quando há nulos em colunas numéricas inteiras.

---

## Limpeza de Dados

Dataset sujo:

```python
df = pd.DataFrame(
    {
        " Produto ": [" A", "B ", "A", None],
        "Valor": ["10", "20", "erro", "30"],
        "Data": ["2026-01-01", "2026/01/02", None, "2026-01-04"],
    }
)
```

Limpeza:

```python
def limpar_colunas(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df.columns = (
        df.columns
        .str.strip()
        .str.lower()
        .str.replace(" ", "_")
    )
    return df

def limpar_vendas(df: pd.DataFrame) -> pd.DataFrame:
    df = limpar_colunas(df)
    df["produto"] = df["produto"].str.strip().str.upper()
    df["valor"] = pd.to_numeric(df["valor"], errors="coerce")
    df["data"] = pd.to_datetime(df["data"], errors="coerce")
    return df.dropna(subset=["produto", "valor", "data"])
```

---

## Data Wrangling

Criando colunas:

```python
df["mes"] = df["data"].dt.to_period("M").astype(str)
df["ticket_alto"] = df["valor"] >= 100
```

`assign`:

```python
df = df.assign(
    mes=lambda d: d["data"].dt.to_period("M").astype(str),
    valor_com_taxa=lambda d: d["valor"] * 1.1,
)
```

Pivot:

```python
tabela = df.pivot_table(
    index="mes",
    columns="produto",
    values="valor",
    aggfunc="sum",
    fill_value=0,
)
```

Melt:

```python
longo = tabela.reset_index().melt(
    id_vars="mes",
    var_name="produto",
    value_name="valor",
)
```

---

## GroupBy e Agregações

```python
relatorio = (
    df
    .groupby("produto", as_index=False)
    .agg(
        receita=("valor", "sum"),
        ticket_medio=("valor", "mean"),
        pedidos=("valor", "count"),
    )
    .sort_values("receita", ascending=False)
)
```

Agregação por múltiplas dimensões:

```python
df.groupby(["mes", "produto"], as_index=False).agg(receita=("valor", "sum"))
```

---

## Joins e Merges

```python
pedidos = pd.DataFrame({"cliente_id": [1, 2], "valor": [100, 200]})
clientes = pd.DataFrame({"cliente_id": [1, 2], "nome": ["Ana", "Bia"]})

df = pedidos.merge(clientes, on="cliente_id", how="left")
```

Tipos:

- `inner`;
- `left`;
- `right`;
- `outer`;
- `cross`.

Validação:

```python
pedidos.merge(clientes, on="cliente_id", how="left", validate="many_to_one")
```

Use `validate` para evitar joins incorretos.

---

## Datas e Séries Temporais

```python
df["data"] = pd.to_datetime(df["data"])
df = df.set_index("data").sort_index()
```

Resample:

```python
mensal = df["valor"].resample("ME").sum()
```

Média móvel:

```python
df["media_7d"] = df["valor"].rolling(window=7).mean()
```

Lag:

```python
df["valor_anterior"] = df["valor"].shift(1)
```

---

## Pipelines com Pandas

```python
def filtrar_periodo(df, inicio, fim):
    return df.loc[(df["data"] >= inicio) & (df["data"] <= fim)]

def criar_metricas(df):
    return df.assign(valor_com_taxa=lambda d: d["valor"] * 1.1)

resultado = (
    df
    .pipe(limpar_vendas)
    .pipe(filtrar_periodo, "2026-01-01", "2026-12-31")
    .pipe(criar_metricas)
)
```

`pipe` melhora composição e testabilidade.

---

## Boas Práticas

- Use `.copy()` quando for transformar dados.
- Padronize nomes de colunas cedo.
- Converta tipos explicitamente.
- Valide joins com `validate`.
- Use `category` para baixa cardinalidade.
- Use Parquet para dados intermediários.
- Evite chained assignment.
- Transforme limpeza em funções testáveis.
- Documente regra de tratamento de nulos.

---

## Exercícios

1. Leia CSV, normalize colunas e converta tipos.
2. Remova nulos críticos.
3. Crie colunas derivadas de data.
4. Faça relatório por categoria e mês.
5. Faça merge com tabela de clientes usando `validate`.
6. Crie pivot table e depois volte para formato longo.
7. Crie pipeline com `pipe`.
8. Salve resultado em Parquet.

