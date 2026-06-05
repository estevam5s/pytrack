# Benchmark: Performance, pytest-benchmark e Profiling

Benchmark mede performance de forma controlada. Em Python, benchmarks ajudam a comparar algoritmos, detectar regressões e validar otimizações. Eles devem ser feitos com cuidado, porque medições ruins levam a decisões ruins.

---

## Benchmark Não É Teste Funcional

Teste funcional:

```python
assert ordenar([3, 1, 2]) == [1, 2, 3]
```

Benchmark:

```python
quanto tempo ordenar leva com 100.000 itens?
```

Antes de otimizar, confirme que existe problema real.

---

## timeit

```python
import timeit


tempo = timeit.timeit(
    "sum(range(1000))",
    number=10000,
)
print(tempo)
```

Para funções:

```python
def calcular():
    return sum(range(1000))


tempo = timeit.timeit(calcular, number=10000)
```

---

## pytest-benchmark

```bash
pip install pytest-benchmark
```

```python
def calcular_total(itens):
    return sum(item["preco"] * item["quantidade"] for item in itens)


def test_benchmark_calcular_total(benchmark):
    itens = [{"preco": 10, "quantidade": 2} for _ in range(1000)]
    resultado = benchmark(calcular_total, itens)
    assert resultado == 20000
```

Executar:

```bash
pytest tests/benchmark
```

---

## Comparando Implementações

```python
def total_for(itens):
    total = 0
    for item in itens:
        total += item["preco"] * item["quantidade"]
    return total


def total_sum(itens):
    return sum(item["preco"] * item["quantidade"] for item in itens)


def test_benchmark_total_for(benchmark):
    itens = [{"preco": 10, "quantidade": 2} for _ in range(10000)]
    benchmark(total_for, itens)


def test_benchmark_total_sum(benchmark):
    itens = [{"preco": 10, "quantidade": 2} for _ in range(10000)]
    benchmark(total_sum, itens)
```

---

## Salvando Resultados

```bash
pytest --benchmark-save=baseline
pytest --benchmark-compare=baseline
```

Útil para detectar regressões.

---

## Cuidados com Benchmark

Controle:

- tamanho dos dados;
- aquecimento;
- máquina;
- processos concorrentes;
- I/O;
- cache;
- aleatoriedade;
- versão do Python;
- dependências.

Não compare benchmark local em notebook cheio de processos com CI sem contexto.

---

## Profiling

Benchmark diz quanto demora. Profiling mostra onde o tempo é gasto.

```bash
python -m cProfile -o profile.out script.py
```

Visualizar:

```bash
python -m pstats profile.out
```

Ferramentas:

- cProfile;
- py-spy;
- scalene;
- line_profiler;
- snakeviz.

---

## cProfile em Código

```python
import cProfile
import pstats


def main():
    executar_rotina()


with cProfile.Profile() as profile:
    main()

stats = pstats.Stats(profile)
stats.sort_stats("cumtime").print_stats(20)
```

---

## Otimização Guiada por Dados

Processo:

1. Meça comportamento atual.
2. Identifique gargalo.
3. Crie hipótese.
4. Otimize uma coisa.
5. Meça de novo.
6. Verifique que testes funcionais continuam passando.

Evite micro-otimização antes de saber gargalo.

---

## Benchmarks em CI

Benchmarks em CI podem ser ruidosos. Use para:

- detectar regressões grandes;
- comparar baseline;
- alertar, não necessariamente bloquear sempre;
- rodar em máquina estável quando possível.

Exemplo:

```bash
pytest tests/benchmark --benchmark-only --benchmark-json=benchmark.json
```

---

## Checklist Benchmark

- existe problema de performance real?
- benchmark representa caso de uso real?
- dados de entrada são controlados?
- resultado funcional também é validado?
- baseline foi salvo?
- ambiente de medição é conhecido?
- profiling confirmou gargalo?
- otimização melhorou sem piorar legibilidade demais?
- regressões são monitoradas?

