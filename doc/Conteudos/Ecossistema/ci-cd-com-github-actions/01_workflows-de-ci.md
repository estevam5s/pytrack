# Workflows de CI

Automatize lint, testes e build a cada push.

> **Tema:** CI/CD · **Nível:** intermediario · **Trilha:** CI/CD com GitHub Actions

## Conceitos-chave

Nesta lição você vai entender:

- **Eventos (push, pull_request)**
- **Jobs e steps**
- **Cache de dependências**
- **Matriz de versões**

## Exemplo prático

```python
name: ci
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pip install -e '.[dev]'
      - run: ruff check . && pytest
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Falhe rápido: lint e testes primeiro
- Use secrets do GitHub

## Pratique

Para fixar, escreva um pequeno script que combine **eventos (push, pull_request)** e **jobs e steps** em um caso do seu dia a dia. Depois refatore aplicando "Falhe rápido: lint e testes primeiro".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Eventos (push, pull_request)
- [ ] Explicar e aplicar: Jobs e steps
- [ ] Explicar e aplicar: Cache de dependências
- [ ] Explicar e aplicar: Matriz de versões

## Saiba mais

- [Documentação oficial](https://docs.github.com/actions)
