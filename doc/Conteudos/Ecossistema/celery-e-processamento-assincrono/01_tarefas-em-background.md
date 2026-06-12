# Tarefas em background

Celery executa trabalho fora do ciclo de request com workers e brokers.

> **Tema:** Filas · **Nível:** avancado · **Trilha:** Celery e Processamento Assíncrono

## Conceitos-chave

Nesta lição você vai entender:

- **Broker (Redis/RabbitMQ) e backend de resultado**
- **@app.task define tarefas**
- **delay()/apply_async para enfileirar**
- **Retries com backoff**

## Exemplo prático

```python
from celery import Celery
app = Celery('tasks', broker='redis://localhost')

@app.task(bind=True, max_retries=3)
def enviar_email(self, dest):
    ...  # trabalho pesado
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Tarefas devem ser idempotentes
- Defina timeouts e limites de retry

## Pratique

Para fixar, escreva um pequeno script que combine **broker (redis/rabbitmq) e backend de resultado** e **@app.task define tarefas** em um caso do seu dia a dia. Depois refatore aplicando "Tarefas devem ser idempotentes".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Broker (Redis/RabbitMQ) e backend de resultado
- [ ] Explicar e aplicar: @app.task define tarefas
- [ ] Explicar e aplicar: delay()/apply_async para enfileirar
- [ ] Explicar e aplicar: Retries com backoff

## Saiba mais

- [Documentação oficial](https://docs.celeryq.dev/)
