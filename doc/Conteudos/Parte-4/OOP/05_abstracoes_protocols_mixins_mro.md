# Abstrações Avançadas: ABC, Interfaces, Protocols, Duck Typing, Mixins e MRO

Este arquivo cobre abstrações avançadas de POO em Python e como criar contratos flexíveis sem cair em hierarquias rígidas demais.

---

## Sumário

1. [Classes Abstratas](#classes-abstratas)
2. [Interfaces em Python](#interfaces-em-python)
3. [Protocols e Structural Typing](#protocols-e-structural-typing)
4. [ABC com Propriedades e Template Method](#abc-com-propriedades-e-template-method)
5. [Duck Typing](#duck-typing)
6. [Generic Types e Type Hints](#generic-types-e-type-hints)
7. [Mixins](#mixins)
8. [MRO](#mro)
9. [Herança Múltipla](#herança-múltipla)
10. [Delegação vs Herança](#delegação-vs-herança)
11. [Boas Práticas](#boas-práticas)
12. [Exercícios](#exercícios)

---

## Classes Abstratas

`abc` permite definir contratos nominais.

```python
from abc import ABC, abstractmethod

class RepositorioUsuario(ABC):
    @abstractmethod
    def buscar_por_id(self, user_id: int) -> dict | None:
        ...

    @abstractmethod
    def salvar(self, usuario: dict) -> None:
        ...
```

Implementação:

```python
class RepositorioMemoria(RepositorioUsuario):
    def __init__(self):
        self._dados = {}

    def buscar_por_id(self, user_id: int) -> dict | None:
        return self._dados.get(user_id)

    def salvar(self, usuario: dict) -> None:
        self._dados[usuario["id"]] = usuario
```

---

## Interfaces em Python

Python não tem `interface` como Java. As alternativas são:

- duck typing;
- `abc.ABC`;
- `typing.Protocol`;
- documentação;
- testes de contrato.

Interface é o comportamento esperado, não necessariamente uma palavra-chave.

---

## Protocols e Structural Typing

Protocol define contrato estrutural.

```python
from typing import Protocol

class EmailSender(Protocol):
    def enviar(self, destino: str, assunto: str, corpo: str) -> None:
        ...
```

Qualquer classe com esse método é compatível:

```python
class SmtpEmailSender:
    def enviar(self, destino: str, assunto: str, corpo: str) -> None:
        print(destino, assunto, corpo)
```

Uso:

```python
def notificar(sender: EmailSender, email: str) -> None:
    sender.enviar(email, "Olá", "Bem-vindo")
```

### Protocol genérico

```python
from typing import Protocol, TypeVar

T = TypeVar("T")

class Repository(Protocol[T]):
    def get(self, id: int) -> T | None:
        ...

    def save(self, obj: T) -> None:
        ...
```

### `@runtime_checkable`

Por padrão, `Protocol` é usado por ferramentas de type checking. Se precisar usar `isinstance` em tempo de execução, marque o protocolo com `@runtime_checkable`.

```python
from typing import Protocol, runtime_checkable

@runtime_checkable
class Serializavel(Protocol):
    def to_dict(self) -> dict:
        ...

class Usuario:
    def to_dict(self) -> dict:
        return {"nome": "Ana"}

usuario = Usuario()
print(isinstance(usuario, Serializavel))
```

Use `runtime_checkable` com cuidado: ele verifica presença estrutural básica, não a semântica completa dos métodos.

---

## ABC com Propriedades e Template Method

Classes abstratas podem exigir métodos e propriedades.

```python
from abc import ABC, abstractmethod

class Exportador(ABC):
    @property
    @abstractmethod
    def extensao(self) -> str:
        ...

    @abstractmethod
    def serializar(self, dados: list[dict]) -> str:
        ...
```

Implementação:

```python
class ExportadorCsv(Exportador):
    @property
    def extensao(self) -> str:
        return "csv"

    def serializar(self, dados: list[dict]) -> str:
        return "\n".join(
            ",".join(str(valor) for valor in item.values())
            for item in dados
        )
```

ABC também combina bem com Template Method: a classe base fixa o algoritmo, e subclasses preenchem passos específicos.

```python
class Importador(ABC):
    def importar(self, caminho: str) -> list[dict]:
        bruto = self.ler(caminho)
        registros = self.parsear(bruto)
        return self.validar(registros)

    @abstractmethod
    def ler(self, caminho: str) -> str:
        ...

    @abstractmethod
    def parsear(self, bruto: str) -> list[dict]:
        ...

    def validar(self, registros: list[dict]) -> list[dict]:
        return registros
```

---

## Duck Typing

Duck typing: se o objeto tem o comportamento necessário, use.

```python
def exportar(writer, dados: list[dict]) -> None:
    writer.write(dados)
```

Não importa a classe exata, importa o método `write`.

Duck typing é idiomático em Python, mas type hints com Protocol melhoram manutenção em projetos grandes.

---

## Generic Types e Type Hints

```python
from dataclasses import dataclass
from typing import Generic, TypeVar

T = TypeVar("T")

@dataclass
class Pagina(Generic[T]):
    itens: list[T]
    total: int
    pagina: int
```

Uso:

```python
pagina_usuarios: Pagina[str] = Pagina(["Ana", "Bia"], total=2, pagina=1)
```

Generics preservam informação de tipo.

---

## Mixins

Mixin adiciona comportamento reutilizável sem representar entidade por si só.

```python
class JsonMixin:
    def to_dict(self) -> dict:
        return self.__dict__.copy()

    def to_json(self) -> str:
        import json
        return json.dumps(self.to_dict(), ensure_ascii=False)
```

Uso:

```python
class Usuario(JsonMixin):
    def __init__(self, nome: str):
        self.nome = nome
```

Mixin deve:

- ser pequeno;
- ter responsabilidade clara;
- evitar estado complexo;
- documentar dependências esperadas.

### Mixin com método esperado

```python
class AuditavelMixin:
    def auditar(self) -> str:
        return f"{self.identificador()} alterado"
```

Classe precisa fornecer `identificador`.

---

## MRO

MRO é Method Resolution Order: a ordem em que Python procura métodos.

```python
class A:
    def metodo(self):
        return "A"

class B(A):
    def metodo(self):
        return "B"

class C(A):
    def metodo(self):
        return "C"

class D(B, C):
    pass

print(D.mro())
print(D().metodo())
```

Python usa C3 linearization.

### `super`

```python
class Base:
    def salvar(self):
        print("base")

class Auditavel(Base):
    def salvar(self):
        print("auditando")
        super().salvar()
```

Em herança múltipla cooperativa, todas as classes devem usar `super`.

---

## Herança Múltipla

Pode ser útil com mixins.

```python
class TimestampMixin:
    def marcar_atualizacao(self):
        from datetime import datetime
        self.atualizado_em = datetime.now()

class Entidade:
    def __init__(self, id: int):
        self.id = id

class Usuario(TimestampMixin, Entidade):
    pass
```

Evite herança múltipla com múltiplas classes concretas complexas.

---

## Delegação vs Herança

Herança:

```python
class ArquivoLogger(Logger):
    ...
```

Delegação:

```python
class Servico:
    def __init__(self, logger):
        self._logger = logger

    def executar(self):
        self._logger.info("executando")
```

Delegação costuma ser mais flexível e testável.

---

## Boas Práticas

- Use ABC quando quiser contrato nominal.
- Use Protocol quando comportamento estrutural basta.
- Use duck typing em código simples.
- Use mixins pequenos e sem estado complexo.
- Entenda MRO antes de herança múltipla.
- Prefira composição/delegação para variar comportamento.
- Use generics para preservar tipos em coleções e repositórios.

---

## Exercícios

1. Crie uma ABC para `Pagamento`.
2. Crie um Protocol para `EmailSender`.
3. Implemente um repository genérico.
4. Crie um mixin de serialização.
5. Mostre MRO em herança múltipla.
6. Refatore herança para delegação.
7. Explique diferença entre ABC e Protocol.
