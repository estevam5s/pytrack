# Desenvolvimento Assíncrono, Concorrência e Mensageria com Python

Trilha completa para dominar desenvolvimento assíncrono em Python, começando pelos fundamentos de concorrência e `async/await`, avançando para `asyncio`, `aiohttp`, `httpx`, drivers async de banco/cache, multithreading, multiprocessing, Celery, RabbitMQ, Kafka, filas alternativas, agendadores e arquitetura de sistemas assíncronos em produção.

---

## Arquivos da Trilha

1. [Fundamentos: Concorrência, Paralelismo e Async/Await](./01_fundamentos_concorrencia_async_await.md)
2. [Asyncio em Profundidade](./02_asyncio_em_profundidade.md)
3. [Aiohttp, Clientes HTTP e APIs Assíncronas](./03_aiohttp_http_async.md)
4. [Multithreading, Multiprocessing e Execução Paralela](./04_threads_processos_paralelismo.md)
5. [Filas, Celery e RabbitMQ](./05_celery_rabbitmq_filas.md)
6. [Kafka, Streaming e Sistemas Orientados a Eventos](./06_kafka_streaming_eventos.md)
7. [Arquitetura, Performance, Testes e Produção](./07_arquitetura_performance_testes_producao.md)
8. [Clientes e Drivers Assíncronos: HTTPX, AsyncPG, Aiomysql e Redis](./08_clientes_drivers_async.md)
9. [Filas Alternativas e Agendadores: RQ, Dramatiq, Arq, APScheduler, Schedule e Cron](./09_filas_agendadores.md)

---

## Resultado Esperado

Ao finalizar esta trilha, você deve saber:

- explicar diferença entre concorrência e paralelismo;
- usar `async def`, `await`, tasks e event loop;
- explicar tasks, futures, cancelamento, timeouts e backpressure;
- criar pipelines concorrentes com `asyncio`;
- consumir APIs com `aiohttp` e `httpx`;
- usar `asyncpg`, `aiomysql` e `redis.asyncio` sem bloquear o event loop;
- escolher entre async, threads e processos;
- usar Celery com RabbitMQ ou Redis;
- comparar Celery, RQ, Dramatiq e Arq;
- escolher entre APScheduler, `schedule`, cron do sistema e Celery Beat;
- entender Kafka e processamento de eventos;
- criar sistemas assíncronos observáveis, testáveis e resilientes;
- evitar armadilhas comuns de bloqueio, race condition, backpressure e retry mal projetado.

---

## Cobertura dos Conceitos Solicitados

| Conceito | Status | Onde estudar |
| --- | --- | --- |
| Desenvolvimento assíncrono e concorrência | Coberto | `01`, `02`, `07` |
| `asyncio`, `async/await`, event loop, tasks e futures | Coberto | `01`, `02`, `07` |
| `httpx`, `aiohttp`, `asyncpg`, `aiomysql`, `aioredis`/`redis.asyncio` | Coberto | `03`, `08` |
| Threading, multiprocessing e `concurrent.futures` | Coberto | `04` |
| Celery, RQ, Dramatiq e Arq | Coberto | `05`, `09` |
| APScheduler, `schedule` e cron jobs | Coberto | `05`, `09` |
