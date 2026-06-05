# Gateways e Backends IoT com Python: FastAPI, MQTT e Filas

O backend IoT recebe telemetria, valida payloads, armazena histórico, expõe APIs, envia comandos, monitora dispositivos e integra dashboards, alertas e sistemas externos.

Python é excelente para essa camada com FastAPI, Pydantic, SQLAlchemy, MQTT clients, filas, workers e processamento de dados.

---

## Arquitetura de Backend

```text
Dispositivos
  -> MQTT Broker
  -> MQTT Consumer Python
  -> Validação
  -> Banco de séries temporais / PostgreSQL
  -> API FastAPI
  -> Dashboard / Alertas / Operadores
```

Com comandos:

```text
Operador -> API -> tabela comandos -> publisher MQTT -> dispositivo
                                      <- resultado do comando
```

---

## Modelo de Telemetria

```python
from datetime import datetime
from pydantic import BaseModel, Field


class TelemetryIn(BaseModel):
    schema_version: int = 1
    device_id: str = Field(min_length=3, max_length=80)
    timestamp: datetime
    temperature_c: float | None = None
    humidity_pct: float | None = None
    battery_pct: float | None = Field(default=None, ge=0, le=100)
    rssi: int | None = None
    firmware_version: str | None = None
```

Valide tudo que chega. Dispositivo pode estar com bug, sensor falho ou ser malicioso.

---

## API HTTP para Telemetria

```python
from fastapi import FastAPI

app = FastAPI()


@app.post("/iot/telemetry")
def receive_telemetry(payload: TelemetryIn) -> dict[str, str]:
    save_telemetry(payload)
    update_device_last_seen(payload.device_id, payload.timestamp)
    return {"status": "accepted"}
```

HTTP é simples, mas para muitos dispositivos MQTT costuma ser mais eficiente.

---

## Consumer MQTT

```python
import json
import logging

import paho.mqtt.client as mqtt
from pydantic import ValidationError

logger = logging.getLogger(__name__)


def on_message(client, userdata, message):
    try:
        raw = json.loads(message.payload.decode())
        telemetry = TelemetryIn.model_validate(raw)
    except (json.JSONDecodeError, ValidationError):
        logger.exception("invalid_telemetry", extra={"topic": message.topic})
        return

    save_telemetry(telemetry)
    update_device_last_seen(telemetry.device_id, telemetry.timestamp)


client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, client_id="iot-ingestor")
client.on_message = on_message
client.connect("localhost", 1883)
client.subscribe("devices/+/telemetry", qos=1)
client.loop_forever()
```

Em produção, esse consumer deve ter logs, métricas, reconexão e tratamento de backpressure.

---

## Estado do Dispositivo

Mantenha tabela/coleção de dispositivos:

```text
devices
├── device_id
├── name
├── status
├── last_seen_at
├── firmware_version
├── model
├── location
├── enabled
└── created_at
```

Estado atual permite responder:

- está online?
- qual firmware está rodando?
- quando enviou última telemetria?
- bateria está baixa?
- está habilitado?
- pertence a qual cliente/local?

---

## Banco com SQLAlchemy

Modelo simplificado:

```python
from datetime import datetime
from sqlalchemy import DateTime, Float, String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class Telemetry(Base):
    __tablename__ = "telemetry"

    id: Mapped[int] = mapped_column(primary_key=True)
    device_id: Mapped[str] = mapped_column(String(80), index=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime, index=True)
    metric: Mapped[str] = mapped_column(String(80), index=True)
    value: Mapped[float] = mapped_column(Float)
    unit: Mapped[str] = mapped_column(String(20))
```

Formato métrica/valor é flexível, mas pode exigir cuidado em consultas. Para métricas fixas, colunas específicas podem ser mais simples.

---

## Ingestão em Lote

Para reduzir overhead:

```python
def save_telemetry_batch(session, readings: list[TelemetryIn]) -> None:
    rows = []
    for reading in readings:
        if reading.temperature_c is not None:
            rows.append(
                Telemetry(
                    device_id=reading.device_id,
                    timestamp=reading.timestamp,
                    metric="temperature_c",
                    value=reading.temperature_c,
                    unit="celsius",
                )
            )

    session.add_all(rows)
    session.commit()
```

Em alta escala, use filas e escrita em lote.

---

## Filas e Workers

Arquitetura mais resiliente:

```text
MQTT consumer -> fila -> workers -> banco
                      -> alertas
                      -> regras
```

Benefícios:

- absorve picos;
- desacopla ingestão e processamento;
- permite retry;
- evita perder mensagem por banco lento;
- processa alertas separadamente.

Ferramentas:

- Redis Queue;
- Celery;
- Dramatiq;
- RabbitMQ;
- Kafka;
- cloud queues.

---

## Comandos Remotos

Modelo:

```python
from datetime import datetime
from pydantic import BaseModel


class CommandRequest(BaseModel):
    action: str
    payload: dict
    expires_at: datetime | None = None
```

Endpoint:

```python
@app.post("/iot/devices/{device_id}/commands")
def send_command(device_id: str, command: CommandRequest) -> dict:
    command_id = create_command(device_id, command)
    publish_mqtt_command(device_id, command_id, command)
    return {"command_id": command_id, "status": "queued"}
```

Tópico:

```text
devices/{device_id}/commands
```

Resultado:

```text
devices/{device_id}/commands/{command_id}/result
```

---

## Idempotência de Comandos

Dispositivo pode receber comando duplicado.

Inclua `command_id`:

```json
{
  "command_id": "cmd-123",
  "action": "set_relay",
  "payload": {"state": "on"}
}
```

Dispositivo deve registrar últimos comandos processados quando possível.

---

## Gateway Local

Gateway local pode:

- ler sensores BLE/Zigbee/Serial;
- converter protocolo local para MQTT;
- armazenar buffer offline;
- filtrar dados;
- executar regras locais;
- sincronizar com cloud;
- expor API local.

Python em Raspberry Pi é muito adequado para gateways.

---

## FastAPI para Gateway

```python
from fastapi import FastAPI

app = FastAPI()

device_state = {"relay": "off"}


@app.get("/local/state")
def state() -> dict:
    return device_state


@app.post("/local/relay/{state}")
def set_relay(state: str) -> dict:
    if state not in {"on", "off"}:
        return {"error": "invalid state"}
    device_state["relay"] = state
    apply_relay(state)
    return {"relay": state}
```

Gateway local deve ter autenticação se exposto em rede.

---

## Erros Comuns

- gravar telemetria sem validação;
- bloquear callback MQTT com processamento pesado;
- não separar ingestão de processamento;
- não controlar duplicidade de comandos;
- não atualizar `last_seen`;
- tratar todo dispositivo como confiável;
- não versionar payload;
- não ter fila para picos;
- API expor comando sem autorização.

---

## Checklist

- Backend valida payload com schema?
- MQTT consumer reconecta?
- Processamento pesado vai para fila?
- Dispositivo tem estado atual e `last_seen`?
- Comandos têm ID e resultado?
- Existe autenticação/autorização?
- Banco suporta volume esperado?
- Erros de payload são monitorados?
- Gateway local funciona offline?

Backend IoT é o ponto que transforma sinal físico em sistema operacional. Ele precisa ser robusto contra dados ruins, rede instável e crescimento de dispositivos.

