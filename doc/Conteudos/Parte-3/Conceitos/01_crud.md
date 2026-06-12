# CRUD: Create, Read, Update e Delete

CRUD é o conjunto básico de operações sobre dados:

- **Create**: criar registros.
- **Read**: consultar registros.
- **Update**: atualizar registros.
- **Delete**: excluir registros.

Embora pareça simples, CRUD profissional envolve validação, integridade, concorrência, auditoria, segurança, transações, paginação, filtros, soft delete e prevenção de perda de dados.

---

## Tabela Base

```sql
CREATE TABLE clientes (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL UNIQUE,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP
);
```

Pontos importantes:

- `PRIMARY KEY` identifica cada registro.
- `NOT NULL` evita dados incompletos.
- `UNIQUE` impede e-mails duplicados.
- `DEFAULT` reduz repetição na aplicação.
- `ativo` permite soft delete.

---

## Create: Inserindo Dados

```sql
INSERT INTO clientes (nome, email)
VALUES ('Ana Souza', 'ana@example.com');
```

Retornando o registro criado:

```sql
INSERT INTO clientes (nome, email)
VALUES ('Bruno Lima', 'bruno@example.com')
RETURNING id, nome, email, criado_em;
```

Inserindo múltiplos registros:

```sql
INSERT INTO clientes (nome, email)
VALUES
    ('Carla Dias', 'carla@example.com'),
    ('Daniel Rocha', 'daniel@example.com'),
    ('Elisa Martins', 'elisa@example.com');
```

---

## Insert Idempotente

Em muitos processos, a mesma carga pode rodar mais de uma vez. No PostgreSQL:

```sql
INSERT INTO clientes (nome, email)
VALUES ('Ana Souza', 'ana@example.com')
ON CONFLICT (email)
DO UPDATE SET
    nome = EXCLUDED.nome,
    atualizado_em = CURRENT_TIMESTAMP
RETURNING id;
```

Esse padrão é chamado de **upsert**: insert quando não existe, update quando já existe.

---

## Read: Consultando Dados

Consulta básica:

```sql
SELECT id, nome, email
FROM clientes;
```

Com filtro:

```sql
SELECT id, nome, email
FROM clientes
WHERE ativo = TRUE;
```

Ordenação:

```sql
SELECT id, nome, criado_em
FROM clientes
WHERE ativo = TRUE
ORDER BY criado_em DESC;
```

Paginação:

```sql
SELECT id, nome, email
FROM clientes
WHERE ativo = TRUE
ORDER BY id
LIMIT 20 OFFSET 40;
```

`OFFSET` é simples, mas fica caro em páginas profundas. Para alta escala, use keyset pagination.

---

## Keyset Pagination

```sql
SELECT id, nome, email
FROM clientes
WHERE ativo = TRUE
  AND id > 1000
ORDER BY id
LIMIT 20;
```

Esse modelo é mais eficiente porque o banco usa o índice da chave primária sem descartar milhares de linhas anteriores.

---

## Filtros Profissionais

```sql
SELECT id, nome, email, criado_em
FROM clientes
WHERE ativo = TRUE
  AND criado_em >= DATE '2026-01-01'
  AND nome ILIKE 'ana%'
ORDER BY criado_em DESC
LIMIT 50;
```

Cuidados:

- filtros com funções podem impedir uso eficiente de índice;
- `ILIKE '%texto%'` costuma exigir estratégias específicas;
- filtros opcionais precisam ser montados com cuidado na aplicação;
- nunca concatene entrada do usuário diretamente no SQL.

---

## Update: Atualizando Dados

```sql
UPDATE clientes
SET nome = 'Ana Maria Souza',
    atualizado_em = CURRENT_TIMESTAMP
WHERE id = 1;
```

Sempre use `WHERE`. Um `UPDATE` sem filtro altera a tabela inteira.

Retornando dados alterados:

```sql
UPDATE clientes
SET ativo = FALSE,
    atualizado_em = CURRENT_TIMESTAMP
WHERE id = 1
RETURNING id, nome, ativo;
```

---

## Update Condicional

```sql
UPDATE pedidos
SET status = 'pago'
WHERE id = 100
  AND status = 'pendente';
```

Esse padrão evita transições inválidas. Um pedido cancelado não será marcado como pago por acidente.

---

## Delete: Excluindo Dados

Exclusão física:

```sql
DELETE FROM clientes
WHERE id = 1;
```

Exclusão lógica:

```sql
UPDATE clientes
SET ativo = FALSE,
    atualizado_em = CURRENT_TIMESTAMP
WHERE id = 1;
```

Soft delete é comum quando:

- há necessidade de auditoria;
- registros são referenciados por outras tabelas;
- exclusão acidental deve ser reversível;
- relatórios históricos precisam permanecer consistentes.

---

## Hard Delete vs Soft Delete

Hard delete:

- remove de fato;
- simplifica consultas;
- reduz armazenamento;
- pode quebrar histórico se mal usado.

Soft delete:

- preserva histórico;
- permite restauração;
- exige filtro `ativo = TRUE` em muitas consultas;
- pode acumular dados inúteis.

Em sistemas profissionais, pode existir política híbrida: soft delete imediato e hard delete depois de prazo legal ou operacional.

---

## Segurança: SQL Injection

Errado:

```python
sql = f"SELECT * FROM clientes WHERE email = '{email}'"
```

Certo:

```python
cursor.execute(
    "SELECT id, nome, email FROM clientes WHERE email = %s",
    (email,),
)
```

Nunca concatene valores externos em SQL. Use parâmetros do driver ou ORM.

---

## CRUD com Python

Exemplo com `psycopg`:

```python
import psycopg
from dataclasses import dataclass


@dataclass
class Cliente:
    id: int
    nome: str
    email: str


def criar_cliente(conn, nome: str, email: str) -> Cliente:
    with conn.cursor() as cur:
        cur.execute(
            """
            INSERT INTO clientes (nome, email)
            VALUES (%s, %s)
            RETURNING id, nome, email
            """,
            (nome, email),
        )
        row = cur.fetchone()
        return Cliente(*row)


def buscar_cliente(conn, cliente_id: int) -> Cliente | None:
    with conn.cursor() as cur:
        cur.execute(
            "SELECT id, nome, email FROM clientes WHERE id = %s AND ativo = TRUE",
            (cliente_id,),
        )
        row = cur.fetchone()
        return Cliente(*row) if row else None
```

---

## CRUD com Transação

```python
def criar_pedido(conn, cliente_id: int, itens: list[dict]) -> int:
    with conn.transaction():
        with conn.cursor() as cur:
            total = sum(item["quantidade"] * item["preco_unitario"] for item in itens)

            cur.execute(
                """
                INSERT INTO pedidos (cliente_id, status, total)
                VALUES (%s, 'pendente', %s)
                RETURNING id
                """,
                (cliente_id, total),
            )
            pedido_id = cur.fetchone()[0]

            for item in itens:
                cur.execute(
                    """
                    INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario)
                    VALUES (%s, %s, %s, %s)
                    """,
                    (pedido_id, item["produto_id"], item["quantidade"], item["preco_unitario"]),
                )

            return pedido_id
```

Se qualquer insert falhar, a transação é desfeita.

---

## Validações no Banco

```sql
CREATE TABLE produtos (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    preco NUMERIC(12, 2) NOT NULL CHECK (preco >= 0),
    estoque INTEGER NOT NULL CHECK (estoque >= 0),
    sku VARCHAR(40) NOT NULL UNIQUE
);
```

Regras críticas devem existir no banco, não apenas na aplicação.

---

## Auditoria Simples

```sql
ALTER TABLE clientes
ADD COLUMN criado_por VARCHAR(80),
ADD COLUMN atualizado_por VARCHAR(80);
```

Em sistemas maiores, use tabela de auditoria:

```sql
CREATE TABLE auditoria_clientes (
    id BIGSERIAL PRIMARY KEY,
    cliente_id BIGINT NOT NULL,
    operacao VARCHAR(20) NOT NULL,
    dados_anteriores JSONB,
    dados_novos JSONB,
    usuario VARCHAR(80),
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

---

## Checklist de CRUD Profissional

- inserts validam campos obrigatórios?
- updates usam `WHERE` específico?
- deletes são físicos ou lógicos por decisão consciente?
- entradas externas usam parâmetros?
- operações compostas usam transação?
- há constraints no banco?
- há logs ou auditoria para alterações críticas?
- existe paginação em listagens?
- filtros frequentes têm índices adequados?
- a API retorna erros claros para conflito, ausência e validação?

