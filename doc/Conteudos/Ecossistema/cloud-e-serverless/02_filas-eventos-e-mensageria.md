# Filas, eventos e mensageria

Arquiteturas serverless desacoplam serviços com filas e eventos.

> **Tema:** Cloud · **Nível:** avancado · **Trilha:** Cloud e Serverless

## Conceitos-chave

Nesta lição você vai entender:

- **SQS/Pub-Sub para filas**
- **EventBridge/Pub-Sub para eventos**
- **Processamento assíncrono e resiliente**
- **Dead-letter queues para falhas**

## Exemplo prático

```python
import boto3
sqs = boto3.client('sqs')
sqs.send_message(QueueUrl=URL, MessageBody='pedido:123')
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Torne os consumidores idempotentes
- Monitore o tamanho das filas

## Pratique

Para fixar, escreva um pequeno script que combine **sqs/pub-sub para filas** e **eventbridge/pub-sub para eventos** em um caso do seu dia a dia. Depois refatore aplicando "Torne os consumidores idempotentes".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: SQS/Pub-Sub para filas
- [ ] Explicar e aplicar: EventBridge/Pub-Sub para eventos
- [ ] Explicar e aplicar: Processamento assíncrono e resiliente
- [ ] Explicar e aplicar: Dead-letter queues para falhas

## Saiba mais

- [Documentação oficial](https://docs.aws.amazon.com/sqs/)
