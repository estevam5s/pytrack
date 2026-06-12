# Kubernetes com Python: Deploy, Escala, Configuração e Operação

Kubernetes é uma plataforma de orquestração de containers. Ele agenda containers em nós, reinicia processos com falha, escala réplicas, expõe serviços, injeta configuração, monta secrets, executa jobs e oferece primitives para operação de aplicações distribuídas.

Para Python, Kubernetes é comum em APIs FastAPI/Django/Flask, workers Celery/RQ, jobs de ETL, tarefas agendadas, consumidores Kafka, serviços internos e pipelines.

---

## Ideia Central

Você não "roda um container" diretamente. Você declara o estado desejado:

- quero 3 réplicas da API;
- usando a imagem `api-python:1.4.2`;
- com porta 8000;
- com readiness e liveness probes;
- com variáveis vindas de ConfigMap e Secret;
- exposta por um Service;
- escalável por CPU.

O Kubernetes tenta manter esse estado.

---

## Objetos Principais

- **Pod**: menor unidade executável, contém um ou mais containers.
- **Deployment**: gerencia réplicas e atualizações de Pods.
- **Service**: endereço estável para acessar Pods.
- **Ingress**: entrada HTTP externa.
- **ConfigMap**: configuração não sensível.
- **Secret**: configuração sensível.
- **Job**: tarefa finita.
- **CronJob**: tarefa agendada.
- **Namespace**: separação lógica.
- **PersistentVolumeClaim**: solicitação de armazenamento.
- **HorizontalPodAutoscaler**: escala automática.

---

## Pod Simples

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: api-python
spec:
  containers:
    - name: api
      image: api-python:1.0.0
      ports:
        - containerPort: 8000
```

Aplicar:

```bash
kubectl apply -f pod.yml
```

Ver:

```bash
kubectl get pods
kubectl logs pod/api-python
```

Em produção, raramente se cria Pod diretamente. Use Deployment.

---

## Deployment para API Python

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-python
  labels:
    app: api-python
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api-python
  template:
    metadata:
      labels:
        app: api-python
    spec:
      containers:
        - name: api
          image: registry.example.com/api-python:1.0.0
          ports:
            - containerPort: 8000
          command: ["uvicorn"]
          args: ["app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Aplicar:

```bash
kubectl apply -f deployment.yml
kubectl rollout status deployment/api-python
```

---

## Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: api-python
spec:
  selector:
    app: api-python
  ports:
    - name: http
      port: 80
      targetPort: 8000
  type: ClusterIP
```

O Service cria um endereço interno estável. Outros Pods acessam `http://api-python`.

Tipos:

- `ClusterIP`: interno ao cluster.
- `NodePort`: expõe em porta dos nós.
- `LoadBalancer`: cria load balancer externo em cloud.
- `ExternalName`: alias DNS.

---

## Readiness e Liveness Probes

Aplicação Python:

```python
from fastapi import FastAPI

app = FastAPI()


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/ready")
def ready() -> dict[str, str]:
    return {"status": "ready"}
```

Deployment:

```yaml
readinessProbe:
  httpGet:
    path: /ready
    port: 8000
  initialDelaySeconds: 5
  periodSeconds: 10
  timeoutSeconds: 3
  failureThreshold: 3
livenessProbe:
  httpGet:
    path: /health
    port: 8000
  initialDelaySeconds: 20
  periodSeconds: 20
  timeoutSeconds: 3
  failureThreshold: 3
```

Diferença:

- readiness diz se o Pod pode receber tráfego;
- liveness diz se o Pod deve ser reiniciado.

Não faça liveness depender de banco externo de forma agressiva, ou uma instabilidade no banco pode reiniciar toda a aplicação.

---

## ConfigMap

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: api-python-config
data:
  APP_ENV: production
  LOG_LEVEL: INFO
```

Uso:

```yaml
envFrom:
  - configMapRef:
      name: api-python-config
```

---

## Secret

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: api-python-secret
type: Opaque
stringData:
  DATABASE_URL: postgresql://app:senha@postgres:5432/app
  REDIS_URL: redis://redis:6379/0
```

Uso:

```yaml
envFrom:
  - secretRef:
      name: api-python-secret
```

Secrets em Kubernetes não são criptografia completa por padrão para todos os cenários. Configure criptografia em repouso e controle RBAC.

---

## Deployment Completo

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-python
spec:
  replicas: 3
  revisionHistoryLimit: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 0
      maxSurge: 1
  selector:
    matchLabels:
      app: api-python
  template:
    metadata:
      labels:
        app: api-python
    spec:
      terminationGracePeriodSeconds: 30
      containers:
        - name: api
          image: registry.example.com/api-python:1.0.0
          imagePullPolicy: IfNotPresent
          ports:
            - containerPort: 8000
              name: http
          envFrom:
            - configMapRef:
                name: api-python-config
            - secretRef:
                name: api-python-secret
          resources:
            requests:
              cpu: "100m"
              memory: "128Mi"
            limits:
              cpu: "500m"
              memory: "512Mi"
          readinessProbe:
            httpGet:
              path: /ready
              port: http
            initialDelaySeconds: 5
            periodSeconds: 10
          livenessProbe:
            httpGet:
              path: /health
              port: http
            initialDelaySeconds: 20
            periodSeconds: 20
          securityContext:
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: false
            runAsNonRoot: true
            runAsUser: 1000
            capabilities:
              drop: ["ALL"]
```

---

## Recursos: Requests e Limits

```yaml
resources:
  requests:
    cpu: "100m"
    memory: "128Mi"
  limits:
    cpu: "500m"
    memory: "512Mi"
```

`requests` orienta agendamento. `limits` impõe teto.

Para Python:

- memória precisa considerar imports, workers, cache e picos;
- CPU baixa demais pode degradar latência;
- limite de memória estourado causa OOMKilled;
- Gunicorn/Uvicorn workers devem ser ajustados ao CPU disponível.

---

## Gunicorn com Uvicorn Workers

Para produção:

```bash
gunicorn app.main:app \
  -k uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000 \
  --workers 2 \
  --timeout 60
```

Deployment:

```yaml
command: ["gunicorn"]
args:
  - "app.main:app"
  - "-k"
  - "uvicorn.workers.UvicornWorker"
  - "--bind"
  - "0.0.0.0:8000"
  - "--workers"
  - "2"
  - "--timeout"
  - "60"
```

Não use número fixo de workers sem considerar CPU/memória do Pod.

---

## Ingress

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api-python
spec:
  rules:
    - host: api.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: api-python
                port:
                  number: 80
```

Ingress depende de um Ingress Controller, como NGINX Ingress, Traefik, HAProxy ou controller da cloud.

---

## Job para Migration

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: api-python-migrate
spec:
  backoffLimit: 1
  template:
    spec:
      restartPolicy: Never
      containers:
        - name: migrate
          image: registry.example.com/api-python:1.0.0
          command: ["alembic"]
          args: ["upgrade", "head"]
          envFrom:
            - secretRef:
                name: api-python-secret
```

Execute migrations como etapa controlada do deploy. Evite múltiplas réplicas da API rodando migration simultaneamente.

---

## CronJob para Rotinas Python

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: relatorio-diario
spec:
  schedule: "30 7 * * *"
  timeZone: "America/Sao_Paulo"
  concurrencyPolicy: Forbid
  successfulJobsHistoryLimit: 3
  failedJobsHistoryLimit: 3
  jobTemplate:
    spec:
      template:
        spec:
          restartPolicy: Never
          containers:
            - name: relatorio
              image: registry.example.com/api-python:1.0.0
              command: ["python"]
              args: ["-m", "app.jobs.relatorio_diario"]
              envFrom:
                - configMapRef:
                    name: api-python-config
                - secretRef:
                    name: api-python-secret
```

`concurrencyPolicy: Forbid` evita sobreposição de execuções.

---

## Worker Python

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: worker-python
spec:
  replicas: 2
  selector:
    matchLabels:
      app: worker-python
  template:
    metadata:
      labels:
        app: worker-python
    spec:
      containers:
        - name: worker
          image: registry.example.com/api-python:1.0.0
          command: ["python"]
          args: ["-m", "app.worker"]
          envFrom:
            - secretRef:
                name: api-python-secret
          resources:
            requests:
              cpu: "100m"
              memory: "128Mi"
            limits:
              cpu: "500m"
              memory: "512Mi"
```

Workers precisam lidar com `SIGTERM` para encerrar sem perder mensagens.

---

## HorizontalPodAutoscaler

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-python
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-python
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

HPA exige métricas disponíveis, normalmente via metrics-server.

Para workers, escalar por tamanho de fila pode exigir KEDA.

---

## Namespaces

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: producao
```

Uso:

```bash
kubectl apply -f namespace.yml
kubectl -n producao get pods
```

Namespaces ajudam a separar ambientes, equipes e permissões, mas não são isolamento de segurança completo por si só.

---

## RBAC Básico

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: api-python
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: api-python-read-config
rules:
  - apiGroups: [""]
    resources: ["configmaps"]
    verbs: ["get", "list"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: api-python-read-config
subjects:
  - kind: ServiceAccount
    name: api-python
roleRef:
  kind: Role
  name: api-python-read-config
  apiGroup: rbac.authorization.k8s.io
```

Princípio: conceda o mínimo necessário.

---

## Observabilidade

Aplicação Python deve:

- logar em stdout/stderr;
- incluir request id/correlation id;
- expor métricas se necessário;
- propagar traces;
- registrar erros com contexto.

Endpoint Prometheus com `prometheus-client`:

```python
from fastapi import FastAPI, Response
from prometheus_client import Counter, generate_latest, CONTENT_TYPE_LATEST

app = FastAPI()
REQUESTS = Counter("app_requests_total", "Total de requests")


@app.middleware("http")
async def count_requests(request, call_next):
    REQUESTS.inc()
    return await call_next(request)


@app.get("/metrics")
def metrics() -> Response:
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)
```

---

## Debugging

Comandos essenciais:

```bash
kubectl get pods
kubectl describe pod nome-do-pod
kubectl logs deployment/api-python
kubectl logs pod/nome-do-pod -c api
kubectl exec -it pod/nome-do-pod -- sh
kubectl get events --sort-by=.lastTimestamp
kubectl rollout history deployment/api-python
kubectl rollout undo deployment/api-python
```

Problemas comuns:

- `ImagePullBackOff`: imagem inexistente, tag errada ou falta de credencial.
- `CrashLoopBackOff`: aplicação inicia e morre repetidamente.
- `OOMKilled`: limite de memória excedido.
- `CreateContainerConfigError`: ConfigMap/Secret ausente.
- readiness falhando: Pod não entra no Service.

---

## Estratégia de Deploy

Rolling update padrão:

```yaml
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxUnavailable: 0
    maxSurge: 1
```

Para deploy seguro:

- imagem com tag imutável;
- migrations controladas;
- readiness probe correta;
- rollback testado;
- logs e métricas monitorados;
- smoke test após deploy.

---

## Kustomize

Base:

```text
k8s/
├── base/
│   ├── deployment.yml
│   ├── service.yml
│   └── kustomization.yml
└── overlays/
    ├── staging/
    └── production/
```

`kustomization.yml`:

```yaml
resources:
  - deployment.yml
  - service.yml

images:
  - name: registry.example.com/api-python
    newTag: 1.0.0
```

Aplicar:

```bash
kubectl apply -k k8s/overlays/production
```

---

## Helm

Helm empacota manifests parametrizáveis.

```bash
helm create api-python
helm upgrade --install api-python ./api-python -n producao
```

Use Helm quando precisa distribuir chart, parametrizar muitos ambientes ou integrar com ecossistema de charts.

Para projetos simples, Kustomize pode ser suficiente.

---

## Checklist de Kubernetes para Python

- imagem é imutável e versionada?
- container roda como não root?
- requests e limits foram definidos?
- readiness e liveness estão corretas?
- secrets não estão em texto plano no repositório?
- migrations rodam como Job controlado?
- logs vão para stdout/stderr?
- aplicação encerra bem em `SIGTERM`?
- Service seleciona labels corretos?
- HPA tem métricas disponíveis?
- deploy tem rollback?
- há monitoramento de CPU, memória, latência e erros?
- probes não reiniciam a aplicação por falha temporária de dependência externa?
- manifests são organizados por ambiente?

