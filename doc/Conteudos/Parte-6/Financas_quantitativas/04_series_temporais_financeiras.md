# Series Temporais Financeiras

Series temporais financeiras sao sequencias indexadas no tempo. Elas possuem propriedades especificas: ruido alto, nao estacionariedade, volatilidade agrupada, quebras estruturais e dependencia temporal instavel.

---

## Indexacao Temporal

```python
import pandas as pd

df = pd.DataFrame(
    {
        "data": ["2026-01-02", "2026-01-03", "2026-01-04"],
        "preco": [100, 101, 99],
    }
)

df["data"] = pd.to_datetime(df["data"])
df = df.set_index("data").sort_index()
print(df)
```

---

## Frequencia e Reamostragem

```python
mensal = df["preco"].resample("M").last()
```

Em financas, a escolha da frequencia muda o resultado. Diario, semanal, mensal e intraday capturam fenomenos diferentes.

---

## Janelas Moveis

```python
retornos = df["preco"].pct_change()
vol_20d = retornos.rolling(20).std() * 252**0.5
media_50d = df["preco"].rolling(50).mean()
```

Janelas moveis sao usadas para volatilidade, medias, momentum e sinais.

---

## Estacionariedade

Uma serie estacionaria tem propriedades estatisticas relativamente constantes no tempo.

Precos geralmente nao sao estacionarios. Retornos sao mais proximos de estacionariedade, mas ainda podem ter regimes.

```python
from statsmodels.tsa.stattools import adfuller

resultado = adfuller(retornos.dropna())
print(resultado[1])
```

P-valor baixo no ADF sugere rejeicao de raiz unitaria.

---

## Autocorrelacao

```python
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf
import matplotlib.pyplot as plt

plot_acf(retornos.dropna(), lags=20)
plt.show()
```

Autocorrelacao em retornos diarios costuma ser baixa, mas pode aparecer em volatilidade, spreads e dados intraday.

---

## ARIMA

```python
from statsmodels.tsa.arima.model import ARIMA

serie = retornos.dropna()
modelo = ARIMA(serie, order=(1, 0, 1)).fit()
print(modelo.summary())
```

ARIMA deve ser usado com diagnostico de residuos e validacao fora da amostra.

---

## Volatilidade Agrupada

Retornos financeiros mostram periodos de alta e baixa volatilidade.

```python
vol = retornos.rolling(30).std() * 252**0.5
vol.plot()
```

Modelos como ARCH/GARCH tentam capturar esse comportamento.

---

## Quebras Estruturais

Mercados mudam por juros, crise, regulacao, liquidez, tecnologia e comportamento. Um modelo ajustado em um regime pode falhar em outro.

---

## Exercicios

1. Transforme uma coluna de data em indice temporal.
2. Calcule retornos diarios e mensais.
3. Calcule volatilidade movel.
4. Teste estacionariedade com ADF.
5. Ajuste um ARIMA simples e avalie residuos.
