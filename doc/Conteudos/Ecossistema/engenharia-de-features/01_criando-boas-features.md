# Criando boas features

A qualidade das features define o teto do modelo.

> **Tema:** Features · **Nível:** avancado · **Trilha:** Engenharia de Features

## Conceitos-chave

Nesta lição você vai entender:

- **Encoding de categóricas (one-hot, target)**
- **Escalonamento e transformações**
- **Features de data/texto/agregação**
- **Seleção de features**

## Exemplo prático

```python
import pandas as pd
df = pd.get_dummies(df, columns=['categoria'])
df['log_valor'] = np.log1p(df['valor'])
df['dia_semana'] = df['data'].dt.dayofweek
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Evite vazamento de dados
- Documente cada feature

## Pratique

Para fixar, escreva um pequeno script que combine **encoding de categóricas (one-hot, target)** e **escalonamento e transformações** em um caso do seu dia a dia. Depois refatore aplicando "Evite vazamento de dados".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Encoding de categóricas (one-hot, target)
- [ ] Explicar e aplicar: Escalonamento e transformações
- [ ] Explicar e aplicar: Features de data/texto/agregação
- [ ] Explicar e aplicar: Seleção de features

## Saiba mais

- [Documentação oficial](https://feature-engine.trainindata.com/)
