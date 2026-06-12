# Fundamentos de Sistemas Embarcados

Sistema embarcado e um sistema computacional dedicado a uma funcao especifica dentro de um produto, maquina, equipamento ou ambiente. Ele normalmente interage com sensores, atuadores, comunicacao e restricoes fisicas.

---

## Exemplos

- controle de temperatura;
- rastreador GPS;
- medidor de energia;
- sensor industrial;
- dispositivo medico;
- automacao residencial;
- drone;
- controle automotivo;
- gateway IoT;
- camera inteligente;
- maquina de pagamento;
- equipamento agricola.

---

## Caracteristicas

Sistemas embarcados costumam ter:

- funcao especifica;
- hardware limitado;
- memoria limitada;
- consumo de energia relevante;
- necessidade de confiabilidade;
- interacao com mundo fisico;
- restricoes de tempo;
- operacao continua;
- comunicacao com outros sistemas;
- tolerancia a falhas.

---

## Microcontrolador, Microprocessador e SBC

Microcontrolador:

- CPU, memoria e perifericos no mesmo chip;
- baixo consumo;
- executa firmware;
- exemplos: ESP32, RP2040, STM32, AVR.

Microprocessador:

- CPU principal, depende de memoria e perifericos externos;
- roda sistemas mais complexos;
- comum em Linux embarcado.

SBC, ou single-board computer:

- computador completo em uma placa;
- roda Linux;
- exemplo: Raspberry Pi, BeagleBone, Orange Pi.

---

## Onde Python Entra

Python pode ser usado em:

- prototipagem;
- firmware com MicroPython;
- firmware educacional com CircuitPython;
- gateways com Linux;
- automacao de testes;
- coleta e envio de dados;
- dashboards locais;
- interfaces de configuracao;
- scripts de producao;
- ferramentas de diagnostico.

Python pode nao ser adequado quando:

- tempo real estrito e exigido;
- memoria e extremamente limitada;
- latencia precisa ser deterministica;
- consumo de energia precisa ser minimo;
- certificacao exige controle fino;
- driver de baixo nivel precisa de C.

---

## Firmware, Software e Hardware

Firmware e o software que roda diretamente no dispositivo embarcado. Ele inicializa hardware, configura perifericos, le sensores, controla atuadores e se comunica com outros sistemas.

Camadas comuns:

```text
hardware -> drivers -> servicos -> regras -> comunicacao -> monitoramento
```

Separar camadas ajuda a testar e manter.

---

## Loop Principal

Muitos sistemas embarcados seguem um loop:

```python
while True:
    ler_sensores()
    processar_estado()
    controlar_atuadores()
    comunicar()
    aguardar()
```

Esse padrao simples precisa lidar com erros, temporizacao, watchdog e consumo.

---

## Estado do Sistema

Modelar estado evita codigo confuso.

```python
estado = {
    "temperatura": None,
    "alarme": False,
    "conectado": False,
    "ultimo_envio": 0,
}
```

Em projetos maiores, use classes, dataclasses ou maquinas de estado.

---

## Maquina de Estados

```text
INICIALIZANDO -> NORMAL -> ALERTA -> FALHA -> RECUPERACAO
```

Maquinas de estado deixam transicoes explicitas.

```python
estado = "NORMAL"

if estado == "NORMAL" and temperatura > limite:
    estado = "ALERTA"
elif estado == "ALERTA" and temperatura <= limite:
    estado = "NORMAL"
```

---

## Requisitos Nao Funcionais

Em embarcados, requisitos nao funcionais sao centrais:

- tempo de resposta;
- autonomia de bateria;
- temperatura de operacao;
- resistencia a falhas;
- tempo de boot;
- vida util;
- seguranca;
- custo;
- atualizacao;
- diagnostico.

---

## Checklist de Projeto

- Qual problema fisico o dispositivo resolve?
- Quais entradas e saidas existem?
- Qual placa sera usada?
- Quais sensores e atuadores?
- Qual frequencia de leitura?
- Ha tempo real?
- Ha bateria?
- Precisa de rede?
- O que acontece se a rede falhar?
- Como atualizar firmware?
- Como diagnosticar em campo?

---

## Exercicios

1. Descreva tres sistemas embarcados do cotidiano.
2. Compare microcontrolador e Raspberry Pi.
3. Defina entradas, saidas e estados de um termostato.
4. Crie uma maquina de estados simples para alarme.
5. Liste restricoes de energia e tempo de um sensor remoto.
