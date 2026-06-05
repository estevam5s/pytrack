# Financas Quantitativas com Python

Trilha completa e profissional de financas quantitativas com Python: dados de mercado, retornos, estatistica, series temporais, risco, otimizacao de carteiras, backtesting, modelos fatoriais, renda fixa quantitativa, derivativos, execucao, microestrutura e projetos aplicados.

Financas quantitativas nao e apenas aplicar formulas em precos historicos. O trabalho profissional exige dados auditaveis, hipoteses explicitas, estatistica bem usada, validacao fora da amostra, controle de risco, custos realistas, monitoramento e disciplina contra vieses.

---

## Arquivos da Trilha

1. [Fundamentos de Financas Quantitativas](./01_fundamentos_financas_quantitativas.md)
2. [Dados de Mercado, Retornos e Preparacao](./02_dados_mercado_retornos.md)
3. [Estatistica Aplicada a Mercados Financeiros](./03_estatistica_financeira.md)
4. [Series Temporais Financeiras](./04_series_temporais_financeiras.md)
5. [Risco Quantitativo: VaR, ES, Drawdown e Stress](./05_risco_quantitativo.md)
6. [Portfolio Quantitativo e Otimizacao](./06_portfolio_otimizacao.md)
7. [Backtesting Profissional e Validacao](./07_backtesting_validacao.md)
8. [Modelos Fatoriais e Alphas](./08_modelos_fatoriais_alphas.md)
9. [Renda Fixa Quantitativa](./09_renda_fixa_quantitativa.md)
10. [Derivativos, Volatilidade e Precificacao](./10_derivativos_volatilidade_precificacao.md)
11. [Execucao, Custos, Liquidez e Microestrutura](./11_execucao_custos_microestrutura.md)
12. [Projetos Profissionais de Financas Quantitativas](./12_projetos_quantitativos.md)

---

## Bibliotecas Principais

```bash
pip install numpy pandas scipy statsmodels matplotlib seaborn scikit-learn yfinance pyarrow openpyxl pytest
```

Use bibliotecas externas com criterio. Para pesquisa quantitativa, `numpy`, `pandas`, `scipy`, `statsmodels` e `matplotlib` resolvem grande parte do fluxo. Para producao, inclua validacao de dados, testes, logs, versionamento de datasets, controle de configuracao e separacao entre pesquisa e execucao.

---

## Competencias Esperadas

Ao concluir esta trilha, voce deve saber:

- preparar dados de mercado sem vazamento temporal;
- calcular retornos simples, logaritmicos, acumulados e anualizados;
- estimar volatilidade, correlacao, beta, drawdown, VaR e Expected Shortfall;
- modelar series temporais financeiras;
- montar e avaliar carteiras quantitativas;
- implementar backtests com custos, slippage, rebalanceamento e restricoes;
- reconhecer vieses de pesquisa;
- testar fatores e sinais quantitativos;
- calcular duration, convexidade e sensibilidade de renda fixa;
- precificar derivativos basicos e estimar volatilidade;
- avaliar liquidez e custo de execucao;
- organizar projetos quant em Python com codigo testavel e reproduzivel.

---

## Estrutura Recomendada de Projeto

```text
quant-research/
├── README.md
├── pyproject.toml
├── configs/
├── data/
│   ├── raw/
│   ├── processed/
│   └── features/
├── notebooks/
├── reports/
├── src/
│   └── quant/
│       ├── data.py
│       ├── returns.py
│       ├── risk.py
│       ├── portfolio.py
│       ├── backtest.py
│       ├── factors.py
│       ├── fixed_income.py
│       ├── derivatives.py
│       └── execution.py
└── tests/
```

---

## Regra Principal

Um resultado quantitativo so e util quando sobrevive a verificacao: dados corretos, premissas claras, custos realistas, risco entendido, robustez testada e implementacao reproduzivel.
