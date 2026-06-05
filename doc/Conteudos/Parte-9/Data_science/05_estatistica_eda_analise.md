# Estatística, EDA e Análise Exploratória

Estatística e EDA são a base para transformar dados em entendimento. Este arquivo cobre estatística descritiva, inferencial, correlação, outliers, distribuições, hipóteses, segmentação, métricas e análise profissional.

---

## Sumário

1. [Objetivo da EDA](#objetivo-da-eda)
2. [Estatística Descritiva](#estatística-descritiva)
3. [Distribuições](#distribuições)
4. [Correlação e Causalidade](#correlação-e-causalidade)
5. [Outliers](#outliers)
6. [Amostragem](#amostragem)
7. [Testes de Hipótese](#testes-de-hipótese)
8. [Intervalos de Confiança](#intervalos-de-confiança)
9. [Bibliotecas Estatísticas](#bibliotecas-estatísticas)
10. [Métricas de Negócio](#métricas-de-negócio)
11. [EDA Profissional](#eda-profissional)
12. [Boas Práticas](#boas-práticas)
13. [Exercícios](#exercícios)

---

## Objetivo da EDA

EDA responde:

- que dados existem?
- quais colunas são confiáveis?
- há nulos?
- há duplicatas?
- há outliers?
- quais padrões aparecem?
- quais segmentos diferem?
- quais hipóteses surgem?

Checklist inicial:

```python
df.shape
df.info()
df.head()
df.isna().mean().sort_values(ascending=False)
df.duplicated().sum()
df.describe(include="all")
```

---

## Estatística Descritiva

```python
df["valor"].mean()
df["valor"].median()
df["valor"].std()
df["valor"].quantile([0.25, 0.5, 0.75])
```

Resumo por grupo:

```python
resumo = (
    df
    .groupby("categoria")
    .agg(
        media=("valor", "mean"),
        mediana=("valor", "median"),
        desvio=("valor", "std"),
        minimo=("valor", "min"),
        maximo=("valor", "max"),
        quantidade=("valor", "count"),
    )
)
```

Média é sensível a outliers. Mediana é mais robusta.

---

## Distribuições

Histograma:

```python
df["valor"].hist(bins=30)
```

Assimetria:

```python
df["valor"].skew()
```

Curtose:

```python
df["valor"].kurt()
```

Distribuições importam porque afetam:

- média vs mediana;
- testes estatísticos;
- modelos;
- tratamento de outliers;
- interpretação.

---

## Correlação e Causalidade

```python
correlacao = df[["valor", "quantidade", "desconto"]].corr()
```

Correlação não implica causalidade.

Riscos:

- variável confundidora;
- sazonalidade;
- viés de seleção;
- relação não linear;
- amostra pequena.

Use correlação para levantar hipóteses, não para provar causa.

---

## Outliers

### IQR

```python
q1 = df["valor"].quantile(0.25)
q3 = df["valor"].quantile(0.75)
iqr = q3 - q1

limite_inferior = q1 - 1.5 * iqr
limite_superior = q3 + 1.5 * iqr

outliers = df[(df["valor"] < limite_inferior) | (df["valor"] > limite_superior)]
```

### Z-score

```python
from scipy import stats

z = stats.zscore(df["valor"].dropna())
```

Não remova outlier automaticamente. Primeiro entenda:

- erro de coleta?
- evento raro real?
- fraude?
- cliente premium?
- mudança de unidade?

---

## Amostragem

```python
amostra = df.sample(n=1000, random_state=42)
```

Amostra estratificada:

```python
amostra = (
    df
    .groupby("categoria", group_keys=False)
    .apply(lambda grupo: grupo.sample(frac=0.1, random_state=42))
)
```

Cuidados:

- representatividade;
- viés;
- tamanho;
- aleatoriedade;
- estratificação.

---

## Testes de Hipótese

Teste t:

```python
from scipy import stats

a = df.loc[df["grupo"] == "A", "valor"]
b = df.loc[df["grupo"] == "B", "valor"]

resultado = stats.ttest_ind(a, b, equal_var=False, nan_policy="omit")
print(resultado.pvalue)
```

Qui-quadrado:

```python
tabela = pd.crosstab(df["grupo"], df["converteu"])
chi2, pvalor, dof, expected = stats.chi2_contingency(tabela)
```

Interpretação:

- p-valor baixo sugere evidência contra hipótese nula;
- significância estatística não é significância prática;
- sempre considere tamanho do efeito.

---

## Intervalos de Confiança

```python
import numpy as np
from scipy import stats

valores = df["valor"].dropna()
media = valores.mean()
erro = stats.sem(valores)
ic = stats.t.interval(0.95, len(valores) - 1, loc=media, scale=erro)
```

Intervalo comunica incerteza melhor do que apenas uma média pontual.

---

## Bibliotecas Estatísticas

Além de `scipy.stats`, o ecossistema comum inclui:

- `statsmodels`: regressão, séries temporais, modelos estatísticos e testes com foco econométrico/estatístico;
- `pingouin`: testes estatísticos com API simples, tamanho de efeito e relatórios práticos;
- `scikit-posthocs`: testes pós-hoc após ANOVA/Kruskal-Wallis;
- `scipy.stats`: base para distribuições, testes clássicos, correlação, intervalos e estatística inferencial.

Exemplos e critérios de escolha estão em `09_ecossistema_analytics_bibliotecas.md`.

---

## Métricas de Negócio

Exemplos:

- receita;
- margem;
- ticket médio;
- churn;
- CAC;
- LTV;
- conversão;
- retenção;
- cohort;
- NPS.

Exemplo:

```python
metricas = {
    "receita": df["valor"].sum(),
    "ticket_medio": df["valor"].mean(),
    "pedidos": len(df),
    "clientes": df["cliente_id"].nunique(),
}
```

---

## EDA Profissional

Estrutura recomendada:

1. contexto;
2. dicionário de dados;
3. qualidade;
4. estatística descritiva;
5. segmentações;
6. séries temporais;
7. correlações;
8. outliers;
9. hipóteses;
10. recomendações;
11. limitações.

---

## Boas Práticas

- Separe achado, evidência e recomendação.
- Não confunda correlação com causalidade.
- Documente filtros aplicados.
- Valide dados antes de métricas.
- Mostre incerteza quando possível.
- Compare grupos com contexto.
- Evite excesso de gráficos sem pergunta.

---

## Exercícios

1. Crie checklist EDA para dataset de vendas.
2. Calcule média, mediana e quartis.
3. Detecte outliers por IQR.
4. Faça teste t entre dois grupos.
5. Calcule intervalo de confiança.
6. Crie métricas de negócio.
7. Escreva três hipóteses a partir de uma EDA.
8. Documente limitações da análise.
9. Compare `scipy.stats`, `statsmodels`, `pingouin` e `scikit-posthocs`.
