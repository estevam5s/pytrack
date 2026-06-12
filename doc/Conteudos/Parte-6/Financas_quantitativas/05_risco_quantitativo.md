# Risco Quantitativo: VaR, Expected Shortfall, Drawdown e Stress

Risco quantitativo mede perdas potenciais, sensibilidade, concentracao e comportamento em cenarios extremos. O objetivo nao e prever o futuro com certeza, mas tornar exposicoes explicitas e controlaveis.

---

## Volatilidade

```python
vol_diaria = retornos.std()
vol_anual = vol_diaria * 252**0.5
```

Volatilidade mede dispersao, nao perda permanente. Ela e incompleta, mas util.

---

## Drawdown

```python
patrimonio = (1 + retornos).cumprod()
pico = patrimonio.cummax()
drawdown = patrimonio / pico - 1
max_drawdown = drawdown.min()
```

Drawdown mede sofrimento de percurso. Estrategias com mesmo retorno podem ter experiencias muito diferentes.

---

## VaR Historico

```python
var_95 = retornos.quantile(0.05)
```

Interpreta-se como perda que foi excedida em cerca de 5% dos casos historicos.

---

## Expected Shortfall

```python
limite = retornos.quantile(0.05)
es_95 = retornos[retornos <= limite].mean()
```

Expected Shortfall mede a media das perdas na cauda. E mais informativo que VaR para eventos extremos.

---

## VaR Parametrico

```python
from scipy.stats import norm

media = retornos.mean()
vol = retornos.std()
var_parametrico = media + vol * norm.ppf(0.05)
```

Assume distribuicao, geralmente normal. Cuidado com caudas pesadas.

---

## Stress Testing

```python
carteira = {
    "acoes": 0.60,
    "juros": 0.25,
    "dolar": 0.15,
}

choques = {
    "acoes": -0.25,
    "juros": -0.08,
    "dolar": 0.12,
}

impacto = sum(carteira[k] * choques[k] for k in carteira)
print(impacto)
```

Stress deve refletir cenarios plausiveis e extremos.

---

## Risco de Concentracao

```python
pesos = pd.Series({"A": 0.40, "B": 0.25, "C": 0.20, "D": 0.15})
hhi = (pesos**2).sum()
print(hhi)
```

HHI alto indica concentracao.

---

## Margem de Erro dos Modelos

Modelos de risco falham quando:

- distribuicao muda;
- correlacoes sobem;
- liquidez desaparece;
- dados historicos nao representam o futuro;
- posicoes sao grandes demais;
- ha alavancagem escondida.

---

## Exercicios

1. Calcule volatilidade anualizada.
2. Calcule max drawdown.
3. Calcule VaR historico e parametrico.
4. Calcule Expected Shortfall.
5. Monte tres cenarios de stress.
