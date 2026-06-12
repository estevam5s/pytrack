# Comandos e argumentos

Typer cria CLIs com type hints e ajuda automática.

## Pontos-chave

- Funções viram comandos
- Argumentos e opções tipados
- Ajuda gerada automaticamente
- Subcomandos

## Exemplo

```python
import typer
app = typer.Typer()

@app.command()
def saudar(nome: str, formal: bool = False):
    print(f'{"Prezado" if formal else "Oi"}, {nome}')

if __name__ == '__main__':
    app()
```

## Boas práticas

- Valide entradas com tipos
- Documente cada comando

## Saiba mais

- [Documentação oficial](https://typer.tiangolo.com/)
