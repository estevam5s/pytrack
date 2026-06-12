# ISP: Interface Segregation Principle

ISP é o Princípio da Segregação de Interfaces. Clientes não devem depender de métodos que não usam.

Em Python, interfaces podem ser implícitas por duck typing, explícitas por `typing.Protocol` ou nominais por `abc.ABC`. ISP recomenda contratos pequenos, coesos e orientados ao consumidor.

---

## Problema: Interface Grande

```python
from abc import ABC, abstractmethod


class RepositorioCompleto(ABC):
    @abstractmethod
    def salvar(self, obj): ...

    @abstractmethod
    def buscar_por_id(self, id: int): ...

    @abstractmethod
    def listar(self): ...

    @abstractmethod
    def deletar(self, id: int): ...

    @abstractmethod
    def exportar_csv(self): ...

    @abstractmethod
    def sincronizar(self): ...
```

Uma classe que só precisa buscar por ID depende de métodos de escrita, exportação e sincronização.

---

## Contratos Mínimos

```python
from typing import Protocol


class BuscaPedidoPorId(Protocol):
    def buscar_por_id(self, id: int):
        ...


class SalvaPedido(Protocol):
    def salvar(self, pedido) -> None:
        ...


class ListaPedidos(Protocol):
    def listar(self, limite: int = 50) -> list:
        ...
```

Cada consumidor depende apenas do que usa.

---

## Interface Orientada ao Consumidor

```python
class BuscarPedidoUseCase:
    def __init__(self, repositorio: BuscaPedidoPorId) -> None:
        self.repositorio = repositorio

    def executar(self, id: int):
        return self.repositorio.buscar_por_id(id)
```

O caso de uso não precisa saber se o repositório salva, lista ou exporta.

---

## Separação por Papel

```python
class LeitorArquivo(Protocol):
    def ler(self, caminho: str) -> bytes:
        ...


class EscritorArquivo(Protocol):
    def escrever(self, caminho: str, conteudo: bytes) -> None:
        ...


class RemovedorArquivo(Protocol):
    def remover(self, caminho: str) -> None:
        ...
```

Um serviço de importação pode depender apenas de `LeitorArquivo`.

---

## Composição de Interfaces

Quando precisa de mais de uma capacidade:

```python
class Storage(LeitorArquivo, EscritorArquivo, Protocol):
    pass
```

Ou injete dependências separadas:

```python
class CopiarArquivo:
    def __init__(self, leitor: LeitorArquivo, escritor: EscritorArquivo) -> None:
        self.leitor = leitor
        self.escritor = escritor
```

Separado costuma ser mais flexível.

---

## ISP com ABCs Menores

```python
class Leitor(ABC):
    @abstractmethod
    def ler(self, id: int):
        raise NotImplementedError


class Escritor(ABC):
    @abstractmethod
    def salvar(self, obj) -> None:
        raise NotImplementedError
```

ABCs pequenas evitam implementações artificiais.

---

## Evitando Métodos Desnecessários

Violação comum:

```python
class RelatorioSomenteLeitura(RepositorioCompleto):
    def salvar(self, obj):
        raise NotImplementedError

    def deletar(self, id: int):
        raise NotImplementedError
```

Se a implementação precisa lançar `NotImplementedError`, a interface está grande ou errada.

---

## Protocols Específicos

```python
class EnviaEmail(Protocol):
    def enviar_email(self, email: str, assunto: str, corpo: str) -> None:
        ...


class EnviaPush(Protocol):
    def enviar_push(self, usuario_id: int, mensagem: str) -> None:
        ...
```

Evite:

```python
class Notificador(Protocol):
    def enviar_email(...): ...
    def enviar_sms(...): ...
    def enviar_push(...): ...
```

Nem todo notificador precisa suportar todos os canais.

---

## ISP e Testabilidade

Contratos pequenos facilitam fakes.

```python
class FakeBuscaPedido:
    def __init__(self, pedidos: dict[int, object]) -> None:
        self.pedidos = pedidos

    def buscar_por_id(self, id: int):
        return self.pedidos.get(id)
```

O fake não implementa métodos irrelevantes.

---

## ISP e APIs Internas

Módulos de alto nível devem declarar o que precisam.

```python
class PublicarEvento(Protocol):
    def publicar(self, topico: str, payload: dict) -> None:
        ...


class CriarPedido:
    def __init__(self, eventos: PublicarEvento) -> None:
        self.eventos = eventos
```

O caso de uso não depende de Kafka, RabbitMQ, SQS ou Redis completos.

---

## ISP vs DRY

Às vezes interfaces pequenas parecem repetitivas. Mas DRY não deve unir conceitos que mudam por razões diferentes.

Ruim:

```python
class TudoDoUsuario(Protocol):
    def buscar_usuario(self): ...
    def salvar_usuario(self): ...
    def validar_senha(self): ...
    def enviar_reset(self): ...
```

Melhor separar por papel, mesmo com mais nomes.

---

## Sinais de Violação do ISP

- classes implementam métodos vazios;
- métodos lançam `NotImplementedError`;
- fakes de teste precisam implementar métodos irrelevantes;
- cliente recebe dependência poderosa demais;
- mudança em método não usado quebra cliente;
- interface tem baixa coesão;
- contrato representa fornecedor, não consumidor.

---

## Checklist ISP

- o cliente usa todos os métodos da interface?
- a interface é orientada ao consumidor?
- existem métodos opcionais demais?
- uma implementação precisa lançar `NotImplementedError`?
- Protocols menores deixariam testes mais simples?
- capacidades diferentes estão misturadas?
- composição de interfaces é necessária ou dependências separadas bastam?
- o contrato mínimo comunica melhor a intenção?

