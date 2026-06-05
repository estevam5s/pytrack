# Elasticsearch: Busca, Índices, Relevância e Observabilidade

Elasticsearch é um mecanismo distribuído de busca e análise baseado em documentos JSON. Ele é usado para busca textual, filtros rápidos, autocomplete, logs, métricas, observabilidade e exploração de dados.

Ele não substitui automaticamente um banco transacional. Normalmente é usado como índice de leitura derivado de uma fonte primária, como PostgreSQL, MongoDB ou eventos.

---

## Instalação do Cliente

```bash
pip install elasticsearch
```

Conexão:

```python
from elasticsearch import Elasticsearch


es = Elasticsearch("http://localhost:9200")
print(es.info())
```

Em produção, use autenticação, TLS e configuração de timeout.

---

## Índice e Documento

Criar índice simples:

```python
es.indices.create(index="produtos", ignore_status=400)
```

Indexar documento:

```python
es.index(
    index="produtos",
    id="1",
    document={
        "nome": "Teclado Mecânico",
        "categoria": "perifericos",
        "preco": 299.90,
        "ativo": True,
    },
)
```

Buscar por ID:

```python
doc = es.get(index="produtos", id="1")
```

---

## Mapping

Mapping define tipos e análise dos campos.

```python
es.indices.create(
    index="produtos_v1",
    mappings={
        "properties": {
            "nome": {"type": "text"},
            "nome_keyword": {"type": "keyword"},
            "categoria": {"type": "keyword"},
            "preco": {"type": "double"},
            "ativo": {"type": "boolean"},
            "criado_em": {"type": "date"},
        }
    },
)
```

Tipos comuns:

- `text`: busca textual analisada.
- `keyword`: filtros, agregações e ordenação.
- `date`: datas.
- `integer`, `long`, `double`: números.
- `boolean`: verdadeiro/falso.
- `object` e `nested`: estruturas aninhadas.

---

## Busca Textual

```python
resp = es.search(
    index="produtos",
    query={
        "match": {
            "nome": "teclado mecanico"
        }
    },
)
```

`match` analisa o texto e calcula relevância.

---

## Filtros

```python
resp = es.search(
    index="produtos",
    query={
        "bool": {
            "must": [
                {"match": {"nome": "teclado"}}
            ],
            "filter": [
                {"term": {"ativo": True}},
                {"term": {"categoria": "perifericos"}},
                {"range": {"preco": {"lte": 500}}},
            ],
        }
    },
)
```

Use `filter` para condições que não precisam afetar score.

---

## Paginação

Paginação simples:

```python
es.search(index="produtos", from_=0, size=20, query={"match_all": {}})
```

Para páginas profundas, use `search_after`:

```python
resp = es.search(
    index="produtos",
    size=20,
    sort=[{"preco": "asc"}, {"_id": "asc"}],
    query={"match_all": {}},
)

ultimo_sort = resp["hits"]["hits"][-1]["sort"]

proxima = es.search(
    index="produtos",
    size=20,
    sort=[{"preco": "asc"}, {"_id": "asc"}],
    search_after=ultimo_sort,
    query={"match_all": {}},
)
```

---

## Agregações

```python
resp = es.search(
    index="produtos",
    size=0,
    aggs={
        "por_categoria": {
            "terms": {"field": "categoria"}
        },
        "preco_medio": {
            "avg": {"field": "preco"}
        },
    },
)
```

Agregações são muito usadas em dashboards e filtros facetados.

---

## Bulk Indexing

```python
from elasticsearch.helpers import bulk


acoes = [
    {
        "_index": "produtos",
        "_id": produto["id"],
        "_source": produto,
    }
    for produto in produtos
]

bulk(es, acoes)
```

Use bulk para cargas e sincronizações em lote.

---

## Aliases e Reindex

Boa prática: usar alias para trocar versões de índice.

```python
es.indices.create(index="produtos_v2", mappings={...})

# carrega produtos_v2

es.indices.update_aliases(actions=[
    {"remove": {"index": "produtos_v1", "alias": "produtos"}},
    {"add": {"index": "produtos_v2", "alias": "produtos"}},
])
```

A aplicação consulta o alias `produtos`, não o índice físico.

---

## Analyzers

Analyzers definem como texto é quebrado e normalizado.

Exemplo simplificado:

```python
es.indices.create(
    index="produtos_pt",
    settings={
        "analysis": {
            "analyzer": {
                "pt_analyzer": {
                    "tokenizer": "standard",
                    "filter": ["lowercase", "asciifolding"],
                }
            }
        }
    },
    mappings={
        "properties": {
            "nome": {"type": "text", "analyzer": "pt_analyzer"}
        }
    },
)
```

Analyzer correto melhora muito a qualidade da busca.

---

## Nested Objects

Arrays de objetos podem exigir `nested`.

```python
es.indices.create(
    index="pedidos",
    mappings={
        "properties": {
            "itens": {
                "type": "nested",
                "properties": {
                    "produto": {"type": "keyword"},
                    "quantidade": {"type": "integer"},
                },
            }
        }
    },
)
```

Consulta nested:

```python
es.search(
    index="pedidos",
    query={
        "nested": {
            "path": "itens",
            "query": {
                "bool": {
                    "must": [
                        {"term": {"itens.produto": "teclado"}},
                        {"range": {"itens.quantidade": {"gte": 2}}},
                    ]
                }
            },
        }
    },
)
```

---

## Sincronização com Banco Primário

Estratégias:

- indexar no mesmo fluxo da escrita;
- publicar evento e indexar assíncrono;
- usar outbox pattern;
- reindexação periódica;
- CDC com Debezium/Kafka.

Evite depender do Elasticsearch como fonte única para dados transacionais críticos.

---

## Checklist Profissional

- Elasticsearch é índice de leitura ou fonte primária?
- mappings foram definidos explicitamente?
- campos de filtro usam `keyword`?
- busca textual usa analyzer adequado?
- há alias para reindex sem downtime?
- bulk é usado em cargas grandes?
- paginação profunda evita `from` alto?
- sincronização com fonte primária é confiável?
- cluster tem shards e replicas adequados?
- queries lentas e uso de heap são monitorados?

