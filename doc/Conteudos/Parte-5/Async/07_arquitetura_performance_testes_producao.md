# Arquitetura, Performance, Testes e Produção em Sistemas Assíncronos

Este arquivo fecha a trilha com decisões de arquitetura, padrões de resiliência, performance, testes, observabilidade, segurança, deploy e roadmap para nível especialista.

---

## Sumário

1. [Escolha de Arquitetura](#escolha-de-arquitetura)
2. [Backpressure](#backpressure)
3. [Timeouts, Retries e Circuit Breaker](#timeouts-retries-e-circuit-breaker)
4. [Idempotência](#idempotência)
5. [Observabilidade](#observabilidade)
6. [Testes Assíncronos](#testes-assíncronos)
7. [Performance](#performance)
8. [Segurança](#segurança)
9. [Deploy e Operação](#deploy-e-operação)
10. [Anti-patterns](#anti-patterns)
11. [Roadmap de Especialista](#roadmap-de-especialista)
12. [Projetos Progressivos](#projetos-progressivos)
13. [Checklist Final](#checklist-final)

---

## Escolha de Arquitetura

Pergunta principal: o que você quer desacoplar?

| Necessidade | Abordagem |
|---|---|
| Muitas chamadas HTTP | `asyncio` + `aiohttp` |
| Background job | Celery |
| Job distribuído com retry | Celery + RabbitMQ |
| Evento de domínio para múltiplos consumidores | Kafka |
| CPU pesado | multiprocessing |
| Biblioteca bloqueante | threads |
| Pipeline de dados agendado | Airflow/Prefect/Dagster |
| API async | FastAPI/aiohttp |

Arquitetura assíncrona aumenta complexidade. Use quando o benefício compensa.

---

## Backpressure

Backpressure impede que produtores sobrecarreguem consumidores.

Exemplo com fila limitada:

```python
fila = asyncio.Queue(maxsize=100)
```

Se a fila enche, `await fila.put(item)` espera.

Estratégias:

- filas com tamanho máximo;
- semáforos;
- rate limiting;
- circuit breaker;
- rejeição controlada;
- shed load;
- particionamento;
- autoscaling;
- limites por cliente.

---

## Timeouts, Retries e Circuit Breaker

Timeout sem retry pode falhar demais. Retry sem timeout pode travar. Retry sem limite pode derrubar dependência.

### Política segura

```text
timeout curto
retry limitado
backoff exponencial
jitter
circuit breaker
observabilidade
```

### Circuit breaker conceitual

```python
class CircuitBreaker:
    def __init__(self, max_falhas: int):
        self.max_falhas = max_falhas
        self.falhas = 0
        self.aberto = False

    def registrar_sucesso(self):
        self.falhas = 0
        self.aberto = False

    def registrar_falha(self):
        self.falhas += 1
        if self.falhas >= self.max_falhas:
            self.aberto = True

    def permitir(self) -> bool:
        return not self.aberto
```

Em produção, use biblioteca madura ou implemente estados half-open, janela temporal e métricas.

---

## Idempotência

Operação idempotente pode ser repetida sem alterar resultado além da primeira execução.

Necessária em:

- retries;
- consumers Kafka;
- tasks Celery;
- webhooks;
- pagamentos;
- ETL;
- workers.

Exemplo:

```python
def processar_pagamento(evento):
    if pagamento_ja_processado(evento["idempotency_key"]):
        return

    executar_pagamento(evento)
    marcar_processado(evento["idempotency_key"])
```

Use:

- chave de idempotência;
- upsert;
- unique constraint;
- controle de status;
- deduplicação por event id.

---

## Observabilidade

Monitore:

- latência;
- throughput;
- taxa de erro;
- retries;
- timeouts;
- tamanho de fila;
- consumer lag;
- tasks pendentes;
- tarefas falhas;
- uso de CPU/memória;
- conexões abertas.

Log estruturado:

```python
import logging

logger = logging.getLogger(__name__)

logger.info(
    "task processada",
    extra={
        "task": "processar_pedido",
        "pedido_id": "p1",
        "tentativa": 1,
    },
)
```

Métricas úteis:

```text
async_requests_total
async_request_duration_seconds
celery_task_failures_total
rabbitmq_queue_messages_ready
kafka_consumer_lag
```

---

## Testes Assíncronos

Com `pytest-asyncio`:

```bash
python -m pip install pytest pytest-asyncio
```

Teste:

```python
import pytest

@pytest.mark.asyncio
async def test_buscar_usuario():
    resultado = await buscar_usuario(1)
    assert resultado["id"] == 1
```

Teste timeout:

```python
import asyncio
import pytest

@pytest.mark.asyncio
async def test_timeout():
    with pytest.raises(asyncio.TimeoutError):
        await asyncio.wait_for(asyncio.sleep(10), timeout=0.01)
```

Testes para filas:

```python
@pytest.mark.asyncio
async def test_produtor_coloca_item_na_fila():
    fila = asyncio.Queue()
    await fila.put("item")
    assert await fila.get() == "item"
```

Para Celery, teste função pura por baixo da task sempre que possível.

---

## Performance

Antes de otimizar, meça.

Ferramentas:

- logs de duração;
- métricas;
- `time.perf_counter`;
- profiling;
- tracing distribuído;
- benchmark controlado.

Gargalos comuns:

- event loop bloqueado;
- concorrência alta demais;
- conexão não reutilizada;
- sem timeout;
- payload muito grande;
- retry storm;
- fila sem consumidor suficiente;
- serialização cara;
- CPU-bound rodando em async.

### Detectando bloqueio no event loop

```python
import asyncio
import time

async def monitor_loop(intervalo=0.1):
    while True:
        inicio = time.perf_counter()
        await asyncio.sleep(intervalo)
        atraso = time.perf_counter() - inicio - intervalo
        if atraso > 0.05:
            print(f"event loop atrasado: {atraso:.3f}s")
```

---

## Segurança

Cuidados:

- não logar tokens;
- validar payloads;
- limitar tamanho de mensagem;
- usar TLS;
- proteger credenciais de broker;
- aplicar autenticação/autorização;
- evitar execução arbitrária de payload;
- usar serialização segura;
- configurar permissões por fila/topic;
- proteger endpoints internos.

Em Celery:

- prefira JSON;
- evite pickle;
- configure `accept_content`.

```python
app.conf.accept_content = ["json"]
app.conf.task_serializer = "json"
```

---

## Deploy e Operação

Checklist:

- healthcheck;
- graceful shutdown;
- timeouts;
- retry policy;
- limites de memória;
- autoscaling;
- monitoramento;
- logs estruturados;
- secrets em ambiente seguro;
- filas separadas;
- DLQ;
- alertas;
- runbook.

Graceful shutdown em async:

```python
async def worker(fila):
    while True:
        item = await fila.get()
        try:
            if item is None:
                break
            await processar(item)
        finally:
            fila.task_done()
```

---

## Anti-patterns

- Async sem necessidade.
- `time.sleep` dentro de coroutine.
- Sem timeout.
- Retry infinito.
- Tarefa não idempotente com retry.
- Concorrência ilimitada.
- Criar `ClientSession` por request.
- Usar Kafka como RPC.
- Usar Celery para streaming de evento.
- Logar segredo.
- Ignorar cancelamento.
- Bloquear event loop com CPU-bound.

---

## Roadmap de Especialista

### Nível 1: Base

- `async def`;
- `await`;
- coroutine;
- `asyncio.run`;
- `asyncio.sleep`;
- diferença entre sync e async.

### Nível 2: Concorrência

- tasks;
- `gather`;
- `TaskGroup`;
- semáforo;
- fila;
- timeout;
- cancelamento.

### Nível 3: I/O Real

- `aiohttp`;
- `httpx`;
- `asyncpg`;
- `aiomysql`;
- `redis.asyncio`;
- sessões;
- retries;
- rate limit;
- paginação;
- APIs assíncronas.

### Nível 4: Execução Paralela

- threads;
- locks;
- thread pool;
- multiprocessing;
- process pool;
- executors.

### Nível 5: Distribuído

- Celery;
- RQ;
- Dramatiq;
- Arq;
- RabbitMQ;
- workers;
- retries;
- idempotência;
- APScheduler;
- `schedule`;
- cron jobs;
- Kafka;
- eventos;
- consumer groups.

### Nível 6: Produção

- observabilidade;
- backpressure;
- circuit breaker;
- segurança;
- testes;
- deploy;
- graceful shutdown;
- runbooks.

---

## Projetos Progressivos

1. Baixador assíncrono de páginas com `aiohttp`.
2. Pipeline produtor-consumidor com `asyncio.Queue`.
3. Cliente HTTP com retry, timeout e semáforo.
4. Comparador async vs threads para chamadas bloqueantes.
5. Processador CPU-bound com `ProcessPoolExecutor`.
6. Worker Celery para gerar relatório.
7. Pipeline Celery com filas separadas.
8. Consumer Kafka idempotente.
9. API async com background tasks.
10. Sistema completo com API, fila, worker, métricas e logs.

---

## Checklist Final

- Sei explicar concorrência e paralelismo.
- Sei usar `asyncio` sem bloquear event loop.
- Sei limitar concorrência.
- Sei aplicar timeout e cancelamento.
- Sei escolher async, thread, processo, Celery ou Kafka.
- Sei criar tasks idempotentes.
- Sei projetar retry com backoff.
- Sei consumir APIs com `aiohttp`.
- Sei consumir APIs com `httpx.AsyncClient`.
- Sei usar drivers async de banco/cache sem bloquear o event loop.
- Sei criar workers Celery.
- Sei comparar Celery, RQ, Dramatiq e Arq.
- Sei escolher entre APScheduler, `schedule`, cron e Celery Beat.
- Sei explicar RabbitMQ.
- Sei explicar Kafka, topic, partition, offset e consumer group.
- Sei testar código assíncrono.
- Sei observar filas, lag, latência e erros.
- Sei operar sistemas assíncronos em produção.
