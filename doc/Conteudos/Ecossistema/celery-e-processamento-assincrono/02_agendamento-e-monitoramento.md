# Agendamento e monitoramento

Tarefas periódicas e observabilidade do worker.

> **Tema:** Filas · **Nível:** avancado · **Trilha:** Celery e Processamento Assíncrono

## Conceitos-chave

Nesta lição você vai entender:

- **Celery Beat para tarefas recorrentes**
- **Roteamento por filas e prioridades**
- **Flower para monitorar**
- **DLQ para falhas**

## Exemplo prático

```python
app.conf.beat_schedule = {
    'limpeza': {'task': 'tasks.limpar', 'schedule': 3600.0}
}
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Separe filas por tipo de carga
- Alerta para filas crescendo

## Pratique

Para fixar, escreva um pequeno script que combine **celery beat para tarefas recorrentes** e **roteamento por filas e prioridades** em um caso do seu dia a dia. Depois refatore aplicando "Separe filas por tipo de carga".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Celery Beat para tarefas recorrentes
- [ ] Explicar e aplicar: Roteamento por filas e prioridades
- [ ] Explicar e aplicar: Flower para monitorar
- [ ] Explicar e aplicar: DLQ para falhas

## Saiba mais

- [Documentação oficial](https://docs.celeryq.dev/en/stable/userguide/periodic-tasks.html)
