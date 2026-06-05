# Tracking e versionamento

Reprodutibilidade e governança de modelos.

## Pontos-chave

- MLflow para experimentos e registry
- DVC para versionar dados/pipelines
- Versione código, dados e artefatos
- Métricas e parâmetros registrados

## Exemplo

```python
import mlflow
with mlflow.start_run():
    mlflow.log_param('alpha', 0.1)
    mlflow.log_metric('rmse', 0.42)
    mlflow.sklearn.log_model(modelo, 'modelo')
```

## Boas práticas

- Registre tudo do experimento
- Automatize com CI

## Saiba mais

- [Documentação oficial](https://mlflow.org/docs/latest/index.html)
