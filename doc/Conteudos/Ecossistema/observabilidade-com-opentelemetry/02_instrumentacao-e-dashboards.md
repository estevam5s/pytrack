# Instrumentação e dashboards

Exporte para Prometheus, Grafana e Jaeger.

> **Tema:** Observabilidade · **Nível:** avancado · **Trilha:** Observabilidade com OpenTelemetry

## Conceitos-chave

Nesta lição você vai entender:

- **Auto-instrumentação de frameworks**
- **Exporters (OTLP) para coletores**
- **SLI/SLO e alertas**
- **Dashboards de latência e erros**

## Exemplo prático

```python
# instrumentação automática de FastAPI
# opentelemetry-instrument uvicorn app:app
from prometheus_client import Counter
reqs = Counter('http_requests_total', 'total de requisições')
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Defina SLOs antes de criar alertas
- Evite cardinalidade alta em labels

## Pratique

Para fixar, escreva um pequeno script que combine **auto-instrumentação de frameworks** e **exporters (otlp) para coletores** em um caso do seu dia a dia. Depois refatore aplicando "Defina SLOs antes de criar alertas".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Auto-instrumentação de frameworks
- [ ] Explicar e aplicar: Exporters (OTLP) para coletores
- [ ] Explicar e aplicar: SLI/SLO e alertas
- [ ] Explicar e aplicar: Dashboards de latência e erros

## Saiba mais

- [Documentação oficial](https://opentelemetry.io/docs/)
