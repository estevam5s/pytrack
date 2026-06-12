# Criando boas features

A qualidade das features define o teto do modelo.

## Pontos-chave

- Encoding de categóricas (one-hot, target)
- Escalonamento e transformações
- Features de data/texto/agregação
- Seleção de features

## Exemplo

```python
import pandas as pd
df = pd.get_dummies(df, columns=['categoria'])
df['log_valor'] = np.log1p(df['valor'])
df['dia_semana'] = df['data'].dt.dayofweek
```

## Boas práticas

- Evite vazamento de dados
- Documente cada feature

## Saiba mais

- [Documentação oficial](https://feature-engine.trainindata.com/)
