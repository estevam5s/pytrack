# Modelos Fatoriais e Alphas

Modelos fatoriais explicam retornos por exposicoes sistematicas. Alphas sao sinais que tentam prever retorno ou melhorar alocacao apos controlar riscos.

---

## Modelo de Mercado

```text
r_i = alpha + beta r_m + erro
```

```python
import statsmodels.api as sm

y = retornos_ativo
x = sm.add_constant(retornos_mercado)
modelo = sm.OLS(y, x).fit()
print(modelo.params)
```

Beta mede sensibilidade ao mercado. Alpha mede retorno medio nao explicado pelo fator no modelo.

---

## CAPM

```text
E[R_i] = R_f + beta_i(E[R_m] - R_f)
```

O CAPM e simples e util como referencia, mas insuficiente para explicar muitos efeitos empiricos.

---

## Fatores Classicos

- Mercado.
- Tamanho.
- Valor.
- Momentum.
- Qualidade.
- Baixa volatilidade.
- Carry.
- Liquidez.

Fatores podem ter fundamentos economicos, comportamentais ou estruturais.

---

## Construindo um Sinal

Exemplo de momentum:

```python
momentum_12m = precos.pct_change(252)
momentum_12m_ex_1m = precos.shift(21) / precos.shift(252) - 1
sinal = momentum_12m_ex_1m.rank(axis=1, pct=True)
```

Excluir o mes mais recente e comum em estudos de momentum para reduzir reversao de curto prazo.

---

## Normalizacao Cross-Sectional

```python
zscore = (sinal.sub(sinal.mean(axis=1), axis=0)).div(sinal.std(axis=1), axis=0)
```

Normalizar ajuda a comparar ativos no mesmo periodo.

---

## Information Coefficient

IC mede correlacao entre sinal hoje e retorno futuro.

```python
retorno_futuro = retornos.shift(-1)
ic_diario = sinal.corrwith(retorno_futuro, axis=1)
ic_medio = ic_diario.mean()
```

IC pequeno mas persistente pode ser relevante com diversificacao e boa execucao.

---

## Neutralizacao de Risco

Sinais podem estar carregados em setores, tamanho, beta ou liquidez.

Perguntas:

- O alpha e apenas exposicao a mercado?
- O sinal compra sempre ativos pequenos?
- Existe concentracao setorial?
- O resultado sobrevive a neutralizacao?

---

## Overfitting de Alpha

Sinais demais, parametros demais e filtros demais aumentam chance de falso positivo. Documente todas as tentativas, nao apenas as vencedoras.

---

## Exercicios

1. Estime beta de um ativo.
2. Construa sinal de momentum.
3. Calcule ranking cross-sectional.
4. Calcule Information Coefficient.
5. Analise se um sinal pode estar capturando tamanho ou liquidez.
