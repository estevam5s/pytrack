# MyPy: Tipagem Estática Profissional em Python

MyPy analisa type hints em Python para detectar erros antes da execução. Ele ajuda a encontrar chamadas incompatíveis, retornos errados, atributos inexistentes, `None` inesperado e contratos quebrados.

Tipagem em Python é gradual. Você pode começar simples e aumentar rigor com o tempo.

---

## Instalação

```bash
pip install mypy
```

Arquivo:

```python
def somar(a: int, b: int) -> int:
    return a + b


somar("1", 2)
```

Rodar:

```bash
mypy app
```

MyPy aponta incompatibilidade.

---

## Tipos Básicos

```python
def processar(nome: str, idade: int, ativo: bool) -> dict[str, str | int | bool]:
    return {"nome": nome, "idade": idade, "ativo": ativo}
```

Coleções:

```python
nomes: list[str] = ["Ana", "Bruno"]
idades: dict[str, int] = {"Ana": 30}
ids: set[int] = {1, 2, 3}
```

---

## Optional e None

```python
def buscar_nome(usuario_id: int) -> str | None:
    if usuario_id == 1:
        return "Ana"
    return None


nome = buscar_nome(2)
if nome is not None:
    print(nome.upper())
```

Não ignore `None`. Muitos bugs vêm de valor ausente.

---

## Dataclasses Tipadas

```python
from dataclasses import dataclass


@dataclass
class Usuario:
    id: int
    nome: str
    email: str
```

---

## Protocol

`Protocol` define contrato estrutural.

```python
from typing import Protocol


class Notificador(Protocol):
    def enviar(self, destino: str, mensagem: str) -> None:
        ...


class EmailNotificador:
    def enviar(self, destino: str, mensagem: str) -> None:
        print(destino, mensagem)


def avisar(notificador: Notificador) -> None:
    notificador.enviar("ana@example.com", "ok")
```

---

## TypedDict

Para dicionários com schema conhecido.

```python
from typing import TypedDict


class UsuarioPayload(TypedDict):
    id: int
    nome: str
    email: str


def serializar_usuario(usuario: UsuarioPayload) -> str:
    return usuario["email"]
```

Para domínio complexo, prefira dataclass ou Pydantic.

---

## Literal

```python
from typing import Literal

StatusPedido = Literal["aberto", "pago", "cancelado"]


def alterar_status(status: StatusPedido) -> None:
    ...
```

MyPy detecta valores inválidos em código tipado.

---

## Configuração Básica

`pyproject.toml`:

```toml
[tool.mypy]
python_version = "3.12"
warn_return_any = true
warn_unused_configs = true
disallow_untyped_defs = false
ignore_missing_imports = false
```

Para começar em legado:

```toml
[tool.mypy]
python_version = "3.12"
ignore_missing_imports = true
check_untyped_defs = true
```

---

## Modo Strict

```toml
[tool.mypy]
strict = true
```

Strict é excelente para bibliotecas e núcleos críticos, mas pode ser pesado para adoção inicial.

Estratégia:

```toml
[[tool.mypy.overrides]]
module = "app.domain.*"
strict = true
```

Aplique rigor primeiro no domínio.

---

## type: ignore

```python
valor = biblioteca_dinamica()  # type: ignore[no-untyped-call]
```

Use com código específico e motivo. Muitos ignores escondem problemas reais.

---

## Stubs

Algumas bibliotecas precisam de stubs:

```bash
pip install types-requests
```

MyPy pode sugerir:

```bash
mypy --install-types
```

---

## MyPy em CI

```yaml
- name: MyPy
  run: mypy app
```

Para evitar regressão em legado, mantenha lista de módulos checados e amplie com o tempo.

---

## Erros Comuns Detectados

Retorno incompatível:

```python
def buscar_id() -> int:
    return None
```

Chamada incompatível:

```python
def enviar(email: str) -> None:
    ...


enviar(123)
```

Atributo inexistente:

```python
usuario.emial
```

---

## Checklist MyPy

- código novo recebe type hints?
- funções públicas têm tipos?
- `None` é tratado explicitamente?
- domínio tem configuração mais rigorosa?
- ignores são específicos?
- stubs estão instalados?
- CI roda MyPy?
- Any não está se espalhando sem controle?

