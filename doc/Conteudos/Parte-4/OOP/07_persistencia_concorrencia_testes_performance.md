# Persistência, ORM, Concorrência, Testes, Segurança e Performance em POO

Este arquivo mostra como POO aparece em sistemas reais: persistência, ORMs, concorrência, paralelismo, testes, segurança, performance e engenharia de software.

---

## Sumário

1. [Persistência](#persistência)
2. [ORM](#orm)
3. [Unit of Work](#unit-of-work)
4. [Concorrência em POO](#concorrência-em-poo)
5. [Paralelismo em POO](#paralelismo-em-poo)
6. [Testes em POO](#testes-em-poo)
7. [Anti-patterns](#anti-patterns)
8. [Segurança em POO](#segurança-em-poo)
9. [Performance em POO](#performance-em-poo)
10. [Engenharia de Software Aplicada](#engenharia-de-software-aplicada)
11. [Boas Práticas](#boas-práticas)
12. [Exercícios](#exercícios)

---

## Persistência

Persistência salva objetos em algum armazenamento:

- banco relacional;
- NoSQL;
- arquivo;
- cache;
- fila;
- API externa.

Domínio não deve saber detalhes de SQL, HTTP ou framework.

```python
from typing import Protocol

class PedidoRepository(Protocol):
    def salvar(self, pedido: "Pedido") -> None:
        ...

    def buscar(self, pedido_id: str) -> "Pedido | None":
        ...
```

Implementação concreta:

```python
class PedidoRepositoryMemoria:
    def __init__(self):
        self._dados = {}

    def salvar(self, pedido):
        self._dados[pedido.id] = pedido

    def buscar(self, pedido_id):
        return self._dados.get(pedido_id)
```

---

## ORM

ORM mapeia objetos para tabelas.

Exemplo conceitual com SQLAlchemy:

```python
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

class Base(DeclarativeBase):
    pass

class UsuarioModel(Base):
    __tablename__ = "usuarios"

    id: Mapped[int] = mapped_column(primary_key=True)
    nome: Mapped[str]
    email: Mapped[str]
```

Separar model de banco e entidade de domínio pode ser útil em sistemas complexos.

```python
def model_para_entidade(model: UsuarioModel) -> Usuario:
    return Usuario(id=model.id, nome=model.nome, email=model.email)
```

Evite deixar regra de domínio presa ao ORM quando o domínio é importante.

---

## Unit of Work

Unit of Work coordena transação.

```python
class UnitOfWork:
    def __init__(self, session_factory):
        self._session_factory = session_factory

    def __enter__(self):
        self.session = self._session_factory()
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        if exc_type is None:
            self.session.commit()
        else:
            self.session.rollback()
        self.session.close()
        return False
```

Uso:

```python
with UnitOfWork(session_factory) as uow:
    uow.session.add(model)
```

---

## Concorrência em POO

Concorrência lida com várias tarefas em andamento.

Com threads:

```python
from threading import Lock, Thread

class ContadorSeguro:
    def __init__(self):
        self._valor = 0
        self._lock = Lock()

    def incrementar(self):
        with self._lock:
            self._valor += 1

    @property
    def valor(self):
        return self._valor
```

Objetos compartilhados precisam de cuidado.

### Async em objetos

```python
class ApiClient:
    async def buscar_usuario(self, user_id: int) -> dict:
        ...
```

Evite misturar métodos síncronos e assíncronos sem clareza.

---

## Paralelismo em POO

Paralelismo executa trabalho ao mesmo tempo, normalmente em múltiplos processos ou núcleos.

```python
from concurrent.futures import ProcessPoolExecutor

class Processador:
    def processar(self, valor: int) -> int:
        return valor * valor

def processar_valor(valor: int) -> int:
    return valor * valor

with ProcessPoolExecutor() as executor:
    resultados = list(executor.map(processar_valor, range(10)))
```

Para multiprocessing, funções de módulo são mais simples de serializar do que métodos complexos.

---

## Testes em POO

Teste comportamento, não implementação interna.

```python
def test_deposito_aumenta_saldo():
    conta = ContaBancaria("Ana", 100)

    conta.depositar(50)

    assert conta.saldo == 150
```

Teste exceções:

```python
import pytest

def test_saque_sem_saldo_falha():
    conta = ContaBancaria("Ana", 100)

    with pytest.raises(ValueError, match="saldo insuficiente"):
        conta.sacar(200)
```

Fake para dependência:

```python
class FakeEmailSender:
    def __init__(self):
        self.enviados = []

    def enviar(self, destino, assunto, corpo):
        self.enviados.append((destino, assunto, corpo))
```

---

## Anti-patterns

### God Object

Classe que faz tudo.

### Anemic Domain Model

Classe com dados, mas regras espalhadas em services.

### Inheritance Hell

Hierarquia profunda e difícil de mudar.

### Singleton Global

Estado global escondido que dificulta testes.

### Getter/Setter Automático Sem Regra

```python
class Pessoa:
    def get_nome(self): ...
    def set_nome(self, nome): ...
```

Em Python, atributo público é aceitável quando não há regra.

---

## Segurança em POO

Cuidados:

- não coloque segredo em atributo exposto em logs;
- cuidado com `__repr__` vazando token;
- valide invariantes;
- evite desserialização insegura;
- não confie em dados externos;
- sanitize dados antes de persistir;
- aplique princípio do menor privilégio.

Exemplo:

```python
class Credencial:
    def __init__(self, usuario: str, token: str):
        self.usuario = usuario
        self._token = token

    def __repr__(self) -> str:
        return f"Credencial(usuario={self.usuario!r}, token='***')"
```

---

## Performance em POO

POO pode gerar overhead se usada sem critério, mas raramente é o primeiro gargalo.

Técnicas:

- `__slots__` para muitas instâncias;
- `dataclass(slots=True)`;
- cache com `cached_property`;
- evitar objetos intermediários demais em loops críticos;
- usar estruturas nativas;
- medir antes de otimizar.

```python
from dataclasses import dataclass

@dataclass(slots=True)
class Ponto:
    x: float
    y: float
```

### Cache em objeto

```python
from functools import cached_property

class Relatorio:
    def __init__(self, vendas):
        self.vendas = vendas

    @cached_property
    def total(self):
        return sum(self.vendas)
```

---

## Engenharia de Software Aplicada

POO profissional envolve:

- versionamento;
- testes;
- documentação;
- observabilidade;
- logs;
- contratos;
- integração contínua;
- code review;
- design evolutivo.

Perguntas úteis:

- esta classe tem uma responsabilidade clara?
- consigo testar sem banco/API?
- a regra está no lugar certo?
- a dependência é detalhe ou contrato?
- a classe protege seus invariantes?
- consigo substituir implementação sem alterar domínio?

---

## Boas Práticas

- Teste comportamento público.
- Evite testar atributo interno.
- Use fakes para dependências.
- Use Protocol para contratos.
- Não vaze segredos em `__repr__`.
- Meça performance com dados reais.
- Use locks para estado compartilhado.
- Prefira imutabilidade quando possível.

---

## Exercícios

1. Crie repository em memória e teste com fake.
2. Crie Unit of Work com context manager.
3. Escreva testes para uma entidade com invariantes.
4. Refatore um God Object.
5. Proteja `__repr__` para não vazar segredo.
6. Compare dataclass normal e slots.
7. Crie contador thread-safe.

