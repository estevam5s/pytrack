# DAGs e tasks

Airflow agenda e orquestra pipelines como grafos de tarefas.

> **Tema:** Orquestração · **Nível:** avancado · **Trilha:** Airflow e Orquestração

## Conceitos-chave

Nesta lição você vai entender:

- **DAG define o fluxo e o agendamento**
- **Operators e dependências entre tasks**
- **XCom para passar dados**
- **Retries e SLAs**

## Exemplo prático

```python
from airflow import DAG
from airflow.operators.python import PythonOperator

with DAG('etl', schedule='@daily') as dag:
    t1 = PythonOperator(task_id='extrair', python_callable=extrair)
    t2 = PythonOperator(task_id='carregar', python_callable=carregar)
    t1 >> t2
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Tarefas idempotentes e atômicas
- Monitore execuções e backfills

## Pratique

Para fixar, escreva um pequeno script que combine **dag define o fluxo e o agendamento** e **operators e dependências entre tasks** em um caso do seu dia a dia. Depois refatore aplicando "Tarefas idempotentes e atômicas".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: DAG define o fluxo e o agendamento
- [ ] Explicar e aplicar: Operators e dependências entre tasks
- [ ] Explicar e aplicar: XCom para passar dados
- [ ] Explicar e aplicar: Retries e SLAs

## Saiba mais

- [Documentação oficial](https://airflow.apache.org/docs/)
