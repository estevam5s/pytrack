# SOLID, DDD, Design Patterns e Arquiteturas Modernas

Este arquivo conecta POO com engenharia de software: SOLID, DDD, design patterns, arquitetura limpa e arquiteturas modernas.

---

## Sumário

1. [SOLID](#solid)
2. [Outros Princípios Fundamentais](#outros-princípios-fundamentais)
3. [Domain-Driven Design](#domain-driven-design)
4. [Design Patterns](#design-patterns)
5. [Singleton](#singleton)
6. [Factory](#factory)
7. [Strategy](#strategy)
8. [Observer](#observer)
9. [Repository](#repository)
10. [Adapter](#adapter)
11. [Command](#command)
12. [Builder](#builder)
13. [Template Method](#template-method)
14. [Categorias de Patterns](#categorias-de-patterns)
15. [Arquitetura Limpa](#arquitetura-limpa)
16. [Arquiteturas Modernas](#arquiteturas-modernas)
17. [Boas Práticas](#boas-práticas)
18. [Exercícios](#exercícios)

---

## SOLID

### S: Single Responsibility Principle

Uma classe deve ter um motivo principal para mudar.

```python
class Pedido:
    def total(self) -> float:
        ...
```

Persistir pedido não deve estar necessariamente dentro de `Pedido`.

### O: Open/Closed Principle

Aberto para extensão, fechado para modificação.

```python
from typing import Protocol

class Desconto(Protocol):
    def calcular(self, total: float) -> float:
        ...

class DescontoVip:
    def calcular(self, total: float) -> float:
        return total * 0.20
```

### L: Liskov Substitution Principle

Subclasses devem poder substituir a base sem quebrar expectativas.

Se `Quadrado` herda de `Retangulo` e muda comportamento esperado de largura/altura, há risco de violar LSP.

### I: Interface Segregation Principle

Prefira interfaces pequenas.

```python
class Leitor(Protocol):
    def ler(self) -> bytes:
        ...

class Escritor(Protocol):
    def escrever(self, dados: bytes) -> None:
        ...
```

### D: Dependency Inversion Principle

Módulos de alto nível dependem de abstrações.

```python
class PedidoService:
    def __init__(self, repository, email_sender):
        self._repository = repository
        self._email_sender = email_sender
```

---

## Outros Princípios Fundamentais

- DRY: não duplique conhecimento.
- KISS: mantenha simples.
- YAGNI: não implemente antes de precisar.
- Tell, Don't Ask: diga ao objeto o que fazer, não extraia seus dados para decidir fora.
- Law of Demeter: evite navegar profundamente por objetos.
- Composition over inheritance: prefira composição quando herança não é natural.

---

## Domain-Driven Design

DDD organiza software ao redor do domínio.

Conceitos:

- entidade;
- value object;
- aggregate;
- repository;
- domain service;
- application service;
- bounded context;
- ubiquitous language.

### Entidade

```python
from dataclasses import dataclass, field
from uuid import UUID, uuid4

@dataclass
class Pedido:
    cliente_id: UUID
    id: UUID = field(default_factory=uuid4)
    status: str = "rascunho"

    def confirmar(self) -> None:
        if self.status != "rascunho":
            raise ValueError("pedido não pode ser confirmado")
        self.status = "confirmado"
```

### Value Object

```python
from dataclasses import dataclass

@dataclass(frozen=True)
class Email:
    valor: str

    def __post_init__(self):
        if "@" not in self.valor:
            raise ValueError("email inválido")
```

---

## Design Patterns

Patterns são soluções recorrentes. Use como vocabulário e inspiração, não como obrigação.

Em Python, muitos patterns ficam menores por causa de:

- funções de primeira classe;
- decorators;
- duck typing;
- context managers;
- dataclasses;
- protocols.

---

## Singleton

Singleton restringe uma classe a uma instância.

Em Python, muitas vezes um módulo já resolve.

```python
class Config:
    _instancia = None

    def __new__(cls):
        if cls._instancia is None:
            cls._instancia = super().__new__(cls)
        return cls._instancia
```

Use com cuidado. Singleton pode virar estado global difícil de testar.

---

## Factory

Factory cria objetos sem espalhar detalhes de construção.

```python
class EmailNotifier:
    def enviar(self, destino: str, mensagem: str) -> None:
        print("email", destino, mensagem)

class SmsNotifier:
    def enviar(self, destino: str, mensagem: str) -> None:
        print("sms", destino, mensagem)

def criar_notificador(tipo: str):
    match tipo:
        case "email":
            return EmailNotifier()
        case "sms":
            return SmsNotifier()
        case _:
            raise ValueError(f"tipo inválido: {tipo}")
```

---

## Strategy

Strategy troca algoritmo em tempo de execução.

```python
from typing import Protocol

class FreteStrategy(Protocol):
    def calcular(self, peso: float) -> float:
        ...

class FreteNormal:
    def calcular(self, peso: float) -> float:
        return 10 + peso * 1.5

class FreteExpresso:
    def calcular(self, peso: float) -> float:
        return 20 + peso * 3

class Checkout:
    def __init__(self, frete: FreteStrategy):
        self._frete = frete

    def calcular_frete(self, peso: float) -> float:
        return self._frete.calcular(peso)
```

---

## Observer

Observer notifica interessados quando algo acontece.

```python
class EventoPedido:
    def __init__(self):
        self._observadores = []

    def registrar(self, observador):
        self._observadores.append(observador)

    def notificar(self, pedido):
        for observador in self._observadores:
            observador(pedido)
```

Uso:

```python
def enviar_email(pedido):
    print("email enviado", pedido)

evento = EventoPedido()
evento.registrar(enviar_email)
evento.notificar("pedido-1")
```

Funções tornam Observer simples em Python.

---

## Repository

Repository isola persistência.

```python
from typing import Protocol

class PedidoRepository(Protocol):
    def salvar(self, pedido: Pedido) -> None:
        ...

    def buscar(self, pedido_id) -> Pedido | None:
        ...
```

Implementação memória:

```python
class PedidoRepositoryMemoria:
    def __init__(self):
        self._dados = {}

    def salvar(self, pedido: Pedido) -> None:
        self._dados[pedido.id] = pedido

    def buscar(self, pedido_id) -> Pedido | None:
        return self._dados.get(pedido_id)
```

---

## Adapter

Adapter converte uma interface existente para a interface esperada pelo seu código.

```python
class GatewayPagamentoExterno:
    def charge(self, amount_cents: int, card_token: str) -> str:
        return "tx-123"

class PagamentoGateway:
    def __init__(self, externo: GatewayPagamentoExterno):
        self._externo = externo

    def pagar(self, centavos: int, token_cartao: str) -> str:
        return self._externo.charge(centavos, token_cartao)
```

Útil para isolar SDKs, APIs externas e bibliotecas que não seguem os nomes ou tipos do domínio.

---

## Command

Command transforma uma ação em objeto. É útil para filas, undo, auditoria, jobs e casos de uso.

```python
from dataclasses import dataclass

@dataclass
class ConfirmarPedidoCommand:
    pedido_id: str

class ConfirmarPedidoHandler:
    def __init__(self, repository):
        self._repository = repository

    def handle(self, command: ConfirmarPedidoCommand) -> None:
        pedido = self._repository.buscar(command.pedido_id)
        pedido.confirmar()
        self._repository.salvar(pedido)
```

Em aplicações maiores, commands ajudam a separar entrada da regra de aplicação.

---

## Builder

Builder constrói objetos complexos passo a passo. Em Python, use somente quando construtores simples ou factories ficariam confusos.

```python
class PedidoBuilder:
    def __init__(self):
        self._cliente = None
        self._itens = []

    def para_cliente(self, cliente: str) -> "PedidoBuilder":
        self._cliente = cliente
        return self

    def com_item(self, nome: str, valor: float) -> "PedidoBuilder":
        self._itens.append((nome, valor))
        return self

    def construir(self):
        pedido = Pedido(self._cliente)
        for nome, valor in self._itens:
            pedido.adicionar_item(nome, valor)
        return pedido
```

Builder é comum em testes, montagem de objetos de domínio e APIs fluentes.

---

## Template Method

Template Method define o esqueleto de um algoritmo na classe base e deixa etapas para subclasses.

```python
from abc import ABC, abstractmethod

class Relatorio(ABC):
    def gerar(self) -> str:
        dados = self.carregar_dados()
        corpo = self.formatar(dados)
        return self.adicionar_cabecalho(corpo)

    @abstractmethod
    def carregar_dados(self) -> list[dict]:
        ...

    @abstractmethod
    def formatar(self, dados: list[dict]) -> str:
        ...

    def adicionar_cabecalho(self, corpo: str) -> str:
        return "Relatório\n" + corpo
```

Use quando a ordem dos passos é estável. Se a variação principal for um algoritmo intercambiável, Strategy costuma ser mais flexível.

---

## Categorias de Patterns

Design patterns costumam ser agrupados em:

- criacionais: controlam criação de objetos, como Factory, Abstract Factory, Builder, Prototype e Singleton;
- estruturais: organizam composição entre objetos, como Adapter, Facade, Decorator, Composite e Proxy;
- comportamentais: coordenam comunicação e comportamento, como Strategy, Observer, Command, Template Method, Iterator e State.

Este arquivo apresenta alguns patterns essenciais. Para a separação completa por categoria, exemplos adicionais, Hexagonal Architecture e CQRS, veja `10_patterns_hexagonal_cqrs.md`.

---

## Arquitetura Limpa

Ideia central: regras de negócio não dependem de detalhes externos.

Camadas comuns:

- entidades;
- casos de uso;
- adaptadores;
- infraestrutura;
- interface.

Exemplo:

```text
app/
  domain/
    pedido.py
  application/
    confirmar_pedido.py
  infrastructure/
    sqlalchemy_pedido_repository.py
  presentation/
    api.py
```

Regra: dependências apontam para dentro.

---

## Arquiteturas Modernas

POO aparece em:

- APIs com FastAPI/Django;
- services;
- repositories;
- domain models;
- event handlers;
- workers;
- mensageria;
- microservices;
- hexagonal architecture;
- clean architecture;
- event-driven architecture.

Evite arquitetura pesada para problema simples. A arquitetura deve pagar seu custo.

---

## Boas Práticas

- Use patterns para resolver problemas reais.
- Evite pattern por vaidade.
- Mantenha domínio independente.
- Use Protocol para dependências.
- Teste casos de uso sem banco real.
- Prefira composição, injeção de dependência e funções quando forem mais simples.

---

## Exercícios

1. Aplique SRP em uma classe grande.
2. Crie Strategy para cálculo de desconto.
3. Crie Factory para notificador.
4. Crie Observer com funções.
5. Crie Repository em memória.
6. Crie Adapter para isolar uma API externa.
7. Crie Command e Handler para um caso de uso.
8. Crie Builder para montar objetos de teste.
9. Separe domínio e infraestrutura em pastas.
10. Modele um aggregate simples de pedido.
