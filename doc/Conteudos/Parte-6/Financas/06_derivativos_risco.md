# Derivativos e Risco

Derivativos sao contratos cujo valor deriva de outro ativo, taxa, indice ou evento. Podem ser usados para hedge, especulacao, arbitragem, alavancagem e transferencia de risco.

---

## Tipos de Derivativos

- Futuro: compromisso padronizado de compra ou venda em data futura.
- Termo: contrato customizado entre partes.
- Opcao de compra: direito de comprar um ativo por um preco de exercicio.
- Opcao de venda: direito de vender um ativo por um preco de exercicio.
- Swap: troca de fluxos financeiros.

---

## Opcoes

Termos principais:

- ativo objeto;
- strike;
- premio;
- vencimento;
- call;
- put;
- volatilidade;
- valor intrinseco;
- valor extrinseco.

Payoff de call:

```text
max(preco_ativo - strike, 0) - premio
```

Payoff de put:

```text
max(strike - preco_ativo, 0) - premio
```

```python
def payoff_call(preco, strike, premio):
    return max(preco - strike, 0) - premio

def payoff_put(preco, strike, premio):
    return max(strike - preco, 0) - premio

precos = range(80, 121, 10)
print([payoff_call(p, 100, 5) for p in precos])
print([payoff_put(p, 100, 4) for p in precos])
```

---

## Hedge

Hedge reduz exposicao a um risco especifico. Ele pode diminuir perdas, mas tambem limitar ganhos ou criar custos.

Exemplos:

- produtor protege preco futuro de commodity;
- empresa protege divida em moeda estrangeira;
- carteira de acoes usa indice futuro para reduzir beta;
- investidor compra put para limitar perda.

Um hedge ruim pode aumentar risco se tamanho, vencimento, ativo ou correlacao forem mal escolhidos.

---

## Volatilidade

Volatilidade historica:

```python
import pandas as pd

retornos = pd.Series([0.01, -0.02, 0.015, 0.005, -0.012, 0.02])
vol_anual = retornos.std() * (252 ** 0.5)
print(round(vol_anual, 4))
```

Volatilidade implicita e a volatilidade embutida no preco das opcoes. Ela reflete expectativas e oferta/demanda por protecao.

---

## Value at Risk

VaR estima uma perda maxima esperada para um nivel de confianca em um horizonte.

VaR historico:

```python
import pandas as pd

retornos = pd.Series([0.01, -0.03, 0.02, -0.015, 0.005, -0.04, 0.012])
var_95 = retornos.quantile(0.05)
print(round(var_95, 4))
```

Interpretacao: com 95% de confianca historica, a perda diaria nao deveria exceder esse valor na maioria dos dias observados. O VaR nao informa o tamanho das perdas alem do limite.

---

## Expected Shortfall

Expected Shortfall mede a perda media nos piores cenarios.

```python
limite = retornos.quantile(0.05)
expected_shortfall = retornos[retornos <= limite].mean()
print(round(expected_shortfall, 4))
```

Ele complementa o VaR porque observa a cauda da distribuicao.

---

## Stress Testing

Stress testing avalia perdas em cenarios extremos definidos pelo analista.

Exemplos:

- queda de 20% no mercado acionário;
- alta de 2 pontos percentuais na curva de juros;
- desvalorizacao cambial de 15%;
- aumento de spread de credito;
- reducao de liquidez.

```python
carteira = {
    "acoes": 50000,
    "renda_fixa_prefixada": 30000,
    "dolar": 20000,
}

choques = {
    "acoes": -0.20,
    "renda_fixa_prefixada": -0.06,
    "dolar": 0.15,
}

perda = sum(carteira[ativo] * choque for ativo, choque in choques.items())
print(round(perda, 2))
```

---

## Controles de Risco

- limite por ativo;
- limite por emissor;
- limite por setor;
- limite de alavancagem;
- limite de drawdown;
- stop operacional;
- caixa minimo;
- monitoramento de liquidez;
- cenarios de stress;
- revisao de premissas.

---

## Exercicios

1. Calcule payoff de uma call para varios precos do ativo.
2. Calcule payoff de uma put para varios precos do ativo.
3. Calcule volatilidade anualizada de uma serie de retornos.
4. Calcule VaR historico de 95%.
5. Monte um cenario de stress para uma carteira com tres classes de ativos.
