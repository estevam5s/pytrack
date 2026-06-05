# Fundamentos de IoT: Arquitetura, Dispositivos, Telemetria e Edge

IoT, Internet of Things, é a conexão de dispositivos físicos a sistemas digitais. Esses dispositivos coletam dados do mundo real, enviam telemetria, recebem comandos e interagem com sensores, atuadores, máquinas, ambientes e pessoas.

Python é muito útil em IoT porque pode rodar em gateways, Raspberry Pi, servidores, pipelines de dados, dashboards, automações e, em versões como MicroPython/CircuitPython, também em microcontroladores.

---

## O que é um Sistema IoT

Um sistema IoT completo normalmente envolve:

- **sensor**: mede temperatura, umidade, presença, corrente, pressão etc.;
- **atuador**: liga relé, motor, LED, válvula, sirene etc.;
- **dispositivo**: hardware que lê sensores e controla atuadores;
- **firmware/software embarcado**: código que roda no dispositivo;
- **rede**: Wi-Fi, Ethernet, LoRa, BLE, 4G/5G, Zigbee etc.;
- **gateway**: ponte local entre dispositivos e backend;
- **broker/protocolo**: MQTT, HTTP, CoAP, WebSocket;
- **backend**: recebe, valida, armazena e processa dados;
- **banco**: histórico, estado atual, eventos e séries temporais;
- **dashboard**: visualização e operação;
- **alertas**: ações quando algo sai do normal;
- **comandos**: controle remoto de dispositivos.

---

## Arquitetura Básica

```text
Sensor -> Dispositivo -> MQTT Broker -> Backend Python -> Banco -> Dashboard
                         ^                                  |
                         |                                  v
                      Comandos <---------------------- API/Operador
```

Exemplo:

```text
DHT22 mede temperatura
ESP32 publica em MQTT
Mosquitto recebe mensagem
FastAPI processa telemetria
PostgreSQL/InfluxDB armazena
Grafana mostra dashboard
```

---

## Telemetria

Telemetria é dado enviado pelo dispositivo.

Exemplos:

```json
{
  "device_id": "estufa-001",
  "timestamp": "2026-05-16T22:00:00Z",
  "temperature_c": 27.4,
  "humidity_pct": 61.2,
  "battery_pct": 88,
  "rssi": -58
}
```

Boas práticas:

- incluir `device_id`;
- incluir timestamp quando possível;
- incluir versão de firmware;
- incluir qualidade da leitura;
- validar unidade de medida;
- evitar payload grande sem necessidade;
- tratar leitura ausente ou inválida.

---

## Estado vs Evento

**Estado** é a condição atual:

```json
{
  "device_id": "lampada-01",
  "power": "on",
  "brightness": 80
}
```

**Evento** é algo que aconteceu:

```json
{
  "device_id": "porta-01",
  "event": "door_opened",
  "timestamp": "2026-05-16T22:03:00Z"
}
```

Sistemas IoT costumam usar ambos: estado atual para controle e eventos/telemetria para histórico.

---

## Comandos

Comando é uma instrução enviada ao dispositivo.

Exemplo:

```json
{
  "command_id": "cmd-123",
  "device_id": "rele-001",
  "action": "set_relay",
  "payload": {"channel": 1, "state": "on"}
}
```

Comandos devem ter:

- ID único;
- validade/expiração;
- autenticação;
- autorização;
- confirmação de recebimento;
- resposta de sucesso/falha;
- idempotência quando possível.

---

## Edge Computing

Edge computing é processar dados perto do dispositivo.

Exemplos:

- filtrar ruído antes de enviar;
- detectar anomalia localmente;
- manter operação se internet cair;
- controlar motor em tempo real;
- agregar leituras por minuto;
- enviar apenas mudanças relevantes.

Use edge quando:

- latência importa;
- conexão é instável;
- custo de dados é alto;
- privacidade exige processamento local;
- volume bruto é grande demais.

---

## Dispositivo vs Gateway

Dispositivo:

```text
sensor + microcontrolador + firmware
```

Gateway:

```text
computador local que agrega, traduz, filtra e encaminha dados
```

Exemplo:

```text
Sensores BLE -> Raspberry Pi Gateway -> MQTT -> Cloud
```

Gateway é útil quando dispositivos são limitados ou usam protocolos locais.

---

## Ciclo de Vida do Dispositivo

Um dispositivo IoT profissional passa por:

1. fabricação;
2. provisionamento;
3. instalação;
4. autenticação;
5. operação;
6. atualização;
7. monitoramento;
8. manutenção;
9. substituição;
10. desativação segura.

Não pense só no protótipo. Pense em 100, 1.000 ou 100.000 dispositivos.

---

## Restrições Típicas

Dispositivos IoT podem ter:

- pouca memória;
- CPU limitada;
- bateria;
- rede instável;
- relógio impreciso;
- armazenamento pequeno;
- ambiente físico agressivo;
- risco de acesso físico por atacante;
- dificuldade de manutenção presencial.

Essas restrições mudam decisões de arquitetura.

---

## Protocolos Comuns

- **MQTT**: leve, pub/sub, muito usado em IoT.
- **HTTP**: simples, universal, mais verboso.
- **CoAP**: leve, comum em ambientes restritos.
- **WebSocket**: comunicação bidirecional persistente.
- **BLE**: curto alcance e baixo consumo.
- **LoRaWAN**: longo alcance e baixo consumo, baixa taxa de dados.
- **Zigbee/Thread**: redes locais mesh.

MQTT costuma ser o primeiro protocolo a dominar em IoT com backend Python.

---

## Quando Python Entra

Python pode rodar em:

- Raspberry Pi;
- gateways Linux;
- servidores backend;
- workers de processamento;
- dashboards;
- scripts de provisionamento;
- testes de hardware;
- MicroPython em ESP32/RP2040;
- CircuitPython em placas educacionais/prototipagem.

Python normalmente não é usado para firmware de tempo real crítico. Para isso, C/C++/Rust podem ser mais adequados.

---

## Erros Comuns

- enviar telemetria sem `device_id`;
- confiar em rede sempre disponível;
- não versionar payload;
- não autenticar dispositivo;
- usar HTTP polling excessivo;
- não pensar em atualização remota;
- não registrar última comunicação;
- não separar comando de telemetria;
- armazenar tudo sem política de retenção;
- construir protótipo impossível de operar em escala.

---

## Checklist

- A arquitetura separa dispositivo, gateway, broker e backend?
- Payload tem schema e versão?
- Dispositivo consegue operar offline?
- Comandos têm confirmação?
- Existe identidade por dispositivo?
- Existe plano de atualização?
- Telemetria tem timestamp e unidade?
- Backend valida dados recebidos?
- Há dashboard de saúde dos dispositivos?

IoT profissional começa quando o sistema é projetado para falhas reais: rede cai, sensor falha, bateria acaba, dispositivo reinicia e operadores precisam diagnosticar sem estar fisicamente no local.

