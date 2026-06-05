# Conceitos Fundamentais e Avançados de Banco de Dados

Trilha completa para dominar conceitos essenciais de bancos de dados relacionais: CRUD, joins, índices, transações, procedures, views, normalização e modelagem.

O objetivo é sair do básico operacional, como criar registros e consultar tabelas, até um nível profissional: desenhar modelos consistentes, escrever consultas eficientes, entender concorrência, preservar integridade, otimizar performance e tomar decisões arquiteturais.

---

## Arquivos da Trilha

1. [CRUD: Create, Read, Update e Delete](./01_crud.md)
2. [Joins: Relacionando Dados com SQL](./02_joins.md)
3. [Índices: Performance, Estratégia e Armadilhas](./03_indices.md)
4. [Transactions: ACID, Concorrência e Consistência](./04_transactions.md)
5. [Procedures: Rotinas no Banco de Dados](./05_procedures.md)
6. [Views: Consultas Reutilizáveis e Camadas de Leitura](./06_views.md)
7. [Normalização: Integridade, Redundância e Formas Normais](./07_normalizacao.md)
8. [Modelagem: Do Domínio ao Schema Profissional](./08_modelagem.md)

---

## Competências Esperadas

Ao concluir esta trilha, você deve saber:

- criar, consultar, atualizar e excluir dados com segurança;
- escrever joins corretos e evitar duplicações acidentais;
- usar índices para acelerar consultas sem degradar escrita;
- controlar transações e entender isolamento;
- avaliar quando usar procedures, functions, triggers e lógica na aplicação;
- criar views úteis para leitura, segurança e simplificação;
- normalizar modelos e reconhecer quando desnormalizar;
- transformar requisitos de negócio em modelo conceitual, lógico e físico;
- analisar planos de execução e gargalos;
- projetar schemas consistentes, performáticos e evolutivos.

---

## Banco de Referência dos Exemplos

Os exemplos usam SQL genérico com foco em PostgreSQL, mas os conceitos se aplicam a MySQL, SQL Server, Oracle e SQLite com pequenas adaptações.

Modelo usado em vários exemplos:

```sql
CREATE TABLE clientes (
    id BIGINT PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL UNIQUE,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pedidos (
    id BIGINT PRIMARY KEY,
    cliente_id BIGINT NOT NULL REFERENCES clientes(id),
    status VARCHAR(30) NOT NULL,
    total NUMERIC(12, 2) NOT NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE itens_pedido (
    id BIGINT PRIMARY KEY,
    pedido_id BIGINT NOT NULL REFERENCES pedidos(id),
    produto_id BIGINT NOT NULL,
    quantidade INTEGER NOT NULL,
    preco_unitario NUMERIC(12, 2) NOT NULL
);
```

---

## Ordem Recomendada

Comece por CRUD, joins e modelagem básica. Depois avance para índices, transações e normalização. Por fim, estude views e procedures como ferramentas de organização, performance, governança e encapsulamento.

