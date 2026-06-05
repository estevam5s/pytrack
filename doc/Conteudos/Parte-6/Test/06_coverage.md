# Coverage: Cobertura, Qualidade e Métricas Úteis

Coverage mede quais linhas, branches ou caminhos foram executados pelos testes. É uma ferramenta de feedback, não garantia de qualidade.

100% de cobertura pode esconder testes ruins. 60% bem escolhidos pode ser mais útil que 95% superficial. O objetivo é encontrar áreas sem teste e reduzir risco.

---

## Instalação

```bash
pip install pytest-cov
```

Executar:

```bash
pytest --cov=app
```

Relatório no terminal:

```bash
pytest --cov=app --cov-report=term-missing
```

HTML:

```bash
pytest --cov=app --cov-report=html
```

Abrir:

```text
htmlcov/index.html
```

---

## Configuração

`pyproject.toml`:

```toml
[tool.coverage.run]
source = ["app"]
branch = true
omit = [
    "*/migrations/*",
    "*/tests/*",
]

[tool.coverage.report]
show_missing = true
skip_covered = true
fail_under = 80
```

Executar:

```bash
pytest --cov
```

---

## Line Coverage vs Branch Coverage

Line coverage verifica linhas executadas.

Branch coverage verifica caminhos.

Exemplo:

```python
def classificar(idade: int) -> str:
    if idade >= 18:
        return "adulto"
    return "menor"
```

Um teste só com idade 20 executa parte das linhas, mas não valida o branch menor. Use `branch = true`.

---

## Cobertura Não É Qualidade

Teste ruim com cobertura alta:

```python
def test_calcular():
    calcular_total([1, 2, 3])
```

Executa a função, mas não afirma nada.

Teste útil:

```python
def test_calcular_total():
    assert calcular_total([1, 2, 3]) == 6
```

---

## fail_under

```toml
[tool.coverage.report]
fail_under = 85
```

Útil em CI para evitar queda de cobertura. Mas defina meta realista.

Estratégia para legado:

- medir cobertura atual;
- definir meta um pouco abaixo/igual;
- aumentar gradualmente;
- exigir testes em código novo.

---

## Coverage por Contexto

Coverage avançado pode identificar quais testes cobrem quais linhas.

```bash
coverage run --context=unit -m pytest tests/unit
coverage run --context=integration -m pytest tests/integration
coverage combine
coverage html --show-contexts
```

Útil em projetos grandes.

---

## O Que Excluir

Pode fazer sentido excluir:

- migrations;
- arquivos de configuração;
- código gerado;
- branches impossíveis;
- blocos `if TYPE_CHECKING`;
- entrada `if __name__ == "__main__"` simples.

Exemplo:

```python
if __name__ == "__main__":  # pragma: no cover
    main()
```

Não use exclusão para esconder código sem teste importante.

---

## Coverage em CI

GitHub Actions:

```yaml
- name: Test with coverage
  run: pytest --cov=app --cov-report=xml --cov-report=term-missing
```

Artefato:

```yaml
- uses: actions/upload-artifact@v4
  with:
    name: coverage-html
    path: htmlcov
```

---

## Mutation Testing

Coverage diz que executou. Mutation testing verifica se teste detecta alteração.

Ferramentas:

- mutmut;
- cosmic-ray.

Exemplo de mutação:

```python
if total > 100:
```

vira:

```python
if total >= 100:
```

Se testes continuam passando, talvez estejam fracos.

---

## Checklist Coverage

- branch coverage está ativo?
- relatório mostra linhas faltantes?
- meta é realista?
- código crítico tem cobertura alta?
- testes têm asserts úteis?
- coverage não inclui migrations/código gerado?
- CI falha se cobertura cair?
- cobertura é usada para guiar melhoria, não vaidade?

