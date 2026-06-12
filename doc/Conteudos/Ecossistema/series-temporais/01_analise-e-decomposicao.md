# Análise e decomposição

Modele dados que variam no tempo.

> **Tema:** Séries Temporais · **Nível:** avancado · **Trilha:** Séries Temporais

## Conceitos-chave

Nesta lição você vai entender:

- **Índice temporal e resampling**
- **Tendência, sazonalidade e ruído**
- **Autocorrelação (ACF/PACF)**
- **Estacionariedade**

## Exemplo prático

```python
import pandas as pd
serie = pd.read_csv('vendas.csv', parse_dates=['data'], index_col='data')['valor']
mensal = serie.resample('M').sum()
print(mensal.rolling(3).mean())
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Garanta frequência regular
- Trate gaps e outliers

## Pratique

Para fixar, escreva um pequeno script que combine **índice temporal e resampling** e **tendência, sazonalidade e ruído** em um caso do seu dia a dia. Depois refatore aplicando "Garanta frequência regular".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Índice temporal e resampling
- [ ] Explicar e aplicar: Tendência, sazonalidade e ruído
- [ ] Explicar e aplicar: Autocorrelação (ACF/PACF)
- [ ] Explicar e aplicar: Estacionariedade

## Saiba mais

- [Documentação oficial](https://otexts.com/fpp3/)
