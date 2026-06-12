# Fundamentos SQL: DDL, DML, Consultas e Modelagem Inicial

SQL, Structured Query Language, é a linguagem padrão para trabalhar com bancos de dados relacionais. Com SQL você cria estruturas, insere dados, consulta informações, atualiza registros, remove dados e controla transações.

Em aplicações Python, SQL aparece diretamente com drivers, indiretamente por ORMs como SQLAlchemy/Django ORM e em tarefas de análise, integração, relatórios e automação.

---

## Categorias da Linguagem SQL

- **DDL**: define estrutura. Exemplos: `CREATE`, `ALTER`, `DROP`.
- **DML**: manipula dados. Exemplos: `INSERT`, `UPDATE`, `DELETE`.
- **DQL**: consulta dados. Exemplo: `SELECT`.
- **DCL**: controla permissões. Exemplos: `GRANT`, `REVOKE`.
- **TCL**: controla transações. Exemplos: `BEGIN`, `COMMIT`, `ROLLBACK`.

Saber essa divisão ajuda a entender impacto: criar tabela é diferente de consultar, e atualizar dados em produção exige mais cuidado que rodar um `SELECT`.

---

## Banco de Exemplo

Usaremos um domínio simples de empresa:

```text
empresa
├── departamentos
├── funcionarios
└── vendas
```

Criação do banco:

```sql
CREATE DATABASE IF NOT EXISTS empresa;
USE empresa;
```

---

## Criando Tabelas

```sql
CREATE TABLE departamentos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL UNIQUE,
    orcamento DECIMAL(12, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Tabela de funcionários:

```sql
CREATE TABLE funcionarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    departamento_id INT,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    cargo VARCHAR(80),
    salario DECIMAL(10, 2) NOT NULL,
    data_contratacao DATE NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_funcionarios_departamentos
        FOREIGN KEY (departamento_id) REFERENCES departamentos(id)
);
```

Tabela de vendas:

```sql
CREATE TABLE vendas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    funcionario_id INT NOT NULL,
    produto VARCHAR(120) NOT NULL,
    quantidade INT NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    data_venda DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_vendas_funcionarios
        FOREIGN KEY (funcionario_id) REFERENCES funcionarios(id)
);
```

---

## Tipos de Dados Importantes

- `INT`: inteiro.
- `BIGINT`: inteiro maior.
- `VARCHAR(n)`: texto com limite.
- `TEXT`: texto longo.
- `DECIMAL(p, s)`: número decimal exato, ideal para dinheiro.
- `FLOAT/DOUBLE`: ponto flutuante, evite para valores financeiros.
- `DATE`: data.
- `DATETIME`: data e hora.
- `TIMESTAMP`: data e hora com comportamento específico do banco.
- `BOOLEAN`: verdadeiro/falso, em MySQL geralmente tratado como `TINYINT(1)`.
- `JSON`: documento JSON, útil com moderação.

Para dinheiro, use `DECIMAL`, não `FLOAT`.

---

## Constraints

Constraints protegem integridade.

```sql
PRIMARY KEY
UNIQUE
NOT NULL
DEFAULT
FOREIGN KEY
CHECK
```

Exemplo:

```sql
CREATE TABLE produtos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    estoque INT NOT NULL DEFAULT 0,
    CONSTRAINT chk_preco_positivo CHECK (preco >= 0),
    CONSTRAINT chk_estoque_positivo CHECK (estoque >= 0)
);
```

Validação no banco complementa validação da aplicação. Não confie apenas no backend.

---

## ALTER TABLE

Adicionar coluna:

```sql
ALTER TABLE funcionarios ADD COLUMN telefone VARCHAR(20);
```

Modificar coluna:

```sql
ALTER TABLE funcionarios MODIFY COLUMN nome VARCHAR(200) NOT NULL;
```

Remover coluna:

```sql
ALTER TABLE funcionarios DROP COLUMN telefone;
```

Em produção, `ALTER TABLE` pode bloquear tabela, demorar e quebrar versões antigas da aplicação. Mudanças de schema devem passar por migrations.

---

## INSERT

Inserção simples:

```sql
INSERT INTO departamentos (nome, orcamento)
VALUES ('TI', 250000.00);
```

Inserção múltipla:

```sql
INSERT INTO departamentos (nome, orcamento)
VALUES
    ('RH', 120000.00),
    ('Vendas', 300000.00),
    ('Financeiro', 180000.00);
```

Inserindo funcionários:

```sql
INSERT INTO funcionarios
    (departamento_id, nome, email, cargo, salario, data_contratacao)
VALUES
    (1, 'Joao Silva', 'joao@email.com', 'Desenvolvedor', 7000.00, '2023-01-15'),
    (2, 'Maria Santos', 'maria@email.com', 'Analista RH', 5200.00, '2023-02-01'),
    (3, 'Carlos Oliveira', 'carlos@email.com', 'Vendedor', 4500.00, '2023-03-10');
```

---

## SELECT

Selecionar tudo:

```sql
SELECT * FROM funcionarios;
```

Selecionar colunas:

```sql
SELECT nome, email, salario FROM funcionarios;
```

Use `SELECT *` com cuidado. Em produção, prefira colunas explícitas para reduzir tráfego, acoplamento e surpresas quando schema mudar.

---

## WHERE

```sql
SELECT nome, salario
FROM funcionarios
WHERE salario > 5000;
```

Condições compostas:

```sql
SELECT nome, cargo, salario
FROM funcionarios
WHERE ativo = TRUE
  AND salario BETWEEN 5000 AND 9000;
```

Busca textual:

```sql
SELECT nome, email
FROM funcionarios
WHERE nome LIKE '%Silva%';
```

`LIKE '%texto%'` geralmente não usa índice comum de forma eficiente.

---

## ORDER BY e LIMIT

```sql
SELECT nome, salario
FROM funcionarios
ORDER BY salario DESC
LIMIT 5;
```

Paginação simples:

```sql
SELECT id, nome
FROM funcionarios
ORDER BY id
LIMIT 20 OFFSET 40;
```

Para tabelas grandes, paginação com `OFFSET` alto pode ficar lenta. Use keyset pagination quando necessário.

---

## UPDATE

```sql
UPDATE funcionarios
SET salario = salario * 1.10
WHERE departamento_id = 1;
```

Antes de executar `UPDATE` em produção, rode um `SELECT` com o mesmo `WHERE`:

```sql
SELECT id, nome, salario
FROM funcionarios
WHERE departamento_id = 1;
```

Nunca faça `UPDATE` sem `WHERE` a menos que essa seja realmente a intenção.

---

## DELETE

```sql
DELETE FROM funcionarios
WHERE ativo = FALSE;
```

Para dados importantes, considere soft delete:

```sql
UPDATE funcionarios
SET ativo = FALSE
WHERE id = 10;
```

Soft delete preserva histórico, mas exige filtros consistentes.

---

## Agregações Básicas

```sql
SELECT COUNT(*) AS total_funcionarios
FROM funcionarios;
```

```sql
SELECT
    MIN(salario) AS menor_salario,
    MAX(salario) AS maior_salario,
    AVG(salario) AS salario_medio,
    SUM(salario) AS folha_total
FROM funcionarios
WHERE ativo = TRUE;
```

---

## GROUP BY

```sql
SELECT
    departamento_id,
    COUNT(*) AS total,
    AVG(salario) AS salario_medio
FROM funcionarios
GROUP BY departamento_id;
```

`WHERE` filtra linhas antes da agregação. `HAVING` filtra grupos depois da agregação:

```sql
SELECT
    departamento_id,
    COUNT(*) AS total
FROM funcionarios
GROUP BY departamento_id
HAVING COUNT(*) >= 2;
```

---

## NULL

`NULL` significa ausência de valor. Comparação com `NULL` usa `IS NULL`:

```sql
SELECT *
FROM funcionarios
WHERE departamento_id IS NULL;
```

Errado:

```sql
WHERE departamento_id = NULL
```

Use `COALESCE` para valor padrão:

```sql
SELECT nome, COALESCE(cargo, 'Sem cargo') AS cargo
FROM funcionarios;
```

---

## Boas Práticas de Fundamentos

- nomeie tabelas e colunas de forma consistente;
- use `DECIMAL` para dinheiro;
- defina `NOT NULL` quando ausência não fizer sentido;
- crie foreign keys para integridade;
- evite `SELECT *` em código de aplicação;
- teste `UPDATE` e `DELETE` com `SELECT` antes;
- use transações para mudanças relacionadas;
- documente decisões de modelagem;
- prefira migrations versionadas.

---

## Checklist

- Você sabe criar banco e tabelas?
- Entende primary key, foreign key e unique?
- Usa `WHERE`, `ORDER BY`, `LIMIT` e `GROUP BY`?
- Sabe diferença entre `WHERE` e `HAVING`?
- Sabe lidar com `NULL`?
- Evita update/delete sem filtro?
- Escolhe tipos adequados para dinheiro, texto e data?

Fundamentos fortes evitam boa parte dos problemas que aparecem depois em performance, integridade e manutenção.

