# Matemática Básica Completa com Python

Matemática básica é a fundação de cálculo. Frações, potências, proporções, funções e notação precisam estar automáticas para que limites, derivadas e integrais façam sentido.

---

## Conjuntos Numéricos

- Naturais: `0, 1, 2, 3, ...`
- Inteiros: `..., -2, -1, 0, 1, 2, ...`
- Racionais: podem ser escritos como fração `a/b`.
- Irracionais: não podem ser escritos como fração exata, como `sqrt(2)` e `pi`.
- Reais: união de racionais e irracionais.
- Complexos: números da forma `a + bi`.

```python
from fractions import Fraction
from decimal import Decimal
import math

print(Fraction(1, 3) + Fraction(1, 6))
print(Decimal("0.1") + Decimal("0.2"))
print(math.sqrt(2))
print(complex(2, 3))
```

---

## Operações e Prioridade

Ordem comum:

1. parênteses;
2. potências e raízes;
3. multiplicação e divisão;
4. soma e subtração.

```python
resultado = 2 + 3 * 4
resultado_com_parenteses = (2 + 3) * 4
```

Em código matemático, use parênteses para clareza mesmo quando a prioridade é conhecida.

---

## Frações

```text
a/b + c/d = (ad + bc) / bd
a/b * c/d = ac / bd
(a/b) / (c/d) = ad / bc
```

```python
from fractions import Fraction

a = Fraction(2, 3)
b = Fraction(5, 7)

print(a + b)
print(a * b)
print(a / b)
```

Use `Fraction` para estudar exatidão. Use `float` para aproximações numéricas.

---

## Potências

```text
a^m * a^n = a^(m+n)
a^m / a^n = a^(m-n)
(a^m)^n = a^(mn)
a^0 = 1
a^(-n) = 1/a^n
```

```python
base = 2
print(base ** 3)
print(base ** -2)
```

---

## Radicais

```text
sqrt(a) = a^(1/2)
cuberoot(a) = a^(1/3)
```

```python
import math

print(math.sqrt(81))
print(27 ** (1 / 3))
```

Cuidados: raízes pares de números negativos não são reais.

---

## Porcentagem

```text
10% = 10/100 = 0.10
valor_final = valor_inicial * (1 + taxa)
valor_com_desconto = valor_inicial * (1 - desconto)
```

```python
valor = 200
aumento = 0.15
desconto = 0.10

print(valor * (1 + aumento))
print(valor * (1 - desconto))
```

---

## Razão e Proporção

Razão compara grandezas. Proporção iguala razões.

```text
a/b = c/d
ad = bc
```

```python
def regra_de_tres(a, b, c):
    return b * c / a

print(regra_de_tres(2, 10, 5))
```

---

## Valor Absoluto

Valor absoluto mede distância até zero.

```python
print(abs(-10))
print(abs(3 - 8))
```

Em cálculo, valor absoluto aparece em distância, erro, limites e desigualdades.

---

## Notação Científica

```python
numero = 1.23e6
pequeno = 4.5e-3

print(numero)
print(pequeno)
```

Útil para física, engenharia, análise numérica e escalas muito grandes ou pequenas.

---

## Erro Absoluto e Relativo

```text
erro_absoluto = |valor_aproximado - valor_exato|
erro_relativo = erro_absoluto / |valor_exato|
```

```python
valor_exato = math.pi
aproximado = 3.14

erro_abs = abs(aproximado - valor_exato)
erro_rel = erro_abs / abs(valor_exato)

print(erro_abs, erro_rel)
```

---

## Boas Práticas com Python

- Use `Fraction` para frações exatas.
- Use `Decimal` para dinheiro.
- Use `math` para funções escalares.
- Use `numpy` para vetores e arrays.
- Sempre documente unidades.
- Não compare floats com igualdade exata quando houver arredondamento.

```python
import math

print(math.isclose(0.1 + 0.2, 0.3))
```

---

## Exercícios

1. Converta frações em decimais e decimais em frações.
2. Calcule aumento e desconto percentual.
3. Implemente regra de três.
4. Calcule erro absoluto e relativo.
5. Compare `float`, `Decimal` e `Fraction` em exemplos simples.
