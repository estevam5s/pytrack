# Decorators, Descriptors, Context Managers, Iteradores e Metaclasses

Este arquivo aprofunda recursos avançados de POO em Python, com ênfase em `@decorators`, descriptors, context managers, iteradores, geradores, reflection, introspection e metaclasses.

---

## Sumário

1. [Decorators](#decorators)
2. [Decorators de Função](#decorators-de-função)
3. [Decorators com Argumentos](#decorators-com-argumentos)
4. [Decorators de Método](#decorators-de-método)
5. [Decorators de Classe](#decorators-de-classe)
6. [Stack de Decorators](#stack-de-decorators)
7. [Descriptors](#descriptors)
8. [Descriptors Data e Non-Data](#descriptors-data-e-non-data)
9. [Context Managers](#context-managers)
10. [Context Managers com Classes Reais](#context-managers-com-classes-reais)
11. [Iteradores e Geradores em Objetos](#iteradores-e-geradores-em-objetos)
12. [Reflection e Introspection](#reflection-e-introspection)
13. [Metaclasses](#metaclasses)
14. [Metaprogramação com Segurança](#metaprogramação-com-segurança)
15. [Boas Práticas](#boas-práticas)
16. [Exercícios](#exercícios)

---

## Decorators

Decorator é uma função ou objeto que recebe algo e retorna uma versão modificada.

Em Python, `@decorator` é açúcar sintático:

```python
@decorator
def funcao():
    ...
```

Equivale a:

```python
def funcao():
    ...

funcao = decorator(funcao)
```

Decorators são usados para:

- logging;
- cache;
- retry;
- autorização;
- validação;
- transação;
- instrumentação;
- registro automático;
- medição de tempo;
- criação de APIs declarativas.

---

## Decorators de Função

```python
from functools import wraps

def logar(funcao):
    @wraps(funcao)
    def wrapper(*args, **kwargs):
        print(f"chamando {funcao.__name__}")
        return funcao(*args, **kwargs)
    return wrapper
```

Uso:

```python
@logar
def somar(a: int, b: int) -> int:
    return a + b
```

`@wraps` preserva metadados como `__name__`, `__doc__` e assinatura aparente.

### Decorator de tempo

```python
from functools import wraps
from time import perf_counter

def medir_tempo(funcao):
    @wraps(funcao)
    def wrapper(*args, **kwargs):
        inicio = perf_counter()
        try:
            return funcao(*args, **kwargs)
        finally:
            fim = perf_counter()
            print(f"{funcao.__name__}: {fim - inicio:.4f}s")
    return wrapper
```

---

## Decorators com Argumentos

Decorator parametrizado tem três camadas.

```python
from functools import wraps
from time import sleep

def retry(tentativas: int = 3, espera: float = 0.5, excecoes=(Exception,)):
    def decorador(funcao):
        @wraps(funcao)
        def wrapper(*args, **kwargs):
            ultimo_erro = None

            for tentativa in range(1, tentativas + 1):
                try:
                    return funcao(*args, **kwargs)
                except excecoes as erro:
                    ultimo_erro = erro
                    if tentativa < tentativas:
                        sleep(espera)

            raise ultimo_erro
        return wrapper
    return decorador
```

Uso:

```python
@retry(tentativas=3, espera=1.0, excecoes=(TimeoutError,))
def buscar_api():
    ...
```

### Decorator de validação

```python
def exigir_positivo(*nomes):
    def decorador(funcao):
        @wraps(funcao)
        def wrapper(*args, **kwargs):
            from inspect import signature

            bind = signature(funcao).bind(*args, **kwargs)
            bind.apply_defaults()

            for nome in nomes:
                if bind.arguments[nome] <= 0:
                    raise ValueError(f"{nome} deve ser positivo")

            return funcao(*args, **kwargs)
        return wrapper
    return decorador
```

Uso:

```python
@exigir_positivo("valor")
def depositar(valor: float) -> None:
    ...
```

---

## Decorators de Método

Decorators em métodos recebem `self` como primeiro argumento.

```python
def exigir_autenticado(metodo):
    @wraps(metodo)
    def wrapper(self, *args, **kwargs):
        if not self.autenticado:
            raise PermissionError("usuário não autenticado")
        return metodo(self, *args, **kwargs)
    return wrapper
```

Uso:

```python
class Painel:
    def __init__(self, autenticado: bool):
        self.autenticado = autenticado

    @exigir_autenticado
    def acessar(self) -> str:
        return "painel"
```

### Decorators embutidos importantes

```python
class Usuario:
    total = 0

    def __init__(self, nome: str):
        self.nome = nome
        Usuario.total += 1

    @property
    def nome_normalizado(self) -> str:
        return self.nome.strip().title()

    @classmethod
    def from_email(cls, email: str) -> "Usuario":
        nome = email.split("@")[0]
        return cls(nome)

    @staticmethod
    def validar_email(email: str) -> bool:
        return "@" in email
```

---

## Decorators de Classe

Decorator de classe recebe a classe e retorna a classe modificada.

```python
def adicionar_repr(cls):
    def __repr__(self):
        atributos = ", ".join(
            f"{chave}={valor!r}"
            for chave, valor in self.__dict__.items()
        )
        return f"{cls.__name__}({atributos})"

    cls.__repr__ = __repr__
    return cls
```

Uso:

```python
@adicionar_repr
class Produto:
    def __init__(self, nome: str, preco: float):
        self.nome = nome
        self.preco = preco
```

Na prática, `@dataclass` é o exemplo mais importante de decorator de classe.

```python
from dataclasses import dataclass

@dataclass(frozen=True)
class Coordenada:
    x: int
    y: int
```

---

## Stack de Decorators

Decorators empilhados são aplicados de baixo para cima.

```python
@decorador_a
@decorador_b
def funcao():
    ...
```

Equivale a:

```python
funcao = decorador_a(decorador_b(funcao))
```

Exemplo:

```python
@medir_tempo
@retry(tentativas=3, excecoes=(TimeoutError,))
def carregar_dados():
    ...
```

Ordem importa. Validação, cache, retry e logging podem mudar comportamento dependendo da composição.

---

## Descriptors

Descriptor é objeto que controla acesso a atributo com:

- `__get__`;
- `__set__`;
- `__delete__`.

`property`, métodos, `classmethod` e `staticmethod` são baseados no protocolo descriptor.

### Descriptor de validação

```python
class Positivo:
    def __set_name__(self, owner, name):
        self.nome_publico = name
        self.nome_privado = f"_{name}"

    def __get__(self, instance, owner):
        if instance is None:
            return self
        return getattr(instance, self.nome_privado)

    def __set__(self, instance, value):
        if value <= 0:
            raise ValueError(f"{self.nome_publico} deve ser positivo")
        setattr(instance, self.nome_privado, value)
```

Uso:

```python
class Produto:
    preco = Positivo()

    def __init__(self, nome: str, preco: float):
        self.nome = nome
        self.preco = preco
```

Descriptors são poderosos para validação reutilizável, ORMs e frameworks.

---

## Descriptors Data e Non-Data

Um descriptor é classificado pelo conjunto de métodos que implementa:

- data descriptor: implementa `__set__` ou `__delete__`;
- non-data descriptor: implementa apenas `__get__`.

Data descriptors têm precedência sobre atributos da instância. Non-data descriptors podem ser sobrescritos por atributos no `__dict__` da instância.

### Non-data descriptor para cálculo preguiçoso

```python
class lazy_property:
    def __init__(self, funcao):
        self.funcao = funcao
        self.nome = funcao.__name__

    def __get__(self, instance, owner):
        if instance is None:
            return self
        valor = self.funcao(instance)
        instance.__dict__[self.nome] = valor
        return valor
```

Uso:

```python
class Relatorio:
    def __init__(self, vendas):
        self.vendas = vendas

    @lazy_property
    def total(self):
        return sum(self.vendas)
```

Depois do primeiro acesso, `total` fica salvo no objeto. Esse padrão é parecido com `functools.cached_property`.

### Data descriptor com remoção

```python
class TextoObrigatorio:
    def __set_name__(self, owner, name):
        self.nome_publico = name
        self.nome_privado = f"_{name}"

    def __get__(self, instance, owner):
        if instance is None:
            return self
        return getattr(instance, self.nome_privado)

    def __set__(self, instance, value):
        if not isinstance(value, str) or not value.strip():
            raise ValueError(f"{self.nome_publico} é obrigatório")
        setattr(instance, self.nome_privado, value.strip())

    def __delete__(self, instance):
        raise AttributeError(f"{self.nome_publico} não pode ser removido")
```

Descriptors são a base de APIs declarativas de ORMs, validação, frameworks web e bibliotecas de serialização.

---

## Context Managers

Context managers encapsulam entrada e saída de recursos.

```python
class Transacao:
    def __init__(self, conexao):
        self.conexao = conexao

    def __enter__(self):
        self.conexao.begin()
        return self.conexao

    def __exit__(self, exc_type, exc_value, traceback):
        if exc_type is None:
            self.conexao.commit()
        else:
            self.conexao.rollback()
        return False
```

Com `contextlib`:

```python
from contextlib import contextmanager

@contextmanager
def transacao(conexao):
    try:
        conexao.begin()
        yield conexao
    except Exception:
        conexao.rollback()
        raise
    else:
        conexao.commit()
```

---

## Context Managers com Classes Reais

Context manager é ideal quando uma operação tem começo e fim obrigatórios: arquivo, lock, conexão, transação, timer, configuração temporária ou recurso externo.

```python
from pathlib import Path

class EscritorAtomico:
    def __init__(self, destino: Path):
        self.destino = destino
        self.temporario = destino.with_suffix(destino.suffix + ".tmp")

    def __enter__(self):
        self.arquivo = self.temporario.open("w", encoding="utf-8")
        return self.arquivo

    def __exit__(self, exc_type, exc_value, traceback):
        self.arquivo.close()
        if exc_type is None:
            self.temporario.replace(self.destino)
        else:
            self.temporario.unlink(missing_ok=True)
        return False
```

Uso:

```python
with EscritorAtomico(Path("relatorio.txt")) as arquivo:
    arquivo.write("conteúdo")
```

O objeto protege a invariante: o arquivo final só é trocado se a escrita terminar sem erro.

---

## Iteradores e Geradores em Objetos

```python
class ColecaoPedidos:
    def __init__(self, pedidos):
        self._pedidos = pedidos

    def __iter__(self):
        return iter(self._pedidos)

    def aprovados(self):
        for pedido in self._pedidos:
            if pedido.status == "aprovado":
                yield pedido
```

Objetos podem expor iteração natural sem revelar detalhes internos.

---

## Reflection e Introspection

Introspection é examinar objetos em tempo de execução.

```python
class Usuario:
    def __init__(self, nome: str):
        self.nome = nome


usuario = Usuario("Ana")

print(type(usuario))
print(dir(usuario))
print(hasattr(usuario, "nome"))
print(getattr(usuario, "nome"))
```

`inspect`:

```python
import inspect

print(inspect.signature(Usuario))
```

Use com cuidado. Reflection em excesso pode indicar design indireto demais.

---

## Metaclasses

Metaclasse é a classe de uma classe.

```python
class MinhaMeta(type):
    def __new__(mcls, nome, bases, namespace):
        print(f"criando classe {nome}")
        return super().__new__(mcls, nome, bases, namespace)


class Base(metaclass=MinhaMeta):
    pass
```

### Metaclasse para registro

```python
class Registravel(type):
    registros = {}

    def __new__(mcls, nome, bases, namespace):
        cls = super().__new__(mcls, nome, bases, namespace)
        if nome != "Plugin":
            mcls.registros[nome] = cls
        return cls


class Plugin(metaclass=Registravel):
    pass


class ImportadorCsv(Plugin):
    pass
```

Antes de usar metaclasses, considere:

- decorator de classe;
- `__init_subclass__`;
- composição;
- registro explícito.

### `__init_subclass__`

Alternativa mais simples para muitos casos.

```python
class Plugin:
    registros = {}

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        Plugin.registros[cls.__name__] = cls
```

---

## Metaprogramação com Segurança

Metaprogramação deve reduzir repetição real ou criar uma API mais clara. Se ela apenas esconde código simples, tende a piorar manutenção.

### Validação de contrato em subclasses

`__init_subclass__` é suficiente para muitos casos em que uma metaclasse seria pesada.

```python
class Handler:
    evento = None

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        if cls.evento is None:
            raise TypeError("subclasses de Handler devem definir evento")

    def processar(self, payload: dict) -> None:
        raise NotImplementedError
```

```python
class PedidoCriadoHandler(Handler):
    evento = "pedido.criado"

    def processar(self, payload: dict) -> None:
        print(payload)
```

### Quando metaclass faz sentido

Use metaclasses quando precisa controlar criação de classes em uma família inteira de tipos, por exemplo:

- frameworks declarativos;
- ORMs;
- validação de atributos de classe;
- registro automático de plugins;
- criação de DSLs internas.

Evite metaclasses para validações que podem ser feitas com funções, decorators de classe, `dataclass`, `attrs`, `pydantic`, `Protocol` ou `__init_subclass__`.

---

## Boas Práticas

- Sempre use `@wraps` em decorators.
- Documente decorators que alteram retorno, exceções ou assinatura.
- Use descriptors quando validação precisa ser reutilizada em várias classes.
- Use context managers para recursos externos.
- Use metaclasses raramente.
- Prefira `__init_subclass__` antes de metaclasses quando possível.
- Evite reflection quando uma interface explícita resolve.

---

## Exercícios

1. Crie decorator de logging com `@wraps`.
2. Crie decorator parametrizado de retry.
3. Crie decorator de método que exige autenticação.
4. Crie decorator de classe que adiciona `__repr__`.
5. Crie descriptor `Positivo`.
6. Crie context manager transacional.
7. Crie classe iterável.
8. Use `inspect.signature`.
9. Crie registro automático com `__init_subclass__`.
10. Explique quando metaclass é exagero.
