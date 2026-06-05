# GPIO, Sensores e Atuadores

GPIO significa General Purpose Input/Output. Sao pinos configuraveis para ler sinais digitais ou controlar saidas. Eles sao a porta de entrada para sensores simples e atuadores.

---

## Entrada Digital

Entrada digital le `0` ou `1`.

Exemplo MicroPython:

```python
from machine import Pin
from time import sleep

botao = Pin(14, Pin.IN, Pin.PULL_UP)

while True:
    pressionado = botao.value() == 0
    print(pressionado)
    sleep(0.1)
```

Com `PULL_UP`, o botao pressionado normalmente conecta ao GND.

---

## Saida Digital

```python
from machine import Pin

led = Pin(2, Pin.OUT)
led.value(1)
led.value(0)
```

GPIO nao deve alimentar cargas grandes diretamente. Para rele, motor, solenoide e lampada, use transistor, driver, modulo ou circuito adequado.

---

## Sensores

Tipos comuns:

- temperatura;
- umidade;
- luminosidade;
- pressao;
- acelerometro;
- giroscopio;
- proximidade;
- gas;
- corrente;
- tensao;
- GPS.

Sensores podem ser digitais ou analogicos.

---

## Atuadores

Atuadores executam acao fisica:

- LED;
- buzzer;
- rele;
- motor DC;
- servo;
- motor de passo;
- solenoide;
- display;
- valvula.

Atuadores geralmente exigem mais corrente que um GPIO suporta.

---

## PWM

PWM simula nivel analogico alternando rapido entre ligado e desligado.

Aplicacoes:

- brilho de LED;
- velocidade de motor;
- controle de servo;
- buzzer.

```python
from machine import Pin, PWM

led = PWM(Pin(2))
led.freq(1000)
led.duty(512)
```

APIs variam por porta MicroPython. Algumas usam `duty_u16`.

---

## ADC

ADC converte tensao analogica em valor digital.

```python
from machine import ADC, Pin
from time import sleep

adc = ADC(Pin(34))

while True:
    valor = adc.read()
    print(valor)
    sleep(0.5)
```

Cuidados:

- faixa de tensao;
- resolucao;
- ruido;
- calibracao;
- divisor resistivo;
- referencia analogica.

---

## Leitura com Media

```python
def ler_media(adc, amostras=10):
    total = 0
    for _ in range(amostras):
        total += adc.read()
    return total / amostras
```

Media reduz ruido, mas aumenta latencia.

---

## Driver Simples

```python
class Led:
    def __init__(self, pin):
        self.pin = pin

    def ligar(self):
        self.pin.value(1)

    def desligar(self):
        self.pin.value(0)
```

Drivers encapsulam detalhes de hardware.

---

## Boas Praticas

- Documente pinos.
- Separe drivers da regra de negocio.
- Valide tensao dos sensores.
- Use fonte adequada para atuadores.
- Use resistor em LED.
- Use diodo de flyback em cargas indutivas.
- Trate falhas de leitura.
- Calibre sensores.

---

## Exercicios

1. Leia um botao com pull-up.
2. Controle um LED com saida digital.
3. Controle brilho com PWM.
4. Leia um potenciometro com ADC.
5. Crie uma classe para um sensor ficticio.
