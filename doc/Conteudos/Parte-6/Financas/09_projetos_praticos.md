# Projetos Praticos de Financas com Python

Projetos praticos consolidam conceitos financeiros, calculo, dados e comunicacao. Cada projeto deve ter entrada clara, processamento reproduzivel, saida verificavel e explicacao das premissas.

---

## Projeto 1: Simulador de Juros Compostos

Objetivo: calcular evolucao de patrimonio com aportes mensais.

Entradas:

- valor inicial;
- aporte mensal;
- taxa mensal;
- numero de meses.

Saidas:

- patrimonio final;
- total aportado;
- juros acumulados;
- grafico de evolucao.

```python
def simular_aportes(valor_inicial, aporte, taxa, meses):
    saldo = valor_inicial
    historico = []

    for mes in range(1, meses + 1):
        saldo = saldo * (1 + taxa) + aporte
        historico.append({"mes": mes, "saldo": saldo})

    return historico
```

---

## Projeto 2: Comparador de Financiamento

Objetivo: comparar SAC e Price.

Saidas esperadas:

- tabela de parcelas;
- juros totais;
- amortizacao total;
- saldo devedor;
- grafico das parcelas.

Regras:

- taxa e prazo devem estar na mesma unidade;
- parcela deve ser validada;
- saldo final deve aproximar zero;
- resultados devem ser exportaveis para Excel.

---

## Projeto 3: Dashboard de Carteira

Objetivo: acompanhar uma carteira de ativos.

Indicadores:

- valor total;
- peso por ativo;
- peso por classe;
- retorno acumulado;
- volatilidade;
- max drawdown;
- concentracao;
- caixa;
- dividendos ou rendimentos.

Estrutura sugerida:

```text
data/
├── posicoes.csv
├── precos.csv
└── proventos.csv
```

---

## Projeto 4: Analise de Renda Fixa

Objetivo: calcular preco, duration e impacto de taxa em titulos.

Funcionalidades:

- cadastro de fluxo de caixa;
- taxa de desconto;
- preco teorico;
- duration;
- simulacao de choque de taxa;
- comparacao entre titulos.

---

## Projeto 5: Relatorio de Indicadores de Empresas

Objetivo: transformar demonstrativos em indicadores.

Indicadores:

- margem bruta;
- margem liquida;
- ROE;
- ROIC;
- liquidez corrente;
- divida liquida/EBITDA;
- crescimento de receita;
- crescimento de lucro.

Entregavel:

- planilha com indicadores;
- ranking por criterio;
- observacoes sobre qualidade dos dados;
- graficos comparativos.

---

## Projeto 6: Backtest de Estrategia Simples

Objetivo: testar uma regra objetiva.

Exemplo de regra:

- comprar quando media movel curta cruza acima da media longa;
- vender quando cruza abaixo;
- considerar custo de transacao;
- calcular retorno, volatilidade, Sharpe e drawdown.

Cuidados:

- nao usar dados futuros;
- aplicar custos;
- tratar dias sem preco;
- evitar otimizar parametros demais;
- comparar com benchmark.

---

## Projeto 7: Medidor de Risco

Objetivo: calcular risco de uma carteira.

Metricas:

- volatilidade;
- VaR historico;
- Expected Shortfall;
- beta;
- correlacao;
- drawdown;
- stress testing.

Saida recomendada:

```text
reports/
├── risco_carteira.xlsx
├── risco_carteira.md
└── graficos/
```

---

## Projeto 8: Oracamento Pessoal

Objetivo: classificar receitas e despesas.

Funcionalidades:

- importar extrato;
- categorizar lancamentos;
- separar fixo e variavel;
- calcular taxa de poupanca;
- identificar maiores despesas;
- projetar saldo futuro;
- gerar relatorio mensal.

---

## Checklist de Entrega

- README explica objetivo e como executar.
- Dados de exemplo estao incluidos ou descritos.
- Premissas estao documentadas.
- Calculos principais possuem testes.
- Saidas sao reproduziveis.
- Graficos possuem titulo, eixo e unidade.
- O projeto separa coleta, tratamento, calculo e relatorio.
- Limites e riscos da analise estao claros.

---

## Exercicios Finais

1. Escolha dois projetos e implemente uma primeira versao em scripts.
2. Transforme funcoes financeiras em modulos reutilizaveis.
3. Adicione testes para VPL, TIR, Price, SAC e max drawdown.
4. Gere um relatorio Excel com pelo menos tres abas.
5. Escreva um README tecnico com premissas, fontes e instrucoes.
