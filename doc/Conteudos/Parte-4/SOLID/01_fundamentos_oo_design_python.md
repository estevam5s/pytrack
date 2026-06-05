# Fundamentos de OO, Tipagem e Design em Python

Antes de aplicar SOLID, é preciso entender os conceitos de orientação a objetos e design que sustentam os princípios: classe, objeto, método, atributo, encapsulamento, herança, composição, polimorfismo, abstração, duck typing, structural typing, nominal typing, contratos, coesão e acoplamento.

Python é uma linguagem multiparadigma. Você pode escrever código procedural, funcional e orientado a objetos. SOLID é mais útil quando há colaboração entre objetos, regras de negócio e dependências externas.

---

## Classe, Objeto, Método e Atributo

Classe é um molde. Objeto é uma instância.

```python
class Cliente:
    def __init__(self, nome: str, email: str) -> None:
        self.nome = nome
        self.email = email

    def alterar_email(self, novo_email: str) -> None:
        if "@" not in novo_email:
            raise ValueError("E-mail inválido")
        self.email = novo_email


cliente = Cliente("Ana", "ana@example.com")
cliente.alterar_email("ana.souza@example.com")
```

- `nome` e `email` são atributos.
- `alterar_email` é método.
- `cliente` é objeto.

---

## Encapsulamento

Encapsulamento é proteger invariantes e esconder detalhes internos.

```python
class Conta:
    def __init__(self) -> None:
        self._saldo = 0

    @property
    def saldo(self) -> int:
        return self._saldo

    def depositar(self, valor: int) -> None:
        if valor <= 0:
            raise ValueError("Valor deve ser positivo")
        self._saldo += valor
```

O atributo `_saldo` não deve ser alterado diretamente. A regra passa por métodos que validam o estado.

---

## Dataclasses

Use `dataclasses` para objetos de dados simples.

```python
from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class PedidoCriado:
    pedido_id: int
    cliente_id: int
    criado_em: datetime
```

`frozen=True` torna o objeto imutável, útil para eventos, value objects e mensagens.

---

## Herança

Herança expressa relação "é um".

```python
class Notificador:
    def enviar(self, destino: str, mensagem: str) -> None:
        raise NotImplementedError


class NotificadorEmail(Notificador):
    def enviar(self, destino: str, mensagem: str) -> None:
        print(f"Email para {destino}: {mensagem}")
```

Herança inadequada é uma das maiores fontes de violações de LSP. Use com cuidado.

---

## Composição

Composição expressa relação "tem um" ou "usa um".

```python
class ServicoPedido:
    def __init__(self, notificador: NotificadorEmail) -> None:
        self.notificador = notificador

    def confirmar(self, email: str) -> None:
        self.notificador.enviar(email, "Pedido confirmado")
```

Composição costuma ser mais flexível que herança.

---

## Polimorfismo

Polimorfismo permite usar objetos diferentes pelo mesmo contrato.

```python
class NotificadorEmail:
    def enviar(self, destino: str, mensagem: str) -> None:
        print("email")


class NotificadorSMS:
    def enviar(self, destino: str, mensagem: str) -> None:
        print("sms")


def avisar(notificador, destino: str, mensagem: str) -> None:
    notificador.enviar(destino, mensagem)
```

Em Python, o objeto não precisa herdar de uma classe base se possui o comportamento esperado. Isso é duck typing.

---

## Duck Typing

"Se anda como pato e faz som de pato, pode ser tratado como pato."

```python
class CsvExporter:
    def exportar(self, dados: list[dict]) -> bytes:
        return b"csv"


class JsonExporter:
    def exportar(self, dados: list[dict]) -> bytes:
        return b"json"


def gerar_arquivo(exporter, dados: list[dict]) -> bytes:
    return exporter.exportar(dados)
```

Esse estilo é natural em Python, mas em sistemas grandes contratos explícitos ajudam.

---

## Structural Typing com Protocol

`Protocol` define contrato por estrutura, não por herança.

```python
from typing import Protocol


class Exporter(Protocol):
    def exportar(self, dados: list[dict]) -> bytes:
        ...


def gerar_arquivo(exporter: Exporter, dados: list[dict]) -> bytes:
    return exporter.exportar(dados)
```

Qualquer classe com método compatível satisfaz o protocolo.

---

## Nominal Typing com ABC

`ABC` exige herança explícita.

```python
from abc import ABC, abstractmethod


class RepositorioPedidos(ABC):
    @abstractmethod
    def salvar(self, pedido: "Pedido") -> None:
        raise NotImplementedError
```

Use ABC quando você quer uma hierarquia nominal e controle explícito de implementação.

---

## Type Hints

Type hints tornam contratos mais claros.

```python
def calcular_total(precos: list[float]) -> float:
    return sum(precos)
```

Eles não substituem testes nem validação em runtime, mas melhoram leitura, autocomplete e análise estática.

---

## Contratos de Comportamento

Contrato não é apenas assinatura. Também envolve comportamento esperado.

```python
class Repositorio:
    def buscar(self, id: int):
        """Retorna objeto ou None quando não encontrado."""
```

Se uma implementação lança exceção quando não encontra, ela pode quebrar clientes que esperam `None`.

---

## Acoplamento

Acoplamento mede quanto uma parte depende de outra.

Alto acoplamento:

```python
class ServicoPedido:
    def confirmar(self, pedido_id: int) -> None:
        smtp = SMTP("smtp.example.com")
        smtp.enviar("cliente@example.com", "Confirmado")
```

Baixo acoplamento:

```python
class ServicoPedido:
    def __init__(self, notificador) -> None:
        self.notificador = notificador

    def confirmar(self, email: str) -> None:
        self.notificador.enviar(email, "Confirmado")
```

---

## Coesão

Coesão mede quanto os elementos de uma unidade pertencem ao mesmo propósito.

Baixa coesão:

```python
class PedidoUtils:
    def calcular_total(self): ...
    def enviar_email(self): ...
    def renderizar_html(self): ...
    def salvar_no_banco(self): ...
```

Alta coesão:

```python
class CalculadoraTotalPedido:
    def calcular(self, itens): ...
```

---

## Design Orientado a Objetos em Python

Bom OO em Python:

- usa objetos para representar comportamento e estado relevante;
- usa funções quando comportamento é simples e sem estado;
- prefere composição a herança;
- mantém classes pequenas e coesas;
- usa contratos explícitos quando reduz ambiguidade;
- evita hierarquias profundas;
- coloca regra de negócio longe de frameworks e banco.

---

## Checklist de Fundamentos

- a classe tem propósito claro?
- métodos protegem invariantes?
- composição resolveria melhor que herança?
- contrato é estrutural (`Protocol`) ou nominal (`ABC`)?
- type hints comunicam intenção?
- objetos de dados poderiam ser dataclasses?
- acoplamento com infraestrutura está controlado?
- coesão da unidade é alta?

