# Estruturas Lineares: Pilhas, Filas e Deques

Pilhas e filas são estruturas fundamentais para algoritmos, sistemas, parsers, navegadores, filas de tarefas, BFS, DFS e processamento de eventos.

---

## Sumário

1. [Pilhas](#pilhas)
2. [Filas](#filas)
3. [Deque](#deque)
4. [Implementação com Classe](#implementação-com-classe)
5. [Aplicações Clássicas](#aplicações-clássicas)
6. [Complexidade](#complexidade)
7. [Boas Práticas](#boas-práticas)
8. [Exercícios](#exercícios)

---

## Pilhas

Pilha segue LIFO: last in, first out.

O último elemento inserido é o primeiro a sair.

Exemplos:

- desfazer/refazer;
- chamadas de função;
- validação de parênteses;
- DFS;
- histórico de navegação.

### Pilha com lista

```python
pilha = []

pilha.append("A")
pilha.append("B")
pilha.append("C")

topo = pilha.pop()

print(topo)  # C
```

Operações:

- `append`: empilha;
- `pop`: desempilha;
- `pilha[-1]`: consulta topo.

### Validando parênteses

```python
def parenteses_balanceados(texto: str) -> bool:
    pares = {
        ")": "(",
        "]": "[",
        "}": "{",
    }
    pilha = []

    for caractere in texto:
        if caractere in "([{":
            pilha.append(caractere)
        elif caractere in ")]}":
            if not pilha:
                return False
            if pilha.pop() != pares[caractere]:
                return False

    return not pilha
```

Complexidade:

- tempo: `O(n)`;
- espaço: `O(n)` no pior caso.

---

## Filas

Fila segue FIFO: first in, first out.

O primeiro elemento inserido é o primeiro a sair.

Exemplos:

- fila de impressão;
- filas de processamento;
- BFS;
- atendimento;
- mensagens.

### Fila com `deque`

Evite usar `list.pop(0)`, pois custa `O(n)`.

Use `collections.deque`.

```python
from collections import deque

fila = deque()

fila.append("A")
fila.append("B")
fila.append("C")

primeiro = fila.popleft()

print(primeiro)  # A
```

### Simulação de atendimento

```python
from collections import deque

def atender_clientes(clientes: list[str]) -> list[str]:
    fila = deque(clientes)
    atendidos = []

    while fila:
        cliente = fila.popleft()
        atendidos.append(f"atendido: {cliente}")

    return atendidos
```

---

## Deque

`deque` permite inserção e remoção eficientes nas duas pontas.

```python
from collections import deque

d = deque()
d.append("direita")
d.appendleft("esquerda")

print(d.pop())
print(d.popleft())
```

Também pode ter tamanho máximo.

```python
historico = deque(maxlen=3)

for pagina in ["home", "produtos", "carrinho", "checkout"]:
    historico.append(pagina)

print(historico)  # últimos 3 itens
```

Útil para janela deslizante.

---

## Implementação com Classe

### Pilha

```python
class Pilha:
    def __init__(self):
        self._itens = []

    def empilhar(self, item):
        self._itens.append(item)

    def desempilhar(self):
        if self.vazia():
            raise IndexError("pilha vazia")
        return self._itens.pop()

    def topo(self):
        if self.vazia():
            raise IndexError("pilha vazia")
        return self._itens[-1]

    def vazia(self) -> bool:
        return not self._itens

    def tamanho(self) -> int:
        return len(self._itens)
```

### Fila

```python
from collections import deque

class Fila:
    def __init__(self):
        self._itens = deque()

    def enfileirar(self, item):
        self._itens.append(item)

    def desenfileirar(self):
        if self.vazia():
            raise IndexError("fila vazia")
        return self._itens.popleft()

    def vazia(self) -> bool:
        return not self._itens

    def tamanho(self) -> int:
        return len(self._itens)
```

---

## Aplicações Clássicas

### DFS com pilha

```python
def dfs(grafo: dict[str, list[str]], inicio: str) -> list[str]:
    visitados = set()
    ordem = []
    pilha = [inicio]

    while pilha:
        vertice = pilha.pop()
        if vertice in visitados:
            continue

        visitados.add(vertice)
        ordem.append(vertice)

        for vizinho in reversed(grafo.get(vertice, [])):
            if vizinho not in visitados:
                pilha.append(vizinho)

    return ordem
```

### BFS com fila

```python
from collections import deque

def bfs(grafo: dict[str, list[str]], inicio: str) -> list[str]:
    visitados = {inicio}
    ordem = []
    fila = deque([inicio])

    while fila:
        vertice = fila.popleft()
        ordem.append(vertice)

        for vizinho in grafo.get(vertice, []):
            if vizinho not in visitados:
                visitados.add(vizinho)
                fila.append(vizinho)

    return ordem
```

### Sliding window com deque

```python
from collections import deque

def ultimos_valores(valores: list[int], tamanho: int):
    janela = deque(maxlen=tamanho)

    for valor in valores:
        janela.append(valor)
        yield list(janela)
```

---

## Complexidade

| Estrutura | Inserir | Remover | Consultar próximo |
|---|---:|---:|---:|
| Pilha com `list` | `O(1)` amortizado | `O(1)` | `O(1)` |
| Fila com `deque` | `O(1)` | `O(1)` | `O(1)` |
| Fila com `list.pop(0)` | `O(1)` append | `O(n)` | `O(1)` |

---

## Boas Práticas

- Use `list` para pilha simples.
- Use `deque` para fila.
- Não use `pop(0)` em listas para fila.
- Modele classe quando quiser encapsular regras.
- Use exceções claras para estrutura vazia.
- Prefira nomes do domínio quando a estrutura representar regra de negócio.

---

## Exercícios

1. Implemente uma pilha com `list`.
2. Implemente uma fila com `deque`.
3. Valide parênteses balanceados.
4. Crie histórico de navegação com `deque(maxlen=5)`.
5. Implemente DFS iterativo.
6. Implemente BFS.
7. Compare `list.pop(0)` com `deque.popleft` conceitualmente.
8. Crie uma fila de tarefas com prioridade simples.

