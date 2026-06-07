# Infraestrutura como código (CDK)

Defina infra AWS de forma reproduzível com Terraform ou AWS CDK em Python.

## Pontos-chave

- IaC versiona a infraestrutura
- Terraform: declarativo e multi-cloud
- AWS CDK: infra em Python puro
- Planeje (plan) antes de aplicar (apply)

## Exemplo

```python
from aws_cdk import App, Stack
from aws_cdk import aws_s3 as s3

class MeuStack(Stack):
    def __init__(self, scope, id):
        super().__init__(scope, id)
        s3.Bucket(self, 'Dados', versioned=True)
```

## Boas práticas

- Nunca altere infra de produção na mão
- Guarde o state remoto e travado

## Saiba mais

- [Documentação oficial](https://docs.aws.amazon.com/cdk/v2/guide/work-with-cdk-python.html)
