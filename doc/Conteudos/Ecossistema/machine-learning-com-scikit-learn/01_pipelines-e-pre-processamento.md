# Pipelines e pré-processamento

scikit-learn padroniza preparo de dados e modelos em pipelines.

## Pontos-chave

- Pipeline encadeia transformações e modelo
- ColumnTransformer para colunas mistas
- fit/transform/predict
- Evita vazamento de dados

## Exemplo

```python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

pipe = Pipeline([('scaler', StandardScaler()), ('clf', LogisticRegression())])
pipe.fit(X_train, y_train)
```

## Boas práticas

- Faça pré-processamento dentro do pipeline
- Separe treino/teste antes de tudo

## Saiba mais

- [Documentação oficial](https://scikit-learn.org/stable/)
