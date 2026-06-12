# Infraestrutura como código (CDK)

Defina infra AWS de forma reproduzível com Terraform ou AWS CDK em Python.

> **Tema:** Cloud · **Nível:** avancado · **Trilha:** AWS para Python

## Conceitos-chave

Nesta lição você vai entender:

- **IaC versiona a infraestrutura**
- **Terraform: declarativo e multi-cloud**
- **AWS CDK: infra em Python puro**
- **Planeje (plan) antes de aplicar (apply)**

## Exemplo prático

```python
from aws_cdk import App, Stack
from aws_cdk import aws_s3 as s3

class MeuStack(Stack):
    def __init__(self, scope, id):
        super().__init__(scope, id)
        s3.Bucket(self, 'Dados', versioned=True)
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Nunca altere infra de produção na mão
- Guarde o state remoto e travado

## Pratique

Para fixar, escreva um pequeno script que combine **iac versiona a infraestrutura** e **terraform: declarativo e multi-cloud** em um caso do seu dia a dia. Depois refatore aplicando "Nunca altere infra de produção na mão".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: IaC versiona a infraestrutura
- [ ] Explicar e aplicar: Terraform: declarativo e multi-cloud
- [ ] Explicar e aplicar: AWS CDK: infra em Python puro
- [ ] Explicar e aplicar: Planeje (plan) antes de aplicar (apply)

## Saiba mais

- [Documentação oficial](https://docs.aws.amazon.com/cdk/v2/guide/work-with-cdk-python.html)
