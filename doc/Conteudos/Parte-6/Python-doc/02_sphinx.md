# Sphinx: Documentação Técnica, API Reference e Read the Docs

Sphinx é uma ferramenta poderosa para documentação técnica, muito usada em bibliotecas Python. Ele gera documentação a partir de arquivos reStructuredText ou Markdown, pode extrair docstrings do código e integra bem com Read the Docs.

---

## Instalação

```bash
pip install sphinx
```

Criar projeto:

```bash
mkdir docs
sphinx-quickstart docs
```

Estrutura:

```text
docs/
├── conf.py
├── index.rst
├── Makefile
└── make.bat
```

Build HTML:

```bash
cd docs
make html
```

Saída:

```text
docs/_build/html/index.html
```

---

## index.rst

```rst
Minha Biblioteca
================

.. toctree::
   :maxdepth: 2
   :caption: Conteúdo:

   instalacao
   uso
   api
```

Criar `instalacao.rst`:

```rst
Instalação
==========

.. code-block:: bash

   pip install minha-biblioteca
```

---

## Tema

Tema popular:

```bash
pip install sphinx-rtd-theme
```

`docs/conf.py`:

```python
html_theme = "sphinx_rtd_theme"
```

Outra opção moderna:

```bash
pip install furo
```

```python
html_theme = "furo"
```

---

## Autodoc

Autodoc extrai documentação de docstrings.

`conf.py`:

```python
extensions = [
    "sphinx.ext.autodoc",
    "sphinx.ext.napoleon",
    "sphinx.ext.viewcode",
]
```

`api.rst`:

```rst
API Reference
=============

.. automodule:: minha_biblioteca.calculadora
   :members:
   :undoc-members:
   :show-inheritance:
```

---

## Napoleon

Permite docstrings Google ou NumPy style.

```python
def somar(a: int, b: int) -> int:
    """Soma dois números.

    Args:
        a: Primeiro número.
        b: Segundo número.

    Returns:
        Soma dos números.
    """
    return a + b
```

Sphinx renderiza a docstring de forma estruturada.

---

## Type Hints na Documentação

Extensão útil:

```bash
pip install sphinx-autodoc-typehints
```

`conf.py`:

```python
extensions = [
    "sphinx.ext.autodoc",
    "sphinx.ext.napoleon",
    "sphinx_autodoc_typehints",
]
```

Isso melhora a apresentação de tipos.

---

## Markdown no Sphinx

```bash
pip install myst-parser
```

`conf.py`:

```python
extensions = [
    "myst_parser",
    "sphinx.ext.autodoc",
    "sphinx.ext.napoleon",
]
source_suffix = {
    ".rst": "restructuredtext",
    ".md": "markdown",
}
```

Agora é possível usar `.md` no Sphinx.

---

## Documentando Pacote Inteiro

Gerar stubs:

```bash
sphinx-apidoc -o docs/api minha_biblioteca
```

Isso cria páginas para módulos automaticamente. Revise a saída para não publicar API interna sem querer.

---

## Read the Docs

Arquivo `.readthedocs.yaml`:

```yaml
version: 2

build:
  os: ubuntu-22.04
  tools:
    python: "3.12"

sphinx:
  configuration: docs/conf.py

python:
  install:
    - requirements: docs/requirements.txt
    - method: pip
      path: .
```

`docs/requirements.txt`:

```txt
sphinx
furo
myst-parser
sphinx-autodoc-typehints
```

---

## Sphinx em CI

```yaml
- name: Build docs
  run: |
    pip install -r docs/requirements.txt
    sphinx-build -W -b html docs docs/_build/html
```

`-W` transforma warnings em erro. Bom para manter docs saudáveis.

---

## Quando Usar Sphinx

Use Sphinx quando:

- projeto é biblioteca Python;
- API reference é importante;
- docstrings são parte central;
- precisa de Read the Docs;
- quer documentação técnica detalhada.

MkDocs costuma ser mais simples para portais Markdown, guias e documentação de produto.

---

## Checklist Sphinx

- `conf.py` está organizado?
- tema foi configurado?
- autodoc documenta apenas API pública?
- docstrings seguem padrão?
- build roda em CI?
- warnings quebram build?
- Read the Docs está configurado?
- Markdown via MyST é necessário?

