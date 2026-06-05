# Janelas e séries temporais

Rolling, resample e análise temporal.

## Pontos-chave

- rolling() para médias móveis
- resample() para reamostrar séries
- shift() para defasagens
- Index temporal e fuso

## Exemplo

```python
df.set_index('data').resample('M')['valor'].sum()
df['media_movel'] = df['valor'].rolling(7).mean()
```

## Boas práticas

- Cuide do alinhamento de índices
- Documente o fuso horário

## Saiba mais

- [Documentação oficial](https://pandas.pydata.org/docs/user_guide/timeseries.html)
