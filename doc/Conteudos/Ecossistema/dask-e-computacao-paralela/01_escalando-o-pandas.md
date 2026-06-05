# Escalando o Pandas

Dask paraleliza APIs familiares para dados grandes.

## Pontos-chave

- DataFrame e Array distribuídos
- Avaliação lazy e compute()
- Paralelismo em multicore/cluster
- Familiar a quem usa Pandas/NumPy

## Exemplo

```python
import dask.dataframe as dd
df = dd.read_csv('dados/*.csv')
resultado = df.groupby('categoria').valor.mean().compute()
```

## Boas práticas

- Use particionamento adequado
- Persista resultados intermediários

## Saiba mais

- [Documentação oficial](https://docs.dask.org/)
