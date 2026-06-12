# Execucao, Custos, Liquidez e Microestrutura

Uma estrategia lucrativa no backtest pode falhar na execucao. Custos, liquidez, spread, impacto de mercado e latencia podem destruir o retorno esperado.

---

## Tipos de Custos

- Corretagem.
- Emolumentos.
- Taxas de bolsa.
- Bid-ask spread.
- Slippage.
- Impacto de mercado.
- Custo de oportunidade.
- Impostos.
- Borrow fee em short.

Backtests sem custos sao apenas ponto de partida.

---

## Bid-Ask Spread

```text
spread = ask - bid
spread_relativo = (ask - bid) / mid
mid = (ask + bid) / 2
```

```python
bid = 99.95
ask = 100.05
mid = (bid + ask) / 2
spread_rel = (ask - bid) / mid
print(spread_rel)
```

---

## Slippage

Slippage e diferenca entre preco esperado e preco executado.

```python
preco_sinal = 100
preco_execucao = 100.08
slippage = preco_execucao / preco_sinal - 1
print(slippage)
```

---

## Impacto de Mercado

Ordens grandes movem preco. Impacto depende de:

- tamanho da ordem;
- volume medio;
- volatilidade;
- profundidade do book;
- urgencia;
- fragmentacao de mercado.

Regra simples:

```python
participacao_volume = ordem / volume_medio
```

Quanto maior a participacao, maior tende a ser o impacto.

---

## Turnover e Capacidade

```python
turnover = pesos.diff().abs().sum(axis=1)
```

Capacidade depende do quanto a estrategia consegue operar sem degradar retorno.

---

## Tipos de Ordem

- Mercado: prioriza execucao.
- Limitada: prioriza preco.
- Stop: dispara por preco.
- VWAP: tenta acompanhar volume.
- TWAP: divide ao longo do tempo.

Cada tipo troca certeza de execucao por controle de preco.

---

## Microestrutura

Temas importantes:

- book de ofertas;
- trades;
- prioridade preco-tempo;
- spread;
- profundidade;
- latencia;
- adverse selection;
- market impact;
- fragmentacao.

---

## Checklist de Execucao

- O ativo tem volume suficiente?
- A ordem e grande em relacao ao volume?
- O spread foi considerado?
- O backtest usa preco executavel?
- Ha restricao de short?
- Ha atraso de sinal?
- O turnover e sustentavel?
- A estrategia tem capacidade?

---

## Exercicios

1. Calcule spread absoluto e relativo.
2. Calcule slippage de uma ordem.
3. Estime turnover de uma carteira.
4. Simule custo proporcional ao turnover.
5. Defina limite maximo de participacao no volume.
