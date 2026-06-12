# Pipelines e pré-processamento

scikit-learn padroniza preparo de dados e modelos em pipelines.

> **Tema:** ML · **Nível:** avancado · **Trilha:** Machine Learning com scikit-learn

## Conceitos-chave

Nesta lição você vai entender:

- **Pipeline encadeia transformações e modelo**
- **ColumnTransformer para colunas mistas**
- **fit/transform/predict**
- **Evita vazamento de dados**

## Exemplo prático

```python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

pipe = Pipeline([('scaler', StandardScaler()), ('clf', LogisticRegression())])
pipe.fit(X_train, y_train)
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Faça pré-processamento dentro do pipeline
- Separe treino/teste antes de tudo

## Pratique

Para fixar, escreva um pequeno script que combine **pipeline encadeia transformações e modelo** e **columntransformer para colunas mistas** em um caso do seu dia a dia. Depois refatore aplicando "Faça pré-processamento dentro do pipeline".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Pipeline encadeia transformações e modelo
- [ ] Explicar e aplicar: ColumnTransformer para colunas mistas
- [ ] Explicar e aplicar: fit/transform/predict
- [ ] Explicar e aplicar: Evita vazamento de dados

## Saiba mais

- [Documentação oficial](https://scikit-learn.org/stable/)
