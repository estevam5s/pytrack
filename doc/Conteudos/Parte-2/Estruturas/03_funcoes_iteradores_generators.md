# Funções, Lambda, Comprehensions, Iteradores e Generators

Este arquivo cobre funções, argumentos, retorno, lambda functions, comprehensions, iteradores e generators. Esses recursos conectam fundamentos da linguagem com algoritmos expressivos e eficientes.

---

## Sumário

1. [Funções](#funções)
2. [Retorno](#retorno)
3. [Argumentos Posicionais e Nomeados](#argumentos-posicionais-e-nomeados)
4. [`*args` e `**kwargs`](#args-e-kwargs)
5. [Lambda Functions](#lambda-functions)
6. [Comprehensions](#comprehensions)
7. [Iteradores](#iteradores)
8. [Generators com Yield](#generators-com-yield)
9. [Pipelines Preguiçosos](#pipelines-preguiçosos)
10. [Boas Práticas](#boas-práticas)
11. [Exercícios](#exercícios)

---

## Funções

```python
def somar(a: int, b: int) -> int:
    return a + b
```

Funções devem ter responsabilidade clara.

```python
def normalizar_email(email: str) -> str:
    return email.strip().lower()
```

---

## Retorno

Sem `return`, a função retorna `None`.

```python
def logar(mensagem: str) -> None:
    print(mensagem)
```

Retorno múltiplo:

```python
def estatisticas(valores: list[float]) -> tuple[float, float]:
    return min(valores), max(valores)
```

Retorno antecipado:

```python
def primeiro_par(valores: list[int]) -> int | None:
    for valor in valores:
        if valor % 2 == 0:
            return valor
    return None
```

---

## Argumentos Posicionais e Nomeados

```python
def criar_usuario(nome: str, idade: int, ativo: bool = True) -> dict:
    return {"nome": nome, "idade": idade, "ativo": ativo}
```

Chamadas:

```python
criar_usuario("Ana", 30)
criar_usuario(nome="Bia", idade=25, ativo=False)
```

Parâmetros keyword-only:

```python
def buscar(nome: str, *, limite: int = 10, ativo: bool = True) -> list[str]:
    return [nome] * limite if ativo else []
```

Isso força clareza:

```python
buscar("Ana", limite=5, ativo=True)
```

---

## Args e Kwargs

`*args` recebe posicionais extras.

```python
def somar_todos(*numeros: int) -> int:
    return sum(numeros)
```

`**kwargs` recebe nomeados extras.

```python
def montar_url(base: str, **params: str) -> str:
    query = "&".join(f"{chave}={valor}" for chave, valor in params.items())
    return f"{base}?{query}" if query else base
```

Uso:

```python
url = montar_url("/usuarios", status="ativo", pagina="1")
```

Evite `*args/**kwargs` quando uma assinatura explícita comunica melhor o contrato.

---

## Lambda Functions

Lambda cria função pequena e anônima.

```python
dobrar = lambda x: x * 2
```

Uso idiomático com `sorted`:

```python
produtos = [
    {"nome": "Livro", "preco": 50},
    {"nome": "Curso", "preco": 200},
]

ordenados = sorted(produtos, key=lambda produto: produto["preco"])
```

Uso com `map`:

```python
quadrados = list(map(lambda x: x * x, [1, 2, 3]))
```

Em Python, comprehension costuma ser mais legível:

```python
quadrados = [x * x for x in [1, 2, 3]]
```

Evite lambdas complexas:

```python
def preco_com_desconto(produto: dict) -> float:
    return produto["preco"] * (1 - produto.get("desconto", 0))
```

---

## Comprehensions

List comprehension:

```python
pares = [numero for numero in range(20) if numero % 2 == 0]
```

Transformação:

```python
emails = [" ANA@EXEMPLO.COM ", "bia@exemplo.com"]
normalizados = [email.strip().lower() for email in emails]
```

Dict comprehension:

```python
nomes = ["Ana", "Bia", "Carlos"]
tamanhos = {nome: len(nome) for nome in nomes}
```

Set comprehension:

```python
palavras = ["Python", "python", "Dados"]
unicas = {palavra.lower() for palavra in palavras}
```

Generator expression:

```python
total = sum(numero * numero for numero in range(1_000_000))
```

---

## Iteradores

Iterável é algo que pode ser percorrido. Iterador é o objeto que entrega o próximo item.

```python
valores = [1, 2, 3]
iterador = iter(valores)

print(next(iterador))
print(next(iterador))
```

Classe iteradora:

```python
class Contador:
    def __init__(self, limite: int):
        self.limite = limite
        self.atual = 0

    def __iter__(self):
        return self

    def __next__(self):
        if self.atual >= self.limite:
            raise StopIteration
        self.atual += 1
        return self.atual
```

Uso:

```python
for numero in Contador(3):
    print(numero)
```

---

## Generators com Yield

Generators simplificam criação de iteradores.

```python
def contar_ate(limite: int):
    atual = 1
    while atual <= limite:
        yield atual
        atual += 1
```

Uso:

```python
for numero in contar_ate(3):
    print(numero)
```

Generator para arquivo:

```python
def linhas_nao_vazias(caminho: str):
    with open(caminho, encoding="utf-8") as arquivo:
        for linha in arquivo:
            linha = linha.strip()
            if linha:
                yield linha
```

`yield from`:

```python
def achatar(matriz: list[list[int]]):
    for linha in matriz:
        yield from linha
```

---

## Pipelines Preguiçosos

```python
def filtrar_ativos(usuarios):
    for usuario in usuarios:
        if usuario["ativo"]:
            yield usuario

def extrair_emails(usuarios):
    for usuario in usuarios:
        yield usuario["email"].strip().lower()

usuarios = [
    {"email": " ANA@EXEMPLO.COM ", "ativo": True},
    {"email": "bia@exemplo.com", "ativo": False},
]

emails = extrair_emails(filtrar_ativos(usuarios))

for email in emails:
    print(email)
```

Vantagens:

- economia de memória;
- composição;
- processamento sob demanda;
- adequado para arquivos grandes e streams.

---

## Boas Práticas

- Prefira funções pequenas e testáveis.
- Use lambdas apenas para expressões simples.
- Use comprehensions quando aumentarem clareza.
- Use generator expressions para agregações grandes.
- Use `yield` para fluxos grandes ou sob demanda.
- Separe transformação, filtro e saída.
- Evite esconder regras complexas dentro de comprehensions.

---

## Exercícios

1. Crie uma função com argumentos posicionais e nomeados.
2. Crie uma função com keyword-only parameters.
3. Use `*args` para calcular média.
4. Use `**kwargs` para montar query string.
5. Ordene dicionários com lambda.
6. Reescreva `map` com list comprehension.
7. Crie um iterador manual.
8. Crie um generator para ler linhas válidas.
9. Monte um pipeline com filtro e transformação.
10. Compare lista completa e generator expression.

