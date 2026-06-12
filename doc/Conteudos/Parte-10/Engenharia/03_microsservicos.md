# Microsserviços: Arquitetura Distribuída, Operação e Trade-offs

Microsserviços são uma forma de organizar um sistema como um conjunto de serviços pequenos, independentes e implantáveis separadamente. Cada serviço deve ter responsabilidade clara, dados próprios e um limite de negócio compreensível.

Microsserviços não são uma evolução automática de monolitos. Eles trocam complexidade interna por complexidade distribuída: rede, consistência eventual, observabilidade, deploy, contratos, falhas parciais e coordenação entre equipes.

---

## Conceito Essencial

Um microsserviço deve ser:

- independente para deploy;
- dono de seus dados;
- orientado a uma capacidade de negócio;
- observável;
- tolerante a falhas;
- pequeno o suficiente para ser compreendido;
- grande o suficiente para ter autonomia real.

Exemplo de decomposição:

```text
Sistema de e-commerce
├── catalogo
├── carrinho
├── pedidos
├── pagamentos
├── estoque
├── entrega
└── notificacoes
```

Cada serviço expõe contratos e esconde seus detalhes internos.

---

## O que Microsserviço Não é

Não é apenas:

- uma pasta separada;
- uma API pequena;
- uma tabela por endpoint;
- uma função serverless;
- um container;
- um repositório diferente;
- uma desculpa para evitar modelagem.

Se todos os serviços precisam ser deployados juntos, compartilham o mesmo banco e quebram quando outro muda internamente, provavelmente você tem um monolito distribuído.

---

## Exemplo com FastAPI

Serviço de pedidos:

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title="pedidos-service")


class CriarPedido(BaseModel):
    cliente_id: int
    itens: list[dict]


pedidos = {}


@app.post("/pedidos")
def criar_pedido(payload: CriarPedido) -> dict:
    pedido_id = len(pedidos) + 1
    pedido = {
        "id": pedido_id,
        "cliente_id": payload.cliente_id,
        "itens": payload.itens,
        "status": "criado",
    }
    pedidos[pedido_id] = pedido
    return pedido


@app.get("/pedidos/{pedido_id}")
def obter_pedido(pedido_id: int) -> dict:
    if pedido_id not in pedidos:
        raise HTTPException(status_code=404, detail="Pedido nao encontrado")
    return pedidos[pedido_id]
```

Esse exemplo mostra a interface. Em produção, ele precisaria de banco, autenticação, logs estruturados, métricas, tracing, health checks e estratégia de falhas.

---

## Banco de Dados por Serviço

Regra forte: cada serviço deve possuir seu próprio armazenamento.

```text
pedidos-service -> pedidos_db
pagamentos-service -> pagamentos_db
estoque-service -> estoque_db
```

Evite:

```text
pedidos-service ----\
pagamentos-service --- banco_compartilhado
estoque-service -----/
```

Banco compartilhado cria acoplamento invisível:

- mudança de schema quebra outros serviços;
- transações atravessam domínios;
- ownership fica confuso;
- deploy independente perde sentido.

Integração deve acontecer por API, eventos ou replicação controlada de dados de leitura.

---

## Comunicação Síncrona

HTTP/gRPC são comuns quando uma resposta imediata é necessária.

```python
import httpx


class PagamentosClient:
    def __init__(self, base_url: str):
        self.base_url = base_url

    def autorizar(self, pedido_id: int, valor: str) -> dict:
        response = httpx.post(
            f"{self.base_url}/pagamentos/autorizacoes",
            json={"pedido_id": pedido_id, "valor": valor},
            timeout=3,
        )
        response.raise_for_status()
        return response.json()
```

Cuidados obrigatórios:

- timeout;
- retry com limite;
- circuit breaker;
- idempotência;
- autenticação serviço a serviço;
- versionamento de contrato;
- fallback quando aplicável.

Chamada síncrona demais cria cadeia frágil:

```text
checkout -> pedidos -> pagamento -> antifraude -> notificacao
```

Se qualquer serviço falha, o fluxo inteiro pode falhar.

---

## Comunicação Assíncrona

Eventos reduzem acoplamento temporal:

```text
pedidos-service publica PedidoCriado
pagamentos-service consome e tenta cobrar
estoque-service consome e reserva itens
notificacoes-service consome e envia email
```

Exemplo de evento:

```python
from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class PedidoCriado:
    event_id: str
    pedido_id: int
    cliente_id: int
    total: str
    occurred_at: datetime
```

Eventos trazem novos problemas:

- entrega duplicada;
- ordenação;
- atraso;
- falha de consumidores;
- consistência eventual;
- versionamento de payload;
- replay.

---

## Transações Distribuídas

Evite transações ACID atravessando serviços. Em microsserviços, o padrão comum é Saga.

Exemplo de saga coreografada:

```text
PedidoCriado
  -> PagamentoAutorizado
  -> EstoqueReservado
  -> PedidoConfirmado

Se falhar:
  -> PagamentoEstornado
  -> EstoqueLiberado
  -> PedidoCancelado
```

Saga exige ações compensatórias. Nem toda operação pode ser simplesmente "desfeita"; por isso o desenho do processo importa.

---

## Idempotência

Em sistemas distribuídos, a mesma mensagem pode chegar mais de uma vez. Operações precisam tolerar duplicidade.

```python
class ProcessadorPagamento:
    def __init__(self, pagamentos_repo):
        self.pagamentos_repo = pagamentos_repo

    def processar(self, event_id: str, pedido_id: int, valor: str) -> None:
        if self.pagamentos_repo.evento_processado(event_id):
            return

        self.pagamentos_repo.autorizar_pagamento(pedido_id, valor)
        self.pagamentos_repo.marcar_evento_processado(event_id)
```

Idempotência pode usar:

- chave idempotente;
- tabela de eventos processados;
- constraint única;
- estado da entidade;
- deduplicação no broker.

---

## Observabilidade

Sem observabilidade, microsserviços ficam difíceis de operar.

Cada serviço precisa:

- logs estruturados com correlation id;
- métricas de latência, erro e throughput;
- tracing distribuído;
- health check;
- readiness check;
- dashboards;
- alertas úteis;
- auditoria para operações críticas.

Exemplo de log estruturado:

```python
import logging

logger = logging.getLogger(__name__)


def criar_pedido(cliente_id: int, correlation_id: str) -> None:
    logger.info(
        "criando_pedido",
        extra={"cliente_id": cliente_id, "correlation_id": correlation_id},
    )
```

Tracing ajuda a responder: onde a requisição ficou lenta e qual serviço falhou?

---

## Deploy Independente

Um serviço só é independente se pode mudar sem coordenar deploy de todos os outros.

Práticas:

- contratos versionados;
- backward compatibility;
- feature flags;
- migrações compatíveis;
- consumer-driven contract tests;
- canary deploy;
- rollback rápido;
- infraestrutura como código.

Mudança ruim:

```text
remover campo "total" do evento PedidoCriado sem coordenar consumidores
```

Mudança melhor:

```text
adicionar "total_centavos", manter "total" por um periodo, migrar consumidores, remover depois
```

---

## Segurança

Microsserviços ampliam superfície de ataque.

Cuidados:

- autenticação e autorização entre serviços;
- mTLS quando apropriado;
- secrets fora do código;
- princípio do menor privilégio;
- validação em cada boundary;
- rate limiting;
- segmentação de rede;
- auditoria;
- proteção contra SSRF;
- controle de acesso por serviço e operação.

Nunca assuma que uma chamada é confiável apenas por vir da rede interna.

---

## Quando Usar

Microsserviços fazem sentido quando:

- existem vários times autônomos;
- domínios têm ciclos de mudança diferentes;
- partes precisam escalar de forma independente;
- deploy independente reduz risco;
- o sistema já tem maturidade operacional;
- existe capacidade de observabilidade e automação.

Evite quando:

- o produto ainda está descobrindo o domínio;
- a equipe é pequena;
- não há CI/CD confiável;
- não há observabilidade;
- o sistema pode ser bem resolvido com monolito modular;
- a principal motivação é moda.

---

## Erros Comuns

- criar microsserviço por tabela;
- compartilhar banco;
- usar chamadas síncronas em cadeia;
- ignorar idempotência;
- não versionar eventos;
- não ter tracing;
- quebrar contrato em produção;
- distribuir um domínio que ainda não foi entendido;
- subestimar custo de operação;
- confundir deploy separado com autonomia real.

---

## Checklist Avançado

- Cada serviço tem dono e responsabilidade clara?
- O serviço possui seus próprios dados?
- Contratos são versionados e testados?
- Chamadas externas têm timeout e retry controlado?
- Mensagens são idempotentes?
- Existe estratégia para consistência eventual?
- Logs, métricas e traces estão configurados?
- Deploy, rollback e migração são independentes?
- O custo operacional compensa o benefício?

Microsserviços são uma ferramenta poderosa, mas exigem maturidade. Uma arquitetura distribuída mal projetada é mais difícil de corrigir do que um monolito bem organizado.

