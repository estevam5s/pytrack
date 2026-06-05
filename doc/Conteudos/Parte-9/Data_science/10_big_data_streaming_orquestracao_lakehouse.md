# Big Data, Streaming, Orquestração, Cloud Warehouses e Lakehouse

Este módulo cobre o ecossistema de engenharia de dados em escala: processamento distribuído, streaming, mensageria, orquestração, data warehouses cloud e formatos/tabelas de lakehouse.

---

## Sumário

1. [Quando Sair do Stack Local](#quando-sair-do-stack-local)
2. [Processamento Distribuído: PySpark, Dask, Ray, Hadoop, Flink e Beam](#processamento-distribuído-pyspark-dask-ray-hadoop-flink-e-beam)
3. [Streaming e Mensageria: Kafka, Faust, Confluent Kafka, Redis Streams, RabbitMQ e Pulsar](#streaming-e-mensageria-kafka-faust-confluent-kafka-redis-streams-rabbitmq-e-pulsar)
4. [Orquestração: Airflow, Prefect, Dagster e Luigi](#orquestração-airflow-prefect-dagster-e-luigi)
5. [Warehouses e Plataformas: Snowflake, BigQuery, Redshift, Databricks e Synapse](#warehouses-e-plataformas-snowflake-bigquery-redshift-databricks-e-synapse)
6. [Storage e Lakehouse: S3, Delta Lake, Iceberg, Hudi, Parquet, ORC e Avro](#storage-e-lakehouse-s3-delta-lake-iceberg-hudi-parquet-orc-e-avro)
7. [Arquiteturas de Dados](#arquiteturas-de-dados)
8. [Como Escolher](#como-escolher)
9. [Boas Práticas](#boas-práticas)
10. [Exercícios](#exercícios)

---

## Quando Sair do Stack Local

Pandas, Polars e DuckDB resolvem muito. Considere Big Data quando:

- dados não cabem na máquina;
- precisa processar muitos TB/PB;
- há múltiplas fontes e SLAs;
- precisa streaming real;
- a equipe precisa governança, lineage e catálogo;
- custos e performance exigem execução distribuída;
- múltiplos consumidores dependem dos mesmos dados.

Não use Spark, Kafka ou Airflow por estética. Use quando o problema paga a complexidade.

---

## Processamento Distribuído: PySpark, Dask, Ray, Hadoop, Flink e Beam

### PySpark

PySpark é a API Python do Apache Spark, padrão de mercado para batch distribuído.

```python
from pyspark.sql import SparkSession
from pyspark.sql import functions as F

spark = SparkSession.builder.appName("vendas").getOrCreate()

df = spark.read.parquet("s3://lake/silver/vendas/")
resultado = (
    df
    .where(F.col("valor") > 0)
    .groupBy("categoria")
    .agg(F.sum("valor").alias("receita"))
)
resultado.write.mode("overwrite").parquet("s3://lake/gold/vendas_categoria/")
```

Use para batch em escala, ETL distribuído, integrações com lakehouse e workloads em Databricks/EMR/Dataproc.

### Dask

Dask escala DataFrames, arrays e tarefas Python.

```python
import dask.dataframe as dd

df = dd.read_parquet("s3://lake/silver/vendas/")
resultado = df.groupby("categoria")["valor"].sum().compute()
```

Use quando quer escalar código Python/Pandas com menor mudança conceitual que Spark.

### Ray

Ray distribui tarefas Python, atores e workloads de ML/data.

```python
import ray

ray.init()

@ray.remote
def processar(particao):
    return particao.sum()

resultados = ray.get([processar.remote(p) for p in particoes])
```

Use para paralelismo Python geral, ML distribuído, pipelines customizados e sistemas com atores.

### Hadoop

Hadoop é o ecossistema histórico de HDFS, YARN e MapReduce. Hoje aparece mais como base legada ou infraestrutura ao redor de Spark/Hive.

Conceitos importantes:

- HDFS;
- particionamento;
- localidade de dados;
- Hive Metastore;
- YARN;
- jobs distribuídos.

### Flink

Apache Flink é forte para streaming stateful, baixa latência, janelas e exactly-once em pipelines contínuos.

Use quando:

- streaming é requisito central;
- há estado por chave;
- precisa janelas, watermark e event time;
- latência importa mais que batch.

### Beam

Apache Beam define pipelines portáveis que rodam em runners como Dataflow, Flink e Spark.

```python
import apache_beam as beam

with beam.Pipeline() as p:
    (
        p
        | "Ler" >> beam.io.ReadFromText("entrada.txt")
        | "Mapear" >> beam.Map(lambda linha: linha.upper())
        | "Escrever" >> beam.io.WriteToText("saida")
    )
```

Use quando portabilidade entre runners e modelo unificado batch/streaming são importantes.

---

## Streaming e Mensageria: Kafka, Faust, Confluent Kafka, Redis Streams, RabbitMQ e Pulsar

### Kafka

Kafka é log distribuído de eventos.

Conceitos:

- topic;
- partition;
- offset;
- consumer group;
- retention;
- replay;
- schema registry;
- compaction.

Use para eventos de alto volume, integração entre serviços, CDC, streaming analytics e pipelines reprocessáveis.

### Confluent Kafka

`confluent-kafka` é cliente Python performático baseado em `librdkafka`.

```python
from confluent_kafka import Producer

producer = Producer({"bootstrap.servers": "localhost:9092"})
producer.produce("eventos", key="pedido-1", value=b'{"status": "criado"}')
producer.flush()
```

Prefira para produção quando performance, estabilidade e integração com ecossistema Confluent importam.

### Faust

Faust é uma biblioteca inspirada em Kafka Streams para Python.

```python
import faust

app = faust.App("analytics", broker="kafka://localhost:9092")
pedidos = app.topic("pedidos", value_type=dict)

@app.agent(pedidos)
async def processar(stream):
    async for pedido in stream:
        print(pedido)
```

Use com cautela: avalie manutenção e maturidade do ecossistema antes de adotar em produção.

### Redis Streams

Redis Streams fornece stream persistente com consumer groups.

```python
import redis

r = redis.Redis()
r.xadd("pedidos", {"id": "1", "valor": "100"})
mensagens = r.xread({"pedidos": "0-0"}, count=10)
```

Use para streaming simples quando Redis já existe e o volume/retention são compatíveis.

### RabbitMQ

RabbitMQ é broker de mensagens orientado a filas, routing e ack.

Use para:

- jobs;
- comandos assíncronos;
- filas de trabalho;
- roteamento por exchange/routing key;
- integração com Celery.

Kafka é melhor para replay e event log. RabbitMQ é melhor para filas de trabalho e comandos.

### Pulsar

Apache Pulsar combina pub/sub, filas, multi-tenancy e storage segmentado.

Use quando:

- precisa multi-tenancy forte;
- quer separar serving e storage;
- há muitos tópicos;
- geo-replicação e retenção são importantes.

---

## Orquestração: Airflow, Prefect, Dagster e Luigi

### Airflow

Airflow é padrão de mercado para DAGs batch agendadas.

Bom para:

- workflows recorrentes;
- dependências explícitas;
- retries;
- backfills;
- ecossistema amplo.

Evite colocar processamento pesado dentro do scheduler. Airflow deve orquestrar, não carregar todo o dado na memória.

### Prefect

Prefect tem foco em ergonomia Python, flows, tasks e execução local/cloud.

```python
from prefect import flow, task

@task
def extrair():
    return "dados"

@task
def transformar(dados):
    return dados.upper()

@flow
def pipeline():
    transformar(extrair())

pipeline()
```

### Dagster

Dagster organiza pipelines ao redor de assets, tipos, materializações e observabilidade.

Use quando:

- quer asset-centric data platform;
- precisa lineage e contratos claros;
- times colaboram em muitos datasets.

### Luigi

Luigi é mais antigo e simples para dependências entre tarefas batch.

Use em legados ou pipelines menores onde Airflow/Prefect/Dagster seriam pesados.

---

## Warehouses e Plataformas: Snowflake, BigQuery, Redshift, Databricks e Synapse

| Plataforma | Melhor uso |
| --- | --- |
| Snowflake | warehouse cloud multi-cloud, separação storage/compute, SQL e compartilhamento |
| BigQuery | serverless analytics no GCP, SQL em escala, integração com Dataflow/Looker |
| Redshift | warehouse AWS integrado ao ecossistema S3/IAM |
| Databricks | lakehouse com Spark, Delta Lake, notebooks, jobs e ML |
| Synapse | analytics integrado ao Azure, SQL, Spark e Data Lake |

Critérios de escolha:

- cloud principal da empresa;
- custo por consulta/cluster;
- modelo de governança;
- skills do time;
- integração com BI;
- suporte a dados semi-estruturados;
- necessidade de notebooks, ML e lakehouse.

---

## Storage e Lakehouse: S3, Delta Lake, Iceberg, Hudi, Parquet, ORC e Avro

### S3 e Object Storage

S3 virou padrão para data lakes. Alternativas incluem GCS, Azure Blob/ADLS e MinIO.

Práticas:

- organize por camada: raw, bronze, silver, gold;
- particione por colunas de filtro frequente;
- evite arquivos pequenos demais;
- controle permissões;
- versionamento e lifecycle policy reduzem risco/custo.

### Parquet

Parquet é formato colunar eficiente para analytics.

Bom para:

- leitura seletiva de colunas;
- compressão;
- Spark, DuckDB, Polars, Pandas e warehouses;
- camadas intermediárias e gold.

### ORC

ORC é formato colunar comum no ecossistema Hive/Hadoop.

Use quando sua plataforma já padroniza ORC, especialmente em ambientes Hive antigos.

### Avro

Avro é formato row-based com schema, comum em streaming e Kafka.

Use para eventos, serialização e compatibilidade de schema via Schema Registry.

### Delta Lake

Delta Lake adiciona transações ACID, schema enforcement, time travel e MERGE sobre data lake.

Muito usado com Databricks e Spark.

### Apache Iceberg

Iceberg é formato de tabela aberta para data lakes, com evolução de schema, particionamento oculto, snapshots e interoperabilidade.

Forte quando você quer lakehouse aberto com múltiplas engines.

### Apache Hudi

Hudi foca em upserts, incremental processing e ingestão contínua.

Útil para CDC, dados mutáveis e pipelines com atualização frequente.

---

## Arquiteturas de Dados

### Batch

```text
fontes -> ingestão -> raw/bronze -> silver -> gold -> BI/ML
```

### Streaming

```text
eventos -> broker -> processamento -> lake/warehouse/cache -> consumo
```

### Lambda Architecture

Combina batch e speed layer. É poderosa, mas pode duplicar lógica.

### Kappa Architecture

Usa stream como fonte principal e reprocessa eventos quando necessário.

### Lakehouse

Combina data lake com capacidades de warehouse: tabelas abertas, transações, catálogo, governança e SQL.

---

## Como Escolher

| Problema | Ferramenta inicial |
| --- | --- |
| analytics local em arquivos | DuckDB/Polars |
| batch distribuído | PySpark |
| Python paralelo customizado | Ray |
| dataset maior que memória com API Python | Dask |
| streaming stateful | Flink |
| pipeline portável batch/streaming | Beam |
| eventos reprocessáveis | Kafka |
| filas de trabalho | RabbitMQ |
| stream simples com Redis | Redis Streams |
| DAG batch recorrente | Airflow |
| orquestração Python moderna | Prefect |
| plataforma data assets | Dagster |
| warehouse serverless GCP | BigQuery |
| lakehouse Spark | Databricks/Delta Lake |
| tabela aberta multi-engine | Iceberg |

---

## Boas Práticas

- Comece simples e escale por necessidade real.
- Use formatos colunares para analytics.
- Padronize contratos de schema.
- Controle tamanho de arquivos no lake.
- Monitore custo por job, consulta e armazenamento.
- Separe orquestração de processamento pesado.
- Use idempotência e particionamento determinístico.
- Defina ownership dos datasets.
- Documente lineage, freshness e SLAs.
- Teste backfills e reprocessamento antes de produção.

---

## Exercícios

1. Leia Parquet com PySpark e agregue por categoria.
2. Compare Dask e Polars para um dataset maior.
3. Modele um tópico Kafka com chave, schema e retention.
4. Compare Kafka, RabbitMQ, Redis Streams e Pulsar.
5. Desenhe uma DAG Airflow para pipeline bronze/silver/gold.
6. Reescreva a DAG conceitual em Prefect.
7. Explique quando Dagster é melhor que Airflow.
8. Compare Snowflake, BigQuery, Redshift, Databricks e Synapse.
9. Escolha entre Delta Lake, Iceberg e Hudi para CDC.
10. Desenhe uma arquitetura lakehouse com S3, Parquet e catálogo.
