# Containers na nuvem

Empacote sua app em containers e rode em qualquer nuvem (AWS ECS, GCP Cloud Run, Azure).

> **Tema:** Cloud · **Nível:** avancado · **Trilha:** Cloud e Serverless

## Conceitos-chave

Nesta lição você vai entender:

- **Docker padroniza o ambiente**
- **Cloud Run e ECS Fargate rodam containers sem servidor**
- **Escala automática conforme o tráfego**
- **Variáveis e segredos gerenciados**

## Exemplo prático

```python
FROM python:3.13-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD uvicorn main:app --host 0.0.0.0 --port 8080
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Imagens slim e multi-stage para tamanho menor
- Healthchecks para a orquestração

## Pratique

Para fixar, escreva um pequeno script que combine **docker padroniza o ambiente** e **cloud run e ecs fargate rodam containers sem servidor** em um caso do seu dia a dia. Depois refatore aplicando "Imagens slim e multi-stage para tamanho menor".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Docker padroniza o ambiente
- [ ] Explicar e aplicar: Cloud Run e ECS Fargate rodam containers sem servidor
- [ ] Explicar e aplicar: Escala automática conforme o tráfego
- [ ] Explicar e aplicar: Variáveis e segredos gerenciados

## Saiba mais

- [Documentação oficial](https://cloud.google.com/run/docs/quickstarts)
