# Backtesting Profissional e Validacao

Backtesting simula uma estrategia com dados historicos. Um backtest profissional nao tenta provar que uma estrategia vai funcionar; ele testa se a ideia teria sobrevivido a regras, custos, restricoes e validacao rigorosa.

---

## Componentes de um Backtest

- universo de ativos;
- calendario;
- dados disponiveis em cada data;
- regras de sinal;
- regras de posicao;
- rebalanceamento;
- custos;
- slippage;
- restricoes de liquidez;
- metricas;
- logs e auditoria.

---

## Backtest Vetorizado Simples

```python
import pandas as pd

precos = pd.Series([100, 102, 101, 105, 103, 108])
retornos = precos.pct_change()

sinal = precos.pct_change(3)
posicao = (sinal > 0).astype(int).shift(1)

retorno_estrategia = posicao * retornos
patrimonio = (1 + retorno_estrategia.fillna(0)).cumprod()
print(patrimonio)
```

O `shift(1)` e essencial para evitar look-ahead.

---

## Custos e Turnover

```python
turnover = posicao.diff().abs().fillna(0)
custo_por_operacao = 0.001
retorno_liquido = retorno_estrategia - turnover * custo_por_operacao
```

Estrategias com turnover alto podem parecer boas antes dos custos e ruins depois.

---

## Validacao Fora da Amostra

Divida dados:

- treino;
- validacao;
- teste;
- periodo fora da amostra;
- walk-forward.

Nao escolha parametros olhando o periodo de teste.

---

## Walk-Forward

```text
treina janela 1 -> testa periodo seguinte
treina janela 2 -> testa periodo seguinte
...
```

Mais realista que otimizar uma vez no historico inteiro.

---

## Metricas de Backtest

- CAGR;
- volatilidade;
- Sharpe;
- Sortino;
- max drawdown;
- Calmar;
- turnover;
- exposicao media;
- hit rate;
- skew;
- curtose;
- VaR e ES;
- pior mes;
- pior sequencia de perdas.

---

## Vieses Criticos

- look-ahead bias;
- survivorship bias;
- overfitting;
- data snooping;
- selection bias;
- rebalanceamento impossivel;
- custos subestimados;
- liquidez ignorada;
- atraso de dados ignorado.

---

## Checklist de Backtest

- Sinal esta deslocado?
- Dados existiam na data?
- Ha custos e slippage?
- Universo e historico correto?
- Parametros foram escolhidos sem olhar teste?
- Resultado depende de poucos trades?
- Ha analise por subperiodo?
- Codigo tem testes?

---

## Exercicios

1. Implemente estrategia de media movel com `shift`.
2. Adicione custo proporcional ao turnover.
3. Calcule Sharpe e max drawdown.
4. Separe periodo in-sample e out-of-sample.
5. Monte relatorio de backtest em DataFrame.
