# DataFrames distribuídos

Spark processa grandes volumes de forma distribuída.

> **Tema:** Big Data · **Nível:** avancado · **Trilha:** PySpark e Big Data

## Conceitos-chave

Nesta lição você vai entender:

- **SparkSession e DataFrame API**
- **Transformações lazy e ações**
- **select, filter, groupBy**
- **Leitura/escrita de Parquet**

## Exemplo prático

```python
from pyspark.sql import SparkSession, functions as F
spark = SparkSession.builder.getOrCreate()
df = spark.read.parquet('dados/')
df.groupBy('categoria').agg(F.sum('valor')).show()
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Minimize shuffles
- Particione adequadamente

## Pratique

Para fixar, escreva um pequeno script que combine **sparksession e dataframe api** e **transformações lazy e ações** em um caso do seu dia a dia. Depois refatore aplicando "Minimize shuffles".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: SparkSession e DataFrame API
- [ ] Explicar e aplicar: Transformações lazy e ações
- [ ] Explicar e aplicar: select, filter, groupBy
- [ ] Explicar e aplicar: Leitura/escrita de Parquet

## Saiba mais

- [Documentação oficial](https://spark.apache.org/docs/latest/api/python/)
