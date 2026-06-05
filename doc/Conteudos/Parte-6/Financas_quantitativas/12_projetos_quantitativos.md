# Projetos Profissionais de Financas Quantitativas

Projetos consolidam teoria, dados, estatistica, risco e codigo. Cada projeto deve ser reproduzivel, documentado e testavel.

---

## Projeto 1: Biblioteca de Retornos e Risco

Funcionalidades:

- retorno simples;
- retorno logaritmico;
- retorno acumulado;
- volatilidade anualizada;
- Sharpe;
- max drawdown;
- VaR;
- Expected Shortfall.

Requisitos:

- funcoes puras;
- testes com dados pequenos;
- tolerancia para floats;
- README com formulas.

---

## Projeto 2: Backtester de Estrategia Simples

Funcionalidades:

- estrategia de media movel;
- sinal deslocado;
- custo por turnover;
- curva de patrimonio;
- metricas;
- relatorio final.

Valide:

- sem look-ahead;
- custo funcionando;
- posicao correta;
- datas alinhadas.

---

## Projeto 3: Otimizador de Carteiras

Funcionalidades:

- minima variancia;
- max Sharpe;
- restricoes long-only;
- limite por ativo;
- contribuicao de risco;
- comparacao com equal weight.

---

## Projeto 4: Pesquisa de Fator Momentum

Funcionalidades:

- carregar precos de varios ativos;
- calcular momentum 12-1;
- rankear ativos;
- formar quantis;
- medir retorno por quantil;
- calcular IC;
- avaliar turnover.

---

## Projeto 5: Renda Fixa Quantitativa

Funcionalidades:

- precificar bond;
- calcular YTM;
- calcular duration;
- calcular convexidade;
- simular choque de curva;
- gerar tabela de sensibilidade.

---

## Projeto 6: Precificacao de Opcoes

Funcionalidades:

- Black-Scholes;
- gregas basicas;
- volatilidade implicita;
- Monte Carlo;
- grafico de payoff;
- comparacao de cenarios.

---

## Estrutura Recomendada

```text
quant-projects/
├── README.md
├── pyproject.toml
├── data/
├── notebooks/
├── reports/
├── src/
│   └── quant_projects/
│       ├── returns.py
│       ├── risk.py
│       ├── backtest.py
│       ├── portfolio.py
│       ├── factors.py
│       ├── fixed_income.py
│       └── derivatives.py
└── tests/
```

---

## Checklist de Entrega

- Dados de entrada documentados.
- Premissas declaradas.
- Codigo separado por responsabilidade.
- Testes para calculos centrais.
- Relatorio com metricas e graficos.
- Custos e riscos considerados.
- Limites do estudo explicados.
- Resultado reproduzivel.

---

## Exercicios Finais

1. Implemente a biblioteca de retornos e risco.
2. Crie backtest com custo e slippage.
3. Compare equal weight, minima variancia e max Sharpe.
4. Construa fator momentum e calcule IC.
5. Gere um relatorio profissional em Markdown ou Excel.
