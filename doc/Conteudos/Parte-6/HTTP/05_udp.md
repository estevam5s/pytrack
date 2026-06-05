# UDP: Datagramas, Baixa Latência, Broadcast e Protocolos Simples

UDP é um protocolo de transporte sem conexão. Ele envia datagramas independentes, com baixa sobrecarga, mas sem garantir entrega, ordem ou ausência de duplicidade.

Use UDP quando baixa latência importa mais que confiabilidade total ou quando a aplicação implementa sua própria lógica de tolerância.

---

## Cliente UDP

```python
import socket


with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as sock:
    sock.sendto(b"ping", ("127.0.0.1", 9999))
```

---

## Servidor UDP

```python
import socket


with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as sock:
    sock.bind(("0.0.0.0", 9999))
    print("UDP escutando em 9999")

    while True:
        data, addr = sock.recvfrom(1024)
        print("Recebido", data, "de", addr)
        sock.sendto(b"pong", addr)
```

---

## Timeout

```python
with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as sock:
    sock.settimeout(2)
    sock.sendto(b"ping", ("127.0.0.1", 9999))
    try:
        data, addr = sock.recvfrom(1024)
    except TimeoutError:
        print("Sem resposta")
```

---

## Perda e Ordem

UDP pode:

- perder pacote;
- entregar fora de ordem;
- duplicar;
- truncar se buffer for pequeno.

Se importa, inclua:

- número de sequência;
- timestamp;
- checksum de aplicação;
- confirmação;
- retry;
- janela de recepção.

---

## Mensagem com Sequência

```python
import json
import time


def criar_pacote(seq: int, payload: dict) -> bytes:
    return json.dumps({
        "seq": seq,
        "ts": time.time(),
        "payload": payload,
    }).encode()
```

---

## Broadcast

```python
import socket


with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as sock:
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
    sock.sendto(b"descoberta", ("255.255.255.255", 9999))
```

Útil para descoberta local, mas pode ser bloqueado por redes.

---

## Multicast

Multicast envia para grupo.

```python
import socket
import struct


MCAST_GRP = "224.1.1.1"
PORT = 5007

sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
sock.bind(("", PORT))

group = socket.inet_aton(MCAST_GRP)
mreq = struct.pack("4sL", group, socket.INADDR_ANY)
sock.setsockopt(socket.IPPROTO_IP, socket.IP_ADD_MEMBERSHIP, mreq)
```

Multicast depende de suporte da rede.

---

## Casos de Uso

- telemetria tolerante à perda;
- descoberta de dispositivos;
- jogos;
- DNS;
- métricas locais;
- streaming;
- sensores em rede local.

Para IoT confiável via internet, MQTT sobre TCP geralmente é mais adequado.

---

## Checklist UDP

- perda de pacote é aceitável?
- ordem importa?
- mensagem cabe em um datagrama?
- timeout está definido?
- há sequência/timestamp se necessário?
- broadcast/multicast é permitido na rede?
- segurança foi considerada?
- TCP/MQTT resolveria melhor?

