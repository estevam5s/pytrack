# Design Patterns por Categoria, Hexagonal Architecture e CQRS

Este módulo complementa a trilha de POO com uma visão organizada de patterns criacionais, estruturais e comportamentais, além de arquiteturas usadas em sistemas profissionais: Clean Architecture, Hexagonal Architecture e CQRS.

---

## Sumário

1. [Princípios de Design](#princípios-de-design)
2. [Patterns Criacionais](#patterns-criacionais)
3. [Patterns Estruturais](#patterns-estruturais)
4. [Patterns Comportamentais](#patterns-comportamentais)
5. [Clean Architecture](#clean-architecture)
6. [Hexagonal Architecture](#hexagonal-architecture)
7. [CQRS](#cqrs)
8. [Como Escolher](#como-escolher)
9. [Boas Práticas](#boas-práticas)
10. [Exercícios](#exercícios)

---

## Princípios de Design

Antes de patterns, aplique princípios simples:

- SOLID: cinco princípios para reduzir acoplamento e melhorar substituição, extensão e testabilidade.
- DRY: não duplique conhecimento de negócio.
- KISS: mantenha o desenho simples o bastante para ser entendido e operado.
- YAGNI: não implemente flexibilidade antes de existir necessidade real.

Patterns são ferramentas, não metas. Se um pattern adiciona camadas sem reduzir complexidade real, ele piora o sistema.

---

## Patterns Criacionais

Criacionais controlam como objetos são construídos.

### Factory Method

```python
class EmailNotifier:
    def enviar(self, destino: str, mensagem: str) -> None:
        print("email", destino, mensagem)

class SmsNotifier:
    def enviar(self, destino: str, mensagem: str) -> None:
        print("sms", destino, mensagem)

def criar_notificador(tipo: str):
    if tipo == "email":
        return EmailNotifier()
    if tipo == "sms":
        return SmsNotifier()
    raise ValueError(f"tipo inválido: {tipo}")
```

Use quando a escolha da implementação depende de configuração, entrada ou ambiente.

### Abstract Factory

Cria famílias de objetos relacionados.

```python
class DarkThemeFactory:
    def botao(self):
        return BotaoEscuro()

    def caixa_texto(self):
        return CaixaTextoEscura()

class LightThemeFactory:
    def botao(self):
        return BotaoClaro()

    def caixa_texto(self):
        return CaixaTextoClaro()
```

Use quando várias implementações precisam ser compatíveis entre si.

### Builder

Constrói objeto complexo passo a passo.

```python
class RelatorioBuilder:
    def __init__(self):
        self._secoes = []

    def com_titulo(self, titulo: str) -> "RelatorioBuilder":
        self._secoes.append(f"# {titulo}")
        return self

    def com_tabela(self, nome: str) -> "RelatorioBuilder":
        self._secoes.append(f"tabela: {nome}")
        return self

    def construir(self) -> str:
        return "\n".join(self._secoes)
```

Use quando o construtor teria muitos parâmetros ou etapas opcionais.

### Prototype

Cria objetos a partir de cópias.

```python
from copy import deepcopy

modelo = {"tipo": "relatorio", "filtros": {"ano": 2026}}
novo = deepcopy(modelo)
novo["filtros"]["ano"] = 2027
```

Em Python, `copy.copy`, `copy.deepcopy`, dataclasses com `replace` e métodos `clone` resolvem muitos casos.

### Singleton

Garante uma instância única, mas deve ser usado com cuidado. Em Python, módulo, injeção de dependência ou cache explícito costuma ser mais simples e testável.

---

## Patterns Estruturais

Estruturais organizam composição entre objetos.

### Adapter

Adapta interface externa para interface interna.

```python
class GatewayExterno:
    def charge(self, cents: int) -> str:
        return "tx-1"

class PagamentoAdapter:
    def __init__(self, gateway: GatewayExterno):
        self._gateway = gateway

    def pagar(self, centavos: int) -> str:
        return self._gateway.charge(centavos)
```

Use para isolar SDKs, APIs externas e bibliotecas.

### Facade

Expõe uma API simples sobre subsistemas.

```python
class CheckoutFacade:
    def __init__(self, estoque, pagamento, nota_fiscal):
        self._estoque = estoque
        self._pagamento = pagamento
        self._nota_fiscal = nota_fiscal

    def finalizar(self, pedido):
        self._estoque.reservar(pedido)
        self._pagamento.cobrar(pedido)
        self._nota_fiscal.emitir(pedido)
```

Use quando o cliente não deve conhecer vários serviços internos.

### Decorator

Adiciona comportamento envolvendo outro objeto com a mesma interface.

```python
class RepositorioComLog:
    def __init__(self, repositorio):
        self._repositorio = repositorio

    def salvar(self, pedido):
        print("salvando pedido", pedido.id)
        return self._repositorio.salvar(pedido)
```

Não confunda com decorator syntax `@decorator`, embora a ideia de "envolver" seja parecida.

### Composite

Trata objetos individuais e grupos de forma uniforme.

```python
class ItemMenu:
    def exibir(self) -> str:
        raise NotImplementedError

class Link(ItemMenu):
    def __init__(self, texto: str):
        self.texto = texto

    def exibir(self) -> str:
        return self.texto

class GrupoMenu(ItemMenu):
    def __init__(self):
        self._itens: list[ItemMenu] = []

    def adicionar(self, item: ItemMenu) -> None:
        self._itens.append(item)

    def exibir(self) -> str:
        return " / ".join(item.exibir() for item in self._itens)
```

Use em árvores, menus, expressões, componentes e estruturas hierárquicas.

### Proxy

Controla acesso a outro objeto.

```python
class RepositorioCacheProxy:
    def __init__(self, repositorio):
        self._repositorio = repositorio
        self._cache = {}

    def buscar(self, pedido_id: str):
        if pedido_id not in self._cache:
            self._cache[pedido_id] = self._repositorio.buscar(pedido_id)
        return self._cache[pedido_id]
```

Use para cache, lazy loading, autorização, logging ou acesso remoto.

---

## Patterns Comportamentais

Comportamentais coordenam comunicação e decisões.

### Strategy

Troca algoritmo por composição.

```python
class CalculadoraFrete:
    def __init__(self, estrategia):
        self._estrategia = estrategia

    def calcular(self, peso: float) -> float:
        return self._estrategia.calcular(peso)
```

Use quando há várias regras intercambiáveis.

### Observer

Notifica interessados sobre eventos.

```python
class EventBus:
    def __init__(self):
        self._handlers = {}

    def registrar(self, evento: str, handler):
        self._handlers.setdefault(evento, []).append(handler)

    def publicar(self, evento: str, payload: dict):
        for handler in self._handlers.get(evento, []):
            handler(payload)
```

Use para eventos de domínio, notificações e desacoplamento.

### Command

Representa uma ação como objeto.

```python
from dataclasses import dataclass

@dataclass(frozen=True)
class ConfirmarPedido:
    pedido_id: str

class ConfirmarPedidoHandler:
    def __init__(self, repository):
        self._repository = repository

    def handle(self, command: ConfirmarPedido) -> None:
        pedido = self._repository.buscar(command.pedido_id)
        pedido.confirmar()
        self._repository.salvar(pedido)
```

Use para casos de uso, filas, auditoria e CQRS.

### Template Method

Classe base define fluxo e subclasses customizam etapas.

```python
class ImportadorBase:
    def importar(self, caminho: str):
        bruto = self.ler(caminho)
        dados = self.parsear(bruto)
        return self.validar(dados)

    def ler(self, caminho: str):
        raise NotImplementedError

    def parsear(self, bruto):
        raise NotImplementedError

    def validar(self, dados):
        return dados
```

### Iterator

Expõe iteração sem revelar estrutura interna.

```python
class Pedidos:
    def __init__(self, itens):
        self._itens = itens

    def __iter__(self):
        return iter(self._itens)
```

### State

Muda comportamento conforme estado.

```python
class Pedido:
    def __init__(self):
        self.status = "rascunho"

    def confirmar(self):
        if self.status != "rascunho":
            raise ValueError("somente rascunho pode confirmar")
        self.status = "confirmado"
```

Para fluxos complexos, extraia estados para classes separadas. Para fluxos simples, uma validação explícita é melhor.

---

## Clean Architecture

Clean Architecture separa regra de negócio de detalhes externos.

Direção das dependências:

```text
interface/adapters -> application -> domain
infrastructure ----^
```

Camadas comuns:

- domain: entidades, value objects, regras centrais;
- application: casos de uso, comandos, queries, portas;
- infrastructure: banco, filas, APIs externas, frameworks;
- presentation: HTTP, CLI, UI.

Regra: domínio não importa framework, ORM, HTTP ou banco.

---

## Hexagonal Architecture

Hexagonal Architecture, ou Ports and Adapters, protege o domínio por meio de portas.

```text
             HTTP Adapter
                  ↓
CLI Adapter -> Application Core <- Worker Adapter
                  ↓
        Ports: Repository, EmailSender
                  ↓
       SQL Adapter, SMTP Adapter, API Adapter
```

Porta de saída:

```python
from typing import Protocol

class PedidoRepository(Protocol):
    def salvar(self, pedido: "Pedido") -> None:
        ...

    def buscar(self, pedido_id: str) -> "Pedido | None":
        ...
```

Caso de uso:

```python
class ConfirmarPedidoUseCase:
    def __init__(self, repository: PedidoRepository):
        self._repository = repository

    def executar(self, pedido_id: str) -> None:
        pedido = self._repository.buscar(pedido_id)
        if pedido is None:
            raise ValueError("pedido não encontrado")
        pedido.confirmar()
        self._repository.salvar(pedido)
```

Adaptador SQL:

```python
class SqlPedidoRepository:
    def __init__(self, session):
        self._session = session

    def salvar(self, pedido):
        self._session.add(pedido)

    def buscar(self, pedido_id):
        return self._session.get(Pedido, pedido_id)
```

Benefício: troca HTTP por CLI, SQL por memória, SMTP por fake, sem alterar domínio/caso de uso.

---

## CQRS

CQRS, Command Query Responsibility Segregation, separa escrita de leitura.

- Command: muda estado.
- Query: consulta estado.

Command:

```python
@dataclass(frozen=True)
class CriarPedidoCommand:
    cliente_id: str
    itens: list[str]

class CriarPedidoHandler:
    def __init__(self, repository):
        self._repository = repository

    def handle(self, command: CriarPedidoCommand) -> str:
        pedido = Pedido.criar(command.cliente_id, command.itens)
        self._repository.salvar(pedido)
        return pedido.id
```

Query:

```python
@dataclass(frozen=True)
class BuscarPedidoQuery:
    pedido_id: str

class BuscarPedidoHandler:
    def __init__(self, read_model):
        self._read_model = read_model

    def handle(self, query: BuscarPedidoQuery) -> dict | None:
        return self._read_model.buscar_pedido(query.pedido_id)
```

Use CQRS quando:

- leitura e escrita têm modelos muito diferentes;
- consultas precisam ser otimizadas sem contaminar o domínio;
- há eventos e projeções;
- auditoria e workflows são importantes.

Evite CQRS quando CRUD simples resolve. CQRS adiciona objetos, handlers, modelos e coordenação.

---

## Como Escolher

| Problema | Boa escolha |
| --- | --- |
| criar objetos por configuração | Factory |
| criar família de objetos compatíveis | Abstract Factory |
| montar objeto complexo | Builder |
| adaptar SDK externo | Adapter |
| simplificar vários subsistemas | Facade |
| adicionar cache/log/autorização | Decorator ou Proxy |
| trocar algoritmo | Strategy |
| reagir a eventos | Observer |
| modelar caso de uso ou fila | Command |
| proteger domínio de infraestrutura | Hexagonal Architecture |
| separar leitura e escrita complexas | CQRS |

---

## Boas Práticas

- Prefira composição a herança para variar comportamento.
- Use Protocols para portas quando o contrato estrutural basta.
- Use ABC quando quer contrato nominal forte.
- Não aplique todos os patterns em projeto pequeno.
- Nomeie classes pelo domínio, não pelo pattern, quando possível.
- Teste casos de uso com fakes em memória.
- Mantenha domínio livre de framework.
- Use CQRS apenas quando há diferença real entre modelo de escrita e leitura.
- Documente decisões arquiteturais e trade-offs.

---

## Exercícios

1. Classifique Factory, Adapter, Strategy, Observer e Command por categoria.
2. Crie Abstract Factory para famílias de notificadores.
3. Crie Facade para finalizar checkout.
4. Crie Decorator de cache para repository.
5. Modele Composite para menu ou árvore de categorias.
6. Crie EventBus com Observer.
7. Modele um caso de uso com Command Handler.
8. Refatore um service para Hexagonal Architecture.
9. Separe command e query em um fluxo CQRS simples.
10. Explique quando CQRS seria exagero.
