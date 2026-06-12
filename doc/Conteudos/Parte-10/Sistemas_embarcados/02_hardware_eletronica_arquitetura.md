# Hardware, Eletronica Basica e Arquitetura

Python pode controlar hardware, mas o desenvolvedor precisa entender conceitos eletricos basicos para evitar leituras erradas, instabilidade e danos aos componentes.

---

## Tensao, Corrente e Resistencia

Tensao, medida em volts, e diferenca de potencial.

Corrente, medida em amperes, e fluxo de carga.

Resistencia, medida em ohms, limita corrente.

Lei de Ohm:

```text
V = R * I
```

```python
def corrente(tensao, resistencia):
    return tensao / resistencia

print(corrente(3.3, 330))
```

---

## Potencia

```text
P = V * I
```

Componentes aquecem quando dissipam potencia. Sempre verifique limites.

```python
def potencia(tensao, corrente):
    return tensao * corrente
```

---

## Niveis Logicos

Placas podem operar em:

- 3.3 V;
- 5 V;
- 1.8 V;
- outros niveis.

Conectar sinal de 5 V em GPIO que aceita apenas 3.3 V pode danificar a placa.

Use conversor de nivel quando necessario.

---

## Pull-up e Pull-down

Entradas digitais nao devem ficar flutuando.

Pull-up mantem entrada em nivel alto quando o botao esta aberto.

Pull-down mantem entrada em nivel baixo.

Muitas placas possuem resistores internos configuraveis.

---

## Debounce

Botoes mecanicos geram ruido ao mudar de estado. Debounce evita multiplas leituras falsas.

```python
import time

ultimo_estado = 0
ultima_mudanca = 0
debounce_ms = 50

def botao_estavel(leitura):
    global ultimo_estado, ultima_mudanca
    agora = time.ticks_ms()
    if leitura != ultimo_estado and time.ticks_diff(agora, ultima_mudanca) > debounce_ms:
        ultimo_estado = leitura
        ultima_mudanca = agora
    return ultimo_estado
```

---

## Alimentacao

Cuidados:

- tensao correta;
- corrente suficiente;
- regulador adequado;
- ruído eletrico;
- aterramento;
- protecao contra inversao;
- bateria e carregamento;
- consumo em sleep.

Muitos bugs embarcados sao problemas de alimentacao, nao de software.

---

## Arquitetura de Hardware

Componentes comuns:

- MCU ou SBC;
- sensores;
- atuadores;
- fonte;
- conversores de nivel;
- comunicacao;
- armazenamento;
- interface de usuario;
- protecoes.

---

## Arquitetura de Software Embarcado

```text
drivers/
  sensor_temperatura.py
services/
  controle_temperatura.py
communication/
  mqtt_client.py
main.py
config.py
```

Separe:

- acesso ao hardware;
- regra de negocio;
- comunicacao;
- configuracao;
- diagnostico.

---

## Boas Praticas

- Documente pinagem.
- Nunca assuma que todo GPIO suporta qualquer funcao.
- Use resistor em LED.
- Verifique tensao dos sensores.
- Proteja entradas externas.
- Separe GND comum quando necessario.
- Meça com multimetro.
- Leia datasheets.

---

## Exercicios

1. Calcule corrente em um resistor de 330 ohms com 3.3 V.
2. Explique por que entrada digital flutuante e problema.
3. Desenhe uma ligacao de botao com pull-up.
4. Liste riscos de alimentar rele direto pelo GPIO.
5. Crie um documento de pinagem para um projeto ficticio.
