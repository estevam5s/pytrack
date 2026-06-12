# Unit Tests: Testes Unitários Profissionais

Teste unitário verifica uma unidade pequena de comportamento de forma rápida, isolada e determinística. A unidade pode ser função, classe, método, serviço de domínio ou caso de uso sem dependências externas reais.

Teste unitário profissional não testa linhas de código; testa comportamento observável.

---

## O Que É Uma Unidade?

Unidade pode ser:

- função pura;
- método de entidade;
- serviço de domínio;
- validador;
- caso de uso com fakes;
- parser;
- serializador;
- regra de cálculo.

Evite definir unidade como "uma classe sempre". Em Python, função também é unidade de design.

---

## Função Pura

```python
def calcular_desconto(total: float, cliente_vip: bool) -> float:
    if total >= 1000:
        return total * 0.15
    if cliente_vip:
        return total * 0.10
    return 0
```

Teste:

```python
import pytest


@pytest.mark.parametrize(
    "total,cliente_vip,esperado",
    [
        (1000, False, 150),
        (500, True, 50),
        (500, False, 0),
    ],
)
def test_calcular_desconto(total, cliente_vip, esperado):
    assert calcular_desconto(total, cliente_vip) == esperado
```

Esse é o tipo de teste mais barato e confiável.

---

## Testando Entidade

```python
from dataclasses import dataclass


@dataclass
class Conta:
    saldo: int = 0

    def depositar(self, valor: int) -> None:
        if valor <= 0:
            raise ValueError("Valor inválido")
        self.saldo += valor

    def sacar(self, valor: int) -> None:
        if valor > self.saldo:
            raise ValueError("Saldo insuficiente")
        self.saldo -= valor
```

Testes:

```python
import pytest


def test_depositar_aumenta_saldo():
    conta = Conta()
    conta.depositar(100)
    assert conta.saldo == 100


def test_depositar_valor_invalido():
    conta = Conta()
    with pytest.raises(ValueError, match="inválido"):
        conta.depositar(0)


def test_sacar_sem_saldo():
    conta = Conta(saldo=50)
    with pytest.raises(ValueError, match="insuficiente"):
        conta.sacar(100)
```

---

## Arrange, Act, Assert

Organize teste em três partes:

```python
def test_criar_pedido_calcula_total():
    # Arrange
    itens = [
        {"quantidade": 2, "preco": 10},
        {"quantidade": 1, "preco": 5},
    ]

    # Act
    total = calcular_total(itens)

    # Assert
    assert total == 25
```

Comentários são opcionais. A estrutura deve ficar clara.

---

## Testando Casos de Uso com Fakes

```python
class FakePedidoRepository:
    def __init__(self) -> None:
        self.salvos = []

    def salvar(self, pedido):
        pedido["id"] = 1
        self.salvos.append(pedido)
        return pedido


class CriarPedido:
    def __init__(self, repository) -> None:
        self.repository = repository

    def executar(self, email: str, total: float):
        if total <= 0:
            raise ValueError("Total inválido")
        return self.repository.salvar({"email": email, "total": total})
```

Teste:

```python
def test_criar_pedido_salva_pedido():
    repository = FakePedidoRepository()
    use_case = CriarPedido(repository)

    pedido = use_case.executar("ana@example.com", 100)

    assert pedido["id"] == 1
    assert repository.salvos == [{"id": 1, "email": "ana@example.com", "total": 100}]
```

---

## Testando Erros de Domínio

Prefira exceções específicas.

```python
class EstoqueInsuficiente(Exception):
    pass


def reservar(estoque: int, quantidade: int) -> int:
    if quantidade > estoque:
        raise EstoqueInsuficiente("Estoque insuficiente")
    return estoque - quantidade
```

Teste:

```python
def test_reservar_sem_estoque():
    with pytest.raises(EstoqueInsuficiente):
        reservar(estoque=2, quantidade=5)
```

---

## Testes Determinísticos

Evite depender de:

- hora atual;
- ordem aleatória;
- rede;
- banco externo;
- timezone local;
- arquivos compartilhados;
- estado global.

Injete relógio:

```python
from datetime import datetime


class CriarEvento:
    def __init__(self, now) -> None:
        self.now = now

    def executar(self):
        return {"criado_em": self.now()}
```

Teste:

```python
def test_criar_evento_com_data_fixa():
    data = datetime(2026, 5, 15)
    use_case = CriarEvento(now=lambda: data)
    assert use_case.executar()["criado_em"] == data
```

---

## O Que Não Testar em Unit Test

Evite testar:

- detalhes internos privados sem necessidade;
- getters e setters triviais;
- implementação do framework;
- SQL real;
- rede real;
- comportamento de bibliotecas maduras;
- mocks sem afirmar comportamento útil.

Teste o que representa risco ou regra.

---

## Bons Nomes de Teste

Ruim:

```python
def test_1():
    ...
```

Bom:

```python
def test_deve_rejeitar_pedido_com_total_zero():
    ...
```

Ou em inglês, se o projeto usa inglês:

```python
def test_rejects_order_with_zero_total():
    ...
```

Consistência importa mais que idioma.

---

## Checklist Unit Tests

- teste é rápido?
- não depende de rede, banco ou filesystem compartilhado?
- nome descreve comportamento?
- falha aponta claramente o problema?
- cobre caminho feliz e bordas?
- testa comportamento, não implementação?
- usa fakes simples quando necessário?
- evita mocks excessivos?
- roda bem em qualquer ordem?

