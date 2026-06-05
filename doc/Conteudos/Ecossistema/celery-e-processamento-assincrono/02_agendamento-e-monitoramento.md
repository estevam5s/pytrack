# Agendamento e monitoramento

Tarefas periódicas e observabilidade do worker.

## Pontos-chave

- Celery Beat para tarefas recorrentes
- Roteamento por filas e prioridades
- Flower para monitorar
- DLQ para falhas

## Exemplo

```python
app.conf.beat_schedule = {
    'limpeza': {'task': 'tasks.limpar', 'schedule': 3600.0}
}
```

## Boas práticas

- Separe filas por tipo de carga
- Alerta para filas crescendo

## Saiba mais

- [Documentação oficial](https://docs.celeryq.dev/en/stable/userguide/periodic-tasks.html)
