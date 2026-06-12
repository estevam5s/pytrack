# Big O em Profundidade: do Básico ao Avançado

Guia abrangente e progressivo sobre análise assintótica, Big O e desempenho de algoritmos, com foco em Python, entrevistas técnicas e engenharia de software real.

---

## Sumário

1. [Visão geral](#visão-geral)
2. [O que é Big O](#o-que-é-big-o)
3. [Notações assintóticas: O, Ω, Θ, o, ω](#notações-assintóticas-o-ω-θ-o-ω)
4. [Como pensar em crescimento](#como-pensar-em-crescimento)
5. [Classes de complexidade (mais comuns e menos comuns)](#classes-de-complexidade-mais-comuns-e-menos-comuns)
6. [Regras para calcular Big O](#regras-para-calcular-big-o)
7. [Padrões de loops e suas complexidades](#padrões-de-loops-e-suas-complexidades)
8. [Complexidade de tempo em Python: operações da linguagem](#complexidade-de-tempo-em-python-operações-da-linguagem)
9. [Complexidade de espaço](#complexidade-de-espaço)
10. [Recursão, árvore de recursão e recorrências](#recursão-árvore-de-recursão-e-recorrências)
11. [Master Theorem (Teorema Mestre)](#master-theorem-teorema-mestre)
12. [Análise amortizada](#análise-amortizada)
13. [Melhor, médio, pior caso e caso esperado](#melhor-médio-pior-caso-e-caso-esperado)
14. [Busca e ordenação](#busca-e-ordenação)
15. [Grafos: complexidades essenciais](#grafos-complexidades-essenciais)
16. [Strings e hashing](#strings-e-hashing)
17. [Programação dinâmica e backtracking](#programação-dinâmica-e-backtracking)
18. [Dois parâmetros de entrada (n e m)](#dois-parâmetros-de-entrada-n-e-m)
19. [Armadilhas frequentes](#armadilhas-frequentes)
20. [Como otimizar algoritmos na prática](#como-otimizar-algoritmos-na-prática)
21. [Big O em sistemas reais](#big-o-em-sistemas-reais)
22. [Roteiro para entrevistas](#roteiro-para-entrevistas)
23. [Provas e rigor matemático](#provas-e-rigor-matemático)
24. [Custo real em Python](#custo-real-em-python)
25. [Estruturas de dados: guia de escolha](#estruturas-de-dados-guia-de-escolha)
26. [Limites inferiores e impossibilidade](#limites-inferiores-e-impossibilidade)
27. [Classes de complexidade: P, NP e NP-completo](#classes-de-complexidade-p-np-e-np-completo)
28. [Algoritmos pseudo-polinomiais e aproximação](#algoritmos-pseudo-polinomiais-e-aproximação)
29. [Cache, I/O e custo de sistemas](#cache-io-e-custo-de-sistemas)
30. [Profiling, benchmark e medição](#profiling-benchmark-e-medição)
31. [Estudos de caso em Python](#estudos-de-caso-em-python)
32. [Exercícios progressivos com sugestões](#exercícios-progressivos-com-sugestões)
33. [Resumo final](#resumo-final)

---

## Visão geral

Big O descreve **como o custo cresce** quando a entrada aumenta.

- Não é tempo de relógio absoluto.
- É uma forma de comparar algoritmos de forma independente de máquina.
- Serve para tempo e também para memória.

Objetivo prático:

- escolher estruturas corretas;
- prever gargalos;
- escalar soluções com segurança.

---

## O que é Big O

Se `T(n)` representa o tempo de execução para entrada de tamanho `n`, dizer que:

`T(n) = O(g(n))`

significa que, para `n` suficientemente grande, `T(n)` cresce no máximo proporcional a `g(n)` (até uma constante multiplicativa).

### Definição formal (intuição matemática)

`T(n) = O(g(n))` se existem constantes `c > 0` e `n0` tais que:

`T(n) <= c * g(n)` para todo `n >= n0`.

Isso explica por que ignoramos detalhes pequenos quando `n` é grande:

- `7n + 20` -> `O(n)`
- `3n² + 5n + 100` -> `O(n²)`

---

## Notações assintóticas: O, Ω, Θ, o, ω

### 1. Big O (limite superior assintótico)

`f(n) = O(g(n))`

`f` não cresce mais rápido que `g`.

### 2. Big Ω (limite inferior assintótico)

`f(n) = Ω(g(n))`

`f` cresce pelo menos como `g`.

### 3. Big Θ (limite apertado)

`f(n) = Θ(g(n))`

`f` cresce exatamente na mesma ordem de `g` (superior e inferior).

### 4. little-o (limite superior estrito)

`f(n) = o(g(n))` significa que `f` cresce estritamente mais devagar.

Exemplo: `n = o(n log n)`.

### 5. little-ω (limite inferior estrito)

`f(n) = ω(g(n))` significa que `f` cresce estritamente mais rápido.

Exemplo: `n log n = ω(n)`.

Na prática de entrevistas:

- `O` é o mais cobrado.
- `Θ` demonstra análise mais precisa.
- `o` e `ω` agregam maturidade matemática.

---

## Como pensar em crescimento

Para comparar crescimento, pense em `n` muito grande.

Ordem de crescimento (do menor para o maior):

`O(1) < O(log log n) < O(log n) < O(sqrt(n)) < O(n) < O(n log n) < O(n²) < O(n³) < O(2^n) < O(n!)`

Mesmo pequenas diferenças importam em escala.

Exemplo:

- `n = 1_000_000`
- `n log2 n` ~ 20 milhões
- `n²` = 1 trilhão

Diferença gigantesca na prática.

---

## Classes de complexidade (mais comuns e menos comuns)

| Complexidade | Nome | Exemplo típico |
|---|---|---|
| `O(1)` | Constante | Acesso `arr[i]` |
| `O(log n)` | Logarítmica | Busca binária |
| `O(sqrt(n))` | Sublinear | Teste de primalidade por tentativa até raiz |
| `O(n)` | Linear | Percorrer array |
| `O(n log n)` | Linearítmica | Mergesort/Heapsort |
| `O(n²)` | Quadrática | Comparar todos os pares |
| `O(n³)` | Cúbica | Floyd-Warshall |
| `O(2^n)` | Exponencial | Subconjuntos por força bruta |
| `O(n!)` | Fatorial | Permutações completas |

Outras classes úteis:

- `O(k^n)` com `k > 1`: explosão combinatória.
- `O(log^2 n)` em algumas estruturas avançadas.
- `O(alpha(n))` (quase constante) em Union-Find com otimizações.

---

## Regras para calcular Big O

1. **Sequência soma, dominante fica**
   - `O(n) + O(n²)` -> `O(n²)`.
2. **Loops aninhados multiplicam**
   - loop em `n` dentro de loop em `n` -> `O(n²)`.
3. **Condição usa pior ramo (a menos que especifique caso médio)**
4. **Recursão vira recorrência**
5. **Constantes e termos menores são ignorados**

Exemplo:

```python
def exemplo(arr):
    # O(n)
    for _ in arr:
        pass

    # O(n^2)
    for i in range(len(arr)):
        for j in range(len(arr)):
            pass
```

Resultado: `O(n + n²) = O(n²)`.

---

## Padrões de loops e suas complexidades

### Loop linear

```python
for i in range(n):
    ...
```

Complexidade: `O(n)`.

### Loop com passo constante diferente de 1

```python
for i in range(0, n, 5):
    ...
```

Ainda `O(n)`.

### Loop logarítmico (multiplicando/dividindo índice)

```python
i = 1
while i < n:
    i *= 2
```

Complexidade: `O(log n)`.

### Loop triangular

```python
for i in range(n):
    for j in range(i, n):
        ...
```

Complexidade: `O(n²)` (soma `n + (n-1) + ... + 1`).

### Loop com dois tamanhos de entrada

```python
for i in range(n):
    ...
for j in range(m):
    ...
```

Complexidade: `O(n + m)`.

---

## Complexidade de tempo em Python: operações da linguagem

> Observação: custos médios para CPython.

### `list`

| Operação | Complexidade |
|---|---|
| `lst[i]` | `O(1)` |
| `lst.append(x)` | `O(1)` amortizado |
| `lst.pop()` (fim) | `O(1)` |
| `lst.insert(0, x)` | `O(n)` |
| `lst.pop(0)` | `O(n)` |
| `x in lst` | `O(n)` |
| `lst.sort()` | `O(n log n)` |

### `dict` (hash table)

| Operação | Médio | Pior caso teórico |
|---|---:|---:|
| buscar chave | `O(1)` | `O(n)` |
| inserir chave | `O(1)` | `O(n)` |
| remover chave | `O(1)` | `O(n)` |

### `set`

Mesma lógica de hash table (`O(1)` médio para busca/inserção/remoção).

### `collections.deque`

| Operação | Complexidade |
|---|---|
| `append`, `appendleft` | `O(1)` |
| `pop`, `popleft` | `O(1)` |
| acesso por índice no meio | `O(n)` |

### `heapq` (heap mínimo)

| Operação | Complexidade |
|---|---|
| `heap[0]` (topo) | `O(1)` |
| `heappush` | `O(log n)` |
| `heappop` | `O(log n)` |

### `str`

| Operação | Complexidade |
|---|---|
| `len(s)` | `O(1)` |
| `s[i]` | `O(1)` |
| concatenação repetida com `+` em loop | pode virar `O(n²)` |
| `"".join(lista_strings)` | `O(total_de_caracteres)` |
| `x in s` (substring) | depende do algoritmo interno; no pior caso simplificado, `O(n*m)` |

---

## Complexidade de espaço

Complexidade de espaço mede memória **extra** além da entrada.

### Exemplos rápidos

```python
def soma(arr):
    total = 0
    for x in arr:
        total += x
    return total
```

- Tempo: `O(n)`
- Espaço extra: `O(1)`

```python
def copia(arr):
    return [x for x in arr]
```

- Tempo: `O(n)`
- Espaço extra: `O(n)`

```python
def rec(n):
    if n == 0:
        return
    rec(n - 1)
```

- Tempo: `O(n)`
- Espaço de pilha: `O(n)`

---

## Recursão, árvore de recursão e recorrências

### Exemplo 1: linear

```python
def f(n):
    if n <= 1:
        return 1
    return f(n - 1) + 1
```

`T(n) = T(n-1) + O(1)` -> `O(n)`.

### Exemplo 2: divisão e conquista

```python
def busca_binaria(arr, alvo, l, r):
    if l > r:
        return -1
    m = (l + r) // 2
    if arr[m] == alvo:
        return m
    if arr[m] < alvo:
        return busca_binaria(arr, alvo, m + 1, r)
    return busca_binaria(arr, alvo, l, m - 1)
```

`T(n) = T(n/2) + O(1)` -> `O(log n)`.

### Exemplo 3: recursão duplicada

```python
def fib_ruim(n):
    if n <= 1:
        return n
    return fib_ruim(n - 1) + fib_ruim(n - 2)
```

Exponencial (`O(2^n)` aproximado).

Versão otimizada (memoization):

```python
from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)
```

- Tempo: `O(n)`
- Espaço: `O(n)`

---

## Master Theorem (Teorema Mestre)

Para:

`T(n) = aT(n/b) + f(n)`

compare `f(n)` com `n^(log_b a)`.

### Caso 1: `f(n)` menor

`T(n) = 8T(n/2) + O(n²)`  
`n^(log2 8) = n³`, então `f(n)=n²` é menor -> `T(n)=Θ(n³)`.

### Caso 2: mesmo tamanho assintótico

`T(n) = 2T(n/2) + O(n)` -> `Θ(n log n)` (Mergesort).

### Caso 3: `f(n)` maior (com condição de regularidade)

`T(n) = 2T(n/2) + O(n²)` -> `Θ(n²)`.

---

## Análise amortizada

Análise amortizada calcula custo médio por operação em uma sequência.

### Exemplo: append em array dinâmico

Em Python, `list.append`:

- maioria das chamadas: `O(1)`
- ocasionalmente: realocação/copiar elementos (`O(n)`)
- custo amortizado: `O(1)`

### Exemplo clássico de entrevista: MinStack

```python
class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []

    def push(self, x):
        self.stack.append(x)
        if not self.min_stack or x <= self.min_stack[-1]:
            self.min_stack.append(x)

    def pop(self):
        x = self.stack.pop()
        if x == self.min_stack[-1]:
            self.min_stack.pop()
        return x

    def top(self):
        return self.stack[-1]

    def get_min(self):
        return self.min_stack[-1]
```

Todas operações em `O(1)` amortizado/real.

---

## Melhor, médio, pior caso e caso esperado

### Busca linear

```python
def busca_linear(arr, x):
    for i, v in enumerate(arr):
        if v == x:
            return i
    return -1
```

- Melhor: `O(1)` (encontra no início)
- Pior: `O(n)` (fim ou ausente)
- Médio: `O(n)`

### Hash table (`dict`/`set`)

- Médio/esperado: `O(1)`
- Pior teórico: `O(n)` (muitas colisões)

Em produção, muitas decisões são guiadas por custo esperado, mas sistemas críticos podem exigir garantia de pior caso.

---

## Busca e ordenação

## Busca

### Busca linear

- Tempo: `O(n)`
- Espaço: `O(1)`

### Busca binária (entrada ordenada)

- Tempo: `O(log n)`
- Espaço iterativa: `O(1)`

## Ordenação

| Algoritmo | Melhor | Médio | Pior | Espaço extra |
|---|---:|---:|---:|---:|
| Bubble Sort | `O(n)` | `O(n²)` | `O(n²)` | `O(1)` |
| Insertion Sort | `O(n)` | `O(n²)` | `O(n²)` | `O(1)` |
| Selection Sort | `O(n²)` | `O(n²)` | `O(n²)` | `O(1)` |
| Merge Sort | `O(n log n)` | `O(n log n)` | `O(n log n)` | `O(n)` |
| Quick Sort | `O(n log n)` | `O(n log n)` | `O(n²)` | `O(log n)` stack médio |
| Heap Sort | `O(n log n)` | `O(n log n)` | `O(n log n)` | `O(1)` |
| Timsort (Python `sort`) | `O(n)` | `O(n log n)` | `O(n log n)` | depende da implementação |

### Exemplo: Insertion Sort

```python
def insertion_sort(arr):
    a = arr[:]  # copia para não alterar entrada
    for i in range(1, len(a)):
        chave = a[i]
        j = i - 1
        while j >= 0 and a[j] > chave:
            a[j + 1] = a[j]
            j -= 1
        a[j + 1] = chave
    return a
```

- Pior/médio: `O(n²)`
- Melhor (quase ordenado): próximo de `O(n)`

### Exemplo: Merge Sort

```python
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    m = len(arr) // 2
    left = merge_sort(arr[:m])
    right = merge_sort(arr[m:])
    return merge(left, right)

def merge(a, b):
    i = j = 0
    out = []
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            out.append(a[i]); i += 1
        else:
            out.append(b[j]); j += 1
    out.extend(a[i:])
    out.extend(b[j:])
    return out
```

- Tempo: `O(n log n)`
- Espaço: `O(n)`

---

## Grafos: complexidades essenciais

Considere:

- `V`: número de vértices
- `E`: número de arestas

### BFS e DFS (lista de adjacência)

- Tempo: `O(V + E)`
- Espaço: `O(V)`

```python
from collections import deque

def bfs(grafo, origem):
    visitado = set([origem])
    fila = deque([origem])
    ordem = []

    while fila:
        u = fila.popleft()
        ordem.append(u)
        for v in grafo.get(u, []):
            if v not in visitado:
                visitado.add(v)
                fila.append(v)
    return ordem
```

### Dijkstra (heap)

- Tempo típico: `O((V + E) log V)`
- Requer pesos não negativos

```python
import heapq

def dijkstra(grafo, origem):
    # grafo[u] = [(v, peso), ...]
    dist = {origem: 0}
    heap = [(0, origem)]

    while heap:
        d, u = heapq.heappop(heap)
        if d > dist.get(u, float("inf")):
            continue
        for v, w in grafo.get(u, []):
            nd = d + w
            if nd < dist.get(v, float("inf")):
                dist[v] = nd
                heapq.heappush(heap, (nd, v))
    return dist
```

### Bellman-Ford

- Tempo: `O(V * E)`
- Suporta peso negativo (sem ciclo negativo acessível)

### Floyd-Warshall

- Tempo: `O(V³)`
- Espaço: `O(V²)`
- Todos os pares de caminhos mínimos

### Kruskal (MST)

- Tempo: `O(E log E)` (ordenar arestas + Union-Find)

---

## Strings e hashing

### Busca ingênua de padrão

Texto tamanho `n`, padrão `m`:

- Pior: `O(n*m)`

```python
def busca_ingenua(texto, padrao):
    n, m = len(texto), len(padrao)
    pos = []
    for i in range(n - m + 1):
        if texto[i:i+m] == padrao:
            pos.append(i)
    return pos
```

### KMP

- Pré-processamento: `O(m)`
- Busca: `O(n)`
- Total: `O(n + m)`

### Rabin-Karp

- Esperado: próximo de `O(n + m)`
- Pior caso: `O(n*m)` (muitas colisões de hash)

---

## Programação dinâmica e backtracking

## Programação dinâmica

### Fibonacci iterativo

```python
def fib_dp(n):
    if n <= 1:
        return n
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b
```

- Tempo: `O(n)`
- Espaço: `O(1)`

### Mochila 0/1 (versão clássica)

`n` itens e capacidade `W`:

- Tempo: `O(n*W)`
- Espaço: `O(n*W)` (ou `O(W)` com otimização)

## Backtracking

### Permutações

```python
def permutar(nums):
    res = []
    usado = [False] * len(nums)
    atual = []

    def bt():
        if len(atual) == len(nums):
            res.append(atual[:])
            return
        for i in range(len(nums)):
            if usado[i]:
                continue
            usado[i] = True
            atual.append(nums[i])
            bt()
            atual.pop()
            usado[i] = False

    bt()
    return res
```

- Tempo: `O(n * n!)` (gerar todas as permutações + custo de copiar)
- Espaço: `O(n)` de stack + saída.

---

## Dois parâmetros de entrada (n e m)

Nem todo problema depende de um único `n`.

Exemplo:

```python
def produto_cartesiano(a, b):
    out = []
    for x in a:          # n
        for y in b:      # m
            out.append((x, y))
    return out
```

Complexidade: `O(n*m)`.

Outro exemplo:

```python
def concatena(a, b):
    return a + b
```

Se `a` tem tamanho `n` e `b` tamanho `m`, custo: `O(n + m)`.

---

## Armadilhas frequentes

1. **Confundir Big O com benchmark local**
   - Um algoritmo pior pode parecer mais rápido em entradas pequenas.
2. **Ignorar custo de operações internas**
   - `x in lista` é `O(n)`, mas `x in set` tende a `O(1)`.
3. **Usar concatenação de string em loop**
   - pode degradar para comportamento quadrático.
4. **Dizer apenas tempo e esquecer espaço**
5. **Não declarar suposições**
   - entrada ordenada? duplicatas? limites?
6. **Analisar apenas pior caso quando a pergunta pede esperado**
7. **Superestimar otimizações prematuras**
   - complexidade primeiro, micro-otimização depois.

---

## Como otimizar algoritmos na prática

### 1. Troque estrutura de dados

```python
# ruim: O(n^2) no pior caso para muitas buscas
def tem_duplicata_lento(arr):
    for i in range(len(arr)):
        for j in range(i + 1, len(arr)):
            if arr[i] == arr[j]:
                return True
    return False

# melhor: O(n) médio
def tem_duplicata(arr):
    vistos = set()
    for x in arr:
        if x in vistos:
            return True
        vistos.add(x)
    return False
```

### 2. Prefix sums para consultas repetidas

```python
def prefix_sum(arr):
    ps = [0]
    for x in arr:
        ps.append(ps[-1] + x)
    return ps

def range_sum(ps, l, r):
    # soma de arr[l:r+1]
    return ps[r + 1] - ps[l]
```

- Pré-processamento: `O(n)`
- Cada consulta: `O(1)`

### 3. Two pointers em arrays ordenados

```python
def two_sum_sorted(arr, alvo):
    i, j = 0, len(arr) - 1
    while i < j:
        s = arr[i] + arr[j]
        if s == alvo:
            return i, j
        if s < alvo:
            i += 1
        else:
            j -= 1
    return None
```

- Tempo: `O(n)` (melhor que força bruta `O(n²)`).

### 4. Sliding window

```python
def max_soma_subarray_k(arr, k):
    if k > len(arr):
        return None
    janela = sum(arr[:k])
    melhor = janela
    for i in range(k, len(arr)):
        janela += arr[i] - arr[i - k]
        melhor = max(melhor, janela)
    return melhor
```

- Tempo: `O(n)`
- Espaço: `O(1)`

---

## Big O em sistemas reais

### Em backend APIs

- endpoint com loop em todos os usuários a cada requisição -> risco `O(n)`.
- N+1 queries em ORM pode transformar uma rota em `O(n)` consultas ao banco.

### Em dados/ETL

- junções mal desenhadas podem virar comportamento quadrático.
- índices e particionamento mudam drasticamente o custo.

### Em front-end e UX

- renderizações com operações `O(n²)` em listas grandes degradam experiência.

### Em infraestrutura

- algoritmo pior implica mais CPU/memória -> custo financeiro maior.

---

## Roteiro para entrevistas

Quando resolver um problema, comunique nesta ordem:

1. Entendimento do problema e restrições.
2. Solução ingênua e sua complexidade.
3. Gargalo principal.
4. Solução otimizada.
5. Complexidade final (tempo e espaço).
6. Trade-offs e possíveis extensões.

Modelo de fala:

> "A solução inicial é `O(n²)` por comparação de pares.  
> Posso usar hash set para reduzir busca para `O(1)` médio e chegar em `O(n)` de tempo com `O(n)` de memória extra."

---

## Provas e rigor matemático

Big O pode ser usado de forma intuitiva no dia a dia, mas uma pessoa proficiente consegue justificar a análise.

### Prova direta de Big O

Considere:

`T(n) = 5n + 12`

Queremos provar que `T(n) = O(n)`.

Pela definição, precisamos encontrar `c > 0` e `n0` tais que:

`5n + 12 <= c * n` para todo `n >= n0`.

Se `n >= 12`, então `12 <= n`.

Logo:

`5n + 12 <= 5n + n = 6n`

Escolhemos:

- `c = 6`
- `n0 = 12`

Portanto, `5n + 12 = O(n)`.

### Prova para polinômios

`T(n) = 3n² + 10n + 50`

Para `n >= 1`:

- `10n <= 10n²`
- `50 <= 50n²`

Então:

`3n² + 10n + 50 <= 3n² + 10n² + 50n² = 63n²`

Logo:

`T(n) = O(n²)`.

### Prova de que uma função não é Big O de outra

`n²` não é `O(n)`.

Se fosse, existiriam `c` e `n0` tais que:

`n² <= c*n`

Dividindo por `n > 0`:

`n <= c`

Mas `n` cresce indefinidamente. Para qualquer constante `c`, existe `n > c`.

Logo, `n²` não é `O(n)`.

### Usando limites

Uma forma prática de comparar `f(n)` e `g(n)`:

```text
lim n->infinito f(n) / g(n)
```

Interpretação:

- resultado `0`: `f` cresce mais devagar que `g`;
- resultado constante positiva: mesma ordem assintótica;
- resultado infinito: `f` cresce mais rápido que `g`.

Exemplos:

- `lim (3n + 2) / n = 3`, então `3n + 2 = Θ(n)`;
- `lim n / n² = 0`, então `n = o(n²)`;
- `lim n² / n = infinito`, então `n²` não é `O(n)`.

---

## Custo real em Python

Big O é linguagem-agnóstico, mas Python tem detalhes importantes.

### Operações aparentemente simples podem ser caras

```python
texto = ""

for palavra in palavras:
    texto += palavra
```

Strings são imutáveis. Cada concatenação cria uma nova string.

Se houver muitas palavras, isso pode virar `O(n²)` em quantidade total de caracteres copiados.

Melhor:

```python
texto = "".join(palavras)
```

Complexidade: `O(total_de_caracteres)`.

### Slicing copia dados

```python
parte = lista[10:1000]
```

Esse slice é `O(k)`, onde `k` é o tamanho do pedaço copiado.

Em recursão, slices podem piorar muito a complexidade.

Exemplo ruim:

```python
def soma(lista):
    if not lista:
        return 0
    return lista[0] + soma(lista[1:])
```

Cada `lista[1:]` copia quase a lista inteira.

Complexidade aproximada: `O(n²)`.

Melhor:

```python
def soma(lista, i=0):
    if i == len(lista):
        return 0
    return lista[i] + soma(lista, i + 1)
```

Complexidade: `O(n)`.

### `in` muda conforme estrutura

```python
valor in lista   # O(n)
valor in set     # O(1) médio
valor in dict    # O(1) médio nas chaves
```

Trocar `list` por `set` é uma das otimizações mais frequentes.

### Ordenação em Python

`list.sort()` e `sorted()` usam Timsort.

Complexidade:

- pior caso: `O(n log n)`;
- médio: `O(n log n)`;
- melhor caso para dados quase ordenados: pode se aproximar de `O(n)`.

Timsort é estável:

```python
pessoas = [
    {"nome": "Ana", "idade": 30},
    {"nome": "Bia", "idade": 20},
]

ordenado = sorted(pessoas, key=lambda pessoa: pessoa["idade"])
```

### Custo de `key`

```python
sorted(items, key=funcao_cara)
```

Python calcula a chave uma vez por item, então o custo fica:

`O(n * custo_da_key + n log n)`

Se a chave consulta banco, API ou disco, o gargalo deixa de ser só a ordenação.

### Recursão tem limite prático

Python não otimiza tail recursion.

```python
def fatorial(n):
    if n <= 1:
        return 1
    return n * fatorial(n - 1)
```

Complexidade de tempo: `O(n)`.

Complexidade de espaço: `O(n)` por causa da pilha de chamadas.

Versão iterativa:

```python
def fatorial(n):
    resultado = 1
    for valor in range(2, n + 1):
        resultado *= valor
    return resultado
```

Tempo: `O(n)`.

Espaço auxiliar: `O(1)`.

---

## Estruturas de dados: guia de escolha

| Necessidade | Estrutura comum | Complexidade típica |
|---|---|---|
| Acesso por índice | `list` | `O(1)` |
| Inserção no fim | `list.append` | `O(1)` amortizado |
| Inserção no início | `deque.appendleft` | `O(1)` |
| Fila | `collections.deque` | `O(1)` nas pontas |
| Pilha | `list` | `O(1)` no fim |
| Busca por chave | `dict` | `O(1)` médio |
| Conjunto sem duplicatas | `set` | `O(1)` médio |
| Menor/maior frequente | `heapq` | `O(log n)` inserção/remoção |
| Dados ordenados com busca | lista ordenada + `bisect` | `O(log n)` busca, `O(n)` inserção |
| Contagem | `collections.Counter` | `O(n)` para construir |
| Agrupamento | `defaultdict(list)` | `O(n)` |

### Exemplo: removendo duplicatas preservando ordem

```python
def remover_duplicatas(valores):
    vistos = set()
    resultado = []

    for valor in valores:
        if valor not in vistos:
            vistos.add(valor)
            resultado.append(valor)

    return resultado
```

Tempo: `O(n)` médio.

Espaço: `O(n)`.

### Exemplo: top K maiores

```python
import heapq

def top_k_maiores(valores, k):
    return heapq.nlargest(k, valores)
```

Complexidade típica: `O(n log k)`.

Melhor do que ordenar tudo quando `k` é pequeno:

```python
sorted(valores, reverse=True)[:k]  # O(n log n)
```

### Exemplo: frequência

```python
from collections import Counter

def palavra_mais_frequente(texto):
    palavras = texto.lower().split()
    contagem = Counter(palavras)
    return contagem.most_common(1)[0]
```

Tempo: `O(n)`, considerando `n` palavras.

Espaço: `O(u)`, onde `u` é o número de palavras únicas.

---

## Limites inferiores e impossibilidade

Big O diz o custo de um algoritmo. Mas também é importante saber quando não existe solução melhor para determinado modelo.

### Ordenação por comparação

Qualquer algoritmo de ordenação baseado apenas em comparações precisa de:

`Ω(n log n)`

comparações no pior caso.

Isso significa que Merge Sort, Heap Sort e Timsort são assintoticamente ótimos nesse modelo.

### Busca em lista não ordenada

Para saber se um valor existe em uma lista não ordenada, no pior caso é necessário olhar todos os elementos.

Limite inferior: `Ω(n)`.

Você pode melhorar buscas repetidas criando um `set`, mas isso muda o problema:

```python
valores_set = set(valores)  # O(n)
```

Depois:

```python
x in valores_set  # O(1) médio
```

### Problemas com explosão combinatória

Alguns problemas têm espaço de soluções gigantesco:

- subconjuntos: `2^n`;
- permutações: `n!`;
- caminhos possíveis em grafos grandes;
- combinações de agendamento, roteamento e alocação.

Nesses casos, a maturidade está em reconhecer quando usar:

- programação dinâmica;
- poda;
- heurísticas;
- algoritmos aproximados;
- formulação matemática;
- restrições mais fortes no domínio.

---

## Classes de complexidade: P, NP e NP-completo

### P

Classe de problemas que podem ser resolvidos em tempo polinomial.

Exemplos:

- busca em grafo;
- caminho mínimo com pesos não negativos;
- ordenação;
- árvore geradora mínima.

### NP

Classe de problemas cuja solução pode ser verificada em tempo polinomial.

Exemplo: dado um conjunto de cidades e uma rota, verificar se a rota tem custo menor que um limite é fácil.

Encontrar a melhor rota pode ser difícil.

### NP-completo

Problemas em NP que são tão difíceis quanto qualquer outro problema em NP.

Exemplos clássicos:

- SAT;
- 3-SAT;
- problema do caixeiro viajante em versão de decisão;
- clique;
- vertex cover;
- subset sum;
- mochila 0/1 em certas formulações.

### NP-difícil

Problemas pelo menos tão difíceis quanto NP-completos, mas que não precisam estar em NP.

Na prática:

- se um problema é NP-completo, não espere um algoritmo polinomial geral conhecido;
- procure restrições do domínio;
- use aproximação, heurística, branch and bound, programação dinâmica ou solver.

---

## Algoritmos pseudo-polinomiais e aproximação

Nem todo `O(n * W)` é realmente polinomial no tamanho da entrada quando `W` é um valor numérico grande.

### Mochila 0/1

Programação dinâmica clássica:

```text
O(n * capacidade)
```

Isso é pseudo-polinomial, porque depende do valor da capacidade, não apenas da quantidade de bits para representá-la.

### Quando aproximação faz sentido

Use algoritmos aproximados quando:

- solução exata é cara demais;
- pequena perda de qualidade é aceitável;
- o sistema precisa responder em tempo limitado;
- há muitas instâncias do problema em produção.

Exemplos:

- recomendação;
- roteamento;
- escalonamento;
- clustering;
- detecção aproximada de duplicatas.

### Heurísticas

Heurística não garante ótimo global, mas pode ser excelente na prática.

Exemplo simples de guloso:

```python
def escolher_por_valor_peso(itens, capacidade):
    itens = sorted(
        itens,
        key=lambda item: item["valor"] / item["peso"],
        reverse=True,
    )

    escolhidos = []
    peso_atual = 0

    for item in itens:
        if peso_atual + item["peso"] <= capacidade:
            escolhidos.append(item)
            peso_atual += item["peso"]

    return escolhidos
```

Complexidade: `O(n log n)` pela ordenação.

Não garante solução ótima para mochila 0/1, mas pode ser útil como baseline.

---

## Cache, I/O e custo de sistemas

Big O não captura tudo.

Dois algoritmos com a mesma complexidade podem ter desempenhos muito diferentes por causa de:

- cache de CPU;
- localidade de memória;
- alocação de objetos;
- chamadas de rede;
- leitura de disco;
- serialização;
- compressão;
- concorrência;
- locks;
- banco de dados;
- latência externa.

### Exemplo: rede domina CPU

```python
def carregar_usuarios(ids, api):
    usuarios = []
    for user_id in ids:
        usuarios.append(api.get(f"/users/{user_id}"))
    return usuarios
```

Big O: `O(n)` chamadas.

Problema real: latência de rede multiplicada por `n`.

Melhor abordagem:

```python
def carregar_usuarios(ids, api):
    return api.post("/users/batch", json={"ids": ids})
```

Ainda é `O(n)` em tamanho de dados, mas reduz drasticamente round-trips.

### Exemplo: banco de dados N+1

```python
pedidos = buscar_pedidos()

for pedido in pedidos:
    pedido["cliente"] = buscar_cliente(pedido["cliente_id"])
```

Big O aparente: `O(n)`.

Custo real: `n + 1` queries.

Melhor:

- join no banco;
- query em lote;
- prefetch;
- cache por chave.

---

## Profiling, benchmark e medição

Big O orienta decisões, mas medição confirma gargalos.

### `timeit`

```python
from timeit import timeit

tempo = timeit(
    "sum(range(1000))",
    number=10_000,
)

print(tempo)
```

Use para microbenchmarks simples.

### `cProfile`

```python
import cProfile

def main():
    total = 0
    for i in range(1_000_000):
        total += i
    return total

cProfile.run("main()")
```

Use para descobrir onde o programa realmente gasta tempo.

### Medição com cuidado

Evite conclusões frágeis:

- aqueça o código;
- rode várias vezes;
- use dados representativos;
- meça memória além de tempo;
- separe CPU, disco, rede e banco;
- compare algoritmos com entradas crescentes;
- registre ambiente e versão do Python.

### Medindo crescimento

```python
from timeit import timeit

def duplicados_lento(valores):
    resultado = []
    for valor in valores:
        if valor not in resultado:
            resultado.append(valor)
    return resultado

def duplicados_rapido(valores):
    vistos = set()
    resultado = []
    for valor in valores:
        if valor not in vistos:
            vistos.add(valor)
            resultado.append(valor)
    return resultado

for n in [100, 1_000, 10_000]:
    dados = list(range(n)) + list(range(n))
    print(
        n,
        timeit(lambda: duplicados_lento(dados), number=10),
        timeit(lambda: duplicados_rapido(dados), number=10),
    )
```

O objetivo não é decorar números, mas observar a curva.

---

## Estudos de caso em Python

### Caso 1: duas somas

Problema: verificar se existem dois números cuja soma é igual ao alvo.

Solução ingênua:

```python
def duas_somas_lento(numeros, alvo):
    for i in range(len(numeros)):
        for j in range(i + 1, len(numeros)):
            if numeros[i] + numeros[j] == alvo:
                return True
    return False
```

Tempo: `O(n²)`.

Espaço: `O(1)`.

Solução com `set`:

```python
def duas_somas(numeros, alvo):
    vistos = set()

    for numero in numeros:
        complemento = alvo - numero
        if complemento in vistos:
            return True
        vistos.add(numero)

    return False
```

Tempo: `O(n)` médio.

Espaço: `O(n)`.

Trade-off: usa memória para reduzir tempo.

### Caso 2: anagramas

Solução com ordenação:

```python
def sao_anagramas(a, b):
    return sorted(a) == sorted(b)
```

Tempo: `O(n log n)`.

Solução com contagem:

```python
from collections import Counter

def sao_anagramas(a, b):
    return Counter(a) == Counter(b)
```

Tempo: `O(n)` médio.

Espaço: `O(k)`, onde `k` é o número de caracteres distintos.

### Caso 3: janela deslizante

Problema: maior soma de `k` elementos consecutivos.

Solução ingênua:

```python
def maior_soma_lenta(valores, k):
    melhor = float("-inf")

    for i in range(len(valores) - k + 1):
        melhor = max(melhor, sum(valores[i:i + k]))

    return melhor
```

Tempo: `O(n * k)`.

Solução com janela:

```python
def maior_soma(valores, k):
    atual = sum(valores[:k])
    melhor = atual

    for i in range(k, len(valores)):
        atual += valores[i]
        atual -= valores[i - k]
        melhor = max(melhor, atual)

    return melhor
```

Tempo: `O(n)`.

Espaço: `O(1)`.

### Caso 4: BFS em matriz

```python
from collections import deque

def existe_caminho(matriz, origem, destino):
    linhas = len(matriz)
    colunas = len(matriz[0])
    fila = deque([origem])
    visitados = {origem}

    while fila:
        linha, coluna = fila.popleft()

        if (linha, coluna) == destino:
            return True

        for dl, dc in [(1, 0), (-1, 0), (0, 1), (0, -1)]:
            nl, nc = linha + dl, coluna + dc

            dentro = 0 <= nl < linhas and 0 <= nc < colunas
            if not dentro:
                continue

            livre = matriz[nl][nc] == 0
            nao_visitado = (nl, nc) not in visitados

            if livre and nao_visitado:
                visitados.add((nl, nc))
                fila.append((nl, nc))

    return False
```

Tempo: `O(linhas * colunas)`.

Espaço: `O(linhas * colunas)`.

### Caso 5: programação dinâmica contra recursão explosiva

```python
def fib_lento(n):
    if n <= 1:
        return n
    return fib_lento(n - 1) + fib_lento(n - 2)
```

Tempo: `O(2^n)`.

Com memoização:

```python
from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)
```

Tempo: `O(n)`.

Espaço: `O(n)`.

---

## Exercícios progressivos com sugestões

### Básico

1. Encontrar máximo em lista (`O(n)`).
2. Verificar duplicatas (`O(n²)` -> `O(n)` com set).
3. Implementar busca binária (`O(log n)`).

### Intermediário

1. Agrupar anagramas.
2. Maior substring sem repetição (sliding window).
3. Top K frequentes (heap ou bucket).

### Avançado

1. Menor caminho em grafo com pesos (Dijkstra).
2. Número de ilhas (BFS/DFS em grade).
3. Edit distance (DP `O(n*m)`).
4. Kth smallest em matriz ordenada.
5. LRU Cache em `O(1)` (dict + lista duplamente ligada).

### Meta de estudo sugerida

- Para cada exercício, escreva:
  - versão ingênua,
  - versão otimizada,
  - análise de tempo/espaço,
  - caso de teste extremo.

---

## Resumo final

- Big O mede **crescimento assintótico**, não segundos absolutos.
- Use `O`, `Ω`, `Θ` para discutir limites com precisão.
- Em Python, escolher a estrutura certa (`list`, `set`, `dict`, `deque`, `heap`) muda completamente o desempenho.
- Recursão exige recorrência; Master Theorem resolve muitos casos de divisão e conquista.
- Tempo e espaço devem ser analisados juntos.
- Escalabilidade real depende de complexidade, entrada, dados e arquitetura.

Se você dominar este conteúdo e praticar os exercícios com análise formal, terá uma base sólida de nível profissional em Big O.
