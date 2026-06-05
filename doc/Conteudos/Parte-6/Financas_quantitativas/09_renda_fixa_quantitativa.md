# Renda Fixa Quantitativa

Renda fixa quantitativa modela fluxos, taxas, curvas, sensibilidade e risco de instrumentos de juros e credito.

---

## Preco por Fluxo Descontado

```python
def preco_fluxos(fluxos, taxas):
    return sum(fc / (1 + taxa) ** t for t, (fc, taxa) in enumerate(zip(fluxos, taxas), start=1))

fluxos = [50, 50, 1050]
taxas = [0.10, 0.10, 0.10]
print(preco_fluxos(fluxos, taxas))
```

---

## Yield to Maturity

YTM e a taxa que iguala preco ao valor presente dos fluxos.

```python
from scipy.optimize import root_scalar

def ytm(preco, fluxos):
    def objetivo(taxa):
        return sum(fc / (1 + taxa) ** t for t, fc in enumerate(fluxos, start=1)) - preco

    sol = root_scalar(objetivo, bracket=[-0.99, 1.0])
    return sol.root
```

---

## Duration

```python
def duration_macaulay(fluxos, taxa):
    valores_presentes = [fc / (1 + taxa) ** t for t, fc in enumerate(fluxos, start=1)]
    preco = sum(valores_presentes)
    return sum(t * vp / preco for t, vp in enumerate(valores_presentes, start=1))
```

Duration modificada:

```text
D_mod = D_mac / (1 + y)
```

---

## Convexidade

Convexidade melhora aproximacao de preco quando taxa muda.

```python
def convexidade(fluxos, taxa):
    preco = sum(fc / (1 + taxa) ** t for t, fc in enumerate(fluxos, start=1))
    return sum(
        t * (t + 1) * fc / (1 + taxa) ** (t + 2)
        for t, fc in enumerate(fluxos, start=1)
    ) / preco
```

---

## Curva de Juros

Curvas podem ser:

- spot;
- forward;
- par;
- nominal;
- real;
- credito.

Interpolacao e bootstrap sao tecnicas comuns para construir curvas.

---

## Spread de Credito

Spread compensa risco de credito, liquidez, tributacao e premio de risco.

Analises comuns:

- spread sobre curva livre de risco;
- z-spread;
- option-adjusted spread;
- probabilidade implicita de default.

---

## Risco de Renda Fixa

- risco de taxa;
- risco de credito;
- risco de curva;
- risco de reinvestimento;
- risco de liquidez;
- risco de inflacao;
- risco de convexidade negativa.

---

## Exercicios

1. Prece um titulo por fluxo descontado.
2. Calcule YTM numericamente.
3. Calcule duration e duration modificada.
4. Calcule convexidade.
5. Simule impacto de choque paralelo na curva.
