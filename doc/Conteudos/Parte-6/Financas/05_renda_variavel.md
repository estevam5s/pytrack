# Renda Variavel

Renda variavel inclui ativos cujo retorno nao e conhecido antecipadamente, como acoes, ETFs, fundos imobiliarios e outros instrumentos negociados em mercado. A analise combina preco, fundamentos, risco, liquidez, fluxo de caixa, expectativas e comportamento de mercado.

---

## Retornos

Retorno simples:

```text
r_t = (P_t / P_t-1) - 1
```

Retorno com proventos:

```text
r_t = (P_t - P_t-1 + dividendos_t) / P_t-1
```

Retorno logaritmico:

```text
r_log = ln(P_t / P_t-1)
```

```python
import pandas as pd

precos = pd.Series([10, 10.5, 10.2, 11.0, 10.8])
retornos = precos.pct_change().dropna()
print(retornos)
```

---

## Volatilidade

Volatilidade mede dispersao dos retornos.

```python
vol_diaria = retornos.std()
vol_anualizada = vol_diaria * (252 ** 0.5)
print(round(vol_anualizada, 4))
```

Volatilidade alta nao significa automaticamente ativo ruim. Ela precisa ser analisada junto com retorno esperado, horizonte, diversificacao e capacidade de suportar perdas.

---

## Dividendos

Dividend yield:

```text
dividend_yield = dividendos_por_acao / preco
```

Payout:

```text
payout = dividendos_distribuidos / lucro_liquido
```

Dividendos altos podem indicar geracao de caixa forte, mas tambem podem sinalizar falta de crescimento, evento nao recorrente ou distribuicao insustentavel.

---

## Multiplos

Principais multiplos:

- `P/L`: preco sobre lucro;
- `P/VP`: preco sobre valor patrimonial;
- `EV/EBITDA`: valor da firma sobre EBITDA;
- `P/Receita`: preco sobre receita;
- `Dividend Yield`: dividendos sobre preco;
- `Free Cash Flow Yield`: fluxo de caixa livre sobre valor de mercado.

Use multiplos como ponto de partida, nao como conclusao.

---

## Beta

Beta mede sensibilidade do ativo ao mercado.

```python
import pandas as pd

dados = pd.DataFrame(
    {
        "ativo": [0.01, -0.02, 0.015, 0.005, -0.01],
        "mercado": [0.008, -0.015, 0.010, 0.004, -0.008],
    }
)

cov = dados["ativo"].cov(dados["mercado"])
var = dados["mercado"].var()
beta = cov / var
print(round(beta, 4))
```

Beta maior que 1 indica que o ativo tende a oscilar mais que o mercado. Beta menor que 1 indica menor sensibilidade relativa.

---

## Drawdown

Drawdown mede queda a partir do pico anterior.

```python
precos = pd.Series([100, 110, 105, 120, 90, 95, 130])
pico = precos.cummax()
drawdown = precos / pico - 1
max_drawdown = drawdown.min()
print(round(max_drawdown, 4))
```

Max drawdown e importante porque investidores vivem trajetorias, nao apenas medias finais.

---

## Fatores

Modelos fatoriais tentam explicar retorno por exposicoes como:

- mercado;
- valor;
- tamanho;
- qualidade;
- momentum;
- baixa volatilidade;
- dividendos.

Fatores podem funcionar por risco, comportamento, estrutura de mercado ou arbitragens incompletas. Nenhum fator funciona sempre.

---

## Cuidados

- Nao use retorno passado como garantia.
- Ajuste precos por dividendos, desdobramentos e grupamentos quando necessario.
- Verifique liquidez antes de simular entrada e saida.
- Considere custos operacionais.
- Evite olhar apenas para retorno medio.
- Compare risco, drawdown, consistencia e exposicao setorial.

---

## Exercicios

1. Calcule retornos diarios a partir de uma serie de precos.
2. Calcule volatilidade anualizada.
3. Calcule beta de um ativo em relacao a um indice.
4. Calcule max drawdown.
5. Monte uma tabela de multiplos para tres empresas ficticias.
