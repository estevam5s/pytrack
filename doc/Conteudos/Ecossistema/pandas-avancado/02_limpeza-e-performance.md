# Limpeza e performance

Tratamento de nulos, tipos e otimização de memória.

> **Tema:** Dados · **Nível:** avancado · **Trilha:** Pandas Avançado

## Conceitos-chave

Nesta lição você vai entender:

- **dropna/fillna e detecção de outliers**
- **astype e downcast para reduzir memória**
- **datas com to_datetime e features temporais**
- **read_csv com dtypes e chunksize**

## Exemplo prático

```python
df['data'] = pd.to_datetime(df['data'])
df['mes'] = df['data'].dt.month
df['categoria'] = df['categoria'].astype('category')
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Trate nulos conforme o mecanismo de ausência
- Carregue só as colunas necessárias

## Pratique

Para fixar, escreva um pequeno script que combine **dropna/fillna e detecção de outliers** e **astype e downcast para reduzir memória** em um caso do seu dia a dia. Depois refatore aplicando "Trate nulos conforme o mecanismo de ausência".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: dropna/fillna e detecção de outliers
- [ ] Explicar e aplicar: astype e downcast para reduzir memória
- [ ] Explicar e aplicar: datas com to_datetime e features temporais
- [ ] Explicar e aplicar: read_csv com dtypes e chunksize

## Saiba mais

- [Documentação oficial](https://pandas.pydata.org/docs/user_guide/)
