# Ecossistema Analytics: Bibliotecas, Estatística, Excel, Dashboards e Qualidade

Este módulo complementa a trilha principal com bibliotecas importantes de analytics, visualização, estatística, Excel e qualidade de dados. A ideia é saber quando usar cada ferramenta, não tentar usar todas no mesmo projeto.

---

## Sumário

1. [Mapa de Ferramentas](#mapa-de-ferramentas)
2. [DataFrames: Pandas, Polars, Dask, DuckDB, Vaex e Modin](#dataframes-pandas-polars-dask-duckdb-vaex-e-modin)
3. [Visualização: Matplotlib, Seaborn, Plotly, Altair, Bokeh, Dash e Streamlit](#visualização-matplotlib-seaborn-plotly-altair-bokeh-dash-e-streamlit)
4. [Estatística: SciPy, Statsmodels, Pingouin e Scikit-posthocs](#estatística-scipy-statsmodels-pingouin-e-scikit-posthocs)
5. [Excel: openpyxl, xlwings, xlrd, xlwt e xlsxwriter](#excel-openpyxl-xlwings-xlrd-xlwt-e-xlsxwriter)
6. [ETL e Data Wrangling](#etl-e-data-wrangling)
7. [Great Expectations](#great-expectations)
8. [Como Escolher](#como-escolher)
9. [Boas Práticas](#boas-práticas)
10. [Exercícios](#exercícios)

---

## Mapa de Ferramentas

| Necessidade | Ferramentas comuns |
| --- | --- |
| análise tabular geral | Pandas |
| performance local e lazy execution | Polars |
| SQL em arquivos locais | DuckDB |
| datasets maiores que memória em cluster/local | Dask |
| paralelizar código Python e workloads distribuídos | Ray |
| acelerar pandas com pouca mudança de código | Modin |
| dados tabulares grandes com memória mapeada | Vaex |
| estatística clássica | SciPy |
| modelos estatísticos e econometria | Statsmodels |
| testes estatísticos práticos | Pingouin |
| pós-testes estatísticos | Scikit-posthocs |
| planilhas Excel `.xlsx` | openpyxl, xlsxwriter |
| automação do Excel desktop | xlwings |
| arquivos Excel antigos `.xls` | xlrd, xlwt |
| validação de dados | Great Expectations, Pandera |

---

## DataFrames: Pandas, Polars, Dask, DuckDB, Vaex e Modin

### Pandas

Pandas é a ferramenta padrão para análise tabular em memória.

Use quando:

- os dados cabem na memória;
- precisa de integração ampla com Excel, SQL, estatística e visualização;
- quer produtividade e ecossistema maduro.

```python
import pandas as pd

df = pd.read_csv("vendas.csv")
resumo = df.groupby("categoria")["valor"].sum().reset_index()
```

### Polars

Polars é excelente para performance local, execução lazy e arquivos colunares.

```python
import polars as pl

resultado = (
    pl.scan_parquet("data/silver/vendas/*.parquet")
    .filter(pl.col("valor") > 0)
    .group_by("categoria")
    .agg(pl.col("valor").sum().alias("receita"))
    .collect()
)
```

### DuckDB

DuckDB permite consultar CSV/Parquet com SQL sem subir servidor.

```python
import duckdb

df = duckdb.sql("""
    select categoria, sum(valor) as receita
    from read_parquet('data/silver/vendas/*.parquet')
    group by categoria
""").df()
```

Use DuckDB para análise local, protótipos de lakehouse, consultas ad hoc e integração SQL com Parquet.

### Dask

Dask escala APIs parecidas com Pandas/NumPy para dados maiores que memória e execução distribuída.

```python
import dask.dataframe as dd

df = dd.read_parquet("s3://bucket/vendas/")
resultado = df.groupby("categoria")["valor"].sum().compute()
```

Use quando:

- Pandas não cabe na memória;
- quer paralelismo em múltiplos núcleos ou cluster;
- o workload é batch e particionável.

### Vaex

Vaex trabalha com DataFrames grandes usando memória mapeada e avaliação preguiçosa.

```python
import vaex

df = vaex.open("dados.hdf5")
df["valor_log"] = np.log1p(df.valor)
resumo = df.groupby("categoria", agg={"receita": vaex.agg.sum("valor")})
```

Use Vaex quando precisa explorar datasets grandes localmente sem carregar tudo em memória. Verifique compatibilidade do ecossistema antes de adotar em produção.

### Modin

Modin tenta acelerar código Pandas distribuindo execução com Ray ou Dask.

```python
import modin.pandas as pd

df = pd.read_csv("vendas.csv")
resumo = df.groupby("categoria")["valor"].sum()
```

Use Modin quando quer manter API Pandas com poucas mudanças. Valide compatibilidade, porque nem toda operação Pandas tem o mesmo comportamento/performance.

---

## Visualização: Matplotlib, Seaborn, Plotly, Altair, Bokeh, Dash e Streamlit

| Ferramenta | Melhor uso |
| --- | --- |
| Matplotlib | gráficos estáticos, controle fino, base do ecossistema |
| Seaborn | visualização estatística rápida e bonita |
| Plotly | gráficos interativos e exploração |
| Altair | gramática declarativa de visualização |
| Bokeh | visualização web interativa customizável |
| Dash | aplicações analíticas web com callbacks |
| Streamlit | dashboards e apps de dados rápidos |

### Altair

```python
import altair as alt

grafico = (
    alt.Chart(df)
    .mark_bar()
    .encode(x="categoria:N", y="sum(valor):Q", color="categoria:N")
    .properties(title="Receita por categoria")
)
grafico.show()
```

### Dash

```python
from dash import Dash, dcc, html
import plotly.express as px

app = Dash(__name__)
fig = px.line(df, x="data", y="receita")

app.layout = html.Div(
    [
        html.H1("Dashboard de Vendas"),
        dcc.Graph(figure=fig),
    ]
)

if __name__ == "__main__":
    app.run(debug=True)
```

### Streamlit

```python
import streamlit as st

st.title("Indicadores")
st.metric("Receita", f"R$ {df['valor'].sum():,.2f}")
st.dataframe(df)
```

Dash tende a ser melhor para apps web analíticos mais controlados. Streamlit tende a ser melhor para prototipação e dashboards internos rápidos.

---

## Estatística: SciPy, Statsmodels, Pingouin e Scikit-posthocs

### SciPy

```python
from scipy import stats

resultado = stats.ttest_ind(grupo_a, grupo_b, equal_var=False)
print(resultado.pvalue)
```

Use SciPy para testes estatísticos clássicos, distribuições, otimização e métodos numéricos.

### Statsmodels

```python
import statsmodels.formula.api as smf

modelo = smf.ols("vendas ~ preco + investimento_marketing", data=df).fit()
print(modelo.summary())
```

Use Statsmodels para regressão interpretável, séries temporais, ANOVA, modelos lineares e relatórios estatísticos.

### Pingouin

```python
import pingouin as pg

resultado = pg.ttest(grupo_a, grupo_b, correction=True)
print(resultado)
```

Pingouin é prático para testes comuns, tamanho de efeito e outputs amigáveis em DataFrame.

### Scikit-posthocs

```python
import scikit_posthocs as sp

posthoc = sp.posthoc_dunn(df, val_col="valor", group_col="grupo", p_adjust="bonferroni")
print(posthoc)
```

Use scikit-posthocs quando um teste global indica diferença e você precisa descobrir quais grupos diferem.

---

## Excel: openpyxl, xlwings, xlrd, xlwt e xlsxwriter

| Biblioteca | Uso principal |
| --- | --- |
| openpyxl | ler/escrever `.xlsx`, editar células, estilos e fórmulas |
| xlsxwriter | criar `.xlsx` formatado com gráficos e formatos avançados |
| xlwings | controlar Excel desktop, macros e automação COM/app |
| xlrd | ler `.xls` antigo; suporte moderno a `.xlsx` foi removido |
| xlwt | escrever `.xls` antigo |

### Pandas com engines

```python
df = pd.read_excel("entrada.xlsx", engine="openpyxl")
df.to_excel("saida.xlsx", index=False, engine="xlsxwriter")
```

### openpyxl

```python
from openpyxl import load_workbook

wb = load_workbook("relatorio.xlsx")
ws = wb["Resumo"]
ws["A1"] = "Atualizado"
wb.save("relatorio.xlsx")
```

### xlsxwriter

```python
with pd.ExcelWriter("relatorio.xlsx", engine="xlsxwriter") as writer:
    df.to_excel(writer, sheet_name="Dados", index=False)
    workbook = writer.book
    worksheet = writer.sheets["Dados"]
    formato = workbook.add_format({"bold": True})
    worksheet.write("A1", "categoria", formato)
```

### xlwings

```python
import xlwings as xw

app = xw.App(visible=False)
book = xw.Book("modelo.xlsx")
sheet = book.sheets["Resumo"]
sheet.range("A1").value = "Atualizado via Python"
book.save("saida.xlsx")
book.close()
app.quit()
```

Use `xlwings` quando precisa interagir com Excel instalado, macros, fórmulas vivas ou modelos corporativos existentes.

---

## ETL e Data Wrangling

Ferramentas:

- Pandas: transformação tabular flexível e ecossistema amplo;
- Polars: transformação rápida, lazy, forte com Parquet;
- DuckDB: transformação SQL em arquivos;
- Dask: transformação distribuída/maior que memória;
- Great Expectations/Pandera: validação de qualidade.

Padrão profissional:

```text
raw -> bronze -> silver -> gold
```

Regras:

- preserve raw;
- transforme com funções testáveis;
- valide schema e regras;
- salve intermediários em Parquet;
- registre métricas de qualidade;
- torne o pipeline idempotente.

---

## Great Expectations

Great Expectations valida dados com suites de expectativas e gera documentação.

Exemplo conceitual:

```python
import great_expectations as gx

context = gx.get_context()
validator = context.sources.pandas_default.read_dataframe(df)

validator.expect_column_values_to_not_be_null("id")
validator.expect_column_values_to_be_between("valor", min_value=0)
validator.expect_column_values_to_be_in_set("status", ["pago", "pendente"])

resultado = validator.validate()
if not resultado.success:
    raise ValueError("dados inválidos")
```

Use quando:

- dados são compartilhados entre times;
- contratos precisam ser documentados;
- pipelines precisam bloquear publicação de dados ruins;
- qualidade precisa ser auditável.

---

## Como Escolher

| Situação | Escolha inicial |
| --- | --- |
| dataset pequeno/médio | Pandas |
| análise local com SQL em Parquet | DuckDB |
| transformação local rápida | Polars |
| dados maiores que memória | Dask ou PySpark |
| app visual rápido | Streamlit |
| app web analítico controlado | Dash |
| testes estatísticos clássicos | SciPy/Pingouin |
| modelos estatísticos interpretáveis | Statsmodels |
| Excel corporativo | openpyxl/xlsxwriter/xlwings |
| qualidade de dados formal | Great Expectations |

---

## Boas Práticas

- Comece com Pandas, SQL e Parquet antes de adotar ferramentas distribuídas.
- Meça gargalo antes de trocar de biblioteca.
- Evite misturar muitas engines no mesmo pipeline sem motivo.
- Padronize formato intermediário, preferencialmente Parquet.
- Documente a engine usada para ler/escrever Excel.
- Separe análise exploratória de pipeline produtivo.
- Valide dados antes de dashboard e modelo.
- Registre versão das bibliotecas em projetos reproduzíveis.

---

## Exercícios

1. Compare Pandas, Polars e DuckDB em um CSV grande.
2. Reescreva uma transformação Pandas em Polars.
3. Consulte um diretório Parquet com DuckDB.
4. Crie gráfico Altair.
5. Crie app Dash mínimo.
6. Faça regressão com Statsmodels.
7. Faça teste t com Pingouin.
8. Gere Excel formatado com xlsxwriter.
9. Edite workbook com openpyxl.
10. Crie validação com Great Expectations.
