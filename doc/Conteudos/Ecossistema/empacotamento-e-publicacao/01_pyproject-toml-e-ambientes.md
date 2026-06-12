# pyproject.toml e ambientes

Estruture, isole e publique pacotes Python.

> **Tema:** Packaging · **Nível:** intermediario · **Trilha:** Empacotamento e Publicação

## Conceitos-chave

Nesta lição você vai entender:

- **pyproject.toml centraliza metadados e ferramentas**
- **venv, pip e pipx**
- **Poetry/uv para lockfile reprodutível**
- **Versionamento semântico**

## Exemplo prático

```python
[project]
name = 'meu-pacote'
version = '0.1.0'
requires-python = '>=3.11'
dependencies = ['httpx']
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Use lockfile para reprodutibilidade
- Mantenha um changelog

## Pratique

Para fixar, escreva um pequeno script que combine **pyproject.toml centraliza metadados e ferramentas** e **venv, pip e pipx** em um caso do seu dia a dia. Depois refatore aplicando "Use lockfile para reprodutibilidade".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: pyproject.toml centraliza metadados e ferramentas
- [ ] Explicar e aplicar: venv, pip e pipx
- [ ] Explicar e aplicar: Poetry/uv para lockfile reprodutível
- [ ] Explicar e aplicar: Versionamento semântico

## Saiba mais

- [Documentação oficial](https://packaging.python.org/)
