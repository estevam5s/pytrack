# Busca, Ordenação, Grafos, Strings, DP e Backtracking

Algoritmos clássicos aparecem em entrevistas, bibliotecas, bancos de dados, sistemas distribuídos e problemas reais de engenharia. O objetivo não é decorar nomes, mas reconhecer padrões de custo.

---

## Busca Linear

```python
def busca_linear(nums: list[int], alvo: int) -> int:
    for i, num in enumerate(nums):
        if num == alvo:
            return i
    return -1
```

Complexidade:

- melhor caso: `O(1)`;
- pior caso: `O(n)`;
- espaço: `O(1)`.

Use quando a coleção não está ordenada ou quando `n` é pequeno.

---

## Busca Binária

Requer entrada ordenada:

```python
def busca_binaria(nums: list[int], alvo: int) -> int:
    inicio = 0
    fim = len(nums) - 1

    while inicio <= fim:
        meio = (inicio + fim) // 2
        if nums[meio] == alvo:
            return meio
        if nums[meio] < alvo:
            inicio = meio + 1
        else:
            fim = meio - 1

    return -1
```

Complexidade:

- tempo: `O(log n)`;
- espaço: `O(1)`.

Se você precisa ordenar antes:

```text
ordenar O(n log n) + buscar O(log n)
```

Só compensa quando há muitas buscas ou a lista já vem ordenada.

---

## Ordenação

Complexidades comuns:

| Algoritmo | Melhor | Médio | Pior | Espaço |
|---|---:|---:|---:|---:|
| Insertion sort | `O(n)` | `O(n²)` | `O(n²)` | `O(1)` |
| Merge sort | `O(n log n)` | `O(n log n)` | `O(n log n)` | `O(n)` |
| Heap sort | `O(n log n)` | `O(n log n)` | `O(n log n)` | `O(1)` |
| Quick sort | `O(n log n)` | `O(n log n)` | `O(n²)` | `O(log n)` |
| Timsort | `O(n)` | `O(n log n)` | `O(n log n)` | variável |

Python usa Timsort em `sort()` e `sorted()`.

---

## Insertion Sort

```python
def insertion_sort(nums: list[int]) -> None:
    for i in range(1, len(nums)):
        atual = nums[i]
        j = i - 1

        while j >= 0 and nums[j] > atual:
            nums[j + 1] = nums[j]
            j -= 1

        nums[j + 1] = atual
```

Bom para listas pequenas ou quase ordenadas.

---

## Merge Sort

```python
def merge(esq: list[int], dir: list[int]) -> list[int]:
    i = j = 0
    resultado = []

    while i < len(esq) and j < len(dir):
        if esq[i] <= dir[j]:
            resultado.append(esq[i])
            i += 1
        else:
            resultado.append(dir[j])
            j += 1

    resultado.extend(esq[i:])
    resultado.extend(dir[j:])
    return resultado
```

Recorrência:

```text
T(n) = 2T(n/2) + O(n)
```

Resultado:

```text
O(n log n)
```

---

## Grafos

Representações:

Lista de adjacência:

```python
grafo = {
    "A": ["B", "C"],
    "B": ["D"],
    "C": [],
    "D": [],
}
```

Matriz de adjacência:

```text
O(V²) de espaço
```

Lista de adjacência costuma ser melhor para grafos esparsos.

---

## BFS

```python
from collections import deque


def bfs(grafo: dict[str, list[str]], inicio: str) -> list[str]:
    visitados = set([inicio])
    fila = deque([inicio])
    ordem = []

    while fila:
        atual = fila.popleft()
        ordem.append(atual)

        for vizinho in grafo[atual]:
            if vizinho not in visitados:
                visitados.add(vizinho)
                fila.append(vizinho)

    return ordem
```

Complexidade:

```text
O(V + E)
```

onde `V` é número de vértices e `E` número de arestas.

---

## DFS

```python
def dfs(grafo: dict[str, list[str]], inicio: str) -> list[str]:
    visitados = set()
    ordem = []

    def visitar(no: str) -> None:
        if no in visitados:
            return
        visitados.add(no)
        ordem.append(no)
        for vizinho in grafo[no]:
            visitar(vizinho)

    visitar(inicio)
    return ordem
```

Complexidade:

```text
O(V + E)
```

Espaço: `O(V)` para visitados e pilha.

---

## Dijkstra

Menor caminho com pesos não negativos.

Com heap:

```text
O((V + E) log V)
```

Em grafos esparsos, é eficiente. Não funciona com pesos negativos.

---

## A*

A* é uma busca de menor caminho guiada por heurística. Ele usa uma fila de prioridade como Dijkstra, mas prioriza o nó com menor estimativa total:

```text
f(n) = g(n) + h(n)
```

Onde `g(n)` é o custo real até o nó e `h(n)` é a heurística estimada até o destino.

Com heap, o pior caso continua próximo de Dijkstra:

```text
O((V + E) log V)
```

Na prática, uma boa heurística reduz a quantidade de nós explorados. Para preservar caminho ótimo, a heurística deve ser admissível, ou seja, não pode superestimar o custo real restante.

---

## Bellman-Ford

Permite pesos negativos e detecta ciclo negativo.

```text
O(V * E)
```

Mais caro que Dijkstra, mas necessário quando pesos negativos existem.

---

## Floyd-Warshall

Menor caminho entre todos os pares.

```text
O(V³) tempo
O(V²) espaço
```

Útil para grafos menores e densos.

---

## Kruskal

Árvore geradora mínima.

Com Union-Find:

```text
O(E log E)
```

O custo dominante costuma ser ordenar arestas.

---

## Greedy

Algoritmos greedy fazem a melhor escolha local em cada passo. Eles são rápidos e simples quando o problema tem propriedade gulosa, mas podem falhar quando uma escolha local impede o ótimo global.

Exemplo clássico: selecionar o máximo de intervalos compatíveis ordenando pelo menor horário de término.

```python
def selecionar_intervalos(intervalos: list[tuple[int, int]]) -> list[tuple[int, int]]:
    ordenados = sorted(intervalos, key=lambda intervalo: intervalo[1])
    escolhidos = []
    fim_atual = float("-inf")

    for inicio, fim in ordenados:
        if inicio >= fim_atual:
            escolhidos.append((inicio, fim))
            fim_atual = fim

    return escolhidos
```

Complexidade `O(n log n)` por causa da ordenação.

Greedy aparece em Kruskal, Prim, Huffman e interval scheduling. Quando a escolha local não é comprovadamente segura, programação dinâmica ou backtracking podem ser necessários.

---

## Strings: Busca Ingênua

```python
def contem(texto: str, padrao: str) -> bool:
    n = len(texto)
    m = len(padrao)

    for i in range(n - m + 1):
        if texto[i:i + m] == padrao:
            return True
    return False
```

Pior caso:

```text
O(n * m)
```

Além disso, `texto[i:i+m]` cria cópia em Python.

---

## KMP

Knuth-Morris-Pratt evita retroceder no texto usando tabela de prefixos.

Complexidade:

```text
O(n + m)
```

É útil quando busca de padrão é central e repetida.

---

## Rabin-Karp

Usa hash rolante.

Complexidade esperada:

```text
O(n + m)
```

Pior caso pode degradar por colisões. É útil para múltiplos padrões e comparação com hashing.

---

## Trie, Aho-Corasick e Sliding Window

Além de KMP e Rabin-Karp, algoritmos de strings frequentemente usam estruturas auxiliares:

| Técnica | Uso | Complexidade típica |
|---|---|---:|
| Trie | prefixos e autocomplete | `O(m)` por palavra/prefixo |
| Aho-Corasick | múltiplos padrões | `O(n + matches + tamanho_dicionario)` |
| Sliding window | substrings com restrições | `O(n)` |
| DP | distância de edição, LCS | `O(n*m)` |

Exemplo de sliding window:

```python
def maior_sem_repeticao(texto: str) -> int:
    vistos = {}
    inicio = 0
    melhor = 0

    for fim, char in enumerate(texto):
        if char in vistos and vistos[char] >= inicio:
            inicio = vistos[char] + 1
        vistos[char] = fim
        melhor = max(melhor, fim - inicio + 1)

    return melhor
```

Tempo `O(n)`, espaço `O(k)`.

---

## Programação Dinâmica

Programação dinâmica resolve problemas com:

- subproblemas sobrepostos;
- subestrutura ótima.

Fibonacci iterativo:

```python
def fib(n: int) -> int:
    if n <= 1:
        return n

    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b
```

Tempo `O(n)`, espaço `O(1)`.

---

## Mochila 0/1

Complexidade clássica:

```text
O(n * capacidade)
```

Isso é pseudo-polinomial, porque depende do valor numérico da capacidade, não apenas do tamanho em bits da entrada.

---

## Backtracking

Backtracking explora possibilidades e desfaz escolhas.

Permutações:

```text
O(n * n!)
```

Subconjuntos:

```text
O(n * 2^n)
```

Combinações podem variar, mas frequentemente têm crescimento combinatório.

Backtracking pode ser inevitável quando a saída já é enorme.

---

## Checklist

- Busca binária só é usada em dados ordenados?
- Ordenar antes de buscar compensa?
- Você sabe custo de BFS/DFS em `V + E`?
- Dijkstra só é usado com pesos não negativos?
- Sabe quando A* é melhor que Dijkstra na prática?
- Consegue justificar uma escolha greedy?
- Reconhece explosão de backtracking?
- Sabe quando DP reduz recursão exponencial?
- Considera custo de copiar strings/listas?
- Conhece limites de algoritmos `O(n²)` e `O(2^n)`?

Algoritmos clássicos são padrões de pensamento. Saber suas complexidades permite escolher soluções com segurança antes de escrever código.
