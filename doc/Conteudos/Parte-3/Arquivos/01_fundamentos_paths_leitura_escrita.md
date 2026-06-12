# Fundamentos de Arquivos, Paths, Leitura e Escrita

Este arquivo cobre a base profissional para trabalhar com arquivos em Python: `pathlib`, modos de abertura, encoding, leitura, escrita, arquivos binários, arquivos temporários e operações seguras.

---

## Sumário

1. [Modelo Mental](#modelo-mental)
2. [Pathlib](#pathlib)
3. [Abrindo Arquivos](#abrindo-arquivos)
4. [Leitura de Texto](#leitura-de-texto)
5. [Escrita de Texto](#escrita-de-texto)
6. [Arquivos Binários](#arquivos-binários)
7. [Encoding](#encoding)
8. [Arquivos Grandes](#arquivos-grandes)
9. [Arquivos Temporários](#arquivos-temporários)
10. [Operações com Diretórios](#operações-com-diretórios)
11. [Boas Práticas](#boas-práticas)
12. [Exercícios](#exercícios)

---

## Modelo Mental

Manipular arquivos envolve:

- localizar caminho;
- abrir recurso;
- ler ou escrever;
- fechar recurso;
- tratar erros;
- validar conteúdo;
- preservar segurança.

Sempre que abrir arquivo, prefira `with`, porque ele fecha o recurso automaticamente.

```python
with open("arquivo.txt", "r", encoding="utf-8") as arquivo:
    conteudo = arquivo.read()
```

---

## Pathlib

`pathlib` é a forma moderna de lidar com caminhos.

```python
from pathlib import Path

base = Path("data")
entrada = base / "raw" / "clientes.txt"
saida = base / "processed" / "clientes_limpos.txt"
```

Criar diretório:

```python
saida.parent.mkdir(parents=True, exist_ok=True)
```

Verificações:

```python
entrada.exists()
entrada.is_file()
entrada.is_dir()
entrada.suffix
entrada.stem
```

Listar arquivos:

```python
for caminho in Path("data").glob("*.csv"):
    print(caminho)
```

Recursivo:

```python
for caminho in Path("data").rglob("*.json"):
    print(caminho)
```

---

## Abrindo Arquivos

Modos comuns:

| Modo | Uso |
|---|---|
| `r` | leitura texto |
| `w` | escrita texto, sobrescreve |
| `a` | append texto |
| `x` | cria novo, falha se existir |
| `rb` | leitura binária |
| `wb` | escrita binária |
| `r+` | leitura e escrita |

Exemplo:

```python
with open("log.txt", "a", encoding="utf-8") as arquivo:
    arquivo.write("linha nova\n")
```

---

## Leitura de Texto

Ler tudo:

```python
from pathlib import Path

conteudo = Path("dados.txt").read_text(encoding="utf-8")
```

Ler linha a linha:

```python
with open("dados.txt", encoding="utf-8") as arquivo:
    for linha in arquivo:
        linha = linha.strip()
        if linha:
            print(linha)
```

Ler linhas:

```python
linhas = Path("dados.txt").read_text(encoding="utf-8").splitlines()
```

---

## Escrita de Texto

```python
from pathlib import Path

Path("saida.txt").write_text("Olá\n", encoding="utf-8")
```

Escrita incremental:

```python
with open("saida.txt", "w", encoding="utf-8") as arquivo:
    arquivo.write("cabeçalho\n")
    for item in ["A", "B", "C"]:
        arquivo.write(f"{item}\n")
```

Append:

```python
with open("eventos.log", "a", encoding="utf-8") as arquivo:
    arquivo.write("evento processado\n")
```

---

## Arquivos Binários

Use modo binário para imagens, PDFs, vídeos, ZIPs e bytes.

```python
from pathlib import Path

dados = Path("imagem.png").read_bytes()
Path("copia.png").write_bytes(dados)
```

Leitura em blocos:

```python
def copiar_binario(origem, destino, tamanho_bloco=1024 * 1024):
    with open(origem, "rb") as entrada, open(destino, "wb") as saida:
        while bloco := entrada.read(tamanho_bloco):
            saida.write(bloco)
```

---

## Encoding

Encoding define como bytes viram texto.

Use UTF-8 por padrão:

```python
open("arquivo.txt", encoding="utf-8")
```

Problemas comuns:

- `UnicodeDecodeError`;
- arquivo legado em Latin-1;
- BOM;
- caracteres corrompidos.

Fallback controlado:

```python
def ler_texto(caminho):
    for encoding in ["utf-8", "utf-8-sig", "latin-1"]:
        try:
            return Path(caminho).read_text(encoding=encoding)
        except UnicodeDecodeError:
            continue
    raise UnicodeDecodeError("não foi possível detectar encoding")
```

---

## Arquivos Grandes

Evite `read()` em arquivos enormes.

Bom:

```python
with open("grande.txt", encoding="utf-8") as arquivo:
    for linha in arquivo:
        processar(linha)
```

Generator:

```python
def linhas_validas(caminho):
    with open(caminho, encoding="utf-8") as arquivo:
        for linha in arquivo:
            linha = linha.strip()
            if linha:
                yield linha
```

---

## Arquivos Temporários

```python
from tempfile import TemporaryDirectory, NamedTemporaryFile

with TemporaryDirectory() as pasta:
    caminho = Path(pasta) / "saida.txt"
    caminho.write_text("temporário", encoding="utf-8")
```

Arquivo temporário:

```python
with NamedTemporaryFile(mode="w+", encoding="utf-8", delete=True) as arquivo:
    arquivo.write("teste")
    arquivo.seek(0)
    print(arquivo.read())
```

---

## Operações com Diretórios

Criar:

```python
Path("data/raw").mkdir(parents=True, exist_ok=True)
```

Renomear:

```python
Path("antigo.txt").rename("novo.txt")
```

Remover arquivo:

```python
Path("temporario.txt").unlink(missing_ok=True)
```

Copiar:

```python
import shutil

shutil.copy2("origem.txt", "destino.txt")
```

---

## Boas Práticas

- Use `pathlib`.
- Use `with`.
- Informe `encoding`.
- Não carregue arquivo grande inteiro sem necessidade.
- Escreva em arquivo temporário e depois mova quando precisar de atomicidade.
- Valide caminhos vindos de usuário.
- Separe leitura, transformação e escrita.
- Trate erros específicos.

---

## Exercícios

1. Leia um arquivo TXT linha a linha.
2. Escreva uma lista em arquivo.
3. Copie arquivo binário em blocos.
4. Liste todos os `.csv` de uma pasta.
5. Crie diretórios com `pathlib`.
6. Leia arquivo com fallback de encoding.
7. Use arquivo temporário para gerar saída.

