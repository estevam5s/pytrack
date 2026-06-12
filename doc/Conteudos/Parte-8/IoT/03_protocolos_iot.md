# Protocolos IoT: MQTT, HTTP, WebSocket, CoAP e Redes

Comunicação é o centro de IoT. Dispositivos precisam enviar telemetria, receber comandos, confirmar operações, operar com rede instável e consumir pouca energia.

Escolher protocolo errado pode gerar latência alta, consumo excessivo, custo de dados, perda de mensagens ou complexidade desnecessária.

---

## Critérios de Escolha

Avalie:

- consumo de banda;
- consumo de energia;
- confiabilidade;
- latência;
- suporte a offline;
- segurança;
- facilidade de debug;
- bibliotecas disponíveis;
- escala de dispositivos;
- necessidade de bidirecionalidade;
- infraestrutura existente.

Não existe protocolo universalmente melhor.

---

## MQTT

MQTT é um protocolo leve de publish/subscribe.

Componentes:

- **broker**: servidor central;
- **publisher**: quem publica mensagem;
- **subscriber**: quem assina tópicos;
- **topic**: canal lógico;
- **QoS**: nível de entrega;
- **retained message**: última mensagem retida;
- **last will**: mensagem publicada quando cliente cai inesperadamente.

Arquitetura:

```text
dispositivo -> publish telemetry/device-001 -> broker
backend -> subscribe telemetry/+
backend -> publish commands/device-001
dispositivo -> subscribe commands/device-001
```

---

## Tópicos MQTT

Exemplo de convenção:

```text
devices/{device_id}/telemetry
devices/{device_id}/state
devices/{device_id}/events
devices/{device_id}/commands
devices/{device_id}/commands/{command_id}/result
```

Exemplo:

```text
devices/estufa-001/telemetry
devices/estufa-001/commands
```

Evite tópicos sem hierarquia ou com dados sensíveis.

---

## QoS

MQTT tem três níveis:

- **QoS 0**: no máximo uma vez. Pode perder.
- **QoS 1**: pelo menos uma vez. Pode duplicar.
- **QoS 2**: exatamente uma vez no protocolo, mais caro.

Uso comum:

```text
telemetria frequente -> QoS 0 ou 1
comando importante -> QoS 1
configuracao critica -> QoS 1/2 conforme necessidade
```

Mesmo com QoS 1, consumidores devem ser idempotentes.

---

## MQTT com Python

```bash
pip install paho-mqtt
```

Publicador:

```python
import json
import time
from datetime import datetime, timezone

import paho.mqtt.client as mqtt

client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, client_id="device-001")
client.connect("localhost", 1883, keepalive=60)

while True:
    payload = {
        "device_id": "device-001",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "temperature_c": 25.4,
    }
    client.publish(
        "devices/device-001/telemetry",
        json.dumps(payload),
        qos=1,
    )
    time.sleep(10)
```

Assinante:

```python
import json
import paho.mqtt.client as mqtt


def on_message(client, userdata, message):
    payload = json.loads(message.payload.decode())
    print(message.topic, payload)


client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, client_id="backend-worker")
client.on_message = on_message
client.connect("localhost", 1883)
client.subscribe("devices/+/telemetry", qos=1)
client.loop_forever()
```

---

## Broker Mosquitto com Docker

```yaml
services:
  mosquitto:
    image: eclipse-mosquitto:2
    ports:
      - "1883:1883"
      - "9001:9001"
    volumes:
      - ./mosquitto.conf:/mosquitto/config/mosquitto.conf:ro
      - mosquitto_data:/mosquitto/data

volumes:
  mosquitto_data:
```

Configuração simples para desenvolvimento:

```conf
listener 1883
allow_anonymous true
```

Em produção, não permita anônimo. Use autenticação e TLS.

---

## Retained Messages

Mensagem retida guarda o último estado.

Uso:

```text
devices/lampada-01/state
```

Quando um backend assina o tópico, recebe imediatamente o estado atual.

Não use retained para telemetria de alta frequência. Use para estado/configuração.

---

## Last Will

Last Will publica mensagem se cliente cair inesperadamente.

Exemplo:

```python
client.will_set(
    "devices/device-001/status",
    payload='{"online": false}',
    qos=1,
    retain=True,
)
```

Ao conectar, publique online:

```python
client.publish(
    "devices/device-001/status",
    payload='{"online": true}',
    qos=1,
    retain=True,
)
```

---

## HTTP

HTTP é simples e universal.

Exemplo:

```python
import requests

payload = {"device_id": "device-001", "temperature_c": 25.4}
response = requests.post(
    "https://api.exemplo.com/iot/telemetry",
    json=payload,
    timeout=5,
)
response.raise_for_status()
```

Use HTTP quando:

- envio é eventual;
- infraestrutura HTTP já existe;
- debugging simples importa;
- dispositivo suporta overhead;
- não precisa de conexão persistente.

Limitações:

- mais verboso;
- polling para comandos é ineficiente;
- pode consumir mais energia;
- menos natural para pub/sub.

---

## WebSocket

WebSocket mantém conexão bidirecional.

Use quando:

- precisa de tempo real;
- backend envia comandos/eventos frequentemente;
- aplicação é dashboard ou gateway;
- o dispositivo suporta conexão persistente.

Não é tão leve quanto MQTT para microcontroladores, mas é útil em gateways e interfaces.

---

## CoAP

CoAP é parecido com HTTP, mas mais leve e baseado em UDP.

Use em dispositivos restritos e redes específicas. É comum em ecossistemas industriais/embarcados, mas menos simples para iniciantes que MQTT/HTTP.

---

## Redes IoT

### Wi-Fi

Bom para banda maior e ambientes com energia disponível.

Limitações:

- consumo maior;
- alcance moderado;
- configuração de credenciais;
- instabilidade em ambientes congestionados.

### BLE

Baixo consumo e curto alcance.

Bom para sensores próximos de gateway/mobile.

### LoRaWAN

Longo alcance e baixo consumo.

Limitações:

- baixa taxa de dados;
- payload pequeno;
- não serve para envio frequente pesado.

### Ethernet

Confiável para instalações fixas.

Bom para gateways, indústria e ambientes críticos.

---

## Payloads

JSON é legível:

```json
{
  "device_id": "device-001",
  "temperature_c": 25.4,
  "humidity_pct": 60.1
}
```

Para dispositivos restritos, considere formatos binários:

- MessagePack;
- CBOR;
- Protocol Buffers;
- payload binário próprio com muito cuidado.

JSON é ótimo para começar. Formato binário deve ser documentado e versionado.

---

## Versionamento de Payload

```json
{
  "schema_version": 1,
  "device_id": "device-001",
  "temperature_c": 25.4
}
```

Mudanças seguras:

- adicionar campo opcional;
- manter campo antigo por período;
- versionar schema;
- rejeitar payload incompatível com mensagem clara.

---

## Offline e Retry

Dispositivo deve tolerar rede instável:

- timeout;
- retry com backoff;
- buffer local;
- limite de fila;
- descarte controlado;
- marcação de timestamp original;
- envio em lote quando reconectar.

Sem limite, buffer local pode consumir toda memória.

---

## Erros Comuns

- usar HTTP polling agressivo para comandos;
- não versionar payload;
- não configurar timeout;
- assumir entrega única em MQTT QoS 1;
- não tratar duplicidade;
- permitir broker anônimo em produção;
- criar tópicos sem padrão;
- publicar telemetria como retained;
- enviar payload grande demais em rede limitada;
- ignorar reconnect.

---

## Checklist

- MQTT, HTTP ou outro protocolo foi escolhido por requisitos?
- Tópicos têm convenção clara?
- QoS foi definido por tipo de mensagem?
- Payload tem versão?
- Mensagens são idempotentes?
- Dispositivo reconecta sozinho?
- Há timeout e retry?
- Broker usa autenticação e TLS em produção?
- Offline buffering tem limite?

Comunicação IoT deve ser desenhada para falha. A rede vai cair, mensagens podem duplicar, comandos podem atrasar e o sistema precisa continuar previsível.

