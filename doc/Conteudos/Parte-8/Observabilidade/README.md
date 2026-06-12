# Observabilidade em Aplicações Python

Trilha completa e progressiva sobre observabilidade para aplicações Python e sistemas backend: logging, monitoring, Prometheus, Grafana, OpenTelemetry e Sentry.

O objetivo é sair de `print()` e logs soltos até uma prática profissional de operação: logs estruturados, métricas, alertas, tracing distribuído, dashboards, correlação entre sinais, investigação de incidentes, SLOs, redução de ruído e diagnóstico de problemas em produção.

---

## Arquivos da Trilha

1. [Logging: Logs Estruturados, Contexto e Produção](./01_logging.md)
2. [Monitoring: Métricas, Alertas, SLOs e Operação](./02_monitoring.md)
3. [Prometheus: Coleta, PromQL, Alertas e Boas Práticas](./03_prometheus.md)
4. [Grafana: Dashboards, Alertas e Análise Operacional](./04_grafana.md)
5. [OpenTelemetry: Traces, Métricas, Logs e Instrumentação](./05_opentelemetry.md)
6. [Sentry: Erros, Performance, Releases e Diagnóstico](./06_sentry.md)

---

## Competências Esperadas

Ao concluir esta trilha, você deve saber:

- diferenciar logs, métricas, traces, eventos e erros;
- criar logs estruturados com contexto, request id e correlation id;
- evitar vazamento de dados sensíveis em logs;
- definir métricas RED, USE, SLIs, SLOs e alertas acionáveis;
- instrumentar APIs Python com Prometheus;
- escrever consultas PromQL para latência, taxa de erro e saturação;
- criar dashboards úteis no Grafana;
- instrumentar serviços com OpenTelemetry;
- correlacionar trace id entre logs, traces e erros;
- configurar Sentry para erros, performance e releases;
- investigar incidentes de forma metódica;
- transformar observabilidade em ferramenta de engenharia, não apenas telas bonitas.

---

## Aplicação de Referência

Os exemplos assumem uma API Python, normalmente FastAPI, executando em ambiente local, container ou produção:

```text
Cliente -> Nginx/Ingress -> Uvicorn/Gunicorn -> FastAPI -> Banco/Redis/Fila/API externa
```

Sinais de observabilidade:

```text
Aplicacao Python
├── logs estruturados
├── metricas Prometheus
├── traces OpenTelemetry
├── erros Sentry
└── dashboards Grafana
```

---

## Regra Principal

Observabilidade não é colecionar dados. É conseguir responder perguntas sobre o comportamento do sistema em produção sem precisar lançar uma nova versão para descobrir o que está acontecendo.

