# Procedures: Rotinas no Banco de Dados

Procedures são rotinas armazenadas no banco de dados para executar lógica próxima aos dados. Dependendo do SGBD, existem também functions, triggers e packages.

Elas podem melhorar performance, padronizar operações e reduzir tráfego entre aplicação e banco, mas também podem esconder complexidade, dificultar testes e acoplar regra de negócio ao SGBD.

---

## Procedure vs Function

Em termos gerais:

- **Function** retorna valor e pode ser usada em consultas.
- **Procedure** executa ações e pode controlar transações em alguns bancos.

PostgreSQL:

```sql
CREATE OR REPLACE FUNCTION calcular_total_pedido(p_pedido_id BIGINT)
RETURNS NUMERIC AS $$
DECLARE
    v_total NUMERIC;
BEGIN
    SELECT SUM(quantidade * preco_unitario)
    INTO v_total
    FROM itens_pedido
    WHERE pedido_id = p_pedido_id;

    RETURN COALESCE(v_total, 0);
END;
$$ LANGUAGE plpgsql;
```

Uso:

```sql
SELECT calcular_total_pedido(100);
```

---

## Procedure no PostgreSQL

```sql
CREATE OR REPLACE PROCEDURE atualizar_total_pedido(p_pedido_id BIGINT)
LANGUAGE plpgsql
AS $$
DECLARE
    v_total NUMERIC;
BEGIN
    SELECT COALESCE(SUM(quantidade * preco_unitario), 0)
    INTO v_total
    FROM itens_pedido
    WHERE pedido_id = p_pedido_id;

    UPDATE pedidos
    SET total = v_total
    WHERE id = p_pedido_id;
END;
$$;
```

Execução:

```sql
CALL atualizar_total_pedido(100);
```

---

## Quando Usar Procedures

Faz sentido quando:

- operação envolve muitos dados no banco;
- lógica precisa ser compartilhada por várias aplicações;
- há necessidade de reduzir tráfego de rede;
- regras são fortemente ligadas à integridade dos dados;
- processamento em lote roda melhor dentro do banco;
- governança exige interface controlada.

Evite quando:

- regra muda com frequência;
- equipe não tem maturidade com versionamento de banco;
- lógica depende de APIs externas;
- testes ficam inviáveis;
- procedure vira aplicação escondida dentro do banco.

---

## Procedure de Fechamento de Pedido

```sql
CREATE OR REPLACE PROCEDURE fechar_pedido(p_pedido_id BIGINT)
LANGUAGE plpgsql
AS $$
DECLARE
    v_status VARCHAR(30);
    v_total NUMERIC;
BEGIN
    SELECT status
    INTO v_status
    FROM pedidos
    WHERE id = p_pedido_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Pedido % não encontrado', p_pedido_id;
    END IF;

    IF v_status <> 'aberto' THEN
        RAISE EXCEPTION 'Pedido % não está aberto', p_pedido_id;
    END IF;

    SELECT COALESCE(SUM(quantidade * preco_unitario), 0)
    INTO v_total
    FROM itens_pedido
    WHERE pedido_id = p_pedido_id;

    IF v_total <= 0 THEN
        RAISE EXCEPTION 'Pedido % não possui itens válidos', p_pedido_id;
    END IF;

    UPDATE pedidos
    SET status = 'fechado',
        total = v_total,
        atualizado_em = CURRENT_TIMESTAMP
    WHERE id = p_pedido_id;
END;
$$;
```

Essa procedure:

- bloqueia o pedido com `FOR UPDATE`;
- valida existência;
- valida estado;
- calcula total;
- atualiza de forma centralizada.

---

## Tratamento de Erros

```sql
CREATE OR REPLACE PROCEDURE registrar_pagamento(p_pedido_id BIGINT, p_valor NUMERIC)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO pagamentos (pedido_id, valor, status)
    VALUES (p_pedido_id, p_valor, 'confirmado');

    UPDATE pedidos
    SET status = 'pago'
    WHERE id = p_pedido_id;

EXCEPTION WHEN foreign_key_violation THEN
    RAISE EXCEPTION 'Pedido inválido: %', p_pedido_id;
WHEN check_violation THEN
    RAISE EXCEPTION 'Valor de pagamento inválido: %', p_valor;
END;
$$;
```

Use exceções para transformar erros técnicos em mensagens mais compreensíveis, sem esconder falhas.

---

## Procedures e Performance

Vantagens:

- menos round trips entre aplicação e banco;
- processamento próximo aos dados;
- plano de execução reutilizável em alguns contextos;
- menor transferência de dados intermediários.

Riscos:

- loops linha a linha podem ser lentos;
- lógica procedural pode ignorar força do SQL set-based;
- locks podem durar mais;
- debugging pode ser mais difícil.

Prefira operações set-based:

```sql
UPDATE produtos p
SET estoque = estoque - i.quantidade
FROM itens_pedido i
WHERE i.produto_id = p.id
  AND i.pedido_id = 100;
```

Em vez de atualizar produto por produto em loop.

---

## Segurança com Procedures

Procedures podem encapsular permissões.

```sql
GRANT EXECUTE ON PROCEDURE fechar_pedido(BIGINT) TO app_user;
REVOKE UPDATE ON pedidos FROM app_user;
```

Assim a aplicação não atualiza qualquer campo diretamente; ela chama uma operação controlada.

---

## Versionamento

Procedures devem estar em migrações:

```text
migrations/
├── 001_create_tables.sql
├── 002_create_fechar_pedido_procedure.sql
└── 003_update_fechar_pedido_validation.sql
```

Nunca edite manualmente em produção sem rastreabilidade.

---

## Testando Procedures

Teste:

- caminho feliz;
- registro inexistente;
- estado inválido;
- concorrência;
- constraints;
- rollback;
- permissões.

Exemplo simples:

```sql
BEGIN;

INSERT INTO pedidos (id, cliente_id, status, total)
VALUES (999, 1, 'aberto', 0);

INSERT INTO itens_pedido (id, pedido_id, produto_id, quantidade, preco_unitario)
VALUES (999, 999, 10, 2, 50);

CALL fechar_pedido(999);

SELECT status, total FROM pedidos WHERE id = 999;

ROLLBACK;
```

O teste roda e desfaz os dados.

---

## Checklist de Procedures

- A lógica realmente pertence ao banco?
- Existe ganho claro de integridade, performance ou governança?
- A procedure está versionada?
- Há testes de caminho feliz e falhas?
- Ela evita loops desnecessários?
- Ela mantém transações curtas?
- Erros são claros?
- Permissões estão controladas?
- A aplicação sabe lidar com exceções?
- Existe documentação de entrada, saída e efeitos colaterais?

