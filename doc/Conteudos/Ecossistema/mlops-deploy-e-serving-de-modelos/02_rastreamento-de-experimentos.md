# Rastreamento de experimentos

Reproduzir resultados exige registrar parâmetros, métricas e artefatos.

> **Tema:** MLOps · **Nível:** avancado · **Trilha:** MLOps: Deploy e Serving de Modelos

## Conceitos-chave

Nesta lição você vai entender:

- **MLflow registra params, metrics e modelos**
- **Model Registry versiona e promove modelos**
- **Reprodutibilidade: seed, dados e ambiente fixos**
- **Compare experimentos lado a lado**

## Exemplo prático

```python
import mlflow

with mlflow.start_run():
    mlflow.log_param('lr', 0.01)
    mlflow.log_metric('acc', 0.93)
    mlflow.sklearn.log_model(modelo, 'modelo')
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Registre tudo que afeta o resultado
- Promova modelos por estágio (staging → production)

## Pratique

Para fixar, escreva um pequeno script que combine **mlflow registra params, metrics e modelos** e **model registry versiona e promove modelos** em um caso do seu dia a dia. Depois refatore aplicando "Registre tudo que afeta o resultado".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: MLflow registra params, metrics e modelos
- [ ] Explicar e aplicar: Model Registry versiona e promove modelos
- [ ] Explicar e aplicar: Reprodutibilidade: seed, dados e ambiente fixos
- [ ] Explicar e aplicar: Compare experimentos lado a lado

## Saiba mais

- [Documentação oficial](https://mlflow.org/docs/latest/index.html)
