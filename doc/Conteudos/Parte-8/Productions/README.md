# Deploy e Produção para Aplicações Python

Trilha completa e progressiva sobre colocar aplicações Python em produção: VPS, Docker Deploy, Kubernetes Deploy, Serverless, CI/CD pipelines, balanceamento de carga, escalabilidade e reverse proxy.

O objetivo é sair de uma aplicação que roda localmente até um serviço operável em produção: seguro, automatizado, observável, escalável, resiliente, versionado e preparado para incidentes.

---

## Arquivos da Trilha

1. [VPS: Deploy Profissional em Servidores Linux](./01_vps.md)
2. [Docker Deploy: Imagens, Containers e Entrega em Produção](./02_docker_deploy.md)
3. [Kubernetes Deploy: Manifests, Rollouts e Operação](./03_kubernetes_deploy.md)
4. [Serverless: Funções, Containers Gerenciados e Trade-offs](./04_serverless.md)
5. [CI/CD Pipelines: Build, Teste, Release e Deploy Automatizado](./05_ci_cd_pipelines.md)
6. [Balanceamento de Carga: Distribuição, Saúde e Alta Disponibilidade](./06_balanceamento_carga.md)
7. [Escalabilidade: Capacidade, Gargalos e Arquitetura de Crescimento](./07_escalabilidade.md)
8. [Reverse Proxy: Nginx, TLS, Roteamento e Segurança](./08_reverse_proxy.md)

---

## Competências Esperadas

Ao concluir esta trilha, você deve saber:

- preparar uma VPS Linux para rodar aplicações Python;
- configurar usuário, firewall, systemd, logs, backups e TLS;
- empacotar aplicações com Docker para produção;
- publicar imagens em registry e fazer deploy com segurança;
- criar Deployments, Services, ConfigMaps, Secrets, Ingress e probes no Kubernetes;
- avaliar quando usar serverless e seus limites;
- criar pipelines com testes, build, análise, release e deploy;
- aplicar blue/green, rolling deploy e rollback;
- configurar balanceamento de carga e health checks;
- diagnosticar gargalos e escalar aplicação, banco, cache e filas;
- usar reverse proxy para TLS, roteamento, compressão, headers e proteção;
- operar produção com disciplina de segurança, observabilidade e automação.

---

## Aplicação de Referência

Os exemplos assumem uma API Python com FastAPI:

```text
app/
├── main.py
├── settings.py
├── requirements.txt
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
    return {"message": "API Python em producao"}
```

Dependências:

```txt
fastapi==0.115.0
uvicorn[standard]==0.30.6
```

---

## Regra Principal

Produção não é apenas "subir o código". Produção exige repetibilidade, rollback, segurança, observabilidade, isolamento, capacidade, backups e clareza operacional.

