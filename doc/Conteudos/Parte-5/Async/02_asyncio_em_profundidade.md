# Asyncio em Profundidade

`asyncio` é a biblioteca padrão do Python para programação assíncrona cooperativa. Este arquivo aprofunda tasks, futures, `gather`, `TaskGroup`, filas, semáforos, timeouts, cancelamento, executors e padrões de produção.

---

## Sumário

1. [Modelo Mental do Asyncio](#modelo-mental-do-asyncio)
2. [Tasks](#tasks)
3. [Futures](#futures)
4. [`asyncio.gather`](#asynciogather)
5. [`TaskGroup`](#taskgroup)
6. [Timeouts](#timeouts)
7. [Cancelamento](#cancelamento)
8. [Semáforos](#semáforos)
9. [Filas Assíncronas](#filas-assíncronas)
10. [Executors](#executors)
11. [Produtor e Consumidor](#produtor-e-consumidor)
12. [Boas Práticas](#boas-práticas)
13. [Exercícios](#exercícios)

---

## Modelo Mental do Asyncio

`asyncio` executa coroutines em uma thread, alternando entre elas quando encontram `await`.

Isso é cooperação:

```text
coroutine A executa
A encontra await
loop executa B
B encontra await
loop volta para A quando I/O termina
```

Se uma coroutine roda CPU pesada sem `await`, ela bloqueia o loop.

---

## Tasks

Task agenda coroutine para execução concorrente.

```python
import asyncio

async def trabalho(nome: str, delay: float):
    await asyncio.sleep(delay)
    return nome

async def main():
    task = asyncio.create_task(trabalho("A", 1))
    resultado = await task
    print(resultado)

asyncio.run(main())
```

Várias tasks:

```python
tasks = [
    asyncio.create_task(trabalho(f"tarefa-{i}", 1))
    for i in range(5)
]

resultados = [await task for task in tasks]
```

As tasks começam ao serem criadas.

---

## Futures

`asyncio.Future` representa um resultado futuro controlado pelo event loop. Em código de aplicação, você normalmente usa `Task`, `gather`, `TaskGroup` e bibliotecas async; futures aparecem mais em integração de baixo nível.

Relação importante:

- coroutine: função suspensa que pode ser aguardada;
- task: coroutine agendada no event loop;
- future: promessa de resultado futuro;
- task é uma especialização de future.

Exemplo didático:

```python
import asyncio

async def preencher_depois(future: asyncio.Future):
    await asyncio.sleep(1)
    future.set_result("pronto")

async def main():
    loop = asyncio.get_running_loop()
    future = loop.create_future()

    asyncio.create_task(preencher_depois(future))
    resultado = await future
    print(resultado)

asyncio.run(main())
```

Cuidados:

- não crie futures manualmente sem necessidade;
- não chame `set_result` duas vezes;
- trate cancelamento antes de preencher resultado;
- prefira APIs de alto nível quando possível.

---

## `asyncio.gather`

`gather` aguarda várias awaitables.

```python
resultados = await asyncio.gather(
    trabalho("A", 1),
    trabalho("B", 1),
    trabalho("C", 1),
)
```

Com exceções:

```python
resultados = await asyncio.gather(
    trabalho("A", 1),
    trabalho("B", 1),
    return_exceptions=True,
)
```

Use `return_exceptions=True` somente quando você pretende tratar cada erro individualmente.

---

## `TaskGroup`

`TaskGroup` oferece concorrência estruturada.

```python
import asyncio

async def main():
    async with asyncio.TaskGroup() as tg:
        task_a = tg.create_task(trabalho("A", 1))
        task_b = tg.create_task(trabalho("B", 1))

    print(task_a.result(), task_b.result())
```

Vantagens:

- escopo claro das tasks;
- propagação consistente de erros;
- cancelamento coordenado;
- melhor para código moderno.

---

## Timeouts

Timeout evita espera infinita.

```python
async def main():
    try:
        resultado = await asyncio.wait_for(trabalho("A", 10), timeout=2)
    except asyncio.TimeoutError:
        print("tempo excedido")
```

Em Python moderno:

```python
async def main():
    try:
        async with asyncio.timeout(2):
            await trabalho("A", 10)
    except TimeoutError:
        print("tempo excedido")
```

---

## Cancelamento

Tasks podem ser canceladas.

```python
async def tarefa_longa():
    try:
        await asyncio.sleep(10)
    except asyncio.CancelledError:
        print("limpando recursos")
        raise
```

Sempre propague `CancelledError` depois de limpar recursos.

---

## Semáforos

Semáforo limita concorrência.

```python
async def buscar_com_limite(semaforo, user_id):
    async with semaforo:
        return await buscar_usuario(user_id)

async def main():
    semaforo = asyncio.Semaphore(10)
    resultados = await asyncio.gather(
        *(buscar_com_limite(semaforo, i) for i in range(100))
    )
```

Use para evitar sobrecarregar APIs, banco, sockets e serviços externos.

---

## Filas Assíncronas

```python
fila = asyncio.Queue()

await fila.put("item")
item = await fila.get()
fila.task_done()
```

Filas desacoplam produtores e consumidores.

---

## Executors

Use executor para rodar função bloqueante sem travar event loop.

```python
import asyncio
import time

def bloqueante():
    time.sleep(2)
    return "ok"

async def main():
    resultado = await asyncio.to_thread(bloqueante)
    print(resultado)
```

Para CPU-bound, considere `ProcessPoolExecutor`.

---

## Produtor e Consumidor

```python
import asyncio

async def produtor(fila: asyncio.Queue):
    for i in range(10):
        await fila.put(i)
    await fila.put(None)

async def consumidor(fila: asyncio.Queue):
    while True:
        item = await fila.get()
        try:
            if item is None:
                break
            print("processando", item)
            await asyncio.sleep(0.1)
        finally:
            fila.task_done()

async def main():
    fila = asyncio.Queue(maxsize=5)
    await asyncio.gather(produtor(fila), consumidor(fila))
```

`maxsize` ajuda com backpressure.

---

## Boas Práticas

- Use `TaskGroup` para concorrência estruturada.
- Use timeout em I/O.
- Limite concorrência.
- Propague cancelamento.
- Não bloqueie o event loop.
- Use filas com `maxsize` para backpressure.
- Nomeie tasks em fluxos complexos.
- Registre erros de tasks.
- Prefira `asyncio.to_thread` para bloqueio simples.
- Use `Future` manual apenas em integração de baixo nível.

---

## Exercícios

1. Crie tasks com `create_task`.
2. Reescreva com `TaskGroup`.
3. Adicione timeout.
4. Implemente cancelamento limpo.
5. Limite concorrência com semáforo.
6. Crie produtor e consumidor com `asyncio.Queue`.
7. Rode função bloqueante com `asyncio.to_thread`.
8. Explique diferença entre coroutine, task e future.
