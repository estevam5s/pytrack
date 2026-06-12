# Validação e métricas

Avalie modelos de forma robusta.

> **Tema:** ML · **Nível:** avancado · **Trilha:** Machine Learning com scikit-learn

## Conceitos-chave

Nesta lição você vai entender:

- **train_test_split e cross_val_score**
- **Métricas conforme o problema (F1, ROC-AUC)**
- **Matriz de confusão**
- **GridSearchCV para hiperparâmetros**

## Exemplo prático

```python
from sklearn.model_selection import cross_val_score
scores = cross_val_score(pipe, X, y, cv=5, scoring='f1')
print(scores.mean())
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Use validação cruzada
- Escolha métrica pelo custo do erro

## Pratique

Para fixar, escreva um pequeno script que combine **train_test_split e cross_val_score** e **métricas conforme o problema (f1, roc-auc)** em um caso do seu dia a dia. Depois refatore aplicando "Use validação cruzada".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: train_test_split e cross_val_score
- [ ] Explicar e aplicar: Métricas conforme o problema (F1, ROC-AUC)
- [ ] Explicar e aplicar: Matriz de confusão
- [ ] Explicar e aplicar: GridSearchCV para hiperparâmetros

## Saiba mais

- [Documentação oficial](https://scikit-learn.org/stable/model_selection.html)
