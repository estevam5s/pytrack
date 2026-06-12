# Comunicação bidirecional

WebSockets mantêm um canal aberto para tempo real.

> **Tema:** Real-time · **Nível:** avancado · **Trilha:** WebSockets e Tempo Real

## Conceitos-chave

Nesta lição você vai entender:

- **Handshake e conexão persistente**
- **Endpoints WebSocket no FastAPI**
- **Broadcast para múltiplos clientes**
- **Backplane (Redis) para escalar**

## Exemplo prático

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

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Trate desconexões
- Escale com pub/sub

## Pratique

Para fixar, escreva um pequeno script que combine **handshake e conexão persistente** e **endpoints websocket no fastapi** em um caso do seu dia a dia. Depois refatore aplicando "Trate desconexões".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Handshake e conexão persistente
- [ ] Explicar e aplicar: Endpoints WebSocket no FastAPI
- [ ] Explicar e aplicar: Broadcast para múltiplos clientes
- [ ] Explicar e aplicar: Backplane (Redis) para escalar

## Saiba mais

- [Documentação oficial](https://fastapi.tiangolo.com/advanced/websockets/)
