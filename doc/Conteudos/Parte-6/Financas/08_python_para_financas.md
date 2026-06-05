# Python para Financas

Python para financas combina coleta de dados, limpeza, calculos, simulacao, visualizacao, relatorios e automacao. O foco deve ser reprodutibilidade: o mesmo codigo, com os mesmos dados e premissas, deve gerar os mesmos resultados.

---

## Fluxo de Trabalho

```text
coleta -> validacao -> tratamento -> calculos -> analise -> relatorio -> revisao
```

Separar essas etapas evita notebooks confusos e reduz erros em projetos que crescem.

---

## Dados Financeiros

Fontes comuns:

- arquivos CSV e Excel;
- APIs de corretoras e provedores;
- bancos de dados;
- demonstrativos financeiros;
- dados publicos;
- planilhas internas;
- arquivos de extrato.

Problemas comuns:

- datas duplicadas;
- feriados e dias sem negociacao;
- valores faltantes;
- ajuste por dividendos e splits;
- moeda incorreta;
- timezone;
- dados revisados;
- colunas com formatos inconsistentes.

---

## Series Temporais com Pandas

```python
import pandas as pd

df = pd.DataFrame(
    {
        "data": ["2026-01-02", "2026-01-03", "2026-01-04"],
        "preco": [100, 101.5, 100.8],
    }
)

df["data"] = pd.to_datetime(df["data"])
df = df.set_index("data").sort_index()
df["retorno"] = df["preco"].pct_change()

print(df)
```

---

## Funcoes Financeiras Reutilizaveis

```python
def retorno_simples(precos):
    return precos.pct_change()

def retorno_acumulado(retornos):
    return (1 + retornos).cumprod() - 1

def max_drawdown(precos):
    pico = precos.cummax()
    drawdown = precos / pico - 1
    return drawdown.min()

def volatilidade_anualizada(retornos, periodos=252):
    return retornos.std() * (periodos ** 0.5)
```

Coloque funcoes reutilizaveis em modulos `.py`, nao apenas em celulas soltas de notebook.

---

## Visualizacao

```python
import matplotlib.pyplot as plt

df["preco"].plot(title="Preco do ativo")
plt.xlabel("Data")
plt.ylabel("Preco")
plt.tight_layout()
plt.show()
```

Graficos financeiros devem mostrar unidade, periodo, fonte e premissas relevantes.

---

## Relatorios

Relatorios podem ser gerados em:

- Excel;
- PDF;
- HTML;
- Markdown;
- dashboards;
- notebooks executados automaticamente.

Exemplo de exportacao para Excel:

```python
with pd.ExcelWriter("relatorio_financeiro.xlsx", engine="xlsxwriter") as writer:
    df.to_excel(writer, sheet_name="dados")
```

---

## Organizacao de Codigo

Evite projetos em que todo o trabalho vive em um unico notebook. Uma organizacao melhor:

```text
src/
├── coleta.py
├── tratamento.py
├── indicadores.py
├── risco.py
├── portfolio.py
└── relatorios.py
```

Notebooks devem ser usados para exploracao, apresentacao ou analise pontual. Calculos centrais devem ficar em funcoes testaveis.

---

## Validacao

Valide:

- colunas obrigatorias;
- tipos de dados;
- datas;
- ausencia de duplicatas;
- valores negativos inesperados;
- moedas;
- frequencia da serie;
- ranges plausiveis;
- soma de pesos da carteira.

```python
def validar_pesos(pesos, tolerancia=1e-9):
    total = sum(pesos.values())
    if abs(total - 1) > tolerancia:
        raise ValueError(f"Pesos devem somar 1. Soma atual: {total}")
```

---

## Testes

Calculos financeiros precisam de testes porque pequenos erros mudam decisoes.

```python
def valor_futuro(pv, taxa, periodos):
    return pv * (1 + taxa) ** periodos

def test_valor_futuro():
    assert round(valor_futuro(1000, 0.10, 2), 2) == 1210.00
```

---

## Boas Praticas

- Use nomes claros: `taxa_mensal`, `retorno_anual`, `fluxo_caixa`.
- Documente premissas.
- Versione dados de entrada quando possivel.
- Separe dados brutos de dados tratados.
- Nunca sobrescreva dados originais sem copia.
- Inclua custos, impostos e taxas quando aplicavel.
- Gere saidas auditaveis.
- Escreva testes para formulas importantes.

---

## Exercicios

1. Leia um CSV com datas e precos.
2. Calcule retornos diarios, retorno acumulado e volatilidade.
3. Crie uma funcao de max drawdown.
4. Exporte uma tabela de indicadores para Excel.
5. Organize um mini projeto com `src/`, `data/`, `notebooks/` e `reports/`.
