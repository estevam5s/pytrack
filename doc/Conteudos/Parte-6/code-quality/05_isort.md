# isort: Organização Profissional de Imports

isort organiza imports automaticamente. Imports consistentes reduzem ruído em diffs e facilitam leitura sobre dependências usadas por um módulo.

---

## Instalação

```bash
pip install isort
```

Formatar imports:

```bash
isort .
```

Verificar:

```bash
isort --check-only .
```

Mostrar diff:

```bash
isort --diff .
```

---

## Grupos de Imports

isort separa:

```python
import os
from pathlib import Path

import requests
from sqlalchemy.orm import Session

from app.models import Usuario
from app.services import CriarUsuario
```

Ordem:

1. standard library;
2. terceiros;
3. aplicação local.

---

## Configuração com Black

`pyproject.toml`:

```toml
[tool.isort]
profile = "black"
line_length = 88
known_first_party = ["app"]
skip = [".venv", "build", "dist", "migrations"]
```

`profile = "black"` evita conflito de formatação.

---

## first_party

Ajuda isort a reconhecer seu pacote.

```toml
known_first_party = ["meu_projeto", "app"]
```

Sem isso, imports locais podem cair no grupo errado.

---

## isort em CI

```yaml
- name: Check imports
  run: isort --check-only .
```

Com Black:

```yaml
- run: isort --check-only .
- run: black --check .
```

Ordem local comum:

```bash
isort .
black .
```

---

## isort com pre-commit

```yaml
repos:
  - repo: https://github.com/pycqa/isort
    rev: 5.13.2
    hooks:
      - id: isort
```

Se usar Ruff com regra `I`, talvez não precise de isort separado.

---

## Ruff Pode Substituir isort

Ruff:

```toml
[tool.ruff.lint]
select = ["I"]
```

Corrigir:

```bash
ruff check . --fix
```

Escolha uma ferramenta para ordenar imports. Usar isort e Ruff `I` juntos pode funcionar, mas aumenta redundância.

---

## Imports Como Sinal de Design

Imports revelam acoplamento.

Sinais de atenção:

- módulo de domínio importa Flask/FastAPI;
- serviço de regra importa driver de banco diretamente;
- arquivo pequeno importa muitas bibliotecas;
- import circular;
- `from x import *`.

isort organiza, mas não resolve design ruim.

---

## Checklist isort

- `profile = "black"` está configurado?
- `known_first_party` inclui pacotes locais?
- CI verifica imports?
- pre-commit organiza antes do commit?
- Ruff não está duplicando papel sem decisão?
- imports circulares foram tratados no design?

