# ORMs e NoSQL com Python

Trilha completa e profissional para trabalhar com ORMs relacionais e bancos NoSQL em Python. O foco é sair do uso básico até práticas avançadas de modelagem, consultas, performance, transações, migrações, integração com aplicações e operação em produção.

---

## Arquivos da Trilha

### ORMs

1. [SQLAlchemy: Core, ORM, Sessions e Arquitetura](./01_sqlalchemy.md)
2. [Django ORM: Models, QuerySets, Migrations e Performance](./02_django_orm.md)
3. [Tortoise ORM: Async ORM para APIs Modernas](./03_tortoise_orm.md)
4. [Peewee: ORM Leve, Simples e Poderoso](./04_peewee.md)

### NoSQL

5. [MongoDB: Documentos, Modelagem e PyMongo](./05_mongodb.md)
6. [Redis: Cache, Filas, Locks e Estruturas em Memória](./06_redis.md)
7. [Cassandra: Dados Distribuídos, Particionamento e Alta Escala](./07_cassandra.md)
8. [Elasticsearch: Busca, Índices, Relevância e Observabilidade](./08_elasticsearch.md)

---

## Competências Esperadas

Ao concluir esta trilha, você deve saber:

- escolher entre SQL direto, ORM e NoSQL com critério;
- modelar entidades em SQLAlchemy, Django ORM, Tortoise e Peewee;
- controlar sessions, conexões, transações e migrações;
- evitar N+1 queries e consultas ineficientes;
- usar índices e constraints sem depender apenas do ORM;
- modelar documentos no MongoDB;
- usar Redis para cache, filas, rate limit e locks;
- modelar dados em Cassandra orientado a consultas;
- indexar e consultar dados no Elasticsearch;
- aplicar boas práticas de produção, segurança e observabilidade.

---

## Quando Usar ORM

Use ORM quando:

- a aplicação tem domínio rico;
- você precisa mapear tabelas para objetos;
- quer composição segura de consultas;
- precisa de migrations integradas;
- quer reduzir SQL repetitivo.

Evite usar ORM sem entender SQL. ORM não substitui conhecimento de joins, índices, transações e planos de execução.

---

## Quando Usar NoSQL

Use NoSQL quando o modelo e o caso de uso justificam:

- documentos flexíveis e agregados naturais: MongoDB;
- baixa latência, cache e estruturas temporárias: Redis;
- escrita distribuída em alta escala: Cassandra;
- busca textual, filtros e ranking: Elasticsearch.

NoSQL não é "banco sem modelagem". Geralmente exige modelagem ainda mais cuidadosa, orientada aos padrões de acesso.

