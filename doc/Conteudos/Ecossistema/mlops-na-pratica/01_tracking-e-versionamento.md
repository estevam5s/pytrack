# Tracking e versionamento

Reprodutibilidade e governança de modelos.

> **Tema:** MLOps · **Nível:** avancado · **Trilha:** MLOps na Prática

## Conceitos-chave

Nesta lição você vai entender:

- **MLflow para experimentos e registry**
- **DVC para versionar dados/pipelines**
- **Versione código, dados e artefatos**
- **Métricas e parâmetros registrados**

## Exemplo prático

```python
import mlflow
with mlflow.start_run():
    mlflow.log_param('alpha', 0.1)
    mlflow.log_metric('rmse', 0.42)
    mlflow.sklearn.log_model(modelo, 'modelo')
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Registre tudo do experimento
- Automatize com CI

## Pratique

Para fixar, escreva um pequeno script que combine **mlflow para experimentos e registry** e **dvc para versionar dados/pipelines** em um caso do seu dia a dia. Depois refatore aplicando "Registre tudo do experimento".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: MLflow para experimentos e registry
- [ ] Explicar e aplicar: DVC para versionar dados/pipelines
- [ ] Explicar e aplicar: Versione código, dados e artefatos
- [ ] Explicar e aplicar: Métricas e parâmetros registrados

## Saiba mais

- [Documentação oficial](https://mlflow.org/docs/latest/index.html)
