# Ambientes Virtuais e Empacotamento em Python

Este guia cobre criação de ambientes isolados, instalação de dependências, organização de projetos e empacotamento com `setuptools` e `poetry`.

---

## Sumário

1. [Objetivo](#objetivo)
2. [Por Que Usar Ambiente Virtual](#por-que-usar-ambiente-virtual)
3. [Venv](#venv)
4. [Virtualenv](#virtualenv)
5. [Pip e Requirements](#pip-e-requirements)
6. [Pyproject.toml](#pyprojecttoml)
7. [Setuptools](#setuptools)
8. [Poetry](#poetry)
9. [Estrutura Profissional de Projeto](#estrutura-profissional-de-projeto)
10. [Scripts e Entry Points](#scripts-e-entry-points)
11. [Publicação e Versionamento](#publicação-e-versionamento)
12. [Boas Práticas](#boas-práticas)
13. [Nível Avançado: Projetos Reprodutíveis e Pacotes Profissionais](#nível-avançado-projetos-reprodutíveis-e-pacotes-profissionais)
14. [Armadilhas de Especialista](#armadilhas-de-especialista)
15. [Checklist de Proficiência](#checklist-de-proficiência)
16. [Exercícios](#exercícios)

---

## Objetivo

Ao final, você deve saber:

- criar ambientes isolados;
- instalar e congelar dependências;
- entender `requirements.txt` e `pyproject.toml`;
- estruturar projeto empacotável;
- configurar `setuptools`;
- usar `poetry`;
- criar comandos executáveis;
- versionar pacotes.

---

## Por Que Usar Ambiente Virtual

Ambiente virtual isola dependências por projeto.

Sem isolamento:

- projetos diferentes podem exigir versões incompatíveis;
- atualizações quebram projetos antigos;
- fica difícil reproduzir ambiente.

Com isolamento:

- cada projeto tem suas próprias dependências;
- instalação fica controlada;
- o ambiente é mais previsível.

---

## Venv

Criar ambiente:

```bash
python -m venv .venv
```

Ativar no macOS/Linux:

```bash
source .venv/bin/activate
```

Ativar no Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

Verificar Python:

```bash
which python
python --version
```

Desativar:

```bash
deactivate
```

---

## Virtualenv

`virtualenv` é uma alternativa mais antiga e ainda usada em alguns fluxos.

Instalação:

```bash
python -m pip install virtualenv
```

Criação:

```bash
virtualenv .venv
```

Na maioria dos projetos modernos, `venv` já é suficiente.

---

## Pip e Requirements

Instalar pacote:

```bash
python -m pip install requests
```

Listar pacotes:

```bash
python -m pip list
```

Gerar `requirements.txt`:

```bash
python -m pip freeze > requirements.txt
```

Instalar a partir de `requirements.txt`:

```bash
python -m pip install -r requirements.txt
```

Exemplo:

```text
requests==2.32.3
pydantic==2.8.2
pytest==8.3.2
```

Para aplicações, fixar versões aumenta reprodutibilidade.

Para bibliotecas, evite travar dependências de forma rígida demais.

---

## Pyproject.toml

`pyproject.toml` centraliza metadados, build system e configuração de ferramentas.

Exemplo mínimo:

```toml
[project]
name = "meu-pacote"
version = "0.1.0"
description = "Pacote Python de exemplo"
readme = "README.md"
requires-python = ">=3.11"
dependencies = [
    "requests>=2.32",
]

[project.optional-dependencies]
dev = [
    "pytest>=8",
    "ruff>=0.6",
    "mypy>=1.11",
]
```

---

## Setuptools

Estrutura:

```text
meu-pacote/
  pyproject.toml
  README.md
  src/
    meu_pacote/
      __init__.py
      calculos.py
  tests/
    test_calculos.py
```

`pyproject.toml`:

```toml
[build-system]
requires = ["setuptools>=68", "wheel"]
build-backend = "setuptools.build_meta"

[project]
name = "meu-pacote"
version = "0.1.0"
description = "Exemplo com setuptools"
readme = "README.md"
requires-python = ">=3.11"
dependencies = []

[tool.setuptools.packages.find]
where = ["src"]
```

Instalação em modo editável:

```bash
python -m pip install -e .
```

Com dependências de desenvolvimento:

```bash
python -m pip install -e ".[dev]"
```

Build:

```bash
python -m pip install build
python -m build
```

---

## Poetry

Poetry gerencia dependências, ambiente e build.

Criar projeto:

```bash
poetry new meu-pacote
```

Iniciar em projeto existente:

```bash
poetry init
```

Adicionar dependência:

```bash
poetry add requests
```

Adicionar dependência de desenvolvimento:

```bash
poetry add --group dev pytest ruff mypy
```

Instalar:

```bash
poetry install
```

Executar comando:

```bash
poetry run pytest
```

Abrir shell:

```bash
poetry shell
```

Build:

```bash
poetry build
```

---

## Estrutura Profissional de Projeto

```text
projeto/
  .venv/
  src/
    app/
      __init__.py
      main.py
      config.py
      services.py
  tests/
    test_services.py
  pyproject.toml
  README.md
  .gitignore
```

Por que usar `src/`:

- evita imports acidentais do diretório raiz;
- aproxima ambiente local do pacote instalado;
- melhora confiabilidade de testes.

---

## Scripts e Entry Points

Com `pyproject.toml`:

```toml
[project.scripts]
meu-comando = "app.main:main"
```

Código:

```python
def main() -> None:
    print("Executando aplicação")
```

Depois de instalar:

```bash
meu-comando
```

---

## Publicação e Versionamento

Versionamento semântico:

```text
MAJOR.MINOR.PATCH
```

- `PATCH`: correção compatível;
- `MINOR`: funcionalidade compatível;
- `MAJOR`: mudança incompatível.

Antes de publicar:

- rode testes;
- rode lint;
- confira metadados;
- confira README;
- gere build limpo;
- publique primeiro em ambiente de teste quando possível.

---

## Boas Práticas

- Use `.venv` local no projeto.
- Não versione `.venv`.
- Versione `pyproject.toml`.
- Para aplicações, use lock file quando possível.
- Para bibliotecas, declare faixas compatíveis de dependência.
- Use `python -m pip` em vez de `pip` solto.
- Prefira estrutura `src/` para pacotes.
- Automatize comandos com `Makefile`, `taskipy`, `nox` ou `tox` quando o projeto crescer.
- Documente como instalar e rodar o projeto no `README.md`.

---

## Nível Avançado: Projetos Reprodutíveis e Pacotes Profissionais

Especialistas não apenas criam ambientes. Eles garantem que o projeto possa ser instalado, testado, empacotado e mantido por outras pessoas.

### Aplicação vs biblioteca

Aplicação:

- deploya um sistema final;
- deve ter versões travadas;
- usa lock file;
- prioriza reprodutibilidade.

Biblioteca:

- será usada por outros projetos;
- deve declarar faixas de compatibilidade;
- evita pins rígidos;
- prioriza interoperabilidade.

### Dependências opcionais

```toml
[project.optional-dependencies]
dev = [
    "pytest>=8",
    "ruff>=0.6",
    "mypy>=1.11",
]
postgres = [
    "psycopg[binary]>=3.2",
]
excel = [
    "openpyxl>=3.1",
]
```

Instalação:

```bash
python -m pip install -e ".[dev,postgres]"
```

### Configuração de ferramentas no `pyproject.toml`

```toml
[tool.ruff]
line-length = 88
target-version = "py312"

[tool.ruff.lint]
select = ["E", "F", "I", "UP", "B"]

[tool.pytest.ini_options]
testpaths = ["tests"]

[tool.mypy]
python_version = "3.12"
disallow_untyped_defs = true
warn_return_any = true
```

Centralizar configurações reduz arquivos soltos e melhora manutenção.

### Builds isolados

```bash
python -m pip install build
python -m build
```

Gera:

- `sdist`: distribuição fonte;
- `wheel`: distribuição construída.

### Testando instalação real

Um pacote pode passar nos testes localmente e falhar instalado. Teste em ambiente limpo:

```bash
python -m venv /tmp/teste-pacote
source /tmp/teste-pacote/bin/activate
python -m pip install dist/meu_pacote-0.1.0-py3-none-any.whl
python -c "import meu_pacote; print(meu_pacote.__version__)"
```

### Versionamento em pacote

Exponha versão:

```python
__version__ = "0.1.0"
```

Ou use metadados:

```python
from importlib.metadata import version

__version__ = version("meu-pacote")
```

### CLI profissional

```python
import argparse

def main(argv=None) -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("nome")
    args = parser.parse_args(argv)

    print(f"Olá, {args.nome}")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
```

Esse padrão facilita teste:

```python
def test_main(capsys):
    codigo = main(["Ana"])
    saida = capsys.readouterr()

    assert codigo == 0
    assert "Ana" in saida.out
```

### Automação com Nox

```python
import nox

@nox.session
def tests(session):
    session.install("-e", ".[dev]")
    session.run("pytest")

@nox.session
def lint(session):
    session.install("ruff")
    session.run("ruff", "check", ".")
```

`nox` ajuda a padronizar tarefas em ambientes isolados.

### Supply chain e segurança

Boas práticas:

- revise dependências diretas;
- remova dependências não usadas;
- use lock file em aplicações;
- atualize pacotes com rotina;
- rode auditoria quando possível;
- evite instalar pacotes desconhecidos sem verificar origem;
- prefira tokens com escopo limitado para publicação.

---

## Armadilhas de Especialista

### Misturar dependências de app e biblioteca

Aplicações podem travar versões. Bibliotecas devem permitir faixas compatíveis.

### Empacotar sem `src/`

Projetos sem `src/` podem mascarar problemas de import durante testes.

### Publicar pacote sem testar wheel

Sempre teste o pacote instalado, não apenas o código no diretório.

### CLI que chama `sys.exit` dentro da lógica

Mantenha `sys.exit` na borda. Retorne código de saída da função `main`.

---

## Checklist de Proficiência

- Sei criar ambientes reprodutíveis.
- Sei diferenciar dependências de produção, desenvolvimento e opcionais.
- Sei configurar `pyproject.toml`.
- Sei empacotar com `setuptools` ou Poetry.
- Sei criar entry points.
- Sei testar instalação real de wheel.
- Sei estruturar projeto com `src/`.
- Sei automatizar testes, lint e type check.
- Sei aplicar versionamento semântico.
- Sei avaliar riscos de dependências.

---

## Ampliação de Proficiência

### Ambiente reproduzível

Um projeto profissional deve responder:

- qual versão de Python usa;
- como criar o ambiente;
- como instalar dependências;
- como rodar a aplicação;
- como rodar testes;
- como empacotar, se necessário.

Essas respostas normalmente ficam no `README.md` e no `pyproject.toml`.

### Requirements versus pyproject

`requirements.txt` é simples e útil para aplicações pequenas.

`pyproject.toml` é melhor quando o projeto precisa centralizar metadados, dependências, build e ferramentas.

Projetos podem usar ambos, mas evite duplicar fonte de verdade sem necessidade.

### Dependência direta e transitiva

Dependência direta é a que você escolheu instalar.

Dependência transitiva é instalada porque uma dependência direta precisa dela.

Exemplo:

```text
seu-projeto -> requests -> urllib3
```

Você deve declarar dependências diretas. Ferramentas de lock ajudam a congelar todo o grafo.

### Versionamento semântico

Formato comum:

```text
MAJOR.MINOR.PATCH
```

- `PATCH`: correção compatível;
- `MINOR`: funcionalidade compatível;
- `MAJOR`: mudança incompatível.

### Mini-checklist de domínio

- Sei criar e ativar `.venv`.
- Sei instalar dependências sem afetar o Python global.
- Sei explicar `requirements.txt` e `pyproject.toml`.
- Sei instalar pacote em modo editável.
- Sei criar estrutura `src/`.
- Sei documentar comandos básicos do projeto.
- Sei diferenciar aplicação, biblioteca e pacote distribuível.

---

## Exercícios

1. Crie um ambiente virtual com `venv`.
2. Instale `requests` e gere `requirements.txt`.
3. Recrie o ambiente a partir de `requirements.txt`.
4. Crie um projeto com estrutura `src/`.
5. Configure `pyproject.toml` com `setuptools`.
6. Instale o projeto em modo editável.
7. Crie um script de linha de comando com `[project.scripts]`.
8. Crie um projeto com Poetry.
9. Adicione dependências de produção e desenvolvimento.
10. Gere um build do pacote.

---

## Aprofundamento Complementar

### Aplicação versus biblioteca

Aplicação é executada para entregar um comportamento final: CLI, API, automação, dashboard.

Biblioteca é importada por outro código para oferecer funcionalidades reutilizáveis.

Essa diferença muda decisões de dependência, versionamento e empacotamento.

### Estrutura `src`

```text
projeto/
├── pyproject.toml
├── src/
│   └── meu_pacote/
│       └── __init__.py
└── tests/
```

A estrutura `src` evita que testes importem acidentalmente arquivos locais sem instalação correta.

### Dependências opcionais

```toml
[project.optional-dependencies]
dev = ["pytest", "ruff", "mypy"]
excel = ["openpyxl", "xlsxwriter"]
```

Isso permite instalar apenas o necessário:

```bash
python -m pip install -e ".[dev]"
```

### Arquivos que não devem ir para o repositório

Normalmente não versionar: `.venv/`, `__pycache__/`, `.pytest_cache/`, arquivos `.pyc`, segredos, builds locais e dados sensíveis.

### Exercícios extras

1. Crie um projeto com estrutura `src`.
2. Configure dependências opcionais `dev`.
3. Instale o pacote em modo editável.
4. Crie um `.gitignore` adequado.
5. Escreva no README os comandos de setup, teste e execução.
