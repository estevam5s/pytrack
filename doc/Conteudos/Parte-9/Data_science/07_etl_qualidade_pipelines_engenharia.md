# ETL, ELT, Qualidade, Pipelines e Engenharia de Dados

Este arquivo conecta análise com engenharia: extração, transformação, carga, validação, contratos, idempotência, observabilidade e entrega confiável de dados.

---

## Sumário

1. [ETL e ELT](#etl-e-elt)
2. [Extração](#extração)
3. [Transformação](#transformação)
4. [Carga](#carga)
5. [Qualidade de Dados](#qualidade-de-dados)
6. [Pipelines Idempotentes](#pipelines-idempotentes)
7. [Orquestração](#orquestração)
8. [Great Expectations](#great-expectations)
9. [Data Warehouse e Lakehouse](#data-warehouse-e-lakehouse)
10. [Observabilidade](#observabilidade)
11. [Boas Práticas](#boas-práticas)
12. [Exercícios](#exercícios)

---

## ETL e ELT

ETL:

```text
Extract -> Transform -> Load
```

ELT:

```text
Extract -> Load -> Transform
```

ETL transforma antes de carregar. ELT carrega primeiro e transforma dentro do warehouse/lakehouse.

Escolha depende de:

- volume;
- arquitetura;
- governança;
- custo;
- ferramenta;
- latência;
- necessidade de auditoria.

---

## Extração

Fontes:

- CSV;
- Excel;
- JSON;
- APIs;
- bancos relacionais;
- filas;
- logs;
- Parquet;
- data lakes.

Exemplo API com retry simples:

```python
import time
import requests

def buscar_json(url: str, tentativas: int = 3) -> dict:
    ultimo_erro = None

    for tentativa in range(1, tentativas + 1):
        try:
            resposta = requests.get(url, timeout=10)
            resposta.raise_for_status()
            return resposta.json()
        except requests.RequestException as erro:
            ultimo_erro = erro
            if tentativa < tentativas:
                time.sleep(2 ** tentativa)

    raise RuntimeError(f"falha ao buscar {url}") from ultimo_erro
```

Paginação:

```python
def coletar_paginas(base_url: str):
    pagina = 1

    while True:
        dados = buscar_json(f"{base_url}?page={pagina}")
        itens = dados.get("items", [])

        if not itens:
            break

        yield from itens
        pagina += 1
```

---

## Transformação

Transformações devem ser:

- puras quando possível;
- testáveis;
- documentadas;
- determinísticas;
- compostas em pipeline.

```python
def transformar_vendas(df):
    df = df.copy()
    df.columns = df.columns.str.strip().str.lower()
    df["data"] = pd.to_datetime(df["data"], errors="coerce")
    df["valor"] = pd.to_numeric(df["valor"], errors="coerce")
    df = df.dropna(subset=["data", "valor"])
    return df
```

Transformação com camadas:

```text
raw -> bronze -> silver -> gold
```

- raw: original;
- bronze: ingestão;
- silver: limpo;
- gold: pronto para consumo.

---

## Carga

CSV:

```python
df.to_csv("data/gold/vendas.csv", index=False)
```

Parquet:

```python
df.to_parquet("data/gold/vendas.parquet", index=False)
```

Banco:

```python
from sqlalchemy import create_engine

engine = create_engine("sqlite:///dados.db")
df.to_sql("vendas", engine, if_exists="replace", index=False)
```

Particionamento:

```python
df.to_parquet(
    "data/gold/vendas_particionadas",
    partition_cols=["ano", "mes"],
    index=False,
)
```

---

## Qualidade de Dados

Validações comuns:

- schema;
- tipos;
- nulos;
- unicidade;
- intervalo;
- domínio permitido;
- relacionamento entre colunas;
- volume esperado;
- freshness;
- duplicatas.

Validação manual:

```python
def validar_vendas(df):
    erros = []

    if df["id"].duplicated().any():
        erros.append("ids duplicados")

    if df["valor"].isna().any():
        erros.append("valor com nulos")

    if (df["valor"] <= 0).any():
        erros.append("valor não positivo")

    if erros:
        raise ValueError("; ".join(erros))
```

Pandera:

```python
import pandera as pa
from pandera import Column, DataFrameSchema, Check

schema = DataFrameSchema(
    {
        "id": Column(int, unique=True),
        "valor": Column(float, Check.gt(0)),
        "categoria": Column(str, nullable=False),
    }
)

schema.validate(df)
```

Great Expectations é outra opção forte para validação, documentação e suites de expectativas. Veja `09_ecossistema_analytics_bibliotecas.md`.

---

## Pipelines Idempotentes

Pipeline idempotente pode rodar mais de uma vez sem duplicar ou corromper dados.

Estratégias:

- overwrite por partição;
- upsert por chave;
- controle de watermark;
- tabelas temporárias;
- transações;
- nomes determinísticos;
- logs de execução.

Exemplo:

```python
def caminho_particao(base, data):
    return base / f"ano={data.year}" / f"mes={data.month:02d}"
```

---

## Orquestração

Ferramentas:

- Airflow;
- Prefect;
- Dagster;
- cron;
- GitHub Actions;
- dbt para transformações SQL.

Exemplo conceitual Airflow:

```python
from airflow.decorators import dag, task
from pendulum import datetime

@dag(start_date=datetime(2026, 1, 1), schedule="@daily", catchup=False)
def pipeline_vendas():
    @task
    def extract():
        return "data/raw/vendas.csv"

    @task
    def transform(caminho):
        return "data/silver/vendas.parquet"

    @task
    def load(caminho):
        print(f"carregando {caminho}")

    load(transform(extract()))

pipeline_vendas()
```

---

## Great Expectations

Great Expectations cria suites de validação com documentação de qualidade de dados.

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
    raise ValueError("dados fora do contrato")
```

Use Great Expectations quando precisa:

- versionar contratos de dados;
- gerar documentação de qualidade;
- validar datasets em pipelines;
- comunicar regras entre engenharia, analytics e negócio.

Para validações leves em DataFrames Python, Pandera pode ser mais simples.

---

## Data Warehouse e Lakehouse

Warehouse:

- dados estruturados;
- SQL;
- BI;
- governança forte.

Lake:

- dados brutos;
- formatos variados;
- escala.

Lakehouse:

- combina lake e warehouse;
- tabelas abertas;
- transações;
- governança.

Modelo estrela:

```text
fato_vendas
  cliente_id
  produto_id
  data_id
  valor

dim_cliente
dim_produto
dim_data
```

---

## Observabilidade

Monitore:

- duração;
- volume de linhas;
- taxa de erro;
- freshness;
- schema drift;
- nulos inesperados;
- duplicatas;
- custo.

Log estruturado:

```python
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

logger.info("pipeline iniciado", extra={"pipeline": "vendas"})
```

Métricas:

```python
metricas = {
    "linhas": len(df),
    "colunas": len(df.columns),
    "nulos_valor": int(df["valor"].isna().sum()),
}
```

---

## Boas Práticas

- Preserve raw.
- Valide antes de publicar.
- Use Parquet para camadas intermediárias.
- Faça pipelines idempotentes.
- Registre logs e métricas.
- Teste transformações.
- Documente contratos de dados.
- Automatize execução.
- Monitore freshness.
- Tenha plano para schema drift.

---

## Exercícios

1. Crie pipeline extract-transform-load com CSV.
2. Adicione validação manual.
3. Adicione schema com Pandera.
4. Salve silver e gold em Parquet.
5. Faça pipeline idempotente por partição.
6. Crie métricas de qualidade.
7. Escreva DAG conceitual do Airflow.
8. Modele fato e dimensões para vendas.
