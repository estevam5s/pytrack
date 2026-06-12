# Análise Prática: Regras, Loops, Espaço e Casos

Calcular Big O em código exige reconhecer padrões. A maior parte das análises profissionais vem de algumas regras: sequências somam, loops aninhados multiplicam, recursão vira recorrência e estruturas auxiliares contam como espaço.

---

## Regras para Calcular Big O

### 1. Sequências Somam

```python
def exemplo(nums: list[int]) -> None:
    for num in nums:
        print(num)

    for num in nums:
        print(num * 2)
```

`O(n) + O(n) = O(2n) = O(n)`.

### 2. Termo Dominante Fica

```python
def exemplo(nums: list[int]) -> None:
    for num in nums:
        print(num)

    for a in nums:
        for b in nums:
            print(a, b)
```

`O(n) + O(n²) = O(n²)`.

### 3. Loops Aninhados Multiplicam

```python
for i in range(n):
    for j in range(n):
        ...
```

Complexidade `O(n²)`.

### 4. Condições Dependem do Caso

```python
if condicao:
    operacao_o_n()
else:
    operacao_o_n2()
```

Pior caso: `O(n²)`.

### 5. Recursão Vira Recorrência

```python
def f(n):
    if n <= 1:
        return
    f(n // 2)
```

Recorrência: `T(n) = T(n/2) + O(1)`, resultado `O(log n)`.

---

## Loop Linear

```python
for i in range(n):
    ...
```

Executa proporcionalmente a `n`: `O(n)`.

Passo constante diferente:

```python
for i in range(0, n, 5):
    ...
```

Executa `n/5` vezes, mas `O(n)`.

---

## Loop Logarítmico

```python
i = 1
while i < n:
    i *= 2
```

Valores:

```text
1, 2, 4, 8, 16, ...
```

Quantidade de passos até `n`: `O(log n)`.

Outro exemplo:

```python
while n > 1:
    n //= 2
```

Também `O(log n)`.

---

## Loop Triangular

```python
for i in range(n):
    for j in range(i):
        ...
```

Total:

```text
0 + 1 + 2 + ... + (n - 1) = n(n - 1)/2
```

Complexidade `O(n²)`.

Mesmo que rode metade da matriz, a ordem continua quadrática.

---

## Dois Tamanhos de Entrada

```python
def comparar(a: list[int], b: list[int]) -> None:
    for x in a:
        for y in b:
            print(x, y)
```

Se `len(a) = n` e `len(b) = m`, a complexidade é:

```text
O(n * m)
```

Não simplifique para `O(n²)` quando os tamanhos são independentes.

---

## Loops Consecutivos com Entradas Diferentes

```python
def processar(a: list[int], b: list[int]) -> None:
    for x in a:
        print(x)

    for y in b:
        print(y)
```

Complexidade:

```text
O(n + m)
```

Se `n` e `m` são independentes, mantenha os dois.

---

## Complexidade de Espaço

Espaço mede memória adicional usada pelo algoritmo.

Espaço constante:

```python
def soma(nums: list[int]) -> int:
    total = 0
    for num in nums:
        total += num
    return total
```

Tempo `O(n)`, espaço extra `O(1)`.

Espaço linear:

```python
def dobrados(nums: list[int]) -> list[int]:
    resultado = []
    for num in nums:
        resultado.append(num * 2)
    return resultado
```

Tempo `O(n)`, espaço `O(n)`.

---

## Espaço em Recursão

```python
def fatorial(n: int) -> int:
    if n <= 1:
        return 1
    return n * fatorial(n - 1)
```

Tempo `O(n)`. Espaço `O(n)` por causa da pilha de chamadas.

Mesmo sem criar lista, recursão consome stack.

---

## Melhor, Médio, Pior Caso

Busca linear:

```python
def contem(nums: list[int], alvo: int) -> bool:
    for num in nums:
        if num == alvo:
            return True
    return False
```

- melhor caso: `O(1)`, alvo no primeiro item;
- pior caso: `O(n)`, alvo ausente ou no último item;
- caso médio: `O(n)`, assumindo distribuição uniforme.

Quando alguém pergunta Big O sem especificar, normalmente quer pior caso.

---

## Caso Esperado

Em estruturas hash:

```python
def contem(vistos: set[int], x: int) -> bool:
    return x in vistos
```

Busca em `set` é `O(1)` em média/esperado, mas pode degradar em cenários extremos de colisão.

Análise esperada depende de hipóteses probabilísticas.

---

## Análise Amortizada

Amortizada calcula custo médio ao longo de uma sequência de operações.

Exemplo: `list.append` em Python.

Na maioria das vezes, inserir no final é `O(1)`. Às vezes, a lista precisa realocar memória e copiar elementos, custando `O(n)`. Ao longo de muitas inserções, o custo amortizado é `O(1)`.

```python
nums = []
for i in range(n):
    nums.append(i)
```

Total `O(n)`, não `O(n²)`.

---

## Exemplo: MinStack

Uma pilha que retorna mínimo em `O(1)`:

```python
class MinStack:
    def __init__(self) -> None:
        self.stack = []
        self.mins = []

    def push(self, value: int) -> None:
        self.stack.append(value)
        if not self.mins or value <= self.mins[-1]:
            self.mins.append(value)

    def pop(self) -> int:
        value = self.stack.pop()
        if value == self.mins[-1]:
            self.mins.pop()
        return value

    def minimum(self) -> int:
        return self.mins[-1]
```

Operações:

- `push`: `O(1)` amortizado;
- `pop`: `O(1)`;
- `minimum`: `O(1)`;
- espaço: `O(n)`.

---

## Armadilhas Frequentes

- contar linhas em vez de crescimento;
- esquecer que slicing copia;
- simplificar `O(n * m)` para `O(n²)` indevidamente;
- ignorar espaço de estruturas auxiliares;
- ignorar stack de recursão;
- achar que dois loops no mesmo nível sempre são `O(n²)`;
- achar que todo loop `while` é `O(n)`;
- esquecer custo de operações internas.

Exemplo:

```python
for i in range(n):
    copia = nums[:]
```

O loop roda `n` vezes e cada slice custa `O(n)`: total `O(n²)`.

---

## Checklist

- Você separa tempo e espaço?
- Sabe quando somar e quando multiplicar?
- Reconhece loop logarítmico?
- Entende loop triangular?
- Mantém `n` e `m` separados quando necessário?
- Sabe analisar melhor, médio e pior caso?
- Considera custo de slicing, cópia e chamadas internas?

Análise prática exige olhar além da superfície do código. A pergunta correta é: quantas vezes cada operação relevante cresce com a entrada?

