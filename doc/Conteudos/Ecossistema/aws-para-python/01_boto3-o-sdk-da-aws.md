# boto3: o SDK da AWS

boto3 é a biblioteca oficial para interagir com serviços AWS a partir do Python.

## Pontos-chave

- Clients e resources para cada serviço
- Credenciais via IAM roles ou variáveis
- S3, EC2, DynamoDB, SQS e mais
- Paginação e tratamento de erros

## Exemplo

```python
import boto3

s3 = boto3.client('s3')
s3.upload_file('relatorio.pdf', 'meu-bucket', 'relatorios/jan.pdf')
for obj in s3.list_objects_v2(Bucket='meu-bucket')['Contents']:
    print(obj['Key'])
```

## Boas práticas

- Use IAM roles, nunca chaves no código
- Princípio do menor privilégio nas policies

## Saiba mais

- [Documentação oficial](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html)
