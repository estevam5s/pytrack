# Monitoring: Métricas, Alertas, SLOs e Operação

Monitoring é o acompanhamento contínuo do comportamento de sistemas por meio de métricas, alertas e indicadores de saúde. Ele responde se o sistema está funcionando bem para usuários e operadores.

Enquanto logs ajudam a explicar eventos específicos, métricas mostram comportamento agregado ao longo do tempo: latência, erros, tráfego, saturação, consumo de recursos e disponibilidade.

---

## Monitoring vs Observabilidade

Monitoring normalmente pergunta:

```text
O sistema esta saudavel?
```

Observabilidade pergunta:

```text
Por que o sistema esta se comportando assim?
```

Monitoring é parte da observabilidade. Um sistema observável combina:

- métricas;
- logs;
- traces;
- eventos;
- erros;
- contexto de deploy;
- dashboards;
- alertas.

---

## Métricas Fundamentais

Métricas devem ser numéricas e agregáveis.

Exemplos:

- requisições por segundo;
- taxa de erro;
- latência p95/p99;
- uso de CPU;
- uso de memória;
- conexões no banco;
- tamanho da fila;
- jobs pendentes;
- cache hit ratio;
- tempo de resposta de dependências externas.

---

## Tipos de Métricas

### Counter

Valor que só aumenta.

```text
http_requests_total
pedidos_criados_total
pagamentos_falhos_total
```

Use para contagens acumuladas.

### Gauge

Valor que sobe e desce.

```text
fila_pedidos_pendentes
conexoes_ativas
memoria_em_uso
```

Use para estado atual.

### Histogram

Distribuição de valores, especialmente latência.

```text
http_request_duration_seconds
db_query_duration_seconds
```

Permite percentis aproximados.

### Summary

Também mede distribuição, mas costuma ser menos flexível para agregação que histogramas em Prometheus.

---

## RED Method

Para serviços que recebem requisições, monitore:

- **Rate**: volume de requisições.
- **Errors**: taxa de falha.
- **Duration**: latência.

Exemplo:

```text
GET /pedidos
├── rate: 120 req/s
├── errors: 0.5%
└── duration p95: 180 ms
```

RED é excelente para APIs, workers orientados a tarefas e serviços RPC.

---

## USE Method

Para recursos de infraestrutura, monitore:

- **Utilization**: quanto está sendo usado.
- **Saturation**: quanto trabalho está esperando.
- **Errors**: falhas.

Exemplo para banco:

```text
PostgreSQL
├── utilization: CPU, I/O, conexoes
├── saturation: locks, filas, queries esperando
└── errors: deadlocks, conexoes recusadas
```

USE ajuda a entender gargalos.

---

## SLIs, SLOs e SLA

**SLI** é indicador:

```text
percentual de requisicoes HTTP bem-sucedidas abaixo de 300 ms
```

**SLO** é objetivo interno:

```text
99.5% das requisicoes devem responder abaixo de 300 ms em 30 dias
```

**SLA** é compromisso contratual:

```text
99.0% de disponibilidade mensal, com penalidade se descumprido
```

SLOs ajudam a balancear confiabilidade e velocidade de entrega.

---

## Error Budget

Se o SLO permite 0.5% de falhas, esse é o orçamento de erro.

Exemplo:

```text
SLO: 99.5% sucesso mensal
Erro permitido: 0.5%
Se o servico recebe 1.000.000 requisicoes:
  ate 5.000 podem falhar dentro do SLO
```

Se o orçamento é consumido rapidamente, a equipe deve priorizar estabilidade.

---

## Alertas

Alerta deve exigir ação. Se ninguém age, ele é ruído.

Alertas bons:

- impacto em usuário;
- SLO queimando rápido;
- fila crescendo sem consumo;
- taxa de erro acima do normal;
- banco sem conexões disponíveis;
- disco perto do limite;
- serviço indisponível.

Alertas ruins:

- CPU alta por 10 segundos sem impacto;
- qualquer exceção isolada;
- log contendo palavra "error";
- métrica sem runbook;
- alerta duplicado de vários níveis.

---

## Severidade

Defina níveis:

- **P1**: indisponibilidade ou perda de dados.
- **P2**: degradação importante.
- **P3**: problema parcial com workaround.
- **P4**: investigação sem urgência.

Alerta de madrugada precisa ser raro e justificável.

---

## Golden Signals

Sinais clássicos:

- latência;
- tráfego;
- erros;
- saturação.

Para uma API:

```text
latencia: p95/p99 por rota
trafego: req/s por rota
erros: 5xx, timeouts, excecoes
saturacao: CPU, memoria, conexoes, filas
```

---

## Métricas de Negócio

Além de infraestrutura, monitore negócio:

- pedidos criados;
- pagamentos aprovados;
- pagamentos recusados;
- conversão;
- usuários ativos;
- jobs processados;
- emails enviados;
- fraudes bloqueadas.

Essas métricas detectam problemas que métricas técnicas não mostram.

Exemplo: API responde 200, mas nenhum pagamento é aprovado por erro na integração.

---

## Health Check

Health check superficial:

```python
@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
```

Readiness check mais útil:

```python
@app.get("/ready")
def ready() -> dict[str, str]:
    database.ping()
    redis.ping()
    return {"status": "ready"}
```

Cuidados:

- health check não deve ser caro;
- readiness pode verificar dependências críticas;
- liveness não deve falhar por dependência externa temporária;
- não vaze detalhes sensíveis.

---

## Dashboards

Dashboard operacional deve responder:

- o sistema está funcionando?
- usuários estão impactados?
- quando começou?
- qual componente parece causar?
- houve deploy recente?
- qual dependência está lenta?

Dashboards bonitos mas sem ação são decoração.

---

## Runbooks

Todo alerta importante deve ter runbook:

```text
Alerta: taxa de erro 5xx alta
1. Abrir dashboard de API
2. Verificar deploy recente
3. Checar traces de rotas com erro
4. Conferir logs por correlation id
5. Verificar banco e dependencias externas
6. Aplicar rollback se erro iniciou apos deploy
```

Runbook reduz improviso em incidente.

---

## Baseline e Anomalia

Nem todo valor alto é ruim. Compare com baseline:

- horário do dia;
- dia da semana;
- sazonalidade;
- campanhas;
- releases;
- crescimento natural.

Exemplo: tráfego dobrar pode ser sucesso, ataque ou bug de retry.

---

## Erros Comuns

- alertar sobre tudo;
- não monitorar experiência do usuário;
- ignorar métricas de negócio;
- usar média em vez de percentis;
- não separar 4xx de 5xx;
- monitorar só infraestrutura;
- não ter runbook;
- criar dashboards sem perguntas claras;
- não correlacionar alertas com deploys;
- não medir dependências externas.

---

## Checklist Avançado

- Existem SLIs e SLOs para fluxos críticos?
- Alertas são baseados em impacto real?
- Há métricas RED para APIs?
- Há métricas USE para recursos?
- Percentis p95/p99 são monitorados?
- Métricas de negócio detectam falhas silenciosas?
- Dashboards respondem perguntas operacionais?
- Alertas têm runbooks?
- Deploys aparecem nos gráficos?

Monitoring profissional reduz tempo de detecção e direciona resposta. O objetivo não é saber tudo, mas saber cedo o que ameaça usuários e negócio.

