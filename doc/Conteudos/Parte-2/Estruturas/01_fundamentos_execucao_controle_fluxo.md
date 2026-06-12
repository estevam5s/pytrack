# Fundamentos, Execução e Controle de Fluxo em Python

Este arquivo cobre o começo da jornada: primeiro programa, tipos básicos, variáveis, comentários, operadores, entrada/saída, shebang, execução no terminal e estruturas de controle.

---

## Sumário

1. [Primeiro Programa](#primeiro-programa)
2. [Execução no Terminal](#execução-no-terminal)
3. [Shebang](#shebang)
4. [Tipos Básicos](#tipos-básicos)
5. [Variáveis e Comentários](#variáveis-e-comentários)
6. [Operadores Aritméticos](#operadores-aritméticos)
7. [Operadores Relacionais](#operadores-relacionais)
8. [Operadores Lógicos](#operadores-lógicos)
9. [Entrada e Saída](#entrada-e-saída)
10. [If, Elif e Else](#if-elif-e-else)
11. [While](#while)
12. [For](#for)
13. [Break e Continue](#break-e-continue)
14. [Padrões Profissionais](#padrões-profissionais)
15. [Exercícios](#exercícios)

---

## Primeiro Programa

```python
print("Olá, Python!")
```

Salve como `main.py` e execute:

```bash
python main.py
```

Programa com função principal:

```python
def main() -> None:
    print("Olá, Python!")


main()
```

Conforme o projeto cresce, prefira encapsular o fluxo em funções.

---

## Execução no Terminal

Ver versão:

```bash
python --version
```

Executar arquivo:

```bash
python app.py
```

Executar módulo:

```bash
python -m pacote.modulo
```

Executar comando curto:

```bash
python -c "print(2 + 2)"
```

Modo interativo:

```bash
python
```

Boas práticas:

- use ambiente virtual por projeto;
- execute com `python -m` quando estiver lidando com pacotes;
- evite depender do diretório atual de forma implícita;
- documente comandos no `README.md`.

---

## Shebang

Shebang permite executar um script diretamente em sistemas Unix-like.

```python
#!/usr/bin/env python3

print("Executando script")
```

Depois:

```bash
chmod +x script.py
./script.py
```

Use `#!/usr/bin/env python3` para localizar o Python pelo ambiente atual.

Em projetos empacotados, prefira entry points em `pyproject.toml` para comandos profissionais.

---

## Tipos Básicos

### `int`

```python
idade = 30
quantidade = 100
```

Inteiros em Python têm precisão arbitrária, limitada pela memória.

### `float`

```python
preco = 19.99
temperatura = 23.5
```

`float` é adequado para medições, mas não para dinheiro crítico.

### `str`

```python
nome = "Ana"
mensagem = f"Olá, {nome}"
```

Strings são imutáveis.

### `bool`

```python
ativo = True
bloqueado = False
```

Use booleanos para decisões claras.

---

## Variáveis e Comentários

```python
nome_usuario = "Ana"
idade_usuario = 30
```

Comentários devem explicar intenção:

```python
# A taxa é definida pela regra fiscal vigente do produto.
taxa = 0.075
```

Evite comentários óbvios:

```python
# soma a e b
resultado = a + b
```

---

## Operadores Aritméticos

```python
10 + 3   # 13
10 - 3   # 7
10 * 3   # 30
10 / 3   # divisão real
10 // 3  # divisão inteira
10 % 3   # resto
10 ** 3  # potência
```

Exemplo:

```python
def calcular_total(preco: float, quantidade: int) -> float:
    return preco * quantidade
```

---

## Operadores Relacionais

```python
idade >= 18
preco < 100
status == "aprovado"
status != "cancelado"
```

Comparações podem ser encadeadas:

```python
if 0 <= nota <= 10:
    print("nota válida")
```

---

## Operadores Lógicos

```python
if idade >= 18 and ativo:
    print("liberado")

if admin or dono:
    print("pode editar")

if not bloqueado:
    print("acesso permitido")
```

Use variáveis intermediárias para regras complexas:

```python
idade_ok = idade >= 18
documento_ok = documento is not None
pagamento_ok = pagamento == "aprovado"

if idade_ok and documento_ok and pagamento_ok:
    print("cadastro aprovado")
```

---

## Entrada e Saída

`input` sempre retorna string.

```python
nome = input("Nome: ")
idade = int(input("Idade: "))

print(f"{nome} tem {idade} anos")
```

Tratamento seguro:

```python
def ler_inteiro(mensagem: str) -> int:
    while True:
        texto = input(mensagem)
        try:
            return int(texto)
        except ValueError:
            print("Digite um número inteiro válido.")
```

---

## If, Elif e Else

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
```

Guard clauses reduzem aninhamento:

```python
def pode_acessar(usuario: dict) -> bool:
    if not usuario.get("ativo"):
        return False
    if usuario.get("bloqueado"):
        return False
    return True
```

---

## While

Use `while` quando a quantidade de repetições não é conhecida previamente.

```python
tentativas = 0

while tentativas < 3:
    senha = input("Senha: ")
    if senha == "python":
        print("acesso liberado")
        break
    tentativas += 1
```

Evite loops infinitos sem condição de parada clara.

---

## For

```python
for numero in range(5):
    print(numero)
```

Iterando coleções:

```python
nomes = ["Ana", "Bia", "Carlos"]

for nome in nomes:
    print(nome)
```

Com índice:

```python
for indice, nome in enumerate(nomes, start=1):
    print(indice, nome)
```

Com pares:

```python
idades = [30, 25, 40]

for nome, idade in zip(nomes, idades):
    print(nome, idade)
```

---

## Break e Continue

`break` encerra o loop.

```python
for numero in range(10):
    if numero == 5:
        break
    print(numero)
```

`continue` pula para a próxima iteração.

```python
for numero in range(10):
    if numero % 2 != 0:
        continue
    print(numero)
```

`for/else` executa o `else` quando não houve `break`.

```python
for numero in [1, 3, 5]:
    if numero % 2 == 0:
        print("par encontrado")
        break
else:
    print("nenhum par encontrado")
```

---

## Padrões Profissionais

### Entrada separada da regra

Ruim:

```python
idade = int(input("Idade: "))
if idade >= 18:
    print("ok")
```

Melhor:

```python
def maior_de_idade(idade: int) -> bool:
    return idade >= 18

def main() -> None:
    idade = int(input("Idade: "))
    print("ok" if maior_de_idade(idade) else "bloqueado")
```

### Tabela de decisão

```python
def desconto_por_tipo(tipo: str) -> float:
    descontos = {
        "comum": 0.0,
        "premium": 0.10,
        "vip": 0.20,
    }
    return descontos.get(tipo, 0.0)
```

### Validação explícita

```python
def validar_nota(nota: float) -> None:
    if not 0 <= nota <= 10:
        raise ValueError("nota deve estar entre 0 e 10")
```

---

## Exercícios

1. Crie um script que leia nome e idade e exiba uma mensagem formatada.
2. Crie uma calculadora com soma, subtração, multiplicação e divisão.
3. Valide uma nota entre 0 e 10.
4. Escreva um loop que leia números até o usuário digitar `sair`.
5. Use `for/else` para verificar se uma lista contém número par.
6. Reescreva uma condição aninhada usando guard clauses.
7. Crie um script executável com shebang.
8. Execute um arquivo como script e depois como módulo.

