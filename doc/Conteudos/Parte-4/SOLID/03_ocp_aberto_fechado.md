# OCP: Open/Closed Principle

OCP é o Princípio Aberto/Fechado. O código deve estar aberto para extensão e fechado para modificação.

Isso significa que novos comportamentos devem poder ser adicionados sem alterar código já testado e estável. Em Python, OCP é frequentemente aplicado com polimorfismo, `Protocol`, ABCs, Strategy Pattern, injeção de dependência e registro de plugins.

---

## Problema: Condicionais Crescentes

```python
class CalculadoraFrete:
    def calcular(self, tipo: str, peso: float) -> float:
        if tipo == "sedex":
            return peso * 12
        if tipo == "pac":
            return peso * 8
        if tipo == "retirada":
            return 0
        raise ValueError("Tipo de frete inválido")
```

Quando entra novo tipo de frete, você modifica a classe. Com o tempo:

- aumenta risco de regressão;
- testes antigos podem quebrar;
- regras ficam misturadas;
- merge conflicts ficam comuns.

---

## Estratégias Substituíveis

```python
from typing import Protocol


class EstrategiaFrete(Protocol):
    def calcular(self, peso: float) -> float:
        ...


class FreteSedex:
    def calcular(self, peso: float) -> float:
        return peso * 12


class FretePac:
    def calcular(self, peso: float) -> float:
        return peso * 8


class FreteRetirada:
    def calcular(self, peso: float) -> float:
        return 0


class CalculadoraFrete:
    def __init__(self, estrategias: dict[str, EstrategiaFrete]) -> None:
        self.estrategias = estrategias

    def calcular(self, tipo: str, peso: float) -> float:
        try:
            estrategia = self.estrategias[tipo]
        except KeyError:
            raise ValueError("Tipo de frete inválido")
        return estrategia.calcular(peso)
```

Adicionar novo frete:

```python
class FreteExpresso:
    def calcular(self, peso: float) -> float:
        return 25 + peso * 15


calculadora = CalculadoraFrete({
    "sedex": FreteSedex(),
    "pac": FretePac(),
    "retirada": FreteRetirada(),
    "expresso": FreteExpresso(),
})
```

A calculadora não muda.

---

## OCP com Funções

Nem sempre precisa de classe.

```python
from collections.abc import Callable


RegraDesconto = Callable[[float], float]


def desconto_vip(total: float) -> float:
    return total * 0.9


def desconto_black_friday(total: float) -> float:
    return total * 0.7


def aplicar_desconto(total: float, regra: RegraDesconto) -> float:
    return regra(total)
```

Python permite extensibilidade simples com funções de primeira classe.

---

## Protocols

`Protocol` permite interfaces estruturais.

```python
from typing import Protocol


class Exportador(Protocol):
    def exportar(self, dados: list[dict]) -> bytes:
        ...


class ExportadorJson:
    def exportar(self, dados: list[dict]) -> bytes:
        import json
        return json.dumps(dados).encode("utf-8")


class ExportadorCsv:
    def exportar(self, dados: list[dict]) -> bytes:
        return b"csv"


def gerar_relatorio(exportador: Exportador, dados: list[dict]) -> bytes:
    return exportador.exportar(dados)
```

Novos exportadores são adicionados sem modificar `gerar_relatorio`.

---

## ABCs

Use ABC quando quer implementação explicitamente marcada.

```python
from abc import ABC, abstractmethod


class GatewayPagamento(ABC):
    @abstractmethod
    def cobrar(self, valor: float, token: str) -> str:
        raise NotImplementedError


class StripeGateway(GatewayPagamento):
    def cobrar(self, valor: float, token: str) -> str:
        return "stripe-charge-id"
```

ABCs são úteis em frameworks internos e quando a equipe quer contrato nominal.

---

## Injeção de Dependência

OCP fica mais forte quando dependências são injetadas.

```python
class Checkout:
    def __init__(self, gateway: GatewayPagamento) -> None:
        self.gateway = gateway

    def finalizar(self, total: float, token: str) -> str:
        return self.gateway.cobrar(total, token)
```

Trocar gateway não exige mudar `Checkout`.

---

## Plugabilidade

Registro de plugins:

```python
class Registry:
    def __init__(self) -> None:
        self._handlers = {}

    def registrar(self, nome: str, handler) -> None:
        self._handlers[nome] = handler

    def obter(self, nome: str):
        return self._handlers[nome]


registry = Registry()
registry.registrar("json", ExportadorJson())
registry.registrar("csv", ExportadorCsv())
```

Plugins podem ser carregados por configuração, entry points ou import dinâmico, mas mantenha simplicidade até haver necessidade real.

---

## OCP e Pattern Strategy

Strategy encapsula algoritmos substituíveis.

```python
class Precificacao:
    def __init__(self, regra) -> None:
        self.regra = regra

    def calcular(self, pedido) -> float:
        return self.regra.calcular(pedido)
```

Regras diferentes:

```python
class PrecificacaoNormal:
    def calcular(self, pedido) -> float:
        return pedido.total


class PrecificacaoPromocional:
    def calcular(self, pedido) -> float:
        return pedido.total * 0.85
```

---

## OCP e Pattern Factory

Factory concentra criação sem espalhar condicionais.

```python
def criar_exportador(formato: str) -> Exportador:
    exportadores = {
        "json": ExportadorJson,
        "csv": ExportadorCsv,
    }
    try:
        return exportadores[formato]()
    except KeyError:
        raise ValueError("Formato inválido")
```

Ainda existe modificação na factory ao adicionar novo formato. Isso pode ser aceitável: OCP não exige eliminar toda alteração, mas proteger o núcleo estável.

---

## Quando Não Aplicar OCP Ainda

Evite abstrair cedo quando:

- só existe uma implementação;
- a variação é especulativa;
- o domínio ainda não estabilizou;
- a abstração ficaria mais complexa que o problema;
- a mudança é rara e localizada.

OCP deve responder a variações reais ou altamente prováveis.

---

## Sinais de Violação do OCP

- `if/elif` cresce a cada novo tipo;
- `match/case` centraliza regras de várias variantes;
- adicionar comportamento exige alterar classe antiga;
- testes antigos precisam mudar por novo caso;
- lógica de seleção está espalhada;
- novas integrações mexem em caso de uso estável.

---

## Checklist OCP

- existe variação real de comportamento?
- o código estável muda a cada nova variante?
- polimorfismo reduziria risco?
- `Protocol` ou função callable já bastaria?
- estratégia substituível deixa o código mais claro?
- factory centraliza criação sem contaminar regra?
- a abstração tem contrato estável?
- novos comportamentos podem ser testados isoladamente?
- estou evitando modificação útil ou criando abstração prematura?

