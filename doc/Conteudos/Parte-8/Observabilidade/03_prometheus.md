# Prometheus: Coleta, PromQL, Alertas e Boas Práticas

Prometheus é uma plataforma de monitoramento baseada em séries temporais. Ele coleta métricas por scraping HTTP, armazena dados localmente e permite consultas com PromQL.

É muito usado com aplicações Python, containers, Kubernetes, Grafana e Alertmanager. Prometheus é excelente para métricas numéricas, alertas e análise temporal. Ele não substitui logs, traces ou ferramentas de erro.

---

## Modelo de Funcionamento

```text
Aplicacao expoe /metrics
Prometheus coleta periodicamente
Prometheus armazena series temporais
PromQL consulta dados
Alertmanager envia alertas
Grafana cria dashboards
```

Prometheus normalmente faz pull:

```text
Prometheus -> GET http://servico:8000/metrics
```

Isso simplifica descoberta e controle de coleta.

---

## Série Temporal

Uma métrica no Prometheus é formada por:

- nome;
- labels;
- timestamp;
- valor.

Exemplo:

```text
http_requests_total{method="GET", path="/pedidos", status="200"} 15320
```

Labels permitem filtrar e agrupar, mas devem ser usadas com cuidado.

---

## Instalação em Aplicação Python

```bash
pip install prometheus-client
```

Exemplo básico com FastAPI:

```python
from fastapi import FastAPI, Response
from prometheus_client import Counter, generate_latest, CONTENT_TYPE_LATEST

app = FastAPI()

pedidos_criados = Counter(
    "pedidos_criados_total",
    "Total de pedidos criados",
)


@app.post("/pedidos")
def criar_pedido() -> dict[str, str]:
    pedidos_criados.inc()
    return {"status": "criado"}


@app.get("/metrics")
def metrics() -> Response:
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)
```

Prometheus passa a coletar `/metrics`.

---

## Métricas HTTP

Para APIs, capture:

- total de requisições;
- latência;
- status code;
- rota;
- método;
- exceções.

```python
import time

from prometheus_client import Counter, Histogram

http_requests_total = Counter(
    "http_requests_total",
    "Total de requisicoes HTTP",
    ["method", "route", "status"],
)

http_request_duration = Histogram(
    "http_request_duration_seconds",
    "Duracao das requisicoes HTTP",
    ["method", "route"],
    buckets=(0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10),
)
```

Middleware:

```python
@app.middleware("http")
async def prometheus_middleware(request, call_next):
    started = time.perf_counter()
    route = request.scope.get("route")
    route_path = getattr(route, "path", request.url.path)

    response = await call_next(request)
    duration = time.perf_counter() - started

    http_requests_total.labels(
        method=request.method,
        route=route_path,
        status=str(response.status_code),
    ).inc()

    http_request_duration.labels(
        method=request.method,
        route=route_path,
    ).observe(duration)

    return response
```

Use rota parametrizada (`/pedidos/{id}`), não URL real (`/pedidos/123`), para evitar cardinalidade alta.

---

## Counter

Counter só aumenta.

```python
from prometheus_client import Counter

pagamentos_falhos = Counter(
    "pagamentos_falhos_total",
    "Total de pagamentos com falha",
    ["motivo"],
)

pagamentos_falhos.labels(motivo="timeout").inc()
```

Consulta:

```promql
rate(pagamentos_falhos_total[5m])
```

`rate` calcula taxa por segundo em uma janela.

---

## Gauge

Gauge sobe e desce.

```python
from prometheus_client import Gauge

fila_pedidos = Gauge(
    "fila_pedidos_pendentes",
    "Quantidade de pedidos pendentes na fila",
)

fila_pedidos.set(42)
```

Use para estado atual.

---

## Histogram

Histogram mede distribuição.

```python
from prometheus_client import Histogram

db_query_duration = Histogram(
    "db_query_duration_seconds",
    "Duracao de queries no banco",
    ["operation"],
)

with db_query_duration.labels(operation="select_pedido").time():
    buscar_pedido()
```

Consulta p95:

```promql
histogram_quantile(
  0.95,
  sum(rate(http_request_duration_seconds_bucket[5m])) by (le, route)
)
```

Histogramas são fundamentais para latência.

---

## PromQL Essencial

Taxa de requisições:

```promql
sum(rate(http_requests_total[5m]))
```

Taxa por rota:

```promql
sum(rate(http_requests_total[5m])) by (route)
```

Erros 5xx:

```promql
sum(rate(http_requests_total{status=~"5.."}[5m]))
```

Percentual de erro:

```promql
sum(rate(http_requests_total{status=~"5.."}[5m]))
/
sum(rate(http_requests_total[5m]))
```

Latência p95:

```promql
histogram_quantile(
  0.95,
  sum(rate(http_request_duration_seconds_bucket[5m])) by (le)
)
```

---

## Labels e Cardinalidade

Cardinalidade é a quantidade de combinações de labels.

Perigoso:

```text
http_requests_total{user_id="123456", path="/pedidos/987654"}
```

Isso cria muitas séries.

Melhor:

```text
http_requests_total{route="/pedidos/{pedido_id}", method="GET", status="200"}
```

Evite labels com:

- user id;
- email;
- request id;
- payload;
- URL com IDs;
- timestamp;
- erro com mensagem variável;
- cardinalidade ilimitada.

Alta cardinalidade aumenta custo, memória e instabilidade.

---

## Configuração do Prometheus

`prometheus.yml`:

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: "api-python"
    static_configs:
      - targets: ["localhost:8000"]
```

Com Docker Compose:

```yaml
services:
  prometheus:
    image: prom/prometheus:v2.55.0
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml:ro
```

Interface:

```text
http://localhost:9090
```

---

## Alertas com Prometheus

Regra de alerta:

```yaml
groups:
  - name: api
    rules:
      - alert: ApiHighErrorRate
        expr: |
          sum(rate(http_requests_total{status=~"5.."}[5m]))
          /
          sum(rate(http_requests_total[5m]))
          > 0.05
        for: 10m
        labels:
          severity: page
        annotations:
          summary: "Taxa de erro 5xx acima de 5%"
          description: "A API esta com erro elevado por mais de 10 minutos."
```

`for` evita alertar por oscilações curtas.

---

## Alertmanager

Alertmanager recebe alertas do Prometheus e envia notificações.

Responsabilidades:

- agrupar alertas;
- deduplicar;
- silenciar;
- rotear por severidade/time;
- enviar para Slack, email, PagerDuty, Opsgenie etc.

Prometheus detecta. Alertmanager entrega.

---

## Exporters

Exporters expõem métricas de sistemas que não falam Prometheus nativamente.

Comuns:

- node_exporter: máquina Linux;
- postgres_exporter: PostgreSQL;
- redis_exporter: Redis;
- blackbox_exporter: probes HTTP/TCP/ICMP;
- nginx_exporter: Nginx;
- celery exporter: workers Celery.

Exemplo de arquitetura:

```text
Prometheus
├── app /metrics
├── node_exporter /metrics
├── postgres_exporter /metrics
└── redis_exporter /metrics
```

---

## Métricas de Negócio

```python
pedidos_confirmados = Counter(
    "pedidos_confirmados_total",
    "Total de pedidos confirmados",
    ["canal"],
)

valor_pedido = Histogram(
    "pedido_valor_reais",
    "Distribuicao do valor dos pedidos",
    buckets=(10, 25, 50, 100, 250, 500, 1000, 5000),
)
```

Métricas de negócio ajudam a detectar falhas silenciosas.

---

## Multiprocess com Gunicorn

Prometheus client em Python precisa de cuidado com múltiplos processos.

Com Gunicorn, cada worker tem memória própria. Use modo multiprocess do `prometheus-client`.

Configuração conceitual:

```bash
export PROMETHEUS_MULTIPROC_DIR=/tmp/prometheus
```

No app, use registry multiprocess conforme a documentação da biblioteca. Também limpe o diretório ao iniciar o processo mestre, pois arquivos antigos podem contaminar métricas.

Se isso for ignorado, métricas podem aparecer duplicadas ou incorretas.

---

## Erros Comuns

- usar labels com IDs únicos;
- medir latência com média apenas;
- não separar 4xx de 5xx;
- alertar sem `for`;
- não instrumentar dependências externas;
- não monitorar filas;
- esquecer multiprocess em Gunicorn;
- usar métricas para dados sensíveis;
- criar métricas demais sem objetivo;
- não revisar custo de cardinalidade.

---

## Checklist Avançado

- `/metrics` está protegido quando necessário?
- Métricas HTTP usam rota parametrizada?
- Histogramas têm buckets adequados?
- PromQL usa `rate`/`increase` corretamente?
- Alertas têm janela, severidade e runbook?
- Cardinalidade é controlada?
- Dependências externas têm métricas?
- Workers e filas são monitorados?
- Métricas de negócio existem?

Prometheus é poderoso quando as métricas são bem modeladas. O maior risco não é coletar pouco, mas coletar dados com labels ruins, alertas ruidosos e consultas que não respondem perguntas operacionais.

