# DIP: Dependency Inversion Principle

DIP é o Princípio da Inversão de Dependência. Módulos de alto nível não devem depender de módulos de baixo nível. Ambos devem depender de abstrações. Abstrações não devem depender de detalhes; detalhes devem depender de abstrações.

Em Python, DIP aparece com `Protocol`, ABCs, injeção de dependência, adapters, repositories, services, factories e containers de dependência.

---

## Alto Nível vs Baixo Nível

Módulo de alto nível contém regra importante de negócio:

- criar pedido;
- aprovar pagamento;
- calcular frete;
- cancelar assinatura.

Módulo de baixo nível é detalhe técnico:

- PostgreSQL;
- Redis;
- SMTP;
- HTTP client;
- filesystem;
- framework web.

DIP protege a regra de negócio dos detalhes.

---

## Violação: Caso de Uso Depende de SQLite e SMTP

```python
import sqlite3
import smtplib


class CriarPedido:
    def executar(self, email: str, total: float) -> int:
        conn = sqlite3.connect("app.db")
        cursor = conn.cursor()
        cursor.execute("INSERT INTO pedidos (email, total) VALUES (?, ?)", (email, total))
        pedido_id = cursor.lastrowid
        conn.commit()
        conn.close()

        smtp = smtplib.SMTP("smtp.example.com")
        smtp.sendmail("loja@example.com", email, "Pedido criado")
        smtp.quit()

        return pedido_id
```

Problemas:

- regra depende de infraestrutura;
- teste exige banco e SMTP ou mocks complexos;
- trocar SQLite por PostgreSQL altera caso de uso;
- trocar e-mail por fila altera caso de uso.

---

## Dependendo de Abstrações

```python
from typing import Protocol


class PedidoRepository(Protocol):
    def criar(self, email: str, total: float) -> int:
        ...


class NotificadorPedido(Protocol):
    def pedido_criado(self, email: str, pedido_id: int) -> None:
        ...


class CriarPedido:
    def __init__(self, pedidos: PedidoRepository, notificador: NotificadorPedido) -> None:
        self.pedidos = pedidos
        self.notificador = notificador

    def executar(self, email: str, total: float) -> int:
        if total <= 0:
            raise ValueError("Total inválido")
        pedido_id = self.pedidos.criar(email, total)
        self.notificador.pedido_criado(email, pedido_id)
        return pedido_id
```

Agora o caso de uso depende de contratos.

---

## Implementação de Baixo Nível

```python
import sqlite3


class SQLitePedidoRepository:
    def __init__(self, db_path: str) -> None:
        self.db_path = db_path

    def criar(self, email: str, total: float) -> int:
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("INSERT INTO pedidos (email, total) VALUES (?, ?)", (email, total))
            return int(cursor.lastrowid)
```

O detalhe implementa o contrato exigido pelo caso de uso.

---

## Adapter

Adapter converte interface de uma biblioteca externa para o contrato interno.

```python
class SMTPNotificadorPedido:
    def __init__(self, smtp_client) -> None:
        self.smtp_client = smtp_client

    def pedido_criado(self, email: str, pedido_id: int) -> None:
        self.smtp_client.sendmail(
            "loja@example.com",
            email,
            f"Pedido {pedido_id} criado",
        )
```

O caso de uso não conhece SMTP.

---

## Injeção de Dependência

Manual:

```python
repo = SQLitePedidoRepository("app.db")
notificador = SMTPNotificadorPedido(smtp_client)
use_case = CriarPedido(repo, notificador)
```

Injeção pelo framework:

```python
def get_criar_pedido() -> CriarPedido:
    return CriarPedido(
        pedidos=SQLitePedidoRepository("app.db"),
        notificador=SMTPNotificadorPedido(smtp_client),
    )
```

Não é obrigatório usar container sofisticado. Composição explícita costuma ser suficiente.

---

## Factories

Factory centraliza criação de objetos.

```python
class UseCaseFactory:
    def __init__(self, settings) -> None:
        self.settings = settings

    def criar_pedido(self) -> CriarPedido:
        return CriarPedido(
            pedidos=SQLitePedidoRepository(self.settings.db_path),
            notificador=SMTPNotificadorPedido(criar_smtp(self.settings)),
        )
```

Factories reduzem espalhamento de construção.

---

## Container de Dependência

Para aplicações maiores:

```python
class Container:
    def __init__(self, settings) -> None:
        self.settings = settings

    def pedido_repository(self) -> PedidoRepository:
        return SQLitePedidoRepository(self.settings.db_path)

    def notificador_pedido(self) -> NotificadorPedido:
        return SMTPNotificadorPedido(criar_smtp(self.settings))

    def criar_pedido(self) -> CriarPedido:
        return CriarPedido(self.pedido_repository(), self.notificador_pedido())
```

Containers ajudam, mas podem esconder dependências se usados sem disciplina.

---

## Testabilidade com Fakes

```python
class FakePedidoRepository:
    def __init__(self) -> None:
        self.criados = []

    def criar(self, email: str, total: float) -> int:
        self.criados.append((email, total))
        return 123


class FakeNotificador:
    def __init__(self) -> None:
        self.enviados = []

    def pedido_criado(self, email: str, pedido_id: int) -> None:
        self.enviados.append((email, pedido_id))


def test_criar_pedido():
    repo = FakePedidoRepository()
    notificador = FakeNotificador()
    use_case = CriarPedido(repo, notificador)

    pedido_id = use_case.executar("ana@example.com", 100)

    assert pedido_id == 123
    assert repo.criados == [("ana@example.com", 100)]
    assert notificador.enviados == [("ana@example.com", 123)]
```

Sem banco. Sem SMTP. Teste rápido e confiável.

---

## DIP em Arquitetura Limpa

Dependências devem apontar para dentro:

```text
Framework/API  ->  Use Cases  ->  Domain
Database       ->  Interfaces definidas no núcleo
Email          ->  Interfaces definidas no núcleo
```

O domínio não importa FastAPI, Flask, SQLAlchemy, Redis ou boto3.

---

## DIP Não É Apenas Passar Tudo no Construtor

Excesso:

```python
class Servico:
    def __init__(self, a, b, c, d, e, f, g, h) -> None:
        ...
```

Construtor gigante pode indicar:

- classe com responsabilidades demais;
- dependências que deveriam estar agrupadas;
- caso de uso muito amplo;
- ausência de objetos de domínio.

---

## Sinais de Violação do DIP

- regra de negócio importa biblioteca de infraestrutura;
- testes precisam de banco para regras puras;
- trocar provedor exige alterar caso de uso;
- código instancia dependências concretas no meio da lógica;
- framework aparece dentro do domínio;
- mocks são difíceis porque dependências estão escondidas;
- funções chamam `requests`, SMTP ou banco diretamente em todo lugar.

---

## Checklist DIP

- módulos de alto nível dependem de abstrações?
- detalhes implementam contratos do núcleo?
- dependências são injetadas de forma explícita?
- regra de negócio não importa framework?
- repositórios e adaptadores ficam fora do domínio?
- testes usam fakes simples?
- factories centralizam criação?
- containers não escondem dependências demais?
- abstrações são estáveis e orientadas ao consumidor?
- a inversão reduziu acoplamento real?

