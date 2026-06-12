# Fundamentos, Ambiente e Fluxo de Trabalho em Dados

Este arquivo estabelece a base profissional para Ciência de Dados, Análise e Engenharia de Dados com Python: ambiente, organização, ciclo de trabalho, tipos de problemas, estrutura de projeto e práticas de reprodutibilidade.

---

## Sumário

1. [Papéis em Dados](#papéis-em-dados)
2. [Ciclo de Vida de um Projeto de Dados](#ciclo-de-vida-de-um-projeto-de-dados)
3. [Ambiente Python](#ambiente-python)
4. [Estrutura de Projeto](#estrutura-de-projeto)
5. [Dados Brutos, Tratados e Curados](#dados-brutos-tratados-e-curados)
6. [Notebooks vs Scripts](#notebooks-vs-scripts)
7. [Reprodutibilidade](#reprodutibilidade)
8. [Pequeno Projeto Inicial](#pequeno-projeto-inicial)
9. [Boas Práticas](#boas-práticas)
10. [Exercícios](#exercícios)

---

## Papéis em Dados

### Análise de Dados

Foco em perguntas, métricas, relatórios, dashboards e suporte à decisão.

Entregáveis:

- tabelas tratadas;
- análises exploratórias;
- gráficos;
- dashboards;
- relatórios;
- recomendações.

### Ciência de Dados

Foco em modelagem estatística, experimentação, predição e inferência.

Entregáveis:

- EDA profunda;
- hipóteses;
- modelos;
- validação;
- experimentos;
- interpretação.

### Engenharia de Dados

Foco em coleta, transformação, qualidade, armazenamento e entrega confiável de dados.

Entregáveis:

- pipelines;
- data lakes;
- data warehouses;
- orquestração;
- contratos de dados;
- monitoramento;
- governança.

---

## Ciclo de Vida de um Projeto de Dados

```text
pergunta de negócio
  ↓
fontes de dados
  ↓
coleta
  ↓
limpeza
  ↓
transformação
  ↓
análise exploratória
  ↓
modelagem ou dashboard
  ↓
validação
  ↓
comunicação
  ↓
produção e monitoramento
```

Perguntas essenciais:

- qual decisão será tomada?
- qual métrica importa?
- qual é a unidade de análise?
- quais dados são confiáveis?
- qual frequência de atualização?
- quem consome o resultado?

---

## Ambiente Python

Crie ambiente virtual:

```bash
python -m venv .venv
source .venv/bin/activate
```

Instale dependências principais:

```bash
python -m pip install numpy pandas polars scipy matplotlib seaborn plotly bokeh jupyter pyarrow
```

Dependências úteis:

```bash
python -m pip install duckdb sqlalchemy pandera great-expectations streamlit
```

Ferramentas de qualidade:

```bash
python -m pip install pytest ruff mypy pre-commit
```

---

## Estrutura de Projeto

```text
projeto_dados/
  README.md
  pyproject.toml
  .env
  data/
    raw/
    bronze/
    silver/
    gold/
  notebooks/
  src/
    projeto_dados/
      __init__.py
      extract.py
      transform.py
      validate.py
      load.py
      features.py
      plots.py
  tests/
  reports/
  dashboards/
```

Separação recomendada:

- `raw`: dado original imutável;
- `bronze`: dado ingerido com pouca transformação;
- `silver`: dado limpo e padronizado;
- `gold`: dado pronto para consumo;
- `src`: código reutilizável;
- `notebooks`: exploração;
- `tests`: validação automatizada;
- `reports`: entregáveis.

---

## Dados Brutos, Tratados e Curados

Nunca sobrescreva dados brutos.

```python
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[1]
RAW_DIR = BASE_DIR / "data" / "raw"
SILVER_DIR = BASE_DIR / "data" / "silver"
GOLD_DIR = BASE_DIR / "data" / "gold"
```

Exemplo:

```python
import pandas as pd

def carregar_vendas(caminho):
    return pd.read_csv(caminho)

def limpar_vendas(df):
    df = df.copy()
    df.columns = df.columns.str.strip().str.lower()
    df["data"] = pd.to_datetime(df["data"], errors="coerce")
    df["valor"] = pd.to_numeric(df["valor"], errors="coerce")
    return df.dropna(subset=["data", "valor"])

def salvar_curado(df, caminho):
    df.to_parquet(caminho, index=False)
```

---

## Notebooks vs Scripts

Use notebooks para:

- exploração;
- prototipagem;
- visualização;
- comunicação inicial.

Use scripts/pacotes para:

- pipelines recorrentes;
- testes;
- produção;
- transformações reutilizáveis;
- automação.

Fluxo profissional:

1. explorar em notebook;
2. extrair funções para `src`;
3. testar funções;
4. criar pipeline;
5. documentar decisões.

---

## Reprodutibilidade

Um projeto reprodutível informa:

- versão do Python;
- dependências;
- fonte dos dados;
- data de extração;
- parâmetros;
- comandos de execução;
- outputs esperados.

Exemplo de função determinística:

```python
def calcular_receita_total(df):
    return df["valor"].sum()
```

Exemplo com aleatoriedade controlada:

```python
import numpy as np

rng = np.random.default_rng(seed=42)
amostra = rng.normal(size=100)
```

---

## Pequeno Projeto Inicial

```python
import pandas as pd

vendas = pd.DataFrame(
    {
        "produto": ["A", "B", "A", "C"],
        "categoria": ["livro", "curso", "livro", "curso"],
        "valor": [50, 200, 70, 150],
    }
)

relatorio = (
    vendas
    .groupby("categoria", as_index=False)
    .agg(receita=("valor", "sum"), pedidos=("valor", "count"))
    .sort_values("receita", ascending=False)
)

print(relatorio)
```

Transformando em função:

```python
def receita_por_categoria(vendas: pd.DataFrame) -> pd.DataFrame:
    return (
        vendas
        .groupby("categoria", as_index=False)
        .agg(receita=("valor", "sum"), pedidos=("valor", "count"))
        .sort_values("receita", ascending=False)
    )
```

---

## Boas Práticas

- Defina pergunta antes de analisar.
- Preserve dados brutos.
- Use nomes claros de colunas.
- Separe notebook exploratório de código produtivo.
- Escreva funções puras para transformações.
- Versione código e ambiente.
- Documente origem e significado dos dados.
- Valide qualidade antes de confiar em métricas.
- Prefira formatos colunares para dados maiores.

---

## Exercícios

1. Crie a estrutura de pastas de um projeto de dados.
2. Crie um ambiente virtual e instale as bibliotecas principais.
3. Gere um DataFrame pequeno de vendas.
4. Crie uma função de relatório por categoria.
5. Salve o resultado em CSV e Parquet.
6. Documente fonte, objetivo e saída do projeto.
7. Transforme um notebook exploratório em script reutilizável.

