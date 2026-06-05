# Pods, Deployments e Services

Kubernetes orquestra containers em escala.

## Pontos-chave

- Deployment gerencia réplicas
- Service expõe os pods
- ConfigMap e Secret para configuração
- Probes de liveness/readiness

## Exemplo

```python
apiVersion: apps/v1
kind: Deployment
metadata: { name: api }
spec:
  replicas: 3
  template:
    spec:
      containers:
        - name: api
          image: minha-api:1.0
```

## Boas práticas

- Defina requests/limits de recursos
- Use probes para resiliência

## Saiba mais

- [Documentação oficial](https://kubernetes.io/docs/)
