# Controle de Fluxo em Python: If, Match, For e While

Este guia cobre estruturas condicionais e de repetição em Python, começando pelo básico e avançando para padrões profissionais de tomada de decisão, iteração, validação e controle de loops.

---

## Sumário

1. [Objetivo](#objetivo)
2. [Condicionais com If](#condicionais-com-if)
3. [Elif e Else](#elif-e-else)
4. [Condições Compostas](#condições-compostas)
5. [Match Case](#match-case)
6. [For](#for)
7. [Range](#range)
8. [Enumerate](#enumerate)
9. [Zip](#zip)
10. [While](#while)
11. [Break, Continue e Else em Loops](#break-continue-e-else-em-loops)
12. [Loops Aninhados](#loops-aninhados)
13. [Padrões Profissionais](#padrões-profissionais)
14. [Nível Avançado: Fluxo Como Design de Regras](#nível-avançado-fluxo-como-design-de-regras)
15. [Armadilhas de Especialista](#armadilhas-de-especialista)
16. [Checklist de Proficiência](#checklist-de-proficiência)
17. [Exercícios](#exercícios)

---

## Objetivo

Controle de fluxo permite que o programa decida e repita ações.

Você deve dominar:

- seleção de caminhos com `if`;
- múltiplos casos com `match`;
- repetição com `for`;
- repetição condicional com `while`;
- interrupção controlada com `break`;
- salto de iteração com `continue`;
- iteração segura e legível.

---

## Condicionais com If

```python
idade = 20

if idade >= 18:
    print("Maior de idade")
```

A condição precisa resultar em um valor verdadeiro ou falso.

```python
saldo = 100
valor_compra = 80

if saldo >= valor_compra:
    print("Compra aprovada")
```

---

## Elif e Else

```python
nota = 8.5

if nota >= 9:
    conceito = "A"
elif nota >= 7:
    conceito = "B"
elif nota >= 5:
    conceito = "C"
else:
    conceito = "D"

print(conceito)
```

Use `elif` quando as condições são mutuamente relacionadas.

---

## Condições Compostas

```python
idade = 25
tem_convite = True

if idade >= 18 and tem_convite:
    print("Entrada liberada")
```

```python
is_admin = False
is_owner = True

if is_admin or is_owner:
    print("Pode editar")
```

```python
bloqueado = False

if not bloqueado:
    print("Acesso permitido")
```

Evite condições muito longas:

```python
idade_ok = idade >= 18
documento_ok = documento is not None
pagamento_ok = status_pagamento == "aprovado"

if idade_ok and documento_ok and pagamento_ok:
    print("Cadastro aprovado")
```

---

## Match Case

`match` é útil para comparar estruturas e casos explícitos.

```python
comando = "listar"

match comando:
    case "criar":
        print("Criando registro")
    case "listar":
        print("Listando registros")
    case "sair":
        print("Encerrando")
    case _:
        print("Comando desconhecido")
```

### Match com múltiplos valores

```python
status = 404

match status:
    case 200 | 201:
        print("Sucesso")
    case 400 | 422:
        print("Erro de validação")
    case 401 | 403:
        print("Erro de autorização")
    case 404:
        print("Não encontrado")
    case _:
        print("Erro inesperado")
```

### Match com dicionários

```python
evento = {"tipo": "usuario_criado", "id": 10}

match evento:
    case {"tipo": "usuario_criado", "id": user_id}:
        print(f"Usuário criado: {user_id}")
    case {"tipo": "usuario_removido", "id": user_id}:
        print(f"Usuário removido: {user_id}")
    case _:
        print("Evento ignorado")
```

Use `match` quando ele deixa a intenção mais clara que uma sequência longa de `if/elif`.

---

## For

`for` percorre iteráveis.

```python
nomes = ["Ana", "Bia", "Carlos"]

for nome in nomes:
    print(nome)
```

Funciona com strings:

```python
for letra in "Python":
    print(letra)
```

Funciona com dicionários:

```python
usuario = {"nome": "Ana", "idade": 30}

for chave, valor in usuario.items():
    print(chave, valor)
```

---

## Range

```python
for numero in range(5):
    print(numero)
```

Gera `0, 1, 2, 3, 4`.

Com início e fim:

```python
for numero in range(1, 6):
    print(numero)
```

Com passo:

```python
for numero in range(0, 10, 2):
    print(numero)
```

---

## Enumerate

Use `enumerate` quando precisar do índice.

```python
nomes = ["Ana", "Bia", "Carlos"]

for indice, nome in enumerate(nomes, start=1):
    print(indice, nome)
```

Evite:

```python
for i in range(len(nomes)):
    print(i, nomes[i])
```

Prefira `enumerate` para legibilidade.

---

## Zip

Use `zip` para percorrer sequências em paralelo.

```python
nomes = ["Ana", "Bia"]
notas = [9.5, 8.0]

for nome, nota in zip(nomes, notas):
    print(nome, nota)
```

Criando dicionário:

```python
usuarios = dict(zip(nomes, notas))
```

---

## While

`while` repete enquanto a condição for verdadeira.

```python
contador = 0

while contador < 5:
    print(contador)
    contador += 1
```

Use `while` quando não souber previamente quantas repetições serão necessárias.

Exemplo:

```python
tentativas = 0
senha = ""

while senha != "python" and tentativas < 3:
    senha = input("Senha: ")
    tentativas += 1
```

---

## Break, Continue e Else em Loops

### Break

Interrompe o loop.

```python
for numero in [1, 3, 5, 8, 9]:
    if numero % 2 == 0:
        print("Primeiro par:", numero)
        break
```

### Continue

Pula para a próxima iteração.

```python
for numero in range(10):
    if numero % 2 != 0:
        continue
    print(numero)
```

### Else em loops

Executa se o loop terminar sem `break`.

```python
for numero in [1, 3, 5]:
    if numero % 2 == 0:
        print("par encontrado")
        break
else:
    print("nenhum par encontrado")
```

---

## Loops Aninhados

```python
matriz = [
    [1, 2, 3],
    [4, 5, 6],
]

for linha in matriz:
    for valor in linha:
        print(valor)
```

Loops aninhados podem gerar custo quadrático.

```python
nomes = ["Ana", "Bia", "Carlos"]

for a in nomes:
    for b in nomes:
        print(a, b)
```

Se a lista tem `n` itens, esse padrão executa `n * n` combinações.

---

## Padrões Profissionais

### Validação com retorno antecipado

```python
def pode_comprar(idade, saldo, valor):
    if idade < 18:
        return False
    if saldo < valor:
        return False
    return True
```

Esse estilo reduz aninhamento.

### Tabela de decisão simples

```python
def calcular_desconto(tipo_cliente):
    descontos = {
        "comum": 0.0,
        "premium": 0.10,
        "vip": 0.20,
    }

    return descontos.get(tipo_cliente, 0.0)
```

### Evite flags confusas

Ruim:

```python
encontrou = False

for item in itens:
    if item == alvo:
        encontrou = True

if encontrou:
    print("encontrado")
```

Melhor:

```python
if alvo in itens:
    print("encontrado")
```

---

## Nível Avançado: Fluxo Como Design de Regras

Controle de fluxo profissional não é apenas escolher entre `if` e `for`. É modelar regras de forma legível, testável e segura.

### Reduzindo aninhamento com guard clauses

Ruim:

```python
def aprovar_pedido(pedido):
    if pedido is not None:
        if pedido["status"] == "novo":
            if pedido["total"] > 0:
                return True
    return False
```

Melhor:

```python
def aprovar_pedido(pedido):
    if pedido is None:
        return False
    if pedido["status"] != "novo":
        return False
    if pedido["total"] <= 0:
        return False
    return True
```

### Tabela de estratégia

Substitui cadeias longas de `if/elif` quando cada caso chama uma ação.

```python
def criar(payload):
    return f"criando {payload}"

def atualizar(payload):
    return f"atualizando {payload}"

def remover(payload):
    return f"removendo {payload}"

ACOES = {
    "criar": criar,
    "atualizar": atualizar,
    "remover": remover,
}

def executar(comando, payload):
    acao = ACOES.get(comando)
    if acao is None:
        raise ValueError(f"comando inválido: {comando}")
    return acao(payload)
```

### Match com padrões estruturais

```python
def processar_evento(evento):
    match evento:
        case {"tipo": "pagamento_aprovado", "pedido_id": int(pedido_id), "valor": valor} if valor > 0:
            return f"aprovar pedido {pedido_id}"
        case {"tipo": "pagamento_recusado", "pedido_id": int(pedido_id), "motivo": motivo}:
            return f"recusar pedido {pedido_id}: {motivo}"
        case {"tipo": tipo}:
            return f"tipo ignorado: {tipo}"
        case _:
            raise ValueError("evento inválido")
```

`match` fica poderoso quando valida forma e extrai dados ao mesmo tempo.

### Iteração preguiçosa

Para grandes volumes, não materialize listas sem necessidade.

```python
def linhas_validas(linhas):
    for linha in linhas:
        linha = linha.strip()
        if linha:
            yield linha

def processar(caminho):
    with open(caminho, encoding="utf-8") as arquivo:
        for linha in linhas_validas(arquivo):
            print(linha)
```

### Controle de fluxo com `any` e `all`

```python
permissoes = {"ler", "editar"}

tem_permissao_minima = any(
    permissao in permissoes
    for permissao in ["admin", "editar"]
)
```

```python
campos_obrigatorios = ["nome", "email", "idade"]

cadastro_valido = all(
    campo in payload and payload[campo]
    for campo in campos_obrigatorios
)
```

### Evitando loops quando a linguagem já expressa intenção

Ruim:

```python
total = 0
for item in itens:
    total += item["valor"]
```

Melhor:

```python
total = sum(item["valor"] for item in itens)
```

Ruim:

```python
nomes = []
for usuario in usuarios:
    if usuario["ativo"]:
        nomes.append(usuario["nome"])
```

Melhor:

```python
nomes = [
    usuario["nome"]
    for usuario in usuarios
    if usuario["ativo"]
]
```

### `while` profissional com limite e estado

Loops indefinidos precisam de condição de saída clara.

```python
def tentar_conectar(cliente, max_tentativas=3):
    tentativa = 1

    while tentativa <= max_tentativas:
        if cliente.conectar():
            return True
        tentativa += 1

    return False
```

Em sistemas reais, adicione log, backoff e exceções específicas.

---

## Armadilhas de Especialista

### Condição com efeito colateral escondido

Evite:

```python
if usuario.ativar() and usuario.enviar_email():
    ...
```

Prefira separar:

```python
ativado = usuario.ativar()
email_enviado = usuario.enviar_email()

if ativado and email_enviado:
    ...
```

### `match` como substituto automático de `if`

Use `match` para padrões estruturais. Para condições booleanas simples, `if` é mais direto.

### `continue` em excesso

`continue` é útil, mas muitos saltos podem dificultar leitura. Extraia funções quando o loop acumular muitas regras.

---

## Checklist de Proficiência

- Sei usar guard clauses para reduzir aninhamento.
- Sei escolher entre `if`, `match`, tabela de estratégia e polimorfismo.
- Sei usar `any`, `all`, `sum`, `min`, `max` e comprehensions para expressar intenção.
- Sei escrever loops com condição de saída segura.
- Sei evitar efeitos colaterais escondidos em condições.
- Sei analisar custo de loops aninhados.
- Sei criar fluxos testáveis com funções pequenas.

---

## Ampliação de Proficiência

### Fluxo de controle como regra de negócio

Condicionais não servem apenas para "fazer o programa escolher". Elas representam regras. Por isso, nomes intermediários tornam o código mais auditável.

```python
idade_ok = idade >= 18
cadastro_ativo = status == "ativo"
limite_disponivel = saldo >= valor

if idade_ok and cadastro_ativo and limite_disponivel:
    aprovar_compra()
```

Isso é mais fácil de revisar do que uma condição longa com tudo embutido.

### Evitando aninhamento excessivo

Ruim:

```python
if usuario:
    if usuario["ativo"]:
        if usuario["email_confirmado"]:
            enviar_email(usuario)
```

Melhor:

```python
if not usuario:
    return

if not usuario["ativo"]:
    return

if not usuario["email_confirmado"]:
    return

enviar_email(usuario)
```

Retornos antecipados reduzem indentação e deixam os bloqueios explícitos.

### Escolhendo entre `if`, `match` e dicionário de despacho

Use `if/elif` para regras com comparações, intervalos e condições compostas.

Use `match` para estruturas bem definidas.

Use dicionário de despacho quando comandos simples chamam funções.

```python
def criar():
    print("criando")

def listar():
    print("listando")

comandos = {
    "criar": criar,
    "listar": listar,
}

funcao = comandos.get(comando)
if funcao is None:
    raise ValueError("comando inválido")

funcao()
```

### Loop profissional

Um loop bom deixa claro:

- qual coleção percorre;
- qual transformação faz;
- quando para;
- o que acontece com itens inválidos;
- se acumula, filtra ou executa efeito colateral.

### Mini-checklist de domínio

- Sei reduzir condições longas com nomes intermediários.
- Sei evitar aninhamento profundo.
- Sei escolher entre `if`, `match` e despacho por dicionário.
- Sei usar `break`, `continue` e `else` sem confundir leitura.
- Sei explicar quando um `while` pode virar loop infinito.

---

## Exercícios

1. Classifique uma idade em criança, adolescente, adulto ou idoso.
2. Crie uma calculadora simples usando `match`.
3. Percorra uma lista de preços e calcule o total.
4. Use `enumerate` para numerar itens de um menu.
5. Use `zip` para unir nomes e emails.
6. Crie um `while` que simule tentativas de login.
7. Encontre o primeiro número divisível por 7 em uma lista.
8. Use `for/else` para verificar se um número é primo.
9. Percorra uma matriz e some todos os valores.
10. Reescreva uma condição aninhada usando retornos antecipados.

---

## Aprofundamento Complementar

### Condições como política explícita

Em sistemas reais, condicionais representam políticas: autorização, desconto, aprovação, bloqueio, prioridade ou roteamento.

```python
def pode_aprovar_compra(saldo: float, valor: float, bloqueado: bool) -> bool:
    saldo_suficiente = saldo >= valor
    conta_liberada = not bloqueado
    return saldo_suficiente and conta_liberada
```

Colocar regras em funções nomeadas melhora leitura e teste.

### Evitando booleanos misteriosos

Evite:

```python
processar(True, False)
```

Prefira argumentos nomeados:

```python
processar(enviar_email=True, simular=False)
```

Ou separe comportamentos em funções diferentes quando o booleano muda muito o fluxo.

### Loops com acumuladores

```python
total = 0

for item in itens:
    if item["ativo"]:
        total += item["valor"]
```

Esse padrão aparece em somas, filtros, contagens e agregações.

### Loops com validação

```python
erros = []

for linha, registro in enumerate(registros, start=1):
    if "email" not in registro:
        erros.append(f"linha {linha}: email ausente")
```

Em validações profissionais, acumular erros pode ser melhor do que parar no primeiro problema.

### Exercícios extras

1. Crie uma função `pode_fazer_login` com pelo menos quatro regras.
2. Reescreva uma condição longa usando variáveis intermediárias.
3. Valide uma lista de usuários acumulando mensagens de erro.
4. Use `match` para tratar comandos de uma CLI fictícia.
5. Compare duas soluções: uma com `if/elif` e outra com dicionário de despacho.
