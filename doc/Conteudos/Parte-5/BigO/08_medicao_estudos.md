# Profiling, Benchmark, Estudos de Caso e Exercícios

Big O orienta análise, mas medição confirma comportamento real. Em Python, constantes, alocação, interpretador, bibliotecas em C, cache, I/O e dados reais podem mudar decisões.

Benchmark bom mede uma pergunta clara. Benchmark ruim mede ruído.

---

## `timeit`

Use `timeit` para medir pequenos trechos:

```python
import timeit


tempo = timeit.timeit(
    "x in dados",
    setup="dados = list(range(10000)); x = 9999",
    number=10000,
)

print(tempo)
```

Comparando lista e set:

```python
import timeit

lista = timeit.timeit(
    "9999 in dados",
    setup="dados = list(range(10000))",
    number=10000,
)

conjunto = timeit.timeit(
    "9999 in dados",
    setup="dados = set(range(10000))",
    number=10000,
)

print(lista, conjunto)
```

---

## `cProfile`

Use `cProfile` para entender onde o programa gasta tempo:

```bash
python -m cProfile -s cumulative app.py
```

Dentro do código:

```python
import cProfile


cProfile.run("funcao_principal()", sort="cumulative")
```

Observe:

- número de chamadas;
- tempo total;
- tempo por chamada;
- tempo acumulado;
- funções inesperadamente caras.

---

## Medição com Cuidado

Cuidados:

- rode várias vezes;
- aqueça cache quando relevante;
- use dados representativos;
- separe CPU de I/O;
- meça memória quando necessário;
- evite imprimir dentro do benchmark;
- compare versões equivalentes;
- registre ambiente;
- use percentis quando medir latência.

Não tire conclusão grande de uma medição pequena e instável.

---

## Medindo Crescimento

```python
import time


def medir(func, entradas):
    resultados = []
    for entrada in entradas:
        inicio = time.perf_counter()
        func(entrada)
        duracao = time.perf_counter() - inicio
        resultados.append((len(entrada), duracao))
    return resultados
```

Teste tamanhos:

```python
tamanhos = [100, 1_000, 10_000, 100_000]
```

Compare o formato da curva, não apenas um ponto.

---

## Caso 1: Two Sum

Força bruta:

```python
def two_sum_lento(nums: list[int], alvo: int) -> bool:
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == alvo:
                return True
    return False
```

Tempo `O(n²)`, espaço `O(1)`.

Com set:

```python
def two_sum(nums: list[int], alvo: int) -> bool:
    vistos = set()
    for num in nums:
        if alvo - num in vistos:
            return True
        vistos.add(num)
    return False
```

Tempo médio `O(n)`, espaço `O(n)`.

---

## Caso 2: Anagramas

Ordenando:

```python
def anagrama_sort(a: str, b: str) -> bool:
    return sorted(a) == sorted(b)
```

Tempo `O(n log n)`.

Contando:

```python
from collections import Counter


def anagrama_counter(a: str, b: str) -> bool:
    return Counter(a) == Counter(b)
```

Tempo `O(n)` médio.

---

## Caso 3: Janela Deslizante

Maior soma de janela:

```python
def max_soma_lento(nums: list[int], k: int) -> int:
    melhor = float("-inf")
    for i in range(len(nums) - k + 1):
        melhor = max(melhor, sum(nums[i:i + k]))
    return melhor
```

Tempo `O(n * k)`.

Melhor:

```python
def max_soma(nums: list[int], k: int) -> int:
    atual = sum(nums[:k])
    melhor = atual
    for i in range(k, len(nums)):
        atual += nums[i] - nums[i - k]
        melhor = max(melhor, atual)
    return melhor
```

Tempo `O(n)`.

---

## Caso 4: BFS em Matriz

```python
from collections import deque


def bfs_matriz(grid: list[list[int]], inicio: tuple[int, int]) -> int:
    linhas = len(grid)
    colunas = len(grid[0])
    fila = deque([inicio])
    visitados = {inicio}

    while fila:
        r, c = fila.popleft()
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < linhas and 0 <= nc < colunas:
                if grid[nr][nc] == 1 and (nr, nc) not in visitados:
                    visitados.add((nr, nc))
                    fila.append((nr, nc))

    return len(visitados)
```

Complexidade:

```text
O(linhas * colunas)
```

Cada célula é visitada no máximo uma vez.

---

## Caso 5: DP contra Recursão Explosiva

Recursão ingênua:

```python
def caminhos(n: int) -> int:
    if n <= 1:
        return 1
    return caminhos(n - 1) + caminhos(n - 2)
```

Tempo exponencial.

DP:

```python
def caminhos(n: int) -> int:
    if n <= 1:
        return 1

    a, b = 1, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b
```

Tempo `O(n)`, espaço `O(1)`.

---

## Roteiro para Entrevistas

Ao resolver:

1. Explique solução simples.
2. Calcule tempo e espaço.
3. Identifique gargalo.
4. Proponha estrutura melhor.
5. Trate casos de borda.
6. Escreva código claro.
7. Recalcule complexidade.
8. Discuta trade-offs.

Frase útil:

```text
A primeira solução é O(n²). Podemos melhorar para O(n) usando um set, pagando O(n) de memória.
```

---

## Exercícios Progressivos

### Básico

- encontrar maior elemento;
- contar frequência;
- remover duplicatas;
- inverter string;
- verificar palíndromo.

### Intermediário

- two sum;
- anagramas;
- merge de listas ordenadas;
- busca binária;
- sliding window;
- top K.

### Avançado

- BFS/DFS em grafo;
- menor caminho;
- programação dinâmica;
- backtracking com poda;
- análise de recorrência;
- otimização de query N+1.

---

## Meta de Estudo

Para cada problema, escreva:

```text
Entrada:
Algoritmo:
Tempo:
Espaco:
Gargalo:
Otimização possível:
Trade-off:
```

Esse hábito desenvolve raciocínio técnico mais rápido que decorar respostas.

---

## Checklist

- Você mede antes de otimizar?
- Usa dados representativos?
- Distingue CPU, rede, disco e banco?
- Sabe usar `timeit`?
- Sabe usar `cProfile`?
- Mede crescimento com tamanhos diferentes?
- Explica trade-off tempo vs espaço?
- Consegue defender complexidade em entrevista?

Medição fecha o ciclo entre teoria e prática. Big O mostra o que esperar; profiling mostra onde agir.

