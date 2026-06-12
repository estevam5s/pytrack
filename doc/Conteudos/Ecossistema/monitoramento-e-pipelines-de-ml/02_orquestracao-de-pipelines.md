# Orquestração de pipelines

Pipelines de dados e ML precisam de orquestração confiável e observável.

> **Tema:** MLOps · **Nível:** avancado · **Trilha:** Monitoramento e Pipelines de ML

## Conceitos-chave

Nesta lição você vai entender:

- **DAGs definem dependências entre tarefas**
- **Airflow/Prefect/Dagster agendam e monitoram**
- **Retries, alertas e backfill**
- **Idempotência: rodar de novo não corrompe**

## Exemplo prático

```python
from prefect import flow, task

@task
def extrair(): ...
@task
def treinar(d): ...

@flow
def pipeline():
    treinar(extrair())
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Tarefas idempotentes facilitam reprocessar
- Observabilidade no pipeline economiza horas de debug

## Pratique

Para fixar, escreva um pequeno script que combine **dags definem dependências entre tarefas** e **airflow/prefect/dagster agendam e monitoram** em um caso do seu dia a dia. Depois refatore aplicando "Tarefas idempotentes facilitam reprocessar".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: DAGs definem dependências entre tarefas
- [ ] Explicar e aplicar: Airflow/Prefect/Dagster agendam e monitoram
- [ ] Explicar e aplicar: Retries, alertas e backfill
- [ ] Explicar e aplicar: Idempotência: rodar de novo não corrompe

## Saiba mais

- [Documentação oficial](https://docs.prefect.io/)
