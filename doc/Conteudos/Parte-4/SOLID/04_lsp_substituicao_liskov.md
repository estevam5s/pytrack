# LSP: Liskov Substitution Principle

LSP é o Princípio da Substituição de Liskov. Subtipos devem poder substituir seus tipos base sem quebrar expectativas do cliente.

Em termos práticos: se uma função espera uma classe base, qualquer classe derivada deve funcionar corretamente ali, preservando contratos, pré-condições, pós-condições e invariantes.

---

## Exemplo Clássico: Retângulo e Quadrado

Parece natural:

```python
class Retangulo:
    def __init__(self, largura: int, altura: int) -> None:
        self.largura = largura
        self.altura = altura

    def area(self) -> int:
        return self.largura * self.altura


class Quadrado(Retangulo):
    def __init__(self, lado: int) -> None:
        super().__init__(lado, lado)

    def set_largura(self, largura: int) -> None:
        self.largura = largura
        self.altura = largura
```

Problema:

```python
def redimensionar(retangulo: Retangulo) -> None:
    retangulo.largura = 10
    retangulo.altura = 5
    assert retangulo.area() == 50
```

Um quadrado não preserva a expectativa de largura e altura independentes. A relação matemática "quadrado é retângulo" não garante substituibilidade comportamental no modelo mutável.

---

## Contratos

Contrato envolve:

- assinatura de métodos;
- tipos aceitos;
- exceções esperadas;
- efeitos colaterais;
- pré-condições;
- pós-condições;
- invariantes;
- semântica.

LSP é violado quando subtipo muda o contrato de forma incompatível.

---

## Pré-Condições

Subclasse não deve exigir mais do que a classe base.

Ruim:

```python
class Exportador:
    def exportar(self, dados: list[dict]) -> bytes:
        return b""


class ExportadorCsv(Exportador):
    def exportar(self, dados: list[dict]) -> bytes:
        if len(dados) > 1000:
            raise ValueError("CSV aceita no máximo 1000 linhas")
        return b"csv"
```

Se o contrato base aceita qualquer lista, o subtipo restringiu a pré-condição.

---

## Pós-Condições

Subclasse não deve entregar menos do que a classe base promete.

```python
class Repositorio:
    def salvar(self, entidade) -> int:
        """Salva e retorna o ID."""
        return 1


class RepositorioMemoria(Repositorio):
    def salvar(self, entidade) -> int:
        return None  # viola contrato
```

---

## Invariantes

Invariante é uma regra que sempre deve permanecer verdadeira.

```python
class Conta:
    def __init__(self) -> None:
        self.saldo = 0

    def sacar(self, valor: int) -> None:
        if valor > self.saldo:
            raise ValueError("Saldo insuficiente")
        self.saldo -= valor
```

Subclasse que permite saldo negativo quebra invariante se o contrato diz que saldo nunca fica negativo.

---

## Herança Inadequada

```python
class Ave:
    def voar(self) -> None:
        print("voando")


class Pinguim(Ave):
    def voar(self) -> None:
        raise NotImplementedError("Pinguim não voa")
```

O problema é o contrato da base. Nem toda ave voa.

Melhor:

```python
from typing import Protocol


class Voador(Protocol):
    def voar(self) -> None:
        ...


class Andorinha:
    def voar(self) -> None:
        print("voando")
```

Separe capacidades.

---

## Polimorfismo Seguro

```python
class Notificador(Protocol):
    def enviar(self, destino: str, mensagem: str) -> None:
        ...


class EmailNotificador:
    def enviar(self, destino: str, mensagem: str) -> None:
        if "@" not in destino:
            raise ValueError("E-mail inválido")


class SmsNotificador:
    def enviar(self, destino: str, mensagem: str) -> None:
        if not destino.startswith("+"):
            raise ValueError("Telefone inválido")
```

Esse protocolo pode estar ruim: `destino` tem semântica diferente para cada implementação. O cliente não sabe qual formato passar.

Melhor separar contratos:

```python
class EmailSender(Protocol):
    def enviar_email(self, email: str, mensagem: str) -> None:
        ...


class SmsSender(Protocol):
    def enviar_sms(self, telefone: str, mensagem: str) -> None:
        ...
```

LSP e ISP se conectam.

---

## Exceções e LSP

Subtipos não devem lançar exceções inesperadas para casos válidos no tipo base.

```python
class Storage:
    def salvar(self, nome: str, conteudo: bytes) -> None:
        """Salva qualquer conteúdo bytes."""


class ImageStorage(Storage):
    def salvar(self, nome: str, conteudo: bytes) -> None:
        if not nome.endswith(".png"):
            raise ValueError("Apenas PNG")
```

`ImageStorage` não substitui `Storage`. Ele tem contrato mais específico.

---

## LSP com Protocols

Mesmo sem herança, LSP vale para contratos estruturais.

```python
class Cache(Protocol):
    def get(self, chave: str) -> str | None:
        ...


class CacheMemoria:
    def get(self, chave: str) -> str | None:
        return None


class CacheQueLancaErro:
    def get(self, chave: str) -> str | None:
        raise KeyError(chave)
```

`CacheQueLancaErro` quebra cliente que espera `None` para ausência.

---

## Testes de Contrato

Crie uma suíte de testes que toda implementação deve passar.

```python
def contrato_cache(cache) -> None:
    assert cache.get("ausente") is None
    cache.set("x", "1")
    assert cache.get("x") == "1"


def test_cache_memoria():
    contrato_cache(CacheMemoria())


def test_cache_redis(redis_cache):
    contrato_cache(redis_cache)
```

Testes de contrato detectam violações de LSP.

---

## Composição para Evitar LSP Frágil

Em vez de herança:

```python
class Relatorio:
    def __init__(self, exportador) -> None:
        self.exportador = exportador

    def gerar(self, dados):
        return self.exportador.exportar(dados)
```

A variação fica em um contrato menor e mais fácil de preservar.

---

## Sinais de Violação do LSP

- subtipo lança `NotImplementedError`;
- cliente usa `isinstance` para tratar subtipo especial;
- método sobrescrito aceita menos casos;
- método sobrescrito retorna tipo incompatível;
- subtipo ignora comportamento esperado;
- herança existe só para reaproveitar código;
- testes da base falham para subclasses;
- docstring da subclasse contradiz a base.

---

## Checklist LSP

- a subclasse pode substituir a base em todos os clientes?
- pré-condições ficaram mais restritas?
- pós-condições ficaram mais fracas?
- invariantes foram preservados?
- exceções continuam compatíveis?
- herança representa comportamento ou só reaproveitamento?
- clientes precisam verificar o tipo concreto?
- um protocolo menor resolveria melhor?
- testes de contrato passam para todas as implementações?

