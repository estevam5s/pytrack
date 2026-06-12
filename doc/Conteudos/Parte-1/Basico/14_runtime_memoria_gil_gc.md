# Runtime Python: GIL, Memória e Garbage Collection

Este módulo complementa os fundamentos da linguagem com o que todo profissional Python precisa entender sobre execução, memória e concorrência. Não é necessário decorar detalhes internos, mas é essencial saber como eles afetam desempenho, arquitetura e debugging.

---

## O que é o Runtime Python

O runtime é o ambiente que executa seu código Python. No CPython, implementação mais usada da linguagem, ele inclui:

- interpretador de bytecode;
- pilha de chamadas;
- objetos em memória;
- contador de referências;
- garbage collector;
- gerenciamento de imports;
- Global Interpreter Lock, conhecido como GIL.

Python é linguagem; CPython é uma implementação. Muitas regras de sintaxe são da linguagem, mas detalhes como contagem de referências e GIL são principalmente do CPython.

---

## Modelo de Objetos e Referências

Variáveis em Python são nomes apontando para objetos.

```python
a = [1, 2, 3]
b = a
b.append(4)

print(a)  # [1, 2, 3, 4]
```

`a` e `b` apontam para a mesma lista.

Para copiar:

```python
original = [1, 2, 3]
copia = original.copy()
```

Para estruturas aninhadas:

```python
from copy import deepcopy

dados = [{"nome": "Ana"}]
copia = deepcopy(dados)
```

---

## Mutabilidade

Objetos mutáveis podem ser alterados depois de criados:

- `list`;
- `dict`;
- `set`;
- `bytearray`;
- instâncias comuns de classes.

Objetos imutáveis não mudam depois de criados:

- `int`;
- `float`;
- `bool`;
- `str`;
- `tuple`;
- `bytes`;
- `frozenset`.

Imutabilidade reduz efeitos colaterais e facilita uso como chave de `dict`, desde que todos os itens sejam hashable.

---

## Identidade, Igualdade e Hash

```python
a = [1, 2]
b = [1, 2]

print(a == b)  # igualdade de valor
print(a is b)  # mesma identidade?
```

Use `==` para comparar valor. Use `is` para identidade, principalmente com `None`:

```python
if usuario is None:
    ...
```

Objetos usados como chave de `dict` ou item de `set` precisam ser hashable. Em geral, isso significa serem imutáveis e terem hash estável.

---

## Memory Management no CPython

CPython gerencia memória automaticamente. O programador não chama `free`, mas ainda precisa entender custo e vida útil dos objetos.

Principais mecanismos:

- alocação de objetos no heap;
- contador de referências;
- garbage collector para ciclos;
- pools internos para pequenos objetos;
- reutilização de memória pelo interpretador.

Exemplo de referência:

```python
dados = [1, 2, 3]
outro_nome = dados
```

Enquanto existe pelo menos uma referência viva ao objeto, ele não pode ser liberado.

---

## Contagem de Referências

No CPython, cada objeto mantém uma contagem de referências. Quando a contagem chega a zero, o objeto pode ser destruído.

```python
def criar_lista():
    dados = [1, 2, 3]
    return dados

resultado = criar_lista()
```

A lista criada dentro da função continua viva porque foi retornada e agora está referenciada por `resultado`.

Você raramente precisa consultar contagem de referências. O importante é entender que manter referências em caches, globais ou estruturas longas impede liberação.

---

## Garbage Collection

Contagem de referências não resolve ciclos sozinha:

```python
a = []
b = [a]
a.append(b)
```

`a` e `b` referenciam um ao outro. O garbage collector detecta ciclos desse tipo.

Módulo `gc`:

```python
import gc

coletados = gc.collect()
print(coletados)
```

Uso profissional:

- investigar vazamento de memória;
- entender objetos não coletados;
- depurar ciclos com `__del__`;
- medir impacto de muitos objetos temporários.

Em código comum, não chame `gc.collect()` como rotina. Prefira remover referências desnecessárias e corrigir estruturas que retêm objetos.

---

## Vazamentos de Memória em Python

Mesmo com GC, aplicações podem crescer memória por:

- caches sem limite;
- listas globais acumulando dados;
- callbacks mantendo referências;
- closures segurando objetos grandes;
- ciclos com finalizadores problemáticos;
- filas não drenadas;
- logs ou buffers em memória;
- objetos presos em variáveis de longa duração.

Exemplo de cache perigoso:

```python
cache = {}

def buscar(chave: str) -> bytes:
    if chave not in cache:
        cache[chave] = carregar_bytes(chave)
    return cache[chave]
```

Melhor limitar:

```python
from functools import lru_cache


@lru_cache(maxsize=1024)
def buscar(chave: str) -> bytes:
    return carregar_bytes(chave)
```

---

## Medindo Memória

`tracemalloc` ajuda a identificar alocações:

```python
import tracemalloc

tracemalloc.start()

dados = [str(i) for i in range(100_000)]

atual, pico = tracemalloc.get_traced_memory()
print(f"atual={atual}, pico={pico}")

tracemalloc.stop()
```

Use junto de testes representativos. Medir memória de exemplo pequeno raramente revela o comportamento real.

---

## GIL: Global Interpreter Lock

O GIL é um lock global do CPython que permite apenas uma thread executando bytecode Python por vez dentro de um processo.

Consequência prática:

- threads ajudam muito em I/O;
- threads não costumam acelerar CPU-bound puro em Python;
- multiprocessing pode paralelizar CPU usando processos separados;
- bibliotecas em C podem liberar o GIL em operações pesadas.

Exemplo CPU-bound:

```python
def contar(n: int) -> int:
    total = 0
    for i in range(n):
        total += i * i
    return total
```

Rodar essa função em várias threads pode não acelerar no CPython, porque o gargalo é CPU executando bytecode Python.

Exemplo I/O-bound:

```python
import time

def baixar_simulado() -> str:
    time.sleep(1)
    return "ok"
```

Threads podem ajudar quando o tempo é gasto esperando rede, disco, banco ou APIs.

---

## Threads, Processos e Async no Contexto do GIL

| Cenário | Ferramenta comum |
|---|---|
| muitas chamadas de rede | `asyncio`, `threading`, `concurrent.futures.ThreadPoolExecutor` |
| muitas leituras de arquivo pequenas | threads ou async, dependendo da lib |
| CPU pesada em Python puro | `multiprocessing`, `ProcessPoolExecutor` |
| CPU pesada em NumPy/Pandas | bibliotecas nativas podem liberar GIL |
| tarefas independentes em background | threads, processos, filas ou workers |

Regra prática:

- se espera I/O, concorrência ajuda;
- se calcula CPU em Python puro, processos tendem a ser melhores;
- se precisa de alta escala de conexões, `asyncio` pode ser mais eficiente.

---

## Finalizadores e Context Managers

Não dependa de `__del__` para liberar recursos críticos. Prefira context managers:

```python
with open("dados.txt", encoding="utf-8") as arquivo:
    conteudo = arquivo.read()
```

Para recursos próprios:

```python
class Recurso:
    def __enter__(self):
        print("abrindo")
        return self

    def __exit__(self, exc_type, exc, tb):
        print("fechando")
        return False
```

Context managers deixam o ciclo de vida explícito e previsível.

---

## Boas Práticas

- Entenda diferença entre nome, referência e objeto.
- Use `is None`, não `== None`.
- Evite estado global mutável.
- Limite caches.
- Prefira context managers para arquivos, locks, conexões e recursos externos.
- Use `tracemalloc` para investigar memória.
- Use threads para I/O, processos para CPU-bound.
- Não tente "desligar o GIL"; escolha arquitetura adequada.
- Não chame GC manualmente sem evidência.

---

## Checklist de Proficiência

- Sei explicar que variáveis são referências para objetos.
- Sei diferenciar objeto mutável e imutável.
- Sei quando usar cópia rasa ou profunda.
- Sei explicar o papel do contador de referências.
- Sei explicar por que ciclos exigem garbage collection.
- Sei identificar padrões comuns de vazamento de memória.
- Sei usar `tracemalloc` em investigação inicial.
- Sei explicar o impacto do GIL em threads CPU-bound.
- Sei escolher entre threads, processos e async em alto nível.
- Sei preferir context managers para liberar recursos.

---

## Exercícios

1. Crie duas variáveis apontando para a mesma lista e observe a mutação.
2. Compare `==` e `is` com listas e com `None`.
3. Crie uma cópia rasa e uma cópia profunda de uma estrutura aninhada.
4. Use `tracemalloc` para medir uma lista grande.
5. Crie um cache sem limite e depois refatore para `lru_cache(maxsize=...)`.
6. Explique por que threads não aceleram bem um loop CPU-bound puro no CPython.
7. Escreva um context manager simples com `__enter__` e `__exit__`.
