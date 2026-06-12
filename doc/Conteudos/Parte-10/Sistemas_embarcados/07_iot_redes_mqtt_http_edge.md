# IoT, Redes, MQTT, HTTP e Edge Computing

IoT conecta dispositivos fisicos a redes e sistemas. Embarcados com Python podem coletar dados, atuar localmente, enviar telemetria e receber comandos.

---

## Arquitetura IoT

```text
sensor -> dispositivo -> gateway -> broker/API -> banco -> dashboard/alertas
```

Camadas:

- dispositivo;
- conectividade;
- ingestao;
- processamento;
- armazenamento;
- visualizacao;
- operacao.

---

## Wi-Fi em MicroPython

```python
import network
import time

wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect("SSID", "senha")

while not wlan.isconnected():
    time.sleep(1)

print(wlan.ifconfig())
```

Nunca deixe senha fixa em repositorio publico.

---

## HTTP

```python
import urequests

resposta = urequests.post(
    "https://api.exemplo.com/leituras",
    json={"temperatura": 25.4},
)
print(resposta.status_code)
resposta.close()
```

HTTP e simples, mas pode ser pesado para microcontroladores pequenos.

---

## MQTT

MQTT e protocolo leve baseado em publish/subscribe.

Conceitos:

- broker;
- topico;
- publish;
- subscribe;
- QoS;
- retain;
- last will.

Topicos:

```text
fabrica/linha1/sensor7/temperatura
fabrica/linha1/sensor7/status
fabrica/linha1/sensor7/comandos
```

---

## MQTT com Python em Gateway

```python
import json
import paho.mqtt.client as mqtt

client = mqtt.Client()
client.connect("localhost", 1883)

payload = {"temperatura": 25.4}
client.publish("sensores/sala/temperatura", json.dumps(payload))
client.disconnect()
```

---

## Reconexao

Dispositivos IoT devem assumir que rede falha.

Regras:

- timeout em toda comunicacao;
- retry com backoff;
- buffer local quando possivel;
- status de conexao;
- watchdog;
- telemetria de erro.

---

## Edge Computing

Edge computing processa dados perto da fonte.

Exemplos:

- filtrar leituras invalidas;
- calcular media local;
- detectar anomalia;
- reduzir volume enviado;
- tomar decisao local quando nuvem falha.

---

## Segurança IoT

- TLS;
- credenciais por dispositivo;
- rotacao de chaves;
- topicos autorizados;
- firmware assinado quando possivel;
- sem senhas hardcoded;
- atualizacao segura;
- desativar servicos desnecessarios.

---

## Exercicios

1. Desenhe arquitetura IoT para sensor de temperatura.
2. Compare HTTP e MQTT.
3. Crie uma estrategia de reconexao.
4. Defina topicos MQTT para um dispositivo.
5. Liste dados que devem ser processados no edge.
