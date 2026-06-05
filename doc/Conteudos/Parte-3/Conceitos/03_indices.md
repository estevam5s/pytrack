# Índices: Performance, Estratégia e Armadilhas

Índices são estruturas que ajudam o banco a encontrar dados sem varrer a tabela inteira. Eles melhoram leituras, filtros, ordenações e joins, mas têm custo: ocupam espaço e tornam escritas mais lentas porque precisam ser atualizados.

Um bom índice nasce de uma consulta real, de um volume real e de um plano de execução analisado.

---

## Analogia Técnica

Sem índice, o banco pode precisar ler muitas páginas da tabela. Com índice, ele navega por uma estrutura ordenada para encontrar rapidamente as linhas desejadas.

O índice não é magia. Se a consulta retorna grande parte da tabela, uma varredura completa pode ser mais barata.

---

## Índice Básico

```sql
CREATE INDEX idx_clientes_email ON clientes (email);
```

Consulta beneficiada:

```sql
SELECT id, nome
FROM clientes
WHERE email = 'ana@example.com';
```

Se `email` é único, prefira constraint:

```sql
ALTER TABLE clientes
ADD CONSTRAINT uq_clientes_email UNIQUE (email);
```

Uma constraint unique normalmente cria índice único.

---

## Índice em Foreign Key

```sql
CREATE INDEX idx_pedidos_cliente_id ON pedidos (cliente_id);
```

Consultas beneficiadas:

```sql
SELECT *
FROM pedidos
WHERE cliente_id = 10;
```

```sql
SELECT c.nome, p.total
FROM pedidos p
JOIN clientes c ON c.id = p.cliente_id;
```

Muitos bancos não criam índice automaticamente para foreign key. Verifique o SGBD.

---

## Índice Composto

```sql
CREATE INDEX idx_pedidos_cliente_status ON pedidos (cliente_id, status);
```

Beneficia:

```sql
SELECT *
FROM pedidos
WHERE cliente_id = 10
  AND status = 'pago';
```

Também pode beneficiar:

```sql
SELECT *
FROM pedidos
WHERE cliente_id = 10;
```

Mas geralmente não beneficia tão bem:

```sql
SELECT *
FROM pedidos
WHERE status = 'pago';
```

A ordem das colunas importa.

---

## Regra do Prefixo Esquerdo

Para índice `(cliente_id, status, criado_em)`:

Útil para:

```sql
WHERE cliente_id = 1
WHERE cliente_id = 1 AND status = 'pago'
WHERE cliente_id = 1 AND status = 'pago' AND criado_em >= '2026-01-01'
```

Menos útil para:

```sql
WHERE status = 'pago'
WHERE criado_em >= '2026-01-01'
```

---

## Índice para Ordenação

```sql
CREATE INDEX idx_pedidos_cliente_criado_desc
ON pedidos (cliente_id, criado_em DESC);
```

Consulta:

```sql
SELECT id, total, criado_em
FROM pedidos
WHERE cliente_id = 10
ORDER BY criado_em DESC
LIMIT 20;
```

O índice ajuda no filtro e na ordenação.

---

## Índice Parcial

PostgreSQL permite indexar apenas parte da tabela.

```sql
CREATE INDEX idx_pedidos_pendentes
ON pedidos (criado_em)
WHERE status = 'pendente';
```

Consulta:

```sql
SELECT *
FROM pedidos
WHERE status = 'pendente'
ORDER BY criado_em;
```

Excelente quando uma condição é muito frequente e representa pequena parte da tabela.

---

## Índice Funcional

```sql
CREATE INDEX idx_clientes_email_lower
ON clientes (LOWER(email));
```

Consulta:

```sql
SELECT *
FROM clientes
WHERE LOWER(email) = LOWER('ANA@EXAMPLE.COM');
```

Sem índice funcional, aplicar função na coluna pode impedir uso do índice normal.

---

## Índice Covering

PostgreSQL:

```sql
CREATE INDEX idx_pedidos_cliente_include
ON pedidos (cliente_id)
INCLUDE (status, total, criado_em);
```

Esse índice pode permitir `index only scan` quando a consulta precisa apenas das colunas presentes no índice.

---

## EXPLAIN

```sql
EXPLAIN ANALYZE
SELECT *
FROM pedidos
WHERE cliente_id = 10
ORDER BY criado_em DESC
LIMIT 20;
```

Observe:

- tipo de scan;
- linhas estimadas vs reais;
- tempo total;
- custo;
- uso de sort;
- loops;
- leituras de disco/buffer quando disponível.

Tipos comuns:

- `Seq Scan`: varredura da tabela.
- `Index Scan`: usa índice e busca linhas na tabela.
- `Index Only Scan`: usa apenas o índice quando possível.
- `Bitmap Index Scan`: combina índice com leitura em blocos.

---

## Quando o Banco Ignora o Índice

Motivos comuns:

- consulta retorna porcentagem grande da tabela;
- estatísticas estão desatualizadas;
- função aplicada na coluna;
- tipo de dado incompatível;
- baixa seletividade;
- índice não combina com filtros e ordenação;
- tabela pequena demais para justificar índice.

Atualizar estatísticas:

```sql
ANALYZE pedidos;
```

---

## Seletividade

Uma coluna booleana geralmente tem baixa seletividade:

```sql
WHERE ativo = TRUE
```

Se 98% dos clientes estão ativos, um índice em `ativo` pode não ajudar. Um índice parcial pode ser melhor se você consulta os 2% inativos:

```sql
CREATE INDEX idx_clientes_inativos
ON clientes (id)
WHERE ativo = FALSE;
```

---

## Custos dos Índices

Cada índice:

- ocupa espaço;
- aumenta custo de `INSERT`;
- aumenta custo de `UPDATE` em colunas indexadas;
- aumenta custo de `DELETE`;
- precisa de manutenção;
- pode ficar inchado em alguns SGBDs.

Índice demais também é problema.

---

## Índices e Constraints

Use constraints para regras de integridade:

```sql
ALTER TABLE produtos
ADD CONSTRAINT uq_produtos_sku UNIQUE (sku);
```

Use índices para performance:

```sql
CREATE INDEX idx_produtos_categoria ON produtos (categoria_id);
```

Não substitua regra de negócio por índice comum.

---

## Estratégia Profissional

1. Identifique consultas críticas.
2. Meça com `EXPLAIN ANALYZE`.
3. Crie índice baseado em filtros, joins e ordenação.
4. Refaça a medição.
5. Monitore impacto em escrita.
6. Remova índices não usados.

Consulta para investigar índices não usados no PostgreSQL:

```sql
SELECT
    schemaname,
    relname AS tabela,
    indexrelname AS indice,
    idx_scan
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC;
```

---

## Checklist de Índices

- A consulta é frequente ou crítica?
- O índice combina com `WHERE`, `JOIN` e `ORDER BY`?
- A ordem das colunas faz sentido?
- A seletividade justifica o índice?
- Existe índice duplicado?
- O plano realmente usa o índice?
- A escrita ficou mais lenta?
- Estatísticas estão atualizadas?
- O índice resolve uma regra de integridade ou performance?
- Há monitoramento de índices não usados?

