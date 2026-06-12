# Python com Excel: pandas, openpyxl, XlsxWriter e Integração de Dados

Python é excelente para automatizar tarefas repetitivas no Excel: ler arquivos, limpar bases, validar dados, consolidar planilhas, gerar relatórios, formatar saídas e integrar com bancos, APIs e sistemas.

Excel continua sendo ótimo para consumo humano. Python é ótimo para repetição, escala, validação e automação.

---

## Bibliotecas Principais

```bash
pip install pandas openpyxl xlsxwriter
```

Use:

- `pandas`: análise tabular, leitura e escrita rápida;
- `openpyxl`: manipular `.xlsx` existente, células, estilos e fórmulas;
- `XlsxWriter`: gerar `.xlsx` novo com formatação rica;
- `xlwings`: automação do Excel instalado, quando necessário;
- `pyxlsb`: leitura de `.xlsb`;
- `odfpy`: arquivos `.ods`.

---

## Lendo Excel com pandas

```python
import pandas as pd

df = pd.read_excel("vendas.xlsx")
print(df.head())
```

Lendo aba específica:

```python
df = pd.read_excel("vendas.xlsx", sheet_name="Base_Vendas")
```

Lendo múltiplas abas:

```python
abas = pd.read_excel("relatorio.xlsx", sheet_name=None)
vendas = abas["Vendas"]
clientes = abas["Clientes"]
```

---

## Controlando Tipos

```python
df = pd.read_excel(
    "clientes.xlsx",
    dtype={
        "cliente_id": "string",
        "cpf": "string",
        "cep": "string",
    },
)
```

Códigos com zeros à esquerda devem ser texto.

Datas:

```python
df["data"] = pd.to_datetime(df["data"], errors="coerce")
```

---

## Validação

```python
REQUIRED_COLUMNS = {"pedido_id", "data", "cliente_id", "valor"}


def validar_vendas(df: pd.DataFrame) -> None:
    missing = REQUIRED_COLUMNS - set(df.columns)
    if missing:
        raise ValueError(f"Colunas ausentes: {sorted(missing)}")

    if df["pedido_id"].isna().any():
        raise ValueError("pedido_id vazio")

    if (df["valor"] < 0).any():
        raise ValueError("valor negativo encontrado")
```

Valide antes de processar.

---

## Limpando Dados

```python
df.columns = (
    df.columns
    .str.strip()
    .str.lower()
    .str.replace(" ", "_")
)

df["cliente"] = df["cliente"].str.strip()
df["status"] = df["status"].str.lower()
df = df.dropna(subset=["pedido_id"])
```

Padronizar nomes de coluna evita erros no restante do pipeline.

---

## Escrevendo Excel com pandas

```python
df.to_excel("saida.xlsx", index=False, sheet_name="Dados")
```

Múltiplas abas:

```python
with pd.ExcelWriter("relatorio.xlsx", engine="openpyxl") as writer:
    vendas.to_excel(writer, sheet_name="Vendas", index=False)
    resumo.to_excel(writer, sheet_name="Resumo", index=False)
```

---

## Formatação com XlsxWriter

```python
with pd.ExcelWriter("relatorio.xlsx", engine="xlsxwriter") as writer:
    resumo.to_excel(writer, sheet_name="Resumo", index=False)

    workbook = writer.book
    worksheet = writer.sheets["Resumo"]

    money = workbook.add_format({"num_format": "R$ #,##0.00"})
    header = workbook.add_format({"bold": True, "bg_color": "#1F4E78", "font_color": "white"})

    for col_num, value in enumerate(resumo.columns):
        worksheet.write(0, col_num, value, header)

    worksheet.set_column("B:B", 15, money)
```

XlsxWriter é forte para criar relatórios novos.

---

## Manipulando Arquivo Existente com openpyxl

```python
from openpyxl import load_workbook
from openpyxl.styles import Font, PatternFill

workbook = load_workbook("relatorio.xlsx")
sheet = workbook["Resumo"]

sheet["A1"].font = Font(bold=True)
sheet["A1"].fill = PatternFill("solid", fgColor="D9EAF7")

workbook.save("relatorio_formatado.xlsx")
```

openpyxl é útil para templates existentes.

---

## Adicionando Fórmulas

```python
from openpyxl import Workbook

wb = Workbook()
ws = wb.active
ws.title = "Calculos"

ws["A1"] = "Valor"
ws["A2"] = 100
ws["A3"] = 200
ws["A4"] = "=SUM(A2:A3)"

wb.save("formula.xlsx")
```

Python escreve a fórmula. O Excel calcula ao abrir, dependendo da configuração.

---

## Consolidação de Arquivos

```python
from pathlib import Path
import pandas as pd


def consolidar_pasta(pasta: str) -> pd.DataFrame:
    arquivos = Path(pasta).glob("*.xlsx")
    frames = []

    for arquivo in arquivos:
        df = pd.read_excel(arquivo)
        df["arquivo_origem"] = arquivo.name
        frames.append(df)

    return pd.concat(frames, ignore_index=True)
```

Inclua `arquivo_origem` para rastreabilidade.

---

## Excel + Banco de Dados

```python
import pandas as pd
from sqlalchemy import create_engine, text

engine = create_engine("postgresql+psycopg://user:pass@localhost:5432/app")

with engine.connect() as conn:
    df = pd.read_sql(
        text("SELECT data, cliente, valor FROM vendas WHERE data >= :inicio"),
        conn,
        params={"inicio": "2026-01-01"},
    )

df.to_excel("vendas_2026.xlsx", index=False)
```

Use queries parametrizadas.

---

## Excel + APIs

```python
import requests
import pandas as pd

response = requests.get("https://api.exemplo.com/vendas", timeout=10)
response.raise_for_status()

df = pd.DataFrame(response.json())
df.to_excel("vendas_api.xlsx", index=False)
```

Trate paginação, autenticação, retries e limites de API em sistemas reais.

---

## Arquivos Grandes

Excel tem limite de linhas por planilha. Para volumes grandes:

- use CSV/Parquet;
- agregue antes de exportar;
- divida por abas/arquivos;
- use banco de dados;
- gere resumo em Excel, não dado bruto completo.

Excel não é banco de dados.

---

## Erros Comuns

- perder zeros à esquerda;
- datas virarem texto;
- sobrescrever template;
- esquecer `index=False`;
- não validar colunas;
- usar Excel para milhões de linhas sem necessidade;
- misturar limpeza e relatório sem função clara;
- não registrar arquivo origem;
- não tratar erros de leitura.

---

## Checklist

- Tipos foram controlados na leitura?
- Colunas obrigatórias são validadas?
- Datas inválidas são tratadas?
- Saída usa `index=False` quando adequado?
- Arquivo origem é rastreado?
- Relatório tem formatação mínima?
- Dados sensíveis são protegidos?
- Processo pode ser reexecutado?
- Há logs ou mensagens claras de erro?

Python com Excel é melhor quando transforma uma tarefa manual repetitiva em um processo previsível, validado e reproduzível.

