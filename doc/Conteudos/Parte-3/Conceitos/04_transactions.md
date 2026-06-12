# Transactions: ACID, Concorrência e Consistência

Transação é uma unidade de trabalho que deve ser concluída por inteiro ou desfeita por inteiro. Ela protege a consistência quando uma operação envolve múltiplas alterações.

Exemplo: criar pedido, inserir itens, reduzir estoque e registrar pagamento. Se uma etapa falhar, o sistema não pode ficar pela metade.

---

## ACID

ACID resume propriedades clássicas de transações:

- **Atomicidade**: tudo acontece ou nada acontece.
- **Consistência**: regras e constraints permanecem válidas.
- **Isolamento**: transações concorrentes não interferem de forma incorreta.
- **Durabilidade**: depois do commit, os dados persistem.

---

## COMMIT e ROLLBACK

```sql
BEGIN;

UPDATE contas
SET saldo = saldo - 100
WHERE id = 1;

UPDATE contas
SET saldo = saldo + 100
WHERE id = 2;

COMMIT;
```

Se houver erro:

```sql
ROLLBACK;
```

---

## Exemplo de Transferência

```sql
BEGIN;

UPDATE contas
SET saldo = saldo - 100
WHERE id = 1
  AND saldo >= 100;

UPDATE contas
SET saldo = saldo + 100
WHERE id = 2;

COMMIT;
```

Ainda falta validar se a primeira atualização afetou uma linha. Em aplicação:

```python
def transferir(conn, origem: int, destino: int, valor: float) -> None:
    with conn.transaction():
        with conn.cursor() as cur:
            cur.execute(
                "UPDATE contas SET saldo = saldo - %s WHERE id = %s AND saldo >= %s",
                (valor, origem, valor),
            )
            if cur.rowcount != 1:
                raise ValueError("Saldo insuficiente ou conta de origem inexistente")

            cur.execute(
                "UPDATE contas SET saldo = saldo + %s WHERE id = %s",
                (valor, destino),
            )
            if cur.rowcount != 1:
                raise ValueError("Conta de destino inexistente")
```

---

## Problemas de Concorrência

### Dirty Read

Uma transação lê dados não confirmados por outra. Muitos bancos evitam isso por padrão.

### Non-repeatable Read

A mesma consulta retorna valores diferentes dentro da mesma transação porque outra transação fez commit.

### Phantom Read

Uma consulta por conjunto retorna linhas novas ou ausentes em outra execução dentro da mesma transação.

### Lost Update

Duas transações leem o mesmo valor e gravam atualizações concorrentes, perdendo uma alteração.

---

## Níveis de Isolamento

Comuns em bancos relacionais:

- `READ UNCOMMITTED`: permite leituras sujas em alguns bancos.
- `READ COMMITTED`: lê apenas dados commitados.
- `REPEATABLE READ`: leituras repetidas são consistentes.
- `SERIALIZABLE`: resultado equivalente a executar transações uma por vez.

PostgreSQL:

```sql
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;
```

Quanto maior o isolamento, maior pode ser o custo e a chance de bloqueios ou abortos.

---

## Bloqueio Pessimista

Trava linhas para evitar concorrência durante alteração.

```sql
BEGIN;

SELECT id, saldo
FROM contas
WHERE id = 1
FOR UPDATE;

UPDATE contas
SET saldo = saldo - 100
WHERE id = 1;

COMMIT;
```

Use quando conflito é provável e inconsistência seria cara.

---

## Bloqueio Otimista

Usa uma versão para detectar conflito.

```sql
CREATE TABLE documentos (
    id BIGINT PRIMARY KEY,
    conteudo TEXT NOT NULL,
    versao INTEGER NOT NULL DEFAULT 1
);
```

Atualização:

```sql
UPDATE documentos
SET conteudo = 'novo texto',
    versao = versao + 1
WHERE id = 10
  AND versao = 3;
```

Se `rowcount = 0`, alguém alterou antes.

---

## Deadlocks

Deadlock ocorre quando transações esperam uma pela outra.

Exemplo:

- transação A bloqueia conta 1 e quer conta 2;
- transação B bloqueia conta 2 e quer conta 1.

Reduza deadlocks:

- acesse recursos sempre na mesma ordem;
- mantenha transações curtas;
- evite interação externa dentro de transação;
- tenha retry controlado;
- use índices para updates/deletes seletivos.

---

## Savepoints

Permitem desfazer parte de uma transação.

```sql
BEGIN;

INSERT INTO lotes (nome) VALUES ('importacao-maio');

SAVEPOINT antes_item;

INSERT INTO itens_importados (codigo) VALUES ('A1');

ROLLBACK TO SAVEPOINT antes_item;

COMMIT;
```

Útil em importações em lote quando alguns itens podem falhar sem cancelar tudo.

---

## Transações Longas

Evite transações que:

- esperam resposta de API;
- processam arquivo gigante;
- dependem de ação humana;
- fazem muitas consultas sem necessidade;
- ficam abertas durante minutos.

Transações longas aumentam bloqueios, consumo de recursos e risco de conflito.

---

## Outbox Pattern

Problema: salvar pedido no banco e enviar mensagem para fila precisam ser consistentes.

Solução: grave a mensagem em uma tabela `outbox` na mesma transação.

```sql
BEGIN;

INSERT INTO pedidos (id, cliente_id, status, total)
VALUES (100, 10, 'criado', 250.00);

INSERT INTO outbox (tipo, payload, status)
VALUES (
    'pedido_criado',
    '{"pedido_id": 100}',
    'pendente'
);

COMMIT;
```

Um worker publica eventos pendentes depois. Isso evita perder evento quando a aplicação cai após o commit.

---

## Checklist de Transações

- A operação envolve mais de uma alteração dependente?
- Existe risco de estado intermediário inválido?
- A transação é curta?
- Há chamadas externas dentro da transação?
- O isolamento padrão é suficiente?
- Há risco de lost update?
- Updates verificam `rowcount`?
- Existe estratégia para deadlock e retry?
- Constraints garantem consistência?
- Eventos externos usam outbox ou estratégia equivalente?

