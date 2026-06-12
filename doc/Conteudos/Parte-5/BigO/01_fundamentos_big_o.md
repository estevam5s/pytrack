# Fundamentos de Big O: Crescimento, Notações e Classes

Big O descreve como o custo de um algoritmo cresce quando o tamanho da entrada aumenta. Esse custo pode ser tempo, memória, chamadas de rede, leituras de disco, queries no banco ou qualquer recurso relevante.

Big O não mede segundos absolutos. Ele mede tendência de crescimento. Essa distinção é essencial: um algoritmo `O(n)` pode ser mais lento que um `O(n log n)` para entradas pequenas, mas tende a escalar melhor quando `n` cresce bastante.

---

## Por que Big O Importa

Big O ajuda a:

- comparar soluções sem depender da máquina;
- prever gargalos;
- escolher estruturas de dados;
- evitar algoritmos que explodem em produção;
- argumentar tecnicamente em code review;
- resolver entrevistas técnicas;
- entender por que uma solução funciona para 100 itens e falha para 1 milhão.

Exemplo:

```python
def contem_duplicado_lento(nums: list[int]) -> bool:
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] == nums[j]:
                return True
    return False
```

Esse algoritmo é `O(n²)` no pior caso.

Versão melhor:

```python
def contem_duplicado(nums: list[int]) -> bool:
    vistos = set()
    for num in nums:
        if num in vistos:
            return True
        vistos.add(num)
    return False
```

Tempo médio `O(n)`, espaço `O(n)`.

---

## O que é Big O

Se `T(n)` representa o custo para uma entrada de tamanho `n`, dizer que:

```text
T(n) = O(g(n))
```

significa que, para `n` suficientemente grande, `T(n)` cresce no máximo proporcional a `g(n)`, ignorando constantes e termos menores.

Intuição formal:

```text
T(n) <= c * g(n), para todo n >= n0
```

Onde:

- `c` é uma constante positiva;
- `n0` é o ponto a partir do qual a comparação vale;
- `g(n)` é a função de referência.

Exemplos:

```text
7n + 20        -> O(n)
3n² + 5n + 10 -> O(n²)
1000          -> O(1)
n log n + n   -> O(n log n)
```

---

## Por que Ignoramos Constantes

Considere:

```text
T1(n) = 5n
T2(n) = 100n
```

Ambas são `O(n)`. A segunda pode ser mais lenta na prática, mas cresce na mesma ordem.

Agora compare:

```text
T1(n) = 100n
T2(n) = n²
```

Para entradas pequenas, `100n` pode ser maior. Para entradas grandes, `n²` domina.

Big O foca no crescimento quando `n` aumenta.

---

## Notações Assintóticas

### Big O

Limite superior assintótico:

```text
f(n) = O(g(n))
```

`f` não cresce mais rápido que `g` para entradas grandes.

Uso comum:

```text
Este algoritmo é O(n²) no pior caso.
```

### Big Omega

Limite inferior assintótico:

```text
f(n) = Ω(g(n))
```

`f` cresce pelo menos como `g`.

Exemplo:

```text
Busca em lista não ordenada tem Ω(1) no melhor caso e O(n) no pior caso.
```

### Big Theta

Limite apertado:

```text
f(n) = Θ(g(n))
```

`f` cresce exatamente na mesma ordem de `g`.

Exemplo:

```text
Percorrer todos os itens de uma lista é Θ(n).
```

### little-o

Limite superior estrito:

```text
f(n) = o(g(n))
```

`f` cresce estritamente mais devagar que `g`.

Exemplo:

```text
n = o(n log n)
```

### little-omega

Limite inferior estrito:

```text
f(n) = ω(g(n))
```

`f` cresce estritamente mais rápido que `g`.

Exemplo:

```text
n log n = ω(n)
```

Na prática profissional, `O`, `Ω` e `Θ` são os mais úteis. `o` e `ω` aparecem mais em análise matemática.

---

## Como Pensar em Crescimento

Ordem comum do menor para o maior:

```text
O(1)
O(log log n)
O(log n)
O(sqrt(n))
O(n)
O(n log n)
O(n²)
O(n³)
O(2^n)
O(n!)
```

Com `n = 1_000_000`:

```text
log2(n)   ~= 20
n         = 1.000.000
n log n   ~= 20.000.000
n²        = 1.000.000.000.000
```

A diferença entre `O(n log n)` e `O(n²)` pode ser a diferença entre segundos e dias.

---

## Classes de Complexidade

| Complexidade | Nome | Exemplo típico |
|---|---|---|
| `O(1)` | Constante | Acesso `arr[i]` |
| `O(log n)` | Logarítmica | Busca binária |
| `O(sqrt(n))` | Sublinear | Teste de primalidade até raiz |
| `O(n)` | Linear | Percorrer lista |
| `O(n log n)` | Linearítmica | Merge sort, heap sort |
| `O(n²)` | Quadrática | Comparar todos os pares |
| `O(n³)` | Cúbica | Floyd-Warshall |
| `O(2^n)` | Exponencial | Subconjuntos por força bruta |
| `O(n!)` | Fatorial | Permutações completas |

Outras classes:

- `O(k^n)`: exponencial com base `k`;
- `O(log² n)`: aparece em algumas estruturas avançadas;
- `O(α(n))`: quase constante, comum em Union-Find otimizado.

---

## Exemplos Rápidos

Constante:

```python
def primeiro(nums: list[int]) -> int:
    return nums[0]
```

Linear:

```python
def soma(nums: list[int]) -> int:
    total = 0
    for num in nums:
        total += num
    return total
```

Quadrático:

```python
def todos_os_pares(nums: list[int]) -> list[tuple[int, int]]:
    pares = []
    for a in nums:
        for b in nums:
            pares.append((a, b))
    return pares
```

Logarítmico:

```python
def potencia_de_dois_ate(n: int) -> int:
    valor = 1
    passos = 0
    while valor < n:
        valor *= 2
        passos += 1
    return passos
```

---

## Tempo vs Espaço

Um algoritmo pode trocar tempo por memória.

Solução sem memória extra relevante:

```python
def buscar(nums: list[int], alvo: int) -> bool:
    for num in nums:
        if num == alvo:
            return True
    return False
```

Tempo `O(n)`, espaço `O(1)`.

Solução com estrutura auxiliar:

```python
def preparar_busca(nums: list[int]) -> set[int]:
    return set(nums)
```

Construção `O(n)`, espaço `O(n)`, busca média `O(1)`.

Não existe melhor universal. Depende do número de buscas, memória disponível e tamanho da entrada.

---

## Armadilha: Big O Não é Tudo

Big O não captura:

- constante muito alta;
- cache de CPU;
- overhead de Python;
- alocação de memória;
- I/O de disco;
- rede;
- banco de dados;
- serialização;
- concorrência;
- distribuição dos dados.

Use Big O para raciocínio inicial. Use medição para decisão final.

---

## Checklist

- Você sabe explicar Big O sem falar em segundos?
- Consegue ordenar classes de crescimento?
- Sabe diferença entre `O`, `Ω` e `Θ`?
- Entende por que constantes são ignoradas?
- Sabe separar análise de tempo e espaço?
- Reconhece quando Big O não basta?

Big O é uma linguagem para discutir crescimento. O próximo passo é aprender a calcular esse crescimento em código real.

