# CRUD Profissional: Repositórios, Transações e Tratamento de Erros

CRUD significa Create, Read, Update e Delete. Em sistemas reais, CRUD profissional não é apenas executar quatro queries. Ele envolve validação, transações, tratamento de erro, paginação, filtros, segurança, concorrência e separação de responsabilidades.

---

## Responsabilidade do Repositório

Repository isola acesso a dados:

```text
API/CLI/Service -> Repository -> Banco
```

Benefícios:

- centraliza SQL;
- facilita testes;
- evita duplicação;
- controla transações;
- traduz erros;
- separa persistência da interface.

---

## Modelo de Entrada

```python
from dataclasses import dataclass
from datetime import date
from decimal import Decimal


@dataclass(frozen=True)
class NovoFuncionario:
    departamento_id: int | None
    nome: str
    email: str
    cargo: str
    salario: Decimal
    data_contratacao: date
```

Entrada tipada reduz erros e deixa contrato claro.

---

## Repository com SQLAlchemy Core

```python
from sqlalchemy import text


class FuncionarioRepository:
    def __init__(self, engine):
        self.engine = engine

    def criar(self, funcionario: NovoFuncionario) -> int:
        query = text("""
            INSERT INTO funcionarios
                (departamento_id, nome, email, cargo, salario, data_contratacao)
            VALUES
                (:departamento_id, :nome, :email, :cargo, :salario, :data_contratacao)
        """)

        with self.engine.begin() as conn:
            result = conn.execute(
                query,
                {
                    "departamento_id": funcionario.departamento_id,
                    "nome": funcionario.nome,
                    "email": funcionario.email,
                    "cargo": funcionario.cargo,
                    "salario": funcionario.salario,
                    "data_contratacao": funcionario.data_contratacao,
                },
            )
            return result.lastrowid
```

`engine.begin()` abre transação e faz commit se tudo funcionar, rollback em exceção.

---

## READ por ID

```python
    def obter_por_id(self, funcionario_id: int) -> dict | None:
        query = text("""
            SELECT
                f.id,
                f.nome,
                f.email,
                f.cargo,
                f.salario,
                f.data_contratacao,
                f.ativo,
                d.nome AS departamento
            FROM funcionarios f
            LEFT JOIN departamentos d ON d.id = f.departamento_id
            WHERE f.id = :id
        """)

        with self.engine.connect() as conn:
            return conn.execute(query, {"id": funcionario_id}).mappings().first()
```

Retornar `None` quando não existe é melhor que lançar erro genérico em leitura simples. A camada de serviço decide se vira 404, mensagem de CLI ou exceção.

---

## Listagem com Filtros

```python
    def listar(
        self,
        departamento_id: int | None = None,
        ativo: bool | None = True,
        limit: int = 50,
        offset: int = 0,
    ) -> list[dict]:
        conditions = []
        params = {"limit": limit, "offset": offset}

        if departamento_id is not None:
            conditions.append("f.departamento_id = :departamento_id")
            params["departamento_id"] = departamento_id

        if ativo is not None:
            conditions.append("f.ativo = :ativo")
            params["ativo"] = ativo

        where_clause = "WHERE " + " AND ".join(conditions) if conditions else ""

        query = text(f"""
            SELECT f.id, f.nome, f.email, f.cargo, f.salario, f.ativo
            FROM funcionarios f
            {where_clause}
            ORDER BY f.id
            LIMIT :limit OFFSET :offset
        """)

        with self.engine.connect() as conn:
            return list(conn.execute(query, params).mappings())
```

Aqui a string dinâmica controla apenas trechos definidos pelo código. Valores continuam parametrizados.

---

## Ordenação Segura

Parâmetros não substituem nomes de coluna. Use allowlist:

```python
ORDER_COLUMNS = {
    "nome": "f.nome",
    "salario": "f.salario",
    "data_contratacao": "f.data_contratacao",
}


def build_order_by(order_by: str, direction: str) -> str:
    column = ORDER_COLUMNS.get(order_by)
    if column is None:
        raise ValueError("Coluna de ordenacao invalida")

    direction_sql = "DESC" if direction.lower() == "desc" else "ASC"
    return f"{column} {direction_sql}"
```

Nunca aceite coluna arbitrária do usuário.

---

## UPDATE

```python
    def atualizar_salario(self, funcionario_id: int, novo_salario: Decimal) -> bool:
        query = text("""
            UPDATE funcionarios
            SET salario = :salario
            WHERE id = :id
              AND ativo = TRUE
        """)

        with self.engine.begin() as conn:
            result = conn.execute(
                query,
                {"id": funcionario_id, "salario": novo_salario},
            )
            return result.rowcount > 0
```

`rowcount` permite saber se algo foi alterado.

---

## DELETE vs Soft Delete

Delete físico:

```python
    def deletar(self, funcionario_id: int) -> bool:
        query = text("DELETE FROM funcionarios WHERE id = :id")
        with self.engine.begin() as conn:
            result = conn.execute(query, {"id": funcionario_id})
            return result.rowcount > 0
```

Soft delete:

```python
    def desativar(self, funcionario_id: int) -> bool:
        query = text("""
            UPDATE funcionarios
            SET ativo = FALSE
            WHERE id = :id
        """)
        with self.engine.begin() as conn:
            result = conn.execute(query, {"id": funcionario_id})
            return result.rowcount > 0
```

Soft delete é melhor quando há histórico, auditoria ou relacionamento com outras tabelas.

---

## Transação com Múltiplas Operações

Exemplo: registrar venda e comissão.

```python
class VendaRepository:
    def __init__(self, engine):
        self.engine = engine

    def registrar_venda(self, funcionario_id: int, produto: str, quantidade: int, valor: Decimal) -> int:
        venda_query = text("""
            INSERT INTO vendas (funcionario_id, produto, quantidade, valor, data_venda)
            VALUES (:funcionario_id, :produto, :quantidade, :valor, CURRENT_DATE)
        """)

        comissao_query = text("""
            UPDATE funcionarios
            SET salario = salario + :comissao
            WHERE id = :funcionario_id
        """)

        with self.engine.begin() as conn:
            result = conn.execute(
                venda_query,
                {
                    "funcionario_id": funcionario_id,
                    "produto": produto,
                    "quantidade": quantidade,
                    "valor": valor,
                },
            )
            venda_id = result.lastrowid

            conn.execute(
                comissao_query,
                {
                    "funcionario_id": funcionario_id,
                    "comissao": valor * Decimal("0.05"),
                },
            )

            return venda_id
```

Se a segunda operação falha, a primeira é desfeita.

---

## Isolamento e Concorrência

Problema clássico: duas operações alteram o mesmo dado ao mesmo tempo.

Estratégias:

- transação curta;
- `SELECT ... FOR UPDATE`;
- constraint única;
- versionamento otimista;
- idempotency key;
- retry controlado em deadlock.

Exemplo:

```sql
SELECT estoque
FROM produtos
WHERE id = 10
FOR UPDATE;
```

Use bloqueios com cuidado. Transações longas reduzem concorrência.

---

## Tratamento de IntegrityError

```python
from sqlalchemy.exc import IntegrityError


def criar_com_email_unico(repo: FuncionarioRepository, funcionario: NovoFuncionario) -> int:
    try:
        return repo.criar(funcionario)
    except IntegrityError as exc:
        raise ValueError("Email ja cadastrado") from exc
```

Não exponha erro SQL bruto para usuário final.

---

## Testes

Teste de repository pode usar banco real em container:

```python
def test_criar_funcionario(engine):
    repo = FuncionarioRepository(engine)

    funcionario_id = repo.criar(
        NovoFuncionario(
            departamento_id=1,
            nome="Teste",
            email="teste@email.com",
            cargo="QA",
            salario=Decimal("5000.00"),
            data_contratacao=date(2024, 1, 1),
        )
    )

    salvo = repo.obter_por_id(funcionario_id)

    assert salvo["email"] == "teste@email.com"
```

Para testes de unidade, isole regra de negócio fora do repository.

---

## Erros Comuns

- montar SQL com f-string usando entrada externa;
- abrir conexão e não fechar;
- commit parcial sem transação;
- fazer delete físico sem entender relações;
- não tratar duplicate key;
- permitir ordenação por coluna arbitrária;
- retornar `SELECT *` para API;
- misturar SQL, HTTP e regra de negócio na mesma função;
- não testar rollback.

---

## Checklist

- Repository centraliza SQL?
- Queries usam parâmetros?
- Escritas usam transação?
- Erros de constraint são tratados?
- Ordenação dinâmica tem allowlist?
- Delete físico foi justificado?
- Paginação existe?
- Testes cobrem create/read/update/delete?
- Conexões e sessions são fechadas?

CRUD profissional é menos sobre escrever queries e mais sobre garantir consistência, segurança e previsibilidade quando essas queries rodam em um sistema real.

