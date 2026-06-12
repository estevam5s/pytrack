# Excel com Python e SQL: Importação, Exportação e Relatórios

Excel continua sendo uma ferramenta central em empresas. Integrações Python + SQL + Excel aparecem em relatórios, importação de dados, conciliação, auditoria, migração e automações administrativas.

O risco é tratar planilha como banco sem validação. Planilhas são úteis na interface humana, mas o banco deve preservar integridade.

---

## Bibliotecas

```bash
pip install pandas openpyxl sqlalchemy pymysql
```

Use:

- `pandas`: leitura, transformação e exportação tabular rápida;
- `openpyxl`: controle fino de planilhas `.xlsx`;
- `SQLAlchemy`: conexão e queries;
- `pymysql`: driver MySQL.

---

## Lendo Excel com Pandas

```python
import pandas as pd


df = pd.read_excel("funcionarios.xlsx")
print(df.head())
```

Selecionar colunas:

```python
df = pd.read_excel(
    "funcionarios.xlsx",
    usecols=["nome", "email", "departamento", "salario"],
)
```

Definir tipos:

```python
df = pd.read_excel(
    "funcionarios.xlsx",
    dtype={"email": "string", "departamento": "string"},
)
```

---

## Validação Antes de Importar

```python
REQUIRED_COLUMNS = {"nome", "email", "departamento", "salario"}


def validar_planilha(df: pd.DataFrame) -> None:
    missing = REQUIRED_COLUMNS - set(df.columns)
    if missing:
        raise ValueError(f"Colunas obrigatorias ausentes: {sorted(missing)}")

    if df["email"].isna().any():
        raise ValueError("Existem funcionarios sem email")

    if (df["salario"] <= 0).any():
        raise ValueError("Existem salarios invalidos")
```

Valide planilha antes de tocar no banco.

---

## Exportando SQL para Excel

```python
import pandas as pd
from sqlalchemy import text


def exportar_funcionarios(engine, arquivo: str) -> None:
    query = text("""
        SELECT
            f.id,
            f.nome,
            f.email,
            d.nome AS departamento,
            f.cargo,
            f.salario,
            f.data_contratacao,
            f.ativo
        FROM funcionarios f
        LEFT JOIN departamentos d ON d.id = f.departamento_id
        ORDER BY f.nome
    """)

    with engine.connect() as conn:
        df = pd.read_sql(query, conn)

    df.to_excel(arquivo, index=False, sheet_name="Funcionarios")
```

---

## Múltiplas Abas

```python
def exportar_relatorio_completo(engine, arquivo: str) -> None:
    consultas = {
        "Funcionarios": "SELECT * FROM funcionarios",
        "Departamentos": "SELECT * FROM departamentos",
        "Vendas": "SELECT * FROM vendas",
    }

    with engine.connect() as conn:
        with pd.ExcelWriter(arquivo, engine="openpyxl") as writer:
            for sheet_name, sql in consultas.items():
                df = pd.read_sql(text(sql), conn)
                df.to_excel(writer, sheet_name=sheet_name, index=False)
```

Use nomes de abas curtos e estáveis.

---

## Importando Excel para MySQL

```python
from sqlalchemy import text


def importar_funcionarios(engine, arquivo: str) -> int:
    df = pd.read_excel(arquivo)
    validar_planilha(df)

    query = text("""
        INSERT INTO funcionarios
            (nome, email, cargo, salario, data_contratacao)
        VALUES
            (:nome, :email, :cargo, :salario, :data_contratacao)
    """)

    registros = df.to_dict(orient="records")

    with engine.begin() as conn:
        conn.execute(query, registros)

    return len(registros)
```

Para grandes volumes, importe em lotes.

---

## Upsert

Quando email identifica funcionário:

```sql
INSERT INTO funcionarios (nome, email, cargo, salario, data_contratacao)
VALUES (:nome, :email, :cargo, :salario, :data_contratacao)
ON DUPLICATE KEY UPDATE
    nome = VALUES(nome),
    cargo = VALUES(cargo),
    salario = VALUES(salario);
```

Upsert é útil para sincronização, mas cuidado: ele pode sobrescrever dados manualmente corrigidos.

---

## Formatação com openpyxl

```python
from openpyxl import load_workbook
from openpyxl.styles import Font, PatternFill


def formatar_excel(arquivo: str) -> None:
    workbook = load_workbook(arquivo)
    sheet = workbook.active

    header_fill = PatternFill("solid", fgColor="1F4E78")
    header_font = Font(color="FFFFFF", bold=True)

    for cell in sheet[1]:
        cell.fill = header_fill
        cell.font = header_font

    for column_cells in sheet.columns:
        max_length = max(len(str(cell.value or "")) for cell in column_cells)
        column_letter = column_cells[0].column_letter
        sheet.column_dimensions[column_letter].width = min(max_length + 2, 40)

    workbook.save(arquivo)
```

Formatação melhora leitura, mas não deve esconder dados inconsistentes.

---

## Relatório Agregado

```python
def relatorio_vendas_por_departamento(engine, arquivo: str) -> None:
    query = text("""
        SELECT
            d.nome AS departamento,
            COUNT(v.id) AS total_vendas,
            COALESCE(SUM(v.valor), 0) AS valor_total,
            COALESCE(AVG(v.valor), 0) AS ticket_medio
        FROM departamentos d
        LEFT JOIN funcionarios f ON f.departamento_id = d.id
        LEFT JOIN vendas v ON v.funcionario_id = f.id
        GROUP BY d.id, d.nome
        ORDER BY valor_total DESC
    """)

    with engine.connect() as conn:
        df = pd.read_sql(query, conn)

    df.to_excel(arquivo, index=False, sheet_name="Resumo")
    formatar_excel(arquivo)
```

---

## Processamento em Lotes

Para planilhas grandes:

- valide colunas primeiro;
- normalize tipos;
- remova linhas vazias;
- importe em chunks;
- use transações por lote;
- registre erros por linha;
- gere relatório de rejeições.

Exemplo de rejeições:

```python
def separar_validos_invalidos(df: pd.DataFrame) -> tuple[pd.DataFrame, pd.DataFrame]:
    mask = df["email"].notna() & (df["salario"] > 0)
    return df[mask].copy(), df[~mask].copy()
```

---

## Auditoria

Ao importar planilha, registre:

- nome do arquivo;
- usuário que importou;
- data/hora;
- quantidade de linhas;
- quantidade de erros;
- hash do arquivo;
- status da importação.

Isso evita discussões quando dados mudam.

---

## Erros Comuns

- confiar cegamente na planilha;
- importar sem transação;
- não validar colunas;
- perder zeros à esquerda;
- converter dinheiro para float sem cuidado;
- sobrescrever dados em upsert sem revisão;
- gerar Excel grande demais para envio;
- não registrar rejeições;
- usar planilha como fonte oficial sem governança.

---

## Checklist

- Colunas obrigatórias são validadas?
- Tipos são normalizados?
- Importação usa transação?
- Dados inválidos geram relatório?
- Exportação tem colunas explícitas?
- Valores financeiros preservam precisão?
- Upsert foi justificado?
- Importações são auditadas?
- Arquivos sensíveis são protegidos?

Excel é excelente como ponte com usuários e áreas de negócio. A aplicação deve usar essa ponte sem abrir mão de validação, integridade e rastreabilidade.

