# Filas, Celery e RabbitMQ

Celery e RabbitMQ são usados para tarefas assíncronas distribuídas: envio de email, processamento de arquivos, jobs demorados, retries, agendamento e execução em workers.

---

## Sumário

1. [Filas de Tarefas](#filas-de-tarefas)
2. [Celery](#celery)
3. [RabbitMQ](#rabbitmq)
4. [Primeiro App Celery](#primeiro-app-celery)
5. [Tasks](#tasks)
6. [Retries](#retries)
7. [Serialização](#serialização)
8. [Resultados](#resultados)
9. [Agendamento](#agendamento)
10. [Workers e Escala](#workers-e-escala)
11. [Alternativas ao Celery](#alternativas-ao-celery)
12. [Boas Práticas](#boas-práticas)
13. [Exercícios](#exercícios)

---

## Filas de Tarefas

Fila desacopla produtor e consumidor.

```text
API produz tarefa
  ↓
broker recebe mensagem
  ↓
worker consome
  ↓
resultado/log/efeito colateral
```

Use filas quando:

- tarefa demora;
- não precisa bloquear resposta HTTP;
- precisa retry;
- precisa distribuir trabalho;
- precisa agendamento;
- precisa absorver picos.

Exemplos:

- enviar email;
- processar imagem;
- gerar relatório;
- importar CSV;
- recalcular métricas;
- chamar API externa.

---

## Celery

Celery é framework de tarefas distribuídas.

Componentes:

- producer: envia tarefa;
- broker: RabbitMQ/Redis;
- worker: executa tarefa;
- result backend: armazena resultado opcional;
- beat: agenda tarefas.

Instalação:

```bash
python -m pip install celery
```

Com RabbitMQ:

```bash
python -m pip install "celery[librabbitmq]"
```

---

## RabbitMQ

RabbitMQ é broker de mensagens.

Conceitos:

- exchange;
- queue;
- routing key;
- binding;
- ack;
- dead-letter queue;
- prefetch.

Celery abstrai parte desses conceitos, mas especialista precisa entender:

- mensagem precisa ser reconhecida;
- worker pode falhar;
- tarefa pode executar mais de uma vez;
- retry pode duplicar efeito se tarefa não for idempotente.

---

## Primeiro App Celery

`tasks.py`:

```python
from celery import Celery

app = Celery(
    "tarefas",
    broker="pyamqp://guest@localhost//",
    backend="rpc://",
)

@app.task
def somar(a: int, b: int) -> int:
    return a + b
```

Rodar worker:

```bash
celery -A tasks worker --loglevel=INFO
```

Chamar tarefa:

```python
from tasks import somar

resultado = somar.delay(2, 3)
print(resultado.get(timeout=10))
```

---

## Tasks

Task simples:

```python
@app.task
def enviar_email(destino: str, assunto: str, corpo: str) -> None:
    print(f"enviando email para {destino}")
```

Task nomeada:

```python
@app.task(name="emails.enviar_boas_vindas")
def enviar_boas_vindas(user_id: int) -> None:
    ...
```

Chamadas:

```python
enviar_email.delay("ana@example.com", "Olá", "Bem-vinda")
enviar_email.apply_async(args=["ana@example.com", "Olá", "Bem-vinda"], countdown=60)
```

---

## Retries

```python
import requests

@app.task(bind=True, autoretry_for=(requests.RequestException,), retry_backoff=True, retry_kwargs={"max_retries": 5})
def notificar_webhook(self, url: str, payload: dict) -> None:
    resposta = requests.post(url, json=payload, timeout=10)
    resposta.raise_for_status()
```

Retry deve ser seguro.

Tarefa idempotente:

```python
@app.task
def processar_pedido(pedido_id: str) -> None:
    if pedido_ja_processado(pedido_id):
        return
    marcar_processando(pedido_id)
    executar_processamento(pedido_id)
    marcar_processado(pedido_id)
```

---

## Serialização

Evite enviar objetos complexos.

Ruim:

```python
processar_usuario.delay(usuario_objeto)
```

Melhor:

```python
processar_usuario.delay(usuario_id)
```

Envie IDs e dados simples. O worker carrega o estado atual da fonte confiável.

Configuração:

```python
app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    timezone="America/Sao_Paulo",
)
```

---

## Resultados

Nem toda tarefa precisa de resultado.

Use result backend quando:

- precisa consultar status;
- precisa resultado final;
- existe workflow dependente.

Evite armazenar resultados grandes.

```python
resultado = tarefa.delay()
status = resultado.status
```

---

## Agendamento

Celery Beat agenda tarefas.

```python
from celery.schedules import crontab

app.conf.beat_schedule = {
    "gerar-relatorio-diario": {
        "task": "relatorios.gerar_diario",
        "schedule": crontab(hour=6, minute=0),
    }
}
```

---

## Workers e Escala

Configurações importantes:

- concorrência;
- filas separadas;
- prefetch;
- autoscaling;
- time limit;
- memory limit;
- dead letter;
- retry policy.

Exemplo com fila:

```bash
celery -A tasks worker -Q emails --loglevel=INFO
```

Roteamento:

```python
app.conf.task_routes = {
    "emails.*": {"queue": "emails"},
    "relatorios.*": {"queue": "relatorios"},
}
```

---

## Alternativas ao Celery

Celery é robusto e maduro, mas nem sempre é a escolha mais simples.

| Ferramenta | Broker comum | Melhor uso |
| --- | --- | --- |
| Celery | RabbitMQ/Redis | tarefas distribuídas complexas, retries, rotas, beat, ecossistema grande |
| RQ | Redis | jobs simples com Redis e baixa curva de aprendizado |
| Dramatiq | RabbitMQ/Redis | tasks distribuídas com API enxuta e boa ergonomia |
| Arq | Redis | workers assíncronos nativos com `asyncio` |

Veja exemplos completos em `09_filas_agendadores.md`.

---

## Boas Práticas

- Tarefas devem ser idempotentes.
- Envie IDs, não objetos grandes.
- Configure timeouts.
- Use retries com backoff.
- Separe filas por tipo de carga.
- Monitore tamanho das filas.
- Use dead-letter para falhas permanentes.
- Não use Celery como banco de dados.
- Logs devem ter correlation id.
- Documente efeitos colaterais.

---

## Exercícios

1. Crie app Celery simples.
2. Rode worker.
3. Crie task de soma.
4. Crie task de envio de email fake.
5. Adicione retry com backoff.
6. Configure serialização JSON.
7. Crie fila separada para relatórios.
8. Explique idempotência em tasks.
9. Compare Celery, RQ, Dramatiq e Arq para um caso real.
