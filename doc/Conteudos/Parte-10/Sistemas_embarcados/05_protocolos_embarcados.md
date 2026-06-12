# Protocolos: UART, I2C, SPI, PWM, ADC e CAN

Protocolos embarcados permitem que microcontroladores conversem com sensores, atuadores, memorias, displays, modulos e outros controladores.

---

## UART

UART e comunicacao serial assíncrona ponto a ponto.

Usos:

- GPS;
- modems;
- debug serial;
- comunicacao entre placas;
- modulos Bluetooth.

```python
from machine import UART

uart = UART(1, baudrate=9600, tx=17, rx=16)
uart.write("ping\n")
dados = uart.read()
```

Parametros importantes:

- baudrate;
- bits;
- paridade;
- stop bits;
- TX/RX cruzados;
- GND comum.

---

## I2C

I2C usa duas linhas:

- SDA: dados;
- SCL: clock.

Permite varios dispositivos no mesmo barramento, cada um com endereco.

```python
from machine import Pin, I2C

i2c = I2C(0, scl=Pin(22), sda=Pin(21), freq=400000)
print(i2c.scan())
```

Cuidados:

- resistores pull-up;
- conflito de enderecos;
- comprimento de fio;
- frequencia;
- nivel logico.

---

## SPI

SPI e rapido e usa linhas como:

- SCK;
- MOSI;
- MISO;
- CS/SS.

```python
from machine import Pin, SPI

spi = SPI(1, baudrate=1_000_000, polarity=0, phase=0)
cs = Pin(5, Pin.OUT)

cs.value(0)
spi.write(b"\x9f")
cs.value(1)
```

Cada dispositivo normalmente tem um pino CS.

---

## PWM

PWM nao e protocolo de comunicacao, mas tecnica de controle.

Conceitos:

- frequencia;
- duty cycle;
- resolucao.

```text
duty 50% -> metade do tempo ligado
duty 10% -> pouco tempo ligado
```

---

## ADC

ADC mede tensao analogica.

Conceitos:

- resolucao em bits;
- referencia;
- faixa;
- amostragem;
- ruido;
- filtragem.

Conversao:

```python
def adc_para_tensao(valor, max_adc=4095, vref=3.3):
    return valor / max_adc * vref
```

---

## CAN

CAN e usado em automotivo e industrial.

Caracteristicas:

- robusto;
- multi-master;
- mensagens por ID;
- deteccao de erro;
- adequado a ambientes ruidosos.

Em Python, CAN aparece mais em Linux embarcado com interfaces SocketCAN e bibliotecas como `python-can`.

---

## Escolha de Protocolo

| Necessidade | Protocolo |
|---|---|
| sensor simples no mesmo barramento | I2C |
| alta velocidade local | SPI |
| modulo serial simples | UART |
| controle de brilho/motor | PWM |
| leitura analogica | ADC |
| automotivo/industrial robusto | CAN |

---

## Exercicios

1. Explique diferenca entre UART, I2C e SPI.
2. Escaneie dispositivos I2C.
3. Converta valor ADC para tensao.
4. Liste cuidados de ligacao SPI.
5. Pesquise onde CAN e usado.
