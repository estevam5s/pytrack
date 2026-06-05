# Consultas Avançadas: JOINs, Agregações, Subqueries e Índices

Consultas avançadas são o ponto em que SQL deixa de ser apenas CRUD e vira ferramenta analítica e operacional. Dominar JOINs, agregações, subqueries, índices e planos de execução permite resolver problemas reais com eficiência.

---

## JOIN

JOIN combina linhas de tabelas relacionadas.

### INNER JOIN

Retorna apenas registros com correspondência nos dois lados:

```sql
SELECT
    f.nome,
    d.nome AS departamento
FROM funcionarios f
INNER JOIN departamentos d ON d.id = f.departamento_id;
```

### LEFT JOIN

Retorna todos os registros da esquerda, mesmo sem correspondência:

```sql
SELECT
    f.nome,
    d.nome AS departamento
FROM funcionarios f
LEFT JOIN departamentos d ON d.id = f.departamento_id;
```

Use `LEFT JOIN` quando ausência de relacionamento também importa.

---

## JOIN com Agregação

Total de vendas por funcionário:

```sql
SELECT
    f.id,
    f.nome,
    COUNT(v.id) AS total_vendas,
    COALESCE(SUM(v.valor), 0) AS valor_total
FROM funcionarios f
LEFT JOIN vendas v ON v.funcionario_id = f.id
GROUP BY f.id, f.nome
ORDER BY valor_total DESC;
```

`COALESCE` transforma `NULL` em zero quando não há vendas.

---

## Filtros em JOIN

Cuidado com filtro em `WHERE` após `LEFT JOIN`:

```sql
SELECT f.nome, v.valor
FROM funcionarios f
LEFT JOIN vendas v ON v.funcionario_id = f.id
WHERE v.data_venda >= '2024-01-01';
```

Esse `WHERE` elimina linhas sem venda e pode transformar o resultado em comportamento de `INNER JOIN`.

Quando a intenção é manter funcionários sem vendas:

```sql
SELECT f.nome, v.valor
FROM funcionarios f
LEFT JOIN vendas v
    ON v.funcionario_id = f.id
   AND v.data_venda >= '2024-01-01';
```

---

## CASE WHEN

Classificação de salário:

```sql
SELECT
    nome,
    salario,
    CASE
        WHEN salario >= 10000 THEN 'Senior'
        WHEN salario >= 6000 THEN 'Pleno'
        ELSE 'Junior'
    END AS nivel
FROM funcionarios;
```

Agregação condicional:

```sql
SELECT
    COUNT(*) AS total,
    SUM(CASE WHEN ativo = TRUE THEN 1 ELSE 0 END) AS ativos,
    SUM(CASE WHEN ativo = FALSE THEN 1 ELSE 0 END) AS inativos
FROM funcionarios;
```

---

## Subqueries

Funcionários acima da média:

```sql
SELECT nome, salario
FROM funcionarios
WHERE salario > (
    SELECT AVG(salario)
    FROM funcionarios
);
```

Subquery correlacionada:

```sql
SELECT
    f.nome,
    (
        SELECT COUNT(*)
        FROM vendas v
        WHERE v.funcionario_id = f.id
    ) AS total_vendas
FROM funcionarios f;
```

Subqueries correlacionadas podem ficar caras em tabelas grandes. Compare com JOIN e agregação.

---

## EXISTS

Funcionários que possuem vendas:

```sql
SELECT f.nome
FROM funcionarios f
WHERE EXISTS (
    SELECT 1
    FROM vendas v
    WHERE v.funcionario_id = f.id
);
```

`EXISTS` é útil quando você só quer saber se existe ao menos uma linha relacionada.

---

## CTE

Common Table Expression melhora legibilidade:

```sql
WITH vendas_por_funcionario AS (
    SELECT
        funcionario_id,
        COUNT(*) AS total_vendas,
        SUM(valor) AS valor_total
    FROM vendas
    GROUP BY funcionario_id
)
SELECT
    f.nome,
    COALESCE(vpf.total_vendas, 0) AS total_vendas,
    COALESCE(vpf.valor_total, 0) AS valor_total
FROM funcionarios f
LEFT JOIN vendas_por_funcionario vpf
    ON vpf.funcionario_id = f.id;
```

Use CTE para separar etapas lógicas de uma query complexa.

---

## Window Functions

Ranking de funcionários por salário dentro do departamento:

```sql
SELECT
    nome,
    departamento_id,
    salario,
    RANK() OVER (
        PARTITION BY departamento_id
        ORDER BY salario DESC
    ) AS ranking_departamento
FROM funcionarios;
```

Soma acumulada de vendas:

```sql
SELECT
    data_venda,
    valor,
    SUM(valor) OVER (
        ORDER BY data_venda
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS acumulado
FROM vendas;
```

Window functions evitam muitas subqueries e são essenciais para análises avançadas.

---

## Índices

Índice acelera busca e ordenação, mas tem custo de escrita e armazenamento.

Criar índice:

```sql
CREATE INDEX idx_funcionarios_departamento
ON funcionarios(departamento_id);
```

Índice composto:

```sql
CREATE INDEX idx_vendas_funcionario_data
ON vendas(funcionario_id, data_venda);
```

Ordem importa. Um índice `(funcionario_id, data_venda)` ajuda filtros por `funcionario_id` e por `funcionario_id + data_venda`, mas não necessariamente por `data_venda` sozinho.

---

## EXPLAIN

Use `EXPLAIN` para entender plano de execução:

```sql
EXPLAIN
SELECT
    f.nome,
    SUM(v.valor) AS total
FROM funcionarios f
JOIN vendas v ON v.funcionario_id = f.id
WHERE v.data_venda >= '2024-01-01'
GROUP BY f.id, f.nome;
```

Observe:

- tabela lida;
- tipo de acesso;
- índice usado;
- quantidade estimada de linhas;
- filtros;
- ordenação temporária;
- full table scan.

---

## Problemas Clássicos de Performance

- `SELECT *` em tabela larga;
- falta de índice em foreign key;
- filtro com função na coluna indexada;
- `LIKE '%texto%'`;
- `OFFSET` alto;
- N+1 queries;
- JOIN sem condição correta;
- índice demais atrapalhando escrita;
- cardinalidade ruim;
- estatísticas desatualizadas.

Exemplo ruim:

```sql
SELECT *
FROM vendas
WHERE YEAR(data_venda) = 2024;
```

Melhor:

```sql
SELECT *
FROM vendas
WHERE data_venda >= '2024-01-01'
  AND data_venda < '2025-01-01';
```

---

## Paginação Avançada

OFFSET:

```sql
SELECT id, nome
FROM funcionarios
ORDER BY id
LIMIT 20 OFFSET 10000;
```

Pode ficar lento porque o banco pula muitas linhas.

Keyset pagination:

```sql
SELECT id, nome
FROM funcionarios
WHERE id > 10000
ORDER BY id
LIMIT 20;
```

É mais eficiente para scroll e APIs de listagem.

---

## Checklist Avançado

- Você sabe escolher entre `INNER JOIN` e `LEFT JOIN`?
- Entende impacto de filtros no `ON` vs `WHERE`?
- Usa CTE para queries complexas?
- Conhece window functions?
- Cria índices baseados em queries reais?
- Usa `EXPLAIN` antes de otimizar no escuro?
- Evita `OFFSET` alto em grandes volumes?
- Sabe identificar N+1?
- Mede antes e depois da otimização?

SQL avançado exige leitura crítica do plano de execução e entendimento do modelo de dados. A query correta deve ser clara, correta e eficiente.

