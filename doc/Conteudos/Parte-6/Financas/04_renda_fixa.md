# Investimentos e Renda Fixa

Renda fixa envolve instrumentos em que a regra de remuneracao e conhecida ou estimavel desde o inicio. Isso nao significa ausencia de risco. Ha risco de credito, mercado, liquidez, reinvestimento, inflacao e tributacao.

---

## Tipos de Remuneracao

### Prefixada

A taxa e definida no inicio.

```text
FV = PV * (1 + taxa) ** n
```

### Pos-fixada

A rentabilidade acompanha um indexador, como CDI ou Selic.

```text
retorno = percentual_do_indexador * variacao_do_indexador
```

### Hibrida

Combina inflacao com taxa real.

```text
retorno_nominal = (1 + inflacao) * (1 + taxa_real) - 1
```

---

## Preco de um Titulo

O preco de um titulo e o valor presente dos fluxos futuros.

```text
preco = soma(cupom_t / (1 + taxa) ** t) + principal / (1 + taxa) ** n
```

```python
def preco_titulo(valor_face, cupom, taxa, periodos):
    fluxos = [valor_face * cupom] * periodos
    fluxos[-1] += valor_face
    return sum(fc / (1 + taxa) ** t for t, fc in enumerate(fluxos, start=1))

print(round(preco_titulo(1000, 0.10, 0.12, 5), 2))
```

Quando a taxa de mercado sobe, o preco de titulos prefixados existentes tende a cair. Quando a taxa cai, o preco tende a subir.

---

## Duration

Duration mede o prazo medio ponderado dos fluxos de caixa. Tambem ajuda a estimar sensibilidade do preco a mudancas de taxa.

```python
def duration_macaulay(fluxos, taxa):
    preco = sum(fc / (1 + taxa) ** t for t, fc in enumerate(fluxos, start=1))
    pesos = [
        t * (fc / (1 + taxa) ** t) / preco
        for t, fc in enumerate(fluxos, start=1)
    ]
    return sum(pesos)

fluxos = [100, 100, 100, 100, 1100]
print(round(duration_macaulay(fluxos, 0.12), 4))
```

Duration modificada aproxima a variacao percentual do preco:

```text
duration_modificada = duration_macaulay / (1 + taxa)
variacao_preco_aproximada = -duration_modificada * variacao_taxa
```

---

## Marcacao a Mercado

Marcacao a mercado atualiza o preco do titulo conforme as taxas vigentes. Mesmo que o fluxo final seja conhecido, o preco antes do vencimento pode oscilar.

Isso importa para:

- venda antecipada;
- fundos de renda fixa;
- avaliacao de risco;
- relatorios de carteira;
- comparacao de alternativas.

---

## Riscos em Renda Fixa

- Credito: emissor pode nao pagar.
- Mercado: preco oscila com taxa de juros.
- Liquidez: pode nao haver comprador a preco justo.
- Reinvestimento: cupons podem ser reinvestidos a taxa menor.
- Inflacao: retorno nominal pode perder poder de compra.
- Tributacao: imposto reduz retorno liquido.

---

## Retorno Liquido

```python
valor_inicial = 10000
valor_bruto = 11200
aliquota_ir = 0.15

rendimento = valor_bruto - valor_inicial
imposto = rendimento * aliquota_ir
valor_liquido = valor_bruto - imposto
retorno_liquido = valor_liquido / valor_inicial - 1

print(round(retorno_liquido, 4))
```

Sempre compare produtos pela rentabilidade liquida, prazo, risco e liquidez.

---

## Checklist de Analise

- Qual e o emissor?
- A taxa e prefixada, pos-fixada ou hibrida?
- Qual e o prazo?
- Ha liquidez diaria ou somente no vencimento?
- Existe risco de marcacao a mercado?
- A rentabilidade informada e bruta ou liquida?
- Quais impostos e taxas incidem?
- O produto tem garantia, colateral ou protecao institucional?

---

## Exercicios

1. Calcule o preco de um titulo com valor de face de R$ 1.000, cupom de 8% e taxa de mercado de 10%.
2. Compare um titulo prefixado e um pos-fixado em tres cenarios de taxa.
3. Calcule duration de um fluxo com cinco pagamentos.
4. Simule a queda de preco de um titulo quando a taxa sobe 1 ponto percentual.
5. Calcule retorno liquido apos imposto sobre rendimento.
