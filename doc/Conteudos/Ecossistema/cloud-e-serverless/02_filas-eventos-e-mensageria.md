# Filas, eventos e mensageria

Arquiteturas serverless desacoplam serviços com filas e eventos.

## Pontos-chave

- SQS/Pub-Sub para filas
- EventBridge/Pub-Sub para eventos
- Processamento assíncrono e resiliente
- Dead-letter queues para falhas

## Exemplo

```python
import boto3
sqs = boto3.client('sqs')
sqs.send_message(QueueUrl=URL, MessageBody='pedido:123')
```

## Boas práticas

- Torne os consumidores idempotentes
- Monitore o tamanho das filas

## Saiba mais

- [Documentação oficial](https://docs.aws.amazon.com/sqs/)
