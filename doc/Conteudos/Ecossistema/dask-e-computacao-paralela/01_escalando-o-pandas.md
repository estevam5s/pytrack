# Escalando o Pandas

Dask paraleliza APIs familiares para dados grandes.

> **Tema:** Paralelismo · **Nível:** avancado · **Trilha:** Dask e Computação Paralela

## Conceitos-chave

Nesta lição você vai entender:

- **DataFrame e Array distribuídos**
- **Avaliação lazy e compute()**
- **Paralelismo em multicore/cluster**
- **Familiar a quem usa Pandas/NumPy**

## Exemplo prático

```python
import dask.dataframe as dd
df = dd.read_csv('dados/*.csv')
resultado = df.groupby('categoria').valor.mean().compute()
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Use particionamento adequado
- Persista resultados intermediários

## Pratique

Para fixar, escreva um pequeno script que combine **dataframe e array distribuídos** e **avaliação lazy e compute()** em um caso do seu dia a dia. Depois refatore aplicando "Use particionamento adequado".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: DataFrame e Array distribuídos
- [ ] Explicar e aplicar: Avaliação lazy e compute()
- [ ] Explicar e aplicar: Paralelismo em multicore/cluster
- [ ] Explicar e aplicar: Familiar a quem usa Pandas/NumPy

## Saiba mais

- [Documentação oficial](https://docs.dask.org/)
