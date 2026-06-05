# DAGs e tasks

Airflow agenda e orquestra pipelines como grafos de tarefas.

## Pontos-chave

- DAG define o fluxo e o agendamento
- Operators e dependências entre tasks
- XCom para passar dados
- Retries e SLAs

## Exemplo

```python
from airflow import DAG
from airflow.operators.python import PythonOperator

with DAG('etl', schedule='@daily') as dag:
    t1 = PythonOperator(task_id='extrair', python_callable=extrair)
    t2 = PythonOperator(task_id='carregar', python_callable=carregar)
    t1 >> t2
```

## Boas práticas

- Tarefas idempotentes e atômicas
- Monitore execuções e backfills

## Saiba mais

- [Documentação oficial](https://airflow.apache.org/docs/)
