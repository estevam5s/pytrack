# Hardware IoT: Sensores, Atuadores, GPIO, I2C, SPI e UART

IoT conecta software ao mundo físico. Para fazer isso com segurança, é necessário entender sensores, atuadores, sinais elétricos, protocolos de barramento e limites do hardware.

Python facilita prototipagem e automação, mas não elimina a necessidade de cuidado elétrico. Ligação errada pode queimar placa, sensor, computador ou equipamento controlado.

---

## Dispositivos Comuns

### Raspberry Pi

É um computador Linux pequeno.

Vantagens:

- roda Python completo;
- suporta Docker;
- tem rede, USB, câmera;
- bom para gateways e edge;
- acessa GPIO.

Limitações:

- boot mais lento;
- consumo maior que microcontrolador;
- cartão SD pode corromper;
- não é ideal para tempo real rígido.

### ESP32

Microcontrolador com Wi-Fi/BLE.

Vantagens:

- barato;
- baixo consumo;
- ótimo para sensores;
- pode rodar MicroPython;
- tem ADC, PWM, I2C, SPI, UART.

Limitações:

- memória limitada;
- MicroPython tem menos bibliotecas;
- debug mais restrito;
- não roda Python CPython completo.

---

## Sensores

Sensores transformam fenômenos físicos em sinais.

Exemplos:

- temperatura: DS18B20, DHT22, BME280;
- umidade: DHT22, BME280;
- pressão: BMP280/BME280;
- luminosidade: LDR, BH1750;
- movimento: PIR;
- distância: HC-SR04, VL53L0X;
- corrente: ACS712, SCT-013;
- peso: célula de carga + HX711;
- gás: MQ-2, MQ-135;
- GPS: módulos NEO-6M.

Cada sensor tem precisão, intervalo, ruído, tempo de resposta e protocolo.

---

## Atuadores

Atuadores executam ação física:

- LED;
- relé;
- motor DC;
- servo motor;
- motor de passo;
- buzzer;
- válvula solenoide;
- display;
- resistência/aquecedor;
- bomba.

Regra: GPIO não deve alimentar cargas grandes diretamente. Use transistor, driver, relé, MOSFET, optoacoplador ou módulo apropriado.

---

## GPIO

GPIO é pino digital configurável como entrada ou saída.

Exemplo Raspberry Pi com `gpiozero`:

```bash
pip install gpiozero
```

```python
from gpiozero import LED, Button
from signal import pause

led = LED(17)
button = Button(2)

button.when_pressed = led.on
button.when_released = led.off

pause()
```

Em Raspberry Pi, numeração pode ser BCM ou física. Documente qual está usando.

---

## Entrada Digital

Botão:

```python
from gpiozero import Button

button = Button(2, pull_up=True)

if button.is_pressed:
    print("pressionado")
```

Conceitos importantes:

- pull-up;
- pull-down;
- debounce;
- ruído;
- contato mecânico.

Debounce evita múltiplas leituras por uma única pressão.

---

## Saída Digital

LED:

```python
from gpiozero import LED
from time import sleep

led = LED(17)

while True:
    led.on()
    sleep(1)
    led.off()
    sleep(1)
```

Use resistor adequado para LED.

---

## PWM

PWM simula controle analógico por pulso.

Usos:

- brilho de LED;
- velocidade de motor;
- controle de servo;
- potência média.

Exemplo:

```python
from gpiozero import PWMLED
from time import sleep

led = PWMLED(17)

for i in range(101):
    led.value = i / 100
    sleep(0.02)
```

---

## ADC

Muitos microcontroladores têm ADC para ler sinais analógicos. Raspberry Pi não tem ADC nativo.

Para Raspberry Pi, use conversor externo como MCP3008.

Exemplo conceitual:

```text
Sensor analogico -> ADC -> SPI/I2C -> Raspberry Pi
```

Cuidados:

- tensão máxima;
- resolução;
- ruído;
- referência;
- calibração.

---

## I2C

I2C usa dois fios principais:

- SDA: dados;
- SCL: clock.

Permite múltiplos dispositivos no mesmo barramento, cada um com endereço.

Exemplo com BME280/BMP280 costuma usar bibliotecas específicas:

```python
import board
import busio

i2c = busio.I2C(board.SCL, board.SDA)
```

Problemas comuns:

- endereço errado;
- pull-ups ausentes;
- cabo longo demais;
- tensão incompatível;
- barramento travado.

---

## SPI

SPI usa mais fios, mas pode ser mais rápido:

- MOSI;
- MISO;
- SCLK;
- CS/CE.

Usos:

- displays;
- ADCs;
- memórias;
- leitores RFID;
- sensores rápidos.

Comparação:

```text
I2C: menos fios, vários dispositivos, velocidade moderada
SPI: mais fios, mais rápido, chip select por dispositivo
```

---

## UART/Serial

UART é comunicação serial ponto a ponto.

Usos:

- GPS;
- modems;
- módulos LoRa;
- Arduino <-> Raspberry Pi;
- debug.

Python com `pyserial`:

```bash
pip install pyserial
```

```python
import serial

ser = serial.Serial("/dev/ttyUSB0", baudrate=9600, timeout=1)
linha = ser.readline().decode(errors="ignore").strip()
print(linha)
```

---

## Leitura de Sensor com Tratamento

```python
from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class SensorReading:
    device_id: str
    metric: str
    value: float
    unit: str
    timestamp: datetime
    quality: str = "ok"


def validar_temperatura(valor: float) -> float:
    if valor < -40 or valor > 85:
        raise ValueError("temperatura fora do intervalo esperado")
    return valor
```

Leitura física precisa de validação. Sensor desconectado pode retornar valor absurdo.

---

## Alimentação

Cuidados:

- tensão correta: 3.3V vs 5V;
- corrente suficiente;
- fonte estável;
- aterramento comum;
- proteção contra inversão;
- bateria e consumo;
- ruído de motores/relés;
- isolamento para cargas AC.

Nunca ligue carga de alta tensão sem conhecimento elétrico adequado.

---

## Calibração

Sensores precisam de calibração quando precisão importa.

Exemplos:

- offset de temperatura;
- curva de sensor de gás;
- célula de carga;
- corrente;
- umidade do solo.

Armazene metadados:

```json
{
  "sensor_id": "temp-01",
  "calibration_offset": -0.4,
  "calibrated_at": "2026-05-16"
}
```

---

## Erros Comuns

- ligar sensor 5V em pino 3.3V sem conversor;
- alimentar motor direto do GPIO;
- não usar resistor em LED;
- ignorar debounce;
- não validar leituras;
- usar cabos longos em I2C;
- não compartilhar GND entre módulos;
- esquecer consumo de energia;
- tratar sensor barato como instrumento preciso;
- não documentar pinagem.

---

## Checklist

- A tensão do sensor é compatível?
- GPIO controla apenas sinais seguros?
- Atuadores usam driver adequado?
- Pinagem está documentada?
- Leituras têm validação?
- Sensor precisa de calibração?
- Comunicação I2C/SPI/UART foi testada isoladamente?
- Fonte suporta corrente máxima?
- Há proteção para cargas perigosas?

Hardware confiável nasce de testes simples e documentação rigorosa. Antes de integrar com nuvem, prove que sensor, alimentação e comunicação local funcionam bem.

