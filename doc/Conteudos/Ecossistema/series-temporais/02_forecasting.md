# Forecasting

Previsão com modelos estatísticos e ML.

## Pontos-chave

- ARIMA/SARIMA com statsmodels
- Prophet para sazonalidade
- Validação com janela deslizante
- Métricas (MAE, RMSE, MAPE)

## Exemplo

```python
from statsmodels.tsa.arima.model import ARIMA
modelo = ARIMA(serie, order=(1,1,1)).fit()
print(modelo.forecast(12))
```

## Boas práticas

- Valide no tempo (não embaralhe)
- Compare com baseline ingênuo

## Saiba mais

- [Documentação oficial](https://www.statsmodels.org/)
