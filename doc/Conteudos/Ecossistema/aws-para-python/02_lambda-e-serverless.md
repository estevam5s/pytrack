# Lambda e serverless

AWS Lambda executa funções Python sob demanda, sem gerenciar servidores.

## Pontos-chave

- handler(event, context) é o ponto de entrada
- Cobrança por tempo de execução (ms)
- Triggers: API Gateway, S3, SQS, EventBridge
- Empacote dependências em layers

## Exemplo

```python
def handler(event, context):
    nome = event.get('nome', 'mundo')
    return {'statusCode': 200, 'body': f'Olá, {nome}!'}
```

## Boas práticas

- Mantenha funções pequenas e focadas
- Cuidado com cold starts e timeouts

## Saiba mais

- [Documentação oficial](https://docs.aws.amazon.com/lambda/latest/dg/lambda-python.html)
