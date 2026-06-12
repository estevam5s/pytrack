# Deploy no Kubernetes

K8s orquestra containers: escala, recupera falhas e faz rollout.

> **Tema:** Cloud Native · **Nível:** avancado · **Trilha:** Kubernetes e Cloud Native para Pythonistas

## Conceitos-chave

Nesta lição você vai entender:

- **Pod, Deployment e Service**
- **Replicas e self-healing automático**
- **ConfigMap e Secret para configuração**
- **Readiness/liveness probes**

## Exemplo prático

```python
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 3
  selector:
    matchLabels: {app: api}
  template:
    metadata:
      labels: {app: api}
    spec:
      containers:
      - name: api
        image: minha-api:1.0
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Defina requests/limits de CPU e memória
- Use probes para o K8s saber se o pod está saudável

## Pratique

Para fixar, escreva um pequeno script que combine **pod, deployment e service** e **replicas e self-healing automático** em um caso do seu dia a dia. Depois refatore aplicando "Defina requests/limits de CPU e memória".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Pod, Deployment e Service
- [ ] Explicar e aplicar: Replicas e self-healing automático
- [ ] Explicar e aplicar: ConfigMap e Secret para configuração
- [ ] Explicar e aplicar: Readiness/liveness probes

## Saiba mais

- [Documentação oficial](https://kubernetes.io/docs/home/)
