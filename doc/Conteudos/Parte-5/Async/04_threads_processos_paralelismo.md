# Multithreading, Multiprocessing e Execução Paralela

Async não substitui threads e processos. Este arquivo mostra quando usar multithreading, multiprocessing, executors e como escolher a ferramenta certa para I/O-bound, CPU-bound e bibliotecas bloqueantes.

---

## Sumário

1. [Threading](#threading)
2. [GIL](#gil)
3. [ThreadPoolExecutor](#threadpoolexecutor)
4. [Race Conditions e Locks](#race-conditions-e-locks)
5. [Multiprocessing](#multiprocessing)
6. [ProcessPoolExecutor](#processpoolexecutor)
7. [Asyncio com Threads e Processos](#asyncio-com-threads-e-processos)
8. [Futures em `concurrent.futures`](#futures-em-concurrentfutures)
9. [Como Escolher](#como-escolher)
10. [Boas Práticas](#boas-práticas)
11. [Exercícios](#exercícios)

---

## Threading

Threads compartilham memória no mesmo processo.

São úteis para:

- I/O bloqueante;
- bibliotecas síncronas sem versão async;
- tarefas leves em background;
- integração com código legado.

```python
from threading import Thread
import time

def tarefa(nome: str):
    time.sleep(1)
    print(nome)

threads = [Thread(target=tarefa, args=(f"t{i}",)) for i in range(5)]

for thread in threads:
    thread.start()

for thread in threads:
    thread.join()
```

---

## GIL

GIL, Global Interpreter Lock, limita execução simultânea de bytecode Python em múltiplas threads.

Impacto:

- threads não aceleram CPU-bound puro em CPython;
- threads ainda ajudam I/O-bound;
- bibliotecas em C podem liberar GIL;
- multiprocessing evita GIL usando processos.

---

## ThreadPoolExecutor

Interface mais prática para threads.

```python
from concurrent.futures import ThreadPoolExecutor
import requests

def buscar(url: str) -> int:
    resposta = requests.get(url, timeout=10)
    return resposta.status_code

urls = ["https://example.com"] * 10

with ThreadPoolExecutor(max_workers=5) as executor:
    resultados = list(executor.map(buscar, urls))
```

Use para código bloqueante quando reescrever para async não compensa.

---

## Race Conditions e Locks

Race condition ocorre quando múltiplas threads alteram estado compartilhado sem coordenação.

```python
from threading import Lock

class Contador:
    def __init__(self):
        self.valor = 0
        self._lock = Lock()

    def incrementar(self):
        with self._lock:
            self.valor += 1
```

Evite estado compartilhado quando possível.

---

## Multiprocessing

Processos têm memória separada e podem rodar em múltiplos núcleos.

```python
from multiprocessing import Process

def calcular(n: int):
    print(sum(i * i for i in range(n)))

processos = [Process(target=calcular, args=(1_000_000,)) for _ in range(4)]

for processo in processos:
    processo.start()

for processo in processos:
    processo.join()
```

Use para CPU-bound.

---

## ProcessPoolExecutor

```python
from concurrent.futures import ProcessPoolExecutor

def quadrado_pesado(n: int) -> int:
    return sum(i * i for i in range(n))

valores = [1_000_000, 2_000_000, 3_000_000]

with ProcessPoolExecutor() as executor:
    resultados = list(executor.map(quadrado_pesado, valores))
```

Cuidados:

- funções precisam ser serializáveis;
- enviar dados grandes entre processos custa caro;
- inicialização de processo tem overhead;
- em macOS/Windows, proteja entrada com `if __name__ == "__main__"`.

---

## Asyncio com Threads e Processos

Rodando função bloqueante em thread:

```python
resultado = await asyncio.to_thread(funcao_bloqueante, arg1, arg2)
```

Com executor:

```python
import asyncio
from concurrent.futures import ProcessPoolExecutor

def cpu_bound(n):
    return sum(i * i for i in range(n))

async def main():
    loop = asyncio.get_running_loop()

    with ProcessPoolExecutor() as pool:
        resultado = await loop.run_in_executor(pool, cpu_bound, 10_000_000)

    print(resultado)
```

---

## Futures em `concurrent.futures`

Um `Future` representa um resultado que ainda não está pronto.

```python
from concurrent.futures import ThreadPoolExecutor, as_completed
import requests

def status(url: str) -> int:
    response = requests.get(url, timeout=10)
    return response.status_code

urls = ["https://example.com", "https://python.org"]

with ThreadPoolExecutor(max_workers=4) as executor:
    futures = [executor.submit(status, url) for url in urls]

    for future in as_completed(futures):
        try:
            print(future.result())
        except requests.RequestException as erro:
            print(f"falha: {erro}")
```

Métodos importantes:

- `submit`: envia uma função para execução e retorna um `Future`;
- `future.result(timeout=...)`: espera e retorna o resultado ou propaga exceção;
- `future.cancel()`: tenta cancelar antes da execução começar;
- `future.done()`: informa se terminou;
- `as_completed`: processa resultados conforme ficam prontos.

No `asyncio`, `Task` também é um tipo de future, mas integrado ao event loop.

---

## Como Escolher

| Problema | Escolha comum |
|---|---|
| Muitas APIs HTTP async | `asyncio` + `aiohttp` |
| Requests síncrono legado | `ThreadPoolExecutor` |
| CPU pesado Python puro | `ProcessPoolExecutor` |
| Tarefas distribuídas | Celery |
| Eventos de alto volume | Kafka |
| Background local simples | thread ou task async |
| Banco com driver async | async |
| Banco com driver síncrono | thread ou driver próprio |

---

## Boas Práticas

- Não use threads para CPU-bound esperando aceleração.
- Proteja estado compartilhado.
- Prefira filas a estado global compartilhado.
- Use `max_workers` conscientemente.
- Meça overhead de processos.
- Proteja multiprocessing com `if __name__ == "__main__"`.
- Não misture async, threads e processos sem necessidade clara.
- Documente a decisão.

---

## Exercícios

1. Execute 5 tarefas com `Thread`.
2. Reescreva com `ThreadPoolExecutor`.
3. Crie race condition e corrija com `Lock`.
4. Execute CPU-bound com `ProcessPoolExecutor`.
5. Rode função bloqueante dentro de async com `to_thread`.
6. Compare async, thread e processo para cenários diferentes.
7. Use `submit`, `Future.result` e `as_completed`.
