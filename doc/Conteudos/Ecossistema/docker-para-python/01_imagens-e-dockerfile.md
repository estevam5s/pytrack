# Imagens e Dockerfile

Empacote a aplicação Python em uma imagem reproduzível.

> **Tema:** Containers · **Nível:** intermediario · **Trilha:** Docker para Python

## Conceitos-chave

Nesta lição você vai entender:

- **FROM python:slim e camadas**
- **Copiar deps antes do código (cache)**
- **Multi-stage para imagens menores**
- **Usuário não-root**

## Exemplo prático

```python
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0"]
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Use .dockerignore
- Fixe versões de dependências

## Pratique

Para fixar, escreva um pequeno script que combine **from python:slim e camadas** e **copiar deps antes do código (cache)** em um caso do seu dia a dia. Depois refatore aplicando "Use .dockerignore".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: FROM python:slim e camadas
- [ ] Explicar e aplicar: Copiar deps antes do código (cache)
- [ ] Explicar e aplicar: Multi-stage para imagens menores
- [ ] Explicar e aplicar: Usuário não-root

## Saiba mais

- [Documentação oficial](https://docs.docker.com/language/python/)
