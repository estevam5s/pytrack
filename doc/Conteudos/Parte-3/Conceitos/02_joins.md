# Joins: Relacionando Dados com SQL

Joins combinam linhas de duas ou mais tabelas com base em uma relação. Eles são essenciais em bancos relacionais porque dados bem modelados ficam distribuídos em tabelas diferentes para reduzir redundância e preservar integridade.

Dominar joins significa entender cardinalidade, chaves, duplicação, filtros, agregações e planos de execução.

---

## Modelo Base

```sql
CREATE TABLE clientes (
    id BIGINT PRIMARY KEY,
    nome VARCHAR(120) NOT NULL
);

CREATE TABLE pedidos (
    id BIGINT PRIMARY KEY,
    cliente_id BIGINT NOT NULL REFERENCES clientes(id),
    total NUMERIC(12, 2) NOT NULL
);
```

---

## INNER JOIN

Retorna apenas registros com correspondência dos dois lados.

```sql
SELECT
    c.id AS cliente_id,
    c.nome,
    p.id AS pedido_id,
    p.total
FROM clientes c
INNER JOIN pedidos p ON p.cliente_id = c.id;
```

Se um cliente não tem pedido, ele não aparece.

---

## LEFT JOIN

Retorna todos os registros da tabela da esquerda e os correspondentes da direita.

```sql
SELECT
    c.id,
    c.nome,
    p.id AS pedido_id,
    p.total
FROM clientes c
LEFT JOIN pedidos p ON p.cliente_id = c.id;
```

Clientes sem pedido aparecem com colunas de pedido como `NULL`.

---

## RIGHT JOIN e FULL JOIN

`RIGHT JOIN` preserva todos os registros da direita:

```sql
SELECT c.nome, p.id AS pedido_id
FROM clientes c
RIGHT JOIN pedidos p ON p.cliente_id = c.id;
```

`FULL JOIN` preserva ambos os lados:

```sql
SELECT c.nome, p.id AS pedido_id
FROM clientes c
FULL JOIN pedidos p ON p.cliente_id = c.id;
```

Na prática, `LEFT JOIN` costuma ser mais usado porque mantém a leitura mais previsível.

---

## CROSS JOIN

Gera produto cartesiano: cada linha de uma tabela combina com cada linha da outra.

```sql
SELECT c.nome, d.dia
FROM clientes c
CROSS JOIN dias_calendario d;
```

Use com cuidado. Se uma tabela tem 1.000 linhas e outra tem 1.000, o resultado terá 1.000.000 linhas.

---

## Self Join

Uma tabela se relacionando com ela mesma.

```sql
CREATE TABLE funcionarios (
    id BIGINT PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    gestor_id BIGINT REFERENCES funcionarios(id)
);

SELECT
    f.nome AS funcionario,
    g.nome AS gestor
FROM funcionarios f
LEFT JOIN funcionarios g ON g.id = f.gestor_id;
```

---

## Cardinalidade

Antes de escrever o join, entenda a relação:

- **1:1**: um usuário tem um perfil.
- **1:N**: um cliente tem muitos pedidos.
- **N:N**: alunos e cursos por meio de matrícula.

Exemplo N:N:

```sql
CREATE TABLE alunos (
    id BIGINT PRIMARY KEY,
    nome VARCHAR(120) NOT NULL
);

CREATE TABLE cursos (
    id BIGINT PRIMARY KEY,
    nome VARCHAR(120) NOT NULL
);

CREATE TABLE matriculas (
    aluno_id BIGINT REFERENCES alunos(id),
    curso_id BIGINT REFERENCES cursos(id),
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (aluno_id, curso_id)
);
```

Consulta:

```sql
SELECT a.nome AS aluno, c.nome AS curso
FROM matriculas m
JOIN alunos a ON a.id = m.aluno_id
JOIN cursos c ON c.id = m.curso_id;
```

---

## Duplicação Acidental

Se um cliente tem três pedidos, o join gera três linhas para esse cliente.

```sql
SELECT c.id, c.nome, p.id AS pedido_id
FROM clientes c
JOIN pedidos p ON p.cliente_id = c.id;
```

Isso não é erro. É consequência da cardinalidade. O erro aparece quando você esperava uma linha por cliente.

Para uma linha por cliente:

```sql
SELECT
    c.id,
    c.nome,
    COUNT(p.id) AS quantidade_pedidos,
    COALESCE(SUM(p.total), 0) AS total_gasto
FROM clientes c
LEFT JOIN pedidos p ON p.cliente_id = c.id
GROUP BY c.id, c.nome;
```

---

## Filtro no ON vs WHERE

Com `LEFT JOIN`, colocar filtro no lugar errado muda o resultado.

Preserva clientes sem pedidos pagos:

```sql
SELECT c.nome, p.id
FROM clientes c
LEFT JOIN pedidos p
    ON p.cliente_id = c.id
   AND p.status = 'pago';
```

Transforma na prática em `INNER JOIN`:

```sql
SELECT c.nome, p.id
FROM clientes c
LEFT JOIN pedidos p ON p.cliente_id = c.id
WHERE p.status = 'pago';
```

O `WHERE p.status = 'pago'` remove linhas em que `p.status` é `NULL`.

---

## Anti Join: Registros sem Correspondência

Clientes sem pedidos:

```sql
SELECT c.id, c.nome
FROM clientes c
LEFT JOIN pedidos p ON p.cliente_id = c.id
WHERE p.id IS NULL;
```

Alternativa com `NOT EXISTS`:

```sql
SELECT c.id, c.nome
FROM clientes c
WHERE NOT EXISTS (
    SELECT 1
    FROM pedidos p
    WHERE p.cliente_id = c.id
);
```

`NOT EXISTS` costuma ser mais claro e robusto em consultas complexas.

---

## Semi Join: Existe Correspondência

Clientes com pelo menos um pedido:

```sql
SELECT c.id, c.nome
FROM clientes c
WHERE EXISTS (
    SELECT 1
    FROM pedidos p
    WHERE p.cliente_id = c.id
);
```

Isso evita duplicação de clientes.

---

## Joins com Agregações

Total por cliente:

```sql
SELECT
    c.id,
    c.nome,
    COUNT(p.id) AS pedidos,
    SUM(p.total) AS total
FROM clientes c
LEFT JOIN pedidos p ON p.cliente_id = c.id
GROUP BY c.id, c.nome
ORDER BY total DESC NULLS LAST;
```

Se o cliente não tem pedido, `SUM` retorna `NULL`. Use `COALESCE` se precisar de zero.

---

## CTE para Clareza

```sql
WITH pedidos_por_cliente AS (
    SELECT
        cliente_id,
        COUNT(*) AS quantidade,
        SUM(total) AS total
    FROM pedidos
    GROUP BY cliente_id
)
SELECT
    c.id,
    c.nome,
    COALESCE(ppc.quantidade, 0) AS quantidade,
    COALESCE(ppc.total, 0) AS total
FROM clientes c
LEFT JOIN pedidos_por_cliente ppc ON ppc.cliente_id = c.id;
```

CTEs ajudam a separar etapas lógicas.

---

## LATERAL JOIN

Útil para buscar, por exemplo, o último pedido de cada cliente.

```sql
SELECT
    c.id,
    c.nome,
    ultimo.id AS ultimo_pedido_id,
    ultimo.total
FROM clientes c
LEFT JOIN LATERAL (
    SELECT p.id, p.total
    FROM pedidos p
    WHERE p.cliente_id = c.id
    ORDER BY p.criado_em DESC
    LIMIT 1
) ultimo ON TRUE;
```

`LATERAL` permite que a subconsulta use colunas da linha atual da tabela externa.

---

## Performance de Joins

Para joins performáticos:

- chaves estrangeiras devem ter índices quando usadas em filtros e joins;
- evite funções no lado da coluna relacionada;
- filtre cedo quando possível;
- entenda cardinalidade;
- use `EXPLAIN` para ver o plano;
- selecione apenas colunas necessárias;
- cuidado com joins em tabelas gigantes sem restrição.

Exemplo de índice:

```sql
CREATE INDEX idx_pedidos_cliente_id ON pedidos (cliente_id);
```

---

## Checklist de Joins

- A cardinalidade esperada está clara?
- O join pode multiplicar linhas?
- O filtro pertence ao `ON` ou ao `WHERE`?
- Um `EXISTS` seria melhor do que `JOIN`?
- O resultado precisa de uma linha por entidade?
- As foreign keys têm índices adequados?
- A consulta seleciona apenas colunas necessárias?
- O plano de execução confirma a estratégia esperada?

