# Projetos Praticos de Sistemas Embarcados com Python

Projetos praticos consolidam hardware, firmware, comunicacao, confiabilidade e operacao. Cada projeto deve ter README, pinagem, componentes, esquema de ligacao, codigo e criterios de teste.

---

## Projeto 1: Blink Profissional

Objetivo: piscar LED com estrutura organizada.

Requisitos:

- constantes de pino;
- funcao `setup`;
- loop principal;
- tratamento de erro;
- README com placa e pino;
- explicacao do resistor.

Evolucoes:

- alterar frequencia por botao;
- usar temporizacao nao bloqueante;
- registrar estado via serial.

---

## Projeto 2: Termometro IoT

Objetivo: ler temperatura e enviar para broker MQTT ou API HTTP.

Componentes:

- ESP32 ou Raspberry Pi Pico W;
- sensor DHT22, DS18B20 ou BME280;
- Wi-Fi;
- broker MQTT ou API.

Requisitos:

- reconexao;
- validacao de leitura;
- media movel;
- envio periodico;
- status de conexao;
- watchdog.

---

## Projeto 3: Controle de Rele com API Local

Objetivo: controlar rele por endpoint HTTP em Linux embarcado.

Componentes:

- Raspberry Pi;
- modulo rele;
- fonte externa;
- FastAPI ou Flask;
- GPIO.

Endpoints:

```text
GET /status
POST /rele/ligar
POST /rele/desligar
```

Cuidados:

- isolamento eletrico;
- permissao de GPIO;
- autenticacao;
- logs;
- estado inicial seguro.

---

## Projeto 4: Gateway Serial para MQTT

Objetivo: ler dados de um microcontrolador via UART e publicar em MQTT.

Arquitetura:

```text
sensor MCU -> UART -> Raspberry Pi -> MQTT -> dashboard
```

Requisitos:

- parse de mensagens;
- validacao;
- reconexao MQTT;
- buffer;
- logs;
- systemd.

---

## Projeto 5: Monitor de Energia

Objetivo: medir tensao/corrente e calcular potencia.

Conceitos:

- ADC;
- calibracao;
- media;
- RMS quando aplicavel;
- seguranca eletrica;
- envio de telemetria.

Cuidados: medicoes em rede eletrica podem ser perigosas. Use sensores isolados e modulos apropriados.

---

## Projeto 6: Data Logger Offline

Objetivo: coletar dados e salvar localmente quando nao ha rede.

Requisitos:

- timestamp;
- arquivo CSV ou JSON lines;
- rotacao de arquivo;
- protecao contra queda de energia;
- sincronizacao posterior;
- limite de armazenamento.

---

## Projeto 7: Mini Sistema de Alarme

Objetivo: detectar abertura, movimento ou temperatura alta.

Estados:

```text
DESARMADO -> ARMADO -> DISPARADO -> SILENCIADO
```

Requisitos:

- sensores digitais;
- buzzer;
- LED de status;
- debounce;
- maquina de estados;
- registro de eventos.

---

## Estrutura de Entrega

```text
projeto/
├── README.md
├── docs/
│   ├── pinagem.md
│   ├── componentes.md
│   └── operacao.md
├── src/
│   ├── main.py
│   ├── config.py
│   ├── drivers/
│   └── services/
└── tests/
```

---

## Checklist Final

- Pinagem documentada.
- Tensoes verificadas.
- Fonte dimensionada.
- Codigo separado por responsabilidade.
- Erros tratados.
- Reconexao testada.
- Watchdog avaliado.
- Logs disponiveis.
- Procedimento de atualizacao escrito.
- Teste de longa duracao planejado.

---

## Exercicios Finais

1. Escolha um projeto e escreva a lista de componentes.
2. Crie a documentacao de pinagem.
3. Implemente uma primeira versao do firmware.
4. Separe driver e regra de negocio.
5. Crie plano de teste em bancada e em campo.
