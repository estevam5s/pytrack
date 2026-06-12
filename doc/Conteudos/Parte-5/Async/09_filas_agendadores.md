# Filas Alternativas e Agendadores: RQ, Dramatiq, Arq, APScheduler, Schedule e Cron

Este módulo complementa Celery e RabbitMQ com alternativas comuns para workers e agendamento. A escolha correta depende de complexidade, infraestrutura disponível, necessidade de retry, observabilidade, latência e modelo de execução.

---

## Sumário

1. [Mapa de Escolha](#mapa-de-escolha)
2. [RQ](#rq)
3. [Dramatiq](#dramatiq)
4. [Arq](#arq)
5. [Celery vs RQ vs Dramatiq vs Arq](#celery-vs-rq-vs-dramatiq-vs-arq)
6. [APScheduler](#apscheduler)
7. [Schedule](#schedule)
8. [Cron Jobs](#cron-jobs)
9. [Celery Beat vs APScheduler vs Cron](#celery-beat-vs-apscheduler-vs-cron)
10. [Boas Práticas](#boas-práticas)
11. [Exercícios](#exercícios)

---

## Mapa de Escolha

| Necessidade | Boa escolha |
| --- | --- |
| Jobs distribuídos complexos | Celery |
| Jobs simples com Redis | RQ |
| Workers distribuídos com API enxuta | Dramatiq |
| Worker async nativo com Redis | Arq |
| Agendamento dentro de aplicação Python | APScheduler |
| Agendamento simples em script local | `schedule` |
| Agendamento robusto do sistema operacional | cron/systemd timer |
| Agendamento de tasks Celery | Celery Beat |

Separação importante:

- fila executa trabalho em background;
- agendador dispara trabalho em horários definidos;
- broker transporta mensagens;
- worker consome e executa.

---

## RQ

RQ, Redis Queue, é uma fila simples baseada em Redis.

Instalação:

```bash
python -m pip install rq redis
```

`tasks.py`:

```python
def gerar_relatorio(user_id: int) -> str:
    return f"relatorio-{user_id}.pdf"
```

Enfileirar:

```python
from redis import Redis
from rq import Queue
from tasks import gerar_relatorio

redis_conn = Redis.from_url("redis://localhost:6379/0")
fila = Queue("relatorios", connection=redis_conn)

job = fila.enqueue(gerar_relatorio, 42)
print(job.id)
```

Rodar worker:

```bash
rq worker relatorios
```

Use RQ quando:

- Redis já faz parte do ambiente;
- a fila é simples;
- você quer pouca configuração;
- não precisa de routing avançado como no Celery.

---

## Dramatiq

Dramatiq é uma alternativa ao Celery com API mais enxuta e suporte a RabbitMQ ou Redis.

Instalação:

```bash
python -m pip install dramatiq redis
```

`tasks.py`:

```python
import dramatiq

@dramatiq.actor(max_retries=3)
def enviar_email(destino: str, assunto: str) -> None:
    print(f"enviando {assunto} para {destino}")
```

Chamada:

```python
from tasks import enviar_email

enviar_email.send("ana@example.com", "Bem-vinda")
```

Worker:

```bash
dramatiq tasks
```

Use Dramatiq quando:

- quer workers distribuídos com menos complexidade que Celery;
- precisa de retries e middlewares;
- quer RabbitMQ ou Redis;
- aceita um ecossistema menor que Celery.

---

## Arq

Arq é uma fila baseada em Redis com execução assíncrona nativa.

Instalação:

```bash
python -m pip install arq
```

`worker.py`:

```python
import asyncio

async def enviar_webhook(ctx, url: str, payload: dict) -> None:
    await asyncio.sleep(1)
    print(url, payload)

class WorkerSettings:
    functions = [enviar_webhook]
```

Enfileirar:

```python
import asyncio
from arq import create_pool
from arq.connections import RedisSettings

async def main():
    redis = await create_pool(RedisSettings(host="localhost", port=6379))
    await redis.enqueue_job(
        "enviar_webhook",
        "https://example.com/webhook",
        {"evento": "pedido.criado"},
    )

asyncio.run(main())
```

Worker:

```bash
arq worker.WorkerSettings
```

Use Arq quando:

- suas tasks são naturalmente async;
- Redis é suficiente;
- você quer evitar misturar Celery síncrono com código async;
- o projeto é menor e controlado.

---

## Celery vs RQ vs Dramatiq vs Arq

| Critério | Celery | RQ | Dramatiq | Arq |
| --- | --- | --- | --- | --- |
| Maturidade/ecossistema | Muito alto | Alto | Médio/alto | Médio |
| Broker | RabbitMQ/Redis/outros | Redis | RabbitMQ/Redis | Redis |
| Async nativo | Não é o foco | Não | Não é o foco | Sim |
| Configuração | Maior | Baixa | Média | Baixa/média |
| Retries | Forte | Básico | Forte | Bom |
| Agendamento | Celery Beat | Extensões/externo | Externo/middleware | Agendamento próprio limitado/externo |
| Melhor para | sistemas grandes | jobs simples | workers enxutos | tasks async |

Critério profissional: escolha a ferramenta que sua equipe consegue operar, observar e depurar.

---

## APScheduler

APScheduler agenda funções Python dentro do processo da aplicação.

Instalação:

```bash
python -m pip install apscheduler
```

Exemplo síncrono:

```python
from apscheduler.schedulers.background import BackgroundScheduler
from time import sleep

def gerar_relatorio():
    print("gerando relatório")

scheduler = BackgroundScheduler(timezone="America/Sao_Paulo")
scheduler.add_job(gerar_relatorio, "cron", hour=6, minute=0)
scheduler.start()

try:
    while True:
        sleep(60)
except KeyboardInterrupt:
    scheduler.shutdown()
```

Com asyncio:

```python
from apscheduler.schedulers.asyncio import AsyncIOScheduler

async def coletar_metricas():
    print("coletando")

scheduler = AsyncIOScheduler(timezone="America/Sao_Paulo")
scheduler.add_job(coletar_metricas, "interval", seconds=30)
scheduler.start()
```

Use APScheduler quando:

- o agendamento pertence ao processo Python;
- você precisa de interval, cron, date trigger;
- quer persistir jobs com job stores;
- aceita operar o ciclo de vida do scheduler.

Em múltiplas réplicas da aplicação, cuidado: cada réplica pode disparar o mesmo job.

---

## Schedule

`schedule` é simples e bom para scripts pequenos.

Instalação:

```bash
python -m pip install schedule
```

Exemplo:

```python
import schedule
import time

def backup():
    print("backup")

schedule.every().day.at("02:00").do(backup)

while True:
    schedule.run_pending()
    time.sleep(1)
```

Use `schedule` para:

- automações locais;
- scripts simples;
- protótipos;
- tarefas sem alta criticidade.

Evite `schedule` para produção distribuída crítica. Ele depende do processo ficar vivo.

---

## Cron Jobs

Cron é agendador do sistema operacional.

Exemplo:

```cron
0 6 * * * cd /app && /app/.venv/bin/python -m jobs.gerar_relatorio >> /var/log/relatorio.log 2>&1
```

Boas práticas com cron:

- use caminhos absolutos;
- configure ambiente explicitamente;
- redirecione logs;
- implemente lock para evitar execução sobreposta;
- monitore falhas;
- trate idempotência.

Lock simples com arquivo:

```python
from pathlib import Path

lock = Path("/tmp/gerar_relatorio.lock")

if lock.exists():
    raise SystemExit("job já em execução")

try:
    lock.touch()
    gerar_relatorio()
finally:
    lock.unlink(missing_ok=True)
```

Para sistemas Linux modernos, `systemd timer` pode ser uma alternativa mais observável que cron.

---

## Celery Beat vs APScheduler vs Cron

| Critério | Celery Beat | APScheduler | Cron |
| --- | --- | --- | --- |
| Dispara tasks distribuídas | Sim | Indiretamente | Indiretamente |
| Roda dentro do Python | Sim | Sim | Não |
| Depende de worker | Sim | Não necessariamente | Não |
| Bom para cluster | Sim, com cuidado para beat único | Exige cuidado com múltiplas réplicas | Sim por host |
| Observabilidade | Via Celery | Você implementa | Via SO/logs |
| Melhor uso | jobs Celery recorrentes | agendamento app-local | rotinas de sistema/script |

Regra prática:

- se a execução já é Celery, use Celery Beat;
- se é lógica app-local e controlada, APScheduler pode servir;
- se é script operacional independente, cron ou systemd timer costuma ser simples e robusto.

---

## Boas Práticas

- Jobs devem ser idempotentes.
- Configure timeout.
- Evite execução sobreposta.
- Separe agendamento de execução quando o trabalho for pesado.
- Registre início, fim, duração e erro.
- Use correlation id quando o job dispara outros fluxos.
- Não guarde segredo em crontab.
- Monitore filas e jobs atrasados.
- Defina política de retry e dead-letter quando houver broker.
- Em múltiplas réplicas, garanta que só um scheduler dispara cada job.

---

## Exercícios

1. Crie job simples com RQ.
2. Crie actor com Dramatiq.
3. Crie worker async com Arq.
4. Compare Celery, RQ, Dramatiq e Arq para envio de email.
5. Agende uma função com APScheduler.
6. Crie script local com `schedule`.
7. Escreva uma entrada cron para rodar um módulo Python.
8. Adicione lock para impedir execução duplicada.
9. Explique quando Celery Beat é melhor que cron.
