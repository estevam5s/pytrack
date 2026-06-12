# Padrões de eventos

Construa sistemas event-driven robustos.

> **Tema:** Eventos · **Nível:** avancado · **Trilha:** Mensageria e Arquitetura de Eventos

## Conceitos-chave

Nesta lição você vai entender:

- **Event sourcing e outbox pattern**
- **Sagas para transações distribuídas**
- **Ordenação por partição**
- **Versionamento de eventos**

## Exemplo prático

```python
# outbox: grava evento na mesma transação do dado
with session.begin():
    session.add(pedido)
    session.add(Evento(tipo='pedido_criado', payload=...))
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Eventos imutáveis e versionados
- Garanta consistência eventual

## Pratique

Para fixar, escreva um pequeno script que combine **event sourcing e outbox pattern** e **sagas para transações distribuídas** em um caso do seu dia a dia. Depois refatore aplicando "Eventos imutáveis e versionados".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Event sourcing e outbox pattern
- [ ] Explicar e aplicar: Sagas para transações distribuídas
- [ ] Explicar e aplicar: Ordenação por partição
- [ ] Explicar e aplicar: Versionamento de eventos

## Saiba mais

- [Documentação oficial](https://microservices.io/patterns/data/event-sourcing.html)
