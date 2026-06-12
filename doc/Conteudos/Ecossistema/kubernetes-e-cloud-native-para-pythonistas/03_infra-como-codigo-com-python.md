# Infra como código com Python

Provisionar nuvem de forma versionada e reproduzível usando Python.

> **Tema:** Cloud Native · **Nível:** avancado · **Trilha:** Kubernetes e Cloud Native para Pythonistas

## Conceitos-chave

Nesta lição você vai entender:

- **Pulumi escreve infraestrutura em Python puro**
- **Estado versionado e previews antes de aplicar**
- **Reutilização com funções e classes**
- **Mesma linguagem para app e infra**

## Exemplo prático

```python
import pulumi
import pulumi_aws as aws

bucket = aws.s3.Bucket('dados')
pulumi.export('bucket', bucket.id)
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Versione a infra junto com o código
- Sempre revise o preview antes de aplicar em produção

## Pratique

Para fixar, escreva um pequeno script que combine **pulumi escreve infraestrutura em python puro** e **estado versionado e previews antes de aplicar** em um caso do seu dia a dia. Depois refatore aplicando "Versione a infra junto com o código".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Pulumi escreve infraestrutura em Python puro
- [ ] Explicar e aplicar: Estado versionado e previews antes de aplicar
- [ ] Explicar e aplicar: Reutilização com funções e classes
- [ ] Explicar e aplicar: Mesma linguagem para app e infra

## Saiba mais

- [Documentação oficial](https://www.pulumi.com/docs/)
