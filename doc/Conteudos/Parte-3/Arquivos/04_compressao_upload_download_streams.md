# Compressão, Upload, Download e Streams

Este arquivo cobre compactação com `zipfile` e `tarfile`, downloads e uploads de arquivos, streaming, processamento em blocos, checksums e práticas robustas para transferência de dados.

---

## Sumário

1. [ZIP com Zipfile](#zip-com-zipfile)
2. [TAR com Tarfile](#tar-com-tarfile)
3. [Extração Segura](#extração-segura)
4. [Checksums](#checksums)
5. [Download de Arquivos](#download-de-arquivos)
6. [Upload de Arquivos](#upload-de-arquivos)
7. [Streams](#streams)
8. [Processamento em Blocos](#processamento-em-blocos)
9. [Boas Práticas](#boas-práticas)
10. [Exercícios](#exercícios)

---

## ZIP com Zipfile

Criar ZIP:

```python
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

def criar_zip(saida: str, arquivos: list[str]) -> None:
    with ZipFile(saida, "w", compression=ZIP_DEFLATED) as zipf:
        for arquivo in arquivos:
            caminho = Path(arquivo)
            zipf.write(caminho, arcname=caminho.name)
```

Listar:

```python
from zipfile import ZipFile

with ZipFile("arquivos.zip") as zipf:
    print(zipf.namelist())
```

Extrair:

```python
with ZipFile("arquivos.zip") as zipf:
    zipf.extractall("saida")
```

---

## TAR com Tarfile

Criar `.tar.gz`:

```python
import tarfile

with tarfile.open("backup.tar.gz", "w:gz") as tar:
    tar.add("data", arcname="data")
```

Extrair:

```python
with tarfile.open("backup.tar.gz", "r:gz") as tar:
    tar.extractall("saida")
```

Formatos:

- `w`: tar sem compressão;
- `w:gz`: gzip;
- `w:bz2`: bzip2;
- `w:xz`: xz.

---

## Extração Segura

Arquivos compactados podem conter path traversal:

```text
../../arquivo_sensivel
```

Extração segura conceitual:

```python
from pathlib import Path

def destino_seguro(base: Path, nome: str) -> Path:
    destino = (base / nome).resolve()
    base_resolvida = base.resolve()

    if not str(destino).startswith(str(base_resolvida)):
        raise ValueError("caminho inseguro")

    return destino
```

Sempre valide nomes antes de extrair arquivos de origem não confiável.

---

## Checksums

Checksum valida integridade.

```python
import hashlib

def sha256_arquivo(caminho, tamanho_bloco=1024 * 1024) -> str:
    h = hashlib.sha256()

    with open(caminho, "rb") as arquivo:
        while bloco := arquivo.read(tamanho_bloco):
            h.update(bloco)

    return h.hexdigest()
```

Uso:

```python
print(sha256_arquivo("arquivo.zip"))
```

---

## Download de Arquivos

Com `requests`:

```python
import requests

def baixar(url: str, destino: str, tamanho_bloco=1024 * 1024) -> None:
    with requests.get(url, stream=True, timeout=30) as resposta:
        resposta.raise_for_status()

        with open(destino, "wb") as arquivo:
            for bloco in resposta.iter_content(chunk_size=tamanho_bloco):
                if bloco:
                    arquivo.write(bloco)
```

Pontos importantes:

- `stream=True`;
- timeout;
- checar status;
- escrever em blocos;
- validar tamanho/checksum;
- não carregar tudo em memória.

---

## Upload de Arquivos

Com `requests`:

```python
import requests

def enviar_arquivo(url: str, caminho: str) -> dict:
    with open(caminho, "rb") as arquivo:
        resposta = requests.post(
            url,
            files={"file": arquivo},
            timeout=30,
        )
        resposta.raise_for_status()
        return resposta.json()
```

Com campos extras:

```python
requests.post(
    url,
    files={"file": open("relatorio.pdf", "rb")},
    data={"tipo": "relatorio"},
    timeout=30,
)
```

Em produção, garanta fechamento do arquivo com `with`.

---

## Streams

Stream é fluxo de dados processado aos poucos.

Leitura de arquivo:

```python
with open("grande.bin", "rb") as arquivo:
    while bloco := arquivo.read(8192):
        processar(bloco)
```

Stream em memória:

```python
from io import StringIO, BytesIO

texto = StringIO()
texto.write("linha\n")
texto.seek(0)
print(texto.read())

binario = BytesIO()
binario.write(b"abc")
```

`StringIO` e `BytesIO` são úteis em testes e integrações.

---

## Processamento em Blocos

Copiar:

```python
def copiar(origem, destino, chunk_size=1024 * 1024):
    with open(origem, "rb") as src, open(destino, "wb") as dst:
        while chunk := src.read(chunk_size):
            dst.write(chunk)
```

Transformar texto grande:

```python
def filtrar_linhas(origem, destino, termo):
    with open(origem, encoding="utf-8") as entrada, open(destino, "w", encoding="utf-8") as saida:
        for linha in entrada:
            if termo in linha:
                saida.write(linha)
```

---

## Boas Práticas

- Faça download em blocos.
- Defina timeout.
- Valide checksum.
- Extraia arquivos de forma segura.
- Não confie em nomes dentro de ZIP/TAR.
- Use arquivos temporários para downloads parciais.
- Feche arquivos com `with`.
- Monitore tamanho, duração e falhas.
- Limite tamanho máximo de upload.

---

## Exercícios

1. Crie ZIP com vários arquivos.
2. Liste conteúdo do ZIP.
3. Crie `.tar.gz`.
4. Calcule SHA-256 de um arquivo.
5. Faça download em streaming.
6. Faça upload com `requests`.
7. Use `BytesIO` em teste.
8. Copie arquivo grande em blocos.

