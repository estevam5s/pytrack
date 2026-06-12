# Python em microcontroladores

MicroPython roda em ESP32/Raspberry Pi Pico.

## Pontos-chave

- GPIO: ler sensores e acionar atuadores
- PWM, ADC e I2C/SPI
- Wi-Fi e requisições
- Publicar via MQTT

## Exemplo

```python
from machine import Pin
import time
led = Pin(2, Pin.OUT)
while True:
    led.value(not led.value())
    time.sleep(1)
```

## Boas práticas

- Cuide do consumo de energia
- Trate reconexões de rede

## Saiba mais

- [Documentação oficial](https://docs.micropython.org/)
