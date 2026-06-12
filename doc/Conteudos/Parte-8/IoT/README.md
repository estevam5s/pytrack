# IoT com Python: Dispositivos, Protocolos, Dados e Produção

Trilha completa e progressiva sobre Internet das Coisas com Python: fundamentos, sensores, atuadores, microcontroladores, Raspberry Pi, MicroPython, MQTT, HTTP, gateways, APIs, bancos de dados, observabilidade, segurança, operação e projetos práticos.

O objetivo é sair do entendimento básico de dispositivos conectados até uma arquitetura IoT profissional: coleta confiável, comunicação eficiente, backend em Python, ingestão de telemetria, comandos remotos, atualização de firmware, segurança, monitoramento e operação em escala.

---

## Categorias

### 1. Fundamentos

1. [Fundamentos de IoT: Arquitetura, Dispositivos, Telemetria e Edge](./01_fundamentos_iot.md)

### 2. Hardware e Sensores

2. [Hardware IoT: Sensores, Atuadores, GPIO, I2C, SPI e UART](./02_hardware_sensores.md)

### 3. Protocolos e Comunicação

3. [Protocolos IoT: MQTT, HTTP, WebSocket, CoAP e Redes](./03_protocolos_iot.md)

### 4. Python Embarcado

4. [Python em Dispositivos: Raspberry Pi, MicroPython e CircuitPython](./04_python_embarcado.md)

### 5. Gateways e Backends

5. [Gateways e Backends IoT com Python: FastAPI, MQTT e Filas](./05_gateways_backends.md)

### 6. Dados e Observabilidade

6. [Dados IoT: Séries Temporais, Dashboards, Alertas e Observabilidade](./06_dados_observabilidade.md)

### 7. Segurança e Operação

7. [Segurança e Operação IoT: Identidade, TLS, OTA e Escala](./07_seguranca_operacao.md)

### 8. Projetos Práticos

8. [Projetos IoT com Python: Estação Ambiental, Automação e Telemetria](./08_projetos_praticos.md)

---

## Competências Esperadas

Ao concluir esta trilha, você deve saber:

- explicar uma arquitetura IoT completa, do sensor ao dashboard;
- diferenciar dispositivo, gateway, edge, broker, backend e plataforma;
- ler sensores e controlar atuadores com Python;
- escolher entre Raspberry Pi, ESP32, Arduino, MicroPython e Linux embarcado;
- usar GPIO, I2C, SPI, UART, ADC e PWM;
- publicar telemetria com MQTT;
- criar APIs e gateways IoT com FastAPI;
- processar dados de dispositivos com filas e workers;
- armazenar medições em bancos relacionais e séries temporais;
- criar dashboards, alertas e logs para operação;
- aplicar segurança com identidade por dispositivo, TLS, secrets e provisionamento;
- projetar comandos remotos, heartbeats, offline buffering e OTA;
- construir projetos IoT com qualidade de engenharia.

---

## Arquitetura de Referência

```text
Sensor/Atuador
  -> Dispositivo IoT com Python/MicroPython
  -> MQTT/HTTP
  -> Gateway/Broker
  -> Backend Python
  -> Banco de dados / Séries temporais
  -> Dashboard / Alertas / Comandos
```

---

## Regra Principal

IoT não é apenas ligar sensor na internet. Um sistema IoT profissional precisa lidar com rede instável, dispositivos limitados, segurança física, energia, atualização remota, telemetria confiável, observabilidade e operação de muitos equipamentos ao longo do tempo.

