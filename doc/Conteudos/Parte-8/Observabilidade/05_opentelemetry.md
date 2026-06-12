# OpenTelemetry: Traces, Métricas, Logs e Instrumentação

OpenTelemetry, ou OTel, é um padrão aberto para coletar, instrumentar e exportar sinais de observabilidade: traces, métricas e logs. Ele evita acoplamento forte a um fornecedor específico e padroniza como aplicações geram telemetria.

Em sistemas modernos, OpenTelemetry é especialmente importante para tracing distribuído: acompanhar uma requisição atravessando API, banco, fila, cache e serviços externos.

---

## Sinais do OpenTelemetry

OpenTelemetry trabalha com três sinais principais:

- **Traces**: caminho de uma operação distribuída.
- **Metrics**: medições numéricas agregáveis.
- **Logs**: registros de eventos.

Na prática, o uso mais comum começa por traces e depois avança para métricas e logs correlacionados.

---

## Trace e Span

Trace representa uma operação completa.

Span representa uma etapa dessa operação.

```text
Trace: POST /checkout
├── Span: validar_payload
├── Span: criar_pedido
├── Span: consultar_estoque
├── Span: autorizar_pagamento
└── Span: publicar_evento
```

Cada span tem:

- trace id;
- span id;
- parent span id;
- nome;
- duração;
- atributos;
- status;
- eventos;
- exceções.

---

## Por que Tracing Importa

Sem tracing:

```text
usuario relata lentidao
logs mostram varias chamadas
metricas mostram p95 alto
mas nao sabemos onde a requisicao gastou tempo
```

Com tracing:

```text
POST /checkout levou 2.3s
  pagamento.autorizar levou 2.0s
  banco levou 80ms
  redis levou 5ms
```

Tracing reduz suposição.

---

## Instalação Básica com FastAPI

```bash
pip install opentelemetry-api opentelemetry-sdk
pip install opentelemetry-instrumentation-fastapi
pip install opentelemetry-exporter-otlp
```

Configuração:

```python
from fastapi import FastAPI
from opentelemetry import trace
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor


def setup_tracing(app: FastAPI) -> None:
    resource = Resource.create(
        {
            "service.name": "api-python",
            "deployment.environment": "production",
            "service.version": "1.0.0",
        }
    )

    provider = TracerProvider(resource=resource)
    exporter = OTLPSpanExporter(endpoint="http://otel-collector:4317", insecure=True)
    provider.add_span_processor(BatchSpanProcessor(exporter))

    trace.set_tracer_provider(provider)
    FastAPIInstrumentor.instrument_app(app)
```

Uso:

```python
app = FastAPI()
setup_tracing(app)
```

---

## OpenTelemetry Collector

Collector recebe, processa e exporta telemetria.

```text
Aplicacao -> OTLP -> Collector -> Jaeger/Tempo/Datadog/New Relic/Honeycomb/etc.
```

Vantagens:

- centraliza configuração;
- reduz acoplamento ao fornecedor;
- aplica sampling;
- adiciona atributos;
- filtra dados;
- exporta para múltiplos destinos.

Configuração simplificada:

```yaml
receivers:
  otlp:
    protocols:
      grpc:
      http:

processors:
  batch:

exporters:
  debug:

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [debug]
```

---

## Instrumentação Automática

OpenTelemetry tem instrumentações para bibliotecas comuns:

- FastAPI;
- Flask;
- Django;
- requests;
- httpx;
- SQLAlchemy;
- psycopg;
- Redis;
- Celery;
- logging.

Exemplo:

```bash
pip install opentelemetry-instrumentation-httpx
pip install opentelemetry-instrumentation-sqlalchemy
```

```python
from opentelemetry.instrumentation.httpx import HTTPXClientInstrumentor
from opentelemetry.instrumentation.sqlalchemy import SQLAlchemyInstrumentor

HTTPXClientInstrumentor().instrument()
SQLAlchemyInstrumentor().instrument(engine=engine)
```

Instrumentação automática dá cobertura rápida, mas nem sempre explica regra de negócio. Use spans manuais para operações importantes.

---

## Spans Manuais

```python
from opentelemetry import trace

tracer = trace.get_tracer(__name__)


def confirmar_pedido(pedido_id: str) -> None:
    with tracer.start_as_current_span("pedido.confirmar") as span:
        span.set_attribute("pedido.id", pedido_id)
        pedido = pedidos_repo.obter(pedido_id)
        pedido.confirmar()
        pedidos_repo.salvar(pedido)
```

Nomeie spans por operação de negócio, não por implementação interna irrelevante.

---

## Atributos

Atributos enriquecem spans.

```python
span.set_attribute("cliente.tipo", "premium")
span.set_attribute("pedido.total", 129.90)
span.set_attribute("pagamento.gateway", "provedor_x")
```

Cuidados:

- não inclua dados sensíveis;
- evite cardinalidade alta;
- não coloque payload inteiro;
- use nomes consistentes;
- prefira atributos úteis para filtro e agregação.

Evite:

```python
span.set_attribute("usuario.email", email)
span.set_attribute("request.body", body)
```

---

## Status e Exceções

```python
from opentelemetry.trace import Status, StatusCode


try:
    gateway.autorizar(pedido)
except Exception as exc:
    span.record_exception(exc)
    span.set_status(Status(StatusCode.ERROR, "falha ao autorizar pagamento"))
    raise
```

Spans com erro ajudam a encontrar falhas no trace.

---

## Propagação de Contexto

Para tracing distribuído, o trace id precisa atravessar serviços.

OpenTelemetry usa headers como `traceparent`:

```text
traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01
```

Instrumentações HTTP propagam automaticamente. Em filas, pode ser necessário injetar contexto na mensagem.

---

## Tracing com Filas

Ao publicar mensagem:

```python
from opentelemetry.propagate import inject


headers = {}
inject(headers)
broker.publish("PedidoConfirmado", payload, headers=headers)
```

Ao consumir:

```python
from opentelemetry.propagate import extract
from opentelemetry.trace import SpanKind


context = extract(headers)
with tracer.start_as_current_span(
    "consumir.PedidoConfirmado",
    context=context,
    kind=SpanKind.CONSUMER,
):
    processar(payload)
```

Sem propagação, traces de produtores e consumidores ficam desconectados.

---

## Sampling

Coletar todos os traces pode ser caro.

Estratégias:

- **head sampling**: decisão no início do trace;
- **tail sampling**: decisão depois de observar o trace completo;
- amostrar mais erros;
- amostrar rotas críticas;
- reduzir traces de health check.

Tail sampling é poderoso para guardar traces lentos ou com erro, mas exige Collector/configuração adequada.

---

## Correlação com Logs

Logs devem incluir `trace_id` e `span_id`.

```python
from opentelemetry import trace


def current_trace_context() -> dict[str, str | None]:
    span = trace.get_current_span()
    context = span.get_span_context()

    if not context.is_valid:
        return {"trace_id": None, "span_id": None}

    return {
        "trace_id": format(context.trace_id, "032x"),
        "span_id": format(context.span_id, "016x"),
    }
```

Assim, ao encontrar um erro no log, você abre o trace correspondente.

---

## Métricas com OpenTelemetry

OpenTelemetry também pode emitir métricas.

```python
from opentelemetry import metrics

meter = metrics.get_meter(__name__)

pedidos_counter = meter.create_counter(
    "pedidos.confirmados",
    description="Total de pedidos confirmados",
)


def confirmar_pedido() -> None:
    pedidos_counter.add(1, {"canal": "web"})
```

Em muitos ambientes, Prometheus ainda é usado diretamente ou via Collector. O importante é manter consistência de nomes e labels.

---

## Nomes Semânticos

OpenTelemetry possui semantic conventions para atributos comuns:

- `service.name`;
- `service.version`;
- `deployment.environment`;
- `http.request.method`;
- `url.path`;
- `db.system`;
- `db.statement`;
- `server.address`;
- `error.type`.

Seguir convenções facilita interoperabilidade entre ferramentas.

---

## Segurança e Privacidade

Telemetry pode vazar dados.

Cuidados:

- filtre headers sensíveis;
- não capture payload completo;
- remova tokens;
- controle retenção;
- limite atributos de usuário;
- revise exporters externos;
- aplique sampling consciente;
- considere requisitos legais.

Observabilidade não pode violar privacidade.

---

## Erros Comuns

- instrumentar tudo sem estratégia;
- não propagar contexto em filas;
- gerar spans pequenos e inúteis;
- usar atributos com alta cardinalidade;
- capturar dados sensíveis;
- não configurar `service.name`;
- não correlacionar logs com trace id;
- ignorar sampling e custo;
- depender só de auto-instrumentação;
- não instrumentar dependências críticas.

---

## Checklist Avançado

- Todo serviço define `service.name`, versão e ambiente?
- FastAPI/HTTP está instrumentado?
- Banco e chamadas externas aparecem nos traces?
- Operações de negócio críticas têm spans manuais?
- Contexto é propagado em filas?
- Logs incluem trace id?
- Sampling preserva erros e latência alta?
- Dados sensíveis são filtrados?
- Collector está configurado e versionado?

OpenTelemetry cria uma base portátil para observabilidade moderna. O valor real aparece quando traces, logs, métricas e erros contam a mesma história sobre uma requisição ou incidente.

