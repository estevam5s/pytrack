# WebSockets: Tempo Real, Conexões Persistentes e Escala

WebSocket é um protocolo que mantém uma conexão persistente e bidirecional entre cliente e servidor. Diferente de HTTP tradicional, em que o cliente faz uma request e recebe uma response, WebSocket permite que servidor e cliente enviem mensagens a qualquer momento.

Use WebSockets para chat, notificações, dashboards em tempo real, jogos, colaboração, streaming de eventos e presença online.

---

## Quando Usar

Use WebSockets quando:

- o servidor precisa enviar eventos imediatamente;
- polling seria caro ou lento;
- há interação em tempo real;
- mensagens são frequentes e pequenas;
- conexão persistente melhora experiência.

Evite quando:

- atualizações são raras;
- Server-Sent Events resolveria;
- arquitetura não suporta conexões longas;
- você precisa apenas de CRUD.

---

## Fluxo

1. Cliente faz handshake HTTP.
2. Conexão muda para WebSocket.
3. Cliente e servidor trocam frames.
4. Conexão fica aberta.
5. Qualquer lado pode fechar.

URL:

```text
ws://localhost:8000/ws
wss://api.exemplo.com/ws
```

Use `wss` em produção.

---

## WebSocket Simples com FastAPI

```python
from fastapi import FastAPI, WebSocket

app = FastAPI()


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        mensagem = await websocket.receive_text()
        await websocket.send_text(f"Eco: {mensagem}")
```

Cliente JavaScript:

```javascript
const ws = new WebSocket("ws://localhost:8000/ws");

ws.onopen = () => ws.send("Olá");
ws.onmessage = (event) => console.log(event.data);
```

---

## Gerenciador de Conexões

```python
from fastapi import WebSocket


class ConnectionManager:
    def __init__(self) -> None:
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket) -> None:
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket) -> None:
        await websocket.send_text(message)

    async def broadcast(self, message: str) -> None:
        for connection in self.active_connections:
            await connection.send_text(message)
```

Uso:

```python
from fastapi import FastAPI, WebSocket, WebSocketDisconnect

app = FastAPI()
manager = ConnectionManager()


@app.websocket("/ws/chat")
async def websocket_chat(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast(f"Mensagem: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
```

---

## Mensagens JSON

```python
from pydantic import BaseModel, ValidationError


class ChatMessage(BaseModel):
    tipo: str
    sala: str
    texto: str


async def receber_json(websocket: WebSocket) -> ChatMessage:
    payload = await websocket.receive_json()
    return ChatMessage.model_validate(payload)
```

Cliente:

```javascript
ws.send(JSON.stringify({
  tipo: "mensagem",
  sala: "geral",
  texto: "Oi"
}));
```

---

## Autenticação

WebSocket não permite headers customizados facilmente em browsers como uma request normal. Opções comuns:

- cookie de sessão;
- token na query string;
- subprotocol;
- primeira mensagem de autenticação.

Exemplo com token na query:

```python
from fastapi import WebSocket, status


async def autenticar(websocket: WebSocket):
    token = websocket.query_params.get("token")
    if token != "token-secreto":
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return None
    return {"id": 1, "nome": "Ana"}
```

Em produção, não registre tokens em logs e prefira cookies seguros ou mecanismos adequados ao seu frontend.

---

## Salas

```python
class RoomManager:
    def __init__(self) -> None:
        self.rooms: dict[str, set[WebSocket]] = {}

    async def join(self, room: str, websocket: WebSocket) -> None:
        await websocket.accept()
        self.rooms.setdefault(room, set()).add(websocket)

    def leave(self, room: str, websocket: WebSocket) -> None:
        sockets = self.rooms.get(room)
        if not sockets:
            return
        sockets.discard(websocket)
        if not sockets:
            self.rooms.pop(room, None)

    async def broadcast(self, room: str, message: dict) -> None:
        for websocket in self.rooms.get(room, set()).copy():
            await websocket.send_json(message)
```

---

## Heartbeat

Conexões podem morrer sem aviso. Use ping/pong ou mensagens de heartbeat.

```python
import asyncio


async def heartbeat(websocket: WebSocket) -> None:
    while True:
        await asyncio.sleep(30)
        await websocket.send_json({"tipo": "ping"})
```

Em servidores e proxies, configure timeouts adequados.

---

## Escalando WebSockets

Problema: conexões ficam em memória de uma instância. Se você tem 5 réplicas, cada uma conhece apenas seus clientes conectados.

Soluções:

- Redis Pub/Sub;
- Redis Streams;
- NATS;
- Kafka;
- RabbitMQ;
- sticky sessions em alguns casos;
- gateway dedicado.

Broadcast com Redis Pub/Sub:

```python
import redis.asyncio as redis


redis_client = redis.from_url("redis://localhost:6379/0")


async def publicar(sala: str, mensagem: str) -> None:
    await redis_client.publish(f"sala:{sala}", mensagem)
```

Cada instância assina o canal e repassa para conexões locais.

---

## Backpressure

Se o cliente recebe devagar e o servidor envia rápido, buffers crescem.

Estratégias:

- limitar tamanho de mensagem;
- limitar taxa por conexão;
- usar fila por cliente com tamanho máximo;
- desconectar clientes lentos;
- compactar ou agregar eventos;
- enviar snapshots em vez de todos os eventos.

---

## WebSockets vs SSE

Server-Sent Events:

- servidor envia eventos;
- cliente não envia pelo mesmo canal;
- usa HTTP;
- reconexão simples;
- bom para notificações e dashboards.

WebSockets:

- bidirecional;
- melhor para chat e colaboração;
- exige mais cuidado com escala;
- passa por proxies com configuração correta.

---

## Checklist WebSocket Profissional

- autenticação é segura?
- mensagens têm schema e validação?
- conexões são removidas ao desconectar?
- há heartbeat ou timeout?
- mensagens têm limite de tamanho?
- existe rate limit?
- escala entre instâncias usa broker?
- proxies suportam upgrade?
- logs não expõem tokens?
- clientes sabem reconectar?
- servidor lida com backpressure?
- métricas incluem conexões ativas e mensagens por segundo?

