# Projetos IoT com Python: Estação Ambiental, Automação e Telemetria

Projetos práticos consolidam IoT porque unem hardware, firmware, protocolo, backend, banco, dashboard, segurança e operação. Os exemplos abaixo são estruturados como projetos profissionais, não apenas scripts isolados.

---

## Projeto 1: Estação Ambiental

Objetivo:

```text
medir temperatura, umidade e pressão
enviar telemetria via MQTT
armazenar histórico
visualizar dashboard
alertar quando temperatura passar limite
```

Arquitetura:

```text
BME280 -> Raspberry Pi/ESP32 -> MQTT -> Backend Python -> PostgreSQL/InfluxDB -> Grafana
```

Payload:

```json
{
  "schema_version": 1,
  "device_id": "estacao-001",
  "timestamp": "2026-05-16T22:00:00Z",
  "temperature_c": 27.4,
  "humidity_pct": 61.2,
  "pressure_hpa": 1013.2,
  "firmware_version": "1.0.0"
}
```

---

## Estrutura do Projeto

```text
estacao-ambiental/
├── device/
│   ├── main.py
│   ├── sensors.py
│   ├── mqtt_client.py
│   └── config.py
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── mqtt_consumer.py
│   └── requirements.txt
├── infra/
│   ├── docker-compose.yml
│   └── mosquitto.conf
└── README.md
```

---

## Device: Leitura e Publicação

```python
import json
import time
from datetime import datetime, timezone

import paho.mqtt.client as mqtt


DEVICE_ID = "estacao-001"


def read_sensors() -> dict:
    return {
        "temperature_c": 27.4,
        "humidity_pct": 61.2,
        "pressure_hpa": 1013.2,
    }


def build_payload() -> dict:
    return {
        "schema_version": 1,
        "device_id": DEVICE_ID,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "firmware_version": "1.0.0",
        **read_sensors(),
    }


client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, client_id=DEVICE_ID)
client.connect("localhost", 1883)

while True:
    payload = build_payload()
    client.publish(
        f"devices/{DEVICE_ID}/telemetry",
        json.dumps(payload),
        qos=1,
    )
    time.sleep(30)
```

Em produção, adicione reconnect, TLS, autenticação e buffer offline.

---

## Backend: Schema

```python
from datetime import datetime
from pydantic import BaseModel, Field


class EnvironmentalTelemetry(BaseModel):
    schema_version: int
    device_id: str
    timestamp: datetime
    temperature_c: float = Field(ge=-40, le=85)
    humidity_pct: float = Field(ge=0, le=100)
    pressure_hpa: float | None = None
    firmware_version: str
```

---

## Backend: Consumer MQTT

```python
import json
import logging

import paho.mqtt.client as mqtt
from pydantic import ValidationError

logger = logging.getLogger(__name__)


def on_message(client, userdata, message):
    try:
        payload = json.loads(message.payload.decode())
        telemetry = EnvironmentalTelemetry.model_validate(payload)
    except (json.JSONDecodeError, ValidationError):
        logger.exception("invalid_environmental_telemetry")
        return

    save_environmental_telemetry(telemetry)
    evaluate_alerts(telemetry)


client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, client_id="environment-consumer")
client.on_message = on_message
client.connect("localhost", 1883)
client.subscribe("devices/+/telemetry", qos=1)
client.loop_forever()
```

---

## Projeto 2: Automação com Relé

Objetivo:

```text
controlar relé remotamente
confirmar execução
manter estado atual
proteger comando com autenticação
```

Tópicos:

```text
devices/rele-001/commands
devices/rele-001/commands/{command_id}/result
devices/rele-001/state
```

Comando:

```json
{
  "command_id": "cmd-001",
  "action": "set_relay",
  "payload": {
    "channel": 1,
    "state": "on"
  }
}
```

Resultado:

```json
{
  "command_id": "cmd-001",
  "status": "success",
  "state": "on"
}
```

---

## Device: Processamento de Comando

```python
import json


processed_commands = set()


def handle_command(raw: bytes) -> dict:
    command = json.loads(raw.decode())
    command_id = command["command_id"]

    if command_id in processed_commands:
        return {"command_id": command_id, "status": "duplicate"}

    if command["action"] != "set_relay":
        return {"command_id": command_id, "status": "unsupported_action"}

    state = command["payload"]["state"]
    if state not in {"on", "off"}:
        return {"command_id": command_id, "status": "invalid_state"}

    apply_relay(state)
    processed_commands.add(command_id)
    return {"command_id": command_id, "status": "success", "state": state}
```

Persistir comandos recentes é melhor que manter apenas em memória.

---

## Projeto 3: Gateway Serial para MQTT

Objetivo:

```text
ler dados de Arduino/sensor via serial
validar linhas
converter para JSON
publicar em MQTT
bufferizar quando broker cair
```

Leitura serial:

```python
import serial

ser = serial.Serial("/dev/ttyUSB0", baudrate=9600, timeout=1)

while True:
    line = ser.readline().decode(errors="ignore").strip()
    if not line:
        continue
    process_line(line)
```

Formato simples:

```text
TEMP,27.4,HUM,61.2
```

Parser:

```python
def parse_line(line: str) -> dict:
    parts = line.split(",")
    if len(parts) != 4:
        raise ValueError("linha invalida")

    return {
        "temperature_c": float(parts[1]),
        "humidity_pct": float(parts[3]),
    }
```

---

## Projeto 4: Monitoramento de Energia

Objetivo:

```text
medir consumo eletrico
calcular potencia
enviar telemetria
alertar consumo anormal
gerar relatorio diario
```

Métricas:

- tensão;
- corrente;
- potência;
- energia acumulada;
- fator de potência quando disponível.

Cuidados:

- segurança elétrica;
- isolamento;
- calibração;
- precisão;
- amostragem;
- normas locais.

Alta tensão exige conhecimento técnico apropriado.

---

## Docker Compose Local

```yaml
services:
  mosquitto:
    image: eclipse-mosquitto:2
    ports:
      - "1883:1883"
    volumes:
      - ./mosquitto.conf:/mosquitto/config/mosquitto.conf:ro

  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: iot
      POSTGRES_USER: iot
      POSTGRES_PASSWORD: iot
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  api:
    build: ../backend
    environment:
      DATABASE_URL: postgresql+psycopg://iot:iot@postgres:5432/iot
      MQTT_HOST: mosquitto
    depends_on:
      - postgres
      - mosquitto

volumes:
  postgres_data:
```

---

## Checklist de Projeto Profissional

- payload tem schema e versão?
- dispositivo tem `device_id` único?
- broker exige autenticação em produção?
- telemetria é validada?
- leituras inválidas são registradas?
- comandos têm ID e resultado?
- há estado atual do dispositivo?
- backend tem logs e métricas?
- dados têm retenção?
- existe documentação de pinagem?
- há plano de OTA?
- há dashboard de saúde?

---

## Caminho de Evolução

1. Protótipo local com sensor e print.
2. Publicação MQTT local.
3. Consumer Python validando payload.
4. Banco de dados.
5. Dashboard.
6. Alertas.
7. Autenticação/TLS.
8. Buffer offline.
9. OTA.
10. Operação com múltiplos dispositivos.

Esse caminho evita tentar resolver produção inteira antes de provar hardware e comunicação.

Projetos IoT bons são construídos em camadas verificáveis. Primeiro o sensor funciona. Depois a mensagem chega. Depois o dado é salvo. Depois vira decisão e ação segura.

