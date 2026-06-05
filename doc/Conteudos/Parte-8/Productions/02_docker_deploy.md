# Docker Deploy: Imagens, Containers e Entrega em Produção

Docker Deploy é o uso de imagens e containers para empacotar, distribuir e executar aplicações em ambientes de produção. Para Python, Docker reduz diferenças entre máquinas, simplifica dependências nativas e torna deploys mais previsíveis.

Docker não resolve arquitetura, segurança ou observabilidade por conta própria. Uma aplicação mal configurada continuará frágil dentro de um container.

---

## Conceitos Essenciais

- **Imagem**: artefato imutável com runtime, dependências e código.
- **Container**: processo em execução criado a partir de uma imagem.
- **Registry**: local onde imagens são publicadas.
- **Tag**: identificador de versão da imagem.
- **Digest**: identificador imutável do conteúdo.
- **Volume**: persistência fora do container.
- **Network**: comunicação entre containers.

Produção deve tratar imagem como release.

---

## Dockerfile para FastAPI

```dockerfile
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build:

```bash
docker build -t minha-api:local .
```

Run:

```bash
docker run --rm -p 8000:8000 minha-api:local
```

---

## `.dockerignore`

```dockerignore
.git
.venv
__pycache__
*.pyc
.pytest_cache
.mypy_cache
.ruff_cache
.env
logs
data
dist
build
*.sqlite3
```

Sem `.dockerignore`, arquivos sensíveis e grandes podem entrar no contexto de build.

---

## Imagens Menores e Seguras

Boas práticas:

- use base oficial e específica;
- fixe versão principal;
- evite instalar ferramentas desnecessárias;
- use `--no-cache-dir`;
- rode como usuário não root;
- remova caches;
- escaneie vulnerabilidades;
- prefira multi-stage quando houver build nativo.

Usuário não root:

```dockerfile
RUN adduser --disabled-password --gecos "" appuser
USER appuser
```

Se a aplicação não precisa de root, não rode como root.

---

## Gunicorn em Container

Para produção:

```dockerfile
CMD ["gunicorn", "app.main:app", \
     "-k", "uvicorn.workers.UvicornWorker", \
     "--bind", "0.0.0.0:8000", \
     "--workers", "2", \
     "--timeout", "60"]
```

Em Kubernetes, muitas equipes usam um processo por container e escalam por réplicas. A quantidade de workers deve ser medida.

---

## Variáveis e Segredos

Passe configuração por ambiente:

```bash
docker run --rm \
  -e APP_ENV=production \
  -e DATABASE_URL=postgresql://... \
  minha-api:1.0.0
```

Evite:

- segredo no Dockerfile;
- `.env` copiado para imagem;
- token em argumento de build;
- imagem com credenciais.

Segredos devem vir de secret manager, plataforma, Kubernetes Secret, Docker secret ou variável segura do runtime.

---

## Registry e Tags

Exemplo:

```bash
docker tag minha-api:local ghcr.io/org/minha-api:1.0.0
docker push ghcr.io/org/minha-api:1.0.0
```

Tags comuns:

```text
1.0.0
1.0.0-commitsha
main-commitsha
```

Evite depender de `latest` em produção. Use tag imutável ou digest:

```text
ghcr.io/org/minha-api@sha256:...
```

---

## Docker Compose em Produção Simples

```yaml
services:
  api:
    image: ghcr.io/org/minha-api:1.0.0
    restart: always
    env_file:
      - .env
    ports:
      - "127.0.0.1:8000:8000"
    depends_on:
      - redis

  redis:
    image: redis:7-alpine
    restart: always
    volumes:
      - redis-data:/data

volumes:
  redis-data:
```

Nginx fica na frente fazendo TLS e proxy.

---

## Deploy com Compose

```bash
docker compose pull
docker compose up -d
docker compose ps
docker compose logs -f api
```

Rollback:

```bash
docker compose pull api
docker compose up -d api
```

Rollback real exige saber a tag anterior e manter imagem disponível.

---

## Health Check

No Dockerfile:

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/health')"
```

Ou no Compose:

```yaml
healthcheck:
  test: ["CMD", "python", "-c", "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/health')"]
  interval: 30s
  timeout: 3s
  retries: 3
```

Health check não substitui monitoramento externo.

---

## Logs em Containers

Aplicação deve logar em stdout/stderr.

```text
container stdout -> Docker logging driver -> coletor -> armazenamento
```

Evite logs em arquivo dentro do container. Container pode morrer e ser recriado.

Use JSON e inclua:

- service;
- env;
- version;
- request id;
- trace id;
- level;
- event.

---

## Persistência

Containers são descartáveis. Não grave dados importantes no filesystem interno.

Use:

- volumes;
- banco externo;
- object storage;
- Redis persistente quando necessário;
- backups.

Uploads de usuário normalmente devem ir para S3, GCS, MinIO ou volume com backup.

---

## Rede

Não exponha tudo:

```yaml
ports:
  - "127.0.0.1:8000:8000"
```

Isso expõe apenas localmente para Nginx no host.

Dentro do Compose, serviços conversam pelo nome:

```text
redis://redis:6379/0
```

---

## Segurança de Imagem

Práticas:

- escanear com Trivy, Grype ou registry scanner;
- atualizar base image;
- usar usuário não root;
- reduzir pacotes;
- não embutir segredos;
- assinar imagens quando necessário;
- gerar SBOM;
- fixar dependências Python.

Exemplo:

```bash
trivy image ghcr.io/org/minha-api:1.0.0
```

---

## Zero Downtime

Docker Compose sozinho não é ideal para zero downtime complexo. Opções:

- rodar múltiplas instâncias com proxy;
- blue/green com duas stacks;
- Traefik/Nginx roteando para versão ativa;
- migrar para Kubernetes ou PaaS.

Para muitos projetos, alguns segundos de restart são aceitáveis. Para outros, não.

---

## Erros Comuns

- usar `latest` em produção;
- copiar `.env` para imagem;
- rodar como root sem necessidade;
- gravar upload dentro do container;
- não configurar health check;
- não ter rollback;
- rebuildar imagem direto no servidor;
- não escanear vulnerabilidades;
- expor banco/Redis para internet;
- confundir container com isolamento absoluto.

---

## Checklist Avançado

- Imagem é construída em CI?
- Tag é rastreável para commit/release?
- Segredos entram apenas em runtime?
- Container roda como usuário não root?
- Logs vão para stdout/stderr?
- Health check existe?
- Volumes e dados têm backup?
- Imagens são escaneadas?
- Rollback foi testado?
- Nginx/proxy faz TLS na frente?

Docker Deploy traz repetibilidade. A maturidade vem quando imagem, registry, pipeline, configuração, observabilidade e rollback trabalham juntos.

