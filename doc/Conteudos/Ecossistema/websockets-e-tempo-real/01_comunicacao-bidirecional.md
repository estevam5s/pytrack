# Comunicação bidirecional

WebSockets mantêm um canal aberto para tempo real.

## Pontos-chave

- Handshake e conexão persistente
- Endpoints WebSocket no FastAPI
- Broadcast para múltiplos clientes
- Backplane (Redis) para escalar

## Exemplo

```python
from fastapi import FastAPI, WebSocket
app = FastAPI()

@app.websocket('/ws')
async def ws(socket: WebSocket):
    await socket.accept()
    while True:
        msg = await socket.receive_text()
        await socket.send_text(f'eco: {msg}')
```

## Boas práticas

- Trate desconexões
- Escale com pub/sub

## Saiba mais

- [Documentação oficial](https://fastapi.tiangolo.com/advanced/websockets/)
