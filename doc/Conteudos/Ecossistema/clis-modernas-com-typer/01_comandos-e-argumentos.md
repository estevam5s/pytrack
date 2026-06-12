# Comandos e argumentos

Typer cria CLIs com type hints e ajuda automática.

> **Tema:** CLI · **Nível:** basico · **Trilha:** CLIs Modernas com Typer

## Conceitos-chave

Nesta lição você vai entender:

- **Funções viram comandos**
- **Argumentos e opções tipados**
- **Ajuda gerada automaticamente**
- **Subcomandos**

## Exemplo prático

```python
import typer
app = typer.Typer()

@app.command()
def saudar(nome: str, formal: bool = False):
    print(f'{"Prezado" if formal else "Oi"}, {nome}')

if __name__ == '__main__':
    app()
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Valide entradas com tipos
- Documente cada comando

## Pratique

Para fixar, escreva um pequeno script que combine **funções viram comandos** e **argumentos e opções tipados** em um caso do seu dia a dia. Depois refatore aplicando "Valide entradas com tipos".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Funções viram comandos
- [ ] Explicar e aplicar: Argumentos e opções tipados
- [ ] Explicar e aplicar: Ajuda gerada automaticamente
- [ ] Explicar e aplicar: Subcomandos

## Saiba mais

- [Documentação oficial](https://typer.tiangolo.com/)
