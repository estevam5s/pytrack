# MicroPython, CircuitPython e Placas

MicroPython e CircuitPython permitem rodar Python em microcontroladores. Eles nao sao CPython completo: possuem bibliotecas, desempenho e memoria limitados, mas sao excelentes para prototipagem, educacao, IoT e muitos produtos simples.

---

## MicroPython

MicroPython e uma implementacao enxuta de Python para microcontroladores.

Características:

- REPL interativo;
- suporte a ESP32, RP2040, STM32 e outras placas;
- acesso a GPIO, I2C, SPI, UART, PWM, ADC;
- bom para IoT e firmware leve;
- permite `boot.py` e `main.py`.

---

## CircuitPython

CircuitPython e derivado do MicroPython, com foco em educacao e facilidade.

Características:

- dispositivo aparece como unidade USB;
- arquivo `code.py` executa automaticamente;
- muitas bibliotecas Adafruit;
- otimo para sensores, displays e prototipos.

---

## MicroPython versus CircuitPython

| Criterio | MicroPython | CircuitPython |
|---|---|---|
| Foco | flexibilidade e placas diversas | facilidade e educacao |
| Arquivo principal | `main.py` | `code.py` |
| Ecossistema | amplo em IoT | forte em bibliotecas Adafruit |
| USB drive | depende da placa/porta | comum |
| Controle fino | maior | menor |

---

## Placas Comuns

- ESP32: Wi-Fi, Bluetooth, bom custo.
- ESP8266: Wi-Fi simples, memoria menor.
- Raspberry Pi Pico: RP2040, baixo custo, sem Wi-Fi na versao original.
- Pico W: RP2040 com Wi-Fi.
- PyBoard: placa historica do MicroPython.
- Feather/Metro Adafruit: muito usadas com CircuitPython.

---

## Instalação Conceitual

Fluxo comum:

1. baixar firmware adequado;
2. colocar placa em modo bootloader;
3. gravar firmware;
4. conectar via serial/USB;
5. testar REPL;
6. enviar arquivos;
7. executar `main.py` ou `code.py`.

Ferramentas:

```bash
pip install mpremote esptool
```

---

## Primeiro Programa MicroPython

```python
from machine import Pin
from time import sleep

led = Pin(2, Pin.OUT)

while True:
    led.value(1)
    sleep(0.5)
    led.value(0)
    sleep(0.5)
```

O pino do LED varia conforme a placa.

---

## Estrutura de Firmware

```text
boot.py
main.py
config.py
drivers/
  sensor.py
lib/
```

`boot.py`: inicializacao basica.

`main.py`: loop principal.

`drivers/`: acesso a sensores e atuadores.

---

## Limitacoes

- menos memoria que computador;
- algumas bibliotecas Python nao existem;
- garbage collector pode afetar tempo;
- desempenho menor que C;
- cuidado com alocacao em loops criticos;
- sistema de arquivos pode corromper se energia cair durante escrita.

---

## Boas Praticas

- Teste componentes isoladamente.
- Evite grandes dependencias.
- Use constantes para pinos.
- Trate reconexao de Wi-Fi.
- Use watchdog em dispositivos remotos.
- Minimize escrita em flash.
- Documente versao do firmware.

---

## Exercicios

1. Compare MicroPython e CircuitPython.
2. Escreva um blink para sua placa.
3. Organize um firmware com `main.py` e `drivers/`.
4. Liste bibliotecas que nao existem em MicroPython.
5. Explique por que memoria e flash importam.
