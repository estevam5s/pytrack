# CI/CD Pipelines: Build, Teste, Release e Deploy Automatizado

CI/CD é a prática de automatizar integração, validação, empacotamento, release e deploy. Uma pipeline reduz erro manual, aumenta repetibilidade e torna produção mais segura.

CI/CD não é apenas um arquivo YAML. É uma disciplina de engenharia: testes confiáveis, artefatos rastreáveis, ambientes previsíveis, aprovação quando necessário, rollback e observabilidade após deploy.

---

## CI vs CD

**CI**, Continuous Integration:

- instalar dependências;
- rodar lint;
- rodar testes;
- checar tipos;
- validar segurança;
- gerar artefato;
- executar em pull requests.

**CD**, Continuous Delivery/Deployment:

- publicar imagem/pacote;
- aplicar migrations;
- atualizar ambiente;
- verificar health check;
- promover release;
- rollback se necessário.

Continuous Delivery prepara deploy. Continuous Deployment faz deploy automaticamente.

---

## Pipeline Básica

```text
push/PR
  -> checkout
  -> setup Python
  -> instalar dependencias
  -> lint
  -> testes
  -> build Docker
  -> scan
  -> push registry
  -> deploy staging
  -> testes smoke
  -> deploy production
```

Nem todo projeto precisa de todas as etapas no começo, mas produção madura precisa de validação antes e depois do deploy.

---

## Exemplo GitHub Actions

```yaml
name: ci

on:
  pull_request:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"

      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt
          pip install pytest ruff mypy

      - name: Lint
        run: ruff check .

      - name: Type check
        run: mypy app

      - name: Tests
        run: pytest
```

CI deve ser rápida o suficiente para ser usada sempre.

---

## Build de Imagem

```yaml
  build:
    needs: test
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
          tags: |
            ghcr.io/org/api-python:${{ github.sha }}
            ghcr.io/org/api-python:main
```

Para produção, prefira deploy por SHA ou tag semântica, não por `main`.

---

## Artefatos Imutáveis

Regra importante:

```text
Build uma vez, promova o mesmo artefato.
```

Ruim:

```text
build para staging
build diferente para producao
```

Melhor:

```text
build imagem sha256
deploy staging
aprovar
deploy producao com a mesma imagem
```

Isso reduz diferenças entre ambientes.

---

## Testes na Pipeline

Camadas:

- unitários;
- integração;
- contrato;
- end-to-end;
- smoke tests;
- segurança;
- migração.

Não coloque tudo como bloqueio lento em todo PR sem estratégia. Use camadas:

```text
PR: lint + unitarios + tipos
main: integracao + build + scan
staging: smoke + e2e critico
producao: health check + monitoramento
```

---

## Secrets na Pipeline

Nunca coloque segredos no YAML.

Use:

- secrets do GitHub/GitLab;
- OIDC para cloud;
- vault/secret manager;
- permissões mínimas;
- secrets por ambiente.

Evite secrets de longa duração quando OIDC resolve.

---

## Deploy via SSH para VPS

Exemplo simples:

```yaml
  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.VPS_HOST }}
          username: deploy
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /opt/minha-api
            docker compose pull
            docker compose up -d
            docker compose ps
```

Para produção crítica, adicione health check e rollback.

---

## Deploy em Kubernetes

```yaml
      - name: Configure kubeconfig
        run: |
          mkdir -p ~/.kube
          echo "${{ secrets.KUBECONFIG }}" > ~/.kube/config

      - name: Deploy
        run: |
          kubectl set image deployment/api-python api=ghcr.io/org/api-python:${{ github.sha }} -n production
          kubectl rollout status deployment/api-python -n production --timeout=180s
```

Melhor ainda: GitOps com Argo CD ou Flux, onde a pipeline altera manifesto versionado e o cluster sincroniza.

---

## Migrations

Migrations são parte crítica do deploy.

Regras:

- migrations devem ser revisadas;
- evite mudanças destrutivas no mesmo deploy;
- use expand/contract;
- garanta compatibilidade entre versão antiga e nova;
- tenha backup quando necessário;
- rode uma vez, não por réplica.

Estratégia expand/contract:

```text
1. adicionar nova coluna opcional
2. app escreve coluna antiga e nova
3. backfill
4. app lê coluna nova
5. remover coluna antiga em deploy futuro
```

---

## Estratégias de Deploy

### Rolling

Atualiza gradualmente instâncias.

Vantagem: simples.
Risco: versões antiga e nova convivem.

### Blue/Green

Duas versões completas:

```text
blue: atual
green: nova
```

Troca tráfego quando green passa nos testes.

### Canary

Nova versão recebe pequena porcentagem:

```text
95% atual
5% nova
```

Se métricas estiverem boas, aumenta.

### Feature Flags

Deploy não precisa ativar funcionalidade imediatamente.

---

## Smoke Tests

Depois do deploy:

```bash
curl -f https://api.exemplo.com/health
curl -f https://api.exemplo.com/ready
```

Teste fluxo crítico:

```text
criar pedido de teste
consultar pedido
validar resposta
```

Smoke test não substitui teste completo. Ele confirma que produção responde o mínimo esperado.

---

## Rollback

Rollback precisa ser simples e testado.

VPS/Docker:

```bash
docker compose pull
docker compose up -d
```

Kubernetes:

```bash
kubectl rollout undo deployment/api-python -n production
```

Rollback de aplicação é fácil se banco continua compatível. Rollback com migration destrutiva é difícil.

---

## Release Notes e Versionamento

Use versões rastreáveis:

```text
api-python@1.4.2
commit: abc123
imagem: ghcr.io/org/api-python:abc123
```

Inclua:

- mudanças;
- migrations;
- flags;
- riscos;
- rollback;
- observabilidade esperada.

---

## Segurança na Pipeline

Práticas:

- proteger branch principal;
- exigir review;
- rodar testes obrigatórios;
- escanear dependências;
- escanear imagem;
- usar least privilege;
- assinar artefatos quando necessário;
- bloquear secrets em logs;
- registrar auditoria de deploy.

Ferramentas:

- pip-audit;
- safety;
- Trivy;
- Gitleaks;
- Dependabot/Renovate;
- Snyk.

---

## GitOps

GitOps usa Git como fonte de verdade da infraestrutura/deploy.

Fluxo:

```text
pipeline publica imagem
pipeline atualiza manifesto no Git
Argo CD/Flux sincroniza cluster
```

Vantagens:

- auditoria;
- rollback por Git;
- menos credencial direta na pipeline;
- estado declarativo;
- revisão de mudanças.

---

## Erros Comuns

- deploy manual sem registro;
- usar `latest`;
- rebuildar em produção;
- não testar rollback;
- migration destrutiva sem plano;
- pipeline com secrets em texto;
- ignorar smoke tests;
- não bloquear merge com testes falhando;
- não separar staging e produção;
- deploy sem observabilidade.

---

## Checklist Avançado

- CI roda em PR?
- Build gera artefato imutável?
- Imagem é escaneada?
- Deploy usa tag/sha rastreável?
- Migrations são compatíveis?
- Smoke tests rodam após deploy?
- Rollback foi testado?
- Secrets têm menor privilégio?
- Deploy aparece em logs/dashboards?
- Existe aprovação para produção quando necessário?

CI/CD profissional reduz risco de mudança. O objetivo não é automatizar erro; é criar um caminho confiável do commit até produção.

