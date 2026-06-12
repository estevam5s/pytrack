# Pods, Deployments e Services

Kubernetes orquestra containers em escala.

> **Tema:** Orquestração · **Nível:** avancado · **Trilha:** Kubernetes para Python

## Conceitos-chave

Nesta lição você vai entender:

- **Deployment gerencia réplicas**
- **Service expõe os pods**
- **ConfigMap e Secret para configuração**
- **Probes de liveness/readiness**

## Exemplo prático

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

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Defina requests/limits de recursos
- Use probes para resiliência

## Pratique

Para fixar, escreva um pequeno script que combine **deployment gerencia réplicas** e **service expõe os pods** em um caso do seu dia a dia. Depois refatore aplicando "Defina requests/limits de recursos".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Deployment gerencia réplicas
- [ ] Explicar e aplicar: Service expõe os pods
- [ ] Explicar e aplicar: ConfigMap e Secret para configuração
- [ ] Explicar e aplicar: Probes de liveness/readiness

## Saiba mais

- [Documentação oficial](https://kubernetes.io/docs/)
