# DataFrames rápidos e lazy

Polars é uma engine de DataFrame em Rust com execução lazy e paralela.

> **Tema:** Dados · **Nível:** intermediario · **Trilha:** Polars para Performance

## Conceitos-chave

Nesta lição você vai entender:

- **API expressiva com expressões**
- **LazyFrame e otimização de query**
- **Muito mais rápido que Pandas em grandes volumes**
- **Leitura direta de Parquet/CSV**

## Exemplo prático

```python
import polars as pl
q = (pl.scan_csv('dados.csv')
       .filter(pl.col('valor') > 0)
       .group_by('categoria').agg(pl.col('valor').sum()))
print(q.collect())
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Use scan_* + collect() para lazy
- Prefira expressões a apply

## Pratique

Para fixar, escreva um pequeno script que combine **api expressiva com expressões** e **lazyframe e otimização de query** em um caso do seu dia a dia. Depois refatore aplicando "Use scan_* + collect() para lazy".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: API expressiva com expressões
- [ ] Explicar e aplicar: LazyFrame e otimização de query
- [ ] Explicar e aplicar: Muito mais rápido que Pandas em grandes volumes
- [ ] Explicar e aplicar: Leitura direta de Parquet/CSV

## Saiba mais

- [Documentação oficial](https://docs.pola.rs/)
