# Forecasting

Previsão com modelos estatísticos e ML.

> **Tema:** Séries Temporais · **Nível:** avancado · **Trilha:** Séries Temporais

## Conceitos-chave

Nesta lição você vai entender:

- **ARIMA/SARIMA com statsmodels**
- **Prophet para sazonalidade**
- **Validação com janela deslizante**
- **Métricas (MAE, RMSE, MAPE)**

## Exemplo prático

```python
from statsmodels.tsa.arima.model import ARIMA
modelo = ARIMA(serie, order=(1,1,1)).fit()
print(modelo.forecast(12))
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Valide no tempo (não embaralhe)
- Compare com baseline ingênuo

## Pratique

Para fixar, escreva um pequeno script que combine **arima/sarima com statsmodels** e **prophet para sazonalidade** em um caso do seu dia a dia. Depois refatore aplicando "Valide no tempo (não embaralhe)".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: ARIMA/SARIMA com statsmodels
- [ ] Explicar e aplicar: Prophet para sazonalidade
- [ ] Explicar e aplicar: Validação com janela deslizante
- [ ] Explicar e aplicar: Métricas (MAE, RMSE, MAPE)

## Saiba mais

- [Documentação oficial](https://www.statsmodels.org/)
