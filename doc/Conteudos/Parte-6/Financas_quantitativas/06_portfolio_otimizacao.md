# Portfolio Quantitativo e Otimizacao

Portfolio quantitativo combina ativos, pesos, restricoes e objetivos de forma sistematica. O foco e melhorar relacao risco-retorno, controlar exposicoes e evitar concentracoes indesejadas.

---

## Retorno de Carteira

```python
import numpy as np

pesos = np.array([0.5, 0.3, 0.2])
retornos_esperados = np.array([0.12, 0.08, 0.15])

retorno_portfolio = pesos @ retornos_esperados
print(retorno_portfolio)
```

---

## Risco de Carteira

```python
cov = np.array(
    [
        [0.04, 0.01, 0.02],
        [0.01, 0.03, 0.01],
        [0.02, 0.01, 0.05],
    ]
)

vol = (pesos.T @ cov @ pesos) ** 0.5
print(vol)
```

O risco depende de volatilidades e correlacoes, nao apenas do risco individual.

---

## Fronteira Eficiente

A fronteira eficiente contem carteiras com menor risco para cada nivel de retorno esperado, dentro das premissas.

Problema classico:

```text
min w'Σw
sujeito a soma(w) = 1
```

Premissas de retorno esperado e covariancia sao instaveis. Otimizadores podem gerar pesos extremos.

---

## Otimizacao com SciPy

```python
from scipy.optimize import minimize

def volatilidade_portfolio(w, cov):
    return (w.T @ cov @ w) ** 0.5

n = 3
restricoes = {"type": "eq", "fun": lambda w: w.sum() - 1}
limites = [(0, 1)] * n
inicial = np.ones(n) / n

res = minimize(
    volatilidade_portfolio,
    inicial,
    args=(cov,),
    bounds=limites,
    constraints=restricoes,
)

print(res.x)
```

---

## Sharpe Ratio

```text
Sharpe = (retorno - livre_risco) / volatilidade
```

```python
def sharpe(w, retornos, cov, rf=0.0):
    ret = w @ retornos
    vol = (w.T @ cov @ w) ** 0.5
    return (ret - rf) / vol
```

Maximizar Sharpe pode gerar alocacoes instaveis se retornos esperados forem mal estimados.

---

## Risk Parity

Risk parity tenta equilibrar contribuicoes de risco.

Contribuicao marginal:

```text
Σw / volatilidade
```

Contribuicao total de risco:

```text
w_i * (Σw)_i / volatilidade
```

---

## Rebalanceamento

Tipos:

- calendario;
- bandas;
- volatilidade alvo;
- sinal;
- risco;
- fluxo de caixa.

Rebalancear reduz desvio da politica, mas aumenta custos e impostos.

---

## Restricoes Realistas

- peso minimo e maximo;
- limite setorial;
- limite por ativo;
- long-only ou long-short;
- alavancagem;
- liquidez;
- turnover;
- tracking error;
- exposicao cambial;
- beta alvo.

---

## Exercicios

1. Calcule retorno e volatilidade de carteira.
2. Otimize uma carteira de minima variancia.
3. Maximize Sharpe com restricao de soma dos pesos.
4. Calcule contribuicao de risco por ativo.
5. Simule rebalanceamento mensal.
