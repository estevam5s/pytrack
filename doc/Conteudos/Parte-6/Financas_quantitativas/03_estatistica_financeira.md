# Estatistica Aplicada a Mercados Financeiros

Estatistica e a base para avaliar incerteza, estimar parametros, testar hipoteses e evitar conclusoes falsas em mercados financeiros.

---

## Media, Mediana e Dispersao

```python
import pandas as pd

retornos = pd.Series([0.01, -0.02, 0.015, 0.005, -0.01])

print(retornos.mean())
print(retornos.median())
print(retornos.std())
print(retornos.var())
```

Media e sensivel a outliers. Mediana pode ser mais robusta.

---

## Assimetria e Curtose

```python
print(retornos.skew())
print(retornos.kurtosis())
```

Mercados frequentemente apresentam caudas mais pesadas que a normal. Ignorar isso subestima risco extremo.

---

## Correlacao e Covariancia

```python
dados = pd.DataFrame(
    {
        "A": [0.01, 0.02, -0.01, 0.005],
        "B": [0.015, 0.01, -0.02, 0.004],
    }
)

print(dados.cov())
print(dados.corr())
```

Correlacao muda no tempo e tende a aumentar em crises.

---

## Distribuicao Normal

```python
from scipy.stats import norm

prob = norm.cdf(1.96)
densidade = norm.pdf(0)

print(prob, densidade)
```

A normal e util, mas limitada para retornos financeiros por causa de assimetria, caudas pesadas e volatilidade variante no tempo.

---

## Intervalo de Confianca

```python
import scipy.stats as st

media = retornos.mean()
erro = st.sem(retornos)
ic = st.t.interval(0.95, len(retornos) - 1, loc=media, scale=erro)
print(ic)
```

Com amostras pequenas, incerteza e grande.

---

## Teste de Hipotese

Exemplo: testar se media dos retornos e diferente de zero.

```python
from scipy.stats import ttest_1samp

estatistica, pvalor = ttest_1samp(retornos, 0)
print(estatistica, pvalor)
```

P-valor nao mede tamanho do efeito. Um resultado estatisticamente significativo pode ser economicamente irrelevante.

---

## Regressao Linear

```python
import statsmodels.api as sm

y = dados["A"]
x = sm.add_constant(dados["B"])
modelo = sm.OLS(y, x).fit()
print(modelo.summary())
```

Em financas, regressao exige cuidado com autocorrelacao, heterocedasticidade, outliers e instabilidade de parametros.

---

## Bootstrap

```python
import numpy as np

amostras = []
for _ in range(1000):
    sorteio = retornos.sample(frac=1, replace=True)
    amostras.append(sorteio.mean())

print(np.percentile(amostras, [2.5, 97.5]))
```

Bootstrap estima incerteza sem assumir distribuicao normal, mas ainda depende da representatividade da amostra.

---

## Exercicios

1. Calcule media, mediana, volatilidade, assimetria e curtose.
2. Compare distribuicao empirica com normal.
3. Teste se uma serie tem media diferente de zero.
4. Rode uma regressao entre ativo e benchmark.
5. Use bootstrap para intervalo da media.
