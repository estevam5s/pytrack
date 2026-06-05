# Hash Tables, Busca Binária e Ordenação

Este arquivo cobre hash tables, busca binária e algoritmos de ordenação. Esses temas são centrais para desempenho, entrevistas técnicas e design de soluções eficientes.

---

## Sumário

1. [Hash Tables](#hash-tables)
2. [Hash em Python](#hash-em-python)
3. [Busca Binária](#busca-binária)
4. [Ordenação com Python](#ordenação-com-python)
5. [Algoritmos de Ordenação Clássicos](#algoritmos-de-ordenação-clássicos)
6. [Quando Usar Cada Estratégia](#quando-usar-cada-estratégia)
7. [Complexidade](#complexidade)
8. [Exercícios](#exercícios)

---

## Hash Tables

Hash table é estrutura que mapeia chave para valor usando função hash.

Em Python:

- `dict` é hash table;
- `set` também usa hash table.

Busca média:

```text
O(1)
```

Pior caso teórico:

```text
O(n)
```

Na prática, `dict` e `set` são extremamente eficientes.

---

## Hash em Python

Objetos hashable podem ser chaves de dicionário.

Hashable:

- `int`
- `float`
- `str`
- `tuple` com itens hashable
- `frozenset`

Não hashable:

- `list`
- `dict`
- `set`

Exemplo:

```python
estoque = {
    ("SP", "produto-1"): 100,
    ("RJ", "produto-1"): 80,
}
```

### Two Sum com hash

```python
def duas_somas(numeros: list[int], alvo: int) -> tuple[int, int] | None:
    vistos = {}

    for indice, numero in enumerate(numeros):
        complemento = alvo - numero
        if complemento in vistos:
            return vistos[complemento], indice
        vistos[numero] = indice

    return None
```

Tempo: `O(n)` médio.

Espaço: `O(n)`.

---

## Busca Binária

Busca binária exige sequência ordenada.

Ideia:

1. olhe o meio;
2. se for o alvo, terminou;
3. se alvo for menor, procure na metade esquerda;
4. se alvo for maior, procure na metade direita.

```python
def busca_binaria(valores: list[int], alvo: int) -> int:
    esquerda = 0
    direita = len(valores) - 1

    while esquerda <= direita:
        meio = (esquerda + direita) // 2
        valor = valores[meio]

        if valor == alvo:
            return meio
        if valor < alvo:
            esquerda = meio + 1
        else:
            direita = meio - 1

    return -1
```

Complexidade: `O(log n)`.

### Usando `bisect`

```python
import bisect

valores = [10, 20, 30, 40]
indice = bisect.bisect_left(valores, 30)

if indice < len(valores) and valores[indice] == 30:
    print("encontrado")
```

Inserção ordenada:

```python
bisect.insort(valores, 25)
```

Busca é `O(log n)`, mas inserção em lista é `O(n)`.

---

## Ordenação com Python

`sorted` retorna nova lista.

```python
valores = [3, 1, 2]
ordenados = sorted(valores)
```

`list.sort` altera a lista.

```python
valores.sort()
```

Ordenação com chave:

```python
usuarios = [
    {"nome": "Ana", "idade": 30},
    {"nome": "Bia", "idade": 25},
]

usuarios = sorted(usuarios, key=lambda usuario: usuario["idade"])
```

Ordenação múltipla:

```python
usuarios = sorted(
    usuarios,
    key=lambda usuario: (usuario["idade"], usuario["nome"]),
)
```

Ordenação decrescente:

```python
valores = sorted(valores, reverse=True)
```

Python usa Timsort:

- estável;
- `O(n log n)` no pior caso;
- eficiente em dados parcialmente ordenados.

---

## Algoritmos de Ordenação Clássicos

### Bubble Sort

Didático, mas ineficiente.

```python
def bubble_sort(valores: list[int]) -> list[int]:
    valores = valores.copy()
    n = len(valores)

    for i in range(n):
        trocou = False
        for j in range(0, n - i - 1):
            if valores[j] > valores[j + 1]:
                valores[j], valores[j + 1] = valores[j + 1], valores[j]
                trocou = True
        if not trocou:
            break

    return valores
```

Pior caso: `O(n²)`.

### Insertion Sort

Bom para listas pequenas ou quase ordenadas.

```python
def insertion_sort(valores: list[int]) -> list[int]:
    valores = valores.copy()

    for i in range(1, len(valores)):
        atual = valores[i]
        j = i - 1

        while j >= 0 and valores[j] > atual:
            valores[j + 1] = valores[j]
            j -= 1

        valores[j + 1] = atual

    return valores
```

Pior caso: `O(n²)`.

### Merge Sort

```python
def merge_sort(valores: list[int]) -> list[int]:
    if len(valores) <= 1:
        return valores

    meio = len(valores) // 2
    esquerda = merge_sort(valores[:meio])
    direita = merge_sort(valores[meio:])

    return merge(esquerda, direita)


def merge(esquerda: list[int], direita: list[int]) -> list[int]:
    resultado = []
    i = j = 0

    while i < len(esquerda) and j < len(direita):
        if esquerda[i] <= direita[j]:
            resultado.append(esquerda[i])
            i += 1
        else:
            resultado.append(direita[j])
            j += 1

    resultado.extend(esquerda[i:])
    resultado.extend(direita[j:])
    return resultado
```

Tempo: `O(n log n)`.

Espaço: `O(n)`.

### Quick Sort

```python
def quick_sort(valores: list[int]) -> list[int]:
    if len(valores) <= 1:
        return valores

    pivo = valores[len(valores) // 2]
    menores = [x for x in valores if x < pivo]
    iguais = [x for x in valores if x == pivo]
    maiores = [x for x in valores if x > pivo]

    return quick_sort(menores) + iguais + quick_sort(maiores)
```

Médio: `O(n log n)`.

Pior caso: `O(n²)`.

---

## Quando Usar Cada Estratégia

- Use `sorted` e `.sort()` em código real.
- Implemente algoritmos clássicos para aprender.
- Use `bisect` quando dados já estão ordenados.
- Use `dict`/`set` quando busca por igualdade é o foco.
- Use ordenação quando precisar de ranking, busca por faixa ou saída ordenada.

---

## Complexidade

| Algoritmo | Melhor | Médio | Pior | Espaço |
|---|---:|---:|---:|---:|
| Busca linear | `O(1)` | `O(n)` | `O(n)` | `O(1)` |
| Busca binária | `O(1)` | `O(log n)` | `O(log n)` | `O(1)` |
| Bubble sort | `O(n)` | `O(n²)` | `O(n²)` | `O(1)` |
| Insertion sort | `O(n)` | `O(n²)` | `O(n²)` | `O(1)` |
| Merge sort | `O(n log n)` | `O(n log n)` | `O(n log n)` | `O(n)` |
| Quick sort | `O(n log n)` | `O(n log n)` | `O(n²)` | `O(log n)` médio |
| Timsort | `O(n)` | `O(n log n)` | `O(n log n)` | `O(n)` |

---

## Exercícios

1. Implemente busca binária iterativa.
2. Implemente busca binária recursiva.
3. Use `bisect` para encontrar posição de inserção.
4. Resolva Two Sum com `dict`.
5. Implemente Bubble Sort.
6. Implemente Insertion Sort.
7. Implemente Merge Sort.
8. Ordene usuários por idade e nome.
9. Compare busca linear, busca binária e hash table.
10. Explique por que busca binária exige dados ordenados.

