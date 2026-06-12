# Testes em Python

Trilha completa e progressiva para dominar testes em Python: Pytest, unit tests, integration tests, mocking, TDD, coverage e benchmark.

O objetivo é sair de testes simples com `assert` até uma estratégia profissional de qualidade: testes rápidos, confiáveis, organizados, automatizados em CI, com cobertura útil, isolamento adequado, testes de integração reais e benchmarks que ajudam a tomar decisões técnicas.

---

## Arquivos da Trilha

1. [Pytest: Fundamentos, Fixtures, Parametrização e Plugins](./01_pytest.md)
2. [Unit Tests: Testes Unitários Profissionais](./02_unit_tests.md)
3. [Integration Tests: Banco, APIs, Filas e Serviços Externos](./03_integration_tests.md)
4. [Mocking: Mocks, Stubs, Fakes, Spies e Patches](./04_mocking.md)
5. [TDD: Test-Driven Development em Python](./05_tdd.md)
6. [Coverage: Cobertura, Qualidade e Métricas Úteis](./06_coverage.md)
7. [Benchmark: Performance, pytest-benchmark e Profiling](./07_benchmark.md)

---

## Competências Esperadas

Ao concluir esta trilha, você deve saber:

- escrever testes com Pytest;
- organizar suites de testes por camada;
- criar fixtures reutilizáveis;
- parametrizar cenários;
- testar funções, classes, APIs, bancos e integrações;
- usar mocks sem acoplar testes à implementação;
- aplicar TDD com pragmatismo;
- medir coverage sem perseguir número vazio;
- automatizar testes em CI;
- criar benchmarks reproduzíveis;
- diferenciar teste unitário, integração, contrato, end-to-end e performance.

---

## Estrutura Recomendada

```text
projeto/
├── app/
│   ├── __init__.py
│   ├── domain/
│   ├── services/
│   └── infra/
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   ├── conftest.py
│   └── factories.py
├── pyproject.toml
└── README.md
```

---

## Dependências Comuns

```bash
pip install pytest pytest-cov pytest-mock pytest-benchmark factory-boy freezegun responses httpx
```

Use apenas o necessário. Uma base de testes boa começa simples e cresce conforme o risco do projeto.

