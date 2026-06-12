# Agendamentos com cron, schedule, APScheduler e Produção

Agendar automações significa executar scripts em horários, intervalos ou condições definidas. Pode ser uma rotina diária de relatório, uma coleta a cada hora, um backup semanal ou uma verificação de disponibilidade a cada minuto.

Agendamento profissional precisa considerar ambiente, logs, idempotência, concorrência, fuso horário, falhas, alertas e reexecução.

---

## Opções de Agendamento

- `cron`: padrão em Linux/macOS, simples e confiável.
- Agendador de Tarefas do Windows: equivalente no Windows.
- `schedule`: biblioteca simples para scripts Python.
- APScheduler: agendador avançado dentro da aplicação.
- Celery Beat: agendamento distribuído com workers.
- Airflow/Prefect/Dagster: orquestração de pipelines.
- Cloud Scheduler/EventBridge/GitHub Actions: execução gerenciada.

---

## Script Preparado para Agendamento

```python
import logging
import sys


def executar() -> None:
    logging.info("Executando rotina")
    # regra de negócio aqui


def main() -> int:
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s | %(levelname)s | %(message)s",
    )
    try:
        executar()
        return 0
    except Exception:
        logging.exception("Falha na rotina")
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
```

Retornar `0` para sucesso e `1` para erro ajuda o agendador a detectar falhas.

---

## cron

Editar crontab:

```bash
crontab -e
```

Exemplo: executar todo dia às 07:30.

```cron
30 7 * * * /usr/bin/python3 /caminho/projeto/rotina.py >> /caminho/projeto/logs/cron.log 2>&1
```

Formato:

```text
minuto hora dia_do_mes mes dia_da_semana comando
```

Exemplos:

```cron
*/15 * * * * comando        # a cada 15 minutos
0 8 * * 1-5 comando         # 08:00 de segunda a sexta
0 2 1 * * comando           # 02:00 no primeiro dia do mês
30 23 * * 0 comando         # 23:30 aos domingos
```

---

## Cuidados com cron

O cron roda com ambiente reduzido. Use caminhos absolutos.

```cron
SHELL=/bin/bash
PATH=/usr/local/bin:/usr/bin:/bin
PYTHONPATH=/caminho/projeto/src

30 7 * * * cd /caminho/projeto && /caminho/projeto/.venv/bin/python -m automacao.main >> logs/execucao.log 2>&1
```

Boas práticas:

- use Python do ambiente virtual;
- use `cd` para a pasta do projeto;
- redirecione stdout e stderr;
- configure variáveis de ambiente;
- registre logs em arquivo;
- evite sobreposição de execuções.

---

## Evitando Execuções Simultâneas

```python
from pathlib import Path
import os
import sys


class LockFile:
    def __init__(self, caminho: Path) -> None:
        self.caminho = caminho

    def __enter__(self):
        if self.caminho.exists():
            raise RuntimeError("Outra execução parece estar em andamento")
        self.caminho.write_text(str(os.getpid()), encoding="utf-8")
        return self

    def __exit__(self, exc_type, exc, tb):
        self.caminho.unlink(missing_ok=True)


def main() -> int:
    try:
        with LockFile(Path("rotina.lock")):
            print("Executando rotina")
        return 0
    except Exception as exc:
        print(exc, file=sys.stderr)
        return 1
```

Em produção crítica, prefira locks atômicos, banco, Redis ou ferramentas como `flock`.

---

## schedule

Instalação:

```bash
pip install schedule
```

Exemplo:

```python
import schedule
import time
import logging


def rotina() -> None:
    logging.info("Executando rotina")


schedule.every().day.at("07:30").do(rotina)
schedule.every(15).minutes.do(rotina)

logging.basicConfig(level=logging.INFO)

while True:
    schedule.run_pending()
    time.sleep(1)
```

`schedule` é simples, mas o processo precisa ficar rodando. Se ele parar, os agendamentos param.

---

## APScheduler

Instalação:

```bash
pip install apscheduler
```

Exemplo:

```python
from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.triggers.cron import CronTrigger
import logging


def gerar_relatorio() -> None:
    logging.info("Gerando relatório")


logging.basicConfig(level=logging.INFO)

scheduler = BlockingScheduler(timezone="America/Sao_Paulo")
scheduler.add_job(
    gerar_relatorio,
    CronTrigger(hour=7, minute=30),
    id="relatorio_diario",
    max_instances=1,
    coalesce=True,
    misfire_grace_time=300,
)
scheduler.start()
```

Conceitos:

- `max_instances`: evita múltiplas execuções simultâneas do mesmo job.
- `coalesce`: junta execuções perdidas em uma só.
- `misfire_grace_time`: tolerância para atraso.
- `timezone`: define fuso explicitamente.

---

## Projeto Completo: Agendador com Logs e Alerta

```python
from __future__ import annotations

from datetime import datetime
from pathlib import Path
import logging
import smtplib
from email.message import EmailMessage
import os

from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.triggers.cron import CronTrigger


logger = logging.getLogger("agendador")


def configurar_logs() -> None:
    Path("logs").mkdir(exist_ok=True)
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
        handlers=[
            logging.FileHandler("logs/agendador.log", encoding="utf-8"),
            logging.StreamHandler(),
        ],
    )


def enviar_alerta(assunto: str, corpo: str) -> None:
    if not os.environ.get("SMTP_HOST"):
        logger.warning("SMTP não configurado; alerta não enviado")
        return

    msg = EmailMessage()
    msg["Subject"] = assunto
    msg["From"] = os.environ["SMTP_FROM"]
    msg["To"] = os.environ["SMTP_TO"]
    msg.set_content(corpo)

    with smtplib.SMTP(os.environ["SMTP_HOST"], int(os.environ.get("SMTP_PORT", "587"))) as smtp:
        smtp.starttls()
        smtp.login(os.environ["SMTP_USER"], os.environ["SMTP_PASSWORD"])
        smtp.send_message(msg)


def rotina_relatorio() -> None:
    inicio = datetime.now()
    logger.info("Iniciando relatório diário")
    try:
        # Chame aqui a função real da automação.
        Path("data/output").mkdir(parents=True, exist_ok=True)
        Path("data/output/relatorio.txt").write_text(
            f"Relatório gerado em {inicio.isoformat()}\n",
            encoding="utf-8",
        )
        logger.info("Relatório diário concluído")
    except Exception as exc:
        logger.exception("Falha no relatório diário")
        enviar_alerta("Falha no relatório diário", str(exc))
        raise


def main() -> None:
    configurar_logs()
    scheduler = BlockingScheduler(timezone="America/Sao_Paulo")
    scheduler.add_job(
        rotina_relatorio,
        CronTrigger(hour=7, minute=30),
        id="relatorio_diario",
        max_instances=1,
        coalesce=True,
        misfire_grace_time=300,
    )
    logger.info("Agendador iniciado")
    scheduler.start()


if __name__ == "__main__":
    main()
```

---

## Monitoramento

Uma rotina agendada deve responder:

- quando iniciou?
- quando terminou?
- quanto tempo levou?
- processou quantos itens?
- falhou em qual etapa?
- pode ser reexecutada?
- alguém foi alertado?

Mínimo recomendado:

- logs em arquivo;
- código de saída correto;
- alerta em falha;
- lock contra concorrência;
- métrica de duração;
- registro de última execução.

---

## Checklist de Produção

- O script usa caminhos absolutos ou `cd` controlado?
- O ambiente virtual está explícito?
- Variáveis de ambiente estão disponíveis ao agendador?
- Logs capturam stdout e stderr?
- Há proteção contra execução simultânea?
- O fuso horário está definido?
- Falhas geram alerta?
- O processo é idempotente?
- Existe procedimento de reprocessamento?
- A rotina foi testada manualmente antes do agendamento?

