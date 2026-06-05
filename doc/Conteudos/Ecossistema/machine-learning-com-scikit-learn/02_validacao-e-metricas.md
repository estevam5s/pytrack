# Validação e métricas

Avalie modelos de forma robusta.

## Pontos-chave

- train_test_split e cross_val_score
- Métricas conforme o problema (F1, ROC-AUC)
- Matriz de confusão
- GridSearchCV para hiperparâmetros

## Exemplo

```python
from sklearn.model_selection import cross_val_score
scores = cross_val_score(pipe, X, y, cv=5, scoring='f1')
print(scores.mean())
```

## Boas práticas

- Use validação cruzada
- Escolha métrica pelo custo do erro

## Saiba mais

- [Documentação oficial](https://scikit-learn.org/stable/model_selection.html)
