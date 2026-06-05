# Automação de Planilhas com Excel, CSV e Google Sheets

Planilhas são uma das maiores fontes de automação em empresas. Python pode consolidar arquivos, validar dados, gerar relatórios, atualizar fórmulas, criar gráficos, aplicar estilos, enviar saídas e integrar com bancos e APIs.

Use planilhas como interface quando isso ajuda o usuário, mas mantenha a lógica crítica no código.

---

## Ferramentas

- `csv`: biblioteca padrão para CSV.
- `pandas`: leitura, limpeza, transformação e análise.
- `openpyxl`: Excel `.xlsx`, fórmulas, estilos, abas e células.
- `xlsxwriter`: criação de Excel com formatação avançada.
- `gspread`: Google Sheets.
- `pyxlsb`: leitura de `.xlsb`.

---

## CSV com Biblioteca Padrão

```python
import csv
from pathlib import Path


def ler_clientes(caminho: Path) -> list[dict[str, str]]:
    with caminho.open(newline="", encoding="utf-8") as arquivo:
        return list(csv.DictReader(arquivo))


def salvar_clientes(clientes: list[dict[str, str]], caminho: Path) -> None:
    caminho.parent.mkdir(parents=True, exist_ok=True)
    with caminho.open("w", newline="", encoding="utf-8") as arquivo:
        writer = csv.DictWriter(arquivo, fieldnames=["nome", "email", "status"])
        writer.writeheader()
        writer.writerows(clientes)
```

CSV é excelente para integração, mas não guarda estilo, fórmulas ou múltiplas abas.

---

## Pandas para Consolidação

```python
from pathlib import Path
import pandas as pd


def consolidar_excel(pasta: Path) -> pd.DataFrame:
    frames = []
    for arquivo in pasta.glob("*.xlsx"):
        df = pd.read_excel(arquivo, sheet_name="Vendas")
        df["arquivo_origem"] = arquivo.name
        frames.append(df)
    return pd.concat(frames, ignore_index=True)
```

---

## Validação de Colunas

```python
def validar_colunas(df: pd.DataFrame, obrigatorias: set[str]) -> None:
    faltantes = obrigatorias - set(df.columns)
    if faltantes:
        raise ValueError(f"Colunas faltantes: {sorted(faltantes)}")
```

Valide antes de transformar. Erros de planilha devem aparecer cedo.

---

## Limpeza de Dados

```python
def limpar_vendas(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df["cliente"] = df["cliente"].astype(str).str.strip()
    df["data"] = pd.to_datetime(df["data"], errors="coerce")
    df["valor"] = pd.to_numeric(df["valor"], errors="coerce")
    df = df.dropna(subset=["cliente", "data", "valor"])
    return df
```

---

## Gerando Excel com Múltiplas Abas

```python
import pandas as pd
from pathlib import Path


def gerar_relatorio(vendas: pd.DataFrame, caminho: Path) -> None:
    resumo = (
        vendas.groupby("vendedor", as_index=False)
        .agg(total=("valor", "sum"), pedidos=("valor", "size"))
        .sort_values("total", ascending=False)
    )

    caminho.parent.mkdir(parents=True, exist_ok=True)
    with pd.ExcelWriter(caminho, engine="openpyxl") as writer:
        vendas.to_excel(writer, index=False, sheet_name="Base")
        resumo.to_excel(writer, index=False, sheet_name="Resumo")
```

---

## Estilos com OpenPyXL

```python
from openpyxl import load_workbook
from openpyxl.styles import Font, PatternFill
from openpyxl.utils import get_column_letter


def formatar_excel(caminho: str) -> None:
    wb = load_workbook(caminho)
    ws = wb["Resumo"]

    fill = PatternFill("solid", fgColor="1F4E78")
    font = Font(color="FFFFFF", bold=True)

    for cell in ws[1]:
        cell.fill = fill
        cell.font = font

    for coluna in ws.columns:
        largura = max(len(str(cell.value or "")) for cell in coluna) + 2
        letra = get_column_letter(coluna[0].column)
        ws.column_dimensions[letra].width = min(largura, 40)

    wb.save(caminho)
```

---

## Fórmulas

```python
from openpyxl import Workbook


wb = Workbook()
ws = wb.active
ws.title = "Calculo"
ws["A1"] = "Valor"
ws["A2"] = 100
ws["A3"] = 200
ws["A4"] = "=SUM(A2:A3)"
wb.save("calculo.xlsx")
```

O `openpyxl` escreve fórmulas, mas não recalcula como o Excel. O cálculo ocorre quando o arquivo é aberto no Excel ou por outro motor compatível.

---

## Projeto Completo: Relatório Mensal de Vendas

```python
from __future__ import annotations

from pathlib import Path
import argparse
import logging

import pandas as pd
from openpyxl import load_workbook
from openpyxl.styles import Font, PatternFill
from openpyxl.utils import get_column_letter


logger = logging.getLogger("relatorio_vendas")


def carregar_vendas(pasta: Path) -> pd.DataFrame:
    arquivos = sorted(pasta.glob("*.xlsx"))
    if not arquivos:
        raise FileNotFoundError("Nenhum arquivo .xlsx encontrado")

    frames = []
    for arquivo in arquivos:
        logger.info("Lendo %s", arquivo)
        df = pd.read_excel(arquivo, sheet_name="Vendas")
        df["arquivo_origem"] = arquivo.name
        frames.append(df)

    return pd.concat(frames, ignore_index=True)


def preparar(df: pd.DataFrame) -> pd.DataFrame:
    obrigatorias = {"data", "vendedor", "cliente", "valor"}
    faltantes = obrigatorias - set(df.columns)
    if faltantes:
        raise ValueError(f"Colunas faltantes: {sorted(faltantes)}")

    df = df.copy()
    df["data"] = pd.to_datetime(df["data"], errors="coerce")
    df["valor"] = pd.to_numeric(df["valor"], errors="coerce")
    df["vendedor"] = df["vendedor"].astype(str).str.strip()
    df = df.dropna(subset=["data", "vendedor", "valor"])
    return df


def criar_resumos(df: pd.DataFrame) -> dict[str, pd.DataFrame]:
    por_vendedor = df.groupby("vendedor", as_index=False).agg(
        total=("valor", "sum"),
        pedidos=("valor", "size"),
        ticket_medio=("valor", "mean"),
    )
    por_mes = df.assign(mes=df["data"].dt.to_period("M").astype(str)).groupby("mes", as_index=False).agg(
        total=("valor", "sum"),
        pedidos=("valor", "size"),
    )
    return {"Por Vendedor": por_vendedor, "Por Mês": por_mes}


def salvar(df: pd.DataFrame, resumos: dict[str, pd.DataFrame], saida: Path) -> None:
    saida.parent.mkdir(parents=True, exist_ok=True)
    with pd.ExcelWriter(saida, engine="openpyxl") as writer:
        df.to_excel(writer, index=False, sheet_name="Base Limpa")
        for nome, resumo in resumos.items():
            resumo.to_excel(writer, index=False, sheet_name=nome)


def formatar(saida: Path) -> None:
    wb = load_workbook(saida)
    fill = PatternFill("solid", fgColor="1F4E78")
    font = Font(color="FFFFFF", bold=True)

    for ws in wb.worksheets:
        ws.freeze_panes = "A2"
        for cell in ws[1]:
            cell.fill = fill
            cell.font = font
        for coluna in ws.columns:
            letra = get_column_letter(coluna[0].column)
            largura = max(len(str(cell.value or "")) for cell in coluna) + 2
            ws.column_dimensions[letra].width = min(largura, 45)

    wb.save(saida)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--entrada", required=True, type=Path)
    parser.add_argument("--saida", required=True, type=Path)
    args = parser.parse_args()

    logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | %(message)s")
    vendas = preparar(carregar_vendas(args.entrada))
    resumos = criar_resumos(vendas)
    salvar(vendas, resumos, args.saida)
    formatar(args.saida)
    logger.info("Relatório gerado em %s", args.saida)


if __name__ == "__main__":
    main()
```

---

## Google Sheets com `gspread`

```bash
pip install gspread google-auth
```

```python
import gspread
from google.oauth2.service_account import Credentials


SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]


def abrir_planilha(spreadsheet_id: str):
    creds = Credentials.from_service_account_file("service_account.json", scopes=SCOPES)
    client = gspread.authorize(creds)
    return client.open_by_key(spreadsheet_id)


sheet = abrir_planilha("ID_DA_PLANILHA").worksheet("Dados")
linhas = sheet.get_all_records()
sheet.append_row(["Ana", "ana@example.com", "ativo"])
```

Não versione `service_account.json`.

---

## Boas Práticas

- defina layout de entrada;
- valide colunas obrigatórias;
- trate datas, números e strings explicitamente;
- mantenha dados brutos separados dos dados tratados;
- gere logs por arquivo processado;
- evite editar manualmente a saída de automação;
- use nomes de abas estáveis;
- congele cabeçalhos e ajuste largura;
- proteja credenciais do Google Sheets;
- crie testes para funções de limpeza.

