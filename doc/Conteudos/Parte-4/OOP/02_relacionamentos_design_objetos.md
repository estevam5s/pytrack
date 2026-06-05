# Relacionamentos, Coesão, Acoplamento e Design de Objetos

Este arquivo aprofunda os relacionamentos entre objetos e os critérios para criar modelos orientados a objetos que continuam saudáveis quando o sistema cresce.

---

## Sumário

1. [Associação](#associação)
2. [Agregação](#agregação)
3. [Composição](#composição)
4. [Delegação](#delegação)
5. [Coesão](#coesão)
6. [Acoplamento](#acoplamento)
7. [Objetos de Domínio](#objetos-de-domínio)
8. [Value Objects](#value-objects)
9. [Entidades](#entidades)
10. [Boas Práticas](#boas-práticas)
11. [Exercícios](#exercícios)

---

## Associação

Associação significa que um objeto conhece ou usa outro.

```python
class Cliente:
    def __init__(self, nome: str):
        self.nome = nome


class Pedido:
    def __init__(self, cliente: Cliente):
        self.cliente = cliente
```

O pedido se associa ao cliente, mas o cliente pode existir sem o pedido.

---

## Agregação

Agregação é relação "tem um", mas as partes podem existir separadamente.

```python
class Professor:
    def __init__(self, nome: str):
        self.nome = nome


class Departamento:
    def __init__(self, nome: str):
        self.nome = nome
        self.professores: list[Professor] = []

    def adicionar_professor(self, professor: Professor) -> None:
        self.professores.append(professor)
```

O professor pode existir fora do departamento.

---

## Composição

Composição é relação forte: o objeto composto controla o ciclo de vida das partes.

```python
class ItemPedido:
    def __init__(self, nome: str, valor: float):
        if valor <= 0:
            raise ValueError("valor deve ser positivo")
        self.nome = nome
        self.valor = valor


class Pedido:
    def __init__(self):
        self._itens: list[ItemPedido] = []

    def adicionar_item(self, nome: str, valor: float) -> None:
        self._itens.append(ItemPedido(nome, valor))

    @property
    def total(self) -> float:
        return sum(item.valor for item in self._itens)
```

O pedido cria e controla seus itens.

Composição costuma ser mais flexível que herança.

---

## Delegação

Delegação é passar parte do trabalho para outro objeto.

```python
class CalculadoraFrete:
    def calcular(self, cep: str, peso: float) -> float:
        return 10 + peso * 2


class Pedido:
    def __init__(self, frete: CalculadoraFrete):
        self._frete = frete

    def calcular_frete(self, cep: str, peso: float) -> float:
        return self._frete.calcular(cep, peso)
```

Delegação reduz acoplamento quando depende de abstrações.

---

## Coesão

Uma classe coesa tem responsabilidade clara.

Ruim:

```python
class Usuario:
    def salvar_no_banco(self): ...
    def enviar_email(self): ...
    def renderizar_html(self): ...
    def calcular_imposto(self): ...
```

Melhor:

```python
class Usuario:
    def pode_acessar(self) -> bool:
        return self.ativo and not self.bloqueado
```

Persistência, email e apresentação devem ficar em outros componentes.

---

## Acoplamento

Acoplamento é o quanto uma classe depende de detalhes de outra.

Alto acoplamento:

```python
class PedidoService:
    def finalizar(self, pedido):
        banco = PostgresPedidoRepository()
        banco.salvar(pedido)
```

Menor acoplamento:

```python
class PedidoService:
    def __init__(self, repository):
        self._repository = repository

    def finalizar(self, pedido):
        self._repository.salvar(pedido)
```

Com type hints:

```python
from typing import Protocol

class PedidoRepository(Protocol):
    def salvar(self, pedido: "Pedido") -> None:
        ...
```

---

## Objetos de Domínio

Objetos de domínio representam conceitos do negócio.

```python
class Carrinho:
    def __init__(self):
        self._itens = []

    def adicionar(self, produto: str, preco: float) -> None:
        if preco <= 0:
            raise ValueError("preço inválido")
        self._itens.append((produto, preco))

    def total(self) -> float:
        return sum(preco for _, preco in self._itens)
```

Domínio não deve depender diretamente de framework, banco ou API externa.

---

## Value Objects

Value Object é definido por seus valores, não identidade.

```python
from dataclasses import dataclass

@dataclass(frozen=True)
class Dinheiro:
    valor: int
    moeda: str = "BRL"

    def somar(self, outro: "Dinheiro") -> "Dinheiro":
        if self.moeda != outro.moeda:
            raise ValueError("moedas diferentes")
        return Dinheiro(self.valor + outro.valor, self.moeda)
```

`frozen=True` ajuda a manter imutabilidade.

---

## Entidades

Entidade tem identidade.

```python
from dataclasses import dataclass
from uuid import UUID, uuid4

@dataclass
class Cliente:
    nome: str
    id: UUID = uuid4()
```

Duas entidades podem ter o mesmo nome, mas IDs diferentes.

---

## Boas Práticas

- Use composição para montar comportamento.
- Use agregação quando objetos vivem independentemente.
- Use associação quando uma classe apenas conhece outra.
- Use delegação para evitar classes gigantes.
- Mantenha domínio independente de infraestrutura.
- Prefira objetos de valor imutáveis.
- Reduza acoplamento usando abstrações.
- Evite classes que fazem tudo.

---

## Exercícios

1. Modele `Pedido` e `ItemPedido` com composição.
2. Modele `Departamento` e `Professor` com agregação.
3. Crie um service que delega persistência a um repository.
4. Crie um `Dinheiro` como value object.
5. Identifique baixa coesão em uma classe e refatore.
6. Substitua uma herança inadequada por composição.

