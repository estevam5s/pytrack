# Qualidade de Código em Python

Trilha completa e avançada sobre ferramentas de qualidade de código em Python: Black, Ruff, Flake8, isort e MyPy.

Qualidade de código não é estética isolada. É um conjunto de práticas para reduzir bugs, padronizar estilo, facilitar revisão, acelerar manutenção, automatizar feedback e manter a base sustentável conforme o projeto cresce.

---

## Arquivos da Trilha

1. [Fundamentos de Qualidade de Código em Python](./01_fundamentos_qualidade_codigo.md)
2. [Black: Formatação Automática e Padronização](./02_black.md)
3. [Ruff: Linter e Formatter Moderno de Alta Performance](./03_ruff.md)
4. [Flake8: Linting Clássico e Ecossistema de Plugins](./04_flake8.md)
5. [isort: Organização Profissional de Imports](./05_isort.md)
6. [MyPy: Tipagem Estática Profissional em Python](./06_mypy.md)
7. [Workflow Profissional: pyproject, pre-commit e CI](./07_workflow_qualidade_ci.md)

---

## Competências Esperadas

Ao concluir esta trilha, você deve saber:

- configurar formatação automática com Black;
- usar Ruff para lint rápido e regras modernas;
- entender quando Flake8 ainda faz sentido;
- organizar imports com isort;
- aplicar tipagem estática com MyPy;
- configurar tudo no `pyproject.toml`;
- usar `pre-commit`;
- integrar qualidade em CI/CD;
- escolher regras sem transformar ferramentas em ruído;
- migrar projetos legados progressivamente.

---

## Stack Recomendada para Projetos Novos

Para muitos projetos modernos, esta combinação é suficiente:

```bash
pip install black ruff mypy pre-commit
```

Em projetos que já usam Flake8/isort, é possível manter ou migrar aos poucos.

---

## Exemplo de Comandos

```bash
black .
ruff check .
ruff check . --fix
isort .
mypy app
```

Em CI, prefira comandos que falham se o código não está conforme:

```bash
black --check .
ruff check .
mypy app
```

