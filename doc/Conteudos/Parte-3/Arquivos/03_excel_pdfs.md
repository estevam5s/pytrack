# Manipulação de Excel e PDFs com Python

Este arquivo cobre manipulação profissional de planilhas Excel com `openpyxl` e `pandas`, além de leitura, extração, criação e manipulação de PDFs.

---

## Sumário

1. [Excel com Pandas](#excel-com-pandas)
2. [Excel com OpenPyXL](#excel-com-openpyxl)
3. [Múltiplas Abas](#múltiplas-abas)
4. [Formatação de Excel](#formatação-de-excel)
5. [PDFs: Leitura e Extração](#pdfs-leitura-e-extração)
6. [PDFs: Criação](#pdfs-criação)
7. [PDFs: Mesclar e Dividir](#pdfs-mesclar-e-dividir)
8. [OCR e PDFs Escaneados](#ocr-e-pdfs-escaneados)
9. [Boas Práticas](#boas-práticas)
10. [Exercícios](#exercícios)

---

## Excel com Pandas

Instalação:

```bash
python -m pip install pandas openpyxl xlsxwriter
```

Leitura:

```python
import pandas as pd

df = pd.read_excel("vendas.xlsx", sheet_name="Janeiro")
```

Escrita:

```python
df.to_excel("relatorio.xlsx", index=False)
```

Ler todas as abas:

```python
abas = pd.read_excel("arquivo.xlsx", sheet_name=None)

for nome_aba, df in abas.items():
    print(nome_aba, df.shape)
```

---

## Excel com OpenPyXL

`openpyxl` permite manipular células, estilos, fórmulas e planilhas.

```python
from openpyxl import Workbook

wb = Workbook()
ws = wb.active
ws.title = "Relatório"

ws["A1"] = "Produto"
ws["B1"] = "Valor"
ws.append(["Livro", 50])
ws.append(["Curso", 200])

wb.save("relatorio.xlsx")
```

Leitura:

```python
from openpyxl import load_workbook

wb = load_workbook("relatorio.xlsx")
ws = wb["Relatório"]

for linha in ws.iter_rows(min_row=2, values_only=True):
    print(linha)
```

---

## Múltiplas Abas

Com Pandas:

```python
with pd.ExcelWriter("relatorio.xlsx", engine="openpyxl") as writer:
    vendas.to_excel(writer, sheet_name="Vendas", index=False)
    clientes.to_excel(writer, sheet_name="Clientes", index=False)
```

Com `openpyxl`:

```python
ws2 = wb.create_sheet("Resumo")
ws2["A1"] = "Total"
ws2["B1"] = "=SUM(Relatório!B2:B100)"
```

---

## Formatação de Excel

```python
from openpyxl.styles import Font, PatternFill, Alignment

for celula in ws[1]:
    celula.font = Font(bold=True, color="FFFFFF")
    celula.fill = PatternFill("solid", fgColor="4F81BD")
    celula.alignment = Alignment(horizontal="center")
```

Ajustar largura:

```python
for coluna in ws.columns:
    letra = coluna[0].column_letter
    tamanho = max(len(str(c.value or "")) for c in coluna)
    ws.column_dimensions[letra].width = tamanho + 2
```

Congelar painel:

```python
ws.freeze_panes = "A2"
```

---

## PDFs: Leitura e Extração

Bibliotecas comuns:

- `pypdf`: mesclar, dividir, texto simples;
- `pdfplumber`: extração de texto e tabelas;
- `PyMuPDF` (`fitz`): leitura, renderização, metadados;
- `reportlab`: criação de PDF.

Instalação:

```bash
python -m pip install pypdf pdfplumber pymupdf reportlab
```

Texto com `pypdf`:

```python
from pypdf import PdfReader

reader = PdfReader("documento.pdf")

for pagina in reader.pages:
    texto = pagina.extract_text()
    print(texto)
```

Tabelas com `pdfplumber`:

```python
import pdfplumber

with pdfplumber.open("documento.pdf") as pdf:
    for pagina in pdf.pages:
        tabelas = pagina.extract_tables()
        for tabela in tabelas:
            print(tabela)
```

---

## PDFs: Criação

Com `reportlab`:

```python
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

c = canvas.Canvas("relatorio.pdf", pagesize=A4)
c.drawString(50, 800, "Relatório de Vendas")
c.drawString(50, 770, "Receita: R$ 10.000")
c.save()
```

PDF a partir de DataFrame pode ser feito gerando HTML e convertendo com ferramenta apropriada, ou usando ReportLab diretamente.

---

## PDFs: Mesclar e Dividir

Mesclar:

```python
from pypdf import PdfWriter

writer = PdfWriter()

for caminho in ["a.pdf", "b.pdf"]:
    writer.append(caminho)

with open("combinado.pdf", "wb") as saida:
    writer.write(saida)
```

Dividir:

```python
from pypdf import PdfReader, PdfWriter

reader = PdfReader("documento.pdf")

for indice, pagina in enumerate(reader.pages, start=1):
    writer = PdfWriter()
    writer.add_page(pagina)
    with open(f"pagina_{indice}.pdf", "wb") as saida:
        writer.write(saida)
```

---

## OCR e PDFs Escaneados

PDF escaneado é imagem. Extração de texto comum pode falhar.

Fluxo:

```text
PDF -> imagem -> OCR -> texto
```

Ferramentas:

- Tesseract;
- `pytesseract`;
- PyMuPDF para renderizar páginas;
- serviços cloud de OCR.

Exemplo conceitual:

```python
import fitz

doc = fitz.open("escaneado.pdf")
pagina = doc[0]
pix = pagina.get_pixmap(dpi=200)
pix.save("pagina.png")
```

Depois aplique OCR na imagem.

---

## Boas Práticas

- Use Pandas para dados tabulares.
- Use OpenPyXL para formatação e controle fino.
- Não confie cegamente em tabelas extraídas de PDF.
- PDF não é banco de dados.
- Valide resultados de extração.
- Cuidado com PDFs escaneados.
- Separe camada de extração da transformação.
- Proteja arquivos com dados sensíveis.

---

## Exercícios

1. Leia Excel com Pandas.
2. Escreva múltiplas abas.
3. Formate cabeçalho com OpenPyXL.
4. Extraia texto de PDF.
5. Extraia tabela com pdfplumber.
6. Crie PDF simples com ReportLab.
7. Mescle dois PDFs.
8. Divida PDF em páginas.

