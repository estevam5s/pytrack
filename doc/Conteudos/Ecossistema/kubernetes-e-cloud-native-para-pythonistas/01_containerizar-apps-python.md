# Containerizar apps Python

O primeiro passo cloud native: empacotar a app em uma imagem reprodutível.

> **Tema:** Cloud Native · **Nível:** avancado · **Trilha:** Kubernetes e Cloud Native para Pythonistas

## Conceitos-chave

Nesta lição você vai entender:

- **Dockerfile multi-stage reduz a imagem final**
- **Imagens slim e usuário não-root**
- **12-factor: config por ambiente**
- **Healthcheck para orquestradores**

## Exemplo prático

```python
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
USER 1000
CMD ["gunicorn", "-b", "0.0.0.0:8000", "app:app"]
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Imagens pequenas sobem e escalam mais rápido
- Nunca rode containers como root

## Pratique

Para fixar, escreva um pequeno script que combine **dockerfile multi-stage reduz a imagem final** e **imagens slim e usuário não-root** em um caso do seu dia a dia. Depois refatore aplicando "Imagens pequenas sobem e escalam mais rápido".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Dockerfile multi-stage reduz a imagem final
- [ ] Explicar e aplicar: Imagens slim e usuário não-root
- [ ] Explicar e aplicar: 12-factor: config por ambiente
- [ ] Explicar e aplicar: Healthcheck para orquestradores

## Saiba mais

- [Documentação oficial](https://docs.docker.com/language/python/)
