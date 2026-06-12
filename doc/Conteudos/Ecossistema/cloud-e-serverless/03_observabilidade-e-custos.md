# Observabilidade e custos

Monitore, registre e controle os custos de aplicações na nuvem.

## Pontos-chave

- Logs estruturados (JSON) centralizados
- Métricas e traces (OpenTelemetry)
- Alertas baseados em SLO
- FinOps: monitore e otimize gastos

## Exemplo

```python
import logging, json
logging.basicConfig(level=logging.INFO)
logging.info(json.dumps({'evento': 'pedido', 'id': 123, 'valor': 99.9}))
```

## Boas práticas

- Defina alertas antes do incidente
- Marque recursos com tags para rastrear custo

## Saiba mais

- [Documentação oficial](https://opentelemetry.io/docs/languages/python/)
