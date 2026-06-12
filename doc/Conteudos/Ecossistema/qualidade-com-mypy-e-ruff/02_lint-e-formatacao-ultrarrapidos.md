# Lint e formatação ultrarrápidos

Ruff substitui flake8, isort e black com performance em Rust.

> **Tema:** Qualidade · **Nível:** intermediario · **Trilha:** Qualidade com mypy e Ruff

## Conceitos-chave

Nesta lição você vai entender:

- **Lint + format em um só tool**
- **Regras configuráveis em pyproject.toml**
- **Autofix de muitos problemas**
- **Integração com pre-commit e CI**

## Exemplo prático

```python
# pyproject.toml
[tool.ruff]
line-length = 100
[tool.ruff.lint]
select = ['E', 'F', 'I', 'UP']
# ruff check --fix .  e  ruff format .
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Rode ruff no pre-commit e no CI
- Padronize a config em pyproject.toml

## Pratique

Para fixar, escreva um pequeno script que combine **lint + format em um só tool** e **regras configuráveis em pyproject.toml** em um caso do seu dia a dia. Depois refatore aplicando "Rode ruff no pre-commit e no CI".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Lint + format em um só tool
- [ ] Explicar e aplicar: Regras configuráveis em pyproject.toml
- [ ] Explicar e aplicar: Autofix de muitos problemas
- [ ] Explicar e aplicar: Integração com pre-commit e CI

## Saiba mais

- [Documentação oficial](https://docs.astral.sh/ruff/)
