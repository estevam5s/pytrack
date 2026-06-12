# Portfolio e Backtesting

Portfolio e o conjunto de ativos de uma carteira. Backtesting e a simulacao de uma estrategia usando dados historicos. O objetivo nao e provar que uma estrategia funcionara, mas entender comportamento, riscos, custos, sensibilidade e fragilidades.

---

## Retorno de Carteira

O retorno da carteira e a media ponderada dos retornos dos ativos.

```text
retorno_carteira = soma(peso_i * retorno_i)
```

```python
import numpy as np

pesos = np.array([0.5, 0.3, 0.2])
retornos = np.array([0.10, 0.08, 0.15])
retorno = np.dot(pesos, retornos)
print(round(retorno, 4))
```

---

## Risco de Carteira

O risco depende de volatilidades e correlacoes.

```text
variancia = pesos.T * matriz_covariancia * pesos
```

```python
import numpy as np

pesos = np.array([0.5, 0.3, 0.2])
cov = np.array(
    [
        [0.04, 0.01, 0.02],
        [0.01, 0.03, 0.01],
        [0.02, 0.01, 0.05],
    ]
)

vol = (pesos.T @ cov @ pesos) ** 0.5
print(round(vol, 4))
```

Diversificacao funciona quando ativos nao se movem perfeitamente juntos. Em crises, correlacoes podem subir.

---

## Rebalanceamento

Rebalancear e ajustar os pesos da carteira de volta a uma politica desejada.

Tipos:

- por calendario;
- por bandas;
- por evento;
- por risco;
- por aporte ou resgate.

Rebalanceamento controla concentracao, mas pode gerar custos e impostos.

---

## Metricas de Performance

- retorno acumulado;
- retorno anualizado;
- volatilidade anualizada;
- Sharpe;
- Sortino;
- max drawdown;
- hit rate;
- turnover;
- custo operacional;
- exposicao por classe;
- tracking error.

Sharpe:

```text
Sharpe = (retorno_carteira - taxa_livre_risco) / volatilidade
```

```python
retorno_anual = 0.14
livre_risco = 0.10
vol_anual = 0.18
sharpe = (retorno_anual - livre_risco) / vol_anual
print(round(sharpe, 4))
```

---

## Backtesting Correto

Um backtest profissional precisa evitar:

- look-ahead bias: usar dados que nao existiam na epoca;
- survivorship bias: ignorar ativos que deixaram de existir;
- overfitting: ajustar demais ao passado;
- custos irreais;
- liquidez ignorada;
- execucao impossivel;
- amostra curta;
- regras subjetivas.

---

## Esqueleto de Backtest

```python
import pandas as pd

precos = pd.DataFrame(
    {
        "A": [100, 102, 101, 105, 107],
        "B": [50, 51, 52, 51, 53],
    }
)

retornos = precos.pct_change().dropna()
pesos = pd.Series({"A": 0.6, "B": 0.4})

retorno_carteira = retornos.mul(pesos, axis=1).sum(axis=1)
patrimonio = (1 + retorno_carteira).cumprod()

print(patrimonio)
```

---

## Fronteira Eficiente

A fronteira eficiente representa carteiras com melhor retorno esperado para cada nivel de risco, dentro das premissas usadas.

Limites praticos:

- retorno esperado e incerto;
- matriz de covariancia muda;
- custos e impostos importam;
- restricoes de liquidez podem impedir a carteira teorica;
- otimizadores sao sensiveis a pequenas mudancas.

---

## Checklist

- As regras eram conhecidas antes do periodo testado?
- Os dados estao ajustados corretamente?
- Custos e impostos foram considerados?
- Existe liquidez suficiente?
- A estrategia depende de poucos eventos?
- O resultado sobrevive a outros periodos?
- A carteira respeita limites de risco?

---

## Exercicios

1. Calcule retorno de uma carteira com tres ativos.
2. Calcule volatilidade usando matriz de covariancia.
3. Simule um patrimonio acumulado com retornos diarios.
4. Calcule Sharpe e max drawdown.
5. Crie uma regra simples de rebalanceamento mensal.
