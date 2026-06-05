# MongoDB: Documentos, Modelagem e PyMongo

MongoDB é um banco NoSQL orientado a documentos. Ele armazena dados em documentos BSON, normalmente manipulados como dicionários Python. É adequado para agregados flexíveis, estruturas aninhadas e aplicações em que o documento representa uma unidade natural de leitura e escrita.

MongoDB não elimina modelagem. A modelagem é orientada aos padrões de acesso: quais telas, APIs e consultas precisam ser rápidas e consistentes.

---

## Instalação

```bash
pip install pymongo
```

Driver async:

```bash
pip install motor
```

---

## Conexão com PyMongo

```python
from pymongo import MongoClient


client = MongoClient("mongodb://localhost:27017")
db = client["loja"]
clientes = db["clientes"]
```

Em produção, configure:

- autenticação;
- TLS;
- timeout;
- pool;
- replica set;
- string de conexão via variável de ambiente.

---

## Documento Básico

```python
cliente = {
    "nome": "Ana Souza",
    "email": "ana@example.com",
    "enderecos": [
        {"tipo": "entrega", "cidade": "São Paulo", "uf": "SP"}
    ],
    "ativo": True,
}

resultado = clientes.insert_one(cliente)
print(resultado.inserted_id)
```

---

## CRUD

Create:

```python
clientes.insert_one({"nome": "Bruno", "email": "bruno@example.com"})
```

Read:

```python
cliente = clientes.find_one({"email": "bruno@example.com"})
```

Update:

```python
clientes.update_one(
    {"email": "bruno@example.com"},
    {"$set": {"nome": "Bruno Lima"}}
)
```

Delete:

```python
clientes.delete_one({"email": "bruno@example.com"})
```

Soft delete:

```python
clientes.update_one(
    {"email": "bruno@example.com"},
    {"$set": {"ativo": False}}
)
```

---

## Filtros

```python
list(clientes.find({"ativo": True}))
list(clientes.find({"idade": {"$gte": 18}}))
list(clientes.find({"nome": {"$regex": "^Ana", "$options": "i"}}))
list(clientes.find({"enderecos.uf": "SP"}))
```

Projeção:

```python
clientes.find_one(
    {"email": "ana@example.com"},
    {"nome": 1, "email": 1, "_id": 0}
)
```

---

## Índices

```python
clientes.create_index("email", unique=True)
clientes.create_index([("ativo", 1), ("nome", 1)])
```

Índice TTL:

```python
db.sessoes.create_index("expira_em", expireAfterSeconds=0)
```

Analise plano:

```python
clientes.find({"email": "ana@example.com"}).explain()
```

---

## Embedding vs Referencing

Embedding:

```json
{
  "cliente_id": 10,
  "itens": [
    {"produto_id": 1, "nome": "Teclado", "quantidade": 2}
  ]
}
```

Bom quando:

- os dados são lidos juntos;
- o agregado tem tamanho controlado;
- atualizações ocorrem no mesmo contexto;
- consistência local é importante.

Referencing:

```json
{
  "cliente_id": 10,
  "produto_ids": [1, 2, 3]
}
```

Bom quando:

- documento ficaria grande demais;
- entidade é compartilhada;
- dados mudam independentemente;
- cardinalidade é alta.

---

## Limite de Documento

MongoDB tem limite de tamanho por documento. Mesmo sem bater o limite, arrays que crescem indefinidamente são problema.

Evite:

```json
{
  "usuario": "ana",
  "eventos": ["evento1", "evento2", "... milhões de eventos"]
}
```

Prefira coleção separada para eventos grandes.

---

## Aggregation Pipeline

```python
pipeline = [
    {"$match": {"status": "pago"}},
    {"$group": {
        "_id": "$cliente_id",
        "total_gasto": {"$sum": "$total"},
        "pedidos": {"$sum": 1},
    }},
    {"$sort": {"total_gasto": -1}},
    {"$limit": 20},
]

resultado = list(db.pedidos.aggregate(pipeline))
```

Pipeline é uma das partes mais poderosas do MongoDB.

---

## Transações

Transações existem em replica sets e clusters.

```python
with client.start_session() as session:
    with session.start_transaction():
        db.pedidos.insert_one({"cliente_id": 1, "total": 100}, session=session)
        db.clientes.update_one(
            {"_id": 1},
            {"$inc": {"total_pedidos": 1}},
            session=session,
        )
```

Use transações quando necessário, mas modele agregados para reduzir dependência de transações distribuídas.

---

## Validação de Schema

```python
db.create_collection(
    "produtos",
    validator={
        "$jsonSchema": {
            "bsonType": "object",
            "required": ["nome", "sku", "preco"],
            "properties": {
                "nome": {"bsonType": "string"},
                "sku": {"bsonType": "string"},
                "preco": {"bsonType": "decimal"},
            },
        }
    },
)
```

MongoDB é flexível, mas produção precisa de contratos.

---

## Motor Async

```python
from motor.motor_asyncio import AsyncIOMotorClient


client = AsyncIOMotorClient("mongodb://localhost:27017")
db = client["loja"]


async def buscar_cliente(email: str):
    return await db.clientes.find_one({"email": email})
```

Use em aplicações async como FastAPI.

---

## Checklist Profissional

- o documento reflete um agregado real?
- arrays têm crescimento controlado?
- índices cobrem consultas críticas?
- há unique index para chaves de negócio?
- schema validation foi considerado?
- projeções evitam trafegar campos grandes?
- agregações foram testadas com volume real?
- transações são necessárias ou o modelo pode evitar?
- backups e replica set estão configurados?
- dados sensíveis são protegidos?

