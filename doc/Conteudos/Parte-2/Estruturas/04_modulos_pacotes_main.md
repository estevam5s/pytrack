# Módulos, Pacotes, Imports e `if __name__ == "__main__"`

Este arquivo explica como organizar código Python em módulos e pacotes, como funcionam imports e, em profundidade, o papel de `if __name__ == "__main__"`.

---

## Sumário

1. [Módulos](#módulos)
2. [Imports](#imports)
3. [Pacotes](#pacotes)
4. [`__init__.py`](#__init__py)
5. [Imports Absolutos e Relativos](#imports-absolutos-e-relativos)
6. [`if __name__ == "__main__"`](#if-__name__--__main__)
7. [Executando com `python -m`](#executando-com-python--m)
8. [Organização Profissional](#organização-profissional)
9. [Armadilhas Frequentes](#armadilhas-frequentes)
10. [Exercícios](#exercícios)

---

## Módulos

Um módulo é um arquivo `.py`.

Exemplo `calculos.py`:

```python
def somar(a: int, b: int) -> int:
    return a + b
```

Outro arquivo:

```python
import calculos

print(calculos.somar(2, 3))
```

Também é possível importar nomes específicos:

```python
from calculos import somar

print(somar(2, 3))
```

---

## Imports

Ordem recomendada:

```python
import os
from pathlib import Path

import requests

from app.servicos import criar_usuario
```

Grupos:

1. biblioteca padrão;
2. bibliotecas externas;
3. módulos locais.

Evite:

```python
from calculos import *
```

Isso polui namespace e dificulta leitura.

Alias é útil quando é convenção:

```python
import pandas as pd
import numpy as np
```

---

## Pacotes

Pacote é um diretório com módulos Python.

Estrutura:

```text
meu_projeto/
  app/
    __init__.py
    main.py
    calculos.py
    usuarios.py
```

Import:

```python
from app.calculos import somar
```

---

## `__init__.py`

`__init__.py` marca o diretório como pacote tradicional e pode expor API pública.

```python
from app.calculos import somar

__all__ = ["somar"]
```

Uso:

```python
from app import somar
```

Boas práticas:

- mantenha `__init__.py` simples;
- evite efeitos colaterais pesados;
- não conecte banco ou leia arquivo automaticamente no import;
- use para expor API estável quando fizer sentido.

---

## Imports Absolutos e Relativos

Absoluto:

```python
from app.servicos.usuarios import criar_usuario
```

Relativo:

```python
from .usuarios import criar_usuario
from ..config import settings
```

Em aplicações, imports absolutos costumam ser mais claros.

Em pacotes internos, imports relativos podem reduzir repetição, mas podem confundir quando exagerados.

---

## `if __name__ == "__main__"`

Essa construção é uma das mais importantes para organizar scripts reutilizáveis.

### O que é `__name__`

Todo módulo Python recebe uma variável especial chamada `__name__`.

Quando um arquivo é importado, `__name__` recebe o nome do módulo.

Quando um arquivo é executado diretamente, `__name__` recebe `"__main__"`.

Exemplo `exemplo.py`:

```python
print(__name__)
```

Executando diretamente:

```bash
python exemplo.py
```

Saída:

```text
__main__
```

Importando:

```python
import exemplo
```

Saída:

```text
exemplo
```

### Por que isso importa

Sem proteção:

```python
def somar(a, b):
    return a + b

print(somar(2, 3))
```

Se outro arquivo importar esse módulo, o `print` será executado automaticamente. Isso é ruim para reuso e testes.

Com proteção:

```python
def somar(a: int, b: int) -> int:
    return a + b


if __name__ == "__main__":
    print(somar(2, 3))
```

Agora:

- se executar o arquivo diretamente, o `print` roda;
- se importar o módulo, apenas a função fica disponível.

### Padrão profissional com `main`

```python
def somar(a: int, b: int) -> int:
    return a + b


def main() -> int:
    resultado = somar(2, 3)
    print(resultado)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
```

Vantagens:

- `main` é testável;
- retorno vira código de saída;
- import não executa fluxo principal;
- separa definição de execução;
- funciona melhor em CLI.

### Com argumentos de terminal

```python
import argparse


def somar(a: int, b: int) -> int:
    return a + b


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("a", type=int)
    parser.add_argument("b", type=int)
    args = parser.parse_args(argv)

    print(somar(args.a, args.b))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
```

Teste:

```python
def test_main(capsys):
    codigo = main(["2", "3"])
    saida = capsys.readouterr()

    assert codigo == 0
    assert "5" in saida.out
```

### O que não colocar no import

Evite executar no topo do módulo:

- chamadas de API;
- conexão com banco;
- leitura de arquivo pesado;
- criação de threads;
- execução de CLI;
- prints de depuração;
- alteração de estado global.

Coloque isso dentro de `main` ou de funções chamadas explicitamente.

---

## Executando com `python -m`

Quando há pacotes, prefira:

```bash
python -m app.main
```

Isso executa o módulo respeitando o contexto do pacote.

Estrutura:

```text
app/
  __init__.py
  main.py
  calculos.py
```

`main.py`:

```python
from app.calculos import somar


def main() -> int:
    print(somar(2, 3))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
```

Execução:

```bash
python -m app.main
```

---

## Organização Profissional

```text
projeto/
  src/
    app/
      __init__.py
      __main__.py
      cli.py
      services.py
  tests/
    test_cli.py
  pyproject.toml
```

`__main__.py` permite:

```bash
python -m app
```

Exemplo:

```python
from app.cli import main

raise SystemExit(main())
```

`cli.py`:

```python
def main(argv=None) -> int:
    print("executando CLI")
    return 0
```

---

## Armadilhas Frequentes

### Import circular

`a.py` importa `b.py` e `b.py` importa `a.py`.

Soluções:

- reorganize responsabilidades;
- extraia dependência comum;
- mova import para dentro da função apenas se for necessário;
- reduza efeitos colaterais no topo do módulo.

### Rodar arquivo interno diretamente

Executar `python app/main.py` pode quebrar imports relativos. Prefira:

```bash
python -m app.main
```

### Código executando no import

Todo código no topo do módulo roda ao importar. Mantenha topo leve.

---

## Exercícios

1. Crie um módulo `calculos.py` e importe em outro arquivo.
2. Crie um pacote com `__init__.py`.
3. Exponha uma função pública no `__init__.py`.
4. Crie um script com `if __name__ == "__main__"`.
5. Reescreva o script usando função `main`.
6. Adicione `argparse`.
7. Execute um módulo com `python -m`.
8. Crie `__main__.py` para executar um pacote.
9. Simule e corrija um import circular simples.
10. Explique por escrito diferença entre importar e executar diretamente.

