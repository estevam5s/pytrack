# Coleções Nativas: Listas, Tuplas, Dicionários e Sets

Coleções são a base prática de estruturas de dados em Python. Este arquivo mostra como usar listas, tuplas, dicionários e sets de forma idiomática, eficiente e profissional.

---

## Sumário

1. [Listas](#listas)
2. [Tuplas](#tuplas)
3. [Dicionários](#dicionários)
4. [Sets](#sets)
5. [Coleções Aninhadas](#coleções-aninhadas)
6. [Cópia, Mutabilidade e Referências](#cópia-mutabilidade-e-referências)
7. [Escolha da Estrutura Certa](#escolha-da-estrutura-certa)
8. [Complexidade das Operações](#complexidade-das-operações)
9. [Boas Práticas](#boas-práticas)
10. [Exercícios](#exercícios)

---

## Listas

Listas são mutáveis, ordenadas e aceitam elementos repetidos.

```python
numeros = [10, 20, 30]
numeros.append(40)
numeros.insert(0, 5)
```

Acesso:

```python
primeiro = numeros[0]
ultimo = numeros[-1]
```

Fatiamento:

```python
valores = [1, 2, 3, 4, 5]

print(valores[:3])
print(valores[2:])
print(valores[::-1])
```

Remoção:

```python
valores.remove(3)
ultimo = valores.pop()
```

Ordenação:

```python
nomes = ["Carlos", "Ana", "Bia"]
nomes.sort()

ordenados = sorted(nomes, reverse=True)
```

Lista de dicionários:

```python
usuarios = [
    {"nome": "Ana", "idade": 30},
    {"nome": "Bia", "idade": 25},
]

usuarios_ordenados = sorted(usuarios, key=lambda usuario: usuario["idade"])
```

---

## Tuplas

Tuplas são ordenadas e imutáveis.

```python
ponto = (10, 20)
x, y = ponto
```

Use tuplas para:

- coordenadas;
- pares chave/valor;
- retornos múltiplos;
- chaves compostas em dicionários;
- dados que não devem mudar.

Retorno múltiplo:

```python
def dividir(a: int, b: int) -> tuple[int, int]:
    return a // b, a % b

quociente, resto = dividir(10, 3)
```

Chave composta:

```python
estoque = {
    ("SP", "produto-1"): 100,
    ("RJ", "produto-1"): 80,
}
```

---

## Dicionários

Dicionários mapeiam chave para valor.

```python
usuario = {
    "id": 1,
    "nome": "Ana",
    "ativo": True,
}
```

Acesso:

```python
nome = usuario["nome"]
email = usuario.get("email", "sem email")
```

Iteração:

```python
for chave, valor in usuario.items():
    print(chave, valor)
```

Atualização:

```python
usuario["email"] = "ana@example.com"
```

Merge:

```python
padrao = {"timeout": 5, "retries": 3}
custom = {"timeout": 10}

config = padrao | custom
```

Agrupamento:

```python
from collections import defaultdict

vendas = [
    {"categoria": "livro", "valor": 50},
    {"categoria": "curso", "valor": 200},
    {"categoria": "livro", "valor": 30},
]

por_categoria = defaultdict(list)

for venda in vendas:
    por_categoria[venda["categoria"]].append(venda)
```

Contagem:

```python
from collections import Counter

palavras = "python python dados".split()
contagem = Counter(palavras)
```

---

## Sets

Sets são conjuntos sem duplicatas.

```python
ids = {1, 2, 2, 3}
print(ids)  # {1, 2, 3}
```

Membership test eficiente:

```python
usuarios_bloqueados = {10, 20, 30}

if usuario_id in usuarios_bloqueados:
    print("bloqueado")
```

Operações de conjunto:

```python
a = {1, 2, 3}
b = {3, 4, 5}

print(a | b)  # união
print(a & b)  # interseção
print(a - b)  # diferença
print(a ^ b)  # diferença simétrica
```

`frozenset` é imutável e pode ser usado como chave.

```python
permissoes = frozenset({"ler", "editar"})
```

---

## Coleções Aninhadas

Matriz:

```python
matriz = [
    [1, 2, 3],
    [4, 5, 6],
]

for linha in matriz:
    for valor in linha:
        print(valor)
```

JSON-like:

```python
pedido = {
    "id": 1,
    "cliente": {"nome": "Ana", "email": "ana@example.com"},
    "itens": [
        {"produto": "Livro", "preco": 50},
        {"produto": "Curso", "preco": 200},
    ],
}
```

Acesso seguro:

```python
email = pedido.get("cliente", {}).get("email")
```

Em dados complexos, considere `dataclass`, `TypedDict` ou Pydantic.

---

## Cópia, Mutabilidade e Referências

```python
a = [1, 2, 3]
b = a
b.append(4)

print(a)  # [1, 2, 3, 4]
```

Cópia rasa:

```python
copia = a.copy()
```

Cópia profunda:

```python
from copy import deepcopy

dados = [{"nome": "Ana"}]
copia = deepcopy(dados)
```

Evite defaults mutáveis:

```python
def adicionar(item, lista=None):
    if lista is None:
        lista = []
    lista.append(item)
    return lista
```

---

## Escolha da Estrutura Certa

| Necessidade | Estrutura |
|---|---|
| Ordem e alteração | `list` |
| Ordem e imutabilidade | `tuple` |
| Busca por chave | `dict` |
| Remover duplicatas | `set` |
| Chave composta | `tuple` |
| Contagem | `Counter` |
| Agrupamento | `defaultdict` |

Exemplo: remover duplicatas preservando ordem.

```python
def remover_duplicatas(valores: list[int]) -> list[int]:
    vistos = set()
    resultado = []

    for valor in valores:
        if valor not in vistos:
            vistos.add(valor)
            resultado.append(valor)

    return resultado
```

---

## Complexidade das Operações

| Operação | `list` | `dict` | `set` |
|---|---:|---:|---:|
| Acesso por índice | `O(1)` | - | - |
| Busca por valor | `O(n)` | `O(1)` médio por chave | `O(1)` médio |
| Inserção no fim | `O(1)` amortizado | - | - |
| Inserção/remoção no início | `O(n)` | - | - |
| Inserir chave/item | - | `O(1)` médio | `O(1)` médio |

---

## Boas Práticas

- Use `list` para sequência mutável.
- Use `tuple` para registros simples imutáveis.
- Use `dict` para lookup por chave.
- Use `set` para pertencimento e unicidade.
- Evite estruturas aninhadas profundas sem tipos/documentação.
- Não use lista para membership intensivo quando `set` resolve melhor.
- Prefira `Counter` e `defaultdict` quando expressarem intenção.

---

## Exercícios

1. Remova duplicatas de uma lista preservando ordem.
2. Conte palavras em um texto com `Counter`.
3. Agrupe vendas por categoria.
4. Use tupla como chave composta em um estoque.
5. Compare tempo conceitual de busca em lista e set.
6. Transforme uma lista de usuários em dicionário por id.
7. Crie uma matriz e some suas linhas.
8. Reescreva uma estrutura aninhada usando `dataclass`.

