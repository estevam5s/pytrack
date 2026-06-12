# Derivativos, Volatilidade e Precificacao

Derivativos sao instrumentos cujo valor depende de um ativo, indice, taxa ou evento. Financas quantitativas estudam payoff, risco, volatilidade, hedging e precificacao.

---

## Payoff de Opcoes

```python
import numpy as np

def call_payoff(S, K):
    return np.maximum(S - K, 0)

def put_payoff(S, K):
    return np.maximum(K - S, 0)
```

Lucro considera premio pago ou recebido.

---

## Black-Scholes

```python
from scipy.stats import norm
import numpy as np

def black_scholes_call(S, K, r, sigma, T):
    d1 = (np.log(S / K) + (r + 0.5 * sigma**2) * T) / (sigma * np.sqrt(T))
    d2 = d1 - sigma * np.sqrt(T)
    return S * norm.cdf(d1) - K * np.exp(-r * T) * norm.cdf(d2)

def black_scholes_put(S, K, r, sigma, T):
    d1 = (np.log(S / K) + (r + 0.5 * sigma**2) * T) / (sigma * np.sqrt(T))
    d2 = d1 - sigma * np.sqrt(T)
    return K * np.exp(-r * T) * norm.cdf(-d2) - S * norm.cdf(-d1)
```

Premissas: volatilidade constante, mercado continuo, sem custos, taxa constante, lognormalidade e possibilidade de hedge continuo.

---

## Gregas

- Delta: sensibilidade ao preco do ativo.
- Gamma: sensibilidade do delta.
- Vega: sensibilidade a volatilidade.
- Theta: sensibilidade ao tempo.
- Rho: sensibilidade a taxa.

Gregas ajudam a gerenciar risco, nao apenas precificar.

---

## Volatilidade Historica

```python
vol_hist = retornos.std() * 252**0.5
```

---

## Volatilidade Implicita

Volatilidade implicita e a volatilidade que faz o modelo reproduzir o preco observado da opcao.

```python
from scipy.optimize import root_scalar

def implied_vol_call(preco_mercado, S, K, r, T):
    def objetivo(sigma):
        return black_scholes_call(S, K, r, sigma, T) - preco_mercado

    sol = root_scalar(objetivo, bracket=[1e-6, 5.0])
    return sol.root
```

---

## Simulacao Monte Carlo

```python
def monte_carlo_call(S, K, r, sigma, T, n=100_000):
    z = np.random.normal(size=n)
    ST = S * np.exp((r - 0.5 * sigma**2) * T + sigma * np.sqrt(T) * z)
    payoff = np.maximum(ST - K, 0)
    return np.exp(-r * T) * payoff.mean()
```

Monte Carlo e flexivel, mas exige controle de erro, semente e desempenho.

---

## Sorriso de Volatilidade

Na pratica, volatilidade implicita varia por strike e vencimento. Isso contradiz Black-Scholes simples e revela assimetria, caudas e oferta/demanda por protecao.

---

## Exercicios

1. Plote payoff de call e put.
2. Implemente Black-Scholes para call e put.
3. Calcule volatilidade implicita.
4. Simule preco de call por Monte Carlo.
5. Compare volatilidade historica e implicita.
