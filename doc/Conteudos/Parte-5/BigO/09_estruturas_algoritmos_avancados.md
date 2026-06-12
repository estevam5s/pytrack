# Estruturas e Algoritmos Avançados: Cobertura Profissional

Este módulo complementa a trilha de Big O com uma visão integrada das principais estruturas de dados e famílias de algoritmos que aparecem em entrevistas, sistemas reais, bibliotecas e otimização de código Python.

O objetivo não é implementar tudo de memória, mas entender custo, caso de uso, armadilhas e escolha correta.

---

## Coleções Nativas: Listas, Tuplas, Dicionários, Sets, Strings e Bytes

### Listas

`list` é um array dinâmico. Acesso por índice é rápido, mas inserir ou remover no começo desloca elementos.

| Operação | Complexidade média |
|---|---:|
| `lista[i]` | `O(1)` |
| `lista.append(x)` | `O(1)` amortizado |
| `lista.pop()` | `O(1)` |
| `lista.insert(0, x)` | `O(n)` |
| `lista.pop(0)` | `O(n)` |
| `x in lista` | `O(n)` |
| `lista[a:b]` | `O(k)` |
| `sorted(lista)` | `O(n log n)` |

Use listas quando precisa de sequência mutável, acesso por índice e iteração eficiente.

### Tuplas

`tuple` é sequência imutável. Tem custos parecidos com lista para acesso e iteração, mas não sofre mutações.

| Operação | Complexidade |
|---|---:|
| `tupla[i]` | `O(1)` |
| `x in tupla` | `O(n)` |
| `tupla[a:b]` | `O(k)` |
| `len(tupla)` | `O(1)` |
| hash de tupla | `O(n)` na primeira avaliação conceitual |

Tuplas são úteis como chaves de `dict` e elementos de `set` quando seus itens também são hashable:

```python
visitados = set()
posicao = (linha, coluna)
visitados.add(posicao)
```

Isso aparece muito em BFS/DFS de grades, memoização e programação dinâmica.

### Dicionários e Hash Tables

`dict` é uma hash table. Em média, busca, inserção e remoção são `O(1)`.

| Operação | Complexidade média |
|---|---:|
| `d[chave]` | `O(1)` |
| `d[chave] = valor` | `O(1)` |
| `chave in d` | `O(1)` |
| `del d[chave]` | `O(1)` |
| iterar chaves/valores/itens | `O(n)` |

Pior caso teórico pode degradar com muitas colisões, mas Python usa uma implementação robusta. Mesmo assim, a análise profissional deve dizer "médio/esperado" para operações de hash.

### Sets

`set` também usa hash table.

| Operação | Complexidade média |
|---|---:|
| `x in s` | `O(1)` |
| `s.add(x)` | `O(1)` |
| `s.remove(x)` | `O(1)` |
| `a | b` | `O(len(a) + len(b))` |
| `a & b` | `O(min(len(a), len(b)))` em geral |

Sets são a troca clássica de memória por tempo:

```python
def tem_duplicata(nums: list[int]) -> bool:
    vistos = set()
    for num in nums:
        if num in vistos:
            return True
        vistos.add(num)
    return False
```

Tempo médio `O(n)`, espaço `O(n)`.

### Strings

`str` é imutável. Concatenar em loop pode criar várias cópias.

```python
partes = ["a", "b", "c"]
texto = "".join(partes)
```

`join` custa `O(total_de_caracteres)`.

Operações importantes:

| Operação | Complexidade típica |
|---|---:|
| `len(s)` | `O(1)` |
| `s[i]` | `O(1)` |
| `s[a:b]` | `O(k)` |
| `s == t` | até `O(n)` |
| substring | depende do algoritmo interno; analise como até `O(n*m)` em modelo simples |

### Bytes e Bytearray

`bytes` é sequência imutável de inteiros de 0 a 255. `bytearray` é a versão mutável.

| Operação | `bytes` | `bytearray` |
|---|---:|---:|
| acesso por índice | `O(1)` | `O(1)` |
| slice | `O(k)` | `O(k)` |
| concatenação repetida | pode virar `O(n²)` | evite realocações grandes |
| append | não existe | `O(1)` amortizado |

Use `bytes` para dados binários imutáveis, protocolos, hashes e payloads. Use `bytearray` quando precisa construir ou alterar buffer incrementalmente.

```python
buffer = bytearray()
for chunk in chunks:
    buffer.extend(chunk)
payload = bytes(buffer)
```

---

## Pilhas, Filas e Deques

### Pilha

Pilha segue LIFO: último a entrar, primeiro a sair.

```python
pilha = []
pilha.append("abrir")
pilha.append("processar")
pilha.pop()
```

Com `list`, `append` e `pop` no fim são `O(1)` amortizado.

Usos comuns:

- validação de parênteses;
- DFS iterativo;
- desfazer/refazer;
- avaliação de expressões;
- simular recursão.

### Fila

Fila segue FIFO: primeiro a entrar, primeiro a sair.

Use `collections.deque`, não `list.pop(0)`.

```python
from collections import deque

fila = deque()
fila.append("A")
fila.append("B")
fila.popleft()
```

`append` e `popleft` são `O(1)`.

### Deque

`deque` permite operações eficientes nas duas pontas.

| Operação | Complexidade |
|---|---:|
| `append` | `O(1)` |
| `appendleft` | `O(1)` |
| `pop` | `O(1)` |
| `popleft` | `O(1)` |
| acesso no meio | `O(n)` |

É a estrutura padrão para BFS, filas de trabalho e janelas deslizantes.

---

## Árvores

Árvores aparecem em parsing, sistemas de arquivos, índices, heaps, tries, DOM, AST e decisões hierárquicas.

Vocabulário:

- raiz: nó inicial;
- folha: nó sem filhos;
- altura: maior distância da raiz até uma folha;
- profundidade: distância da raiz até o nó;
- fator de ramificação: quantidade média de filhos.

### Árvore Binária

Percursos clássicos:

```python
class No:
    def __init__(self, valor: int, esq: "No | None" = None, dir: "No | None" = None):
        self.valor = valor
        self.esq = esq
        self.dir = dir


def inorder(no: No | None) -> list[int]:
    if no is None:
        return []
    return inorder(no.esq) + [no.valor] + inorder(no.dir)
```

Tempo `O(n)`, espaço `O(h)` na pilha, onde `h` é a altura. Em árvore balanceada, `h = O(log n)`. Em árvore degenerada, `h = O(n)`.

### Árvore de Busca Binária

Em BST balanceada:

| Operação | Complexidade |
|---|---:|
| busca | `O(log n)` |
| inserção | `O(log n)` |
| remoção | `O(log n)` |

Em árvore desbalanceada, pode degradar para `O(n)`.

### Trie

Trie é árvore de prefixos para strings.

| Operação | Complexidade |
|---|---:|
| inserir palavra de tamanho `m` | `O(m)` |
| buscar palavra | `O(m)` |
| prefixo | `O(m)` |

Usos:

- autocomplete;
- dicionários;
- roteamento por prefixo;
- busca por prefixo em strings.

---

## Grafos

Um grafo modela vértices e arestas. Pode ser direcionado, não direcionado, ponderado, não ponderado, cíclico ou acíclico.

Representações:

| Representação | Espaço | Melhor uso |
|---|---:|---|
| lista de adjacência | `O(V + E)` | grafos esparsos |
| matriz de adjacência | `O(V²)` | grafos densos, consulta de aresta `O(1)` |
| lista de arestas | `O(E)` | Kruskal, importação/exportação |

### BFS

BFS explora por camadas e encontra menor caminho em grafo não ponderado.

Tempo `O(V + E)`, espaço `O(V)`.

### DFS

DFS aprofunda antes de voltar.

Tempo `O(V + E)`, espaço `O(V)` por visitados e pilha/stack.

Usos:

- componentes conectados;
- detecção de ciclo;
- ordenação topológica;
- backtracking;
- análise de dependências.

### Ordenação Topológica

Ordena dependências em DAG.

Complexidade `O(V + E)`.

```python
from collections import deque


def topologica(grafo: dict[str, list[str]]) -> list[str]:
    grau = {no: 0 for no in grafo}
    for vizinhos in grafo.values():
        for vizinho in vizinhos:
            grau[vizinho] = grau.get(vizinho, 0) + 1

    fila = deque([no for no, g in grau.items() if g == 0])
    ordem = []

    while fila:
        no = fila.popleft()
        ordem.append(no)
        for vizinho in grafo.get(no, []):
            grau[vizinho] -= 1
            if grau[vizinho] == 0:
                fila.append(vizinho)

    if len(ordem) != len(grau):
        raise ValueError("grafo contem ciclo")
    return ordem
```

---

## Heaps e Filas de Prioridade

Heap mantém acesso rápido ao menor ou maior elemento, dependendo da implementação.

Python oferece `heapq`, um heap mínimo.

```python
import heapq

prioridade = []
heapq.heappush(prioridade, (10, "baixo"))
heapq.heappush(prioridade, (1, "alto"))
heapq.heappop(prioridade)
```

| Operação | Complexidade |
|---|---:|
| `heappush` | `O(log n)` |
| `heappop` | `O(log n)` |
| olhar topo | `O(1)` |
| `heapify` | `O(n)` |

Usos:

- top K;
- merge de listas ordenadas;
- Dijkstra;
- A*;
- agendadores;
- filas de prioridade.

---

## Busca Linear, Busca Binária, BFS, DFS, Dijkstra e A*

### Busca Linear

Percorre item a item.

Tempo `O(n)`, espaço `O(1)`.

### Busca Binária

Divide intervalo ordenado pela metade.

Tempo `O(log n)`, espaço `O(1)` na versão iterativa.

### Dijkstra

Calcula menor caminho em grafo com pesos não negativos.

Com heap:

```text
O((V + E) log V)
```

Use quando o peso das arestas importa e não há pesos negativos.

### A*

A* é uma busca de menor caminho guiada por heurística.

Ideia:

```text
f(n) = g(n) + h(n)
```

Onde:

- `g(n)` é o custo real da origem até `n`;
- `h(n)` é a estimativa de `n` até o destino;
- `f(n)` é a prioridade no heap.

Exemplo simplificado em grid:

```python
import heapq


def manhattan(a: tuple[int, int], b: tuple[int, int]) -> int:
    return abs(a[0] - b[0]) + abs(a[1] - b[1])


def a_estrela(grid: list[list[int]], inicio: tuple[int, int], fim: tuple[int, int]) -> int | None:
    linhas = len(grid)
    colunas = len(grid[0])
    heap = [(manhattan(inicio, fim), 0, inicio)]
    melhor_custo = {inicio: 0}

    while heap:
        _, custo, atual = heapq.heappop(heap)
        if atual == fim:
            return custo

        r, c = atual
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            proximo = (nr, nc)
            dentro = 0 <= nr < linhas and 0 <= nc < colunas
            if not dentro or grid[nr][nc] == 1:
                continue

            novo_custo = custo + 1
            if novo_custo < melhor_custo.get(proximo, float("inf")):
                melhor_custo[proximo] = novo_custo
                prioridade = novo_custo + manhattan(proximo, fim)
                heapq.heappush(heap, (prioridade, novo_custo, proximo))

    return None
```

No pior caso, A* ainda pode visitar muitos nós: `O((V + E) log V)` com heap, parecido com Dijkstra. Na prática, uma boa heurística reduz muito a área explorada.

Heurística admissível nunca superestima o custo real. Essa propriedade preserva otimalidade.

---

## Ordenação

Ordenação organiza dados para busca, agregação, merge, deduplicação e apresentação.

| Algoritmo | Melhor | Médio | Pior | Espaço | Estável |
|---|---:|---:|---:|---:|---|
| Bubble sort | `O(n)` com flag | `O(n²)` | `O(n²)` | `O(1)` | sim |
| Insertion sort | `O(n)` | `O(n²)` | `O(n²)` | `O(1)` | sim |
| Selection sort | `O(n²)` | `O(n²)` | `O(n²)` | `O(1)` | não em geral |
| Merge sort | `O(n log n)` | `O(n log n)` | `O(n log n)` | `O(n)` | sim |
| Quick sort | `O(n log n)` | `O(n log n)` | `O(n²)` | `O(log n)` | não em geral |
| Heap sort | `O(n log n)` | `O(n log n)` | `O(n log n)` | `O(1)` | não |
| Timsort | `O(n)` | `O(n log n)` | `O(n log n)` | variável | sim |

Python usa Timsort, que aproveita trechos já ordenados.

---

## Recursão, Backtracking, Programação Dinâmica e Greedy

### Recursão

Recursão divide problema em chamadas menores. O custo costuma ser descrito por recorrência:

```text
T(n) = aT(n/b) + f(n)
```

Sempre analise:

- caso base;
- redução do problema;
- número de chamadas;
- custo fora das chamadas;
- espaço da pilha;
- cópias ocultas.

### Backtracking

Backtracking explora escolhas e desfaz decisões.

É comum em:

- permutações;
- combinações;
- N-rainhas;
- Sudoku;
- caminhos;
- subset sum.

Pode ser `O(n!)`, `O(2^n)` ou pior, dependendo do espaço de busca. Poda reduz casos práticos, mas geralmente não muda o pior caso.

### Programação Dinâmica

DP transforma recursão repetitiva em tabela ou cache.

Use quando há:

- subproblemas sobrepostos;
- subestrutura ótima.

Formas:

- top-down com memoização;
- bottom-up com tabela;
- otimização de espaço quando só estados recentes importam.

Exemplo clássico:

```python
def fib(n: int) -> int:
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a
```

Tempo `O(n)`, espaço `O(1)`.

### Greedy

Algoritmos gulosos fazem a melhor escolha local esperando obter ótimo global.

Funcionam quando o problema tem propriedade gulosa. Caso contrário, podem falhar.

Exemplo: selecionar atividades compatíveis pelo menor término.

```python
def selecionar_atividades(intervalos: list[tuple[int, int]]) -> list[tuple[int, int]]:
    ordenados = sorted(intervalos, key=lambda item: item[1])
    escolhidos = []
    fim_atual = float("-inf")

    for inicio, fim in ordenados:
        if inicio >= fim_atual:
            escolhidos.append((inicio, fim))
            fim_atual = fim

    return escolhidos
```

Complexidade `O(n log n)` pela ordenação.

Greedy aparece em Huffman, Kruskal, Prim, interval scheduling e algumas otimizações de cache. DP é preferível quando a escolha local não garante ótimo global.

---

## Algoritmos de Grafos

Principais algoritmos e custos:

| Problema | Algoritmo | Complexidade típica |
|---|---|---:|
| percurso em grafo | BFS/DFS | `O(V + E)` |
| menor caminho sem pesos | BFS | `O(V + E)` |
| menor caminho com pesos não negativos | Dijkstra | `O((V + E) log V)` |
| menor caminho com heurística | A* | pior caso `O((V + E) log V)` |
| pesos negativos | Bellman-Ford | `O(VE)` |
| todos os pares | Floyd-Warshall | `O(V³)` |
| árvore geradora mínima | Kruskal | `O(E log E)` |
| árvore geradora mínima | Prim com heap | `O(E log V)` |
| dependências em DAG | ordenação topológica | `O(V + E)` |
| componentes fortemente conectados | Kosaraju/Tarjan | `O(V + E)` |
| conjuntos dinâmicos | Union-Find | quase `O(1)` amortizado |

### Union-Find

Union-Find resolve conectividade dinâmica.

Com compressão de caminho e union by rank/size, o custo amortizado é `O(α(n))`, quase constante na prática.

---

## Algoritmos de Strings

Strings exigem cuidado porque slices e concatenações criam cópias.

| Problema | Técnica | Complexidade |
|---|---|---:|
| busca simples de padrão | ingênua | `O(n*m)` |
| busca eficiente | KMP | `O(n + m)` |
| busca com hash | Rabin-Karp | esperado `O(n + m)` |
| múltiplos padrões | Aho-Corasick | `O(n + total_matches + tamanho_dicionario)` |
| prefixos | Trie | `O(m)` por palavra/prefixo |
| palíndromos | expandir centro | `O(n²)` |
| maior substring sem repetição | sliding window | `O(n)` |
| distância de edição | DP | `O(n*m)` |
| LCS | DP | `O(n*m)` |

### Sliding Window em Strings

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

Tempo `O(n)`, espaço `O(k)`, onde `k` é o alfabeto observado.

---

## Big O, Big Theta e Big Omega

Use as notações corretamente:

- `O(g(n))`: limite superior assintótico;
- `Ω(g(n))`: limite inferior assintótico;
- `Θ(g(n))`: limite justo, quando superior e inferior coincidem.

Exemplo:

```python
def contem(nums: list[int], alvo: int) -> bool:
    for num in nums:
        if num == alvo:
            return True
    return False
```

Melhor caso: `Ω(1)`.

Pior caso: `O(n)`.

Quando precisa olhar todos os itens, como somar uma lista, o custo é `Θ(n)`.

---

## Benchmarking e Profiling

Big O prevê crescimento. Benchmarking e profiling mostram comportamento real.

Ferramentas:

- `timeit`: microbenchmarks;
- `time.perf_counter`: medições controladas;
- `cProfile`: chamadas e tempo acumulado;
- `pstats`: análise de perfil;
- `tracemalloc`: memória;
- `py-spy`, `scalene`, `line_profiler`: profiling mais profundo quando disponíveis.

Checklist de benchmark:

- usar dados representativos;
- variar tamanho da entrada;
- rodar várias vezes;
- separar CPU, I/O, rede e banco;
- evitar `print` dentro da medição;
- aquecer caches quando necessário;
- comparar versões equivalentes;
- registrar Python, sistema operacional e hardware.

Exemplo de crescimento:

```python
from time import perf_counter


def medir(func, entradas):
    resultados = []
    for entrada in entradas:
        inicio = perf_counter()
        func(entrada)
        fim = perf_counter()
        resultados.append((len(entrada), fim - inicio))
    return resultados
```

Uma solução `O(n)` deve crescer aproximadamente de forma linear quando `n` aumenta. Se dobrar `n` quadruplica o tempo, investigue custo quadrático escondido.

---

## Mapa de Escolha Rápida

| Necessidade | Estrutura/algoritmo |
|---|---|
| acesso por índice | `list` ou `tuple` |
| dados imutáveis como chave | `tuple` |
| texto imutável | `str` |
| dados binários imutáveis | `bytes` |
| buffer binário mutável | `bytearray` |
| pertencimento rápido | `set` |
| chave-valor rápido | `dict` |
| fila FIFO | `deque` |
| pilha | `list` ou `deque` |
| prioridade | `heapq` |
| prefixos de strings | trie |
| menor caminho sem peso | BFS |
| menor caminho com pesos positivos | Dijkstra |
| menor caminho com heurística | A* |
| dependências | ordenação topológica |
| subproblemas repetidos | programação dinâmica |
| escolhas combinatórias | backtracking |
| escolha local comprovada | greedy |

---

## Checklist de Domínio

- Você sabe quando `list` vira gargalo por deslocamento ou slicing?
- Consegue explicar diferença prática entre `list`, `tuple`, `str`, `bytes` e `bytearray`?
- Sabe por que `dict` e `set` são `O(1)` médio, não garantia absoluta?
- Escolhe `deque` para fila e BFS?
- Usa `heapq` para prioridade, Dijkstra e A*?
- Diferencia árvore, grafo, heap e hash table?
- Calcula `O(V + E)` em BFS/DFS?
- Sabe quando Dijkstra não se aplica?
- Entende que A* depende da qualidade e admissibilidade da heurística?
- Distingue recursão, backtracking, DP e greedy?
- Conhece custos essenciais de KMP, Rabin-Karp, trie e sliding window?
- Usa Big O para raciocinar e profiling para confirmar?

Dominar estruturas e algoritmos não é decorar tabelas. É saber transformar o formato do problema em uma escolha técnica defensável de tempo, espaço e manutenção.
