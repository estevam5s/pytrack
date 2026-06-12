# Janelas e séries temporais

Rolling, resample e análise temporal.

> **Tema:** Dados · **Nível:** avancado · **Trilha:** Pandas Avançado

## Conceitos-chave

Nesta lição você vai entender:

- **rolling() para médias móveis**
- **resample() para reamostrar séries**
- **shift() para defasagens**
- **Index temporal e fuso**

## Exemplo prático

```python
df.set_index('data').resample('M')['valor'].sum()
df['media_movel'] = df['valor'].rolling(7).mean()
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Cuide do alinhamento de índices
- Documente o fuso horário

## Pratique

Para fixar, escreva um pequeno script que combine **rolling() para médias móveis** e **resample() para reamostrar séries** em um caso do seu dia a dia. Depois refatore aplicando "Cuide do alinhamento de índices".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: rolling() para médias móveis
- [ ] Explicar e aplicar: resample() para reamostrar séries
- [ ] Explicar e aplicar: shift() para defasagens
- [ ] Explicar e aplicar: Index temporal e fuso

## Saiba mais

- [Documentação oficial](https://pandas.pydata.org/docs/user_guide/timeseries.html)
