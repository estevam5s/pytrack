# Contabilidade e Indicadores Financeiros

Indicadores financeiros ajudam a interpretar empresas, projetos e operacoes. Eles nao substituem analise qualitativa, mas organizam sinais sobre rentabilidade, liquidez, endividamento, eficiencia e crescimento.

---

## Demonstrativos Principais

### DRE

A Demonstracao do Resultado do Exercicio mostra receitas, custos, despesas e lucro.

Estrutura simplificada:

```text
Receita liquida
(-) Custos
= Lucro bruto
(-) Despesas operacionais
= EBIT
(-) Resultado financeiro
(-) Impostos
= Lucro liquido
```

### Balanco patrimonial

Mostra ativos, passivos e patrimonio liquido em uma data.

```text
Ativo = Passivo + Patrimonio Liquido
```

### Fluxo de caixa

Mostra entradas e saidas de caixa separadas por:

- operacoes;
- investimentos;
- financiamentos.

Lucro e caixa podem divergir por prazo de recebimento, estoque, depreciacao, capex, impostos e capital de giro.

---

## Indicadores de Margem

```text
margem_bruta = lucro_bruto / receita_liquida
margem_ebit = ebit / receita_liquida
margem_liquida = lucro_liquido / receita_liquida
```

```python
receita = 1_000_000
lucro_bruto = 420_000
ebit = 180_000
lucro_liquido = 120_000

indicadores = {
    "margem_bruta": lucro_bruto / receita,
    "margem_ebit": ebit / receita,
    "margem_liquida": lucro_liquido / receita,
}

print({k: round(v, 4) for k, v in indicadores.items()})
```

---

## Indicadores de Liquidez

```text
liquidez_corrente = ativo_circulante / passivo_circulante
liquidez_seca = (ativo_circulante - estoques) / passivo_circulante
```

Liquidez alta nem sempre e boa. Pode indicar caixa ocioso, estoque excessivo ou baixa eficiencia. Liquidez baixa pode indicar risco operacional.

---

## Endividamento

```text
divida_liquida = divida_bruta - caixa
divida_liquida_ebitda = divida_liquida / ebitda
alavancagem = passivo_total / patrimonio_liquido
```

Endividamento precisa ser analisado com:

- previsibilidade de caixa;
- custo da divida;
- prazo de vencimento;
- moeda da divida;
- covenants;
- ciclo economico do setor.

---

## Rentabilidade

```text
ROE = lucro_liquido / patrimonio_liquido
ROA = lucro_liquido / ativo_total
ROIC = nopat / capital_investido
```

ROE alto pode ser excelente ou apenas resultado de alavancagem excessiva. Sempre compare com endividamento e qualidade do lucro.

---

## Multiplos de Mercado

```text
P/L = preco_por_acao / lucro_por_acao
P/VP = valor_de_mercado / patrimonio_liquido
EV/EBITDA = enterprise_value / ebitda
dividend_yield = dividendos_por_acao / preco_por_acao
```

Multiplos dependem de setor, crescimento, margem, risco, taxa de juros e ciclo economico. Um multiplo baixo pode indicar oportunidade ou problema estrutural.

---

## Exemplo com DataFrame

```python
import pandas as pd

df = pd.DataFrame(
    {
        "empresa": ["A", "B", "C"],
        "receita": [1000, 1200, 900],
        "lucro_liquido": [120, 80, -20],
        "patrimonio": [600, 500, 400],
        "divida_bruta": [300, 700, 250],
        "caixa": [100, 50, 40],
        "ebitda": [220, 180, 60],
    }
)

df["margem_liquida"] = df["lucro_liquido"] / df["receita"]
df["roe"] = df["lucro_liquido"] / df["patrimonio"]
df["divida_liquida"] = df["divida_bruta"] - df["caixa"]
df["dl_ebitda"] = df["divida_liquida"] / df["ebitda"]

print(df)
```

---

## Cuidados de Analise

- Compare empresas do mesmo setor.
- Use series historicas, nao apenas um ano isolado.
- Separe recorrente de nao recorrente.
- Verifique qualidade do caixa.
- Ajuste eventos extraordinarios.
- Leia notas explicativas quando disponiveis.
- Nao conclua valuation apenas por um multiplo.

---

## Exercicios

1. Calcule margem bruta, margem EBIT e margem liquida de uma empresa ficticia.
2. Calcule liquidez corrente e liquidez seca.
3. Compare duas empresas usando ROE e divida liquida/EBITDA.
4. Explique por que lucro liquido pode crescer enquanto caixa operacional cai.
5. Monte um DataFrame com indicadores de cinco empresas.
