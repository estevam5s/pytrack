# Dados de Mercado, Retornos e Preparacao

Dados sao a materia-prima de financas quantitativas. Dados ruins geram modelos ruins, mesmo com matematica sofisticada.

---

## Tipos de Dados

- Precos OHLCV: abertura, maxima, minima, fechamento e volume.
- Precos ajustados: consideram dividendos, splits e grupamentos.
- Proventos: dividendos, juros, amortizacoes.
- Book de ofertas.
- Trades.
- Curvas de juros.
- Indicadores macroeconomicos.
- Demonstrativos.
- Dados alternativos.

Cada fonte tem frequencia, atraso, revisoes, erros e regras proprias.

---

## Retornos Simples

```text
r_t = P_t / P_{t-1} - 1
```

```python
import pandas as pd

precos = pd.Series([100, 101, 99, 104])
retornos = precos.pct_change().dropna()
print(retornos)
```

---

## Retornos Logaritmicos

```text
g_t = ln(P_t / P_{t-1})
```

```python
import numpy as np

log_retornos = np.log(precos / precos.shift(1)).dropna()
print(log_retornos)
```

Retornos logaritmicos sao aditivos no tempo. Retornos simples sao mais intuitivos para carteira em um periodo.

---

## Retorno Acumulado

```python
retorno_acumulado = (1 + retornos).cumprod() - 1
print(retorno_acumulado)
```

Para uma curva de patrimonio:

```python
patrimonio = (1 + retornos).cumprod()
```

---

## Anualizacao

```python
periodos_ano = 252
retorno_medio_anual = retornos.mean() * periodos_ano
vol_anual = retornos.std() * periodos_ano**0.5
```

Para retorno composto anualizado:

```python
n = len(retornos)
retorno_total = (1 + retornos).prod() - 1
retorno_anualizado = (1 + retorno_total) ** (periodos_ano / n) - 1
```

---

## Alinhamento Temporal

Erro frequente: usar sinal calculado com preco de fechamento para operar no mesmo fechamento.

Regra segura:

```python
sinal = precos.pct_change(20)
posicao = sinal.shift(1)
retorno_estrategia = posicao * retornos
```

`shift(1)` evita usar informacao do futuro.

---

## Dados Faltantes

Tratamentos possiveis:

- remover linhas;
- preencher com ultimo valor conhecido;
- interpolar;
- manter ausente e adaptar calculo;
- investigar fonte.

Nao preencha dados cegamente. Em financas, ausencia pode carregar informacao.

---

## Exemplo de Pipeline

```python
def preparar_precos(df):
    df = df.copy()
    df = df.sort_index()
    df = df[~df.index.duplicated(keep="last")]
    df = df.dropna(how="all")
    return df

def calcular_retornos(precos):
    return precos.pct_change().dropna(how="all")
```

---

## Checklist de Qualidade

- Datas estao ordenadas?
- Ha duplicatas?
- Precos estao ajustados?
- Existe survivorship bias?
- Timezone importa?
- Dados faltantes foram tratados conscientemente?
- Sinais foram deslocados corretamente?
- Retornos incluem dividendos quando necessario?

---

## Exercicios

1. Calcule retornos simples e logaritmicos.
2. Calcule retorno acumulado.
3. Anualize retorno e volatilidade.
4. Mostre um exemplo de look-ahead bias com e sem `shift`.
5. Crie uma funcao de validacao de precos.
