# Fundamentos: Concorrência, Paralelismo e Async/Await

Este arquivo apresenta os conceitos fundamentais do desenvolvimento assíncrono em Python: concorrência, paralelismo, I/O-bound, CPU-bound, event loop, coroutines, `async def`, `await` e quando usar cada abordagem.

---

## Sumário

1. [Problema Que Async Resolve](#problema-que-async-resolve)
2. [Concorrência vs Paralelismo](#concorrência-vs-paralelismo)
3. [I/O-bound vs CPU-bound](#io-bound-vs-cpu-bound)
4. [Async/Await](#asyncawait)
5. [Coroutines](#coroutines)
6. [Event Loop](#event-loop)
7. [Primeiro Exemplo Assíncrono](#primeiro-exemplo-assíncrono)
8. [Execução Sequencial vs Concorrente](#execução-sequencial-vs-concorrente)
9. [Erros Comuns](#erros-comuns)
10. [Boas Práticas](#boas-práticas)
11. [Exercícios](#exercícios)

---

## Problema Que Async Resolve

Muitos programas gastam tempo esperando:

- resposta de API;
- banco de dados;
- arquivo;
- socket;
- fila;
- cache;
- serviço externo.

Esse tipo de espera é I/O. Enquanto uma operação espera, o programa pode iniciar outras operações.

Exemplo síncrono:

```python
import time

def buscar_usuario(user_id: int) -> dict:
    time.sleep(1)
    return {"id": user_id}

inicio = time.perf_counter()
usuarios = [buscar_usuario(i) for i in range(5)]
fim = time.perf_counter()

print(f"{fim - inicio:.2f}s")
```

Tempo aproximado: 5 segundos.

Com concorrência, as esperas podem se sobrepor.

---

## Concorrência vs Paralelismo

Concorrência é lidar com várias tarefas em andamento.

Paralelismo é executar várias tarefas ao mesmo tempo fisicamente, normalmente em múltiplos núcleos.

```text
Concorrência:
tarefa A espera rede
tarefa B usa o tempo livre
tarefa C espera disco

Paralelismo:
CPU 1 executa A
CPU 2 executa B
CPU 3 executa C
```

Async é excelente para concorrência I/O-bound.

Multiprocessing é melhor para paralelismo CPU-bound.

---

## I/O-bound vs CPU-bound

I/O-bound:

- chamadas HTTP;
- banco de dados;
- leitura/escrita de arquivos;
- filas;
- sockets.

CPU-bound:

- compressão pesada;
- cálculo numérico puro;
- processamento de imagem;
- criptografia;
- parsing enorme;
- machine learning pesado.

Regra prática:

| Tipo | Melhor abordagem comum |
|---|---|
| Muitas chamadas HTTP | `asyncio`/`aiohttp` |
| Banco assíncrono | driver async |
| Arquivo local simples | síncrono pode bastar |
| CPU pesada | multiprocessing |
| Biblioteca bloqueante legada | threads ou executor |
| Tarefas em background distribuídas | Celery |
| Eventos em larga escala | Kafka |

---

## Async/Await

`async def` define uma coroutine function.

```python
async def ola():
    return "olá"
```

Chamar essa função não executa imediatamente:

```python
coro = ola()
print(coro)
```

Você precisa aguardar:

```python
resultado = await ola()
```

`await` só pode ser usado dentro de função `async`.

---

## Coroutines

Coroutine é uma unidade de execução cooperativa.

Ela pode pausar em `await` e devolver controle ao event loop.

```python
import asyncio

async def tarefa(nome: str):
    print(f"iniciando {nome}")
    await asyncio.sleep(1)
    print(f"finalizando {nome}")
```

`asyncio.sleep` não bloqueia a thread. Ele sinaliza ao event loop que a coroutine pode pausar.

---

## Event Loop

Event loop coordena coroutines, tasks, callbacks e I/O.

Entrada padrão:

```python
import asyncio

async def main():
    print("executando")

if __name__ == "__main__":
    asyncio.run(main())
```

`asyncio.run`:

- cria event loop;
- executa a coroutine principal;
- finaliza tarefas;
- fecha o loop.

Em aplicações modernas, use `asyncio.run` na borda do programa.

---

## Primeiro Exemplo Assíncrono

```python
import asyncio
import time

async def buscar_usuario(user_id: int) -> dict:
    await asyncio.sleep(1)
    return {"id": user_id}

async def main():
    inicio = time.perf_counter()

    usuarios = await asyncio.gather(
        buscar_usuario(1),
        buscar_usuario(2),
        buscar_usuario(3),
    )

    fim = time.perf_counter()
    print(usuarios)
    print(f"{fim - inicio:.2f}s")

asyncio.run(main())
```

As três tarefas esperam ao mesmo tempo. Tempo aproximado: 1 segundo.

---

## Execução Sequencial vs Concorrente

Sequencial:

```python
async def main():
    a = await buscar_usuario(1)
    b = await buscar_usuario(2)
    c = await buscar_usuario(3)
    return [a, b, c]
```

Concorrente:

```python
async def main():
    return await asyncio.gather(
        buscar_usuario(1),
        buscar_usuario(2),
        buscar_usuario(3),
    )
```

O simples fato de usar `async` não torna o código concorrente. Você precisa criar tarefas concorrentes ou usar `gather`, `TaskGroup`, filas, etc.

---

## Erros Comuns

### Esquecer `await`

```python
resultado = buscar_usuario(1)  # coroutine, não resultado
```

Correto:

```python
resultado = await buscar_usuario(1)
```

### Usar função bloqueante dentro de async

Errado:

```python
import time

async def tarefa():
    time.sleep(1)
```

Correto:

```python
async def tarefa():
    await asyncio.sleep(1)
```

### Esperar sequencialmente sem necessidade

```python
for user_id in ids:
    await buscar_usuario(user_id)
```

Se as chamadas são independentes, use concorrência controlada.

---

## Boas Práticas

- Use async para I/O concorrente.
- Não coloque bloqueios síncronos dentro de coroutines.
- Controle concorrência com semáforos.
- Defina timeouts.
- Trate cancelamento.
- Use nomes claros para tasks.
- Meça antes de trocar arquitetura.
- Não misture async e threads sem motivo.

---

## Exercícios

1. Crie uma coroutine simples com `async def`.
2. Execute com `asyncio.run`.
3. Compare execução sequencial e `asyncio.gather`.
4. Substitua `time.sleep` por `asyncio.sleep`.
5. Explique diferença entre concorrência e paralelismo.
6. Classifique tarefas como I/O-bound ou CPU-bound.
7. Crie três tarefas independentes e execute em paralelo lógico.

