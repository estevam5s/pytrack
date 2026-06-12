# Cassandra: Dados Distribuídos, Particionamento e Alta Escala

Apache Cassandra é um banco NoSQL distribuído, orientado a alta disponibilidade, escrita em larga escala e tolerância a falhas. Ele é usado quando dados precisam ser distribuídos por vários nós e data centers com baixa latência de escrita.

Cassandra exige modelagem orientada a consultas. Diferente de bancos relacionais, você não modela primeiro entidades normalizadas para depois consultar de qualquer forma. Você começa pelas consultas e desenha tabelas para respondê-las.

---

## Quando Usar Cassandra

Use quando:

- volume de escrita é muito alto;
- disponibilidade é mais importante que joins;
- dados são distribuídos por chave;
- consultas são previsíveis;
- escala horizontal é requisito central;
- o sistema tolera consistência configurável.

Evite quando:

- precisa de joins ad hoc;
- precisa de transações complexas;
- consultas mudam o tempo todo;
- equipe não entende particionamento;
- volume não justifica complexidade operacional.

---

## Instalação do Driver

```bash
pip install cassandra-driver
```

Conexão:

```python
from cassandra.cluster import Cluster


cluster = Cluster(["127.0.0.1"])
session = cluster.connect()
```

---

## Keyspace

```sql
CREATE KEYSPACE loja
WITH replication = {
    'class': 'SimpleStrategy',
    'replication_factor': 3
};
```

Em produção multi-datacenter, use `NetworkTopologyStrategy`.

```sql
CREATE KEYSPACE loja
WITH replication = {
    'class': 'NetworkTopologyStrategy',
    'dc1': 3,
    'dc2': 3
};
```

---

## Tabela Orientada a Consulta

Consulta desejada: listar pedidos de um cliente por data.

```sql
CREATE TABLE pedidos_por_cliente (
    cliente_id UUID,
    criado_em TIMESTAMP,
    pedido_id UUID,
    status TEXT,
    total DECIMAL,
    PRIMARY KEY (cliente_id, criado_em, pedido_id)
) WITH CLUSTERING ORDER BY (criado_em DESC);
```

Aqui:

- `cliente_id` é partition key;
- `criado_em` e `pedido_id` são clustering columns;
- a tabela responde uma consulta específica.

Consulta:

```sql
SELECT *
FROM pedidos_por_cliente
WHERE cliente_id = ?;
```

---

## Partition Key

A partition key define onde os dados ficam no cluster.

Boa partition key:

- distribui bem os dados;
- evita partições gigantes;
- combina com consultas;
- permite leituras eficientes.

Má partition key:

- concentra dados em poucos nós;
- cria hot partitions;
- gera partições enormes;
- força `ALLOW FILTERING`.

---

## Clustering Columns

Clustering columns ordenam dados dentro da partição.

```sql
PRIMARY KEY ((cliente_id), criado_em, pedido_id)
```

Parênteses duplos deixam claro que `cliente_id` é a partition key. As demais colunas ordenam dentro da partição.

---

## Inserts com Python

```python
from uuid import uuid4
from decimal import Decimal
from datetime import datetime, timezone


session.set_keyspace("loja")

stmt = session.prepare("""
    INSERT INTO pedidos_por_cliente
    (cliente_id, criado_em, pedido_id, status, total)
    VALUES (?, ?, ?, ?, ?)
""")

session.execute(stmt, (
    uuid4(),
    datetime.now(timezone.utc),
    uuid4(),
    "pago",
    Decimal("199.90"),
))
```

Prepared statements melhoram segurança e performance.

---

## Consultas

```python
stmt = session.prepare("""
    SELECT pedido_id, criado_em, status, total
    FROM pedidos_por_cliente
    WHERE cliente_id = ?
    LIMIT 20
""")

rows = session.execute(stmt, (cliente_id,))
for row in rows:
    print(row.pedido_id, row.total)
```

Evite consultas que não usam partition key.

---

## Denormalização Planejada

Se também precisa consultar pedido por status, crie outra tabela:

```sql
CREATE TABLE pedidos_por_status (
    status TEXT,
    criado_em TIMESTAMP,
    pedido_id UUID,
    cliente_id UUID,
    total DECIMAL,
    PRIMARY KEY (status, criado_em, pedido_id)
) WITH CLUSTERING ORDER BY (criado_em DESC);
```

Você grava o mesmo evento em mais de uma tabela. Isso é normal em Cassandra.

---

## Batch

Batch em Cassandra não é otimização genérica. Use para manter múltiplas escritas relacionadas, preferencialmente na mesma partition.

```sql
BEGIN BATCH
INSERT INTO pedidos_por_cliente (...) VALUES (...);
INSERT INTO pedidos_por_status (...) VALUES (...);
APPLY BATCH;
```

Batches grandes e multi-partition podem prejudicar o cluster.

---

## Consistency Level

```python
from cassandra import ConsistencyLevel


stmt = session.prepare("SELECT * FROM pedidos_por_cliente WHERE cliente_id = ?")
stmt.consistency_level = ConsistencyLevel.QUORUM
```

Níveis comuns:

- `ONE`: menor latência, menor consistência.
- `QUORUM`: equilíbrio comum.
- `LOCAL_QUORUM`: comum em multi-datacenter.
- `ALL`: mais forte, menos disponível.

---

## Lightweight Transactions

```sql
INSERT INTO usuarios (email, usuario_id)
VALUES ('ana@example.com', 123)
IF NOT EXISTS;
```

LWT usa Paxos e é mais caro. Use com moderação para casos como unicidade.

---

## TTL

```sql
INSERT INTO sessoes (usuario_id, token, criado_em)
VALUES (?, ?, ?)
USING TTL 3600;
```

TTL é útil para dados temporários, mas muitos deletes por TTL geram tombstones.

---

## Tombstones

Deletes e TTLs criam tombstones. Muitos tombstones degradam leituras.

Cuidados:

- não abuse de TTL em grande escala sem medir;
- evite deletes massivos;
- modele partições com tamanho controlado;
- monitore compactação;
- revise padrões de leitura.

---

## Checklist de Modelagem Cassandra

- quais consultas precisam ser respondidas?
- cada consulta tem tabela própria?
- partition key distribui bem?
- partições têm tamanho controlado?
- clustering order atende ordenação?
- não há dependência de joins?
- `ALLOW FILTERING` foi evitado?
- consistência foi escolhida por caso de uso?
- denormalização tem estratégia de escrita?
- tombstones são monitorados?

