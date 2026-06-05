# Kubernetes Deploy: Manifests, Rollouts e Operação

Kubernetes é uma plataforma de orquestração de containers. Ele agenda Pods, mantém réplicas, faz rollouts, descobre serviços, gerencia configuração, reinicia workloads com falha e oferece primitivas para operação em escala.

Kubernetes é poderoso, mas não é o primeiro passo obrigatório para toda aplicação. Ele adiciona complexidade operacional e exige maturidade em containers, rede, observabilidade, segurança e automação.

---

## Conceitos Essenciais

- **Cluster**: conjunto de máquinas que rodam Kubernetes.
- **Node**: máquina do cluster.
- **Pod**: menor unidade executável, contém um ou mais containers.
- **Deployment**: controla réplicas e atualização de Pods.
- **Service**: expõe Pods de forma estável dentro do cluster.
- **Ingress**: entrada HTTP/HTTPS para serviços.
- **ConfigMap**: configuração não sensível.
- **Secret**: configuração sensível.
- **Namespace**: separação lógica.
- **Probe**: verificação de saúde.

---

## Arquitetura Básica

```text
Internet
  -> Load Balancer
  -> Ingress Controller
  -> Service
  -> Pods da API
  -> Banco/Redis/Fila
```

Kubernetes normalmente não deve hospedar banco crítico sem equipe preparada. Banco gerenciado é mais simples para muitos produtos.

---

## Deployment

`deployment.yaml`:

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
          image: ghcr.io/org/api-python:1.0.0
          ports:
            - containerPort: 8000
          env:
            - name: APP_ENV
              value: production
```

Aplicar:

```bash
kubectl apply -f deployment.yaml
kubectl get pods
```

---

## Service

`service.yaml`:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: api-python
spec:
  selector:
    app: api-python
  ports:
    - port: 80
      targetPort: 8000
  type: ClusterIP
```

O Service dá endereço estável para Pods que podem morrer e renascer com IP diferente.

---

## ConfigMap e Secret

ConfigMap:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: api-python-config
data:
  APP_ENV: production
  LOG_LEVEL: INFO
```

Secret:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: api-python-secret
type: Opaque
stringData:
  DATABASE_URL: postgresql://user:pass@host:5432/app
```

Uso:

```yaml
envFrom:
  - configMapRef:
      name: api-python-config
  - secretRef:
      name: api-python-secret
```

Secrets do Kubernetes não são criptografia completa por si só. Configure criptografia em repouso e controle de acesso.

---

## Probes

Liveness probe: quando reiniciar container.

Readiness probe: quando enviar tráfego para o Pod.

```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 8000
  initialDelaySeconds: 15
  periodSeconds: 20

readinessProbe:
  httpGet:
    path: /ready
    port: 8000
  initialDelaySeconds: 5
  periodSeconds: 10
```

Não coloque dependência externa instável em liveness. Isso pode causar restart em massa.

---

## Recursos

Defina requests e limits:

```yaml
resources:
  requests:
    cpu: "250m"
    memory: "256Mi"
  limits:
    cpu: "1000m"
    memory: "512Mi"
```

Requests ajudam o scheduler. Limits evitam consumo descontrolado, mas CPU limit mal ajustado pode causar throttling.

---

## Ingress

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api-python
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
    - hosts:
        - api.exemplo.com
      secretName: api-python-tls
  rules:
    - host: api.exemplo.com
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

Ingress depende de um Ingress Controller, como Nginx Ingress, Traefik ou ALB Controller.

---

## Rollout

Atualizar imagem:

```bash
kubectl set image deployment/api-python api=ghcr.io/org/api-python:1.1.0
kubectl rollout status deployment/api-python
```

Histórico:

```bash
kubectl rollout history deployment/api-python
```

Rollback:

```bash
kubectl rollout undo deployment/api-python
```

Rolling update bem configurado evita indisponibilidade.

---

## Estratégia de Deploy

```yaml
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxUnavailable: 0
    maxSurge: 1
```

Com `maxUnavailable: 0`, Kubernetes mantém capacidade durante atualização, desde que recursos existam.

---

## HPA

Horizontal Pod Autoscaler:

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
  minReplicas: 3
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

Para APIs, CPU pode não representar bem gargalo. Métricas customizadas como RPS, fila ou latência podem ser melhores.

---

## Jobs e Migrations

Migrations não devem rodar automaticamente em cada Pod sem controle.

Use Job:

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: api-python-migrate
spec:
  template:
    spec:
      restartPolicy: Never
      containers:
        - name: migrate
          image: ghcr.io/org/api-python:1.1.0
          command: ["python", "-m", "alembic", "upgrade", "head"]
```

Migrations precisam ser compatíveis com versão anterior e nova durante rolling deploy.

---

## Namespaces

```bash
kubectl create namespace production
kubectl apply -n production -f k8s/
```

Use namespaces para separar ambientes, times ou domínios. Não trate namespace como fronteira forte de segurança sem RBAC e políticas.

---

## Segurança

Práticas:

- imagens sem root;
- `readOnlyRootFilesystem` quando possível;
- RBAC mínimo;
- secrets protegidos;
- NetworkPolicies;
- scan de imagens;
- admission policies;
- limites de recursos;
- evitar containers privilegiados;
- atualizar cluster e nodes.

Exemplo:

```yaml
securityContext:
  runAsNonRoot: true
  allowPrivilegeEscalation: false
```

---

## Observabilidade

Kubernetes exige:

- logs centralizados;
- métricas de Pods, nodes e aplicação;
- traces;
- eventos do cluster;
- alertas para restarts;
- métricas de HPA;
- dashboards por namespace e deployment.

Comandos úteis:

```bash
kubectl logs deployment/api-python
kubectl describe pod nome-do-pod
kubectl get events --sort-by=.metadata.creationTimestamp
kubectl top pods
```

---

## Helm e Kustomize

Para muitos manifests, use ferramentas:

- **Helm**: templates e releases.
- **Kustomize**: overlays sem templates.

Exemplo de overlays:

```text
k8s/
├── base/
└── overlays/
    ├── staging/
    └── production/
```

Ambientes diferentes não devem depender de copiar YAML manualmente.

---

## Quando Usar Kubernetes

Use quando:

- muitos serviços precisam ser operados;
- deploy e escala precisam ser padronizados;
- há time/plataforma para operar cluster;
- alta disponibilidade é requisito;
- autoscaling e rollouts são importantes;
- múltiplas equipes compartilham infraestrutura.

Evite quando:

- a equipe é pequena e sem operação;
- uma VPS/PaaS resolve bem;
- não há observabilidade;
- o custo operacional supera o benefício;
- você quer Kubernetes só por currículo.

---

## Erros Comuns

- não configurar probes;
- não definir resources;
- usar `latest`;
- rodar migrations em todos os Pods;
- colocar segredo em ConfigMap;
- ignorar logs e métricas;
- usar liveness dependente de banco externo;
- não testar rollback;
- tratar Kubernetes como solução mágica;
- expor Service errado para internet.

---

## Checklist Avançado

- Deployment tem réplicas suficientes?
- Probes estão corretas?
- Requests e limits foram definidos?
- Imagem é imutável e escaneada?
- Secrets são protegidos?
- Rollout e rollback foram testados?
- Migrations são compatíveis?
- HPA usa métrica adequada?
- Observabilidade cobre app e cluster?
- Ingress tem TLS e regras seguras?

Kubernetes é uma plataforma de produção, não apenas um lugar para rodar containers. O ganho aparece quando automação, padrões e operação justificam a complexidade.

