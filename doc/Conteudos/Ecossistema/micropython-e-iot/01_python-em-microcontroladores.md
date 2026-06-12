# Python em microcontroladores

MicroPython roda em ESP32/Raspberry Pi Pico.

> **Tema:** Embarcados · **Nível:** avancado · **Trilha:** MicroPython e IoT

## Conceitos-chave

Nesta lição você vai entender:

- **GPIO: ler sensores e acionar atuadores**
- **PWM, ADC e I2C/SPI**
- **Wi-Fi e requisições**
- **Publicar via MQTT**

## Exemplo prático

```python
from machine import Pin
import time
led = Pin(2, Pin.OUT)
while True:
    led.value(not led.value())
    time.sleep(1)
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Cuide do consumo de energia
- Trate reconexões de rede

## Pratique

Para fixar, escreva um pequeno script que combine **gpio: ler sensores e acionar atuadores** e **pwm, adc e i2c/spi** em um caso do seu dia a dia. Depois refatore aplicando "Cuide do consumo de energia".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: GPIO: ler sensores e acionar atuadores
- [ ] Explicar e aplicar: PWM, ADC e I2C/SPI
- [ ] Explicar e aplicar: Wi-Fi e requisições
- [ ] Explicar e aplicar: Publicar via MQTT

## Saiba mais

- [Documentação oficial](https://docs.micropython.org/)
