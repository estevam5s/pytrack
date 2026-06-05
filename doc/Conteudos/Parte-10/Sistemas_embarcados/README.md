# Sistemas Embarcados com Python

Trilha completa e profissional sobre sistemas embarcados usando Python, MicroPython, CircuitPython e Linux embarcado. O objetivo e conectar fundamentos de hardware, eletronica, firmware, comunicacao, sensores, atuadores, tempo real, IoT, seguranca, testes e deploy.

Python em sistemas embarcados aparece em dois contextos principais:

- microcontroladores com MicroPython ou CircuitPython;
- computadores embarcados com Linux, como Raspberry Pi, gateways industriais, edge devices e single-board computers.

O foco desta trilha e aprender quando Python e adequado, quando nao e, como lidar com limitacoes de memoria, energia e tempo, e como construir sistemas confiaveis que interagem com o mundo fisico.

---

## Arquivos da Trilha

1. [Fundamentos de Sistemas Embarcados](./01_fundamentos_sistemas_embarcados.md)
2. [Hardware, Eletronica Basica e Arquitetura](./02_hardware_eletronica_arquitetura.md)
3. [MicroPython, CircuitPython e Placas](./03_micropython_circuitpython_placas.md)
4. [GPIO, Sensores e Atuadores](./04_gpio_sensores_atuadores.md)
5. [Protocolos: UART, I2C, SPI, PWM, ADC e CAN](./05_protocolos_embarcados.md)
6. [Tempo Real, Concorrencia, Interrupcoes e Baixo Consumo](./06_tempo_real_concorrencia_baixo_consumo.md)
7. [IoT, Redes, MQTT, HTTP e Edge Computing](./07_iot_redes_mqtt_http_edge.md)
8. [Linux Embarcado com Python](./08_linux_embarcado_python.md)
9. [Seguranca, Confiabilidade e Operacao](./09_seguranca_confiabilidade_operacao.md)
10. [Testes, Debug, Simulacao e Qualidade](./10_testes_debug_qualidade_embarcados.md)
11. [Projetos Praticos de Sistemas Embarcados](./11_projetos_praticos_embarcados.md)

---

## Competencias Esperadas

Ao concluir esta trilha, voce deve saber:

- explicar o que e um sistema embarcado;
- diferenciar microcontrolador, microprocessador e computador embarcado;
- escolher entre Python, MicroPython, CircuitPython e C/C++;
- ler sinais digitais e analogicos;
- controlar LEDs, reles, motores, buzzers e displays;
- integrar sensores por GPIO, ADC, I2C, SPI e UART;
- usar PWM para controle de brilho, velocidade e servo;
- entender interrupcoes, timers, watchdog e restricoes de tempo real;
- comunicar dispositivos via MQTT, HTTP, TCP/UDP e serial;
- criar gateways IoT e pipelines edge;
- lidar com energia, memoria, falhas, reconexao e atualizacao;
- testar hardware e software de forma organizada;
- documentar pinagem, protocolos, riscos e procedimentos de operacao.

---

## Bibliotecas e Ferramentas

Em microcontroladores:

```text
MicroPython
CircuitPython
Thonny
mpremote
ampy
esptool
```

Em Linux embarcado:

```bash
pip install gpiozero lgpio adafruit-blinka paho-mqtt pyserial smbus2 spidev fastapi uvicorn
```

Use bibliotecas conforme a placa e o sistema operacional. Nem toda biblioteca funciona em todo hardware.

---

## Estrutura Recomendada de Projeto

```text
embarcado-python/
├── README.md
├── docs/
│   ├── pinagem.md
│   ├── protocolos.md
│   └── operacao.md
├── firmware/
│   ├── boot.py
│   ├── main.py
│   ├── drivers/
│   └── config.py
├── gateway/
│   ├── app/
│   └── tests/
├── scripts/
├── tests/
└── data/
```

---

## Regra Principal

Sistema embarcado profissional nao e apenas fazer um LED piscar. E construir um dispositivo que inicializa corretamente, mede ou atua com confiabilidade, se recupera de falhas, consome energia de forma adequada, comunica dados com seguranca e pode ser mantido em campo.
