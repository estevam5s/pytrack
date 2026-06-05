# Módulos, Imports, Pacotes e Biblioteca Padrão

Quando um script cresce, ele precisa ser dividido. Módulos e pacotes permitem organizar código por responsabilidade. A biblioteca padrão fornece ferramentas prontas para arquivos, datas, caminhos, argumentos, logs, matemática, aleatoriedade, dados estruturados e muito mais.

---

## Objetivo

Ao final, você deve saber:

- criar módulos `.py`;
- importar funções, classes e constantes;
- evitar imports confusos;
- entender `__name__ == "__main__"`;
- organizar pacotes simples;
- usar partes essenciais da biblioteca padrão.

---

## Módulos

Todo arquivo `.py` pode ser um módulo.

```text
projeto/
├── calculos.py
└── app.py
```

`calculos.py`:

```python
def somar(a: int, b: int) -> int:
    return a + b
```

`app.py`:

```python
from calculos import somar

print(somar(2, 3))
```

---

## Formas de Import

Importar módulo:

```python
import math

print(math.sqrt(16))
```

Importar nome específico:

```python
from math import sqrt

print(sqrt(16))
```

Alias:

```python
import datetime as dt

hoje = dt.date.today()
```

Evite:

```python
from math import *
```

Imports com `*` dificultam leitura e podem sobrescrever nomes.

---

## Ordem de Imports

Padrão comum:

```python
import json
from pathlib import Path

import requests

from meu_projeto.calculos import somar
```

Ordem:

1. biblioteca padrão;
2. bibliotecas externas;
3. módulos do projeto.

Ferramentas como `isort` organizam isso automaticamente.

---

## `__name__ == "__main__"`

Use para separar execução direta de importação.

```python
def main() -> None:
    print("Executando aplicação")

if __name__ == "__main__":
    main()
```

Quando o arquivo é executado diretamente, `__name__` vale `"__main__"`. Quando é importado, o bloco não roda.

Isso evita efeitos colaterais ao importar funções em testes ou outros módulos.

---

## Pacotes

Um pacote é um diretório com módulos Python.

```text
meu_projeto/
├── app.py
└── loja/
    ├── __init__.py
    ├── produtos.py
    └── pedidos.py
```

Import:

```python
from loja.produtos import calcular_preco
```

`__init__.py` marca o diretório como pacote e pode expor uma API pública.

---

## Imports Relativos

Dentro de pacotes, imports relativos podem aparecer:

```python
from .produtos import calcular_preco
```

Use com cuidado. Para projetos pequenos, imports absolutos costumam ser mais claros.

---

## Biblioteca Padrão Essencial

### pathlib

```python
from pathlib import Path

caminho = Path("dados") / "entrada.txt"
```

### datetime

```python
from datetime import date, datetime, timedelta

hoje = date.today()
agora = datetime.now()
amanha = hoje + timedelta(days=1)
```

### math

```python
import math

print(math.sqrt(25))
print(math.ceil(4.2))
```

### random

```python
import random

print(random.randint(1, 10))
print(random.choice(["A", "B", "C"]))
```

Para segurança, senhas e tokens, use `secrets`, não `random`.

### collections

```python
from collections import Counter, defaultdict, deque

contagem = Counter(["a", "b", "a"])
print(contagem)
```

### itertools

```python
from itertools import combinations

for par in combinations(["A", "B", "C"], 2):
    print(par)
```

### statistics

```python
from statistics import mean, median

valores = [10, 20, 30]
print(mean(valores))
print(median(valores))
```

### decimal

```python
from decimal import Decimal

preco = Decimal("19.90")
taxa = Decimal("0.10")
print(preco * (1 + taxa))
```

Use `Decimal` quando precisão decimal for importante.

---

## Evitando Efeitos Colaterais

Evite executar trabalho pesado no topo do arquivo.

Ruim:

```python
dados = carregar_arquivo()
processar(dados)
```

Melhor:

```python
def main() -> None:
    dados = carregar_arquivo()
    processar(dados)

if __name__ == "__main__":
    main()
```

Isso torna o módulo importável e testável.

---

## Boas Práticas

- Um módulo deve ter responsabilidade clara.
- Não crie arquivos com nomes iguais a módulos da biblioteca padrão, como `json.py`.
- Evite imports circulares.
- Coloque execução dentro de `main`.
- Use imports explícitos.
- Prefira biblioteca padrão antes de adicionar dependência externa.
- Separe código reutilizável de scripts.

---

## Checklist de Proficiência

Você domina este tópico quando consegue:

- dividir um script em dois ou mais módulos;
- explicar diferença entre módulo e pacote;
- usar `if __name__ == "__main__"`;
- organizar imports;
- identificar import circular;
- escolher ferramentas da biblioteca padrão antes de instalar pacotes;
- criar uma API simples para seu pacote.

---

## Exercícios

1. Separe um script de cálculo em `calculos.py` e `app.py`.
2. Crie um pacote `loja` com módulos `produtos.py` e `pedidos.py`.
3. Use `datetime` para calcular quantos dias faltam para uma data.
4. Use `Counter` para contar palavras em uma frase.
5. Reescreva um script para usar `main`.

---

## Aprofundamento Complementar

### API pública do módulo

Nem tudo dentro de um módulo precisa ser usado por outros módulos. Defina o que é público por nome, documentação e convenção.

```python
def calcular_total(...):
    ...

def _normalizar_item(...):
    ...
```

O prefixo `_` indica uso interno.

### Imports circulares

Import circular acontece quando dois módulos dependem um do outro.

```text
usuarios.py importa pedidos.py
pedidos.py importa usuarios.py
```

Soluções comuns:

- mover função compartilhada para outro módulo;
- inverter dependência;
- passar dados por parâmetro;
- reorganizar responsabilidades.

### Biblioteca padrão antes de dependência externa

Antes de instalar pacote, verifique se a biblioteca padrão resolve:

- `argparse` para CLI;
- `json` para JSON;
- `csv` para CSV;
- `pathlib` para caminhos;
- `logging` para logs;
- `sqlite3` para banco local simples;
- `urllib` para necessidades HTTP básicas.

### Módulos pequenos

Módulos bons costumam ter tema claro: `validacao.py`, `calculos.py`, `relatorios.py`, `armazenamento.py`. Se um módulo vira depósito genérico, divida.

### Exercícios extras

1. Identifique a API pública de um módulo seu.
2. Crie um exemplo de import circular e corrija.
3. Reorganize um arquivo grande em três módulos.
4. Use `statistics` para calcular média e mediana.
5. Use `secrets` para gerar um token seguro.

---

## Consolidação: `import`, Pacotes e `__name__ == "__main__"`

### Por que dividir em módulos

Um script pequeno pode viver em um único arquivo. Quando cresce, dividir em módulos melhora:

- leitura;
- testes;
- reutilização;
- manutenção;
- separação de responsabilidades.

Exemplo:

```text
projeto/
├── app.py
├── calculos.py
└── validacao.py
```

`calculos.py`:

```python
def calcular_total(preco: float, quantidade: int) -> float:
    return preco * quantidade
```

`app.py`:

```python
from calculos import calcular_total

print(calcular_total(10, 3))
```

### Importando módulo inteiro ou nomes específicos

```python
import math
print(math.sqrt(16))
```

```python
from math import sqrt
print(sqrt(16))
```

Prefira imports explícitos. Evite:

```python
from math import *
```

### Pacote

Pacote é um diretório que organiza módulos.

```text
loja/
├── __init__.py
├── produtos.py
└── pedidos.py
```

Uso:

```python
from loja.produtos import calcular_preco
```

### `if __name__ == "__main__"`

Esse bloco separa código executado diretamente de código importado.

```python
def main() -> int:
    print("Executando aplicação")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
```

Quando executa:

```bash
python app.py
```

`__name__` vale `"__main__"`.

Quando importa:

```python
import app
```

`__name__` vale `"app"` e o bloco não roda automaticamente.

### Por que isso importa

Sem esse padrão, importar um arquivo pode executar ações indesejadas:

- criar arquivos;
- conectar em banco;
- chamar APIs;
- iniciar servidor;
- pedir `input`;
- imprimir resultados;
- rodar processamento pesado.

Com `main`, o código fica testável:

```python
def test_main_retorna_sucesso():
    assert main() == 0
```

### Checklist

- Sei criar módulos `.py`.
- Sei importar módulo inteiro.
- Sei importar função específica.
- Sei evitar `import *`.
- Sei criar pacote simples.
- Sei explicar `__name__`.
- Sei proteger execução com `if __name__ == "__main__"`.
