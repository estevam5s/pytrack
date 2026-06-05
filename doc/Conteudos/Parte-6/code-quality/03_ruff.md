# Ruff: Linter e Formatter Moderno de Alta Performance

Ruff é uma ferramenta moderna escrita em Rust para linting e formatação de Python. Ela é muito rápida e substitui várias ferramentas e plugins tradicionais, como pyflakes, pycodestyle, isort, flake8-bugbear, flake8-comprehensions e outros.

---

## Instalação

```bash
pip install ruff
```

Rodar lint:

```bash
ruff check .
```

Corrigir automaticamente:

```bash
ruff check . --fix
```

Formatar:

```bash
ruff format .
```

Verificar formatação:

```bash
ruff format --check .
```

---

## Configuração Básica

`pyproject.toml`:

```toml
[tool.ruff]
line-length = 88
target-version = "py312"

[tool.ruff.lint]
select = ["E", "F", "I", "B", "UP", "SIM"]
ignore = []

[tool.ruff.format]
quote-style = "double"
indent-style = "space"
```

Grupos comuns:

- `E`, `W`: pycodestyle;
- `F`: pyflakes;
- `I`: isort;
- `B`: bugbear;
- `UP`: pyupgrade;
- `SIM`: simplificações;
- `C4`: comprehensions;
- `N`: pep8-naming;
- `S`: bandit/security;
- `ANN`: annotations.

---

## Exemplos de Problemas Detectados

Import não usado:

```python
import os

print("hello")
```

Ruff aponta `F401`.

Comparação simplificável:

```python
if len(lista) == 0:
    ...
```

Pode sugerir:

```python
if not lista:
    ...
```

---

## Organização de Imports com Ruff

Ruff pode substituir isort:

```toml
[tool.ruff.lint]
select = ["E", "F", "I"]
```

Corrigir:

```bash
ruff check . --fix
```

---

## Regras por Arquivo

```toml
[tool.ruff.lint.per-file-ignores]
"tests/**/*.py" = ["S101"]
"__init__.py" = ["F401"]
```

Exemplo: permitir `assert` em testes quando regras de segurança estão ativas.

---

## Excluir Pastas

```toml
[tool.ruff]
exclude = [
    ".git",
    ".venv",
    "build",
    "dist",
    "migrations",
]
```

---

## Ruff em CI

```yaml
- name: Ruff
  run: ruff check .

- name: Ruff format
  run: ruff format --check .
```

Se usa Black como formatador:

```yaml
- run: black --check .
- run: ruff check .
```

---

## Ruff com pre-commit

```yaml
repos:
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.6.9
    hooks:
      - id: ruff
        args: [--fix]
      - id: ruff-format
```

Se usa Black, remova `ruff-format`.

---

## Adoção Gradual

Projeto legado:

```toml
[tool.ruff.lint]
select = ["E", "F"]
```

Depois evolua:

```toml
select = ["E", "F", "I", "B", "UP", "SIM", "C4"]
```

Ativar muitas regras de uma vez pode gerar ruído e resistência.

---

## Ruff vs Flake8

Ruff é mais rápido e cobre muitos plugins. Flake8 ainda pode ser necessário quando:

- projeto depende de plugin específico não coberto;
- organização já tem configuração madura;
- migração ainda não foi aprovada.

Para projetos novos, Ruff costuma ser a escolha mais pragmática.

---

## Checklist Ruff

- regras selecionadas são úteis?
- `--fix` é seguro no pre-commit?
- formatter escolhido não conflita com Black?
- imports são organizados por Ruff ou isort, não ambos sem alinhamento?
- ignores por arquivo são justificados?
- CI roda `ruff check`?
- projeto legado adotou regras gradualmente?

