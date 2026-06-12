# Otimização Prática, Sistemas Reais, Cache, I/O e Gargalos

Otimizar algoritmos na prática não significa trocar tudo por soluções complexas. Significa identificar o gargalo real, escolher a estrutura certa e reduzir trabalho desnecessário.

Big O é uma ferramenta de diagnóstico. Em sistemas reais, custo também envolve rede, banco, disco, cache, serialização, concorrência e constantes de implementação.

---

## Estratégia de Otimização

1. Entenda o requisito.
2. Meça o problema.
3. Identifique a operação dominante.
4. Troque estrutura ou algoritmo.
5. Valide corretude.
6. Meça novamente.
7. Observe custo de memória e complexidade do código.

Não otimize no escuro.

---

## Troque Estrutura de Dados

Ruim para muitas buscas:

```python
def contar_presentes(a: list[int], b: list[int]) -> int:
    total = 0
    for x in a:
        if x in b:
            total += 1
    return total
```

Complexidade `O(n * m)`.

Melhor:

```python
def contar_presentes(a: list[int], b: list[int]) -> int:
    b_set = set(b)
    total = 0
    for x in a:
        if x in b_set:
            total += 1
    return total
```

Complexidade média `O(n + m)`, espaço `O(m)`.

---

## Prefix Sums

Para consultas repetidas de soma em intervalo:

```python
def prefix_sums(nums: list[int]) -> list[int]:
    prefix = [0]
    for num in nums:
        prefix.append(prefix[-1] + num)
    return prefix


def soma_intervalo(prefix: list[int], inicio: int, fim: int) -> int:
    return prefix[fim + 1] - prefix[inicio]
```

Construção `O(n)`.

Cada consulta `O(1)`.

Sem prefix sum, cada consulta pode custar `O(k)`.

---

## Two Pointers

Em array ordenado, encontrar dois valores que somam alvo:

```python
def two_sum_ordenado(nums: list[int], alvo: int) -> bool:
    esquerda = 0
    direita = len(nums) - 1

    while esquerda < direita:
        soma = nums[esquerda] + nums[direita]
        if soma == alvo:
            return True
        if soma < alvo:
            esquerda += 1
        else:
            direita -= 1

    return False
```

Tempo `O(n)`, espaço `O(1)`.

Força bruta seria `O(n²)`.

---

## Sliding Window

Maior soma de subarray de tamanho `k`:

```python
def max_soma_janela(nums: list[int], k: int) -> int:
    if k <= 0 or k > len(nums):
        raise ValueError("k invalido")

    atual = sum(nums[:k])
    melhor = atual

    for i in range(k, len(nums)):
        atual += nums[i]
        atual -= nums[i - k]
        melhor = max(melhor, atual)

    return melhor
```

Tempo `O(n)`.

Sem janela deslizante, recalcular cada janela custaria `O(n * k)`.

---

## Elimine Trabalho Repetido

Ruim:

```python
def processar(usuarios, pedidos):
    for usuario in usuarios:
        total = 0
        for pedido in pedidos:
            if pedido["usuario_id"] == usuario["id"]:
                total += pedido["valor"]
        usuario["total"] = total
```

Complexidade `O(u * p)`.

Melhor:

```python
from collections import defaultdict


def processar(usuarios, pedidos):
    total_por_usuario = defaultdict(int)
    for pedido in pedidos:
        total_por_usuario[pedido["usuario_id"]] += pedido["valor"]

    for usuario in usuarios:
        usuario["total"] = total_por_usuario[usuario["id"]]
```

Complexidade `O(u + p)`.

---

## Big O em APIs

Problemas comuns:

- endpoint lista tudo sem paginação;
- serialização de objetos gigantes;
- N+1 queries;
- filtro em memória em vez de banco;
- ordenação sem índice;
- chamadas externas em loop;
- payload maior que necessário.

Exemplo ruim:

```python
usuarios = repo.listar_todos()
ativos = [u for u in usuarios if u.ativo]
```

Melhor:

```sql
SELECT id, nome, email
FROM usuarios
WHERE ativo = TRUE
LIMIT 100;
```

Traga do banco apenas o que precisa.

---

## N+1 Queries

Padrão ruim:

```python
pedidos = buscar_pedidos()
for pedido in pedidos:
    pedido["cliente"] = buscar_cliente(pedido["cliente_id"])
```

Se há 100 pedidos, isso gera 101 queries.

Melhor:

- `JOIN`;
- prefetch/eager loading;
- consulta em lote;
- cache controlado.

SQL:

```sql
SELECT p.id, p.total, c.nome
FROM pedidos p
JOIN clientes c ON c.id = p.cliente_id;
```

---

## Big O em ETL

Em dados/ETL, gargalos incluem:

- leitura de arquivo;
- parsing;
- conversão de tipos;
- joins em memória;
- escrita no banco;
- rede;
- compressão;
- tamanho de lote.

Estratégias:

- processar em chunks;
- evitar carregar tudo na memória;
- usar operações vetorizadas quando possível;
- gravar em lote;
- particionar arquivos;
- medir tempo por etapa.

---

## Cache

Cache troca memória e complexidade por velocidade.

```python
from functools import lru_cache


@lru_cache(maxsize=1024)
def buscar_configuracao(chave: str) -> str:
    return carregar_do_banco(chave)
```

Cuidados:

- invalidação;
- tamanho máximo;
- dados obsoletos;
- vazamento de memória;
- chave de cache correta;
- concorrência.

Cache sem política vira fonte de bug.

---

## I/O e Rede Dominam CPU

Comparação:

```text
operação em memória: nanos/microssegundos
disco: micros/milissegundos
rede: milissegundos
API externa: dezenas/centenas de milissegundos
```

Em sistemas reais, reduzir uma chamada de rede pode importar mais que micro-otimizar um loop.

Exemplo:

```python
for item in itens:
    api.enviar(item)
```

Melhor quando suportado:

```python
api.enviar_lote(itens)
```

---

## Backpressure

Se a entrada cresce mais rápido que o processamento:

- filas aumentam;
- latência sobe;
- memória cresce;
- timeouts aparecem;
- sistema cai.

Use:

- limites;
- paginação;
- rate limiting;
- filas;
- processamento em lote;
- circuit breaker;
- rejeição controlada.

---

## Custo de Memória

Algoritmo mais rápido pode consumir memória demais.

```python
todos = list(cursor.fetchall())
```

Para grande volume, prefira streaming/chunks:

```python
for lote in ler_em_lotes():
    processar(lote)
```

Espaço importa tanto quanto tempo.

---

## Checklist

- O gargalo foi medido?
- A estrutura de dados é adequada?
- Há trabalho repetido eliminável?
- Existe N+1 query?
- Dados são filtrados no lugar certo?
- Há paginação?
- Cache tem invalidação?
- I/O e rede foram considerados?
- Otimização aumentou complexidade de forma justificável?

Otimização profissional é objetiva: medir, reduzir o trabalho dominante e manter o sistema compreensível.

