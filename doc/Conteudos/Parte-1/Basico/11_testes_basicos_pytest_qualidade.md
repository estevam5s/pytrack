# Testes Básicos, Assert, Pytest e Qualidade Inicial

Testes verificam se o código faz o que promete. No começo, testes parecem lentos, mas eles aceleram aprendizado, reduzem medo de refatorar e ajudam a encontrar erros antes do usuário.

---

## Objetivo

Ao final, você deve saber:

- usar `assert`;
- escrever testes simples;
- instalar e rodar `pytest`;
- testar funções puras;
- testar exceções;
- organizar diretório `tests`;
- entender diferença entre teste manual e automatizado.

---

## Teste Manual

```python
def somar(a, b):
    return a + b

print(somar(2, 3))
```

Isso ajuda no início, mas depende de inspeção humana.

---

## Assert

```python
def somar(a, b):
    return a + b

assert somar(2, 3) == 5
assert somar(-1, 1) == 0
```

Se a condição for falsa, Python levanta `AssertionError`.

---

## Pytest

Instalar:

```bash
python -m pip install pytest
```

Estrutura:

```text
projeto/
├── calculos.py
└── tests/
    └── test_calculos.py
```

`calculos.py`:

```python
def calcular_total(preco: float, quantidade: int) -> float:
    return preco * quantidade
```

`tests/test_calculos.py`:

```python
from calculos import calcular_total

def test_calcular_total():
    assert calcular_total(10, 3) == 30
```

Rodar:

```bash
pytest
```

---

## Testando Casos Limite

```python
def aplicar_desconto(preco: float, desconto: float) -> float:
    return preco * (1 - desconto)
```

Testes:

```python
from calculos import aplicar_desconto

def test_desconto_zero():
    assert aplicar_desconto(100, 0) == 100

def test_desconto_total():
    assert aplicar_desconto(100, 1) == 0

def test_desconto_parcial():
    assert aplicar_desconto(100, 0.10) == 90
```

Casos limite revelam erros que exemplos felizes não mostram.

---

## Testando Exceções

```python
def dividir(a: float, b: float) -> float:
    if b == 0:
        raise ValueError("b não pode ser zero")
    return a / b
```

Teste:

```python
import pytest

from calculos import dividir

def test_dividir_por_zero():
    with pytest.raises(ValueError, match="zero"):
        dividir(10, 0)
```

---

## Funções Puras São Mais Fáceis de Testar

Função pura:

```python
def calcular_total(preco: float, quantidade: int) -> float:
    return preco * quantidade
```

Função difícil de testar:

```python
def calcular_total_interativo():
    preco = float(input("Preço: "))
    quantidade = int(input("Quantidade: "))
    print(preco * quantidade)
```

Separe entrada e saída da regra de negócio.

---

## Arrange, Act, Assert

Padrão simples:

```python
def test_calcular_total_com_desconto():
    preco = 100
    quantidade = 2
    desconto = 0.10

    resultado = calcular_total_com_desconto(preco, quantidade, desconto)

    assert resultado == 180
```

Etapas:

- Arrange: prepara dados;
- Act: executa;
- Assert: verifica.

---

## Qualidade Inicial

Ferramentas úteis:

```bash
python -m pip install pytest ruff
```

Rodar lint:

```bash
ruff check .
```

Formatar:

```bash
ruff format .
```

No básico, não tente configurar tudo de uma vez. Primeiro escreva funções pequenas e testes claros.

---

## Boas Práticas

- Teste comportamento, não implementação interna.
- Nomeie testes com clareza.
- Inclua casos limite.
- Teste exceções esperadas.
- Evite depender de ordem externa, horário atual ou internet em testes básicos.
- Não coloque lógica complexa dentro do teste.
- Um bug corrigido deve virar teste quando possível.

---

## Checklist de Proficiência

Você domina este tópico quando consegue:

- explicar o que `assert` verifica;
- criar um arquivo de teste com `pytest`;
- testar retorno de função;
- testar exceção esperada;
- organizar `tests/`;
- separar função testável de entrada por teclado;
- rodar testes antes e depois de refatorar.

---

## Exercícios

1. Crie testes para `somar`, `subtrair`, `multiplicar` e `dividir`.
2. Teste divisão por zero com `pytest.raises`.
3. Refatore um script com `input` para expor uma função testável.
4. Crie três casos limite para uma função de desconto.
5. Rode `ruff check .` em um projeto pequeno.

---

## Aprofundamento Complementar

### Pirâmide simples de testes

No começo, foque em testes de função. Eles são rápidos, simples e ajudam a desenhar código melhor.

Depois avance para:

- testes de integração entre módulos;
- testes de CLI;
- testes com arquivos temporários;
- testes de exceções;
- testes de regressão para bugs corrigidos.

### Teste não deve depender de ordem externa

Evite testes que dependem de:

- internet;
- horário atual sem controle;
- arquivo fixo no computador;
- ordem de execução;
- estado deixado por outro teste.

### `tmp_path`

Pytest fornece diretório temporário para testes com arquivos.

```python
def test_salvar_arquivo(tmp_path):
    caminho = tmp_path / "saida.txt"
    caminho.write_text("ok", encoding="utf-8")
    assert caminho.read_text(encoding="utf-8") == "ok"
```

### Teste de regressão

Quando corrigir um bug, escreva um teste que falharia antes da correção. Isso impede que o bug volte.

### Exercícios extras

1. Teste uma função que lê e grava JSON usando `tmp_path`.
2. Crie teste para entrada inválida.
3. Escreva um teste de regressão para um bug inventado.
4. Separe testes de cálculo e testes de arquivo.
5. Rode `pytest -q` e interprete o resultado.
