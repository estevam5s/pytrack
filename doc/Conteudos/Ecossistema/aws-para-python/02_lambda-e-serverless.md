# Lambda e serverless

AWS Lambda executa funções Python sob demanda, sem gerenciar servidores.

> **Tema:** Cloud · **Nível:** avancado · **Trilha:** AWS para Python

## Conceitos-chave

Nesta lição você vai entender:

- **handler(event, context) é o ponto de entrada**
- **Cobrança por tempo de execução (ms)**
- **Triggers: API Gateway, S3, SQS, EventBridge**
- **Empacote dependências em layers**

## Exemplo prático

```python
def handler(event, context):
    nome = event.get('nome', 'mundo')
    return {'statusCode': 200, 'body': f'Olá, {nome}!'}
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Mantenha funções pequenas e focadas
- Cuidado com cold starts e timeouts

## Pratique

Para fixar, escreva um pequeno script que combine **handler(event, context) é o ponto de entrada** e **cobrança por tempo de execução (ms)** em um caso do seu dia a dia. Depois refatore aplicando "Mantenha funções pequenas e focadas".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: handler(event, context) é o ponto de entrada
- [ ] Explicar e aplicar: Cobrança por tempo de execução (ms)
- [ ] Explicar e aplicar: Triggers: API Gateway, S3, SQS, EventBridge
- [ ] Explicar e aplicar: Empacote dependências em layers

## Saiba mais

- [Documentação oficial](https://docs.aws.amazon.com/lambda/latest/dg/lambda-python.html)
