# Grafana: Dashboards, Alertas e Análise Operacional

Grafana é uma plataforma para visualizar, explorar e alertar sobre dados de observabilidade. Ele se conecta a fontes como Prometheus, Loki, Elasticsearch, Tempo, Jaeger, PostgreSQL, CloudWatch e muitas outras.

Grafana não coleta métricas por si só no uso mais comum. Ele consulta fontes de dados e transforma séries temporais, logs e traces em dashboards e alertas.

---

## Papel do Grafana

```text
Prometheus armazena metricas
Loki/Elasticsearch armazenam logs
Tempo/Jaeger armazenam traces
Grafana consulta e visualiza
```

Grafana ajuda a responder:

- o sistema está saudável?
- qual rota está lenta?
- quando o erro começou?
- houve deploy próximo do incidente?
- qual serviço está saturado?
- o SLO está sendo cumprido?

---

## Datasource

Datasource é uma fonte de dados.

Exemplo de configuração manual:

```text
Grafana -> Connections -> Data sources -> Prometheus
URL: http://prometheus:9090
```

Provisionamento via arquivo:

```yaml
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
```

Provisionamento permite versionar dashboards e fontes.

---

## Docker Compose Básico

```yaml
services:
  prometheus:
    image: prom/prometheus:v2.55.0
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml:ro

  grafana:
    image: grafana/grafana:11.2.0
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=admin
```

Acesse:

```text
http://localhost:3000
```

Em produção, não use senha padrão.

---

## Dashboards Bons

Dashboard bom responde perguntas. Ele não é uma coleção aleatória de gráficos.

Para uma API:

```text
Visao geral
├── disponibilidade
├── taxa de erro
├── requisicoes por segundo
├── latencia p50/p95/p99
├── rotas mais lentas
├── dependencias externas
├── banco
├── filas
└── deploys recentes
```

Comece do impacto ao usuário e avance para diagnóstico.

---

## Painéis Essenciais

Taxa de requisições:

```promql
sum(rate(http_requests_total[5m]))
```

Taxa de erro:

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

Latência por rota:

```promql
histogram_quantile(
  0.95,
  sum(rate(http_request_duration_seconds_bucket[5m])) by (le, route)
)
```

---

## Variáveis

Variáveis permitem filtros dinâmicos:

- ambiente;
- serviço;
- instância;
- rota;
- namespace;
- cluster.

Exemplo de variável `service` com Prometheus:

```promql
label_values(up, job)
```

Uso:

```promql
sum(rate(http_requests_total{job="$service"}[5m]))
```

Variáveis tornam dashboards reutilizáveis.

---

## Rows e Organização

Organize por nível:

```text
1. Resumo executivo
2. Experiencia do usuario
3. API
4. Dependencias
5. Infraestrutura
6. Negocio
7. Debug detalhado
```

Evite colocar 40 gráficos na primeira tela. Durante incidente, excesso de informação atrasa decisão.

---

## Anotações de Deploy

Anotações mostram eventos importantes no tempo:

```text
deploy v1.42.0
migracao de banco
incidente iniciado
feature flag ativada
```

Ao investigar uma queda, ver deploys no gráfico acelera análise.

Grafana pode buscar anotações em Prometheus, banco, Loki ou APIs.

---

## Alertas no Grafana

Grafana também pode criar alertas.

Exemplo de alerta:

```text
Condição:
  taxa de erro 5xx > 5% por 10 minutos

Labels:
  severity=page
  service=api

Mensagem:
  API com alta taxa de erro. Ver dashboard X e runbook Y.
```

Boas práticas:

- alerte em sintomas, não apenas causas;
- inclua link para dashboard;
- inclua runbook;
- defina severidade;
- evite duplicar alertas do Prometheus sem necessidade;
- teste notificações.

---

## Logs no Grafana

Com Loki ou Elasticsearch, Grafana pode consultar logs.

Fluxo ideal:

```text
grafico mostra erro alto
clique no ponto do tempo
abrir logs filtrados por service/env/trace_id
seguir para trace
```

Campos úteis:

- `service`;
- `env`;
- `level`;
- `request_id`;
- `trace_id`;
- `user_id`;
- `route`;
- `status_code`.

---

## Traces no Grafana

Com Tempo ou Jaeger, Grafana mostra traces distribuídos.

Um painel pode ligar:

```text
Metrica de latencia -> exemplars -> trace especifico -> logs do trace
```

Essa correlação é uma das formas mais poderosas de investigação moderna.

---

## Exemplars

Exemplars ligam métricas a traces.

Exemplo:

```text
latencia p99 subiu
Grafana mostra um exemplar
clicar abre trace de uma requisicao lenta
```

Para isso, a aplicação precisa expor trace ids junto às métricas, normalmente via OpenTelemetry.

---

## Dashboard de SLO

Um dashboard de SLO deve mostrar:

- SLI atual;
- objetivo;
- error budget restante;
- burn rate;
- histórico;
- principais fontes de erro;
- impacto por rota/região/cliente.

Burn rate indica quão rápido o orçamento de erro está sendo consumido.

---

## Permissões e Organização

Em produção:

- use autenticação corporativa;
- separe organizações ou pastas;
- controle quem edita dashboards;
- versionamento via Git quando possível;
- evite alterações manuais críticas sem revisão;
- use variáveis para reduzir duplicação.

Dashboard crítico deve ser tratado como artefato de produção.

---

## Erros Comuns

- criar dashboard sem pergunta operacional;
- usar média para latência;
- não mostrar deploys;
- colocar informação demais na tela inicial;
- misturar ambientes sem filtro claro;
- não padronizar nomes;
- deixar dashboards sem dono;
- não versionar dashboards importantes;
- criar alertas duplicados e ruidosos;
- esquecer métricas de negócio.

---

## Checklist Avançado

- Dashboard começa por impacto ao usuário?
- Há filtros por serviço e ambiente?
- Latência usa p95/p99?
- Erros 4xx e 5xx são separados?
- Deploys aparecem como anotações?
- Painéis apontam para logs/traces?
- Alertas têm runbook e severidade?
- Dashboards críticos são versionados?
- SLO e error budget são visíveis?

Grafana é útil quando transforma dados em decisão. Um dashboard bom não tenta mostrar tudo; ele guia investigação com clareza.

