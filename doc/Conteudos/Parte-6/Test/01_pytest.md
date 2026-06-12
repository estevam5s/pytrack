# Pytest: Fundamentos, Fixtures, Parametrização e Plugins

Pytest é o framework de testes mais usado no ecossistema Python moderno. Ele é simples para começar, mas poderoso para projetos grandes: fixtures, parametrização, plugins, marks, captura de logs, monkeypatch, configuração centralizada e integração com coverage, benchmark e CI.

---

## Instalação

```bash
pip install pytest
```

Estrutura mínima:

```text
projeto/
├── calculadora.py
└── tests/
    └── test_calculadora.py
```

`calculadora.py`:

```python
def somar(a: int, b: int) -> int:
    return a + b
```

`tests/test_calculadora.py`:

```python
from calculadora import somar


def test_somar():
    assert somar(2, 3) == 5
```

Executar:

```bash
pytest
pytest -q
```

---

## Descoberta de Testes

Pytest encontra:

- arquivos `test_*.py`;
- arquivos `*_test.py`;
- funções `test_*`;
- classes `Test*` sem `__init__`.

Exemplo:

```python
class TestCalculadora:
    def test_soma_positivos(self):
        assert 2 + 2 == 4
```

---

## Assert Simples e Poderoso

Pytest melhora mensagens de `assert`.

```python
def test_lista():
    resultado = [1, 2, 3]
    assert resultado == [1, 2, 3]
```

Não precisa usar `self.assertEqual` como no `unittest`, embora seja possível.

---

## Testando Exceções

```python
import pytest


def dividir(a: int, b: int) -> float:
    if b == 0:
        raise ValueError("Divisão por zero")
    return a / b


def test_dividir_por_zero():
    with pytest.raises(ValueError, match="zero"):
        dividir(10, 0)
```

---

## Fixtures

Fixtures preparam dados, objetos e recursos.

```python
import pytest


@pytest.fixture
def usuario():
    return {"id": 1, "nome": "Ana"}


def test_usuario(usuario):
    assert usuario["nome"] == "Ana"
```

Fixtures podem depender de fixtures:

```python
@pytest.fixture
def cliente(usuario):
    return {"id": 10, "usuario": usuario}
```

---

## Fixture com Setup e Teardown

```python
import tempfile
from pathlib import Path
import pytest


@pytest.fixture
def arquivo_temp():
    with tempfile.TemporaryDirectory() as tmp:
        caminho = Path(tmp) / "dados.txt"
        caminho.write_text("conteudo", encoding="utf-8")
        yield caminho
```

Tudo depois do `yield` funciona como teardown.

---

## Escopos de Fixtures

```python
@pytest.fixture(scope="function")
def por_teste():
    ...

@pytest.fixture(scope="module")
def por_modulo():
    ...

@pytest.fixture(scope="session")
def por_sessao():
    ...
```

Use escopo maior apenas quando o recurso é caro e seguro de compartilhar. Estado compartilhado pode causar testes flakey.

---

## conftest.py

Fixtures compartilhadas ficam em `conftest.py`.

```python
# tests/conftest.py
import pytest


@pytest.fixture
def auth_headers():
    return {"Authorization": "Bearer token"}
```

Pytest carrega `conftest.py` automaticamente.

---

## Parametrização

```python
import pytest


@pytest.mark.parametrize(
    "a,b,esperado",
    [
        (1, 2, 3),
        (0, 0, 0),
        (-1, 1, 0),
    ],
)
def test_somar(a, b, esperado):
    assert a + b == esperado
```

Parametrização reduz duplicação e torna cenários explícitos.

---

## Marks

```python
import pytest


@pytest.mark.integration
def test_banco_real():
    ...
```

Executar só unitários:

```bash
pytest -m "not integration"
```

Configurar marks em `pyproject.toml`:

```toml
[tool.pytest.ini_options]
markers = [
    "integration: testes que usam serviços externos",
    "slow: testes lentos",
]
```

---

## tmp_path

Fixture nativa para arquivos temporários.

```python
def test_escrever_arquivo(tmp_path):
    arquivo = tmp_path / "saida.txt"
    arquivo.write_text("ok", encoding="utf-8")
    assert arquivo.read_text(encoding="utf-8") == "ok"
```

---

## monkeypatch

Altera ambiente, atributos e funções durante o teste.

```python
import os


def ler_ambiente() -> str:
    return os.environ["APP_ENV"]


def test_ler_ambiente(monkeypatch):
    monkeypatch.setenv("APP_ENV", "test")
    assert ler_ambiente() == "test"
```

---

## caplog

Captura logs.

```python
import logging

logger = logging.getLogger(__name__)


def executar():
    logger.warning("falha recuperável")


def test_logs(caplog):
    executar()
    assert "falha recuperável" in caplog.text
```

---

## capsys

Captura stdout/stderr.

```python
def test_print(capsys):
    print("hello")
    captured = capsys.readouterr()
    assert captured.out == "hello\n"
```

---

## Configuração no pyproject.toml

```toml
[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = ["test_*.py"]
addopts = "-ra --strict-markers"
markers = [
    "unit: testes unitários",
    "integration: testes de integração",
    "slow: testes lentos",
]
```

`-ra` mostra resumo útil de skips/falhas. `--strict-markers` evita marcações digitadas errado.

---

## Plugins Úteis

- `pytest-cov`: cobertura.
- `pytest-mock`: integração com mock.
- `pytest-benchmark`: benchmark.
- `pytest-xdist`: paralelismo.
- `pytest-asyncio`: testes async.
- `pytest-django`: Django.
- `pytest-freezegun`: controle de tempo.

---

## Testes Async

```bash
pip install pytest-asyncio
```

```python
import pytest


async def buscar_valor():
    return 42


@pytest.mark.asyncio
async def test_buscar_valor():
    assert await buscar_valor() == 42
```

---

## Checklist Pytest

- nomes de testes descrevem comportamento?
- fixtures são pequenas e reutilizáveis?
- `conftest.py` não virou depósito confuso?
- parametrização cobre casos relevantes?
- marks separam testes lentos/integrados?
- testes são independentes?
- falhas são fáceis de entender?
- configuração está no `pyproject.toml`?

