# Métodos Mágicos, Properties, Dataclasses e Slots

Este arquivo aprofunda um dos temas mais importantes da POO em Python: métodos mágicos. Eles permitem integrar seus objetos ao modelo de dados da linguagem.

---

## Sumário

1. [O Que São Métodos Mágicos](#o-que-são-métodos-mágicos)
2. [Inicialização e Representação](#inicialização-e-representação)
3. [Comparação e Ordenação](#comparação-e-ordenação)
4. [Hash e Igualdade](#hash-e-igualdade)
5. [Operadores Aritméticos](#operadores-aritméticos)
6. [Protocolo de Container](#protocolo-de-container)
7. [Objetos Chamáveis](#objetos-chamáveis)
8. [Gerenciamento de Contexto](#gerenciamento-de-contexto)
9. [Properties](#properties)
10. [Métodos de Classe e Estáticos](#métodos-de-classe-e-estáticos)
11. [Dataclasses](#dataclasses)
12. [Slots](#slots)
13. [Mapa de Métodos Mágicos Importantes](#mapa-de-métodos-mágicos-importantes)
14. [Controle de Acesso a Atributos](#controle-de-acesso-a-atributos)
15. [Boas Práticas](#boas-práticas)
16. [Exercícios](#exercícios)

---

## O Que São Métodos Mágicos

Métodos mágicos, dunder methods ou special methods são métodos como `__init__`, `__str__`, `__len__`, `__iter__`, `__eq__` e `__enter__`.

Eles permitem que objetos customizados funcionem com:

- `print(obj)`;
- `len(obj)`;
- `obj + outro`;
- `obj == outro`;
- `for item in obj`;
- `with obj`;
- `obj()`;
- `item in obj`;
- `sorted(lista_de_objetos)`.

Eles são chamados pelo interpretador, não normalmente por você diretamente.

Use:

```python
len(carrinho)
```

Evite:

```python
carrinho.__len__()
```

---

## Inicialização e Representação

```python
class Produto:
    def __init__(self, nome: str, preco: float):
        self.nome = nome
        self.preco = preco

    def __repr__(self) -> str:
        return f"Produto(nome={self.nome!r}, preco={self.preco!r})"

    def __str__(self) -> str:
        return f"{self.nome} - R$ {self.preco:.2f}"
```

Regra prática:

- `__repr__`: para desenvolvedores, debug, idealmente não ambíguo;
- `__str__`: para usuários, legível.

Uso:

```python
produto = Produto("Livro", 50)
print(produto)
print(repr(produto))
```

### `__post_init__` em dataclasses

```python
from dataclasses import dataclass

@dataclass
class Produto:
    nome: str
    preco: float

    def __post_init__(self):
        if self.preco <= 0:
            raise ValueError("preço deve ser positivo")
```

---

## Comparação e Ordenação

```python
from functools import total_ordering

@total_ordering
class Versao:
    def __init__(self, major: int, minor: int, patch: int):
        self.major = major
        self.minor = minor
        self.patch = patch

    def _como_tupla(self) -> tuple[int, int, int]:
        return self.major, self.minor, self.patch

    def __eq__(self, outro) -> bool:
        if not isinstance(outro, Versao):
            return NotImplemented
        return self._como_tupla() == outro._como_tupla()

    def __lt__(self, outro) -> bool:
        if not isinstance(outro, Versao):
            return NotImplemented
        return self._como_tupla() < outro._como_tupla()
```

`@total_ordering` cria os demais métodos de comparação a partir de `__eq__` e um método de ordem.

Boas práticas:

- retorne `NotImplemented` para tipos incompatíveis;
- mantenha comparação consistente;
- compare por tupla quando possível.

---

## Hash e Igualdade

Se dois objetos são iguais, seus hashes devem ser iguais.

```python
from dataclasses import dataclass

@dataclass(frozen=True)
class Coordenada:
    x: int
    y: int
```

Por ser `frozen`, pode ser usada em `set` e como chave de `dict`.

```python
visitados = {Coordenada(1, 2)}
```

Implementação manual:

```python
class Moeda:
    def __init__(self, codigo: str):
        self.codigo = codigo.upper()

    def __eq__(self, outro):
        if not isinstance(outro, Moeda):
            return NotImplemented
        return self.codigo == outro.codigo

    def __hash__(self):
        return hash(self.codigo)
```

Evite objetos mutáveis hashable. Se o valor usado no hash muda, dicionários e sets quebram semanticamente.

---

## Operadores Aritméticos

```python
from dataclasses import dataclass

@dataclass(frozen=True)
class Dinheiro:
    centavos: int
    moeda: str = "BRL"

    def __add__(self, outro: "Dinheiro") -> "Dinheiro":
        self._validar_moeda(outro)
        return Dinheiro(self.centavos + outro.centavos, self.moeda)

    def __sub__(self, outro: "Dinheiro") -> "Dinheiro":
        self._validar_moeda(outro)
        return Dinheiro(self.centavos - outro.centavos, self.moeda)

    def __mul__(self, fator: int) -> "Dinheiro":
        return Dinheiro(self.centavos * fator, self.moeda)

    def __str__(self) -> str:
        return f"{self.moeda} {self.centavos / 100:.2f}"

    def _validar_moeda(self, outro: "Dinheiro") -> None:
        if self.moeda != outro.moeda:
            raise ValueError("moedas diferentes")
```

Uso:

```python
total = Dinheiro(1000) + Dinheiro(250)
print(total)
```

Métodos relacionados:

- `__add__`, `__radd__`, `__iadd__`;
- `__sub__`, `__mul__`, `__truediv__`;
- `__floordiv__`, `__mod__`, `__pow__`;
- `__neg__`, `__abs__`.

---

## Protocolo de Container

```python
class Carrinho:
    def __init__(self):
        self._itens = []

    def adicionar(self, item: str) -> None:
        self._itens.append(item)

    def __len__(self) -> int:
        return len(self._itens)

    def __iter__(self):
        return iter(self._itens)

    def __contains__(self, item: str) -> bool:
        return item in self._itens

    def __getitem__(self, indice: int) -> str:
        return self._itens[indice]
```

Uso:

```python
carrinho = Carrinho()
carrinho.adicionar("Livro")

print(len(carrinho))
print("Livro" in carrinho)
print(carrinho[0])

for item in carrinho:
    print(item)
```

---

## Objetos Chamáveis

`__call__` permite que instâncias sejam chamadas como função.

```python
class ValidadorTamanho:
    def __init__(self, minimo: int, maximo: int):
        self.minimo = minimo
        self.maximo = maximo

    def __call__(self, texto: str) -> bool:
        return self.minimo <= len(texto) <= self.maximo
```

Uso:

```python
validar_senha = ValidadorTamanho(8, 64)
print(validar_senha("abc12345"))
```

Bom para objetos configuráveis que se comportam como função.

---

## Gerenciamento de Contexto

```python
from time import perf_counter

class MedidorTempo:
    def __enter__(self):
        self.inicio = perf_counter()
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.fim = perf_counter()
        self.duracao = self.fim - self.inicio
        print(f"duração: {self.duracao:.4f}s")
        return False
```

Uso:

```python
with MedidorTempo():
    sum(range(1_000_000))
```

`__exit__` recebe informações de exceção. Retornar `True` suprime o erro; normalmente retorne `False`.

---

## Properties

`@property` expõe método como atributo calculado/controlado.

```python
class Pessoa:
    def __init__(self, nome: str, idade: int):
        self.nome = nome
        self.idade = idade

    @property
    def idade(self) -> int:
        return self._idade

    @idade.setter
    def idade(self, valor: int) -> None:
        if valor < 0:
            raise ValueError("idade não pode ser negativa")
        self._idade = valor
```

Use `property` quando:

- precisa validar atribuição;
- precisa manter compatibilidade de API;
- atributo é calculado;
- quer proteger invariante.

Evite criar property que só retorna atributo sem regra.

### Cached property

```python
from functools import cached_property

class Relatorio:
    def __init__(self, vendas: list[float]):
        self.vendas = vendas

    @cached_property
    def total(self) -> float:
        print("calculando")
        return sum(self.vendas)
```

`cached_property` calcula uma vez e guarda o resultado.

---

## Métodos de Classe e Estáticos

### Método de instância

```python
def metodo(self):
    ...
```

Usa estado do objeto.

### `@classmethod`

Recebe a classe como `cls`. Muito usado para construtores alternativos.

```python
class Usuario:
    def __init__(self, nome: str, email: str):
        self.nome = nome
        self.email = email

    @classmethod
    def from_dict(cls, dados: dict) -> "Usuario":
        return cls(dados["nome"], dados["email"])
```

### `@staticmethod`

Não recebe `self` nem `cls`.

```python
class Email:
    @staticmethod
    def normalizar(valor: str) -> str:
        return valor.strip().lower()
```

Use `staticmethod` com cuidado. Muitas vezes uma função de módulo é melhor.

---

## Dataclasses

```python
from dataclasses import dataclass, field

@dataclass
class Pedido:
    cliente: str
    itens: list[str] = field(default_factory=list)
```

`default_factory` evita compartilhar lista entre instâncias.

Opções úteis:

```python
@dataclass(frozen=True, order=True, slots=True)
class Produto:
    nome: str
    preco: float
```

- `frozen`: imutabilidade;
- `order`: ordenação;
- `slots`: economia de memória;
- `kw_only`: força argumentos nomeados.

---

## Slots

`__slots__` restringe atributos e pode reduzir memória.

```python
class Ponto:
    __slots__ = ("x", "y")

    def __init__(self, x: int, y: int):
        self.x = x
        self.y = y
```

```python
p = Ponto(1, 2)
# p.z = 3  # AttributeError
```

Use quando:

- haverá muitas instâncias;
- a estrutura de atributos é fixa;
- memória importa.

Evite quando:

- precisa de flexibilidade;
- usa herança complexa;
- precisa de `__dict__` por instância.

---

## Mapa de Métodos Mágicos Importantes

Nem todo projeto precisa implementar muitos dunders. A regra é implementar apenas os que tornam o objeto natural dentro da linguagem.

### Ciclo de vida

- `__new__(cls, ...)`: cria a instância antes de `__init__`; útil em imutáveis, singletons e metaprogramação.
- `__init__(self, ...)`: inicializa estado e valida invariantes.
- `__del__(self)`: chamado na finalização do objeto; evite para lógica crítica, prefira context managers.

```python
class Codigo:
    def __new__(cls, valor: str):
        valor = valor.strip().upper()
        return super().__new__(cls)

    def __init__(self, valor: str):
        self.valor = valor.strip().upper()
```

### Representação

- `__repr__`: representação para debug.
- `__str__`: representação legível para usuário.
- `__format__`: integração com `format()` e f-strings com especificadores.

```python
class Porcentagem:
    def __init__(self, valor: float):
        self.valor = valor

    def __format__(self, spec: str) -> str:
        return format(self.valor * 100, spec) + "%"
```

### Comparação

- `__eq__`, `__ne__`;
- `__lt__`, `__le__`, `__gt__`, `__ge__`;
- `__hash__` quando o objeto é imutável e pode ser chave de `dict` ou item de `set`.

Sempre retorne `NotImplemented` quando o outro objeto não for compatível.

### Containers e coleções

- `__len__`: usado por `len(obj)` e por testes de verdade quando `__bool__` não existe.
- `__getitem__`: usado por `obj[indice]`.
- `__setitem__`: usado por `obj[chave] = valor`.
- `__delitem__`: usado por `del obj[chave]`.
- `__iter__`: usado em `for`.
- `__contains__`: usado por `item in obj`.
- `__reversed__`: usado por `reversed(obj)`.

```python
class Estoque:
    def __init__(self):
        self._quantidades = {}

    def __getitem__(self, sku: str) -> int:
        return self._quantidades.get(sku, 0)

    def __setitem__(self, sku: str, quantidade: int) -> None:
        if quantidade < 0:
            raise ValueError("quantidade não pode ser negativa")
        self._quantidades[sku] = quantidade

    def __contains__(self, sku: str) -> bool:
        return sku in self._quantidades
```

### Booleano e conversão

- `__bool__`: usado por `if obj:`.
- `__int__`, `__float__`, `__bytes__`: conversões explícitas.

```python
class Carrinho:
    def __init__(self):
        self._itens = []

    def __bool__(self) -> bool:
        return bool(self._itens)
```

### Aritmética e operadores

- `__add__`, `__sub__`, `__mul__`, `__truediv__`;
- versões reversas como `__radd__`;
- versões in-place como `__iadd__`;
- unários como `__neg__`, `__pos__`, `__abs__`.

Implemente operadores apenas quando a operação tem significado claro no domínio.

### Objetos chamáveis e context managers

- `__call__`: instância se comporta como função configurável.
- `__enter__` e `__exit__`: integração com `with`.

Esses métodos são bons para validação configurável, medição, transações, locks e recursos externos.

---

## Controle de Acesso a Atributos

Python permite interceptar leitura, escrita e remoção de atributos. Use com parcimônia, porque isso torna o fluxo menos óbvio.

### `__getattr__`

Chamado apenas quando o atributo não foi encontrado normalmente.

```python
class Config:
    def __init__(self, dados: dict):
        self._dados = dados

    def __getattr__(self, nome: str):
        try:
            return self._dados[nome]
        except KeyError as erro:
            raise AttributeError(nome) from erro
```

### `__setattr__`

Chamado em toda atribuição de atributo.

```python
class SomentePositivos:
    def __setattr__(self, nome: str, valor):
        if nome.startswith("qtd_") and valor < 0:
            raise ValueError("quantidade não pode ser negativa")
        super().__setattr__(nome, valor)
```

### `__getattribute__`

Chamado em toda leitura de atributo. É poderoso e perigoso; se usado incorretamente, causa recursão infinita. Prefira `property`, descriptors ou `__getattr__` quando possível.

---

## Boas Práticas

- Implemente métodos mágicos para integrar objetos naturalmente à linguagem.
- Prefira `dataclass` para classes de dados.
- Use `frozen=True` para value objects.
- Retorne `NotImplemented` em comparações com tipos incompatíveis.
- Evite `__del__` para lógica crítica.
- Use `__repr__` útil para debug.
- Use `property` para invariantes, não por hábito.
- Use `slots` apenas quando houver motivo.

---

## Exercícios

1. Crie `Dinheiro` com `__add__`, `__sub__`, `__str__` e validação de moeda.
2. Crie `Carrinho` com `__len__`, `__iter__`, `__contains__` e `__getitem__`.
3. Crie uma classe ordenável com `@total_ordering`.
4. Crie um value object hashable.
5. Crie uma property com validação.
6. Crie construtor alternativo com `@classmethod`.
7. Compare classe normal, dataclass e dataclass com slots.
