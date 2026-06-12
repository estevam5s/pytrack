# Python em Dispositivos: Raspberry Pi, MicroPython e CircuitPython

Python pode rodar em dispositivos IoT de formas diferentes. Em Raspberry Pi e gateways Linux, usamos CPython completo. Em microcontroladores como ESP32 e RP2040, usamos MicroPython ou CircuitPython, que são implementações menores da linguagem.

Escolher a plataforma correta depende de energia, custo, conectividade, bibliotecas, tempo real, memória e manutenção.

---

## CPython em Raspberry Pi

Raspberry Pi roda Linux, então você pode usar:

- Python completo;
- `pip`;
- virtualenv;
- systemd;
- Docker;
- FastAPI;
- MQTT;
- OpenCV;
- banco local;
- GPIO.

Exemplo de serviço coletor:

```python
import time
from datetime import datetime, timezone


def ler_sensor() -> float:
    return 25.4


while True:
    leitura = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "temperature_c": ler_sensor(),
    }
    print(leitura)
    time.sleep(10)
```

---

## Serviço systemd no Raspberry Pi

`/etc/systemd/system/iot-device.service`:

```ini
[Unit]
Description=IoT Device Collector
After=network.target

[Service]
User=pi
WorkingDirectory=/home/pi/iot-device
ExecStart=/home/pi/iot-device/.venv/bin/python main.py
Restart=always
RestartSec=5
EnvironmentFile=/home/pi/iot-device/.env

[Install]
WantedBy=multi-user.target
```

Ativar:

```bash
sudo systemctl daemon-reload
sudo systemctl enable iot-device
sudo systemctl start iot-device
journalctl -u iot-device -f
```

---

## MicroPython

MicroPython roda em microcontroladores.

Características:

- subconjunto de Python;
- acesso a pinos com `machine`;
- memória limitada;
- sem muitas bibliotecas CPython;
- bom para ESP32, ESP8266, RP2040;
- REPL via serial.

Exemplo LED:

```python
from machine import Pin
from time import sleep

led = Pin(2, Pin.OUT)

while True:
    led.value(1)
    sleep(1)
    led.value(0)
    sleep(1)
```

---

## Wi-Fi no MicroPython

```python
import network
import time


def connect_wifi(ssid: str, password: str) -> None:
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(ssid, password)

    for _ in range(30):
        if wlan.isconnected():
            print("Wi-Fi conectado", wlan.ifconfig())
            return
        time.sleep(1)

    raise RuntimeError("falha ao conectar Wi-Fi")
```

Em produção, credenciais precisam de provisionamento seguro, não hardcoded.

---

## MQTT no MicroPython

Bibliotecas variam por firmware. Exemplo conceitual com `umqtt.simple`:

```python
import json
import time
from umqtt.simple import MQTTClient


client = MQTTClient(
    client_id=b"esp32-001",
    server=b"192.168.1.10",
    port=1883,
)
client.connect()

while True:
    payload = json.dumps({
        "device_id": "esp32-001",
        "temperature_c": 25.4,
    })
    client.publish(b"devices/esp32-001/telemetry", payload)
    time.sleep(10)
```

Adicione reconnect, tratamento de exceção e watchdog para uso real.

---

## CircuitPython

CircuitPython foca simplicidade e educação/prototipagem.

Vantagens:

- muito amigável;
- bibliotecas Adafruit;
- dispositivo aparece como unidade USB;
- ótimo para sensores e protótipos.

Exemplo:

```python
import time
import board
import digitalio

led = digitalio.DigitalInOut(board.LED)
led.direction = digitalio.Direction.OUTPUT

while True:
    led.value = True
    time.sleep(1)
    led.value = False
    time.sleep(1)
```

---

## Estrutura de Firmware

Evite colocar tudo em um arquivo gigante.

```text
device/
├── main.py
├── config.py
├── sensors.py
├── network_manager.py
├── mqtt_client.py
├── commands.py
└── storage.py
```

Mesmo em MicroPython, separar responsabilidades melhora manutenção.

---

## Loop Principal Robusto

```python
import time


def main_loop():
    while True:
        try:
            reading = read_sensors()
            publish_telemetry(reading)
            process_commands()
        except Exception as exc:
            log_error(exc)
            reconnect_if_needed()

        time.sleep(10)
```

Em dispositivo real:

- não deixe exceção matar o loop;
- registre falhas;
- reconecte;
- use watchdog quando disponível;
- limite retries;
- proteja memória.

---

## Watchdog

Watchdog reinicia dispositivo se software travar.

Uso conceitual:

```text
loop saudável -> alimenta watchdog
loop travou -> watchdog reinicia dispositivo
```

Reinício automático é útil, mas não deve esconder bug permanente. Registre motivo/contagem quando possível.

---

## Armazenamento Local

Use para:

- configuração;
- fila offline;
- último estado;
- contador de falhas;
- certificados.

Cuidados:

- flash tem limite de escrita;
- arquivos podem corromper;
- limite tamanho da fila;
- use escrita atômica quando possível.

---

## Economia de Energia

Em dispositivos com bateria:

- deep sleep;
- reduzir frequência de envio;
- desligar sensores;
- agrupar mensagens;
- escolher rede adequada;
- medir consumo real;
- evitar loops ocupados.

MicroPython em ESP32:

```python
import machine

machine.deepsleep(60_000)
```

Isso reinicia o programa ao acordar.

---

## Configuração e Provisionamento

Evite firmware com credenciais fixas.

Estratégias:

- portal Wi-Fi local;
- BLE provisioning;
- arquivo de configuração seguro;
- QR code;
- certificado por dispositivo;
- claim code;
- provisionamento em fábrica.

Provisionamento define identidade inicial do dispositivo.

---

## Erros Comuns

- hardcode de Wi-Fi e token;
- loop sem tratamento de exceção;
- publicar sem reconnect;
- usar memória demais em MicroPython;
- escrever flash a cada leitura;
- não ter watchdog;
- não versionar firmware;
- não separar telemetria de logs;
- ignorar deep sleep em bateria;
- não testar perda de rede.

---

## Checklist

- Plataforma escolhida é adequada ao consumo e recursos?
- Código reconecta após falha?
- Exceções não matam o dispositivo permanentemente?
- Firmware tem versão?
- Configuração não fica hardcoded?
- Há watchdog ou estratégia de recuperação?
- Escritas em flash são controladas?
- O dispositivo suporta operação offline mínima?
- Logs e erros são recuperáveis?

Python em IoT é excelente para protótipos e gateways, e muito capaz em microcontroladores com MicroPython/CircuitPython. O salto para produção exige robustez contra falhas físicas e de rede.

