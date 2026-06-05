# Linux Embarcado com Python

Linux embarcado permite usar Python completo em dispositivos como Raspberry Pi, BeagleBone, gateways industriais e edge computers. Ele oferece rede, sistema de arquivos, processos, serviços e bibliotecas amplas.

---

## Quando Usar Linux Embarcado

Use Linux embarcado quando precisa de:

- rede avançada;
- banco local;
- processamento mais pesado;
- containers;
- camera;
- interface web;
- atualizacoes remotas;
- multiplos processos;
- armazenamento;
- bibliotecas CPython completas.

Evite quando precisa de:

- boot instantaneo;
- consumo ultrabaixo;
- tempo real estrito;
- custo minimo;
- firmware muito simples.

---

## GPIO no Raspberry Pi

Com `gpiozero`:

```python
from gpiozero import LED, Button
from signal import pause

led = LED(17)
botao = Button(2)

botao.when_pressed = led.on
botao.when_released = led.off

pause()
```

---

## Serial com PySerial

```python
import serial

ser = serial.Serial("/dev/ttyUSB0", 9600, timeout=1)
ser.write(b"ping\n")
linha = ser.readline()
print(linha)
ser.close()
```

---

## I2C e SPI em Linux

Bibliotecas comuns:

- `smbus2` para I2C;
- `spidev` para SPI;
- `adafruit-blinka` para compatibilidade CircuitPython.

```python
from smbus2 import SMBus

with SMBus(1) as bus:
    dados = bus.read_byte_data(0x40, 0x00)
    print(dados)
```

---

## Serviços com systemd

Arquivo exemplo:

```ini
[Unit]
Description=Gateway IoT Python
After=network-online.target

[Service]
WorkingDirectory=/opt/gateway
ExecStart=/opt/gateway/.venv/bin/python -m app.main
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Serviços devem reiniciar em falha e registrar logs.

---

## API Local com FastAPI

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/leituras")
def leituras():
    return {"temperatura": 25.4}
```

Executar:

```bash
uvicorn app:app --host 0.0.0.0 --port 8000
```

---

## Logs

```python
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

logger.info("gateway iniciado")
```

Em Linux, logs podem ir para stdout e serem capturados por `journalctl`.

---

## Boas Praticas

- Use ambiente virtual.
- Rode como usuario sem privilegio quando possivel.
- Configure systemd.
- Inclua health check.
- Trate reconexao.
- Separe configuracao em arquivo ou variaveis de ambiente.
- Monitore disco e memoria.
- Proteja credenciais.

---

## Exercicios

1. Crie script GPIO com `gpiozero`.
2. Leia dados de serial com `pyserial`.
3. Crie um servico systemd.
4. Crie API local com FastAPI.
5. Defina estrategia de logs para gateway.
