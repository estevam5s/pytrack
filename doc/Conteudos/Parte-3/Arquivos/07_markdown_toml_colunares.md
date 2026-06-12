# Markdown, TOML, Parquet, Avro, ORC, PyArrow e Fastparquet

Este módulo complementa os formatos básicos com documentação, configuração e formatos analíticos modernos. Ele cobre Markdown, TOML, Parquet, Avro, ORC, `pyarrow` e `fastparquet`.

---

## Sumário

1. [Markdown](#markdown)
2. [TOML](#toml)
3. [Parquet](#parquet)
4. [PyArrow](#pyarrow)
5. [Fastparquet](#fastparquet)
6. [Avro](#avro)
7. [ORC](#orc)
8. [Comparação de Formatos](#comparação-de-formatos)
9. [Boas Práticas](#boas-práticas)
10. [Exercícios](#exercícios)

---

## Markdown

Markdown é texto simples para documentação, relatórios e anotações técnicas.

Leitura:

```python
from pathlib import Path

conteudo = Path("README.md").read_text(encoding="utf-8")
linhas = conteudo.splitlines()
```

Geração de relatório:

```python
from pathlib import Path

def gerar_relatorio_markdown(metricas: dict) -> str:
    linhas = [
        "# Relatório de Processamento",
        "",
        "| Métrica | Valor |",
        "| --- | ---: |",
    ]

    for nome, valor in metricas.items():
        linhas.append(f"| {nome} | {valor} |")

    return "\n".join(linhas) + "\n"

metricas = {"linhas": 1200, "erros": 3}
Path("relatorio.md").write_text(
    gerar_relatorio_markdown(metricas),
    encoding="utf-8",
)
```

Conversão para HTML:

```bash
python -m pip install markdown
```

```python
import markdown

html = markdown.markdown(conteudo, extensions=["tables", "fenced_code"])
```

Use Markdown para saída humana, documentação de pipeline, changelog e relatórios simples versionáveis.

---

## TOML

TOML é formato de configuração legível e tipado. Em Python moderno, leitura está na biblioteca padrão via `tomllib`.

Leitura:

```python
import tomllib
from pathlib import Path

with Path("pyproject.toml").open("rb") as arquivo:
    config = tomllib.load(arquivo)

print(config["project"]["name"])
```

Escrita exige biblioteca externa:

```bash
python -m pip install tomli-w
```

```python
import tomli_w
from pathlib import Path

config = {
    "app": {
        "debug": False,
        "workers": 4,
    }
}

Path("config.toml").write_text(
    tomli_w.dumps(config),
    encoding="utf-8",
)
```

Use TOML para:

- `pyproject.toml`;
- configuração de ferramentas;
- configuração de aplicação pequena;
- valores tipados sem a ambiguidade de YAML.

---

## Parquet

Parquet é formato colunar, comprimido e eficiente para analytics.

Instalação:

```bash
python -m pip install pandas pyarrow fastparquet
```

Com Pandas:

```python
import pandas as pd

df = pd.read_csv("vendas.csv")
df.to_parquet("vendas.parquet", index=False, engine="pyarrow")

df2 = pd.read_parquet("vendas.parquet", engine="pyarrow")
```

Particionamento:

```python
df.to_parquet(
    "data/vendas_particionadas",
    partition_cols=["ano", "mes"],
    engine="pyarrow",
    index=False,
)
```

Use Parquet quando:

- dados são tabulares;
- leitura analítica é frequente;
- precisa compressão e preservação de tipos;
- usa Pandas, Polars, DuckDB, Spark ou data lake.

---

## PyArrow

`pyarrow` implementa Apache Arrow, Parquet, IPC, datasets e integração eficiente entre ferramentas.

Tabela Arrow:

```python
import pyarrow as pa

dados = {
    "id": [1, 2],
    "nome": ["Ana", "Bia"],
}

tabela = pa.table(dados)
print(tabela.schema)
```

Parquet com `pyarrow.parquet`:

```python
import pyarrow.parquet as pq

pq.write_table(tabela, "clientes.parquet", compression="snappy")
carregada = pq.read_table("clientes.parquet")
```

Dataset particionado:

```python
import pyarrow.dataset as ds

dataset = ds.dataset("data/vendas_particionadas", format="parquet")
tabela = dataset.to_table(columns=["categoria", "valor"])
```

Use `pyarrow` quando precisa de controle fino, interoperabilidade e formatos colunares modernos.

---

## Fastparquet

`fastparquet` é outra engine Parquet usada com Pandas.

```python
df.to_parquet("vendas.parquet", engine="fastparquet", compression="snappy")
df = pd.read_parquet("vendas.parquet", engine="fastparquet")
```

Comparação prática:

| Critério | pyarrow | fastparquet |
| --- | --- | --- |
| Ecossistema Arrow | Forte | Não é o foco |
| Compatibilidade ampla | Muito alta | Boa |
| Datasets e formatos extras | Forte | Mais limitado |
| Uso comum atual | Padrão frequente | Alternativa útil |

Regra prática: comece com `pyarrow`; use `fastparquet` quando houver motivo específico de compatibilidade ou performance no seu caso.

---

## Avro

Avro é formato row-based com schema explícito. É comum em streaming, Kafka e integração entre sistemas.

Instalação:

```bash
python -m pip install fastavro
```

Escrita:

```python
from fastavro import writer, parse_schema

schema = {
    "type": "record",
    "name": "Cliente",
    "fields": [
        {"name": "id", "type": "int"},
        {"name": "nome", "type": "string"},
    ],
}

registros = [
    {"id": 1, "nome": "Ana"},
    {"id": 2, "nome": "Bia"},
]

with open("clientes.avro", "wb") as arquivo:
    writer(arquivo, parse_schema(schema), registros)
```

Leitura:

```python
from fastavro import reader

with open("clientes.avro", "rb") as arquivo:
    for registro in reader(arquivo):
        print(registro)
```

Use Avro quando schema e compatibilidade entre produtores/consumidores importam.

---

## ORC

ORC é formato colunar comum no ecossistema Hive/Hadoop.

Com `pyarrow`:

```python
import pyarrow as pa
import pyarrow.orc as orc

tabela = pa.table({"id": [1, 2], "valor": [10.5, 20.0]})

with open("dados.orc", "wb") as arquivo:
    orc.write_table(tabela, arquivo)

with open("dados.orc", "rb") as arquivo:
    carregada = orc.ORCFile(arquivo).read()
```

Use ORC quando sua plataforma de dados já o adota, especialmente em ambientes Hive/Hadoop.

---

## Comparação de Formatos

| Formato | Tipo | Melhor uso |
| --- | --- | --- |
| TXT | texto livre | logs simples, listas, entrada humana |
| Markdown | texto estruturado | documentação e relatórios |
| CSV | tabular texto | troca simples e compatibilidade ampla |
| JSON | semi-estruturado | APIs e configuração simples |
| JSONL | registros por linha | eventos e streaming em arquivo |
| XML | hierárquico | legados, fiscal, integrações formais |
| YAML | configuração humana | DevOps e configs legíveis |
| TOML | configuração tipada | projetos Python e configs estáveis |
| Excel | planilha | negócio, relatórios, usuários finais |
| Parquet | colunar | analytics, data lake, performance |
| Avro | row-based com schema | streaming e integração |
| ORC | colunar | Hive/Hadoop |
| PDF | documento final | relatórios e documentos, não dados primários |

---

## Boas Práticas

- Use UTF-8 sempre que possível.
- Documente schema, encoding, separador e engine.
- Prefira Parquet para dados intermediários analíticos.
- Use Avro quando schema evolution em eventos for requisito.
- Use TOML para configuração de projeto Python.
- Use Markdown para documentação versionada.
- Evite PDF como fonte primária de dados.
- Não carregue YAML/Pickle de fonte não confiável.
- Valide arquivos antes de processar.
- Teste conversões entre formatos com amostras reais.

---

## Exercícios

1. Gere um relatório Markdown com tabela de métricas.
2. Leia `pyproject.toml` com `tomllib`.
3. Escreva um `config.toml` com `tomli-w`.
4. Converta CSV para Parquet com Pandas e `pyarrow`.
5. Leia Parquet com `pyarrow.parquet`.
6. Compare `pyarrow` e `fastparquet`.
7. Escreva e leia arquivo Avro com `fastavro`.
8. Escreva e leia arquivo ORC com `pyarrow.orc`.
9. Escolha o melhor formato para um pipeline de analytics.
