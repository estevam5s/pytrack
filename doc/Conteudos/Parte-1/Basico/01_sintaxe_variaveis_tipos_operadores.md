# Sintaxe, Variáveis, Tipos e Operadores em Python

Guia progressivo sobre a base da linguagem Python: sintaxe, comentários, indentação, variáveis, tipos primitivos, conversões, operadores e expressões.

---

## Sumário

1. [Objetivo](#objetivo)
2. [Primeiro Programa](#primeiro-programa)
3. [Indentação](#indentação)
4. [Comentários e Docstrings](#comentários-e-docstrings)
5. [Variáveis](#variáveis)
6. [Tipos Básicos](#tipos-básicos)
7. [Conversão de Tipos](#conversão-de-tipos)
8. [Strings](#strings)
9. [Coleções Básicas](#coleções-básicas)
10. [Operadores](#operadores)
11. [Comparação e Identidade](#comparação-e-identidade)
12. [Verdadeiro e Falso em Python](#verdadeiro-e-falso-em-python)
13. [Boas Práticas](#boas-práticas)
14. [Nível Avançado: Modelo de Objetos, Mutabilidade e Precisão](#nível-avançado-modelo-de-objetos-mutabilidade-e-precisão)
15. [Armadilhas de Especialista](#armadilhas-de-especialista)
16. [Checklist de Proficiência](#checklist-de-proficiência)
17. [Exercícios](#exercícios)

---

## Objetivo

Dominar a base da linguagem para escrever código legível, previsível e pronto para evoluir.

Python valoriza:

- clareza;
- simplicidade;
- indentação significativa;
- leitura próxima de linguagem natural;
- uso correto de tipos e estruturas.

---

## Primeiro Programa

```python
print("Olá, Python!")
```

`print` envia uma representação textual para a saída padrão.

Exemplo com variável:

```python
nome = "Ana"
print("Olá,", nome)
```

Exemplo com f-string:

```python
nome = "Ana"
idade = 30

print(f"{nome} tem {idade} anos")
```

---

## Indentação

Python usa indentação para definir blocos.

```python
idade = 18

if idade >= 18:
    print("Maior de idade")
    print("Pode continuar")
```

Evite misturar tabs e espaços. O padrão profissional é usar 4 espaços.

Errado:

```python
if True:
print("sem indentação")
```

Correto:

```python
if True:
    print("com indentação")
```

---

## Comentários e Docstrings

Comentários explicam decisões, não o óbvio.

```python
# Desconto promocional aplicado apenas na primeira compra.
desconto = 0.10
```

Docstrings documentam módulos, funções, classes e métodos.

```python
def calcular_total(preco: float, quantidade: int) -> float:
    """Calcula o total bruto de uma compra."""
    return preco * quantidade
```

Evite:

```python
# soma a + b
resultado = a + b
```

Esse comentário não adiciona informação.

---

## Variáveis

Variáveis são nomes que referenciam objetos.

```python
preco = 49.90
quantidade = 3
total = preco * quantidade
```

Python tem tipagem dinâmica:

```python
valor = 10
valor = "dez"
```

Isso é permitido, mas não significa que seja sempre uma boa ideia. Em código profissional, prefira nomes com significado estável.

### Nomes bons

```python
idade_usuario = 32
total_pedido = 149.90
email_confirmado = True
```

### Nomes ruins

```python
x = 32
tp = 149.90
flag = True
```

Use nomes curtos apenas quando o contexto for muito local, como em loops simples.

---

## Tipos Básicos

### Inteiros

```python
idade = 30
quantidade = 5
```

Tipo: `int`.

### Ponto flutuante

```python
preco = 19.99
temperatura = 23.5
```

Tipo: `float`.

Para dinheiro, prefira `Decimal` quando precisão for essencial.

```python
from decimal import Decimal

preco = Decimal("19.99")
taxa = Decimal("0.10")
total = preco + taxa
```

### Booleanos

```python
ativo = True
bloqueado = False
```

Booleanos são usados em condições.

```python
if ativo:
    print("Conta ativa")
```

### None

`None` representa ausência de valor.

```python
usuario = None

if usuario is None:
    print("Usuário não encontrado")
```

Use `is None`, não `== None`.

---

## Conversão de Tipos

```python
idade_texto = "30"
idade = int(idade_texto)
```

Outras conversões:

```python
float("19.90")
str(123)
bool(1)
list("abc")
tuple([1, 2, 3])
set([1, 1, 2])
```

Conversões podem falhar:

```python
int("abc")
```

Isso gera `ValueError`.

Tratamento seguro:

```python
entrada = "42"

try:
    numero = int(entrada)
except ValueError:
    numero = 0
```

---

## Strings

Strings são sequências imutáveis de caracteres.

```python
nome = "Python"
```

### Acesso por índice

```python
nome = "Python"

print(nome[0])   # P
print(nome[-1])  # n
```

### Fatiamento

```python
texto = "abcdef"

print(texto[0:3])   # abc
print(texto[:3])    # abc
print(texto[3:])    # def
print(texto[::-1])  # fedcba
```

### Métodos úteis

```python
email = "  ANA@EXEMPLO.COM "

normalizado = email.strip().lower()
```

```python
frase = "python é produtivo"

frase.upper()
frase.title()
frase.replace("produtivo", "poderoso")
frase.split()
```

### F-strings

```python
nome = "Ana"
saldo = 1234.5

mensagem = f"Cliente {nome} possui saldo de R$ {saldo:.2f}"
```

---

## Coleções Básicas

### Lista

Mutável, ordenada e permite repetição.

```python
nomes = ["Ana", "Bia", "Carlos"]
nomes.append("Daniel")
```

### Tupla

Imutável e ordenada.

```python
ponto = (10, 20)
x, y = ponto
```

### Dicionário

Mapeia chave para valor.

```python
usuario = {
    "nome": "Ana",
    "idade": 30,
}

print(usuario["nome"])
```

Acesso seguro:

```python
email = usuario.get("email", "sem email")
```

### Conjunto

Não permite duplicatas.

```python
ids = {1, 2, 2, 3}
print(ids)  # {1, 2, 3}
```

Útil para membership test:

```python
if usuario_id in ids:
    print("encontrado")
```

---

## Operadores

### Aritméticos

```python
10 + 3   # 13
10 - 3   # 7
10 * 3   # 30
10 / 3   # divisão real
10 // 3  # divisão inteira
10 % 3   # resto
10 ** 3  # potência
```

### Atribuição

```python
contador = 0
contador += 1
contador -= 1
contador *= 2
```

### Comparação

```python
idade >= 18
preco < 100
nome == "Ana"
status != "cancelado"
```

### Lógicos

```python
if idade >= 18 and ativo:
    print("acesso liberado")

if admin or gerente:
    print("pode aprovar")

if not bloqueado:
    print("pode entrar")
```

### Pertencimento

```python
"py" in "python"
3 in [1, 2, 3]
"nome" in {"nome": "Ana"}
```

---

## Comparação e Identidade

`==` compara valor.

```python
a = [1, 2]
b = [1, 2]

print(a == b)  # True
```

`is` compara identidade do objeto.

```python
print(a is b)  # False
```

Use `is` principalmente com `None`, `True` e `False` quando necessário.

```python
if resultado is None:
    print("sem resultado")
```

---

## Verdadeiro e Falso em Python

Valores considerados falsos:

- `False`
- `None`
- `0`
- `0.0`
- `""`
- `[]`
- `{}`
- `set()`
- `tuple()`

Exemplo:

```python
nomes = []

if not nomes:
    print("lista vazia")
```

---

## Boas Práticas

- Use nomes claros.
- Evite reusar variável para tipos diferentes.
- Prefira f-strings para interpolação.
- Use `Decimal` para dinheiro quando houver exigência de precisão.
- Use `is None` para comparar com `None`.
- Evite lógica complexa em uma única linha.
- Transforme expressões repetidas em variáveis com nome.

Exemplo melhor:

```python
idade_minima = 18
tem_documento = True
idade = 20

pode_entrar = idade >= idade_minima and tem_documento

if pode_entrar:
    print("Entrada autorizada")
```

---

## Nível Avançado: Modelo de Objetos, Mutabilidade e Precisão

Para se tornar especialista em Python, não basta conhecer tipos. É preciso entender que tudo em Python é objeto e que variáveis são referências.

### Variável não é caixa, é nome

```python
a = [1, 2, 3]
b = a

b.append(4)

print(a)  # [1, 2, 3, 4]
```

`a` e `b` apontam para o mesmo objeto.

Para copiar:

```python
original = [1, 2, 3]
copia = original.copy()
```

Para estruturas aninhadas:

```python
from copy import deepcopy

original = [{"nome": "Ana"}]
copia = deepcopy(original)
```

Use `deepcopy` com cuidado, pois pode ser caro e esconder design ruim.

### Mutabilidade

Mutáveis:

- `list`
- `dict`
- `set`
- objetos customizados por padrão

Imutáveis:

- `int`
- `float`
- `str`
- `tuple`
- `frozenset`

Exemplo:

```python
def adicionar_tag(tags: list[str], nova_tag: str) -> list[str]:
    tags.append(nova_tag)
    return tags
```

Essa função altera a lista original. Em APIs profissionais, deixe essa decisão explícita.

Versão sem mutar entrada:

```python
def com_tag_adicionada(tags: list[str], nova_tag: str) -> list[str]:
    return [*tags, nova_tag]
```

### Igualdade, identidade e hash

Objetos usados como chave de `dict` ou item de `set` precisam ser hashable.

```python
chaves = {
    ("BR", "SP"): "São Paulo",
}
```

Listas não podem ser chaves:

```python
# TypeError: unhashable type: 'list'
dados = {[1, 2]: "valor"}
```

Use tupla quando a chave for composta e imutável.

### Precisão numérica

`float` usa representação binária.

```python
print(0.1 + 0.2)  # 0.30000000000000004
```

Para dinheiro:

```python
from decimal import Decimal, ROUND_HALF_UP

valor = Decimal("10.00")
taxa = Decimal("0.075")
total = (valor * (Decimal("1") + taxa)).quantize(
    Decimal("0.01"),
    rounding=ROUND_HALF_UP,
)
```

Para ciência de dados, `float` normalmente é aceitável. Para financeiro, impostos e contabilidade, use `Decimal` ou inteiros em centavos.

### Desempacotamento avançado

```python
primeiro, *meio, ultimo = [1, 2, 3, 4, 5]
```

```python
config_padrao = {"timeout": 5, "retries": 3}
config_usuario = {"timeout": 10}

config = {**config_padrao, **config_usuario}
```

Em Python moderno:

```python
config = config_padrao | config_usuario
```

### Operador walrus

`:=` permite atribuir dentro de expressões.

```python
if (tamanho := len("python")) > 5:
    print(tamanho)
```

Use apenas quando melhorar clareza.

Exemplo útil:

```python
while (linha := input("Digite algo: ")) != "sair":
    print(linha.upper())
```

### Strings profissionais

Evite concatenação repetida em loop:

```python
partes = []

for item in itens:
    partes.append(str(item))

texto = ", ".join(partes)
```

Para representação de depuração:

```python
nome = "Ana"
print(f"{nome=}")  # nome='Ana'
```

### Constantes e sentinelas

Python não impede alteração de constantes, mas a convenção usa maiúsculas.

```python
TAXA_PADRAO = 0.10
```

Sentinela para diferenciar ausência de `None`:

```python
NAO_INFORMADO = object()

def buscar(valor=NAO_INFORMADO):
    if valor is NAO_INFORMADO:
        return "valor não informado"
    if valor is None:
        return "valor informado como None"
    return valor
```

---

## Armadilhas de Especialista

### Comparar booleano explicitamente

Evite:

```python
if ativo == True:
    ...
```

Prefira:

```python
if ativo:
    ...
```

### Usar tipo errado para o domínio

Nem todo número deve ser `float`. Nem todo registro deve ser `dict`. Nem toda sequência deve ser `list`.

Pergunte:

- precisa alterar?
- precisa preservar ordem?
- precisa remover duplicatas?
- precisa buscar rápido?
- precisa representar ausência?
- precisa de precisão decimal?

### Criar expressões compactas demais

Código proficiente não é o mais curto. É o que comunica intenção com precisão.

Ruim:

```python
ok = u and u.get("a") and u["a"] > 18 and not u.get("b")
```

Melhor:

```python
usuario_existe = usuario is not None
idade_suficiente = usuario_existe and usuario["idade"] > 18
nao_bloqueado = usuario_existe and not usuario.get("bloqueado", False)

ok = usuario_existe and idade_suficiente and nao_bloqueado
```

---

## Checklist de Proficiência

- Sei explicar diferença entre nome, referência e objeto.
- Sei prever efeitos de mutabilidade.
- Sei escolher `list`, `tuple`, `dict`, `set` e `frozenset`.
- Sei usar `Decimal` quando `float` não é adequado.
- Sei diferenciar `==` e `is`.
- Sei criar chaves compostas hashable.
- Sei escrever expressões claras sem compactação excessiva.
- Sei normalizar strings de forma segura.
- Sei usar desempacotamento, merge de dicionários e sentinelas.

---

## Ampliação de Proficiência

### O que você precisa explicar sem decorar

Você não precisa apenas saber escrever `idade = 30`. Você precisa explicar que `idade` é um nome ligado a um objeto `int`, que esse objeto é imutável e que uma nova atribuição troca a referência do nome.

```python
idade = 30
idade = idade + 1
```

O valor `30` não foi alterado. Um novo `int` foi criado e o nome `idade` passou a apontar para ele.

### Igualdade, identidade e mutabilidade

```python
a = [1, 2]
b = [1, 2]
c = a

print(a == b)  # mesmo conteúdo
print(a is b)  # objetos diferentes
print(a is c)  # mesmo objeto
```

Use `==` para comparar valor. Use `is` para identidade, principalmente com `None`, `True` e `False` quando fizer sentido.

### Precisão numérica

`float` é adequado para medidas, médias, gráficos e cálculos científicos aproximados. Para dinheiro, use `Decimal` quando centavos e arredondamento importam.

```python
from decimal import Decimal, ROUND_HALF_UP

valor = Decimal("10.005")
arredondado = valor.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
print(arredondado)
```

### Expressões legíveis

Evite empilhar operações em uma linha difícil de revisar.

```python
total = ((preco * quantidade) - desconto) * (1 + imposto)
```

Melhor:

```python
subtotal = preco * quantidade
total_com_desconto = subtotal - desconto
total = total_com_desconto * (1 + imposto)
```

Código proficiente favorece clareza antes de concisão.

### Mini-checklist de domínio

- Sei diferenciar valor, nome, objeto e tipo.
- Sei quando usar `float` e quando usar `Decimal`.
- Sei explicar `is` versus `==`.
- Sei prever valores truthy e falsy.
- Sei evitar nomes genéricos.
- Sei montar expressões intermediárias para melhorar leitura.

---

## Exercícios

1. Crie variáveis para nome, idade, cidade e saldo. Mostre uma mensagem formatada.
2. Converta uma entrada textual para número e calcule o dobro.
3. Normalize um email removendo espaços e convertendo para minúsculas.
4. Crie uma lista de produtos e adicione um novo item.
5. Crie um dicionário representando um usuário.
6. Remova duplicatas de uma lista usando `set`.
7. Compare `==` e `is` com duas listas iguais.
8. Crie uma expressão booleana para validar se um usuário pode acessar um sistema.
9. Use `Decimal` para somar dois valores monetários.
10. Reescreva nomes ruins de variáveis para nomes claros.

---

## Aprofundamento Complementar

### Modelo mental de objetos

Em Python, quase tudo é objeto: números, strings, funções, classes, módulos e exceções. Um nome não guarda diretamente o valor; ele referencia um objeto.

```python
a = [1, 2, 3]
b = a
b.append(4)

print(a)  # [1, 2, 3, 4]
```

`a` e `b` apontam para a mesma lista. Esse entendimento evita bugs com mutabilidade.

### Mutável versus imutável na prática

Imutáveis comuns: `int`, `float`, `str`, `tuple`, `frozenset`, `bool` e `None`.

Mutáveis comuns: `list`, `dict`, `set` e objetos de classes customizadas.

Use tipos imutáveis para representar valores estáveis. Use mutáveis quando a coleção precisa ser alterada.

### Cópia rasa e referência

```python
original = [[1, 2], [3, 4]]
copia = original.copy()
copia[0].append(99)

print(original)
```

A lista externa foi copiada, mas as listas internas continuam compartilhadas. Isso é cópia rasa. Para estruturas aninhadas, estude `copy.deepcopy`, mas use com critério.

### Escolhendo tipos básicos

- `list`: ordem importa e itens podem repetir.
- `tuple`: agrupamento fixo.
- `dict`: busca por chave.
- `set`: unicidade e pertinência.
- `str`: texto.
- `Decimal`: dinheiro e precisão decimal.
- `bool`: estados binários claros.

### Exercícios extras

1. Demonstre diferença entre cópia rasa e referência com listas.
2. Crie uma tabela comparando `list`, `tuple`, `dict` e `set`.
3. Escreva uma função que recebe texto e retorna uma versão normalizada.
4. Crie uma validação booleana com pelo menos três regras nomeadas.
5. Explique por escrito quando `float` pode ser perigoso.

---

## Consolidação: Tipos, Operadores e Coleções Essenciais

Esta seção resume os conceitos mínimos que todo iniciante precisa dominar antes de avançar.

### Tipos básicos

```python
idade = 30              # int
preco = 19.90          # float
nome = "Ana"           # str
ativo = True           # bool
```

Verificando tipos:

```python
print(type(idade))
print(type(preco))
print(type(nome))
print(type(ativo))
```

### Operadores aritméticos

```python
a = 10
b = 3

print(a + b)   # soma
print(a - b)   # subtração
print(a * b)   # multiplicação
print(a / b)   # divisão real
print(a // b)  # divisão inteira
print(a % b)   # resto
print(a ** b)  # potência
```

### Operadores relacionais

```python
print(a == b)  # igual
print(a != b)  # diferente
print(a > b)   # maior
print(a >= b)  # maior ou igual
print(a < b)   # menor
print(a <= b)  # menor ou igual
```

Operadores relacionais retornam `bool`.

### Operadores lógicos

```python
idade = 20
tem_documento = True
bloqueado = False

pode_entrar = idade >= 18 and tem_documento and not bloqueado
print(pode_entrar)
```

Use:

- `and` quando todas as condições precisam ser verdadeiras;
- `or` quando pelo menos uma condição basta;
- `not` para inverter uma condição.

### Coleções essenciais

Lista: ordenada, mutável, permite repetição.

```python
nomes = ["Ana", "Bia", "Carlos"]
nomes.append("Davi")
```

Tupla: ordenada, imutável, útil para pares ou registros simples.

```python
ponto = (10, 20)
x, y = ponto
```

Dicionário: mapeia chave para valor.

```python
usuario = {"id": 1, "nome": "Ana", "ativo": True}
print(usuario["nome"])
```

Conjunto: coleção sem duplicatas.

```python
ids = {1, 2, 2, 3}
print(ids)  # {1, 2, 3}
```

### Critério de escolha

- Use `list` para sequência editável.
- Use `tuple` para agrupamento fixo.
- Use `dict` para buscar por chave.
- Use `set` para remover duplicatas ou testar pertencimento.
