# TCP/IP: Fundamentos de Redes, Portas, DNS e Pacotes

TCP/IP é a base da comunicação na internet. Antes de usar HTTP, MQTT, FTP ou sockets, é preciso entender endereços IP, portas, DNS, protocolos de transporte, conexões, pacotes, roteamento e firewalls.

Python permite trabalhar tanto em alto nível, com `requests`, quanto em baixo nível, com `socket`.

---

## Modelo em Camadas

Uma visão prática:

```text
Aplicação      HTTP, FTP, MQTT, DNS
Transporte     TCP, UDP
Internet       IP
Enlace         Ethernet, Wi-Fi
Física         cabos, rádio, fibra
```

Quando você acessa uma API:

```text
Python requests -> HTTPS -> TCP -> IP -> Wi-Fi/Ethernet
```

---

## IP

IP identifica hosts em uma rede.

IPv4:

```text
192.168.0.10
8.8.8.8
127.0.0.1
```

IPv6:

```text
2001:db8::1
::1
```

Endereços especiais:

- `127.0.0.1`: localhost;
- `0.0.0.0`: todas as interfaces ao escutar;
- `192.168.x.x`, `10.x.x.x`, `172.16-31.x.x`: redes privadas;
- `255.255.255.255`: broadcast IPv4 limitado.

---

## Portas

Porta identifica processo/serviço em um host.

Exemplos:

- `22`: SSH;
- `53`: DNS;
- `80`: HTTP;
- `443`: HTTPS;
- `1883`: MQTT;
- `8883`: MQTT sobre TLS;
- `5432`: PostgreSQL;
- `6379`: Redis.

Endpoint:

```text
host:porta
api.example.com:443
localhost:8000
```

---

## DNS

DNS resolve nomes para IPs.

```bash
nslookup example.com
dig example.com
```

Em Python:

```python
import socket


print(socket.gethostbyname("example.com"))
print(socket.getaddrinfo("example.com", 443))
```

Problemas de DNS são comuns em containers, VPNs, Kubernetes e redes corporativas.

---

## TCP

TCP é orientado à conexão.

Características:

- confiável;
- ordenado;
- controla retransmissão;
- controla fluxo;
- tem handshake;
- adequado para HTTP, SSH, FTP, MQTT.

Handshake simplificado:

```text
SYN -> SYN/ACK -> ACK
```

TCP entrega stream de bytes, não mensagens prontas. Você precisa definir framing no protocolo de aplicação.

---

## UDP

UDP envia datagramas sem conexão.

Características:

- baixa latência;
- sem garantia de entrega;
- sem garantia de ordem;
- sem retransmissão automática;
- suporta broadcast/multicast.

Usos:

- DNS;
- VoIP;
- jogos;
- telemetria simples;
- descoberta local;
- streaming em alguns cenários.

---

## Firewall e NAT

Firewall controla tráfego permitido.

NAT permite múltiplos dispositivos privados saírem para internet com um IP público.

Consequência prática:

- servidor precisa de porta aberta;
- cliente atrás de NAT normalmente consegue iniciar conexão para fora;
- conexões entrantes exigem port forwarding, VPN, túnel ou broker intermediário.

MQTT resolve bem IoT porque o dispositivo inicia conexão para o broker.

---

## Ferramentas de Diagnóstico

Ping:

```bash
ping 8.8.8.8
```

Rota:

```bash
traceroute example.com
```

Portas abertas:

```bash
nc -vz example.com 443
```

Sockets escutando:

```bash
ss -tulpn
```

HTTP detalhado:

```bash
curl -v https://example.com
```

---

## Timeouts

Toda chamada de rede precisa de timeout.

Errado:

```python
requests.get("https://api.example.com")
```

Certo:

```python
requests.get("https://api.example.com", timeout=10)
```

Sem timeout, uma aplicação pode travar indefinidamente.

---

## Latência, Throughput e Banda

- **Latência**: tempo de ida/volta.
- **Throughput**: volume útil transferido por tempo.
- **Banda**: capacidade teórica/contratada.
- **Jitter**: variação de latência.
- **Packet loss**: perda de pacotes.

Aplicações em tempo real sofrem mais com latência, jitter e perda.

---

## Checklist TCP/IP

- sei qual host e porta estou acessando?
- DNS resolve corretamente?
- porta está aberta?
- serviço escuta em `0.0.0.0` ou `127.0.0.1`?
- firewall permite tráfego?
- há timeout configurado?
- protocolo usa TCP ou UDP?
- logs mostram erro de conexão, DNS ou timeout?

