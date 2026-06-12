# Imagens e Dockerfile

Empacote a aplicação Python em uma imagem reproduzível.

## Pontos-chave

- FROM python:slim e camadas
- Copiar deps antes do código (cache)
- Multi-stage para imagens menores
- Usuário não-root

## Exemplo

```python
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0"]
```

## Boas práticas

- Use .dockerignore
- Fixe versões de dependências

## Saiba mais

- [Documentação oficial](https://docs.docker.com/language/python/)
