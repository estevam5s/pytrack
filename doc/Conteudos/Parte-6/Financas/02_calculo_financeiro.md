# Calculo Financeiro

Calculo financeiro transforma fluxos de dinheiro em decisoes comparaveis. Ele permite responder se uma alternativa e viavel, quanto vale hoje um recebimento futuro, qual taxa esta embutida em uma operacao e como uma divida sera amortizada.

---

## Juros Simples

Nos juros simples, os juros incidem apenas sobre o principal.

```text
J = PV * i * n
FV = PV * (1 + i * n)
```

Exemplo:

```python
pv = 1000
taxa = 0.02
periodos = 6
fv = pv * (1 + taxa * periodos)
print(fv)
```

Juros simples aparecem em alguns calculos comerciais, multas e aproximacoes. Em investimentos e financiamentos longos, juros compostos sao mais comuns.

---

## Juros Compostos

Nos juros compostos, os juros de cada periodo entram na base do periodo seguinte.

```text
FV = PV * (1 + i) ** n
PV = FV / (1 + i) ** n
```

Exemplo:

```python
pv = 1000
taxa = 0.02
periodos = 6
fv = pv * (1 + taxa) ** periodos
print(round(fv, 2))
```

---

## Taxas Proporcionais e Equivalentes

Taxa proporcional divide ou multiplica linearmente. Taxa equivalente preserva o efeito composto.

```text
taxa_equivalente = (1 + taxa_origem) ** (periodos_destino / periodos_origem) - 1
```

Exemplo: converter taxa anual para mensal.

```python
taxa_anual = 0.12
taxa_mensal = (1 + taxa_anual) ** (1 / 12) - 1
print(round(taxa_mensal, 6))
```

Regra pratica: em juros compostos, prefira taxas equivalentes.

---

## Valor Presente Liquido

VPL mede o valor presente de todos os fluxos descontados por uma taxa minima de atratividade.

```text
VPL = soma(FC_t / (1 + i) ** t)
```

```python
def vpl(taxa, fluxos):
    return sum(fc / (1 + taxa) ** t for t, fc in enumerate(fluxos))

fluxos = [-10000, 2500, 3000, 3500, 4000]
print(round(vpl(0.10, fluxos), 2))
```

Interpretacao:

- VPL positivo: projeto gera valor acima da taxa exigida.
- VPL zero: projeto empata com a taxa exigida.
- VPL negativo: projeto nao atinge a taxa exigida.

---

## Taxa Interna de Retorno

TIR e a taxa que zera o VPL.

```text
VPL(TIR) = 0
```

Exemplo com busca numerica simples:

```python
def vpl(taxa, fluxos):
    return sum(fc / (1 + taxa) ** t for t, fc in enumerate(fluxos))

def tir_bissecao(fluxos, minimo=-0.99, maximo=1.0, iteracoes=100):
    for _ in range(iteracoes):
        meio = (minimo + maximo) / 2
        valor = vpl(meio, fluxos)
        if valor > 0:
            minimo = meio
        else:
            maximo = meio
    return (minimo + maximo) / 2

fluxos = [-10000, 2500, 3000, 3500, 4000]
print(round(tir_bissecao(fluxos), 4))
```

A TIR pode ser enganosa quando ha fluxos com multiplas mudancas de sinal ou quando projetos tem escalas diferentes. Use junto com VPL.

---

## Payback

Payback mede em quanto tempo o investimento inicial e recuperado.

```python
fluxos = [-10000, 3000, 3000, 3000, 3000, 3000]
acumulado = 0

for periodo, fluxo in enumerate(fluxos):
    acumulado += fluxo
    if acumulado >= 0:
        print(periodo)
        break
```

Limite: payback ignora fluxos depois da recuperacao e, na forma simples, ignora valor do dinheiro no tempo.

---

## Sistemas de Amortizacao

### SAC

No SAC, a amortizacao e constante e os juros caem ao longo do tempo.

```python
saldo = 100000
taxa = 0.01
meses = 12
amortizacao = saldo / meses

for mes in range(1, meses + 1):
    juros = saldo * taxa
    parcela = amortizacao + juros
    saldo -= amortizacao
    print(mes, round(parcela, 2), round(saldo, 2))
```

### Price

Na tabela Price, a parcela e constante.

```text
PMT = PV * (i * (1 + i) ** n) / ((1 + i) ** n - 1)
```

```python
pv = 100000
taxa = 0.01
meses = 12
pmt = pv * (taxa * (1 + taxa) ** meses) / ((1 + taxa) ** meses - 1)

saldo = pv
for mes in range(1, meses + 1):
    juros = saldo * taxa
    amortizacao = pmt - juros
    saldo -= amortizacao
    print(mes, round(pmt, 2), round(juros, 2), round(amortizacao, 2), round(saldo, 2))
```

---

## Checklist de Calculo

- A taxa esta na mesma unidade do periodo?
- O fluxo inicial esta no periodo correto?
- Custos, impostos, taxas e spreads foram considerados?
- O resultado e nominal ou real?
- A analise usa regime simples ou composto?
- Ha mudancas de sinal que podem distorcer a TIR?
- A decisao depende de VPL, liquidez, risco ou restricao operacional?

---

## Exercicios

1. Converta 15% ao ano para taxa mensal equivalente.
2. Calcule o valor futuro de R$ 5.000 em 24 meses a 0,9% ao mes.
3. Monte uma tabela SAC de 6 parcelas.
4. Monte uma tabela Price de 6 parcelas.
5. Calcule VPL e TIR de um projeto com fluxo inicial negativo e cinco entradas positivas.
