# Deploy Automatizado, Versionamento, Build e Release

CI valida. CD entrega. Um fluxo profissional de release precisa de versionamento, build reproduzível, testes automatizados, artefatos, deploy automatizado, rollback e rastreabilidade.

---

## Versionamento Semântico

SemVer:

```text
MAJOR.MINOR.PATCH
```

Exemplos:

- `1.0.0`: primeira versão estável.
- `1.1.0`: nova funcionalidade compatível.
- `1.1.1`: correção.
- `2.0.0`: mudança incompatível.

Para APIs, versionamento também envolve contrato HTTP/GraphQL/gRPC.

---

## Tags Git

```bash
git tag -a v1.4.2 -m "Release v1.4.2"
git push origin v1.4.2
```

Pipelines podem disparar release por tag.

```yaml
on:
  push:
    tags:
      - "v*"
```

---

## Build Python

```bash
pip install build
python -m build
```

Gera:

```text
dist/
├── pacote-1.0.0.tar.gz
└── pacote-1.0.0-py3-none-any.whl
```

Para aplicações, muitas equipes preferem build de imagem Docker em vez de wheel.

---

## Build Docker Versionado

```bash
docker build -t registry.example.com/minha-api:1.4.2 .
docker push registry.example.com/minha-api:1.4.2
```

Também publique tag por SHA:

```bash
docker build -t registry.example.com/minha-api:git-abc123 .
```

Produção deve usar tag imutável ou digest, não depender de `latest`.

---

## Testes Automatizados

Camadas:

- unitários: rápidos, regra pura;
- integração: banco, Redis, filas;
- contrato: API e consumidores;
- end-to-end: fluxo completo;
- smoke test: pós-deploy.

Exemplo:

```bash
ruff check .
mypy app
pytest -q --cov=app
```

---

## Pipeline de Release

Fluxo:

```text
PR -> lint/test -> merge main -> build image -> deploy staging -> smoke test -> approve -> deploy production -> tag/release notes
```

Alternativa por tag:

```text
tag v1.4.2 -> build -> publish -> deploy production
```

---

## Deploy Automatizado via systemd

```bash
cd /opt/minha-api
git fetch --all
git checkout v1.4.2
. .venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
sudo systemctl restart minha-api
```

Automatize por SSH, Ansible ou pipeline.

---

## Deploy com Docker Compose

```bash
docker compose pull
docker compose up -d
docker compose exec api alembic upgrade head
```

Melhor:

```bash
docker compose run --rm migrate
docker compose up -d api worker
```

Migrations devem ser controladas.

---

## Deploy em Kubernetes

```bash
kubectl set image deployment/minha-api api=registry.example.com/minha-api:1.4.2
kubectl rollout status deployment/minha-api
```

Rollback:

```bash
kubectl rollout undo deployment/minha-api
```

Migrations:

```bash
kubectl apply -f job-migrate.yml
kubectl wait --for=condition=complete job/minha-api-migrate --timeout=120s
```

---

## Release Notes

Boas release notes incluem:

- novas funcionalidades;
- correções;
- mudanças incompatíveis;
- migrations;
- riscos operacionais;
- instruções de rollback.

Exemplo:

```markdown
## v1.4.2

- Corrige timeout no envio de emails.
- Adiciona índice em `pedidos(cliente_id, criado_em)`.
- Migration: `20260515_add_pedidos_index`.
- Rollback: voltar imagem para `v1.4.1`; migration é compatível.
```

---

## Estratégias de Deploy

Rolling:

- substitui instâncias gradualmente;
- simples e comum.

Blue/Green:

- dois ambientes;
- troca tráfego de uma vez;
- rollback rápido.

Canary:

- libera para pequena porcentagem;
- monitora antes de expandir.

Feature flags:

- separa deploy de ativação de funcionalidade.

---

## Rollback

Rollback precisa ser planejado antes do deploy.

Perguntas:

- imagem anterior ainda existe?
- migrations são reversíveis?
- mudança é backward compatible?
- contrato da API mudou?
- filas/eventos mudaram formato?
- cache precisa ser limpo?

Migrations destrutivas devem ser feitas em etapas.

---

## Checklist Release

- versão está definida?
- changelog/release notes existem?
- testes passaram?
- imagem/artefato foi publicado?
- SBOM ou scan é necessário?
- staging foi validado?
- migrations foram avaliadas?
- deploy tem rollback?
- smoke test pós-deploy existe?
- monitoramento será observado após release?

