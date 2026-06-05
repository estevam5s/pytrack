# Recursão, Árvores e Grafos

Recursão, árvores e grafos são essenciais para entender algoritmos avançados, estruturas hierárquicas, busca, compiladores, sistemas de arquivos, redes, dependências e problemas de caminho.

---

## Sumário

1. [Recursão](#recursão)
2. [Pilha de Chamadas](#pilha-de-chamadas)
3. [Árvores](#árvores)
4. [Árvore Binária](#árvore-binária)
5. [Percursos em Árvores](#percursos-em-árvores)
6. [Árvore de Busca Binária](#árvore-de-busca-binária)
7. [Grafos](#grafos)
8. [BFS e DFS](#bfs-e-dfs)
9. [Caminho Mais Curto](#caminho-mais-curto)
10. [Boas Práticas](#boas-práticas)
11. [Exercícios](#exercícios)

---

## Recursão

Função recursiva chama a si mesma.

Toda recursão precisa de:

- caso base;
- progresso em direção ao caso base.

Fatorial:

```python
def fatorial(n: int) -> int:
    if n < 0:
        raise ValueError("n deve ser >= 0")
    if n in (0, 1):
        return 1
    return n * fatorial(n - 1)
```

Complexidade:

- tempo: `O(n)`;
- espaço: `O(n)` pela pilha de chamadas.

---

## Pilha de Chamadas

Cada chamada recursiva ocupa um frame.

```python
fatorial(4)
4 * fatorial(3)
4 * 3 * fatorial(2)
4 * 3 * 2 * fatorial(1)
```

Python tem limite de recursão.

```python
import sys

print(sys.getrecursionlimit())
```

Para entradas muito grandes, prefira solução iterativa.

```python
def fatorial_iterativo(n: int) -> int:
    resultado = 1
    for valor in range(2, n + 1):
        resultado *= valor
    return resultado
```

---

## Árvores

Árvore é estrutura hierárquica com nós e arestas.

Conceitos:

- raiz;
- filho;
- pai;
- folha;
- altura;
- profundidade;
- subárvore.

Representação simples:

```python
arvore = {
    "valor": "A",
    "filhos": [
        {"valor": "B", "filhos": []},
        {"valor": "C", "filhos": []},
    ],
}
```

Percurso:

```python
def imprimir_arvore(no: dict, nivel: int = 0) -> None:
    print("  " * nivel + no["valor"])
    for filho in no["filhos"]:
        imprimir_arvore(filho, nivel + 1)
```

---

## Árvore Binária

Cada nó tem no máximo dois filhos.

```python
from dataclasses import dataclass

@dataclass
class No:
    valor: int
    esquerda: "No | None" = None
    direita: "No | None" = None
```

Exemplo:

```python
raiz = No(
    10,
    esquerda=No(5),
    direita=No(15),
)
```

---

## Percursos em Árvores

### Pré-ordem

Raiz, esquerda, direita.

```python
def pre_ordem(no: No | None) -> list[int]:
    if no is None:
        return []
    return [no.valor] + pre_ordem(no.esquerda) + pre_ordem(no.direita)
```

### Em ordem

Esquerda, raiz, direita.

```python
def em_ordem(no: No | None) -> list[int]:
    if no is None:
        return []
    return em_ordem(no.esquerda) + [no.valor] + em_ordem(no.direita)
```

### Pós-ordem

Esquerda, direita, raiz.

```python
def pos_ordem(no: No | None) -> list[int]:
    if no is None:
        return []
    return pos_ordem(no.esquerda) + pos_ordem(no.direita) + [no.valor]
```

### Por nível

```python
from collections import deque

def por_nivel(raiz: No | None) -> list[int]:
    if raiz is None:
        return []

    resultado = []
    fila = deque([raiz])

    while fila:
        no = fila.popleft()
        resultado.append(no.valor)

        if no.esquerda:
            fila.append(no.esquerda)
        if no.direita:
            fila.append(no.direita)

    return resultado
```

---

## Árvore de Busca Binária

BST mantém regra:

- esquerda < nó;
- direita > nó.

Busca:

```python
def buscar(no: No | None, valor: int) -> bool:
    if no is None:
        return False
    if valor == no.valor:
        return True
    if valor < no.valor:
        return buscar(no.esquerda, valor)
    return buscar(no.direita, valor)
```

Inserção:

```python
def inserir(no: No | None, valor: int) -> No:
    if no is None:
        return No(valor)
    if valor < no.valor:
        no.esquerda = inserir(no.esquerda, valor)
    elif valor > no.valor:
        no.direita = inserir(no.direita, valor)
    return no
```

Complexidade:

- árvore balanceada: `O(log n)`;
- árvore degenerada: `O(n)`.

---

## Grafos

Grafo possui vértices e arestas.

Tipos:

- direcionado;
- não direcionado;
- ponderado;
- não ponderado;
- cíclico;
- acíclico.

Lista de adjacência:

```python
grafo = {
    "A": ["B", "C"],
    "B": ["D"],
    "C": ["D"],
    "D": [],
}
```

Grafo ponderado:

```python
grafo = {
    "A": [("B", 5), ("C", 2)],
    "B": [("D", 1)],
    "C": [("D", 7)],
    "D": [],
}
```

---

## BFS e DFS

### BFS

Bom para menor caminho em grafo não ponderado.

```python
from collections import deque

def bfs(grafo: dict[str, list[str]], inicio: str) -> list[str]:
    visitados = {inicio}
    ordem = []
    fila = deque([inicio])

    while fila:
        atual = fila.popleft()
        ordem.append(atual)

        for vizinho in grafo.get(atual, []):
            if vizinho not in visitados:
                visitados.add(vizinho)
                fila.append(vizinho)

    return ordem
```

### DFS

Bom para exploração profunda, componentes, ciclos e topologia.

```python
def dfs(grafo: dict[str, list[str]], inicio: str) -> list[str]:
    visitados = set()
    ordem = []

    def visitar(vertice: str) -> None:
        if vertice in visitados:
            return
        visitados.add(vertice)
        ordem.append(vertice)

        for vizinho in grafo.get(vertice, []):
            visitar(vizinho)

    visitar(inicio)
    return ordem
```

---

## Caminho Mais Curto

Dijkstra para pesos não negativos.

```python
import heapq

def dijkstra(grafo: dict[str, list[tuple[str, int]]], origem: str) -> dict[str, int]:
    distancias = {origem: 0}
    heap = [(0, origem)]

    while heap:
        distancia_atual, vertice = heapq.heappop(heap)

        if distancia_atual > distancias.get(vertice, float("inf")):
            continue

        for vizinho, peso in grafo.get(vertice, []):
            nova_distancia = distancia_atual + peso

            if nova_distancia < distancias.get(vizinho, float("inf")):
                distancias[vizinho] = nova_distancia
                heapq.heappush(heap, (nova_distancia, vizinho))

    return distancias
```

Complexidade: `O((V + E) log V)` com heap.

---

## Boas Práticas

- Use recursão quando a estrutura é naturalmente recursiva.
- Prefira iteração para entradas muito grandes.
- Use `deque` para BFS.
- Use `set` para visitados.
- Modele grafo com lista de adjacência na maioria dos casos.
- Em árvore de busca, considere balanceamento para garantir `O(log n)`.
- Para pesos negativos, Dijkstra não é adequado.

---

## Exercícios

1. Implemente fatorial recursivo e iterativo.
2. Implemente Fibonacci recursivo e explique o custo.
3. Crie uma árvore binária e percorra em ordem.
4. Implemente busca em BST.
5. Implemente inserção em BST.
6. Implemente BFS em grafo.
7. Implemente DFS iterativo.
8. Detecte se existe caminho entre dois vértices.
9. Implemente Dijkstra.
10. Explique diferença entre árvore, grafo e lista de adjacência.

