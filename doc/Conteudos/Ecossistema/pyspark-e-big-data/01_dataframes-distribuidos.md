# DataFrames distribuídos

Spark processa grandes volumes de forma distribuída.

## Pontos-chave

- SparkSession e DataFrame API
- Transformações lazy e ações
- select, filter, groupBy
- Leitura/escrita de Parquet

## Exemplo

```python
from pyspark.sql import SparkSession, functions as F
spark = SparkSession.builder.getOrCreate()
df = spark.read.parquet('dados/')
df.groupBy('categoria').agg(F.sum('valor')).show()
```

## Boas práticas

- Minimize shuffles
- Particione adequadamente

## Saiba mais

- [Documentação oficial](https://spark.apache.org/docs/latest/api/python/)
