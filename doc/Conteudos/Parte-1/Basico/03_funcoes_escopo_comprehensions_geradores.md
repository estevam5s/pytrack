# Funções, Escopo, List Comprehensions e Geradores

Este guia aprofunda funções em Python e mostra como escrever código reutilizável, expressivo e eficiente com escopo bem controlado, comprehensions e geradores.

---

## Sumário

1. [Objetivo](#objetivo)
2. [Funções Básicas](#funções-básicas)
3. [Parâmetros e Retorno](#parâmetros-e-retorno)
4. [Argumentos Nomeados e Padrões](#argumentos-nomeados-e-padrões)
5. [Args e Kwargs](#args-e-kwargs)
6. [Escopo de Variáveis](#escopo-de-variáveis)
7. [Closures](#closures)
8. [Funções Lambda](#funções-lambda)
9. [List Comprehensions](#list-comprehensions)
10. [Dict e Set Comprehensions](#dict-e-set-comprehensions)
11. [Geradores com Yield](#geradores-com-yield)
12. [Generator Expressions](#generator-expressions)
13. [Coroutines e Funções Assíncronas](#coroutines-e-funções-assíncronas)
14. [Boas Práticas](#boas-práticas)
15. [Nível Avançado: Design de Funções Profissionais](#nível-avançado-design-de-funções-profissionais)
16. [Armadilhas de Especialista](#armadilhas-de-especialista)
17. [Checklist de Proficiência](#checklist-de-proficiência)
18. [Exercícios](#exercícios)

---

## Objetivo

Você deve aprender a:

- criar funções pequenas e reutilizáveis;
- separar entrada, processamento e saída;
- controlar escopo;
- evitar efeitos colaterais desnecessários;
- usar comprehensions quando aumentarem clareza;
- usar geradores para processar dados sob demanda.

---

## Funções Básicas

```python
def saudacao():
    print("Olá")

saudacao()
```

Funções devem ter responsabilidade clara.

```python
def calcular_total(preco, quantidade):
    return preco * quantidade
```

---

## Parâmetros e Retorno

```python
def somar(a, b):
    return a + b

resultado = somar(2, 3)
```

Uma função sem `return` retorna `None`.

```python
def registrar_log(mensagem):
    print(mensagem)

retorno = registrar_log("iniciado")
print(retorno)  # None
```

Retornando múltiplos valores:

```python
def dividir(a, b):
    quociente = a // b
    resto = a % b
    return quociente, resto

q, r = dividir(10, 3)
```

---

## Argumentos Nomeados e Padrões

```python
def criar_usuario(nome, ativo=True):
    return {"nome": nome, "ativo": ativo}
```

Chamadas:

```python
criar_usuario("Ana")
criar_usuario("Bia", ativo=False)
```

Evite valores mutáveis como padrão:

```python
def adicionar_item(item, lista=[]):
    lista.append(item)
    return lista
```

Correto:

```python
def adicionar_item(item, lista=None):
    if lista is None:
        lista = []
    lista.append(item)
    return lista
```

---

## Args e Kwargs

`*args` recebe argumentos posicionais extras.

```python
def somar_todos(*numeros):
    return sum(numeros)
```

`**kwargs` recebe argumentos nomeados extras.

```python
def criar_config(**opcoes):
    return opcoes

config = criar_config(debug=True, porta=8000)
```

Use com moderação. Em APIs públicas, parâmetros explícitos costumam ser melhores.

---

## Escopo de Variáveis

Variáveis criadas dentro da função são locais.

```python
def exemplo():
    mensagem = "local"
    return mensagem
```

Variáveis externas podem ser lidas:

```python
taxa = 0.10

def calcular_taxa(valor):
    return valor * taxa
```

Mas modificar variável global exige `global`, que deve ser evitado em código profissional.

```python
contador = 0

def incrementar():
    global contador
    contador += 1
```

Prefira retornar novo valor:

```python
def incrementar(contador):
    return contador + 1
```

### Regra LEGB

Python procura nomes nesta ordem:

1. Local
2. Enclosing
3. Global
4. Built-in

---

## Closures

Closure é uma função que lembra variáveis do escopo onde foi criada.

```python
def criar_multiplicador(fator):
    def multiplicar(valor):
        return valor * fator
    return multiplicar

dobrar = criar_multiplicador(2)
print(dobrar(10))
```

Útil para configurar comportamento.

---

## Funções Lambda

Lambda cria função pequena e anônima.

```python
quadrado = lambda x: x * x
```

Uso comum com `sorted`:

```python
pessoas = [
    {"nome": "Ana", "idade": 30},
    {"nome": "Bia", "idade": 20},
]

ordenadas = sorted(pessoas, key=lambda pessoa: pessoa["idade"])
```

Evite lambdas complexas. Se tiver lógica demais, use `def`.

---

## List Comprehensions

Forma expressiva de criar listas.

```python
quadrados = [numero ** 2 for numero in range(10)]
```

Com filtro:

```python
pares = [numero for numero in range(20) if numero % 2 == 0]
```

Transformando dados:

```python
nomes = [" ana ", " BIA ", "Carlos "]
normalizados = [nome.strip().title() for nome in nomes]
```

Evite comprehensions muito longas:

```python
# difícil de ler
resultado = [x * 2 for x in valores if x > 10 if x % 2 == 0]
```

Se a regra crescer, escreva função:

```python
def deve_processar(valor):
    return valor > 10 and valor % 2 == 0

resultado = [valor * 2 for valor in valores if deve_processar(valor)]
```

---

## Dict e Set Comprehensions

### Dict comprehension

```python
nomes = ["Ana", "Bia", "Carlos"]
tamanhos = {nome: len(nome) for nome in nomes}
```

### Set comprehension

```python
palavras = ["Python", "python", "Dados"]
unicas = {palavra.lower() for palavra in palavras}
```

---

## Geradores com Yield

Geradores produzem valores sob demanda.

```python
def contar_ate(n):
    atual = 1
    while atual <= n:
        yield atual
        atual += 1

for numero in contar_ate(3):
    print(numero)
```

Vantagem: não precisa guardar tudo na memória.

Exemplo com arquivo:

```python
def ler_linhas_validas(caminho):
    with open(caminho, encoding="utf-8") as arquivo:
        for linha in arquivo:
            linha = linha.strip()
            if linha:
                yield linha
```

### Pipeline com geradores

```python
def somente_pares(numeros):
    for numero in numeros:
        if numero % 2 == 0:
            yield numero

def dobrar(numeros):
    for numero in numeros:
        yield numero * 2

resultado = dobrar(somente_pares(range(10)))

for valor in resultado:
    print(valor)
```

---

## Generator Expressions

Parecem list comprehensions, mas usam parênteses e produzem sob demanda.

```python
quadrados = (numero ** 2 for numero in range(1_000_000))
```

Útil com funções agregadoras:

```python
total = sum(numero ** 2 for numero in range(1000))
```

---

## Coroutines e Funções Assíncronas

Uma coroutine é uma unidade de execução que pode pausar e retomar de forma cooperativa. Em Python moderno, normalmente aparece com `async def` e `await`.

```python
import asyncio


async def buscar_usuario(user_id: int) -> dict[str, int | str]:
    await asyncio.sleep(1)
    return {"id": user_id, "nome": "Ana"}


async def main() -> None:
    usuario = await buscar_usuario(1)
    print(usuario)


asyncio.run(main())
```

Diferença importante:

- generator usa `yield` para produzir valores sob demanda;
- coroutine usa `await` para aguardar outra operação assíncrona;
- async é útil principalmente para I/O concorrente, como rede, banco e filas;
- CPU-bound em Python puro não fica automaticamente mais rápido por usar `async`.

Também existem async generators:

```python
async def eventos():
    for i in range(3):
        await asyncio.sleep(0.1)
        yield {"id": i}
```

Use coroutines quando o ecossistema usado oferece bibliotecas assíncronas. Misturar código bloqueante dentro de `async def` pode travar o event loop.

---

## Boas Práticas

- Funções devem ter nomes com verbo: `calcular_total`, `validar_email`.
- Evite funções que fazem muitas coisas.
- Retorne valores em vez de modificar globais.
- Use parâmetros explícitos.
- Evite `*args` e `**kwargs` quando a assinatura puder ser clara.
- Use comprehensions para transformações simples.
- Use geradores para fluxos grandes ou infinitos.
- Use coroutines para I/O concorrente quando as bibliotecas forem assíncronas.
- Não esconda lógica complexa em lambda.

---

## Nível Avançado: Design de Funções Profissionais

Funções são a menor unidade de design em Python. Especialistas escrevem funções com contrato claro, baixo acoplamento e comportamento previsível.

### Contrato explícito

```python
def calcular_frete(peso_kg: float, distancia_km: float, taxa_base: float = 10.0) -> float:
    if peso_kg <= 0:
        raise ValueError("peso_kg deve ser positivo")
    if distancia_km <= 0:
        raise ValueError("distancia_km deve ser positiva")

    return taxa_base + peso_kg * 1.5 + distancia_km * 0.25
```

Contrato:

- recebe peso positivo;
- recebe distância positiva;
- retorna custo numérico;
- falha cedo se entrada inválida.

### Separando cálculo de I/O

Ruim:

```python
def calcular_e_mostrar_total(itens):
    total = sum(item["preco"] for item in itens)
    print(total)
```

Melhor:

```python
def calcular_total(itens):
    return sum(item["preco"] for item in itens)

def mostrar_total(total):
    print(f"Total: R$ {total:.2f}")
```

Isso facilita testes.

### Parâmetros somente nomeados

```python
def criar_usuario(nome: str, *, ativo: bool = True, admin: bool = False) -> dict:
    return {"nome": nome, "ativo": ativo, "admin": admin}
```

Chamadas ficam explícitas:

```python
criar_usuario("Ana", ativo=True, admin=False)
```

### Parâmetros somente posicionais

Útil em APIs de baixo nível ou compatibilidade.

```python
def dividir(a, b, /):
    return a / b
```

Na maioria dos projetos, use com moderação.

### Funções puras

Função pura:

- depende apenas dos argumentos;
- não altera estado externo;
- não faz I/O;
- retorna sempre o mesmo resultado para a mesma entrada.

```python
def aplicar_desconto(valor: float, percentual: float) -> float:
    return valor * (1 - percentual)
```

Funções puras são mais fáceis de testar, paralelizar e reutilizar.

### Closures para configuração leve

```python
def criar_validador_tamanho(minimo: int, maximo: int):
    def validar(texto: str) -> bool:
        return minimo <= len(texto) <= maximo
    return validar

validar_senha = criar_validador_tamanho(8, 64)
```

### `functools.partial`

```python
from functools import partial

def aplicar_taxa(valor: float, taxa: float) -> float:
    return valor * (1 + taxa)

aplicar_taxa_padrao = partial(aplicar_taxa, taxa=0.10)
```

Use quando quiser especializar uma função sem criar outra manualmente.

### Memoização

```python
from functools import lru_cache

@lru_cache(maxsize=1024)
def fibonacci(n: int) -> int:
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)
```

Memoização é útil quando:

- a função é pura;
- há chamadas repetidas;
- o custo de cálculo é alto;
- a memória extra é aceitável.

### Geradores para pipelines

```python
def ler_eventos(caminho):
    with open(caminho, encoding="utf-8") as arquivo:
        for linha in arquivo:
            yield linha.strip()

def filtrar_eventos_validos(eventos):
    for evento in eventos:
        if evento:
            yield evento

def transformar_eventos(eventos):
    for evento in eventos:
        yield evento.upper()

def pipeline(caminho):
    eventos = ler_eventos(caminho)
    eventos = filtrar_eventos_validos(eventos)
    eventos = transformar_eventos(eventos)
    return eventos
```

Esse padrão processa sob demanda e escala melhor para arquivos grandes.

### `yield from`

```python
def achatar(matriz):
    for linha in matriz:
        yield from linha
```

Equivale a iterar e fazer `yield` de cada item.

---

## Armadilhas de Especialista

### Função com muitos parâmetros

Se uma função recebe muitos parâmetros, talvez exista um objeto de configuração ou entidade escondida.

```python
from dataclasses import dataclass

@dataclass(frozen=True)
class RegraFrete:
    taxa_base: float
    custo_por_kg: float
    custo_por_km: float

def calcular_frete(peso_kg: float, distancia_km: float, regra: RegraFrete) -> float:
    return regra.taxa_base + peso_kg * regra.custo_por_kg + distancia_km * regra.custo_por_km
```

### Retornos inconsistentes

Evite:

```python
def buscar(id):
    if id == 1:
        return {"nome": "Ana"}
    return False
```

Prefira:

```python
def buscar(id):
    if id == 1:
        return {"nome": "Ana"}
    return None
```

### Comprehension complexa demais

Se precisa de múltiplas condições, transformação complexa e tratamento de erro, use loop tradicional.

---

## Checklist de Proficiência

- Sei criar funções com contrato explícito.
- Sei separar cálculo de I/O.
- Sei usar parâmetros nomeados para clareza.
- Sei evitar valores mutáveis como padrão.
- Sei aplicar closures, partial e memoização quando fazem sentido.
- Sei usar geradores para economia de memória.
- Sei diferenciar generator, coroutine e async generator.
- Sei evitar funções grandes, retornos inconsistentes e efeitos colaterais ocultos.

---

## Ampliação de Proficiência

### Função como contrato

Uma função profissional deixa claro:

- o que recebe;
- o que retorna;
- quais erros pode levantar;
- se altera algo fora dela;
- quais premissas espera.

```python
def calcular_total(preco: float, quantidade: int) -> float:
    if preco < 0:
        raise ValueError("preco não pode ser negativo")
    if quantidade < 0:
        raise ValueError("quantidade não pode ser negativa")
    return preco * quantidade
```

### Separação por responsabilidade

Evite funções que fazem tudo:

```python
def processar():
    dados = input("Dados: ")
    resultado = dados.upper()
    print(resultado)
```

Melhor:

```python
def normalizar(texto: str) -> str:
    return texto.strip().upper()

def main() -> None:
    dados = input("Dados: ")
    print(normalizar(dados))
```

### Comprehension ou loop comum?

Use comprehension para transformação simples.

```python
nomes = [nome.strip().title() for nome in nomes_brutos]
```

Use loop comum quando houver:

- muitas etapas;
- tratamento de erro;
- logs;
- regras condicionais complexas;
- efeitos colaterais.

### Geradores para fluxo grande

Geradores são úteis quando não é necessário carregar tudo na memória.

```python
def linhas_validas(caminho):
    with open(caminho, encoding="utf-8") as arquivo:
        for linha in arquivo:
            linha = linha.strip()
            if linha:
                yield linha
```

### Mini-checklist de domínio

- Sei criar funções pequenas e nomeadas pelo comportamento.
- Sei evitar parâmetros mutáveis como padrão.
- Sei explicar LEGB.
- Sei escolher entre comprehension e loop.
- Sei usar gerador quando o processamento pode ser sob demanda.
- Sei separar entrada, regra e saída.

---

## Exercícios

1. Crie uma função que calcule desconto.
2. Crie uma função que normalize emails.
3. Crie uma função com parâmetro padrão seguro.
4. Use `*args` para somar números.
5. Use `**kwargs` para montar uma configuração.
6. Demonstre escopo local e global.
7. Crie um closure de multiplicador.
8. Ordene uma lista de dicionários com `lambda`.
9. Use list comprehension para filtrar pares.
10. Use dict comprehension para mapear nomes para tamanhos.
11. Crie um gerador que produza números ímpares.
12. Crie um pipeline com dois geradores.
13. Crie uma coroutine simples com `async def` e execute com `asyncio.run`.

---

## Aprofundamento Complementar

### Coesão de função

Uma função coesa faz uma coisa em um nível de abstração. Se uma função lê arquivo, valida dados, calcula totais e imprime relatório, ela provavelmente tem responsabilidades demais.

```python
def calcular_total_itens(itens: list[dict]) -> float:
    return sum(item["preco"] * item["quantidade"] for item in itens)
```

Essa função calcula. Ela não lê arquivo nem imprime.

### Parâmetros demais

Muitos parâmetros podem indicar que existe um conceito faltando.

```python
def criar_usuario(nome, email, idade, cidade, ativo, admin):
    ...
```

Pode ser melhor agrupar dados em dicionário, `TypedDict`, `dataclass` ou objeto, dependendo do nível do projeto.

### Retornos previsíveis

Evite funções que retornam tipos muito diferentes.

```python
def buscar(user_id):
    if user_id == 1:
        return {"nome": "Ana"}
    return None
```

Retornar `dict | None` é mais previsível do que alternar entre dicionário, `False`, string ou lista vazia sem critério.

### Geradores e memória

Geradores são importantes quando os dados são grandes ou infinitos.

```python
def numeros_pares():
    numero = 0
    while True:
        yield numero
        numero += 2
```

Eles produzem um valor por vez.

### Exercícios extras

1. Pegue uma função grande e divida em três funções menores.
2. Crie uma função que retorne `None` quando não encontrar um item.
3. Crie um gerador que leia linhas válidas de uma lista.
4. Substitua uma comprehension complexa por loop comum.
5. Escreva docstring para três funções.

---

## Consolidação: Iteráveis, Iteradores e Generators

### Iterável

Iterável é qualquer objeto que pode ser percorrido com `for`.

Exemplos:

```python
for letra in "Python":
    print(letra)

for numero in [1, 2, 3]:
    print(numero)

for chave in {"nome": "Ana", "idade": 30}:
    print(chave)
```

Strings, listas, tuplas, dicionários, conjuntos, arquivos e generators são iteráveis.

### Iterador

Iterador é o objeto que entrega um item por vez com `next`.

```python
numeros = [10, 20, 30]
iterador = iter(numeros)

print(next(iterador))
print(next(iterador))
print(next(iterador))
```

Quando os itens acabam, Python levanta `StopIteration`. O `for` trata isso automaticamente.

### Generator function

Função geradora usa `yield`.

```python
def contar_ate(n):
    atual = 1
    while atual <= n:
        yield atual
        atual += 1

for numero in contar_ate(3):
    print(numero)
```

`yield` pausa a função e continua de onde parou na próxima iteração.

### Generator expression

Parecida com list comprehension, mas produz valores sob demanda.

```python
quadrados = (numero ** 2 for numero in range(1_000_000))
print(next(quadrados))
```

Use generator expression quando não precisa guardar todos os valores na memória.

### Quando usar cada um

- List comprehension: resultado pequeno ou precisa da lista completa.
- Generator expression: sequência grande ou consumo sob demanda.
- Generator function: lógica de produção tem várias etapas.
- Iterador manual: quando precisa controlar explicitamente `next`.

### Exercícios extras de iteradores

1. Use `iter` e `next` em uma lista.
2. Crie um generator que produz números pares.
3. Crie uma generator expression para quadrados.
4. Leia um arquivo linha a linha como iterável.
5. Explique por que generators economizam memória.
