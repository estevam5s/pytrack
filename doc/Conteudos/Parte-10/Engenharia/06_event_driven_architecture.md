# Event-Driven Architecture: Eventos, Mensageria e Consistência

Arquitetura orientada a eventos organiza sistemas em torno de fatos relevantes que aconteceram. Em vez de um componente chamar diretamente todos os interessados, ele publica um evento, e consumidores reagem de forma independente.

Eventos são úteis para desacoplar fluxos, integrar sistemas, processar tarefas assíncronas e construir arquiteturas escaláveis. Eles também introduzem desafios: consistência eventual, duplicidade, ordenação, versionamento e observabilidade.

---

## Evento

Evento é um fato no passado.

Bons nomes:

- `PedidoCriado`
- `PedidoConfirmado`
- `PagamentoAutorizado`
- `EstoqueReservado`
- `EmailEnviado`

Nomes ruins:

- `CriarPedido`
- `ProcessarPagamento`
- `AtualizarStatus`

Comandos pedem uma ação. Eventos informam que algo aconteceu.

---

## Evento vs Comando

```text
Comando:
  ConfirmarPedido
  intencao: faca algo
  pode falhar
  geralmente tem um responsavel

Evento:
  PedidoConfirmado
  fato: algo aconteceu
  nao deve ser "desfeito"
  pode ter muitos consumidores
```

Em código:

```python
from dataclasses import dataclass
from datetime import datetime
from uuid import UUID


@dataclass(frozen=True)
class ConfirmarPedido:
    pedido_id: UUID


@dataclass(frozen=True)
class PedidoConfirmado:
    event_id: UUID
    pedido_id: UUID
    cliente_id: UUID
    occurred_at: datetime
```

---

## Pub/Sub

No modelo publish/subscribe:

```text
pedidos publica PedidoConfirmado
├── notificacoes envia email
├── financeiro gera faturamento
├── analytics atualiza metricas
└── logistica inicia separacao
```

O produtor não precisa conhecer consumidores.

---

## Broker

Broker é a infraestrutura que transporta mensagens.

Exemplos:

- RabbitMQ;
- Kafka;
- Redis Streams;
- AWS SNS/SQS;
- Google Pub/Sub;
- Azure Service Bus;
- NATS.

Escolha depende de:

- volume;
- ordering;
- retenção;
- replay;
- latência;
- modelo de consumo;
- operação disponível;
- garantias necessárias.

---

## Evento em Python

```python
from dataclasses import asdict, dataclass
from datetime import datetime
from uuid import UUID, uuid4


@dataclass(frozen=True)
class PedidoConfirmado:
    event_id: UUID
    pedido_id: UUID
    cliente_id: UUID
    total: str
    occurred_at: datetime
    version: int = 1


def criar_evento_pedido_confirmado(pedido) -> PedidoConfirmado:
    return PedidoConfirmado(
        event_id=uuid4(),
        pedido_id=pedido.id,
        cliente_id=pedido.cliente_id,
        total=str(pedido.total),
        occurred_at=datetime.utcnow(),
    )


evento = criar_evento_pedido_confirmado(pedido)
payload = asdict(evento)
```

Em produção, serialize datas e UUIDs explicitamente para JSON, Avro ou Protobuf.

---

## Publicação Ingênua

Problema comum:

```python
def confirmar_pedido(pedido):
    pedido.confirmar()
    pedidos_repo.salvar(pedido)
    broker.publish("PedidoConfirmado", pedido.to_event())
```

Se salvar no banco funcionar e publicar falhar, o sistema fica inconsistente. O pedido foi confirmado, mas ninguém recebeu o evento.

Se publicar funcionar e salvar falhar, consumidores podem reagir a algo que não existe.

---

## Transactional Outbox

Outbox resolve o problema gravando o evento na mesma transação do estado.

```text
transacao:
  update pedidos set status = 'confirmado'
  insert into outbox_events (...)

processo separado:
  le outbox_events pendentes
  publica no broker
  marca como publicado
```

Exemplo:

```python
class ConfirmarPedido:
    def __init__(self, pedidos_repo, outbox):
        self.pedidos_repo = pedidos_repo
        self.outbox = outbox

    def executar(self, pedido_id):
        pedido = self.pedidos_repo.obter(pedido_id)
        pedido.confirmar()

        self.pedidos_repo.salvar(pedido)
        for evento in pedido.eventos:
            self.outbox.adicionar(evento)
```

O commit do banco garante pedido e evento pendente juntos.

---

## Consumidor Idempotente

Mensagens podem ser entregues mais de uma vez.

```python
class EnviarEmailPedidoConfirmado:
    def __init__(self, eventos_processados, email_client):
        self.eventos_processados = eventos_processados
        self.email_client = email_client

    def executar(self, evento: PedidoConfirmado) -> None:
        if self.eventos_processados.existe(evento.event_id):
            return

        self.email_client.enviar(
            cliente_id=evento.cliente_id,
            assunto="Pedido confirmado",
            corpo=f"Pedido {evento.pedido_id} confirmado",
        )

        self.eventos_processados.marcar(evento.event_id)
```

Quando possível, use constraints únicas para proteger idempotência.

---

## Ordering

Ordem é difícil em sistemas distribuídos.

Exemplo de problema:

```text
PedidoConfirmado chega antes de PedidoCriado
PagamentoCancelado chega antes de PagamentoAutorizado
```

Estratégias:

- particionar por chave, como `pedido_id`;
- consumidores tolerantes a eventos fora de ordem;
- versionamento de entidade;
- estado derivado recalculável;
- ignorar eventos antigos;
- usar process managers quando fluxo exige ordem.

Kafka, por exemplo, garante ordem dentro de uma partição, não globalmente.

---

## Consistência Eventual

Com eventos, sistemas podem ficar temporariamente inconsistentes.

```text
Pedido confirmado agora
Tela de analytics atualiza em alguns segundos
Email pode chegar depois
Estoque pode ser reservado em outro fluxo
```

Isso é aceitável para muitos casos, mas não para todos.

Pergunta importante:

```text
O usuario precisa ver consistencia imediata ou pode aceitar atraso?
```

Não use consistência eventual para esconder regra crítica mal modelada.

---

## Event Sourcing

Event sourcing armazena eventos como fonte da verdade.

Em vez de salvar apenas:

```text
pedido.status = confirmado
```

Salva:

```text
PedidoCriado
ItemAdicionado
CupomAplicado
PedidoConfirmado
```

O estado é reconstruído aplicando eventos.

Vantagens:

- auditoria completa;
- histórico natural;
- replay;
- projeções diferentes;
- debugging temporal.

Custos:

- maior complexidade;
- versionamento de eventos;
- migrações difíceis;
- queries exigem projeções;
- curva de aprendizado alta.

Use event sourcing apenas quando o histórico de eventos for essencial.

---

## Projeções

Projeção é uma visão derivada de eventos.

```text
eventos de pedidos -> tabela pedido_resumo
eventos de vendas -> dashboard diario
eventos de pagamento -> extrato financeiro
```

Exemplo:

```python
class PedidoResumoProjection:
    def __init__(self, read_model):
        self.read_model = read_model

    def quando_pedido_confirmado(self, evento: PedidoConfirmado) -> None:
        self.read_model.upsert(
            pedido_id=evento.pedido_id,
            cliente_id=evento.cliente_id,
            status="confirmado",
            total=evento.total,
        )
```

Projeções devem ser reconstruíveis sempre que possível.

---

## Versionamento de Eventos

Eventos publicados viram contrato.

Evite quebrar consumidores:

```json
{
  "event_type": "PedidoConfirmado",
  "version": 1,
  "pedido_id": "..."
}
```

Mudanças seguras:

- adicionar campo opcional;
- manter campo antigo por período;
- criar nova versão;
- documentar schema;
- testar consumidores.

Mudanças perigosas:

- remover campo;
- mudar significado;
- alterar tipo;
- renomear sem compatibilidade.

---

## Observabilidade

Arquitetura event-driven precisa responder:

- qual evento foi publicado?
- quando foi publicado?
- quem consumiu?
- quem falhou?
- quantas tentativas ocorreram?
- qual DLQ recebeu a mensagem?
- existe atraso no consumo?
- qual correlation id liga o fluxo?

Use:

- correlation id;
- event id;
- logs estruturados;
- métricas de lag;
- dead letter queue;
- tracing;
- dashboards por tópico/fila.

---

## Quando Usar

Use event-driven quando:

- várias partes reagem ao mesmo fato;
- tarefas podem ser assíncronas;
- você precisa desacoplar produtores e consumidores;
- há integrações entre contextos;
- auditabilidade ou replay são importantes;
- picos de carga precisam ser absorvidos.

Evite quando:

- fluxo precisa ser simples e imediato;
- equipe não domina operação de mensageria;
- consistência eventual é inaceitável;
- eventos seriam usados só para complicar chamadas locais;
- não há observabilidade.

---

## Checklist Avançado

- Eventos são fatos no passado?
- Payload tem schema e versão?
- Publicação usa outbox quando precisa de consistência?
- Consumidores são idempotentes?
- Há estratégia para retry e DLQ?
- Ordering foi analisado por caso de uso?
- Consistência eventual é aceitável?
- Métricas de lag e falha existem?
- Eventos não vazam detalhes internos demais?

Arquitetura orientada a eventos é excelente para desacoplamento e escala, mas exige disciplina. O sucesso depende menos do broker escolhido e mais da modelagem correta dos fatos, contratos e falhas.

