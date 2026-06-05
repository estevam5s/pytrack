# Limpeza e performance

Tratamento de nulos, tipos e otimização de memória.

## Pontos-chave

- dropna/fillna e detecção de outliers
- astype e downcast para reduzir memória
- datas com to_datetime e features temporais
- read_csv com dtypes e chunksize

## Exemplo

```python
df['data'] = pd.to_datetime(df['data'])
df['mes'] = df['data'].dt.month
df['categoria'] = df['categoria'].astype('category')
```

## Boas práticas

- Trate nulos conforme o mecanismo de ausência
- Carregue só as colunas necessárias

## Saiba mais

- [Documentação oficial](https://pandas.pydata.org/docs/user_guide/)
