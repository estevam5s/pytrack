# Tarefas em background

Celery executa trabalho fora do ciclo de request com workers e brokers.

## Pontos-chave

- Broker (Redis/RabbitMQ) e backend de resultado
- @app.task define tarefas
- delay()/apply_async para enfileirar
- Retries com backoff

## Exemplo

```python
from celery import Celery
app = Celery('tasks', broker='redis://localhost')

@app.task(bind=True, max_retries=3)
def enviar_email(self, dest):
    ...  # trabalho pesado
```

## Boas práticas

- Tarefas devem ser idempotentes
- Defina timeouts e limites de retry

## Saiba mais

- [Documentação oficial](https://docs.celeryq.dev/)
