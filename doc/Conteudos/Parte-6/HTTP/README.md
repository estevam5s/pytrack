# Redes e Protocolos com Python

Trilha completa e progressiva sobre redes e protocolos para Python: TCP/IP, sockets, HTTP/HTTPS, FTP, UDP e MQTT com IoT e Arduino.

O objetivo é sair dos conceitos fundamentais de rede até aplicações reais: clientes e servidores socket, APIs HTTP seguras, transferência de arquivos, comunicação UDP, mensageria MQTT, telemetria IoT, integração com Arduino/ESP32 e operação profissional.

---

## Arquivos da Trilha

1. [TCP/IP: Fundamentos de Redes, Portas, DNS e Pacotes](./01_tcp_ip_fundamentos.md)
2. [Sockets em Python: TCP, Servidores, Clientes e Concorrência](./02_sockets_python.md)
3. [HTTP/HTTPS: Protocolo Web, APIs, TLS e Clientes Python](./03_http_https.md)
4. [FTP e SFTP: Transferência de Arquivos com Python](./04_ftp_sftp.md)
5. [UDP: Datagramas, Baixa Latência, Broadcast e Protocolos Simples](./05_udp.md)
6. [MQTT, IoT e Arduino: Telemetria, Controle e Automação](./06_mqtt_iot_arduino.md)

---

## Competências Esperadas

Ao concluir esta trilha, você deve saber:

- explicar TCP/IP, portas, DNS, sockets e protocolos de transporte;
- criar clientes e servidores TCP com Python;
- usar timeouts, buffers, framing e concorrência;
- consumir e expor serviços HTTP/HTTPS com segurança;
- transferir arquivos com FTP/SFTP;
- usar UDP para datagramas, broadcast e cenários de baixa latência;
- projetar tópicos MQTT e QoS;
- integrar Python com brokers MQTT;
- conectar ESP32/Arduino a MQTT;
- desenhar arquitetura IoT com telemetria, comandos, retenção, segurança e observabilidade.

---

## Ferramentas Úteis

```bash
ping example.com
traceroute example.com
nslookup example.com
dig example.com
curl -v https://example.com
nc -vz localhost 8000
ss -tulpn
```

Bibliotecas Python comuns:

```bash
pip install requests httpx aiohttp paho-mqtt paramiko
```

Para MQTT local:

```bash
docker run --rm -p 1883:1883 eclipse-mosquitto
```

