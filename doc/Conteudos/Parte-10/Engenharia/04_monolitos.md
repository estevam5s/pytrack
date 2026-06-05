# Monolitos: Arquitetura Modular, Escalabilidade e Evolução

Um monolito é uma aplicação implantada como uma unidade. Isso não significa código bagunçado. Um monolito pode ser simples, robusto, modular, testável e escalável.

O erro comum é tratar "monolito" como sinônimo de "sistema legado ruim". O problema não é ser monolito; o problema é ser um bloco sem limites internos, com acoplamento descontrolado e mudanças perigosas.

---

## Tipos de Monolito

```text
Monolito simples
├── uma aplicacao
├── um deploy
└── poucos modulos

Monolito modular
├── uma aplicacao
├── um deploy
├── varios modulos com limites claros
└── regras de dependencia internas

Big ball of mud
├── tudo chama tudo
├── regra espalhada
├── banco usado como integracao
└── mudancas imprevisiveis
```

O objetivo profissional é construir monolitos modulares, não sistemas sem arquitetura.

---

## Quando Monolito é Excelente

Monolito costuma ser a melhor escolha quando:

- a equipe é pequena ou média;
- o domínio ainda está mudando muito;
- deploy coordenado não é problema;
- a escala cabe em uma aplicação;
- transações fortes são importantes;
- a operação precisa ser simples;
- o produto está em fase de descoberta.

Vantagens:

- menor complexidade operacional;
- debugging mais simples;
- transações locais;
- testes integrados mais fáceis;
- deploy único;
- menor custo de infraestrutura;
- menos problemas de rede.

---

## Estrutura Ruim

Exemplo de monolito sem limites:

```text
app/
├── models.py
├── views.py
├── services.py
├── utils.py
└── database.py
```

Com o tempo, `services.py` vira um arquivo gigante. `utils.py` vira depósito de lógica. Todo módulo importa tudo.

---

## Estrutura Modular

Uma estrutura melhor:

```text
app/
├── core/
│   ├── config.py
│   └── database.py
├── clientes/
│   ├── api.py
│   ├── models.py
│   ├── repository.py
│   └── service.py
├── pedidos/
│   ├── api.py
│   ├── domain.py
│   ├── repository.py
│   └── service.py
├── pagamentos/
│   ├── api.py
│   ├── models.py
│   ├── gateway.py
│   └── service.py
└── main.py
```

Cada módulo representa uma capacidade do negócio. Isso permite evoluir internamente sem distribuir cedo demais.

---

## Regras de Dependência

Sem regras, o monolito modular degrada.

Exemplo de regra:

```text
pedidos pode chamar pagamentos por interface publica
pagamentos nao acessa tabelas internas de pedidos
clientes nao importa repository de pedidos
modulos nao importam models internos uns dos outros
```

Uma forma prática é expor apenas uma fachada:

```python
# app/pagamentos/public.py
from dataclasses import dataclass


@dataclass(frozen=True)
class AutorizacaoPagamento:
    autorizada: bool
    codigo: str | None


class PagamentosAPI:
    def autorizar(self, pedido_id: int, valor: str) -> AutorizacaoPagamento:
        ...
```

O módulo de pedidos depende de `PagamentosAPI`, não de detalhes internos de pagamentos.

---

## Exemplo de Módulo

```python
# app/pedidos/domain.py
from dataclasses import dataclass
from decimal import Decimal


@dataclass
class ItemPedido:
    produto_id: int
    quantidade: int
    preco_unitario: Decimal

    @property
    def subtotal(self) -> Decimal:
        return self.preco_unitario * self.quantidade


@dataclass
class Pedido:
    cliente_id: int
    itens: list[ItemPedido]
    status: str = "rascunho"

    @property
    def total(self) -> Decimal:
        return sum((item.subtotal for item in self.itens), Decimal("0"))

    def confirmar(self) -> None:
        if self.total <= 0:
            raise ValueError("Pedido sem valor nao pode ser confirmado")
        self.status = "confirmado"
```

Serviço de aplicação:

```python
# app/pedidos/service.py
class CriarPedidoService:
    def __init__(self, pedidos_repo, pagamentos_api):
        self.pedidos_repo = pedidos_repo
        self.pagamentos_api = pagamentos_api

    def executar(self, pedido: Pedido) -> Pedido:
        pedido.confirmar()
        autorizacao = self.pagamentos_api.autorizar(
            pedido_id=0,
            valor=str(pedido.total),
        )

        if not autorizacao.autorizada:
            pedido.status = "pagamento_recusado"
        else:
            pedido.status = "confirmado"

        self.pedidos_repo.salvar(pedido)
        return pedido
```

Mesmo dentro de um único deploy, há separação de responsabilidades.

---

## Banco de Dados no Monolito

Monolitos geralmente usam um banco compartilhado pela aplicação. Isso é aceitável, mas exige disciplina.

Boas práticas:

- schema organizado por domínio;
- migrations revisadas;
- constraints no banco;
- transações explícitas;
- repositories por módulo;
- evitar SQL espalhado;
- não usar tabela como API interna entre módulos.

Exemplo:

```text
schemas:
  clientes.*
  pedidos.*
  pagamentos.*
```

Mesmo no mesmo banco, cada módulo deve ser dono lógico de suas tabelas.

---

## Escalabilidade

Monolitos escalam mais do que muita gente imagina.

Estratégias:

- escalar horizontalmente a aplicação;
- cache;
- filas para tarefas demoradas;
- read replicas;
- índices corretos;
- particionamento de dados;
- workers separados;
- otimização de queries;
- CDN para conteúdo estático.

Exemplo:

```text
web app replicas -> banco principal
workers -> fila -> tarefas assíncronas
cache -> Redis
```

Ainda é um monolito se o deploy principal e o código forem uma unidade lógica.

---

## Monolito com Workers

Separar processo não significa necessariamente microsserviço.

```text
mesmo codigo
├── web: uvicorn app.main:app
└── worker: python -m app.worker
```

Ambos compartilham domínio, banco e deploy. Isso pode resolver escala de tarefas sem introduzir distribuição de domínio.

---

## Caminho para Microsserviços

Um monolito modular facilita extração futura.

Passos:

1. Identificar módulo com boundary claro.
2. Criar interface pública interna.
3. Remover acessos diretos ao banco do módulo por outros módulos.
4. Versionar contrato.
5. Extrair dados se necessário.
6. Substituir chamada interna por HTTP/evento.
7. Operar separadamente.

Extração prematura costuma falhar porque o domínio ainda não tem fronteiras estáveis.

---

## Testes

Monolito modular permite vários níveis:

```text
unitarios: dominio puro
integracao: repositories e banco
contrato interno: fachadas entre modulos
e2e: fluxo completo via API
```

Teste de regra:

```python
def test_pedido_sem_itens_nao_confirma():
    pedido = Pedido(cliente_id=1, itens=[])

    try:
        pedido.confirmar()
    except ValueError as exc:
        assert "sem valor" in str(exc)
    else:
        raise AssertionError("deveria falhar")
```

Teste de módulo:

```python
def test_criar_pedido_chama_pagamento(fake_repo, fake_pagamentos):
    service = CriarPedidoService(fake_repo, fake_pagamentos)
    pedido = Pedido(cliente_id=1, itens=[...])

    service.executar(pedido)

    assert fake_repo.salvo is pedido
```

---

## Erros Comuns

- acreditar que monolito não precisa de arquitetura;
- criar módulos só por pasta, sem boundary;
- permitir importações livres entre tudo;
- usar banco como integração interna descontrolada;
- deixar transações implícitas e longas;
- centralizar toda regra em services genéricos;
- criar microsserviços para fugir de refatoração;
- ignorar observabilidade por ser "só um monolito".

---

## Checklist Avançado

- Módulos representam capacidades de negócio?
- Há regras claras de dependência?
- Cada módulo tem API interna pública?
- Regras críticas estão fora de controllers?
- Banco tem ownership lógico?
- Workers e tarefas assíncronas têm idempotência?
- Métricas e logs permitem operar o sistema?
- Existe caminho claro para extrair módulos no futuro?

Um monolito modular bem feito é uma das arquiteturas mais eficientes para grande parte dos produtos. Ele mantém a simplicidade operacional enquanto preserva a possibilidade de evolução.

