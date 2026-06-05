# Sockets em Python: TCP, Servidores, Clientes e Concorrência

Socket é uma interface de programação para comunicação de rede. Em Python, o módulo `socket` permite criar clientes e servidores TCP/UDP diretamente.

Sockets são base para entender protocolos. HTTP, FTP, MQTT e muitos outros usam sockets por baixo.

---

## Cliente TCP Simples

```python
import socket


HOST = "example.com"
PORT = 80

with socket.create_connection((HOST, PORT), timeout=10) as sock:
    request = b"GET / HTTP/1.1\r\nHost: example.com\r\nConnection: close\r\n\r\n"
    sock.sendall(request)
    response = sock.recv(4096)
    print(response.decode("utf-8", errors="replace"))
```

Esse exemplo envia HTTP manualmente via TCP.

---

## Servidor TCP Simples

```python
import socket


HOST = "0.0.0.0"
PORT = 9000

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server:
    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server.bind((HOST, PORT))
    server.listen()
    print(f"Escutando em {HOST}:{PORT}")

    conn, addr = server.accept()
    with conn:
        print("Conectado por", addr)
        data = conn.recv(1024)
        conn.sendall(b"Recebido: " + data)
```

Teste:

```bash
nc localhost 9000
```

---

## TCP é Stream, Não Mensagem

`recv(1024)` não garante receber uma mensagem completa. TCP entrega bytes em fluxo.

Problema:

```python
data = sock.recv(1024)
```

Pode vir:

- metade da mensagem;
- várias mensagens juntas;
- nada temporariamente.

Você precisa definir framing.

---

## Framing por Quebra de Linha

```python
def enviar_linha(sock: socket.socket, texto: str) -> None:
    sock.sendall((texto + "\n").encode())


def receber_linha(sock: socket.socket) -> str:
    chunks = []
    while True:
        chunk = sock.recv(1)
        if not chunk:
            raise ConnectionError("Conexão fechada")
        if chunk == b"\n":
            return b"".join(chunks).decode()
        chunks.append(chunk)
```

Simples para protocolos textuais.

---

## Framing por Tamanho

```python
import struct


def enviar_mensagem(sock: socket.socket, payload: bytes) -> None:
    header = struct.pack("!I", len(payload))
    sock.sendall(header + payload)


def receber_exato(sock: socket.socket, total: int) -> bytes:
    chunks = []
    recebido = 0
    while recebido < total:
        chunk = sock.recv(total - recebido)
        if not chunk:
            raise ConnectionError("Conexão fechada")
        chunks.append(chunk)
        recebido += len(chunk)
    return b"".join(chunks)


def receber_mensagem(sock: socket.socket) -> bytes:
    header = receber_exato(sock, 4)
    tamanho = struct.unpack("!I", header)[0]
    return receber_exato(sock, tamanho)
```

Esse padrão é comum em protocolos binários.

---

## Servidor Concorrente com Threads

```python
import socket
from threading import Thread


def handle_client(conn: socket.socket, addr) -> None:
    with conn:
        while data := conn.recv(1024):
            conn.sendall(b"echo: " + data)


def main() -> None:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server:
        server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        server.bind(("0.0.0.0", 9000))
        server.listen()

        while True:
            conn, addr = server.accept()
            Thread(target=handle_client, args=(conn, addr), daemon=True).start()


if __name__ == "__main__":
    main()
```

Threads são simples, mas não escalam indefinidamente.

---

## Sockets com asyncio

```python
import asyncio


async def handle(reader: asyncio.StreamReader, writer: asyncio.StreamWriter):
    addr = writer.get_extra_info("peername")
    print("Conectado", addr)

    while data := await reader.readline():
        writer.write(b"echo: " + data)
        await writer.drain()

    writer.close()
    await writer.wait_closed()


async def main():
    server = await asyncio.start_server(handle, "0.0.0.0", 9000)
    async with server:
        await server.serve_forever()


asyncio.run(main())
```

Boa opção para muitas conexões I/O-bound.

---

## Timeouts

```python
sock = socket.create_connection(("example.com", 80), timeout=5)
sock.settimeout(10)
```

Timeouts evitam travamentos.

---

## TLS com Sockets

```python
import socket
import ssl


context = ssl.create_default_context()

with socket.create_connection(("example.com", 443), timeout=10) as raw_sock:
    with context.wrap_socket(raw_sock, server_hostname="example.com") as sock:
        sock.sendall(b"GET / HTTP/1.1\r\nHost: example.com\r\nConnection: close\r\n\r\n")
        print(sock.recv(4096))
```

Use `create_default_context` para validação adequada.

---

## Checklist Sockets

- protocolo define framing?
- `sendall` é usado para enviar tudo?
- `recv` trata conexão fechada?
- timeouts estão configurados?
- servidor trata múltiplos clientes?
- erros são logados?
- TLS é usado quando há dados sensíveis?
- recursos são fechados com context manager?

