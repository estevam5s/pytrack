# Programação Dinâmica e Estratégias Algorítmicas

Programação dinâmica é uma técnica para resolver problemas com subproblemas sobrepostos e estrutura ótima. Este arquivo também organiza estratégias algorítmicas importantes para resolver problemas com maturidade.

---

## Sumário

1. [O Que é Programação Dinâmica](#o-que-é-programação-dinâmica)
2. [Recursão Ingênua vs Memoização](#recursão-ingênua-vs-memoização)
3. [Bottom-Up](#bottom-up)
4. [Problemas Clássicos](#problemas-clássicos)
5. [Mochila 0/1](#mochila-01)
6. [Longest Common Subsequence](#longest-common-subsequence)
7. [Estratégias Algorítmicas](#estratégias-algorítmicas)
8. [Como Identificar DP](#como-identificar-dp)
9. [Complexidade](#complexidade)
10. [Exercícios](#exercícios)

---

## O Que é Programação Dinâmica

Programação dinâmica resolve problemas quebrando em subproblemas e reaproveitando resultados.

Sinais de DP:

- subproblemas repetidos;
- decisão por estado;
- resposta ótima depende de respostas menores;
- força bruta gera árvore de chamadas explosiva.

Dois estilos:

- top-down com memoização;
- bottom-up com tabela.

---

## Recursão Ingênua vs Memoização

Fibonacci ingênuo:

```python
def fib_lento(n: int) -> int:
    if n < 2:
        return n
    return fib_lento(n - 1) + fib_lento(n - 2)
```

Tempo: `O(2^n)`.

Com memoização:

```python
from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n: int) -> int:
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)
```

Tempo: `O(n)`.

Espaço: `O(n)`.

Memoização manual:

```python
def fib(n: int, memo: dict[int, int] | None = None) -> int:
    if memo is None:
        memo = {}
    if n in memo:
        return memo[n]
    if n < 2:
        return n
    memo[n] = fib(n - 1, memo) + fib(n - 2, memo)
    return memo[n]
```

---

## Bottom-Up

```python
def fib_bottom_up(n: int) -> int:
    if n < 2:
        return n

    dp = [0] * (n + 1)
    dp[1] = 1

    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]

    return dp[n]
```

Otimizado em espaço:

```python
def fib_otimizado(n: int) -> int:
    if n < 2:
        return n

    anterior, atual = 0, 1

    for _ in range(2, n + 1):
        anterior, atual = atual, anterior + atual

    return atual
```

Tempo: `O(n)`.

Espaço: `O(1)`.

---

## Problemas Clássicos

### Subida de escadas

Pode subir 1 ou 2 degraus.

```python
def formas_subir(n: int) -> int:
    if n <= 2:
        return n

    a, b = 1, 2

    for _ in range(3, n + 1):
        a, b = b, a + b

    return b
```

### Coin Change

Menor número de moedas para formar valor.

```python
def min_moedas(moedas: list[int], valor: int) -> int:
    infinito = valor + 1
    dp = [infinito] * (valor + 1)
    dp[0] = 0

    for total in range(1, valor + 1):
        for moeda in moedas:
            if moeda <= total:
                dp[total] = min(dp[total], dp[total - moeda] + 1)

    return -1 if dp[valor] == infinito else dp[valor]
```

Tempo: `O(valor * quantidade_de_moedas)`.

---

## Mochila 0/1

Cada item pode ser escolhido uma vez.

```python
def mochila(pesos: list[int], valores: list[int], capacidade: int) -> int:
    n = len(pesos)
    dp = [[0] * (capacidade + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        peso = pesos[i - 1]
        valor = valores[i - 1]

        for cap in range(capacidade + 1):
            sem_item = dp[i - 1][cap]
            com_item = 0

            if peso <= cap:
                com_item = valor + dp[i - 1][cap - peso]

            dp[i][cap] = max(sem_item, com_item)

    return dp[n][capacidade]
```

Tempo: `O(n * capacidade)`.

Espaço: `O(n * capacidade)`.

Versão com espaço otimizado:

```python
def mochila_otimizada(pesos: list[int], valores: list[int], capacidade: int) -> int:
    dp = [0] * (capacidade + 1)

    for peso, valor in zip(pesos, valores):
        for cap in range(capacidade, peso - 1, -1):
            dp[cap] = max(dp[cap], valor + dp[cap - peso])

    return dp[capacidade]
```

---

## Longest Common Subsequence

Maior subsequência comum entre duas strings.

```python
def lcs(a: str, b: str) -> int:
    linhas = len(a)
    colunas = len(b)
    dp = [[0] * (colunas + 1) for _ in range(linhas + 1)]

    for i in range(1, linhas + 1):
        for j in range(1, colunas + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = 1 + dp[i - 1][j - 1]
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])

    return dp[linhas][colunas]
```

Tempo: `O(n * m)`.

Espaço: `O(n * m)`.

---

## Estratégias Algorítmicas

### Força bruta

Testa possibilidades diretamente.

Útil para:

- validar solução;
- entradas pequenas;
- entender problema.

### Guloso

Escolhe melhor decisão local.

```python
def selecionar_atividades(atividades: list[tuple[int, int]]) -> list[tuple[int, int]]:
    atividades = sorted(atividades, key=lambda atividade: atividade[1])
    selecionadas = []
    fim_atual = float("-inf")

    for inicio, fim in atividades:
        if inicio >= fim_atual:
            selecionadas.append((inicio, fim))
            fim_atual = fim

    return selecionadas
```

Guloso nem sempre gera solução ótima.

### Divisão e conquista

Quebra o problema em partes independentes.

Exemplos:

- merge sort;
- busca binária;
- quick sort.

### Backtracking

Explora possibilidades e desfaz escolhas.

```python
def subconjuntos(valores: list[int]) -> list[list[int]]:
    resultado = []
    atual = []

    def backtrack(indice: int) -> None:
        if indice == len(valores):
            resultado.append(atual.copy())
            return

        atual.append(valores[indice])
        backtrack(indice + 1)
        atual.pop()

        backtrack(indice + 1)

    backtrack(0)
    return resultado
```

Complexidade: `O(2^n)`.

---

## Como Identificar DP

Perguntas úteis:

1. Posso definir um estado?
2. A resposta do estado depende de estados menores?
3. Estados se repetem?
4. Existe escolha entre alternativas?
5. Posso memoizar a recursão?
6. Posso transformar em tabela?

Exemplo de estado:

```text
dp[i] = melhor resposta considerando até i
dp[i][j] = melhor resposta considerando prefixos i e j
dp[i][cap] = melhor valor usando i itens com capacidade cap
```

---

## Complexidade

Em DP, complexidade geralmente é:

```text
quantidade de estados * custo por transição
```

Exemplos:

- Fibonacci: `n` estados, transição `O(1)` -> `O(n)`;
- LCS: `n*m` estados, transição `O(1)` -> `O(n*m)`;
- Mochila: `n*capacidade` estados, transição `O(1)` -> `O(n*capacidade)`.

---

## Exercícios

1. Implemente Fibonacci ingênuo, memoizado e bottom-up.
2. Resolva subida de escadas.
3. Resolva coin change.
4. Implemente mochila 0/1.
5. Otimize mochila para espaço `O(capacidade)`.
6. Implemente LCS.
7. Gere todos os subconjuntos com backtracking.
8. Resolva seleção de atividades com guloso.
9. Explique quando guloso falha.
10. Para cada problema, defina estado, transição e caso base.

