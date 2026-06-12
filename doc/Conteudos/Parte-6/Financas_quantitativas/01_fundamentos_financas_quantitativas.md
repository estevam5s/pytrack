# Fundamentos de Financas Quantitativas

Financas quantitativas usam matematica, estatistica, computacao e teoria financeira para modelar mercados, avaliar risco, construir carteiras, precificar instrumentos e testar estrategias.

---

## O Que Diferencia Financas Quantitativas

Financas tradicionais podem depender mais de analise qualitativa, demonstrativos, tese de investimento e julgamento discricionario. Financas quantitativas priorizam:

- dados historicos e atuais;
- modelos estatisticos;
- regras objetivas;
- simulacao;
- backtesting;
- controle de risco;
- execucao sistematica;
- validacao empirica.

Um processo quant profissional deve ser reprodutivel: outra pessoa deve conseguir rodar o mesmo codigo, com os mesmos dados e premissas, e chegar ao mesmo resultado.

---

## Fluxo de Trabalho Quant

```text
hipotese -> dados -> limpeza -> features -> modelo -> backtest -> risco -> validacao -> execucao -> monitoramento
```

Cada etapa pode introduzir erro. Uma estrategia aparentemente lucrativa pode desaparecer quando dados, custos ou vieses sao tratados corretamente.

---

## Hipotese Quantitativa

Uma boa hipotese deve ser:

- clara;
- testavel;
- conectada a uma intuicao economica ou comportamental;
- implementavel com dados disponiveis;
- avaliada com metricas apropriadas;
- robusta a parametros razoaveis.

Exemplo ruim:

```text
Comprar ativos que parecem bons.
```

Exemplo melhor:

```text
Ativos com retorno positivo nos ultimos 12 meses, excluindo o mes mais recente, tendem a apresentar premio de momentum no proximo mes.
```

---

## Tipos de Estrategias Quantitativas

- Momentum.
- Reversao a media.
- Valor.
- Qualidade.
- Carry.
- Low volatility.
- Arbitragem estatistica.
- Market making.
- Pairs trading.
- Alocacao dinamica.
- Risk parity.
- Volatility targeting.

Cada familia tem fontes de retorno, riscos e custos diferentes.

---

## Retorno, Risco e Capacidade

Uma estrategia nao deve ser avaliada apenas por retorno.

Metricas basicas:

- retorno anualizado;
- volatilidade anualizada;
- Sharpe;
- Sortino;
- max drawdown;
- Calmar;
- hit rate;
- turnover;
- exposicao liquida;
- exposicao bruta;
- capacidade;
- custo de execucao.

Capacidade e o quanto de capital a estrategia consegue absorver antes de custos e impacto de mercado destruirem o retorno.

---

## Exemplo Simples em Python

```python
import pandas as pd

precos = pd.Series([100, 102, 101, 105, 110])
retornos = precos.pct_change().dropna()

retorno_acumulado = (1 + retornos).prod() - 1
volatilidade = retornos.std()

print(round(retorno_acumulado, 4))
print(round(volatilidade, 4))
```

---

## Vieses Comuns

- Look-ahead bias: usar informacao que nao existia no momento da decisao.
- Survivorship bias: testar apenas ativos sobreviventes.
- Data snooping: testar muitas ideias ate achar uma por acaso.
- Overfitting: ajustar parametros demais ao passado.
- Selection bias: escolher universo depois de ver resultado.
- Rebalanceamento irrealista.
- Custos ignorados.
- Liquidez ignorada.

---

## Checklist Profissional

- A hipotese e clara?
- Os dados estavam disponiveis na data da decisao?
- Ha custos, slippage e restricoes?
- O resultado funciona fora da amostra?
- A estrategia depende de poucos eventos?
- O risco de cauda foi medido?
- O turnover e viavel?
- A logica economica faz sentido?
- O codigo e testavel?
- O resultado e reproduzivel?

---

## Exercicios

1. Escreva tres hipoteses quantitativas testaveis.
2. Liste possiveis vieses em uma estrategia de momentum.
3. Calcule retorno acumulado e volatilidade de uma serie.
4. Explique por que retorno alto sem controle de risco pode ser inutil.
5. Defina metricas para avaliar uma estrategia mensal.
