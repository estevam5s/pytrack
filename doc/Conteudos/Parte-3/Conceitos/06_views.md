# Views: Consultas Reutilizáveis e Camadas de Leitura

View é uma consulta salva no banco com nome próprio. Ela pode simplificar consultas complexas, padronizar regras de leitura, esconder colunas sensíveis e criar camadas de compatibilidade.

Uma view comum não armazena dados por si só; ela executa a consulta quando é acessada. Views materializadas armazenam o resultado e precisam ser atualizadas.

---

## View Básica

```sql
CREATE VIEW vw_clientes_ativos AS
SELECT id, nome, email, criado_em
FROM clientes
WHERE ativo = TRUE;
```

Uso:

```sql
SELECT *
FROM vw_clientes_ativos
ORDER BY criado_em DESC;
```

---

## View para Relatório

```sql
CREATE VIEW vw_resumo_clientes AS
SELECT
    c.id AS cliente_id,
    c.nome,
    COUNT(p.id) AS quantidade_pedidos,
    COALESCE(SUM(p.total), 0) AS total_gasto,
    MAX(p.criado_em) AS ultimo_pedido_em
FROM clientes c
LEFT JOIN pedidos p ON p.cliente_id = c.id
GROUP BY c.id, c.nome;
```

Essa view centraliza a regra de cálculo de resumo por cliente.

---

## View como Camada de Segurança

Tabela com dado sensível:

```sql
CREATE TABLE usuarios (
    id BIGINT PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL,
    senha_hash TEXT NOT NULL,
    documento VARCHAR(30)
);
```

View pública:

```sql
CREATE VIEW vw_usuarios_publicos AS
SELECT id, nome, email
FROM usuarios;
```

Permissão:

```sql
GRANT SELECT ON vw_usuarios_publicos TO relatorios_user;
REVOKE SELECT ON usuarios FROM relatorios_user;
```

---

## Alterando Views

```sql
CREATE OR REPLACE VIEW vw_clientes_ativos AS
SELECT id, nome, email, criado_em, atualizado_em
FROM clientes
WHERE ativo = TRUE;
```

Cuidado: remover ou renomear colunas pode quebrar consumidores.

---

## Views Atualizáveis

Alguns bancos permitem update em views simples.

```sql
CREATE VIEW vw_produtos_ativos AS
SELECT id, nome, preco
FROM produtos
WHERE ativo = TRUE;
```

Pode ser possível:

```sql
UPDATE vw_produtos_ativos
SET preco = 99.90
WHERE id = 10;
```

Mas views com joins, agregações e `GROUP BY` normalmente não são atualizáveis sem regras/triggers específicas.

Em sistemas profissionais, use views principalmente para leitura.

---

## View Materializada

PostgreSQL:

```sql
CREATE MATERIALIZED VIEW mv_vendas_diarias AS
SELECT
    DATE(criado_em) AS dia,
    COUNT(*) AS pedidos,
    SUM(total) AS faturamento
FROM pedidos
WHERE status = 'pago'
GROUP BY DATE(criado_em);
```

Consulta:

```sql
SELECT *
FROM mv_vendas_diarias
ORDER BY dia DESC;
```

Atualização:

```sql
REFRESH MATERIALIZED VIEW mv_vendas_diarias;
```

Para refresh concorrente:

```sql
CREATE UNIQUE INDEX idx_mv_vendas_diarias_dia ON mv_vendas_diarias (dia);
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_vendas_diarias;
```

---

## Quando Usar View Materializada

Use quando:

- a consulta é pesada;
- os dados não precisam ser em tempo real;
- relatórios acessam o mesmo agregado frequentemente;
- é aceitável atualizar por agenda;
- o custo de leitura precisa cair.

Evite quando:

- dados precisam estar sempre atualizados;
- refresh demora demais;
- consumidores não entendem a defasagem;
- a view materializada vira cópia descontrolada.

---

## Views e Compatibilidade

Views podem proteger aplicações durante migrações.

Exemplo: uma tabela antiga tinha `nome_completo`, mas o novo modelo tem `nome` e `sobrenome`.

```sql
CREATE VIEW vw_clientes_legado AS
SELECT
    id,
    nome || ' ' || sobrenome AS nome_completo,
    email
FROM clientes;
```

Isso permite migrar consumidores gradualmente.

---

## Performance de Views

Uma view comum não garante performance por si só. O otimizador expande a consulta da view.

Para melhorar performance:

- indexe as tabelas base;
- simplifique joins;
- evite views encadeadas demais;
- analise com `EXPLAIN`;
- use materialized view quando fizer sentido;
- atualize estatísticas.

---

## Camadas de Views

Uma organização comum:

- `raw`: dados brutos;
- `staging`: limpeza e padronização;
- `mart`: dados prontos para consumo;
- `public`: views expostas a usuários ou sistemas.

Exemplo:

```sql
CREATE VIEW staging.vw_pedidos_limpos AS
SELECT
    id,
    cliente_id,
    LOWER(status) AS status,
    total,
    criado_em
FROM raw.pedidos;
```

---

## Checklist de Views

- A view simplifica uma consulta real?
- Ela esconde dados sensíveis corretamente?
- Consumidores conhecem o contrato das colunas?
- A view comum é suficiente ou precisa ser materializada?
- Há índice adequado nas tabelas base?
- Views encadeadas não ficaram difíceis de entender?
- Há estratégia de refresh se for materializada?
- Mudanças na view são versionadas?
- Permissões estão configuradas?
- O nome indica claramente o propósito?

