# CLI Moderna: argparse, Click, Typer, Rich e Textual

Este módulo complementa a trilha de automação com ferramentas para criar CLIs profissionais: desde scripts simples com `argparse` até interfaces ricas com Click, Typer, Rich e Textual.

---

## Quando Usar Cada Ferramenta

| Ferramenta | Melhor uso |
|---|---|
| `argparse` | CLI sem dependências externas, scripts portáveis |
| Click | CLIs robustas, subcomandos, opções avançadas |
| Typer | CLIs modernas com type hints e excelente DX |
| Rich | saída colorida, tabelas, progresso, logs bonitos |
| Textual | TUI completa no terminal, com telas e widgets |

Regra prática:

- script simples: `argparse`;
- CLI de produto interno: Typer ou Click;
- output legível: Rich;
- interface terminal interativa: Textual.

---

## argparse

`argparse` vem na biblioteca padrão.

```python
import argparse


def criar_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Processa arquivo CSV.")
    parser.add_argument("entrada")
    parser.add_argument("--saida", default="saida.csv")
    parser.add_argument("--limite", type=int, default=1000)
    return parser


def main() -> int:
    args = criar_parser().parse_args()
    print(args.entrada, args.saida, args.limite)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
```

Vantagens:

- zero dependência;
- bom para automações distribuídas em ambientes restritos;
- integra bem com shell, cron e CI.

---

## Click

Click facilita comandos, subcomandos e prompts.

Instalação:

```bash
pip install click
```

Exemplo:

```python
import click


@click.group()
def cli() -> None:
    pass


@cli.command()
@click.argument("nome")
@click.option("--gritar", is_flag=True)
def ola(nome: str, gritar: bool) -> None:
    mensagem = f"Olá, {nome}"
    if gritar:
        mensagem = mensagem.upper()
    click.echo(mensagem)


if __name__ == "__main__":
    cli()
```

Click é forte para CLIs maduras com muitos comandos, validações e fluxo interativo.

---

## Typer

Typer usa type hints para gerar CLI.

Instalação:

```bash
pip install typer
```

Exemplo:

```python
import typer

app = typer.Typer()


@app.command()
def processar(entrada: str, limite: int = 1000, verbose: bool = False) -> None:
    if verbose:
        typer.echo(f"Processando {entrada} com limite {limite}")
    typer.echo("ok")


if __name__ == "__main__":
    app()
```

Vantagens:

- type hints viram parsing;
- ajuda automática;
- comandos e subcomandos simples;
- boa experiência para ferramentas internas.

---

## Rich

Rich melhora a saída no terminal.

Instalação:

```bash
pip install rich
```

Exemplo com tabela:

```python
from rich.console import Console
from rich.table import Table

console = Console()

table = Table(title="Resumo")
table.add_column("Arquivo")
table.add_column("Status")
table.add_row("clientes.csv", "ok")
table.add_row("pedidos.csv", "erro")

console.print(table)
```

Exemplo com progresso:

```python
from rich.progress import track

for item in track(range(100), description="Processando"):
    processar(item)
```

Use Rich para:

- tabelas;
- barras de progresso;
- logs legíveis;
- mensagens coloridas;
- painéis de status.

---

## Textual

Textual cria TUIs, interfaces completas no terminal.

Instalação:

```bash
pip install textual
```

Exemplo mínimo:

```python
from textual.app import App, ComposeResult
from textual.widgets import Footer, Header, Static


class AutomacaoApp(App):
    def compose(self) -> ComposeResult:
        yield Header()
        yield Static("Painel de automação")
        yield Footer()


if __name__ == "__main__":
    AutomacaoApp().run()
```

Use Textual quando uma CLI comum já não basta:

- painel de jobs;
- seleção interativa;
- monitor de execução;
- revisão de filas;
- ferramentas internas usadas diariamente.

---

## Estrutura Profissional de CLI

Separe CLI de regra de negócio:

```text
src/
  automacao/
    cli.py
    services.py
    config.py
    logging_config.py
```

`services.py`:

```python
def processar_arquivo(caminho: str, limite: int) -> int:
    return limite
```

`cli.py`:

```python
import typer

from automacao.services import processar_arquivo

app = typer.Typer()


@app.command()
def processar(caminho: str, limite: int = 1000) -> None:
    total = processar_arquivo(caminho, limite)
    typer.echo(f"Processados: {total}")
```

Isso permite testar `processar_arquivo` sem simular terminal.

---

## Boas Práticas

- Retorne código de saída coerente.
- Escreva erros em `stderr`.
- Documente exemplos de uso.
- Use `--help` útil.
- Valide caminhos antes de processar.
- Não esconda regra de negócio dentro do callback da CLI.
- Use logs para diagnóstico e output final para resultado.
- Tenha modo `--dry-run` em automações perigosas.
- Tenha `--yes` apenas quando a ação é segura e auditável.

---

## Checklist

- Sei criar script com `argparse`.
- Sei quando Click ou Typer simplificam a CLI.
- Sei usar Rich para tabelas, progresso e mensagens.
- Sei quando Textual vale a complexidade.
- CLI e regra de negócio estão separadas?
- Erros e códigos de saída são previsíveis?
- O comando tem `--help` útil?
- Há `--dry-run` quando existe risco operacional?
