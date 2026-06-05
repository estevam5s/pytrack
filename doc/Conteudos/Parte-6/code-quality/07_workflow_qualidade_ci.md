# Workflow Profissional: pyproject, pre-commit e CI

Ferramentas de qualidade são mais úteis quando rodam automaticamente: no editor, antes do commit e no CI. O objetivo é feedback rápido e consistente, não depender de memória humana.

---

## pyproject.toml Completo

Exemplo para projeto moderno com Black, Ruff e MyPy:

```toml
[tool.black]
line-length = 88
target-version = ["py312"]

[tool.ruff]
line-length = 88
target-version = "py312"
exclude = [".venv", "build", "dist", "migrations"]

[tool.ruff.lint]
select = ["E", "F", "I", "B", "UP", "SIM", "C4"]
ignore = []

[tool.ruff.lint.per-file-ignores]
"tests/**/*.py" = ["S101"]
"__init__.py" = ["F401"]

[tool.mypy]
python_version = "3.12"
warn_return_any = true
warn_unused_configs = true
check_untyped_defs = true
ignore_missing_imports = false

[tool.pytest.ini_options]
testpaths = ["tests"]
addopts = "-ra --strict-markers"
```

Se usar Ruff formatter, remova Black:

```toml
[tool.ruff.format]
quote-style = "double"
indent-style = "space"
```

---

## pre-commit

Instalação:

```bash
pip install pre-commit
```

`.pre-commit-config.yaml`:

```yaml
repos:
  - repo: https://github.com/psf/black
    rev: 24.8.0
    hooks:
      - id: black

  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.6.9
    hooks:
      - id: ruff
        args: [--fix]

  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.11.2
    hooks:
      - id: mypy
        additional_dependencies: []
```

Ativar:

```bash
pre-commit install
```

Rodar tudo:

```bash
pre-commit run --all-files
```

---

## Ordem das Ferramentas

Fluxo local comum:

```bash
ruff check . --fix
black .
mypy app
pytest
```

Se usa isort separado:

```bash
isort .
black .
ruff check . --fix
mypy app
pytest
```

---

## GitHub Actions

```yaml
name: Quality

on:
  pull_request:
  push:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
          cache: "pip"

      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt
          pip install black ruff mypy pytest

      - name: Black
        run: black --check .

      - name: Ruff
        run: ruff check .

      - name: MyPy
        run: mypy app

      - name: Tests
        run: pytest -q
```

---

## Makefile

```makefile
.PHONY: format lint type test quality

format:
	ruff check . --fix
	black .

lint:
	black --check .
	ruff check .

type:
	mypy app

test:
	pytest -q

quality: lint type test
```

Uso:

```bash
make format
make quality
```

---

## Projeto Legado

Não tente corrigir tudo em um dia.

Plano:

1. adicione ferramentas sem falhar CI;
2. gere relatório;
3. formate em PR isolado;
4. ative lint básico;
5. crie ignores temporários;
6. remova ignores por área;
7. aplique MyPy em módulos novos;
8. aumente rigor aos poucos.

---

## Política de PR

Boas regras:

- PR precisa passar CI;
- formatação automática;
- lint obrigatório;
- testes obrigatórios;
- mudanças grandes de formatação separadas;
- novos módulos têm type hints;
- ignores precisam de justificativa;
- cobertura não pode cair em código crítico.

---

## Checklist Workflow

- `pyproject.toml` centraliza config?
- pre-commit está configurado?
- CI roda em pull request?
- comandos locais são simples?
- ferramentas não têm regras conflitantes?
- projeto legado tem plano gradual?
- PRs de formatação são separados?
- falhas de qualidade bloqueiam merge?

