# Instrumentação e dashboards

Exporte para Prometheus, Grafana e Jaeger.

## Pontos-chave

- Auto-instrumentação de frameworks
- Exporters (OTLP) para coletores
- SLI/SLO e alertas
- Dashboards de latência e erros

## Exemplo

```python
# instrumentação automática de FastAPI
# opentelemetry-instrument uvicorn app:app
from prometheus_client import Counter
reqs = Counter('http_requests_total', 'total de requisições')
```

## Boas práticas

- Defina SLOs antes de criar alertas
- Evite cardinalidade alta em labels

## Saiba mais

- [Documentação oficial](https://opentelemetry.io/docs/)
