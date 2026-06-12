# Core Python e Bibliotecas Built-in

Este módulo organiza os principais módulos da biblioteca padrão que um profissional Python deve conhecer desde a base. A biblioteca padrão é grande; o objetivo aqui é saber quando cada módulo resolve um problema sem instalar dependência externa.

---

## Visão Geral

| Categoria | Módulos |
|---|---|
| coleções e programação funcional | `collections`, `itertools`, `functools`, `operator` |
| sistema operacional e processos | `pathlib`, `os`, `sys`, `subprocess`, `shutil` |
| dados e configuração | `json`, `pickle`, `csv`, `configparser` |
| datas e tempo | `datetime`, `time`, `zoneinfo` |
| texto, segurança e logs | `re`, `hashlib`, `hmac`, `secrets`, `logging` |
| concorrência | `threading`, `multiprocessing`, `concurrent.futures`, `asyncio` |
| recursos de linguagem | `contextlib`, `dataclasses`, `enum`, `abc` |

---

## collections

`collections` oferece estruturas especializadas.

```python
from collections import Counter, defaultdict, deque, namedtuple

contagem = Counter(["python", "sql", "python"])
fila = deque(["a", "b"])
fila.append("c")
fila.popleft()

grupos = defaultdict(list)
grupos["backend"].append("Ana")

Ponto = namedtuple("Ponto", ["x", "y"])
p = Ponto(10, 20)
```

Usos:

- `Counter`: contagem;
- `defaultdict`: agrupamento;
- `deque`: filas e pilhas eficientes nas pontas;
- `namedtuple`: tuplas nomeadas simples.

---

## itertools

`itertools` trabalha com iteradores eficientes e composição preguiçosa.

```python
from itertools import chain, combinations, count, islice, product

for par in combinations(["A", "B", "C"], 2):
    print(par)

primeiros = islice(count(start=10), 5)
print(list(primeiros))

todos = list(product(["P", "M"], ["azul", "preto"]))
```

Use quando precisa combinar, fatiar ou gerar sequências sem materializar tudo cedo demais.

---

## functools

`functools` ajuda com decorators, cache e adaptação de funções.

```python
from functools import lru_cache, partial, reduce, wraps


@lru_cache(maxsize=256)
def fib(n: int) -> int:
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)


def aplicar_taxa(valor: float, taxa: float) -> float:
    return valor * (1 + taxa)


aplicar_taxa_padrao = partial(aplicar_taxa, taxa=0.10)
```

`wraps` deve ser usado ao criar decorators para preservar metadados da função original.

---

## operator

`operator` fornece funções para operadores comuns.

```python
from operator import attrgetter, itemgetter

pessoas = [
    {"nome": "Ana", "idade": 30},
    {"nome": "Bia", "idade": 20},
]

ordenadas = sorted(pessoas, key=itemgetter("idade"))
```

Útil para ordenação, agrupamento e código funcional mais claro.

---

## pathlib

`pathlib` é a forma moderna e portátil de lidar com caminhos.

```python
from pathlib import Path

caminho = Path("dados") / "entrada.txt"
if caminho.exists():
    texto = caminho.read_text(encoding="utf-8")
```

Prefira `pathlib` para código novo.

---

## os e sys

`os` acessa recursos do sistema operacional. `sys` acessa detalhes do interpretador e argumentos.

```python
import os
import sys

print(os.environ.get("AMBIENTE", "dev"))
print(sys.argv)
print(sys.version)
```

Use com cuidado em código portável. Para caminhos, prefira `pathlib`.

---

## subprocess

`subprocess` executa comandos externos.

```python
import subprocess

resultado = subprocess.run(
    ["python", "--version"],
    capture_output=True,
    text=True,
    check=True,
)

print(resultado.stdout)
```

Boas práticas:

- passe lista de argumentos;
- evite `shell=True` quando não for necessário;
- use `check=True` para falhar em erro;
- capture saída quando precisa processar;
- trate timeout em comandos longos.

---

## shutil

`shutil` manipula arquivos e diretórios em alto nível.

```python
from pathlib import Path
import shutil

origem = Path("relatorio.txt")
destino = Path("backup") / "relatorio.txt"

destino.parent.mkdir(exist_ok=True)
shutil.copy2(origem, destino)
```

Também oferece `copytree`, `move`, `rmtree`, `make_archive` e `unpack_archive`.

---

## json

`json` serializa dados compatíveis com JSON.

```python
import json

dados = {"nome": "Ana", "ativo": True}
texto = json.dumps(dados, ensure_ascii=False, indent=2)
restaurado = json.loads(texto)
```

JSON é excelente para interoperabilidade, APIs e configuração simples.

---

## pickle

`pickle` serializa objetos Python, mas não é formato seguro para dados não confiáveis.

```python
import pickle

payload = pickle.dumps({"valores": [1, 2, 3]})
objeto = pickle.loads(payload)
```

Nunca carregue pickle vindo de usuário, internet ou fonte não confiável. Para troca de dados, prefira JSON, CSV, Parquet ou formatos documentados.

---

## csv

`csv` lê e escreve dados tabulares simples.

```python
import csv

with open("usuarios.csv", newline="", encoding="utf-8") as arquivo:
    leitor = csv.DictReader(arquivo)
    for linha in leitor:
        print(linha["nome"])
```

Use `DictReader` e `DictWriter` quando as colunas têm nome.

---

## configparser

`configparser` lê arquivos `.ini`.

```python
from configparser import ConfigParser

config = ConfigParser()
config.read("app.ini", encoding="utf-8")

host = config.get("database", "host", fallback="localhost")
porta = config.getint("database", "port", fallback=5432)
```

Útil para configurações simples em formato INI. Para projetos modernos, `tomllib` e `pyproject.toml` também aparecem bastante.

---

## datetime, time e zoneinfo

`datetime` modela datas e horários. `time` mede tempo e pausa execução. `zoneinfo` lida com fusos horários.

```python
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
import time

agora_sp = datetime.now(ZoneInfo("America/Sao_Paulo"))
amanha = agora_sp + timedelta(days=1)

inicio = time.perf_counter()
time.sleep(0.1)
duracao = time.perf_counter() - inicio
```

Boas práticas:

- use timezone em sistemas distribuídos;
- armazene datas em UTC quando possível;
- use `perf_counter` para medir duração;
- evite misturar datetime com e sem timezone.

---

## re

`re` trabalha com expressões regulares.

```python
import re

padrao = re.compile(r"^[\w.-]+@[\w.-]+\.\w+$")

if padrao.match("ana@example.com"):
    print("email com formato plausível")
```

Regex é útil para padrões textuais, mas não deve substituir parsers específicos quando o formato é complexo.

---

## hashlib, hmac e secrets

`hashlib` calcula hashes. `hmac` autentica mensagens com chave secreta. `secrets` gera valores aleatórios seguros.

```python
import hashlib
import hmac
import secrets

digest = hashlib.sha256(b"conteudo").hexdigest()
token = secrets.token_urlsafe(32)

assinatura = hmac.new(
    b"chave-secreta",
    b"mensagem",
    hashlib.sha256,
).hexdigest()
```

Use `secrets`, não `random`, para tokens, senhas temporárias e valores de segurança.

Para senhas de usuários, não use hash simples com SHA-256. Use algoritmos próprios para senha, como Argon2, bcrypt ou PBKDF2.

---

## logging

`logging` registra eventos da aplicação.

```python
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

logger.info("processamento iniciado")
logger.warning("valor ausente, usando fallback")
```

Use níveis:

- `DEBUG`: diagnóstico detalhado;
- `INFO`: evento normal importante;
- `WARNING`: algo inesperado, mas recuperável;
- `ERROR`: falha em uma operação;
- `CRITICAL`: falha grave.

---

## threading

`threading` cria threads dentro do mesmo processo.

```python
import threading


def tarefa(nome: str) -> None:
    print(f"executando {nome}")


thread = threading.Thread(target=tarefa, args=("job-1",))
thread.start()
thread.join()
```

Use para I/O concorrente e tarefas simples em background. Lembre do GIL para CPU-bound.

---

## multiprocessing

`multiprocessing` usa processos separados.

```python
from multiprocessing import Pool


def quadrado(n: int) -> int:
    return n * n


if __name__ == "__main__":
    with Pool() as pool:
        print(pool.map(quadrado, [1, 2, 3, 4]))
```

Processos podem usar múltiplos núcleos em CPU-bound, mas têm custo de serialização e comunicação.

---

## concurrent.futures

`concurrent.futures` oferece uma API de alto nível para threads e processos.

```python
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor


def baixar(url: str) -> str:
    return f"conteudo de {url}"


with ThreadPoolExecutor(max_workers=5) as executor:
    resultados = list(executor.map(baixar, ["a", "b", "c"]))
```

Use:

- `ThreadPoolExecutor` para I/O;
- `ProcessPoolExecutor` para CPU-bound.

---

## asyncio

`asyncio` executa concorrência cooperativa com event loop.

```python
import asyncio


async def buscar(nome: str) -> str:
    await asyncio.sleep(1)
    return f"resultado {nome}"


async def main() -> None:
    resultados = await asyncio.gather(buscar("a"), buscar("b"))
    print(resultados)


asyncio.run(main())
```

Use `asyncio` quando as bibliotecas usadas também são assíncronas e o problema envolve muitas esperas de I/O.

---

## contextlib

`contextlib` facilita criar context managers.

```python
from contextlib import contextmanager, suppress


@contextmanager
def recurso():
    print("abrindo")
    try:
        yield "valor"
    finally:
        print("fechando")


with recurso() as valor:
    print(valor)

with suppress(FileNotFoundError):
    open("nao_existe.txt").close()
```

Também existe `ExitStack` para contextos dinâmicos.

---

## dataclasses

`dataclasses` reduz boilerplate para objetos de dados.

```python
from dataclasses import dataclass, field


@dataclass(frozen=True)
class Produto:
    nome: str
    preco: float
    tags: tuple[str, ...] = field(default_factory=tuple)
```

Use `default_factory` para valores mutáveis ou construídos dinamicamente.

---

## enum

`enum` define conjuntos fechados de valores nomeados.

```python
from enum import Enum


class StatusPedido(Enum):
    PENDENTE = "pendente"
    PAGO = "pago"
    CANCELADO = "cancelado"
```

Enums evitam strings soltas espalhadas pelo código.

---

## abc

`abc` permite classes abstratas.

```python
from abc import ABC, abstractmethod


class Repositorio(ABC):
    @abstractmethod
    def salvar(self, dados: dict) -> None:
        ...
```

Use quando quer impor contrato por herança. Para tipagem estrutural e baixo acoplamento, `Protocol` muitas vezes é mais flexível.

---

## Mapa de Decisão

| Preciso de... | Use |
|---|---|
| contar valores | `collections.Counter` |
| fila eficiente | `collections.deque` |
| combinar sequências | `itertools` |
| cache simples | `functools.lru_cache` |
| ordenar por campo | `operator.itemgetter` ou `attrgetter` |
| caminhos portáveis | `pathlib` |
| copiar diretórios | `shutil` |
| executar comando externo | `subprocess` |
| dados interoperáveis | `json` |
| CSV simples | `csv` |
| configuração INI | `configparser` |
| horário com fuso | `datetime` + `zoneinfo` |
| medir duração | `time.perf_counter` |
| regex | `re` |
| token seguro | `secrets` |
| assinatura com chave | `hmac` |
| logs | `logging` |
| I/O concorrente | `threading`, `ThreadPoolExecutor` ou `asyncio` |
| CPU paralelo | `multiprocessing` ou `ProcessPoolExecutor` |
| context manager simples | `contextlib` |
| objeto de dados | `dataclasses` |
| constantes nomeadas | `enum` |
| contrato abstrato nominal | `abc` |

---

## Checklist de Proficiência

- Sei procurar solução na biblioteca padrão antes de instalar dependência.
- Sei usar `collections`, `itertools`, `functools` e `operator` em transformações comuns.
- Sei manipular caminhos e arquivos com `pathlib`, `os`, `shutil` e `subprocess`.
- Sei escolher entre `json`, `pickle`, `csv` e `configparser`.
- Sei lidar com datas, duração e fuso horário.
- Sei usar `re`, `hashlib`, `hmac`, `secrets` e `logging` sem confundir seus papéis.
- Sei diferenciar thread, processo e coroutine.
- Sei criar context managers com `contextlib`.
- Sei usar `dataclass`, `enum` e `abc` quando simplificam o modelo.

---

## Exercícios

1. Conte palavras com `Counter`.
2. Agrupe registros com `defaultdict`.
3. Gere combinações com `itertools.combinations`.
4. Crie cache com `lru_cache`.
5. Ordene uma lista de dicionários com `itemgetter`.
6. Copie um arquivo com `pathlib` e `shutil`.
7. Execute `python --version` com `subprocess.run`.
8. Leia um CSV com `csv.DictReader`.
9. Leia um `.ini` com `configparser`.
10. Gere um token com `secrets`.
11. Configure um `logger` por módulo.
12. Compare `ThreadPoolExecutor` e `ProcessPoolExecutor` em exemplos pequenos.
13. Crie um context manager com `contextlib`.
14. Modele status com `Enum`.
15. Crie uma classe abstrata com `abc`.
