# Logs, métricas e traces

Os três pilares para entender sistemas em produção.

## Pontos-chave

- Logs estruturados em JSON
- Métricas (contadores, histogramas)
- Traces distribuídos com spans
- Correlação por trace_id

## Exemplo

```python
from opentelemetry import trace

tracer = trace.get_tracer(__name__)

with tracer.start_as_current_span('processar_pedido'):
    # ... lógica instrumentada ...
    pass
```

## Boas práticas

- Padronize logs estruturados desde o início
- Propague o contexto entre serviços

## Saiba mais

- [Documentação oficial](https://opentelemetry.io/docs/languages/python/)
