# Filas e tópicos

Desacople sistemas com mensageria assíncrona.

## Pontos-chave

- Filas (RabbitMQ) vs streaming (Kafka)
- Produtores e consumidores
- Garantias de entrega (at-least-once)
- Dead-letter queues

## Exemplo

```python
# produtor Kafka (confluent)
producer.produce('pedidos', key='1', value='{"id": 1}')
producer.flush()
```

## Boas práticas

- Handlers idempotentes
- Monitore lag de consumidores

## Saiba mais

- [Documentação oficial](https://kafka.apache.org/documentation/)
