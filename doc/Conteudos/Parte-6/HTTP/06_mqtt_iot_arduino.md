# MQTT, IoT e Arduino: Telemetria, Controle e Automação

MQTT é um protocolo leve de mensageria publish/subscribe, muito usado em IoT. Ele é ideal para sensores, automação residencial, telemetria industrial, dispositivos embarcados, ESP32/ESP8266, Arduino com módulo de rede, gateways e sistemas que precisam enviar eventos pequenos de forma eficiente.

MQTT roda normalmente sobre TCP. A porta padrão é `1883`; com TLS, `8883`.

---

## Conceitos MQTT

- **Broker**: servidor central que recebe e entrega mensagens.
- **Client**: dispositivo, aplicação ou serviço.
- **Publish**: publicar mensagem em tópico.
- **Subscribe**: assinar tópico.
- **Topic**: caminho lógico da mensagem.
- **QoS**: nível de garantia de entrega.
- **Retained message**: última mensagem retida no tópico.
- **Last Will and Testament**: mensagem publicada se cliente desconectar inesperadamente.

Arquitetura:

```text
Sensor ESP32 -> MQTT Broker -> Python Consumer -> Banco/Dashboard/Alertas
                         -> Home Assistant/Node-RED
Python Command Publisher -> MQTT Broker -> Atuador ESP32
```

---

## Tópicos MQTT

Exemplos:

```text
casa/sala/temperatura
casa/sala/umidade
casa/garagem/portao/comando
industria/linha1/maquina7/status
dispositivos/esp32-001/telemetria
dispositivos/esp32-001/comandos
```

Boas práticas:

- use hierarquia clara;
- evite espaços;
- padronize plural/singular;
- inclua ID do dispositivo;
- separe telemetria de comandos;
- não coloque segredo em tópico.

Wildcards:

```text
casa/+/temperatura
dispositivos/+/telemetria
casa/#
```

`+` substitui um nível. `#` substitui vários níveis no final.

---

## QoS

QoS 0:

- no máximo uma vez;
- rápido;
- pode perder mensagem.

QoS 1:

- pelo menos uma vez;
- pode duplicar;
- bom padrão para telemetria importante.

QoS 2:

- exatamente uma vez;
- maior overhead;
- use apenas quando necessário.

Em IoT, QoS 1 costuma equilibrar confiabilidade e custo. Sua aplicação deve lidar com duplicidade.

---

## Broker Mosquitto com Docker

```bash
docker run --rm -it -p 1883:1883 eclipse-mosquitto:2
```

Em versões modernas, pode ser necessário arquivo de config para permitir conexões anônimas em laboratório.

`mosquitto.conf`:

```conf
listener 1883
allow_anonymous true
```

Rodar:

```bash
docker run --rm -p 1883:1883 \
  -v "$PWD/mosquitto.conf:/mosquitto/config/mosquitto.conf" \
  eclipse-mosquitto:2
```

---

## Cliente Python com paho-mqtt

```bash
pip install paho-mqtt
```

Subscriber:

```python
import json
import paho.mqtt.client as mqtt


def on_connect(client, userdata, flags, reason_code, properties=None):
    print("Conectado", reason_code)
    client.subscribe("dispositivos/+/telemetria", qos=1)


def on_message(client, userdata, msg):
    payload = json.loads(msg.payload.decode())
    print(msg.topic, payload)


client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
client.on_connect = on_connect
client.on_message = on_message
client.connect("localhost", 1883, keepalive=60)
client.loop_forever()
```

Publisher:

```python
import json
import time
import paho.mqtt.client as mqtt


client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
client.connect("localhost", 1883, keepalive=60)
client.loop_start()

while True:
    payload = {"temperatura": 24.5, "umidade": 60}
    client.publish("dispositivos/esp32-001/telemetria", json.dumps(payload), qos=1)
    time.sleep(5)
```

---

## Mensagens Retained

```python
client.publish("casa/sala/lampada/estado", "on", retain=True)
```

Novo assinante recebe o último estado imediatamente.

Use retained para estado atual, não para eventos históricos.

---

## Last Will and Testament

```python
client.will_set(
    "dispositivos/esp32-001/status",
    payload="offline",
    qos=1,
    retain=True,
)
client.connect("localhost", 1883)
client.publish("dispositivos/esp32-001/status", "online", qos=1, retain=True)
```

Se o cliente cair sem desconectar corretamente, o broker publica `offline`.

---

## MQTT com TLS e Usuário/Senha

```python
import ssl

client.username_pw_set("usuario", "senha")
client.tls_set(
    ca_certs="ca.crt",
    cert_reqs=ssl.CERT_REQUIRED,
)
client.connect("broker.example.com", 8883)
```

Em produção:

- use TLS;
- autentique clientes;
- configure ACL por tópico;
- não permita anônimo;
- monitore conexões.

---

## Persistindo Telemetria com Python

```python
import sqlite3
from datetime import datetime, timezone


conn = sqlite3.connect("iot.db")
conn.execute("""
CREATE TABLE IF NOT EXISTS telemetria (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dispositivo TEXT NOT NULL,
    temperatura REAL,
    umidade REAL,
    recebido_em TEXT NOT NULL
)
""")


def salvar(dispositivo: str, payload: dict) -> None:
    conn.execute(
        """
        INSERT INTO telemetria (dispositivo, temperatura, umidade, recebido_em)
        VALUES (?, ?, ?, ?)
        """,
        (
            dispositivo,
            payload.get("temperatura"),
            payload.get("umidade"),
            datetime.now(timezone.utc).isoformat(),
        ),
    )
    conn.commit()
```

Em produção, use PostgreSQL, TimescaleDB, InfluxDB, ClickHouse ou outro storage adequado ao volume.

---

## Extraindo ID do Dispositivo

```python
def extrair_dispositivo(topic: str) -> str:
    partes = topic.split("/")
    if len(partes) != 3 or partes[0] != "dispositivos" or partes[2] != "telemetria":
        raise ValueError("Tópico inválido")
    return partes[1]
```

Valide tópico e payload. Dispositivos podem enviar dados quebrados.

---

## Arduino, ESP8266 e ESP32

Arduino Uno clássico precisa de módulo Ethernet/Wi-Fi. Para MQTT moderno, ESP8266 e ESP32 são mais comuns porque já têm Wi-Fi e boa comunidade.

Placas:

- ESP8266 NodeMCU;
- ESP32 DevKit;
- Arduino Uno + Ethernet Shield;
- Arduino MKR WiFi;
- Raspberry Pi Pico W.

Sensores comuns:

- DHT11/DHT22: temperatura/umidade;
- DS18B20: temperatura;
- BMP280/BME280: pressão/temperatura/umidade;
- LDR: luminosidade;
- relés: acionamento;
- reed switch: portas/janelas.

---

## ESP32 Publicando MQTT

Exemplo Arduino IDE com PubSubClient.

Bibliotecas:

- WiFi;
- PubSubClient;
- ArduinoJson opcional.

```cpp
#include <WiFi.h>
#include <PubSubClient.h>

const char* ssid = "SUA_REDE";
const char* password = "SUA_SENHA";
const char* mqtt_server = "192.168.0.10";

WiFiClient espClient;
PubSubClient client(espClient);

void setup_wifi() {
  delay(10);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
}

void reconnect() {
  while (!client.connected()) {
    if (client.connect("esp32-001")) {
      client.publish("dispositivos/esp32-001/status", "online", true);
    } else {
      delay(5000);
    }
  }
}

void setup() {
  setup_wifi();
  client.setServer(mqtt_server, 1883);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  String payload = "{\"temperatura\":24.5,\"umidade\":60}";
  client.publish("dispositivos/esp32-001/telemetria", payload.c_str());
  delay(5000);
}
```

---

## ESP32 Recebendo Comandos

```cpp
void callback(char* topic, byte* payload, unsigned int length) {
  String msg;
  for (int i = 0; i < length; i++) {
    msg += (char)payload[i];
  }

  if (String(topic) == "dispositivos/esp32-001/comandos/rele") {
    if (msg == "on") {
      digitalWrite(2, HIGH);
    } else if (msg == "off") {
      digitalWrite(2, LOW);
    }
  }
}

void setup() {
  pinMode(2, OUTPUT);
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
}

void reconnect() {
  while (!client.connected()) {
    if (client.connect("esp32-001")) {
      client.subscribe("dispositivos/esp32-001/comandos/#");
    } else {
      delay(5000);
    }
  }
}
```

Python enviando comando:

```python
client.publish("dispositivos/esp32-001/comandos/rele", "on", qos=1)
```

---

## JSON em IoT

Payload:

```json
{
  "device_id": "esp32-001",
  "ts": "2026-05-16T10:00:00Z",
  "temperatura": 24.5,
  "umidade": 60,
  "firmware": "1.0.3"
}
```

Cuidados:

- inclua versão de firmware;
- inclua timestamp quando possível;
- valide tipos;
- mantenha payload pequeno;
- para redes restritas, avalie CBOR/Protobuf.

---

## Arquitetura IoT Profissional

```text
Dispositivo -> Broker MQTT -> Serviço de Ingestão -> Validação -> Banco de Séries Temporais
                                         -> Regras/Alertas -> Notificações
Dashboard <- API <- Banco
Comandos -> API -> Broker MQTT -> Dispositivo
```

Componentes:

- broker: Mosquitto, EMQX, HiveMQ, AWS IoT Core;
- ingestão: Python consumer;
- storage: TimescaleDB, InfluxDB, PostgreSQL;
- dashboards: Grafana, custom web;
- alertas: regras + e-mail/SMS/Telegram;
- device registry: cadastro de dispositivos, chaves e permissões.

---

## Segurança em MQTT/IoT

Riscos:

- broker aberto na internet;
- anônimo permitido;
- tópico sem ACL;
- senha embutida no firmware;
- firmware desatualizado;
- comando sem autorização;
- payload falso;
- replay de mensagens.

Controles:

- TLS;
- autenticação por usuário/senha ou certificado;
- ACL por tópico;
- credenciais por dispositivo;
- rotação/revogação;
- tópicos de comando separados;
- validação no backend;
- rate limit;
- logs de conexão;
- OTA seguro quando aplicável.

ACL exemplo conceitual:

```text
device esp32-001 pode publicar dispositivos/esp32-001/telemetria
device esp32-001 pode assinar dispositivos/esp32-001/comandos/#
device esp32-001 não pode acessar dispositivos/esp32-002/#
```

---

## QoS, Retained e Estado

Telemetria frequente:

- QoS 0 ou 1;
- retained geralmente não;
- duplicidade aceitável com deduplicação por timestamp/id.

Estado atual:

- retained sim;
- exemplo `dispositivos/esp32-001/status`.

Comandos:

- QoS 1;
- cuidado com retained para comandos, pois dispositivo pode executar comando antigo ao reconectar.

---

## Checklist MQTT/IoT

- tópicos têm padrão claro?
- QoS foi escolhido por tipo de mensagem?
- retained é usado só para estado?
- comandos não ficam retidos indevidamente?
- dispositivo tem LWT?
- payload tem schema/versão?
- broker exige autenticação?
- TLS está ativo em produção?
- ACL limita tópicos por dispositivo?
- Python consumer valida payload?
- dados são persistidos com timestamp?
- sistema lida com duplicidade e reconexão?
- Arduino/ESP32 reconecta de forma robusta?

