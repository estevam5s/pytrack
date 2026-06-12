# Kafka, Streaming e Sistemas Orientados a Eventos

Kafka é uma plataforma de streaming de eventos. Diferente de filas de tarefa tradicionais, Kafka armazena logs ordenados e permite múltiplos consumidores independentes processarem eventos.

---

## Sumário

1. [Modelo Mental do Kafka](#modelo-mental-do-kafka)
2. [Conceitos Principais](#conceitos-principais)
3. [Producer](#producer)
4. [Consumer](#consumer)
5. [Consumer Groups](#consumer-groups)
6. [Partições e Ordenação](#partições-e-ordenação)
7. [Offsets](#offsets)
8. [Semântica de Entrega](#semântica-de-entrega)
9. [Schema e Contratos](#schema-e-contratos)
10. [Streaming vs Filas de Tarefas](#streaming-vs-filas-de-tarefas)
11. [Boas Práticas](#boas-práticas)
12. [Exercícios](#exercícios)

---

## Modelo Mental do Kafka

Kafka é um log distribuído.

```text
producer -> topic(partitions) -> consumer group
```

Eventos são append-only. Consumidores leem de uma posição chamada offset.

Use Kafka quando:

- eventos têm alto volume;
- múltiplos sistemas precisam consumir;
- histórico precisa ser reprocessado;
- ordem por chave importa;
- arquitetura event-driven é necessária;
- streaming analytics é relevante.

---

## Conceitos Principais

- topic: categoria de eventos;
- partition: divisão ordenada do topic;
- offset: posição do evento;
- producer: publica eventos;
- consumer: consome eventos;
- consumer group: grupo que divide partições;
- broker: servidor Kafka;
- key: define particionamento;
- value: payload do evento.

---

## Producer

Exemplo com `confluent-kafka`:

```python
from confluent_kafka import Producer
import json

producer = Producer({"bootstrap.servers": "localhost:9092"})

def delivery_report(err, msg):
    if err is not None:
        print("falha", err)
    else:
        print("entregue", msg.topic(), msg.partition(), msg.offset())

evento = {"pedido_id": "p1", "status": "confirmado"}

producer.produce(
    "pedidos",
    key=evento["pedido_id"],
    value=json.dumps(evento).encode("utf-8"),
    callback=delivery_report,
)

producer.flush()
```

Key garante ordenação por entidade dentro da mesma partição.

---

## Consumer

```python
from confluent_kafka import Consumer
import json

consumer = Consumer(
    {
        "bootstrap.servers": "localhost:9092",
        "group.id": "analytics",
        "auto.offset.reset": "earliest",
    }
)

consumer.subscribe(["pedidos"])

try:
    while True:
        msg = consumer.poll(1.0)
        if msg is None:
            continue
        if msg.error():
            print("erro", msg.error())
            continue

        evento = json.loads(msg.value().decode("utf-8"))
        print(evento)
finally:
    consumer.close()
```

---

## Consumer Groups

Consumidores no mesmo grupo dividem partições.

```text
topic pedidos com 3 partições
grupo analytics com 3 consumidores
cada consumidor recebe uma partição
```

Consumidores em grupos diferentes recebem os mesmos eventos independentemente.

Exemplo:

- grupo `analytics`;
- grupo `fraude`;
- grupo `notificacoes`.

Todos podem consumir `pedidos`.

---

## Partições e Ordenação

Kafka só garante ordem dentro de uma partição.

Se eventos do mesmo pedido precisam de ordem, use `pedido_id` como key.

```python
producer.produce("pedidos", key=pedido_id, value=payload)
```

Mais partições permitem mais paralelismo, mas exigem planejamento.

---

## Offsets

Offset indica posição consumida.

Auto commit é simples, mas pode confirmar antes do processamento terminar.

Para controle maior, use commit manual.

```python
consumer.commit(message=msg)
```

Padrão:

1. ler mensagem;
2. processar;
3. persistir efeito;
4. commitar offset.

---

## Semântica de Entrega

Tipos:

- at most once: pode perder, não duplica;
- at least once: não perde, pode duplicar;
- exactly once: possível em cenários específicos, mais complexo.

Na prática, projete consumidores idempotentes.

```python
def processar_evento(evento):
    if ja_processado(evento["event_id"]):
        return
    aplicar_efeito(evento)
    marcar_processado(evento["event_id"])
```

---

## Schema e Contratos

Eventos precisam de contrato.

Exemplo:

```json
{
  "event_id": "uuid",
  "event_type": "pedido_confirmado",
  "occurred_at": "2026-05-15T10:00:00Z",
  "payload": {
    "pedido_id": "p1",
    "cliente_id": "c1",
    "valor": 100.0
  }
}
```

Boas práticas:

- versionar schema;
- manter compatibilidade;
- validar campos obrigatórios;
- evitar payload ambíguo;
- usar schema registry quando possível.

---

## Streaming vs Filas de Tarefas

| Critério | Celery/RabbitMQ | Kafka |
|---|---|---|
| Modelo | tarefa/fila | log/eventos |
| Retenção | normalmente curta | configurável |
| Reprocessamento | não é foco | natural |
| Múltiplos consumidores | possível | central |
| Ordenação | por fila | por partição |
| Uso típico | jobs assíncronos | streaming/event-driven |

Use Celery para executar tarefas.

Use Kafka para distribuir fatos/eventos.

---

## Boas Práticas

- Use keys consistentes.
- Projete consumidores idempotentes.
- Monitore consumer lag.
- Versione schemas.
- Evite eventos gigantes.
- Defina retenção adequada.
- Separe comandos de eventos.
- Não use Kafka como RPC simples.
- Planeje partições.
- Trate poison messages.

---

## Exercícios

1. Explique topic, partition e offset.
2. Crie producer conceitual de pedidos.
3. Crie consumer conceitual.
4. Explique consumer groups.
5. Modele evento `pedido_confirmado`.
6. Explique at least once e idempotência.
7. Compare Kafka com Celery/RabbitMQ.
8. Defina estratégia de key para eventos de pedido.

