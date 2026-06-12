# Recursão, Árvores de Recursão, Recorrências e Teorema Mestre

Recursão ocorre quando uma função chama a si mesma. A análise de complexidade recursiva normalmente vira uma recorrência: uma equação que descreve o custo de um problema em termos de subproblemas menores.

Recursão é poderosa, mas em Python exige cuidado com limite de pilha, cópias acidentais e explosão combinatória.

---

## Recursão Linear

```python
def soma(nums: list[int], i: int = 0) -> int:
    if i == len(nums):
        return 0
    return nums[i] + soma(nums, i + 1)
```

Recorrência:

```text
T(n) = T(n - 1) + O(1)
```

Resultado:

```text
O(n)
```

Espaço:

```text
O(n)
```

por causa da pilha de chamadas.

---

## Divisão e Conquista

```python
def busca_binaria(nums: list[int], alvo: int, inicio: int, fim: int) -> int:
    if inicio > fim:
        return -1

    meio = (inicio + fim) // 2

    if nums[meio] == alvo:
        return meio
    if nums[meio] < alvo:
        return busca_binaria(nums, alvo, meio + 1, fim)
    return busca_binaria(nums, alvo, inicio, meio - 1)
```

Recorrência:

```text
T(n) = T(n/2) + O(1)
```

Resultado:

```text
O(log n)
```

Espaço recursivo:

```text
O(log n)
```

Versão iterativa reduz espaço para `O(1)`.

---

## Recursão Duplicada

```python
def fib(n: int) -> int:
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)
```

Essa solução recalcula subproblemas.

Recorrência:

```text
T(n) = T(n - 1) + T(n - 2) + O(1)
```

Complexidade:

```text
O(2^n)
```

Versão com memoização:

```python
from functools import lru_cache


@lru_cache(maxsize=None)
def fib(n: int) -> int:
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)
```

Tempo `O(n)`, espaço `O(n)`.

---

## Árvore de Recursão

Para:

```text
T(n) = 2T(n/2) + O(n)
```

Cada nível custa aproximadamente `n`:

```text
n
n/2 + n/2 = n
n/4 + n/4 + n/4 + n/4 = n
...
```

Número de níveis: `log n`.

Total:

```text
O(n log n)
```

Esse é o padrão do Merge Sort.

---

## Merge Sort

```python
def merge_sort(nums: list[int]) -> list[int]:
    if len(nums) <= 1:
        return nums

    meio = len(nums) // 2
    esquerda = merge_sort(nums[:meio])
    direita = merge_sort(nums[meio:])

    return merge(esquerda, direita)
```

Conceitualmente:

```text
T(n) = 2T(n/2) + O(n)
```

Tempo `O(n log n)`.

Atenção: em Python, slicing cria cópias. Uma implementação didática pode ter custos extras de memória.

---

## Teorema Mestre

Para recorrências da forma:

```text
T(n) = aT(n/b) + f(n)
```

Onde:

- `a`: número de subproblemas;
- `n/b`: tamanho de cada subproblema;
- `f(n)`: custo fora da recursão.

Compare `f(n)` com:

```text
n^(log_b a)
```

---

## Caso 1

`f(n)` é menor que `n^(log_b a)`.

Exemplo:

```text
T(n) = 8T(n/2) + O(n²)
```

`n^(log_2 8) = n³`.

Resultado:

```text
O(n³)
```

---

## Caso 2

`f(n)` tem o mesmo tamanho assintótico.

Exemplo:

```text
T(n) = 2T(n/2) + O(n)
```

`n^(log_2 2) = n`.

Resultado:

```text
O(n log n)
```

---

## Caso 3

`f(n)` é maior que `n^(log_b a)` e satisfaz condição de regularidade.

Exemplo:

```text
T(n) = 2T(n/2) + O(n²)
```

`n^(log_2 2) = n`.

Resultado:

```text
O(n²)
```

---

## Recursão com Backtracking

Permutações:

```python
def permutacoes(nums: list[int]) -> list[list[int]]:
    resultado = []
    usado = [False] * len(nums)

    def backtrack(caminho: list[int]) -> None:
        if len(caminho) == len(nums):
            resultado.append(caminho.copy())
            return

        for i, num in enumerate(nums):
            if usado[i]:
                continue
            usado[i] = True
            caminho.append(num)
            backtrack(caminho)
            caminho.pop()
            usado[i] = False

    backtrack([])
    return resultado
```

Há `n!` permutações, e copiar cada solução custa `O(n)`.

Complexidade:

```text
Tempo: O(n * n!)
Espaco de saida: O(n * n!)
Espaco auxiliar: O(n)
```

---

## Recursão vs Iteração

Recursão costuma ser clara para:

- árvores;
- grafos;
- divisão e conquista;
- backtracking;
- programação dinâmica top-down.

Iteração costuma ser melhor para:

- loops simples;
- recursão muito profunda;
- desempenho em Python;
- controle explícito de memória.

---

## Erros Comuns

- esquecer caso base;
- reduzir pouco ou nada o problema;
- usar slicing em toda chamada;
- ignorar espaço da pilha;
- usar Fibonacci recursivo sem memoização;
- aplicar Teorema Mestre em recorrência fora do formato;
- confundir quantidade de nós da árvore com profundidade;
- ignorar custo de copiar soluções no backtracking.

---

## Checklist

- A recursão tem caso base claro?
- O problema diminui a cada chamada?
- Você escreveu a recorrência?
- Considerou espaço da pilha?
- Há subproblemas repetidos que pedem memoização?
- O Teorema Mestre se aplica?
- Existe cópia oculta por slicing?
- A saída tem tamanho exponencial ou fatorial?

Recursão bem analisada revela o verdadeiro custo de algoritmos elegantes. Sem análise, ela pode esconder explosões exponenciais e consumo alto de memória.

