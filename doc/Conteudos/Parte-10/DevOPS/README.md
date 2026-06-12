# DevOps e Infraestrutura para Python

Trilha completa e progressiva sobre containers e orquestração para aplicações Python, cobrindo Docker, Docker Compose e Kubernetes.

O objetivo é sair do primeiro `Dockerfile` até práticas profissionais: imagens seguras, builds reproduzíveis, ambientes locais completos, redes, volumes, health checks, observabilidade, deploys, probes, secrets, escalabilidade e operação em produção.

---

## Arquivos da Trilha

1. [Docker com Python: Imagens, Containers, Segurança e Produção](./01_docker_python.md)
2. [Docker Compose com Python: Ambientes Locais, Serviços e Integração](./02_docker_compose_python.md)
3. [Kubernetes com Python: Deploy, Escala, Configuração e Operação](./03_kubernetes_python.md)

---

## Competências Esperadas

Ao concluir esta trilha, você deve saber:

- criar imagens Docker para scripts, APIs, workers e CLIs Python;
- escrever Dockerfiles pequenos, seguros e reproduzíveis;
- usar multi-stage builds, cache e `.dockerignore`;
- rodar bancos, caches e aplicações com Docker Compose;
- configurar redes, volumes, variáveis, health checks e profiles;
- entender Pods, Deployments, Services, ConfigMaps, Secrets, Jobs e CronJobs;
- publicar aplicações Python em Kubernetes;
- configurar readiness/liveness probes;
- aplicar boas práticas de segurança, logs e observabilidade;
- evoluir de ambiente local para produção com disciplina.

---

## Projeto Python Base Usado nos Exemplos

Muitos exemplos usam uma API FastAPI simples:

```text
app-python/
├── pyproject.toml
├── requirements.txt
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── settings.py
│   └── worker.py
└── tests/
```

`app/main.py`:

```python
from fastapi import FastAPI

app = FastAPI()


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/")
def home() -> dict[str, str]:
    return {"message": "Aplicação Python em container"}
```

Dependências:

```txt
fastapi==0.115.0
uvicorn[standard]==0.30.6
```

---

## Sequência Recomendada

Comece por Docker para entender imagem, container, filesystem, rede e processo. Depois use Docker Compose para ambientes com múltiplos serviços. Por fim avance para Kubernetes, onde o foco muda de "rodar container" para "operar aplicações distribuídas".

