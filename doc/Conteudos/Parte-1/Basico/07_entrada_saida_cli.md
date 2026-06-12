# Entrada, Saída, CLI e Interação com Usuário

Programas úteis precisam receber dados, mostrar resultados e se comunicar de forma previsível. Este guia cobre `input`, `print`, formatação, argumentos de linha de comando e padrões simples para criar scripts interativos.

---

## Objetivo

Ao final, você deve saber:

- receber dados do usuário com `input`;
- converter entradas com segurança;
- formatar saídas legíveis;
- separar interação de regra de negócio;
- receber argumentos pela linha de comando;
- criar scripts que podem ser usados por pessoas e por automações.

---

## Print

`print` escreve na saída padrão.

```python
nome = "Ana"
idade = 30

print(nome)
print("Idade:", idade)
print(f"{nome} tem {idade} anos")
```

Parâmetros úteis:

```python
print("A", "B", "C", sep="-")
print("carregando", end="...")
print("ok")
```

Use `print` para resultado final, mensagens simples e exercícios. Em projetos maiores, use `logging`.

---

## Input

`input` sempre retorna `str`.

```python
nome = input("Digite seu nome: ")
print(f"Olá, {nome}")
```

Conversão:

```python
idade_texto = input("Digite sua idade: ")
idade = int(idade_texto)
```

Isso pode falhar se o usuário digitar algo inválido.

---

## Validação de Entrada

```python
def ler_inteiro(mensagem: str) -> int:
    while True:
        texto = input(mensagem)
        try:
            return int(texto)
        except ValueError:
            print("Digite um número inteiro válido.")

idade = ler_inteiro("Idade: ")
print(idade)
```

Validação profissional deve:

- explicar o erro;
- permitir nova tentativa quando fizer sentido;
- evitar travar o programa;
- converter apenas depois de validar;
- manter regra de negócio separada da entrada.

---

## Separando Entrada, Cálculo e Saída

Evite misturar tudo:

```python
preco = float(input("Preço: "))
quantidade = int(input("Quantidade: "))
print(preco * quantidade)
```

Melhor:

```python
def calcular_total(preco: float, quantidade: int) -> float:
    return preco * quantidade

def main() -> None:
    preco = float(input("Preço: "))
    quantidade = int(input("Quantidade: "))
    total = calcular_total(preco, quantidade)
    print(f"Total: R$ {total:.2f}")

main()
```

Agora `calcular_total` pode ser testada sem depender de teclado.

---

## Formatação de Saída

Casas decimais:

```python
valor = 1234.5678
print(f"{valor:.2f}")
```

Percentual:

```python
taxa = 0.125
print(f"{taxa:.2%}")
```

Alinhamento:

```python
print(f"{'Produto':<20} {'Preço':>10}")
print(f"{'Mouse':<20} {89.9:>10.2f}")
```

Datas:

```python
from datetime import date

hoje = date.today()
print(f"{hoje:%d/%m/%Y}")
```

---

## Argumentos de Linha de Comando

Scripts profissionais não devem depender apenas de `input`. Argumentos permitem automação.

Exemplo simples com `sys.argv`:

```python
import sys

if len(sys.argv) < 2:
    print("Uso: python app.py nome")
    raise SystemExit(1)

nome = sys.argv[1]
print(f"Olá, {nome}")
```

`sys.argv[0]` é o nome do script. Os demais itens são argumentos enviados.

---

## Argparse

`argparse` cria CLIs melhores.

```python
import argparse

def criar_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Calcula total de uma compra.")
    parser.add_argument("--preco", type=float, required=True)
    parser.add_argument("--quantidade", type=int, required=True)
    return parser

def main() -> None:
    parser = criar_parser()
    args = parser.parse_args()
    total = args.preco * args.quantidade
    print(f"Total: R$ {total:.2f}")

if __name__ == "__main__":
    main()
```

Uso:

```bash
python app.py --preco 19.90 --quantidade 3
```

---

## Código de Saída

Programas de linha de comando devem indicar sucesso ou falha.

```python
raise SystemExit(0)  # sucesso
raise SystemExit(1)  # erro
```

Exemplo:

```python
def main() -> int:
    try:
        numero = int(input("Número: "))
    except ValueError:
        print("Número inválido.")
        return 1

    print(numero * 2)
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
```

---

## Boas Práticas

- Não deixe regra de negócio presa dentro de `input`.
- Use funções puras para cálculos.
- Use `argparse` para scripts reutilizáveis.
- Mostre mensagens de erro claras.
- Retorne código de saída coerente.
- Não peça interação manual em automações.
- Formate valores monetários, percentuais e datas explicitamente.

---

## Checklist de Proficiência

Você domina este tópico quando consegue:

- explicar por que `input` retorna string;
- validar entrada inválida;
- criar uma CLI com `argparse`;
- separar `main` das funções de cálculo;
- formatar tabelas simples;
- criar códigos de saída para sucesso e erro;
- transformar um programa interativo em script automatizável.

---

## Exercícios

1. Crie um programa que leia nome, idade e cidade e mostre uma frase formatada.
2. Crie uma função `ler_float` que repete a pergunta até receber número válido.
3. Crie uma CLI que recebe `--preco`, `--quantidade` e `--desconto`.
4. Faça a CLI retornar erro quando o preço for negativo.
5. Separe o cálculo em função testável.

---

## Aprofundamento Complementar

### CLI interativa versus automatizável

Uma CLI com `input` é boa para estudo e uso manual. Uma CLI com argumentos é melhor para automação, scripts, agendamentos e integração com outros programas.

Interativa:

```python
nome = input("Nome: ")
```

Automatizável:

```bash
python app.py --nome Ana
```

Em projetos profissionais, prefira argumentos quando a execução precisa ser repetível.

### Saída para humanos e saída para máquinas

Saída humana pode ser formatada:

```text
Total: R$ 120.00
```

Saída para máquina deve ser estruturada:

```json
{"total": 120.0}
```

Quando outro sistema vai consumir o resultado, considere JSON.

### Entrada padrão e pipelines

Programas de terminal podem receber dados pela entrada padrão.

```python
import sys

conteudo = sys.stdin.read()
print(conteudo.upper())
```

Uso:

```bash
cat nomes.txt | python normalizar.py
```

Esse padrão é útil em automações.

### Mensagens de erro

Mensagens de erro devem ir para `stderr` quando você precisa separar resultado normal de falha.

```python
import sys

print("Erro: arquivo inválido", file=sys.stderr)
```

### Exercícios extras

1. Crie uma CLI que aceita `--formato texto` ou `--formato json`.
2. Leia dados de `stdin` e conte linhas.
3. Envie mensagens de erro para `stderr`.
4. Crie uma CLI com subcomandos `adicionar`, `listar` e `remover`.
5. Faça uma função `main` retornar `0` ou `1` conforme sucesso ou falha.

---

## Consolidação: Shebang e Execução no Terminal

### Executando um arquivo Python

Arquivo `app.py`:

```python
print("Olá pelo terminal")
```

Execução:

```bash
python app.py
```

Em muitos ambientes, também é comum:

```bash
python3 app.py
```

Use o Python do ambiente virtual quando o projeto tiver dependências:

```bash
source .venv/bin/activate
python app.py
```

### Shebang

Shebang é a primeira linha de um script em Unix/macOS/Linux que informa qual interpretador deve executar o arquivo.

```python
#!/usr/bin/env python3

print("Executado como script")
```

Depois, dê permissão de execução:

```bash
chmod +x app.py
```

E execute:

```bash
./app.py
```

`#!/usr/bin/env python3` é mais portátil do que apontar para um caminho fixo como `/usr/bin/python3`.

### Entrada pelo terminal

```python
nome = input("Nome: ")
print(f"Olá, {nome}")
```

Execução:

```bash
python app.py
```

O programa pausa esperando o usuário digitar.

### Argumentos pelo terminal

```python
import sys

print(sys.argv)
```

Execução:

```bash
python app.py Ana 30
```

`sys.argv` conterá o nome do script e os argumentos enviados.

### Saída, erro e código de saída

```python
import sys

print("resultado normal")
print("mensagem de erro", file=sys.stderr)
raise SystemExit(1)
```

Convenção:

- `0`: sucesso;
- diferente de `0`: falha.

### Checklist terminal

- Sei executar `python arquivo.py`.
- Sei ativar ambiente virtual antes de executar.
- Sei usar shebang.
- Sei dar permissão com `chmod +x`.
- Sei ler entrada com `input`.
- Sei receber argumentos com `sys.argv` ou `argparse`.
- Sei diferenciar stdout, stderr e código de saída.
