# Docker com Python: Imagens, Containers, Segurança e Produção

Docker empacota uma aplicação e suas dependências em uma imagem executável. A imagem roda como container, isolando processo, filesystem, ambiente e rede. Para Python, Docker resolve problemas clássicos: versões diferentes de Python, bibliotecas nativas, dependências conflitantes e ambientes inconsistentes entre máquinas.

Docker não substitui boas práticas de aplicação. Uma aplicação mal configurada, sem logs, sem health check e com dependências soltas continuará frágil dentro de container.

---

## Conceitos Essenciais

- **Imagem**: pacote imutável com sistema base, runtime, dependências e código.
- **Container**: processo em execução criado a partir de uma imagem.
- **Dockerfile**: receita para construir a imagem.
- **Registry**: local onde imagens são publicadas, como Docker Hub, GHCR, ECR ou GCR.
- **Layer**: camada do build reutilizada pelo cache.
- **Volume**: persistência fora do ciclo de vida do container.
- **Network**: comunicação entre containers.

---

## Primeiro Dockerfile Python

Aplicação simples:

```python
# app.py
print("Olá, Docker com Python")
```

Dockerfile:

```dockerfile
FROM python:3.12-slim

WORKDIR /app
COPY app.py .

CMD ["python", "app.py"]
```

Build:

```bash
docker build -t hello-python .
```

Execução:

```bash
docker run --rm hello-python
```

O `--rm` remove o container ao final da execução.

---

## Dockerfile para Script com Dependências

Estrutura:

```text
meu-script/
├── Dockerfile
├── requirements.txt
└── main.py
```

`requirements.txt`:

```txt
requests==2.32.3
```

`main.py`:

```python
import requests


def main() -> None:
    response = requests.get("https://example.com", timeout=10)
    print(response.status_code)


if __name__ == "__main__":
    main()
```

Dockerfile:

```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY main.py .

CMD ["python", "main.py"]
```

Ponto importante: copie `requirements.txt` antes do código para aproveitar cache. Se o código muda mas dependências não mudam, o Docker reaproveita a layer do `pip install`.

---

## `.dockerignore`

Sem `.dockerignore`, você pode enviar arquivos desnecessários para o contexto de build.

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

Nunca envie `.env`, credenciais, dumps ou arquivos grandes sem necessidade para o build.

---

## API FastAPI em Docker

Estrutura:

```text
api/
├── Dockerfile
├── requirements.txt
└── app/
    ├── __init__.py
    └── main.py
```

`app/main.py`:

```python
from fastapi import FastAPI

app = FastAPI()


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/clientes/{cliente_id}")
def buscar_cliente(cliente_id: int) -> dict[str, int | str]:
    return {"id": cliente_id, "nome": "Cliente Exemplo"}
```

`requirements.txt`:

```txt
fastapi==0.115.0
uvicorn[standard]==0.30.6
```

Dockerfile:

```dockerfile
FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build e run:

```bash
docker build -t api-python .
docker run --rm -p 8000:8000 api-python
```

Teste:

```bash
curl http://localhost:8000/health
```

---

## Variáveis de Ambiente

`app/settings.py`:

```python
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "api-python"
    database_url: str
    debug: bool = False


settings = Settings()
```

Docker:

```bash
docker run --rm \
  -p 8000:8000 \
  -e DATABASE_URL=postgresql://user:pass@db:5432/app \
  -e DEBUG=false \
  api-python
```

Não coloque segredos no Dockerfile. Variáveis sensíveis devem vir do ambiente, secret manager ou plataforma de deploy.

---

## CMD vs ENTRYPOINT

`CMD` define comando padrão:

```dockerfile
CMD ["python", "main.py"]
```

`ENTRYPOINT` define executável principal:

```dockerfile
ENTRYPOINT ["python", "-m", "app.cli"]
CMD ["--help"]
```

Execução:

```bash
docker run app-cli processar --arquivo dados.csv
```

Use `ENTRYPOINT` quando a imagem representa uma ferramenta. Use `CMD` quando quer permitir sobrescrita simples do comando.

---

## Rodando Comandos Temporários

```bash
docker run --rm api-python python -m compileall app
docker run --rm api-python python -c "import sys; print(sys.version)"
```

Entrar no shell:

```bash
docker run --rm -it api-python sh
```

Em imagens `slim`, geralmente não há `bash`; use `sh`.

---

## Volumes

Montando pasta local:

```bash
docker run --rm \
  -v "$PWD/data:/app/data" \
  api-python \
  python -m app.processar /app/data/input.csv
```

Volumes são úteis para:

- arquivos de entrada;
- relatórios gerados;
- desenvolvimento local;
- persistência quando não se usa banco externo.

Não grave dados importantes apenas no filesystem interno do container. Containers são descartáveis.

---

## Usuário Não Root

Rodar como root é desnecessário na maioria das aplicações.

```dockerfile
FROM python:3.12-slim

RUN addgroup --system app && adduser --system --ingroup app app

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app

USER app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Isso reduz impacto de uma eventual exploração.

---

## Multi-stage Build

Útil quando há dependências de compilação.

```dockerfile
FROM python:3.12-slim AS builder

WORKDIR /build

RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip wheel --no-cache-dir --wheel-dir /wheels -r requirements.txt


FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY --from=builder /wheels /wheels
RUN pip install --no-cache-dir /wheels/* \
    && rm -rf /wheels

COPY app ./app

RUN addgroup --system app && adduser --system --ingroup app app
USER app

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

O estágio final não precisa carregar compiladores.

---

## Dependências Reproduzíveis

Evite dependências soltas:

```txt
fastapi
uvicorn
requests
```

Prefira versões fixadas ou lockfile:

```txt
fastapi==0.115.0
uvicorn[standard]==0.30.6
requests==2.32.3
```

Com `pip-tools`:

```bash
pip install pip-tools
pip-compile requirements.in
```

Com Poetry ou uv, use lockfile e copie apenas os arquivos necessários no Dockerfile.

---

## Dockerfile com uv

`uv` pode acelerar instalação.

```dockerfile
FROM python:3.12-slim

COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

WORKDIR /app

COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev

COPY app ./app

ENV PATH="/app/.venv/bin:$PATH"

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

O lockfile torna o build mais previsível.

---

## Healthcheck

Dockerfile:

```dockerfile
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health', timeout=3)"
```

Healthcheck ajuda orquestradores e operadores a detectarem falhas. Em Kubernetes, prefira probes nativas.

---

## Logs em Containers

Aplicações em container devem logar em stdout/stderr.

```python
import logging


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)

logger = logging.getLogger(__name__)
logger.info("Aplicação iniciada")
```

Não dependa de arquivo local para logs em produção. A plataforma deve coletar stdout/stderr.

---

## Sinais e Encerramento Gracioso

Containers recebem sinais como `SIGTERM`. A aplicação deve encerrar sem corromper trabalho.

Worker simples:

```python
import signal
import time


encerrar = False


def handle_signal(signum, frame) -> None:
    global encerrar
    encerrar = True


signal.signal(signal.SIGTERM, handle_signal)
signal.signal(signal.SIGINT, handle_signal)


while not encerrar:
    print("Processando...")
    time.sleep(2)

print("Encerrando com segurança")
```

Para workers reais, finalize item atual, confirme mensagem e feche conexões.

---

## Build Args

```dockerfile
ARG APP_VERSION=dev
ENV APP_VERSION=${APP_VERSION}
```

Build:

```bash
docker build --build-arg APP_VERSION=1.2.0 -t api-python:1.2.0 .
```

Não use `ARG` para segredos. Valores podem aparecer no histórico da imagem.

---

## Tags de Imagem

Evite depender apenas de `latest`.

Boas tags:

```text
api-python:1.4.2
api-python:2026-05-15-abc123
api-python:git-sha
```

Em produção, use tag imutável ou digest.

---

## Segurança de Imagens

Práticas:

- use imagens oficiais e específicas;
- prefira `slim` quando possível;
- rode como usuário não root;
- reduza pacotes do sistema;
- não copie segredos;
- use `.dockerignore`;
- faça scan de vulnerabilidades;
- atualize imagem base periodicamente;
- fixe versões;
- gere SBOM quando necessário.

Exemplo de scan:

```bash
docker scout cves api-python:1.0.0
```

Ferramentas comuns: Trivy, Grype, Docker Scout, Snyk.

---

## Imagem para Testes

```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt requirements-dev.txt ./
RUN pip install --no-cache-dir -r requirements.txt -r requirements-dev.txt

COPY app ./app
COPY tests ./tests

CMD ["pytest", "-q"]
```

Executar:

```bash
docker build -t api-python-test -f Dockerfile.test .
docker run --rm api-python-test
```

Isso ajuda CI a rodar em ambiente consistente.

---

## Exemplo Profissional Completo

```dockerfile
FROM python:3.12-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PIP_NO_CACHE_DIR=1

RUN addgroup --system app \
    && adduser --system --ingroup app app

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app

RUN chown -R app:app /app
USER app

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health', timeout=3)"

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--proxy-headers"]
```

Esse Dockerfile:

- usa imagem slim;
- evita bytecode e buffering;
- instala dependências antes do código;
- roda com usuário não root;
- expõe porta;
- define healthcheck;
- usa comando em formato exec.

---

## Problemas Comuns

### Funciona local, falha no container

Possíveis causas:

- arquivo não copiado;
- variável de ambiente ausente;
- path relativo incorreto;
- dependência nativa faltando;
- porta não publicada;
- aplicação escutando em `127.0.0.1` em vez de `0.0.0.0`.

### Imagem gigante

Possíveis causas:

- contexto sem `.dockerignore`;
- dependências de build no estágio final;
- cache de pip;
- arquivos de dados copiados;
- imagem base grande.

### Container encerra imediatamente

Container vive enquanto o processo principal vive. Se seu script termina, o container termina.

---

## Checklist de Docker para Python

- Dockerfile copia dependências antes do código?
- existe `.dockerignore`?
- dependências estão fixadas?
- aplicação escuta em `0.0.0.0`?
- segredos ficam fora da imagem?
- container roda como usuário não root?
- logs vão para stdout/stderr?
- há healthcheck ou endpoint `/health`?
- imagem tem tag versionada?
- build foi testado em ambiente limpo?
- tamanho da imagem é aceitável?
- vulnerabilidades foram avaliadas?

