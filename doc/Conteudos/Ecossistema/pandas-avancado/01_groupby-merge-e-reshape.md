# GroupBy, merge e reshape

Operações poderosas para transformar dados tabulares.

> **Tema:** Dados · **Nível:** avancado · **Trilha:** Pandas Avançado

## Conceitos-chave

Nesta lição você vai entender:

- **groupby + agg para estatísticas por grupo**
- **merge/join entre DataFrames**
- **pivot_table e melt para reshape**
- **Operações vetorizadas em vez de loops**

## Exemplo prático

```python
import pandas as pd
resumo = (df.groupby('categoria')
            .agg(total=('valor','sum'), media=('valor','mean'))
            .reset_index())
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Vetorize: evite apply linha a linha
- Use categorias para colunas de baixa cardinalidade

## Pratique

Para fixar, escreva um pequeno script que combine **groupby + agg para estatísticas por grupo** e **merge/join entre dataframes** em um caso do seu dia a dia. Depois refatore aplicando "Vetorize: evite apply linha a linha".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: groupby + agg para estatísticas por grupo
- [ ] Explicar e aplicar: merge/join entre DataFrames
- [ ] Explicar e aplicar: pivot_table e melt para reshape
- [ ] Explicar e aplicar: Operações vetorizadas em vez de loops

## Saiba mais

- [Documentação oficial](https://pandas.pydata.org/docs/)
