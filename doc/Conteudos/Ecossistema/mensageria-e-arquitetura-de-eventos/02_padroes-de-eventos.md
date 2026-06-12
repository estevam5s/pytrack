# Padrões de eventos

Construa sistemas event-driven robustos.

## Pontos-chave

- Event sourcing e outbox pattern
- Sagas para transações distribuídas
- Ordenação por partição
- Versionamento de eventos

## Exemplo

```python
# outbox: grava evento na mesma transação do dado
with session.begin():
    session.add(pedido)
    session.add(Evento(tipo='pedido_criado', payload=...))
```

## Boas práticas

- Eventos imutáveis e versionados
- Garanta consistência eventual

## Saiba mais

- [Documentação oficial](https://microservices.io/patterns/data/event-sourcing.html)
