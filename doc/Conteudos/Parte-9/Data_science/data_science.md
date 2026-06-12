# Data Science e Engenharia de Dados com Python

Guia progressivo, completo e prático para estudar Data Science, Analytics, Machine Learning e Engenharia de Dados usando Python. A estrutura começa pelo mais simples e aumenta a complexidade aos poucos, com exemplos pequenos no início e projetos integrados no final.

---

## Sumário

1. [Como Usar Este Guia](#como-usar-este-guia)
2. [Mapa da Jornada](#mapa-da-jornada)
3. [Bibliotecas Principais](#bibliotecas-principais)
4. [Nível 0 — Ambiente e Organização](#nível-0--ambiente-e-organização)
5. [Nível 1 — Python Para Dados](#nível-1--python-para-dados)
6. [Nível 2 — NumPy](#nível-2--numpy)
7. [Nível 3 — Pandas Essencial](#nível-3--pandas-essencial)
8. [Nível 4 — Limpeza e Preparação de Dados](#nível-4--limpeza-e-preparação-de-dados)
9. [Nível 5 — EDA e Estatística](#nível-5--eda-e-estatística)
10. [Nível 6 — Visualização de Dados](#nível-6--visualização-de-dados)
11. [Nível 7 — Excel, CSV, JSON, Parquet e Dados Locais](#nível-7--excel-csv-json-parquet-e-dados-locais)
12. [Nível 8 — SQL, DuckDB e Bancos de Dados](#nível-8--sql-duckdb-e-bancos-de-dados)
13. [Nível 9 — ETL, ELT e Pipelines](#nível-9--etl-elt-e-pipelines)
14. [Nível 10 — Polars, Dask e Performance](#nível-10--polars-dask-e-performance)
15. [Nível 11 — APIs, Coleta e Integração de Dados](#nível-11--apis-coleta-e-integração-de-dados)
16. [Nível 12 — Qualidade, Validação e Testes de Dados](#nível-12--qualidade-validação-e-testes-de-dados)
17. [Nível 13 — Machine Learning com Scikit-learn](#nível-13--machine-learning-com-scikit-learn)
18. [Nível 14 — Séries Temporais](#nível-14--séries-temporais)
19. [Nível 15 — NLP e Dados Textuais](#nível-15--nlp-e-dados-textuais)
20. [Nível 16 — Deep Learning](#nível-16--deep-learning)
21. [Nível 17 — Engenharia de Dados Profissional](#nível-17--engenharia-de-dados-profissional)
22. [Nível 18 — Spark e Big Data](#nível-18--spark-e-big-data)
23. [Nível 19 — Kafka e Streaming](#nível-19--kafka-e-streaming)
24. [Nível 20 — Orquestração com Airflow, Prefect e Dagster](#nível-20--orquestração-com-airflow-prefect-e-dagster)
25. [Nível 21 — Data Warehouse, Lakehouse e Cloud](#nível-21--data-warehouse-lakehouse-e-cloud)
26. [Nível 22 — MLOps e Produção](#nível-22--mlops-e-produção)
27. [Nível 23 — Observabilidade, Segurança e Governança](#nível-23--observabilidade-segurança-e-governança)
28. [Projetos Progressivos](#projetos-progressivos)
29. [Checklist de Domínio](#checklist-de-domínio)
30. [Rotina de Estudos](#rotina-de-estudos)

---

## Como Usar Este Guia

Use este arquivo como uma trilha. Não tente dominar tudo de uma vez.

Ordem recomendada:

1. Rode todos os exemplos pequenos.
2. Altere valores, colunas, nomes e regras.
3. Transforme exemplos em funções.
4. Escreva testes para funções de limpeza e transformação.
5. Use datasets pequenos antes de datasets grandes.
6. Documente cada projeto com objetivo, entrada, saída e decisões.
7. Só avance para Spark, Kafka e Airflow depois de entender bem Pandas, SQL e ETL.

Regra prática:

- **Data Science** responde perguntas e cria modelos.
- **Analytics** cria análises, métricas, dashboards e relatórios.
- **Engenharia de Dados** cria pipelines confiáveis para coletar, transformar, validar, armazenar e disponibilizar dados.
- **MLOps** coloca modelos em produção com versionamento, monitoramento e reprodutibilidade.

---

## Mapa da Jornada

```text
Python básico
  ↓
NumPy e Pandas
  ↓
Limpeza, EDA, estatística e visualização
  ↓
Arquivos, SQL, Excel, Parquet e APIs
  ↓
ETL, validação, testes e pipelines
  ↓
Machine Learning
  ↓
Engenharia de Dados com bancos, lakes e orquestração
  ↓
Spark, Kafka, Airflow, cloud e produção
  ↓
MLOps, governança, observabilidade e projetos reais
```

---

## Bibliotecas Principais

### Base Científica

- `numpy`: arrays, matemática vetorizada, álgebra linear.
- `pandas`: DataFrames, limpeza, agregações, joins, análise tabular.
- `scipy`: estatística, otimização, testes estatísticos.
- `statsmodels`: modelos estatísticos, regressão, séries temporais.

### Visualização

- `matplotlib`: gráficos base.
- `seaborn`: visualização estatística.
- `plotly`: gráficos interativos.
- `bokeh`: visualização interativa web.
- `altair`: visualização declarativa.

### Arquivos e Formatos

- `openpyxl`: Excel `.xlsx`.
- `xlsxwriter`: exportação Excel formatada.
- `pyarrow`: Parquet, Arrow e integração eficiente.
- `fastparquet`: alternativa para Parquet.
- `json`, `csv`, `pathlib`: biblioteca padrão.

### Banco e SQL

- `sqlite3`: banco local embutido.
- `sqlalchemy`: conexão e ORM.
- `psycopg2` / `psycopg`: PostgreSQL.
- `mysql-connector-python`: MySQL.
- `duckdb`: SQL rápido em arquivos locais.

### Performance e Dados Grandes

- `polars`: DataFrames rápidos, lazy execution.
- `dask`: paralelismo em DataFrames e arrays.
- `pyspark`: Spark com Python.
- `ray`: computação distribuída.

### Qualidade de Dados

- `pandera`: validação de DataFrames.
- `great_expectations`: validação e documentação de qualidade.
- `pydantic`: validação de objetos e payloads.

### Machine Learning

- `scikit-learn`: ML clássico.
- `xgboost`, `lightgbm`, `catboost`: gradient boosting.
- `imbalanced-learn`: dados desbalanceados.
- `joblib`: persistência de modelos.

### Deep Learning e IA

- `tensorflow` / `keras`: redes neurais.
- `torch`: PyTorch.
- `transformers`: modelos de NLP e LLMs.
- `sentence-transformers`: embeddings de texto.

### Engenharia de Dados

- `apache-airflow`: orquestração.
- `prefect`: orquestração moderna.
- `dagster`: data orchestration e assets.
- `kafka-python`, `confluent-kafka`: Kafka.
- `redis`, `pika`: Redis e RabbitMQ.

### Produção e MLOps

- `mlflow`: tracking e model registry.
- `dvc`: versionamento de dados e modelos.
- `bentoml`: serving de modelos.
- `fastapi`: APIs para servir modelos e dados.
- `prometheus-client`: métricas.
- `loguru` / `structlog`: logs estruturados.

---

## Nível 0 — Ambiente e Organização

Antes de começar, organize o projeto.

### Estrutura Recomendada

```text
projeto_dados/
├── README.md
├── requirements.txt
├── pyproject.toml
├── .env
├── data/
│   ├── raw/
│   ├── interim/
│   ├── processed/
│   └── external/
├── notebooks/
├── src/
│   ├── config.py
│   ├── extract.py
│   ├── transform.py
│   ├── load.py
│   └── validation.py
├── reports/
│   ├── figures/
│   └── tables/
└── tests/
```

### Ambiente Virtual

```bash
python -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
```

### Dependências Básicas

```bash
pip install numpy pandas matplotlib seaborn plotly scikit-learn openpyxl pyarrow
```

### Primeiro Script de Verificação

```python
import sys
import numpy as np
import pandas as pd

print(sys.version)
print("NumPy:", np.__version__)
print("Pandas:", pd.__version__)
```

### Configuração com `pathlib`

```python
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
RAW_DIR = DATA_DIR / "raw"
PROCESSED_DIR = DATA_DIR / "processed"

for folder in [RAW_DIR, PROCESSED_DIR]:
    folder.mkdir(parents=True, exist_ok=True)
```

---

## Nível 1 — Python Para Dados

Antes de Pandas, pratique listas, dicionários, funções e arquivos.

### Dataset Pequeno em Lista de Dicionários

```python
vendas = [
    {"produto": "Notebook", "categoria": "Eletrônicos", "valor": 3500, "quantidade": 2},
    {"produto": "Mouse", "categoria": "Eletrônicos", "valor": 80, "quantidade": 5},
    {"produto": "Caderno", "categoria": "Papelaria", "valor": 25, "quantidade": 10},
]

total = 0
for venda in vendas:
    total += venda["valor"] * venda["quantidade"]

print(total)
```

### Transformando em Função

```python
def calcular_receita_total(vendas: list[dict]) -> float:
    total = 0
    for venda in vendas:
        total += venda["valor"] * venda["quantidade"]
    return total
```

### Agrupamento Manual

```python
def receita_por_categoria(vendas: list[dict]) -> dict[str, float]:
    resultado = {}

    for venda in vendas:
        categoria = venda["categoria"]
        receita = venda["valor"] * venda["quantidade"]
        resultado[categoria] = resultado.get(categoria, 0) + receita

    return resultado

print(receita_por_categoria(vendas))
```

### Quando Migrar Para Pandas

Use Pandas quando:

- os dados são tabulares;
- há muitas colunas;
- você precisa filtrar, agregar, ordenar, juntar tabelas;
- precisa ler CSV, Excel, SQL ou Parquet;
- precisa gerar relatórios rapidamente.

---

## Nível 2 — NumPy

NumPy é a base de computação numérica em Python.

### Array Simples

```python
import numpy as np

valores = np.array([10, 20, 30, 40])

print(valores.mean())
print(valores.sum())
print(valores.max())
```

### Operações Vetorizadas

```python
precos = np.array([100, 200, 300])
desconto = 0.10

precos_com_desconto = precos * (1 - desconto)
print(precos_com_desconto)
```

### Broadcasting

```python
matriz = np.array([
    [10, 20, 30],
    [40, 50, 60],
])

ajuste = np.array([1, 2, 3])

print(matriz + ajuste)
```

### Máscaras Booleanas

```python
idades = np.array([15, 18, 22, 30, 12])
maiores = idades >= 18

print(idades[maiores])
```

### Exemplo um Pouco Maior: Normalização

```python
dados = np.array([10, 20, 30, 40, 50])

media = dados.mean()
desvio = dados.std()

normalizado = (dados - media) / desvio
print(normalizado)
```

### Quando Usar NumPy

Use NumPy para:

- cálculos matemáticos rápidos;
- arrays multidimensionais;
- álgebra linear;
- vetorização;
- base para Machine Learning e Deep Learning.

---

## Nível 3 — Pandas Essencial

Pandas trabalha com `Series` e `DataFrame`.

### Criando DataFrame

```python
import pandas as pd

df = pd.DataFrame({
    "produto": ["Notebook", "Mouse", "Caderno"],
    "categoria": ["Eletrônicos", "Eletrônicos", "Papelaria"],
    "preco": [3500, 80, 25],
    "quantidade": [2, 5, 10],
})

print(df)
```

### Criando Colunas

```python
df["receita"] = df["preco"] * df["quantidade"]
print(df)
```

### Filtrando

```python
eletronicos = df[df["categoria"] == "Eletrônicos"]
caros = df[df["preco"] > 100]

print(eletronicos)
print(caros)
```

### Seleção com `loc` e `iloc`

```python
print(df.loc[0, "produto"])
print(df.iloc[0])
print(df.loc[df["preco"] > 100, ["produto", "preco"]])
```

### Agregação

```python
resumo = df.groupby("categoria")["receita"].sum().reset_index()
print(resumo)
```

### Ordenação

```python
df_ordenado = df.sort_values("receita", ascending=False)
print(df_ordenado)
```

### Exemplo Maior: Relatório de Vendas

```python
def gerar_relatorio_vendas(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df["receita"] = df["preco"] * df["quantidade"]

    relatorio = (
        df.groupby("categoria", as_index=False)
        .agg(
            receita_total=("receita", "sum"),
            quantidade_total=("quantidade", "sum"),
            preco_medio=("preco", "mean"),
        )
        .sort_values("receita_total", ascending=False)
    )

    return relatorio
```

---

## Nível 4 — Limpeza e Preparação de Dados

Dados reais vêm sujos: nulos, duplicados, tipos errados, espaços, datas inválidas.

### Dataset Sujo

```python
import pandas as pd

df = pd.DataFrame({
    "nome": [" Ana ", "Bruno", "bruno", None],
    "idade": ["25", "30", "30", "erro"],
    "cidade": ["SP", "RJ", "RJ", "MG"],
    "data_cadastro": ["2024-01-01", "2024/02/10", "", "2024-03-05"],
})
```

### Limpeza Básica

```python
df["nome"] = df["nome"].str.strip().str.title()
df["idade"] = pd.to_numeric(df["idade"], errors="coerce")
df["data_cadastro"] = pd.to_datetime(df["data_cadastro"], errors="coerce")

df = df.dropna(subset=["nome"])
df = df.drop_duplicates()

print(df)
```

### Padronizando Colunas

```python
def padronizar_colunas(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df.columns = (
        df.columns
        .str.strip()
        .str.lower()
        .str.replace(" ", "_", regex=False)
    )
    return df
```

### Tratando Nulos

```python
df["idade"] = df["idade"].fillna(df["idade"].median())
df["cidade"] = df["cidade"].fillna("Desconhecida")
```

### Pipeline de Limpeza

```python
def limpar_clientes(df: pd.DataFrame) -> pd.DataFrame:
    df = padronizar_colunas(df)
    df = df.copy()

    df["nome"] = df["nome"].str.strip().str.title()
    df["idade"] = pd.to_numeric(df["idade"], errors="coerce")
    df["data_cadastro"] = pd.to_datetime(df["data_cadastro"], errors="coerce")

    df = df.dropna(subset=["nome"])
    df = df.drop_duplicates()

    return df
```

---

## Nível 5 — EDA e Estatística

EDA, ou análise exploratória de dados, serve para entender estrutura, qualidade e padrões.

### Checklist de EDA

- Quantas linhas e colunas existem?
- Quais são os tipos das colunas?
- Existem valores nulos?
- Existem duplicatas?
- Existem outliers?
- Quais são as distribuições?
- Quais variáveis se relacionam?
- Existem problemas de qualidade?

### Resumo Inicial

```python
def resumo_inicial(df: pd.DataFrame) -> pd.DataFrame:
    return pd.DataFrame({
        "coluna": df.columns,
        "tipo": df.dtypes.astype(str).values,
        "nulos": df.isna().sum().values,
        "nulos_pct": (df.isna().mean() * 100).round(2).values,
        "unicos": df.nunique().values,
    })
```

### Estatísticas Descritivas

```python
print(df.describe(include="all"))
```

### Correlação

```python
numericas = df.select_dtypes(include="number")
correlacao = numericas.corr()
print(correlacao)
```

### Outliers com IQR

```python
def detectar_outliers_iqr(df: pd.DataFrame, coluna: str) -> pd.DataFrame:
    q1 = df[coluna].quantile(0.25)
    q3 = df[coluna].quantile(0.75)
    iqr = q3 - q1

    limite_inferior = q1 - 1.5 * iqr
    limite_superior = q3 + 1.5 * iqr

    return df[(df[coluna] < limite_inferior) | (df[coluna] > limite_superior)]
```

### Teste Estatístico Simples

```python
from scipy import stats

grupo_a = [10, 12, 11, 13, 12]
grupo_b = [14, 15, 13, 16, 15]

resultado = stats.ttest_ind(grupo_a, grupo_b)
print(resultado.pvalue)
```

---

## Nível 6 — Visualização de Dados

Visualização ajuda a enxergar distribuição, tendência, comparação e relação.

### Matplotlib Básico

```python
import matplotlib.pyplot as plt

produtos = ["A", "B", "C"]
vendas = [100, 150, 80]

plt.bar(produtos, vendas)
plt.title("Vendas por Produto")
plt.xlabel("Produto")
plt.ylabel("Vendas")
plt.show()
```

### Seaborn

```python
import seaborn as sns

sns.histplot(df["idade"], kde=True)
plt.title("Distribuição de Idades")
plt.show()
```

### Plotly Interativo

```python
import plotly.express as px

fig = px.bar(df, x="categoria", y="receita", title="Receita por Categoria")
fig.show()
```

### Dashboard Simples com Streamlit

```python
import streamlit as st
import pandas as pd

df = pd.read_csv("data/processed/vendas.csv")

st.title("Dashboard de Vendas")
categoria = st.selectbox("Categoria", sorted(df["categoria"].unique()))

filtrado = df[df["categoria"] == categoria]
st.metric("Receita", f"R$ {filtrado['receita'].sum():,.2f}")
st.dataframe(filtrado)
st.bar_chart(filtrado.groupby("produto")["receita"].sum())
```

---

## Nível 7 — Excel, CSV, JSON, Parquet e Dados Locais

### CSV

```python
df.to_csv("data/processed/vendas.csv", index=False)
df = pd.read_csv("data/processed/vendas.csv")
```

### Excel

```python
df.to_excel("reports/vendas.xlsx", index=False, sheet_name="Vendas")
```

### Excel com Múltiplas Abas

```python
with pd.ExcelWriter("reports/relatorio.xlsx") as writer:
    df.to_excel(writer, sheet_name="Base", index=False)
    resumo.to_excel(writer, sheet_name="Resumo", index=False)
```

### JSON

```python
df.to_json("data/processed/vendas.json", orient="records", force_ascii=False)
df_json = pd.read_json("data/processed/vendas.json")
```

### Parquet

```python
df.to_parquet("data/processed/vendas.parquet", index=False)
df_parquet = pd.read_parquet("data/processed/vendas.parquet")
```

### Quando Usar Cada Formato

- CSV: simples, compatível, mas pesado e sem schema forte.
- Excel: bom para usuários de negócio.
- JSON: bom para APIs e dados semiestruturados.
- Parquet: excelente para dados analíticos, compressão e performance.

---

## Nível 8 — SQL, DuckDB e Bancos de Dados

### SQLite com Pandas

```python
import sqlite3
import pandas as pd

conn = sqlite3.connect("data/vendas.db")

df.to_sql("vendas", conn, if_exists="replace", index=False)

resultado = pd.read_sql_query(
    "SELECT categoria, SUM(receita) AS receita_total FROM vendas GROUP BY categoria",
    conn,
)

print(resultado)
conn.close()
```

### SQLAlchemy

```python
from sqlalchemy import create_engine

engine = create_engine("sqlite:///data/vendas.db")
df.to_sql("vendas", engine, if_exists="replace", index=False)

consulta = pd.read_sql("SELECT * FROM vendas", engine)
```

### DuckDB em Arquivos Locais

```python
import duckdb

resultado = duckdb.sql("""
    SELECT categoria, SUM(receita) AS receita_total
    FROM 'data/processed/vendas.parquet'
    GROUP BY categoria
    ORDER BY receita_total DESC
""").df()

print(resultado)
```

### Quando Usar DuckDB

Use DuckDB quando:

- você quer SQL local rápido;
- os dados estão em CSV/Parquet;
- não quer subir um banco completo;
- precisa explorar dados analíticos rapidamente.

---

## Nível 9 — ETL, ELT e Pipelines

ETL:

- Extract: extrair dados.
- Transform: transformar dados.
- Load: carregar dados.

ELT:

- Extract: extrair.
- Load: carregar no destino.
- Transform: transformar dentro do banco/lake/warehouse.

### Pipeline Pequeno

```python
from pathlib import Path
import pandas as pd

RAW = Path("data/raw/vendas.csv")
OUT = Path("data/processed/vendas_limpo.parquet")

def extract(path: Path) -> pd.DataFrame:
    return pd.read_csv(path)

def transform(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df.columns = df.columns.str.lower().str.strip()
    df["receita"] = df["preco"] * df["quantidade"]
    return df.drop_duplicates()

def load(df: pd.DataFrame, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    df.to_parquet(path, index=False)

def run_pipeline() -> None:
    df = extract(RAW)
    df = transform(df)
    load(df, OUT)

if __name__ == "__main__":
    run_pipeline()
```

### Pipeline com Logs

```python
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def run_pipeline() -> None:
    logger.info("Iniciando pipeline")
    df = extract(RAW)
    logger.info("Linhas extraídas: %s", len(df))
    df = transform(df)
    logger.info("Linhas transformadas: %s", len(df))
    load(df, OUT)
    logger.info("Pipeline concluído")
```

### Boas Práticas em Pipelines

- Nunca sobrescreva dados raw.
- Separe raw, interim e processed.
- Valide schema.
- Use logs.
- Escreva testes para transformações.
- Faça pipeline idempotente quando possível.
- Documente entrada e saída.
- Salve dados em formato eficiente como Parquet.

---

## Nível 10 — Polars, Dask e Performance

### Polars

```python
import polars as pl

df = pl.DataFrame({
    "produto": ["A", "B", "A"],
    "valor": [10, 20, 30],
})

resultado = (
    df.group_by("produto")
    .agg(pl.col("valor").sum().alias("valor_total"))
)

print(resultado)
```

### Polars Lazy

```python
import polars as pl

resultado = (
    pl.scan_parquet("data/processed/vendas.parquet")
    .filter(pl.col("receita") > 1000)
    .group_by("categoria")
    .agg(pl.col("receita").sum())
    .collect()
)
```

### Dask

```python
import dask.dataframe as dd

df = dd.read_csv("data/raw/*.csv")
resumo = df.groupby("categoria")["receita"].sum().compute()
print(resumo)
```

### Dicas de Performance

- Prefira operações vetorizadas.
- Evite loops linha a linha em Pandas.
- Use tipos corretos.
- Use `category` para colunas repetitivas.
- Leia arquivos em chunks se forem grandes.
- Use Parquet para armazenamento analítico.
- Use Polars ou DuckDB para processamento local rápido.
- Use Spark quando o dado não cabe confortavelmente em uma máquina.

---

## Nível 11 — APIs, Coleta e Integração de Dados

### Requests Simples

```python
import requests

response = requests.get("https://api.github.com/repos/python/cpython", timeout=10)
response.raise_for_status()
dados = response.json()

print(dados["name"], dados["stargazers_count"])
```

### Função de Coleta

```python
def coletar_json(url: str) -> dict:
    response = requests.get(url, timeout=10)
    response.raise_for_status()
    return response.json()
```

### Retry Simples

```python
import time
import requests

def get_com_retry(url: str, tentativas: int = 3) -> dict:
    for tentativa in range(1, tentativas + 1):
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.RequestException:
            if tentativa == tentativas:
                raise
            time.sleep(2 ** tentativa)
```

### Paginação

```python
def coletar_paginas(base_url: str, total_paginas: int) -> list[dict]:
    registros = []

    for pagina in range(1, total_paginas + 1):
        response = requests.get(base_url, params={"page": pagina}, timeout=10)
        response.raise_for_status()
        registros.extend(response.json())

    return registros
```

---

## Nível 12 — Qualidade, Validação e Testes de Dados

### Validação Manual

```python
def validar_vendas(df: pd.DataFrame) -> None:
    colunas_obrigatorias = {"produto", "categoria", "preco", "quantidade"}
    faltantes = colunas_obrigatorias - set(df.columns)

    if faltantes:
        raise ValueError(f"Colunas faltantes: {faltantes}")

    if (df["preco"] < 0).any():
        raise ValueError("Existem preços negativos")

    if (df["quantidade"] < 0).any():
        raise ValueError("Existem quantidades negativas")
```

### Pandera

```python
import pandera as pa
from pandera import Column, DataFrameSchema

schema = DataFrameSchema({
    "produto": Column(str),
    "categoria": Column(str),
    "preco": Column(float, checks=pa.Check.ge(0)),
    "quantidade": Column(int, checks=pa.Check.ge(0)),
})

df_validado = schema.validate(df)
```

### Teste de Transformação

```python
def test_transform_cria_receita():
    entrada = pd.DataFrame({
        "preco": [10, 20],
        "quantidade": [2, 3],
    })

    saida = transform(entrada)

    assert "receita" in saida.columns
    assert saida["receita"].tolist() == [20, 60]
```

---

## Nível 13 — Machine Learning com Scikit-learn

### Fluxo Básico

```python
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error

X = df[["idade", "renda"]]
y = df["gasto"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

modelo = LinearRegression()
modelo.fit(X_train, y_train)

pred = modelo.predict(X_test)
print(mean_absolute_error(y_test, pred))
```

### Pipeline

```python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor

pipeline = Pipeline([
    ("scaler", StandardScaler()),
    ("model", RandomForestRegressor(random_state=42)),
])

pipeline.fit(X_train, y_train)
```

### Validação Cruzada

```python
from sklearn.model_selection import cross_val_score

scores = cross_val_score(pipeline, X, y, cv=5, scoring="neg_mean_absolute_error")
print(-scores.mean(), scores.std())
```

### Salvando Modelo

```python
import joblib

joblib.dump(pipeline, "models/modelo_vendas.joblib")
modelo_carregado = joblib.load("models/modelo_vendas.joblib")
```

### Checklist de ML

- Definiu problema?
- Separou treino e teste?
- Evitou vazamento de dados?
- Criou baseline?
- Avaliou métrica correta?
- Validou com cross-validation?
- Salvou modelo e parâmetros?
- Documentou limitações?

---

## Nível 14 — Séries Temporais

### Datas com Pandas

```python
df["data"] = pd.to_datetime(df["data"])
df = df.sort_values("data")
```

### Resample

```python
vendas_diarias = (
    df.set_index("data")
    .resample("D")["receita"]
    .sum()
)
```

### Média Móvel

```python
vendas_diarias.rolling(window=7).mean().plot()
```

### Baseline de Previsão

```python
df_ts = vendas_diarias.reset_index()
df_ts["previsao_naive"] = df_ts["receita"].shift(1)
```

### Statsmodels

```python
from statsmodels.tsa.arima.model import ARIMA

modelo = ARIMA(vendas_diarias, order=(1, 1, 1))
ajustado = modelo.fit()
previsao = ajustado.forecast(steps=7)
print(previsao)
```

---

## Nível 15 — NLP e Dados Textuais

### Limpeza Simples

```python
import re

def limpar_texto(texto: str) -> str:
    texto = texto.lower()
    texto = re.sub(r"[^a-záéíóúãõç\s]", "", texto)
    texto = re.sub(r"\s+", " ", texto).strip()
    return texto
```

### TF-IDF com Scikit-learn

```python
from sklearn.feature_extraction.text import TfidfVectorizer

textos = [
    "Python para dados",
    "Data science com Python",
    "Engenharia de dados",
]

vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(textos)

print(vectorizer.get_feature_names_out())
```

### Classificação de Texto

```python
from sklearn.pipeline import Pipeline
from sklearn.naive_bayes import MultinomialNB

modelo = Pipeline([
    ("tfidf", TfidfVectorizer()),
    ("clf", MultinomialNB()),
])

modelo.fit(textos_treino, labels_treino)
```

---

## Nível 16 — Deep Learning

### Keras Sequencial

```python
from tensorflow import keras
from tensorflow.keras import layers

model = keras.Sequential([
    layers.Dense(64, activation="relu", input_shape=(X_train.shape[1],)),
    layers.Dense(32, activation="relu"),
    layers.Dense(1),
])

model.compile(optimizer="adam", loss="mse", metrics=["mae"])
model.fit(X_train, y_train, epochs=10, validation_split=0.2)
```

### PyTorch Mínimo

```python
import torch
from torch import nn

model = nn.Sequential(
    nn.Linear(10, 32),
    nn.ReLU(),
    nn.Linear(32, 1),
)

x = torch.randn(5, 10)
y = model(x)
print(y.shape)
```

### Quando Usar Deep Learning

Use deep learning quando:

- há muitos dados;
- há imagens, áudio, texto complexo ou sequências;
- modelos clássicos não capturam padrões;
- você pode lidar com maior custo computacional.

---

## Nível 17 — Engenharia de Dados Profissional

Engenharia de Dados se preocupa com dados confiáveis, escaláveis e disponíveis.

### Conceitos

- Data pipeline.
- Data lake.
- Data warehouse.
- Lakehouse.
- Batch.
- Streaming.
- Orquestração.
- Particionamento.
- Idempotência.
- Backfill.
- Data quality.
- Schema evolution.
- Lineage.

### Camadas de Dados

```text
raw       → dados brutos
bronze    → dados ingeridos com pouca transformação
silver    → dados limpos e validados
gold      → dados agregados para negócio
```

### Exemplo de Particionamento

```python
df["ano"] = df["data"].dt.year
df["mes"] = df["data"].dt.month

df.to_parquet(
    "data/lake/vendas",
    partition_cols=["ano", "mes"],
    index=False,
)
```

### Idempotência

Um pipeline idempotente pode rodar várias vezes sem duplicar ou corromper dados.

Estratégias:

- usar chave única;
- sobrescrever partição específica;
- fazer merge/upsert;
- registrar execuções;
- validar antes e depois.

---

## Nível 18 — Spark e Big Data

Spark é usado quando os dados são grandes demais para processar confortavelmente em uma máquina.

### SparkSession

```python
from pyspark.sql import SparkSession

spark = SparkSession.builder.appName("Vendas").getOrCreate()
```

### Lendo Arquivo

```python
df = spark.read.parquet("data/lake/vendas")
df.printSchema()
df.show(5)
```

### Transformação

```python
from pyspark.sql.functions import col, sum as spark_sum

resumo = (
    df.filter(col("receita") > 0)
    .groupBy("categoria")
    .agg(spark_sum("receita").alias("receita_total"))
)

resumo.show()
```

### Escrita Particionada

```python
resumo.write.mode("overwrite").parquet("data/gold/receita_por_categoria")
```

### Boas Práticas Spark

- Evite `collect()` em dados grandes.
- Use Parquet.
- Particione por colunas de filtro.
- Use broadcast join para tabelas pequenas.
- Monitore shuffle.
- Defina schema quando possível.

---

## Nível 19 — Kafka e Streaming

Kafka é usado para eventos em tempo real.

### Producer Simples

```python
from kafka import KafkaProducer
import json

producer = KafkaProducer(
    bootstrap_servers="localhost:9092",
    value_serializer=lambda v: json.dumps(v).encode("utf-8"),
)

producer.send("vendas", {"id": 1, "valor": 100.0})
producer.flush()
```

### Consumer Simples

```python
from kafka import KafkaConsumer
import json

consumer = KafkaConsumer(
    "vendas",
    bootstrap_servers="localhost:9092",
    value_deserializer=lambda m: json.loads(m.decode("utf-8")),
    auto_offset_reset="earliest",
)

for msg in consumer:
    print(msg.value)
```

### Cuidados em Streaming

- idempotência;
- ordenação;
- duplicidade;
- offsets;
- retentativas;
- dead-letter queue;
- schema dos eventos;
- observabilidade.

---

## Nível 20 — Orquestração com Airflow, Prefect e Dagster

Orquestração agenda e monitora pipelines.

### Exemplo Conceitual com Airflow

```python
from airflow.decorators import dag, task
from datetime import datetime

@dag(start_date=datetime(2024, 1, 1), schedule="@daily", catchup=False)
def pipeline_vendas():
    @task
    def extract():
        return "data/raw/vendas.csv"

    @task
    def transform(path: str):
        return "data/processed/vendas.parquet"

    @task
    def load(path: str):
        print(f"Carregando {path}")

    load(transform(extract()))

pipeline_vendas()
```

### Quando Usar

Use orquestração quando:

- há dependências entre tarefas;
- precisa agendar execuções;
- precisa de retries;
- precisa de histórico;
- precisa monitorar falhas.

---

## Nível 21 — Data Warehouse, Lakehouse e Cloud

### Conceitos

- Data warehouse: dados modelados para análise.
- Data lake: dados em arquivos, geralmente baratos e flexíveis.
- Lakehouse: combina lake com recursos de warehouse.
- Dimensão: tabela descritiva.
- Fato: eventos mensuráveis.
- Star schema: fato no centro e dimensões ao redor.

### Modelo Estrela Simples

```text
fato_vendas
├── data_id
├── produto_id
├── cliente_id
├── quantidade
└── valor

dim_produto
dim_cliente
dim_data
```

### Cloud e Serviços

- AWS: S3, Glue, Athena, Redshift, EMR.
- GCP: Cloud Storage, BigQuery, Dataflow, Dataproc.
- Azure: Blob Storage, Synapse, Data Factory, Databricks.
- Databricks: Spark gerenciado, Delta Lake.
- Snowflake: warehouse cloud.

---

## Nível 22 — MLOps e Produção

MLOps conecta dados, modelo, API, deploy e monitoramento.

### MLflow Tracking

```python
import mlflow

with mlflow.start_run():
    mlflow.log_param("modelo", "RandomForest")
    mlflow.log_metric("mae", 123.45)
    mlflow.sklearn.log_model(modelo, "model")
```

### API de Predição

```python
from fastapi import FastAPI
from pydantic import BaseModel
import joblib

app = FastAPI()
modelo = joblib.load("models/modelo.joblib")

class Entrada(BaseModel):
    features: list[float]

@app.post("/predict")
def predict(entrada: Entrada):
    pred = modelo.predict([entrada.features])[0]
    return {"prediction": float(pred)}
```

### Monitoramento de Modelo

Monitore:

- latência;
- erros;
- distribuição das features;
- distribuição das predições;
- drift;
- métricas reais quando disponíveis;
- volume de requisições.

---

## Nível 23 — Observabilidade, Segurança e Governança

### Logging Estruturado

```python
import logging
import json

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def log_event(evento: str, **kwargs):
    logger.info(json.dumps({"evento": evento, **kwargs}))
```

### Métricas

```python
from prometheus_client import Counter

linhas_processadas = Counter(
    "linhas_processadas_total",
    "Total de linhas processadas",
)

linhas_processadas.inc(100)
```

### Segurança

- não comitar `.env`;
- não expor dados sensíveis em logs;
- mascarar PII;
- controlar acesso a dados;
- validar entrada;
- criptografar credenciais;
- auditar acessos.

### Governança

- catálogo de dados;
- ownership;
- lineage;
- versionamento;
- política de retenção;
- qualidade de dados;
- LGPD e privacidade;
- documentação de datasets.

---

## Projetos Progressivos

### Projeto 1 — Relatório CSV Simples

Entrada:

- `data/raw/vendas.csv`

Saída:

- `reports/resumo_vendas.csv`

Objetivo:

- ler CSV;
- calcular receita;
- agrupar por categoria;
- salvar relatório.

### Projeto 2 — Dashboard de Vendas

Ferramentas:

- Pandas;
- Plotly;
- Streamlit.

Objetivo:

- carregar vendas;
- filtrar por categoria;
- exibir métricas;
- gerar gráficos.

### Projeto 3 — ETL com Banco Local

Ferramentas:

- Pandas;
- SQLite;
- SQLAlchemy;
- Pytest.

Objetivo:

- extrair CSV;
- limpar;
- validar;
- carregar em SQLite;
- testar transformações.

### Projeto 4 — Modelo de Previsão

Ferramentas:

- Pandas;
- Scikit-learn;
- Joblib;
- FastAPI.

Objetivo:

- treinar modelo;
- avaliar;
- salvar;
- servir via API.

### Projeto 5 — Pipeline de Engenharia de Dados

Ferramentas:

- Pandas ou Polars;
- Parquet;
- DuckDB;
- Airflow ou Prefect.

Objetivo:

- criar camadas raw, silver e gold;
- validar dados;
- gerar tabela analítica;
- agendar pipeline.

### Projeto 6 — Streaming Analytics

Ferramentas:

- Kafka;
- Python consumer;
- SQLite/Postgres;
- Streamlit.

Objetivo:

- produzir eventos;
- consumir eventos;
- persistir;
- mostrar dashboard em quase tempo real.

### Projeto 7 — Big Data Local

Ferramentas:

- PySpark;
- Parquet;
- DuckDB;

Objetivo:

- gerar dataset grande sintético;
- processar com Spark;
- salvar particionado;
- consultar com DuckDB.

### Projeto 8 — Projeto Final Especialista

Arquitetura:

```text
API externa / CSV / Eventos
        ↓
Extract
        ↓
Raw
        ↓
Validação
        ↓
Silver
        ↓
Transformações analíticas
        ↓
Gold
        ↓
Dashboard + Modelo + API
        ↓
Monitoramento
```

Entregáveis:

- pipeline reprodutível;
- testes;
- validação de dados;
- documentação;
- dashboard;
- modelo;
- API;
- Docker;
- README profissional;
- diagrama de arquitetura.

---

## Checklist de Domínio

### Fundamentos

- [ ] Sei manipular listas e dicionários para dados pequenos.
- [ ] Sei criar funções reutilizáveis.
- [ ] Sei organizar projeto de dados.
- [ ] Sei ler e escrever arquivos.

### NumPy

- [ ] Sei criar arrays.
- [ ] Sei usar operações vetorizadas.
- [ ] Sei usar máscaras booleanas.
- [ ] Sei normalizar dados.

### Pandas

- [ ] Sei criar e ler DataFrames.
- [ ] Sei filtrar, ordenar e selecionar dados.
- [ ] Sei usar groupby.
- [ ] Sei fazer merge e join.
- [ ] Sei tratar nulos e duplicatas.
- [ ] Sei trabalhar com datas.

### Visualização e EDA

- [ ] Sei criar histogramas, barras, linhas e dispersão.
- [ ] Sei interpretar estatísticas descritivas.
- [ ] Sei detectar outliers.
- [ ] Sei criar relatório exploratório.

### Engenharia de Dados

- [ ] Sei criar pipeline ETL.
- [ ] Sei validar dados.
- [ ] Sei usar SQL.
- [ ] Sei usar Parquet.
- [ ] Sei particionar dados.
- [ ] Sei escrever pipeline idempotente.

### Machine Learning

- [ ] Sei separar treino e teste.
- [ ] Sei criar baseline.
- [ ] Sei treinar modelo com Scikit-learn.
- [ ] Sei avaliar modelo.
- [ ] Sei salvar modelo.
- [ ] Sei servir modelo via API.

### Big Data e Produção

- [ ] Sei explicar quando usar Spark.
- [ ] Sei explicar Kafka.
- [ ] Sei explicar Airflow.
- [ ] Sei monitorar pipeline.
- [ ] Sei documentar arquitetura.
- [ ] Sei lidar com segurança e governança.

---

## Rotina de Estudos

### Semana 1 — Base

- Python para dados.
- NumPy.
- Pandas básico.

### Semana 2 — Limpeza e EDA

- Nulos.
- Duplicatas.
- Tipos.
- Estatísticas.
- Visualizações.

### Semana 3 — Arquivos e SQL

- CSV.
- Excel.
- JSON.
- Parquet.
- SQLite.
- DuckDB.

### Semana 4 — ETL

- Extract.
- Transform.
- Load.
- Logs.
- Validação.
- Testes.

### Semana 5 — ML

- Scikit-learn.
- Métricas.
- Pipeline.
- Persistência.
- API.

### Semana 6 — Engenharia de Dados

- Camadas raw/silver/gold.
- Particionamento.
- Airflow/Prefect.
- Spark básico.
- Kafka básico.

### Semana 7+ — Projetos

- Dashboard.
- ETL completo.
- Modelo em produção.
- Pipeline streaming.
- Projeto final especialista.

---

## Conclusão

Data Science e Engenharia de Dados com Python exigem progressão. Primeiro domine Python, NumPy e Pandas. Depois pratique limpeza, EDA, visualização, SQL e arquivos. Em seguida avance para pipelines, validação, Machine Learning, orquestração, Spark, Kafka, MLOps e produção.

O objetivo final é construir soluções reais: dados entram, são tratados, validados, armazenados, analisados, modelados, servidos e monitorados.

