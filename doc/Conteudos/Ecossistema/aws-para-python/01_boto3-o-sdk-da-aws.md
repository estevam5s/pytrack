# boto3: o SDK da AWS

boto3 é a biblioteca oficial para interagir com serviços AWS a partir do Python.

> **Tema:** Cloud · **Nível:** avancado · **Trilha:** AWS para Python

## Conceitos-chave

Nesta lição você vai entender:

- **Clients e resources para cada serviço**
- **Credenciais via IAM roles ou variáveis**
- **S3, EC2, DynamoDB, SQS e mais**
- **Paginação e tratamento de erros**

## Exemplo prático

```python
import boto3

s3 = boto3.client('s3')
s3.upload_file('relatorio.pdf', 'meu-bucket', 'relatorios/jan.pdf')
for obj in s3.list_objects_v2(Bucket='meu-bucket')['Contents']:
    print(obj['Key'])
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Use IAM roles, nunca chaves no código
- Princípio do menor privilégio nas policies

## Pratique

Para fixar, escreva um pequeno script que combine **clients e resources para cada serviço** e **credenciais via iam roles ou variáveis** em um caso do seu dia a dia. Depois refatore aplicando "Use IAM roles, nunca chaves no código".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Clients e resources para cada serviço
- [ ] Explicar e aplicar: Credenciais via IAM roles ou variáveis
- [ ] Explicar e aplicar: S3, EC2, DynamoDB, SQS e mais
- [ ] Explicar e aplicar: Paginação e tratamento de erros

## Saiba mais

- [Documentação oficial](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html)
