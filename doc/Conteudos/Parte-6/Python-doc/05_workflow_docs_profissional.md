# Workflow Profissional: Docs as Code, CI, Versionamento e Qualidade

Docs as Code significa tratar documentação como código: versionar no Git, revisar em pull request, testar build em CI, publicar automaticamente e manter junto das mudanças do sistema.

---

## Estrutura de Docs no Repositório

```text
projeto/
├── app/
├── docs/
│   ├── index.md
│   ├── getting-started.md
│   ├── guides/
│   ├── reference/
│   └── architecture/
├── mkdocs.yml
└── README.md
```

Ou com Sphinx:

```text
projeto/
├── src/
├── docs/
│   ├── conf.py
│   ├── index.rst
│   └── api.rst
└── pyproject.toml
```

---

## Documentação no Pull Request

Uma mudança deve atualizar docs quando altera:

- endpoint público;
- configuração;
- comportamento de CLI;
- variável de ambiente;
- migration operacional;
- arquitetura;
- processo de deploy;
- contrato de biblioteca.

Checklist de PR:

```markdown
- [ ] Testes atualizados
- [ ] Documentação atualizada
- [ ] OpenAPI atualizado
- [ ] Changelog atualizado
```

---

## Build de Docs em CI

MkDocs:

```yaml
name: Docs

on:
  pull_request:
  push:
    branches: [main]

jobs:
  docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - run: pip install mkdocs-material
      - run: mkdocs build --strict
```

Sphinx:

```yaml
- run: pip install -r docs/requirements.txt
- run: sphinx-build -W -b html docs docs/_build/html
```

---

## Publicação

GitHub Pages com MkDocs:

```yaml
permissions:
  contents: write

steps:
  - uses: actions/checkout@v4
  - uses: actions/setup-python@v5
    with:
      python-version: "3.12"
  - run: pip install mkdocs-material
  - run: mkdocs gh-deploy --force
```

Read the Docs para Sphinx é excelente para bibliotecas.

---

## Qualidade de Texto

Boas práticas:

- títulos claros;
- exemplos executáveis;
- comandos completos;
- pré-requisitos explícitos;
- mensagens de erro comuns;
- links internos;
- screenshots apenas quando ajudam;
- evitar conteúdo desatualizado.

Ferramentas úteis:

- markdownlint;
- vale;
- codespell;
- link checkers;
- OpenAPI linters.

---

## Testando Exemplos de Código

Sphinx doctest:

```rst
>>> somar(2, 3)
5
```

Rodar:

```bash
sphinx-build -b doctest docs docs/_build/doctest
```

Para Markdown, considere testes separados para snippets críticos.

---

## Link Check

Sphinx:

```bash
sphinx-build -b linkcheck docs docs/_build/linkcheck
```

MkDocs pode usar plugins ou ferramentas externas para validar links.

---

## Versionamento de Documentação

Quando versionar:

- APIs públicas;
- bibliotecas;
- SDKs;
- produtos com múltiplas versões em uso.

MkDocs:

```bash
mike deploy --push 1.0 latest
```

Read the Docs oferece versões por branch/tag.

---

## Documentação e OpenAPI

Fluxo maduro:

```text
Código/API -> openapi.json -> validação -> documentação -> SDKs/testes de contrato
```

Salvar OpenAPI:

```bash
curl http://localhost:8000/openapi.json > docs/reference/openapi.json
```

Validar contrato em CI antes de publicar.

---

## Checklist Profissional

- docs estão no Git?
- build roda em CI?
- warnings quebram build?
- publicação é automática?
- PR exige atualização de docs?
- exemplos são testados?
- links são verificados?
- OpenAPI é validado?
- documentação tem versionamento quando necessário?
- README, portal e API reference não se contradizem?

