# Proteção contra SQL Injection

SQL Injection ocorre quando entrada do usuário é interpretada como parte do comando SQL. É uma vulnerabilidade crítica que pode permitir vazamento, alteração ou exclusão de dados.

---

## Exemplo Vulnerável

```python
def buscar_usuario(conn, email: str):
    sql = f"SELECT id, email FROM usuarios WHERE email = '{email}'"
    return conn.execute(sql).fetchone()
```

Entrada maliciosa:

```text
' OR '1'='1
```

SQL resultante:

```sql
SELECT id, email FROM usuarios WHERE email = '' OR '1'='1'
```

---

## Queries Parametrizadas

SQLite:

```python
def buscar_usuario(conn, email: str):
    return conn.execute(
        "SELECT id, email FROM usuarios WHERE email = ?",
        (email,),
    ).fetchone()
```

Psycopg:

```python
def buscar_usuario(conn, email: str):
    with conn.cursor() as cur:
        cur.execute(
            "SELECT id, email FROM usuarios WHERE email = %s",
            (email,),
        )
        return cur.fetchone()
```

Parâmetros não são concatenação. O driver envia valores separadamente.

---

## SQLAlchemy

Seguro:

```python
from sqlalchemy import select


stmt = select(Usuario).where(Usuario.email == email)
usuario = session.execute(stmt).scalar_one_or_none()
```

Textual seguro:

```python
from sqlalchemy import text


stmt = text("SELECT id, email FROM usuarios WHERE email = :email")
rows = session.execute(stmt, {"email": email}).all()
```

Vulnerável:

```python
text(f"SELECT * FROM usuarios WHERE email = '{email}'")
```

---

## ORDER BY Dinâmico

Parâmetros protegem valores, não identificadores como nome de coluna.

Errado:

```python
sql = f"SELECT * FROM pedidos ORDER BY {sort}"
```

Certo:

```python
COLUNAS_PERMITIDAS = {
    "criado_em": "criado_em",
    "total": "total",
}

coluna = COLUNAS_PERMITIDAS.get(sort)
if coluna is None:
    raise ValueError("Ordenação inválida")

sql = f"SELECT * FROM pedidos ORDER BY {coluna}"
```

Use allowlist.

---

## LIKE Seguro

```python
termo = f"%{busca}%"
cur.execute(
    "SELECT id, nome FROM produtos WHERE nome ILIKE %s",
    (termo,),
)
```

Mesmo com LIKE, o valor deve ser parâmetro.

---

## IN Seguro

Com SQLAlchemy:

```python
stmt = select(Produto).where(Produto.id.in_(ids))
```

Com psycopg, use recursos do driver ou monte placeholders controlados, nunca concatene valores crus.

---

## Least Privilege

Mesmo com queries seguras, limite permissões do usuário do banco:

- aplicação não deve usar superuser;
- usuário de leitura não deve escrever;
- migrations usam credencial diferente;
- revogue acesso desnecessário.

---

## Defense in Depth

Além de parametrizar:

- validação de entrada;
- allowlist para campos dinâmicos;
- ORM/query builder;
- WAF quando aplicável;
- logs de queries suspeitas;
- least privilege;
- testes de segurança.

---

## Teste Simples

```python
def test_login_nao_aceita_sql_injection(client):
    response = client.post("/login", json={
        "email": "' OR '1'='1",
        "password": "qualquer",
    })
    assert response.status_code == 401
```

Esse teste não substitui revisão, mas ajuda a evitar regressão.

---

## Checklist

- não há f-string em SQL com entrada externa?
- valores são parametrizados?
- identificadores dinâmicos usam allowlist?
- ORM é usado corretamente?
- usuário do banco tem privilégio mínimo?
- logs não expõem dados sensíveis?
- testes cobrem payloads maliciosos básicos?
- migrations usam credencial separada?

