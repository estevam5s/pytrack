# Containers na nuvem

Empacote sua app em containers e rode em qualquer nuvem (AWS ECS, GCP Cloud Run, Azure).

## Pontos-chave

- Docker padroniza o ambiente
- Cloud Run e ECS Fargate rodam containers sem servidor
- Escala automática conforme o tráfego
- Variáveis e segredos gerenciados

## Exemplo

```python
FROM python:3.13-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD uvicorn main:app --host 0.0.0.0 --port 8080
```

## Boas práticas

- Imagens slim e multi-stage para tamanho menor
- Healthchecks para a orquestração

## Saiba mais

- [Documentação oficial](https://cloud.google.com/run/docs/quickstarts)
