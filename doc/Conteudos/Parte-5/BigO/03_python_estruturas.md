# Python e Estruturas de Dados: Custos Reais e Escolhas

Big O em Python exige conhecer o custo das estruturas nativas. Muitas operações parecem simples, mas escondem cópias, deslocamentos, hashing, alocação ou chamadas repetidas.

Python é expressivo, mas abstração não elimina custo. Código idiomático e código eficiente podem ser a mesma coisa quando você escolhe a estrutura certa.

---

## Lista

`list` é um array dinâmico.

Operações comuns:

| Operação | Complexidade média |
|---|---|
| `arr[i]` | `O(1)` |
| `arr.append(x)` | `O(1)` amortizado |
| `arr.pop()` | `O(1)` |
| `arr.insert(0, x)` | `O(n)` |
| `arr.pop(0)` | `O(n)` |
| `x in arr` | `O(n)` |
| `arr[a:b]` | `O(k)` |
| `len(arr)` | `O(1)` |
| `arr.sort()` | `O(n log n)` |

Remover do começo é caro porque desloca elementos:

```python
while fila:
    item = fila.pop(0)  # O(n) por operação
```

Para fila, use `deque`.

---

## Tupla

`tuple` é uma sequência imutável. O custo de acesso e iteração é parecido com `list`, mas a imutabilidade permite usar tuplas como chaves de `dict` e elementos de `set` quando todos os itens internos são hashable.

Operações comuns:

| Operação | Complexidade |
|---|---:|
| `tupla[i]` | `O(1)` |
| `x in tupla` | `O(n)` |
| `tupla[a:b]` | `O(k)` |
| `len(tupla)` | `O(1)` |

Tuplas aparecem muito em algoritmos de grade e grafos:

```python
visitados = set()
visitados.add((linha, coluna))
```

Esse padrão permite pertencimento médio `O(1)` para posições já visitadas.

---

## Dicionário

`dict` é uma hash table.

Operações médias:

| Operação | Complexidade média |
|---|---|
| `d[key]` | `O(1)` |
| `d[key] = value` | `O(1)` |
| `key in d` | `O(1)` |
| `del d[key]` | `O(1)` |
| iterar | `O(n)` |

Pior caso teórico pode degradar por colisões, mas na prática dicionários Python são altamente otimizados.

Exemplo de frequência:

```python
def frequencias(palavras: list[str]) -> dict[str, int]:
    contagem = {}
    for palavra in palavras:
        contagem[palavra] = contagem.get(palavra, 0) + 1
    return contagem
```

Tempo `O(n)` médio, espaço `O(k)`, onde `k` é o número de palavras distintas.

---

## Set

`set` também usa hash table.

Operações médias:

| Operação | Complexidade média |
|---|---|
| `x in s` | `O(1)` |
| `s.add(x)` | `O(1)` |
| `s.remove(x)` | `O(1)` |
| união | `O(n + m)` |
| interseção | `O(min(n, m))` em geral |

Remover duplicatas preservando ordem:

```python
def unicos_preservando_ordem(nums: list[int]) -> list[int]:
    vistos = set()
    resultado = []

    for num in nums:
        if num not in vistos:
            vistos.add(num)
            resultado.append(num)

    return resultado
```

Tempo `O(n)` médio, espaço `O(n)`.

---

## deque

`collections.deque` é adequado para filas e pilhas nas duas pontas.

```python
from collections import deque

fila = deque()
fila.append("a")
fila.append("b")
fila.popleft()
```

Operações:

| Operação | Complexidade |
|---|---|
| `append` | `O(1)` |
| `appendleft` | `O(1)` |
| `pop` | `O(1)` |
| `popleft` | `O(1)` |
| acesso por índice no meio | `O(n)` |

Para BFS, `deque` é a escolha padrão.

---

## heapq

`heapq` implementa heap mínimo.

```python
import heapq

heap = []
heapq.heappush(heap, 10)
heapq.heappush(heap, 3)
heapq.heappush(heap, 7)
menor = heapq.heappop(heap)
```

Operações:

| Operação | Complexidade |
|---|---|
| `heappush` | `O(log n)` |
| `heappop` | `O(log n)` |
| `heapify` | `O(n)` |
| acessar menor | `O(1)` |

Top K maiores:

```python
import heapq


def top_k(nums: list[int], k: int) -> list[int]:
    return heapq.nlargest(k, nums)
```

Complexidade típica `O(n log k)`, melhor que ordenar tudo quando `k` é pequeno.

---

## Strings

Strings são imutáveis.

Concatenação repetida pode custar caro:

```python
resultado = ""
for parte in partes:
    resultado += parte
```

Em muitos cenários isso cria novas strings repetidamente.

Prefira:

```python
resultado = "".join(partes)
```

`join` é `O(total_de_caracteres)`.

---

## Bytes e Bytearray

`bytes` representa dados binários imutáveis. `bytearray` é mutável e serve para montar buffers incrementalmente.

| Operação | `bytes` | `bytearray` |
|---|---:|---:|
| acesso por índice | `O(1)` | `O(1)` |
| slice | `O(k)` | `O(k)` |
| concatenação repetida | pode virar `O(n²)` | evite realocações grandes |
| `append`/`extend` | não existe em `bytes` | `O(1)` amortizado / `O(k)` |

Exemplo:

```python
buffer = bytearray()
for chunk in chunks:
    buffer.extend(chunk)
payload = bytes(buffer)
```

Para streams, arquivos e protocolos, analisar `bytes` evita subestimar custo de cópias.

---

## Slicing Copia

```python
sub = nums[10:100]
```

Se o slice tem tamanho `k`, custa `O(k)` em tempo e espaço.

Armadilha:

```python
def rec(nums: list[int]) -> int:
    if not nums:
        return 0
    return nums[0] + rec(nums[1:])
```

Apesar de parecer recursão linear, cada `nums[1:]` copia. Tempo `O(n²)`, espaço também pior do que parece.

Use índice:

```python
def rec(nums: list[int], i: int = 0) -> int:
    if i == len(nums):
        return 0
    return nums[i] + rec(nums, i + 1)
```

---

## `in` Depende da Estrutura

```python
x in lista   # O(n)
x in tupla   # O(n)
x in set     # O(1) medio
x in dict    # O(1) medio nas chaves
x in string  # depende da busca de substring
```

Exemplo ruim:

```python
def intersecao(a: list[int], b: list[int]) -> list[int]:
    resultado = []
    for x in a:
        if x in b:
            resultado.append(x)
    return resultado
```

Complexidade `O(n * m)`.

Melhor:

```python
def intersecao(a: list[int], b: list[int]) -> list[int]:
    b_set = set(b)
    return [x for x in a if x in b_set]
```

Tempo médio `O(n + m)`, espaço `O(m)`.

---

## Ordenação em Python

`list.sort()` e `sorted()` usam Timsort.

Complexidade:

- pior caso: `O(n log n)`;
- melhor caso em dados já ordenados/parcialmente ordenados: pode se aproximar de `O(n)`;
- espaço: depende do caso, mas pode usar memória auxiliar.

```python
ordenados = sorted(nums)
nums.sort()
```

`sorted()` cria nova lista. `sort()` ordena in-place.

---

## Custo de `key`

```python
usuarios.sort(key=lambda u: calcular_score(u))
```

Python calcula a key uma vez por elemento, então:

```text
O(n * custo_key + n log n)
```

Se `calcular_score` consulta banco ou percorre lista grande, a ordenação fica muito mais cara.

Pré-calcule quando necessário.

---

## Guia de Escolha

| Necessidade | Estrutura comum |
|---|---|
| acesso por índice | `list` |
| sequência imutável/hashable | `tuple` |
| fila FIFO | `deque` |
| busca rápida por chave | `dict` |
| pertencimento rápido | `set` |
| top K / prioridade | `heapq` |
| contagem | `dict` / `collections.Counter` |
| texto acumulado | lista + `join` |
| binário imutável | `bytes` |
| buffer binário mutável | `bytearray` |

---

## Exemplo: Anagramas

Ruim:

```python
def sao_anagramas(a: str, b: str) -> bool:
    return sorted(a) == sorted(b)
```

Complexidade `O(n log n)`.

Com contagem:

```python
from collections import Counter


def sao_anagramas(a: str, b: str) -> bool:
    return Counter(a) == Counter(b)
```

Tempo `O(n)`, espaço `O(k)`.

---

## Recursão em Python

Python tem limite de recursão:

```python
import sys

print(sys.getrecursionlimit())
```

Mesmo quando a análise assintótica está correta, recursão profunda pode falhar com `RecursionError`.

Para problemas muito profundos, prefira versão iterativa ou pilha explícita.

---

## Checklist

- Você sabe o custo de `list.pop(0)`?
- Sabe quando escolher `tuple`, `bytes` ou `bytearray`?
- Usa `set` para pertencimento repetido?
- Evita slicing acidental em loops/recursão?
- Escolhe `deque` para filas?
- Entende custo de ordenação e `key`?
- Considera espaço de estruturas auxiliares?
- Mede quando a constante importa?

Python eficiente começa pela estrutura correta. Muitas otimizações avançadas são desnecessárias quando a coleção certa resolve o gargalo.
