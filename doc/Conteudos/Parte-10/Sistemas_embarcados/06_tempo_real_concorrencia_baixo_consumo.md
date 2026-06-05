# Tempo Real, Concorrencia, Interrupcoes e Baixo Consumo

Sistemas embarcados frequentemente precisam reagir a eventos no tempo certo. Nem todo sistema embarcado e de tempo real, mas quase todo sistema embarcado precisa de temporizacao cuidadosa.

---

## Tempo Real

Sistema de tempo real e aquele em que atraso pode causar falha.

Tipos:

- hard real-time: perder prazo e inaceitavel;
- soft real-time: atraso degrada qualidade, mas nao necessariamente causa falha critica.

Python geralmente nao e adequado para hard real-time. Pode ser adequado para soft real-time, prototipagem e controle nao critico.

---

## Delay Bloqueante

```python
from time import sleep

while True:
    ler_sensor()
    sleep(5)
```

Durante `sleep`, outras tarefas podem ficar sem atendimento. Para sistemas simples, isso e aceitavel. Para varios eventos, use temporizacao nao bloqueante.

---

## Temporizacao Nao Bloqueante

```python
import time

ultimo = time.ticks_ms()
intervalo = 1000

while True:
    agora = time.ticks_ms()
    if time.ticks_diff(agora, ultimo) >= intervalo:
        ultimo = agora
        ler_sensor()

    verificar_botao()
```

---

## Interrupcoes

Interrupcoes reagem a eventos de hardware.

```python
from machine import Pin

def ao_pressionar(pin):
    print("botao")

botao = Pin(14, Pin.IN, Pin.PULL_UP)
botao.irq(trigger=Pin.IRQ_FALLING, handler=ao_pressionar)
```

Callbacks de interrupcao devem ser curtos. Evite alocar memoria, fazer rede ou executar logica pesada dentro da interrupcao.

---

## Timers

```python
from machine import Timer

def tarefa(timer):
    print("tick")

timer = Timer(0)
timer.init(period=1000, mode=Timer.PERIODIC, callback=tarefa)
```

Assim como interrupcoes, callbacks precisam ser leves.

---

## Concorrencia

Opcoes:

- loop cooperativo;
- timers;
- interrupcoes;
- `uasyncio` em MicroPython;
- threads em alguns ambientes;
- multiprocessing em Linux embarcado;
- filas externas.

---

## uasyncio

```python
import uasyncio as asyncio

async def piscar():
    while True:
        led.value(1)
        await asyncio.sleep(0.5)
        led.value(0)
        await asyncio.sleep(0.5)

asyncio.run(piscar())
```

Use quando ha multiplas tarefas I/O cooperativas.

---

## Watchdog

Watchdog reinicia o sistema se o firmware travar.

```python
from machine import WDT

wdt = WDT(timeout=5000)

while True:
    executar_ciclo()
    wdt.feed()
```

Alimente o watchdog apenas quando o ciclo principal realmente esta saudavel.

---

## Baixo Consumo

Tecnicas:

- deep sleep;
- reduzir frequencia de CPU;
- desligar perifericos;
- agrupar comunicacoes;
- reduzir brilho;
- escolher sensores de baixo consumo;
- acordar por timer ou interrupcao.

---

## Exercicios

1. Reescreva um loop com `sleep` para temporizacao nao bloqueante.
2. Crie interrupcao para botao.
3. Explique por que callback de interrupcao deve ser curto.
4. Simule watchdog em pseudocodigo.
5. Liste estrategias para sensor alimentado por bateria.
