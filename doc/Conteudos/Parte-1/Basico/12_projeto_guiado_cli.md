# Projeto Guiado: Aplicação de Linha de Comando

Este projeto consolida a parte básica de Python em uma aplicação pequena, organizada e testável. A proposta é criar um gerenciador de tarefas em linha de comando com armazenamento em JSON.

---

## Objetivo

Construir uma CLI capaz de:

- adicionar tarefas;
- listar tarefas;
- concluir tarefas;
- salvar dados em JSON;
- carregar dados existentes;
- validar entradas;
- separar módulos;
- ter testes básicos.

---

## Estrutura Recomendada

```text
tarefas-cli/
├── README.md
├── app.py
├── tarefas.py
├── armazenamento.py
└── tests/
    ├── test_tarefas.py
    └── test_armazenamento.py
```

---

## Modelo de Tarefa

No começo, use dicionários.

```python
def criar_tarefa(titulo: str, tarefa_id: int) -> dict:
    return {
        "id": tarefa_id,
        "titulo": titulo,
        "concluida": False,
    }
```

Depois, quando estudar mais tipagem e classes, você pode trocar por `dataclass`.

---

## Regras de Negócio

`tarefas.py`:

```python
def criar_tarefa(titulo: str, tarefa_id: int) -> dict:
    titulo = titulo.strip()
    if not titulo:
        raise ValueError("titulo não pode ser vazio")

    return {
        "id": tarefa_id,
        "titulo": titulo,
        "concluida": False,
    }

def adicionar_tarefa(tarefas: list[dict], titulo: str) -> list[dict]:
    proximo_id = max((tarefa["id"] for tarefa in tarefas), default=0) + 1
    nova_tarefa = criar_tarefa(titulo, proximo_id)
    return [*tarefas, nova_tarefa]

def concluir_tarefa(tarefas: list[dict], tarefa_id: int) -> list[dict]:
    encontradas = []

    for tarefa in tarefas:
        if tarefa["id"] == tarefa_id:
            tarefa = {**tarefa, "concluida": True}
        encontradas.append(tarefa)

    if not any(tarefa["id"] == tarefa_id for tarefa in tarefas):
        raise ValueError(f"tarefa não encontrada: {tarefa_id}")

    return encontradas
```

As funções retornam nova lista para reduzir efeitos colaterais.

---

## Armazenamento JSON

`armazenamento.py`:

```python
import json
from pathlib import Path

def carregar_tarefas(caminho: Path) -> list[dict]:
    if not caminho.exists():
        return []

    texto = caminho.read_text(encoding="utf-8")
    return json.loads(texto)

def salvar_tarefas(caminho: Path, tarefas: list[dict]) -> None:
    caminho.parent.mkdir(parents=True, exist_ok=True)
    texto = json.dumps(tarefas, indent=2, ensure_ascii=False)
    caminho.write_text(texto, encoding="utf-8")
```

---

## CLI com Argparse

`app.py`:

```python
import argparse
from pathlib import Path

from armazenamento import carregar_tarefas, salvar_tarefas
from tarefas import adicionar_tarefa, concluir_tarefa

CAMINHO_PADRAO = Path("data") / "tarefas.json"

def criar_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Gerenciador de tarefas")
    subparsers = parser.add_subparsers(dest="comando", required=True)

    adicionar = subparsers.add_parser("adicionar")
    adicionar.add_argument("titulo")

    subparsers.add_parser("listar")

    concluir = subparsers.add_parser("concluir")
    concluir.add_argument("id", type=int)

    return parser

def main() -> int:
    parser = criar_parser()
    args = parser.parse_args()

    tarefas = carregar_tarefas(CAMINHO_PADRAO)

    try:
        if args.comando == "adicionar":
            tarefas = adicionar_tarefa(tarefas, args.titulo)
            salvar_tarefas(CAMINHO_PADRAO, tarefas)
            print("Tarefa adicionada.")

        elif args.comando == "listar":
            for tarefa in tarefas:
                status = "x" if tarefa["concluida"] else " "
                print(f'{tarefa["id"]}. [{status}] {tarefa["titulo"]}')

        elif args.comando == "concluir":
            tarefas = concluir_tarefa(tarefas, args.id)
            salvar_tarefas(CAMINHO_PADRAO, tarefas)
            print("Tarefa concluída.")

    except ValueError as erro:
        print(f"Erro: {erro}")
        return 1

    return 0

if __name__ == "__main__":
    raise SystemExit(main())
```

---

## Como Executar

```bash
python app.py adicionar "Estudar funções"
python app.py listar
python app.py concluir 1
python app.py listar
```

---

## Testes

`tests/test_tarefas.py`:

```python
import pytest

from tarefas import adicionar_tarefa, concluir_tarefa, criar_tarefa

def test_criar_tarefa():
    tarefa = criar_tarefa("Estudar", 1)
    assert tarefa["id"] == 1
    assert tarefa["titulo"] == "Estudar"
    assert tarefa["concluida"] is False

def test_titulo_vazio():
    with pytest.raises(ValueError):
        criar_tarefa("   ", 1)

def test_adicionar_tarefa():
    tarefas = adicionar_tarefa([], "Estudar")
    assert len(tarefas) == 1
    assert tarefas[0]["id"] == 1

def test_concluir_tarefa():
    tarefas = adicionar_tarefa([], "Estudar")
    atualizadas = concluir_tarefa(tarefas, 1)
    assert atualizadas[0]["concluida"] is True
```

---

## Evoluções

Depois da primeira versão:

- adicionar comando `remover`;
- adicionar comando `editar`;
- filtrar pendentes e concluídas;
- usar `dataclass`;
- criar pacote `tarefas_cli`;
- adicionar logs;
- configurar `pyproject.toml`;
- criar testes para armazenamento;
- gerar relatório CSV.

---

## O Que Este Projeto Treina

- sintaxe;
- tipos;
- funções;
- listas e dicionários;
- exceções;
- arquivos;
- JSON;
- módulos;
- `argparse`;
- testes;
- organização de projeto;
- separação entre interface, regra e persistência.

---

## Critérios de Conclusão

Você concluiu o projeto quando:

- a CLI adiciona, lista e conclui tarefas;
- os dados persistem em JSON;
- funções principais têm testes;
- não há regra de negócio presa no `argparse`;
- erros de usuário mostram mensagens claras;
- o código está dividido em módulos pequenos.

---

## Aprofundamento Complementar

### Refatoração em etapas

Não tente construir a versão final de uma vez. Uma sequência saudável:

1. Criar versão que roda em um arquivo.
2. Extrair funções puras.
3. Adicionar persistência JSON.
4. Separar módulos.
5. Adicionar `argparse`.
6. Adicionar testes.
7. Melhorar mensagens de erro.
8. Documentar execução.

Cada etapa deve manter o projeto funcionando.

### Separação de camadas

Mesmo em projeto pequeno, pense em camadas:

- CLI: interpreta comandos e mostra mensagens;
- domínio: cria, conclui, remove e valida tarefas;
- persistência: lê e salva JSON;
- testes: validam comportamento.

Essa separação prepara o aluno para APIs, bancos e interfaces gráficas no futuro.

### Melhorias de robustez

Inclua:

- validação de título vazio;
- tratamento de JSON inválido;
- mensagem quando não há tarefas;
- confirmação ao remover;
- filtro por status;
- testes para tarefa inexistente.

### Critérios de código profissional

O projeto fica mais profissional quando:

- `main` retorna código de saída;
- funções de domínio não usam `print`;
- persistência não conhece `argparse`;
- testes não dependem de arquivo fixo;
- README explica comandos;
- erros são específicos e claros.

### Exercícios extras

1. Adicione comando `remover`.
2. Adicione comando `editar`.
3. Adicione filtro `--status pendente`.
4. Teste persistência com `tmp_path`.
5. Crie README do projeto guiado com exemplos de uso.
