# Tipagem, PEP 8 e Boas Práticas em Python

Este guia mostra como escrever Python claro, sustentável e profissional usando type hints, organização, PEP 8, validação de contratos e padrões de código limpo.

---

## Sumário

1. [Objetivo](#objetivo)
2. [Tipagem Dinâmica e Type Hints](#tipagem-dinâmica-e-type-hints)
3. [Tipos Básicos](#tipos-básicos)
4. [Coleções Tipadas](#coleções-tipadas)
5. [Optional, Union e Literal](#optional-union-e-literal)
6. [Type Aliases](#type-aliases)
7. [Callable](#callable)
8. [TypedDict, Protocol e Dataclass](#typeddict-protocol-e-dataclass)
9. [Mypy e Pyright](#mypy-e-pyright)
10. [PEP 8](#pep-8)
11. [Organização de Código](#organização-de-código)
12. [Boas Práticas Profissionais](#boas-práticas-profissionais)
13. [Nível Avançado: Tipagem Como Contrato de Arquitetura](#nível-avançado-tipagem-como-contrato-de-arquitetura)
14. [Armadilhas de Especialista](#armadilhas-de-especialista)
15. [Checklist de Proficiência](#checklist-de-proficiência)
16. [Exercícios](#exercícios)

---

## Objetivo

Tipagem em Python não torna a linguagem estaticamente tipada em tempo de execução, mas melhora:

- leitura;
- autocomplete;
- refatoração;
- documentação;
- detecção antecipada de erros;
- comunicação entre pessoas do time.

---

## Tipagem Dinâmica e Type Hints

Python continua dinâmico:

```python
def somar(a, b):
    return a + b
```

Com type hints:

```python
def somar(a: int, b: int) -> int:
    return a + b
```

Type hints documentam intenção. Ferramentas como `mypy` e `pyright` verificam inconsistências.

---

## Tipos Básicos

```python
nome: str = "Ana"
idade: int = 30
altura: float = 1.70
ativo: bool = True
```

Função:

```python
def formatar_usuario(nome: str, idade: int) -> str:
    return f"{nome} ({idade})"
```

Função sem retorno significativo:

```python
def registrar_log(mensagem: str) -> None:
    print(mensagem)
```

---

## Coleções Tipadas

Em Python moderno:

```python
nomes: list[str] = ["Ana", "Bia"]
idades: dict[str, int] = {"Ana": 30}
coordenada: tuple[int, int] = (10, 20)
ids: set[int] = {1, 2, 3}
```

Função:

```python
def calcular_media(notas: list[float]) -> float:
    return sum(notas) / len(notas)
```

Iterable quando a função só percorre:

```python
from collections.abc import Iterable

def somar(valores: Iterable[int]) -> int:
    return sum(valores)
```

Sequence quando precisa de tamanho ou índice:

```python
from collections.abc import Sequence

def primeiro(valores: Sequence[str]) -> str:
    return valores[0]
```

---

## Optional, Union e Literal

### Optional

```python
def buscar_usuario(user_id: int) -> dict[str, str] | None:
    if user_id == 1:
        return {"nome": "Ana"}
    return None
```

`X | None` significa que o retorno pode ser `X` ou `None`.

### Union

```python
def normalizar_id(valor: int | str) -> int:
    return int(valor)
```

### Literal

```python
from typing import Literal

Status = Literal["pendente", "aprovado", "cancelado"]

def atualizar_status(status: Status) -> None:
    print(status)
```

---

## Type Aliases

```python
UserId = int
JsonDict = dict[str, str | int | float | bool | None]

def carregar_usuario(user_id: UserId) -> JsonDict:
    return {"id": user_id, "nome": "Ana"}
```

Use aliases quando o tipo aparece várias vezes ou representa um conceito do domínio.

---

## Callable

Use `Callable` para funções recebidas como argumento.

```python
from collections.abc import Callable

def aplicar(valor: int, funcao: Callable[[int], int]) -> int:
    return funcao(valor)
```

Exemplo:

```python
def dobrar(x: int) -> int:
    return x * 2

print(aplicar(10, dobrar))
```

---

## TypedDict, Protocol e Dataclass

### TypedDict

```python
from typing import TypedDict

class UsuarioDict(TypedDict):
    id: int
    nome: str
    ativo: bool

def exibir_usuario(usuario: UsuarioDict) -> str:
    return usuario["nome"]
```

Útil para dicionários com formato conhecido.

### Dataclass

```python
from dataclasses import dataclass

@dataclass
class Usuario:
    id: int
    nome: str
    ativo: bool = True
```

Uso:

```python
usuario = Usuario(id=1, nome="Ana")
```

### Protocol

Protocol define comportamento esperado.

```python
from typing import Protocol

class RepositorioUsuario(Protocol):
    def buscar_nome(self, user_id: int) -> str | None:
        ...

def exibir_nome(repo: RepositorioUsuario, user_id: int) -> str:
    nome = repo.buscar_nome(user_id)
    return nome or "desconhecido"
```

Útil para baixo acoplamento.

---

## Mypy e Pyright

Instalação:

```bash
python -m pip install mypy pyright
```

Rodando:

```bash
mypy src
pyright
```

Configuração gradativa:

```toml
[tool.mypy]
python_version = "3.12"
warn_return_any = true
warn_unused_ignores = true
disallow_untyped_defs = true
```

Comece com módulos novos e avance aos poucos.

---

## PEP 8

PEP 8 é o guia de estilo mais conhecido do Python.

### Nomes

```python
snake_case = "variáveis e funções"
CONSTANTE = "constantes"
CamelCase = "classes"
```

### Tamanho de linha

Muitos projetos usam 88 caracteres por causa do `black`, embora PEP 8 cite 79.

### Imports

Ordem recomendada:

```python
import os
from pathlib import Path

import requests

from meu_projeto.servicos import criar_usuario
```

Grupos:

1. biblioteca padrão;
2. dependências externas;
3. código local.

### Espaços

```python
total = preco * quantidade
```

Evite:

```python
total=preco*quantidade
```

---

## Organização de Código

Estrutura simples:

```text
projeto/
  src/
    app/
      __init__.py
      main.py
      services.py
      models.py
  tests/
    test_services.py
  pyproject.toml
  README.md
```

Separação prática:

- `models.py`: estruturas e entidades;
- `services.py`: regras de negócio;
- `repositories.py`: acesso a dados;
- `main.py`: entrada da aplicação;
- `tests/`: testes automatizados.

---

## Boas Práticas Profissionais

### Prefira código explícito

```python
if usuario.ativo:
    enviar_email(usuario)
```

### Evite funções longas

Se a função exige muitos comentários para ser entendida, talvez precise ser dividida.

### Separe efeitos colaterais

Função pura:

```python
def calcular_total(preco: float, quantidade: int) -> float:
    return preco * quantidade
```

Função com efeito colateral:

```python
def salvar_pedido(pedido) -> None:
    banco.salvar(pedido)
```

Ambas podem existir, mas misturar cálculo com I/O dificulta testes.

### Use ferramentas

Ferramentas comuns:

- `ruff`: lint e formatação rápida;
- `black`: formatação;
- `mypy`: checagem de tipos;
- `pytest`: testes;
- `pre-commit`: automação antes do commit.

---

## Nível Avançado: Tipagem Como Contrato de Arquitetura

Type hints são mais poderosos quando usados para expressar contratos entre camadas.

### NewType para evitar IDs misturados

```python
from typing import NewType

UserId = NewType("UserId", int)
OrderId = NewType("OrderId", int)

def buscar_usuario(user_id: UserId) -> str:
    return f"usuário {user_id}"
```

Ferramentas de tipo ajudam a evitar passar `OrderId` onde se espera `UserId`.

### TypeVar e Generic

```python
from typing import Generic, TypeVar

T = TypeVar("T")

def primeiro_ou_none(valores: list[T]) -> T | None:
    if not valores:
        return None
    return valores[0]
```

O retorno preserva o tipo da lista.

`Generic` permite criar classes parametrizadas por tipo:

```python
from typing import Generic, TypeVar

T = TypeVar("T")


class Caixa(Generic[T]):
    def __init__(self, valor: T) -> None:
        self.valor = valor

    def obter(self) -> T:
        return self.valor


caixa_texto = Caixa[str]("python")
revelado: str = caixa_texto.obter()
```

Use generics quando a classe ou função preserva relação entre tipos de entrada e saída. Evite quando só torna a assinatura mais difícil sem aumentar segurança.

### Protocol para inversão de dependência

```python
from typing import Protocol

class EmailSender(Protocol):
    def enviar(self, destinatario: str, assunto: str, corpo: str) -> None:
        ...

def notificar_boas_vindas(sender: EmailSender, email: str) -> None:
    sender.enviar(email, "Bem-vindo", "Sua conta foi criada")
```

Isso permite testar com fake sem depender de implementação concreta.

### Overload

```python
from typing import overload

@overload
def pegar(valor: str, como_lista: bool = False) -> str:
    ...

@overload
def pegar(valor: str, como_lista: bool = True) -> list[str]:
    ...

def pegar(valor: str, como_lista: bool = False):
    if como_lista:
        return [valor]
    return valor
```

Use quando o tipo de retorno depende de parâmetros.

### Final e ClassVar

```python
from typing import ClassVar, Final

VERSAO_API: Final = "v1"

class Config:
    ambiente: ClassVar[str] = "prod"
```

`Final` comunica que o valor não deve ser reatribuído. `ClassVar` indica atributo de classe.

### Annotated

```python
from typing import Annotated

Idade = Annotated[int, "idade em anos, deve ser >= 0"]
```

Frameworks podem usar metadados de `Annotated` para validação e documentação.

### PEP 8 em projetos grandes

Estilo não é estética isolada. É redução de atrito.

Decisões importantes:

- formatação automática com `ruff format` ou `black`;
- lint obrigatório em CI;
- imports ordenados;
- nomes consistentes por camada;
- docstrings em APIs públicas;
- funções pequenas e testáveis;
- erros de domínio padronizados.

### Exemplo de função profissional

```python
from dataclasses import dataclass
from typing import Protocol

@dataclass(frozen=True)
class Pedido:
    id: int
    total: float
    email_cliente: str

class PedidoRepository(Protocol):
    def salvar(self, pedido: Pedido) -> None:
        ...

class EmailSender(Protocol):
    def enviar(self, destinatario: str, assunto: str, corpo: str) -> None:
        ...

def finalizar_pedido(
    pedido: Pedido,
    repository: PedidoRepository,
    email_sender: EmailSender,
) -> None:
    if pedido.total <= 0:
        raise ValueError("pedido.total deve ser positivo")

    repository.salvar(pedido)
    email_sender.enviar(
        pedido.email_cliente,
        "Pedido finalizado",
        f"Pedido {pedido.id} finalizado com sucesso",
    )
```

Esse exemplo combina:

- `dataclass`;
- imutabilidade;
- contratos com `Protocol`;
- validação;
- baixo acoplamento;
- testabilidade.

---

## Armadilhas de Especialista

### Tipar tudo como `Any`

`Any` desliga a checagem naquele ponto. Use apenas em bordas inevitáveis, como JSON externo ainda não validado.

### Dicionários genéricos demais

```python
def processar(usuario: dict) -> None:
    ...
```

Melhor:

```python
from typing import TypedDict

class UsuarioPayload(TypedDict):
    nome: str
    email: str
```

### PEP 8 sem design

Código formatado ainda pode ser ruim. PEP 8 melhora consistência, mas não substitui bons nomes, funções pequenas, testes e arquitetura.

---

## Checklist de Proficiência

- Sei usar tipos para documentar contratos.
- Sei usar `Protocol` para reduzir acoplamento.
- Sei usar `TypedDict` para payloads estruturados.
- Sei usar `dataclass` para entidades simples.
- Sei usar `TypeVar` e `Generic` quando preservam informação de tipo.
- Sei evitar `Any` desnecessário.
- Sei configurar `ruff`, `mypy` e formatação automática.
- Sei diferenciar estilo, lint, tipagem e design.

---

## Ampliação de Proficiência

### Tipagem como comunicação

Type hints não existem apenas para ferramenta. Eles comunicam contrato.

```python
def buscar_usuario(usuario_id: int) -> dict[str, str] | None:
    ...
```

Esse retorno obriga quem chama a lidar com ausência.

```python
usuario = buscar_usuario(1)
if usuario is None:
    print("não encontrado")
else:
    print(usuario["nome"])
```

### Tipos mais gerais para entrada

Se a função apenas percorre valores, aceite `Iterable`.

```python
from collections.abc import Iterable

def totalizar(valores: Iterable[float]) -> float:
    return sum(valores)
```

Se precisa de índice, use `Sequence`.

```python
from collections.abc import Sequence

def primeiro(valores: Sequence[str]) -> str:
    return valores[0]
```

### Boas práticas que realmente importam

PEP 8 é base. Código profissional também precisa:

- nomes que expressem intenção;
- funções pequenas;
- erros explícitos;
- testes;
- baixa duplicação;
- dependências controladas;
- fronteiras claras entre módulos;
- documentação suficiente para execução e manutenção.

### Evitando "tipagem decorativa"

Ruim:

```python
def processar(dados: dict) -> dict:
    ...
```

Melhor:

```python
from typing import TypedDict

class Pedido(TypedDict):
    id: int
    total: float

def processar(pedido: Pedido) -> Pedido:
    ...
```

### Mini-checklist de domínio

- Sei usar `list[str]`, `dict[str, int]` e `X | None`.
- Sei escolher `Iterable` ou `Sequence`.
- Sei usar `TypedDict` para dicionários estruturados.
- Sei usar `dataclass` para dados com comportamento simples.
- Sei explicar que type hints não validam automaticamente em runtime.
- Sei escrever código legível antes de buscar esperteza.

---

## Exercícios

1. Adicione type hints a funções sem tipagem.
2. Crie uma `dataclass` para Produto.
3. Crie um `TypedDict` para payload de API.
4. Use `Literal` para status de pedido.
5. Use `Callable` em uma função que recebe estratégia de cálculo.
6. Reorganize imports seguindo PEP 8.
7. Separe uma função longa em funções menores.
8. Crie um type alias para JSON.
9. Configure `mypy` em um `pyproject.toml`.
10. Rode `ruff` em um arquivo e corrija os avisos.
11. Crie uma classe `Caixa[T]` usando `Generic` e `TypeVar`.

---

## Aprofundamento Complementar

### Tipagem gradual

Você não precisa tipar tudo de uma vez. Comece por:

- funções públicas;
- regras de negócio;
- retornos que podem ser `None`;
- estruturas de dados compartilhadas;
- pontos onde bugs aparecem com frequência.

### Contratos mais fortes com tipos

```python
from typing import Literal

Moeda = Literal["BRL", "USD", "EUR"]

def formatar_moeda(valor: float, moeda: Moeda) -> str:
    ...
```

Isso evita strings arbitrárias em partes importantes do código.

### Dataclass congelada

```python
from dataclasses import dataclass

@dataclass(frozen=True)
class Produto:
    nome: str
    preco: float
```

`frozen=True` ajuda quando o objeto representa um valor que não deve mudar.

### Boas práticas além da formatação

Código formatado ainda pode ser ruim. Qualidade também inclui baixo acoplamento, funções pequenas, nomes precisos, testes, ausência de duplicação acidental, erros explícitos e módulos com responsabilidade clara.

### Exercícios extras

1. Crie um `Literal` para status de pedido.
2. Transforme um dicionário de usuário em `TypedDict`.
3. Transforme um produto em `dataclass(frozen=True)`.
4. Troque `list` por `Sequence` em uma função que só lê dados.
5. Rode uma ferramenta de tipagem e corrija um erro real.
