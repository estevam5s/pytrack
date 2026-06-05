# CI/CD com GitHub Actions

GitHub Actions automatiza workflows de integração contínua e entrega contínua. Para Python, é comum rodar lint, testes, type check, build de pacote, build de imagem Docker, scan de segurança e deploy.

---

## Workflow Básico

`.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.12"

      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt
          pip install pytest

      - name: Run tests
        run: pytest -q
```

---

## Matrix de Versões

```yaml
strategy:
  matrix:
    python-version: ["3.11", "3.12"]

steps:
  - uses: actions/setup-python@v5
    with:
      python-version: ${{ matrix.python-version }}
```

Use matrix para bibliotecas que precisam suportar múltiplas versões.

---

## Cache de Dependências

```yaml
- uses: actions/setup-python@v5
  with:
    python-version: "3.12"
    cache: "pip"
```

Com Poetry:

```yaml
cache: "poetry"
```

---

## Lint, Format e Type Check

```yaml
- name: Install dev dependencies
  run: pip install ruff mypy pytest

- name: Ruff
  run: ruff check .

- name: Mypy
  run: mypy app

- name: Tests
  run: pytest -q
```

Separe jobs se quiser feedback paralelo.

---

## Services para Teste com PostgreSQL

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_DB: app_test
          POSTGRES_USER: app
          POSTGRES_PASSWORD: app
        ports:
          - 5432:5432
        options: >-
          --health-cmd "pg_isready -U app -d app_test"
          --health-interval 5s
          --health-timeout 5s
          --health-retries 10
    env:
      DATABASE_URL: postgresql://app:app@localhost:5432/app_test
```

---

## Secrets

Configure no GitHub:

```text
Settings -> Secrets and variables -> Actions
```

Uso:

```yaml
env:
  DOCKER_TOKEN: ${{ secrets.DOCKER_TOKEN }}
```

Nunca coloque segredos diretamente no YAML.

---

## Build de Imagem Docker

```yaml
name: Docker

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - uses: actions/checkout@v4

      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: ghcr.io/${{ github.repository }}:${{ github.sha }}
```

---

## Deploy via SSH

```yaml
- name: Deploy
  uses: appleboy/ssh-action@v1.0.3
  with:
    host: ${{ secrets.SSH_HOST }}
    username: ${{ secrets.SSH_USER }}
    key: ${{ secrets.SSH_KEY }}
    script: |
      cd /opt/minha-api
      git fetch --all
      git checkout ${{ github.sha }}
      . .venv/bin/activate
      pip install -r requirements.txt
      alembic upgrade head
      sudo systemctl restart minha-api
```

Deploy por SSH é simples. Para ambientes grandes, use Kubernetes, Argo CD, Flux, ECS, Cloud Run ou plataforma equivalente.

---

## Ambientes e Aprovação

```yaml
environment:
  name: production
  url: https://api.exemplo.com
```

GitHub Environments permitem approvals, secrets por ambiente e regras de proteção.

---

## Checklist GitHub Actions

- workflow roda em pull request?
- testes são obrigatórios antes do merge?
- dependências usam cache?
- secrets estão no GitHub, não no YAML?
- build gera artefato ou imagem versionada?
- deploy usa ambiente protegido?
- jobs são pequenos e claros?
- permissões do token são mínimas?
- pipeline falha quando testes falham?
- release usa tag imutável?

