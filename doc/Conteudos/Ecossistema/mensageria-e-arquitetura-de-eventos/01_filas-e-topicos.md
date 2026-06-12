# Filas e tópicos

Desacople sistemas com mensageria assíncrona.

> **Tema:** Eventos · **Nível:** avancado · **Trilha:** Mensageria e Arquitetura de Eventos

## Conceitos-chave

Nesta lição você vai entender:

- **Filas (RabbitMQ) vs streaming (Kafka)**
- **Produtores e consumidores**
- **Garantias de entrega (at-least-once)**
- **Dead-letter queues**

## Exemplo prático

```python
# produtor Kafka (confluent)
producer.produce('pedidos', key='1', value='{"id": 1}')
producer.flush()
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Handlers idempotentes
- Monitore lag de consumidores

## Pratique

Para fixar, escreva um pequeno script que combine **filas (rabbitmq) vs streaming (kafka)** e **produtores e consumidores** em um caso do seu dia a dia. Depois refatore aplicando "Handlers idempotentes".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Filas (RabbitMQ) vs streaming (Kafka)
- [ ] Explicar e aplicar: Produtores e consumidores
- [ ] Explicar e aplicar: Garantias de entrega (at-least-once)
- [ ] Explicar e aplicar: Dead-letter queues

## Saiba mais

- [Documentação oficial](https://kafka.apache.org/documentation/)
