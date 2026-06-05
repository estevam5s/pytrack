# Projetos Excel + Python: Financeiro, Vendas, Estoque e Auditoria

Projetos práticos consolidam Excel porque combinam dados, fórmulas, tabelas, dashboards, validação, Python e automação. A ideia é construir arquivos úteis, auditáveis e fáceis de atualizar.

---

## Projeto 1: Controle Financeiro

Objetivo:

```text
registrar receitas/despesas
classificar categorias
calcular saldo
comparar orçamento vs realizado
gerar dashboard mensal
```

Abas:

```text
README
Parametros
Lancamentos
Categorias
Orcamento
Calculos
Dashboard
```

Campos em `Lancamentos`:

```text
data | tipo | categoria | descricao | valor | conta | status
```

Indicadores:

- receitas;
- despesas;
- saldo;
- variação mensal;
- top categorias;
- orçamento vs realizado.

---

## Projeto 2: Dashboard de Vendas

Objetivo:

```text
consolidar vendas
calcular KPIs
analisar vendedores/produtos/regiões
gerar dashboard executivo
```

Base:

```text
pedido_id | data | cliente_id | produto_id | vendedor | região | quantidade | valor | custo
```

Métricas:

```text
receita = soma(valor)
margem = soma(valor - custo)
ticket médio = receita / pedidos
quantidade vendida = soma(quantidade)
```

Com Python:

```python
import pandas as pd

vendas = pd.read_excel("vendas.xlsx", sheet_name="Base")
vendas["margem"] = vendas["valor"] - vendas["custo"]

resumo = (
    vendas.groupby("região", as_index=False)
    .agg(
        receita=("valor", "sum"),
        margem=("margem", "sum"),
        pedidos=("pedido_id", "nunique"),
    )
)

resumo["ticket_medio"] = resumo["receita"] / resumo["pedidos"]
resumo.to_excel("resumo_vendas.xlsx", index=False)
```

---

## Projeto 3: Controle de Estoque

Objetivo:

```text
registrar entradas e saídas
calcular saldo por SKU
alertar estoque mínimo
identificar giro lento
```

Abas:

```text
Produtos
Movimentacoes
Estoque_Atual
Alertas
Dashboard
```

Campos:

```text
sku | produto | categoria | estoque_minimo
data | sku | tipo_movimento | quantidade | documento
```

Regra:

```excel
Estoque Atual = Entradas - Saídas
```

Com Python, consolidar:

```python
mov = pd.read_excel("estoque.xlsx", sheet_name="Movimentacoes")
mov["sinal"] = mov["tipo_movimento"].map({"entrada": 1, "saida": -1})
mov["quantidade_ajustada"] = mov["quantidade"] * mov["sinal"]

saldo = (
    mov.groupby("sku", as_index=False)
    .agg(estoque_atual=("quantidade_ajustada", "sum"))
)
```

---

## Projeto 4: Auditoria de Planilhas

Objetivo:

```text
verificar arquivos recebidos
validar colunas obrigatórias
identificar linhas inválidas
gerar relatório de erros
```

Validações:

- colunas obrigatórias;
- tipos;
- datas;
- valores negativos;
- duplicidades;
- chaves ausentes;
- e-mails inválidos;
- total financeiro.

Python:

```python
def auditar_vendas(df: pd.DataFrame) -> pd.DataFrame:
    erros = []

    for index, row in df.iterrows():
        if pd.isna(row.get("pedido_id")):
            erros.append({"linha": index + 2, "erro": "pedido_id vazio"})

        if row.get("valor", 0) < 0:
            erros.append({"linha": index + 2, "erro": "valor negativo"})

    return pd.DataFrame(erros)
```

Saída:

```text
arquivo_auditado.xlsx
relatorio_erros.xlsx
```

---

## Projeto 5: Consolidador de Arquivos Mensais

Objetivo:

```text
ler todos os arquivos de uma pasta
padronizar colunas
consolidar base
gerar resumo por mês
```

Python:

```python
from pathlib import Path
import pandas as pd


def consolidar(pasta: str) -> pd.DataFrame:
    frames = []
    for arquivo in Path(pasta).glob("*.xlsx"):
        df = pd.read_excel(arquivo)
        df["arquivo_origem"] = arquivo.name
        frames.append(df)

    return pd.concat(frames, ignore_index=True)
```

Controle:

```text
arquivos_lidos
linhas_por_arquivo
linhas_total
erros
data_execucao
```

---

## Projeto 6: Relatório Automático por Cliente

Objetivo:

```text
gerar um Excel por cliente
com resumo, base filtrada e gráficos
```

Fluxo:

```text
base completa
-> agrupar por cliente
-> gerar arquivo cliente_a.xlsx
-> gerar arquivo cliente_b.xlsx
-> registrar saída
```

Python:

```python
def gerar_por_cliente(vendas: pd.DataFrame, output_dir: str) -> None:
    for cliente_id, df_cliente in vendas.groupby("cliente_id"):
        arquivo = f"{output_dir}/relatorio_cliente_{cliente_id}.xlsx"

        resumo = (
            df_cliente.groupby("produto", as_index=False)
            .agg(receita=("valor", "sum"), pedidos=("pedido_id", "nunique"))
        )

        with pd.ExcelWriter(arquivo, engine="xlsxwriter") as writer:
            resumo.to_excel(writer, sheet_name="Resumo", index=False)
            df_cliente.to_excel(writer, sheet_name="Base", index=False)
```

---

## Padrão de Entrega Profissional

Todo projeto deve ter:

```text
README
fonte dos dados
dicionário de colunas
regras de cálculo
modo de atualização
responsável
data de atualização
validações
limitações conhecidas
```

Sem documentação, o projeto depende da memória de quem criou.

---

## Checklist de Projeto

- O problema de negócio está claro?
- A fonte dos dados está documentada?
- A base está em formato tabular?
- Há validações?
- Fórmulas são auditáveis?
- Dashboard responde perguntas reais?
- Python é usado onde reduz trabalho manual?
- Saídas são versionadas?
- Há logs ou relatório de execução?
- Outra pessoa consegue manter?

Projetos Excel + Python são fortes quando unem familiaridade do Excel com confiabilidade de automação. O objetivo é entregar análise útil sem criar dependência de processos manuais frágeis.

