# Análise e decomposição

Modele dados que variam no tempo.

## Pontos-chave

- Índice temporal e resampling
- Tendência, sazonalidade e ruído
- Autocorrelação (ACF/PACF)
- Estacionariedade

## Exemplo

```python
import pandas as pd
serie = pd.read_csv('vendas.csv', parse_dates=['data'], index_col='data')['valor']
mensal = serie.resample('M').sum()
print(mensal.rolling(3).mean())
```

## Boas práticas

- Garanta frequência regular
- Trate gaps e outliers

## Saiba mais

- [Documentação oficial](https://otexts.com/fpp3/)
