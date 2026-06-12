# Boas Práticas, Segurança, Performance e Projetos com Arquivos

Este arquivo consolida práticas profissionais para sistemas que manipulam arquivos: segurança, performance, observabilidade, testes, arquitetura, validação e projetos progressivos.

---

## Sumário

1. [Arquitetura de Processamento de Arquivos](#arquitetura-de-processamento-de-arquivos)
2. [Segurança](#segurança)
3. [Performance](#performance)
4. [Observabilidade](#observabilidade)
5. [Testes](#testes)
6. [Tratamento de Erros](#tratamento-de-erros)
7. [Atomicidade e Consistência](#atomicidade-e-consistência)
8. [Roadmap de Especialista](#roadmap-de-especialista)
9. [Projetos Progressivos](#projetos-progressivos)
10. [Checklist Final](#checklist-final)

---

## Arquitetura de Processamento de Arquivos

Fluxo recomendado:

```text
entrada
  ↓
validação de nome/tamanho/tipo
  ↓
armazenamento raw
  ↓
extração
  ↓
validação de conteúdo
  ↓
transformação
  ↓
saída processada
  ↓
logs/métricas/auditoria
```

Separe responsabilidades:

```python
def ler(caminho):
    ...

def validar(dados):
    ...

def transformar(dados):
    ...

def salvar(dados, caminho):
    ...
```

Isso facilita testes e manutenção.

---

## Segurança

Riscos comuns:

- path traversal;
- upload de arquivo malicioso;
- zip slip;
- bomba ZIP;
- arquivo enorme;
- extensão falsa;
- MIME type incorreto;
- pickle inseguro;
- YAML unsafe load;
- XML entity expansion;
- metadados sensíveis;
- vazamento de arquivos privados.

### Path traversal

```python
from pathlib import Path

def validar_caminho(base: Path, nome: str) -> Path:
    destino = (base / nome).resolve()
    base = base.resolve()

    if not destino.is_relative_to(base):
        raise ValueError("caminho fora da pasta permitida")

    return destino
```

### Extensão não basta

`arquivo.jpg` pode não ser imagem. Valide conteúdo quando importa.

```python
from PIL import Image, UnidentifiedImageError

def validar_imagem(caminho):
    try:
        with Image.open(caminho) as img:
            img.verify()
    except UnidentifiedImageError as erro:
        raise ValueError("imagem inválida") from erro
```

### Nunca carregue Pickle não confiável

Pickle pode executar código durante desserialização.

---

## Performance

Estratégias:

- leitura em streaming;
- processamento em chunks;
- compressão adequada;
- evitar cópias desnecessárias;
- usar formatos colunares;
- limitar memória;
- paralelizar com cuidado;
- medir gargalos.

CSV grande com Pandas:

```python
import pandas as pd

for chunk in pd.read_csv("grande.csv", chunksize=100_000):
    processar(chunk)
```

Hash em blocos:

```python
import hashlib

def hash_arquivo(caminho, algoritmo="sha256", chunk_size=1024 * 1024):
    h = hashlib.new(algoritmo)
    with open(caminho, "rb") as arquivo:
        while chunk := arquivo.read(chunk_size):
            h.update(chunk)
    return h.hexdigest()
```

---

## Observabilidade

Registre:

- arquivo recebido;
- tamanho;
- tipo;
- duração;
- quantidade de registros;
- erros de validação;
- destino;
- checksum;
- usuário/origem;
- correlation id.

```python
import logging

logger = logging.getLogger(__name__)

logger.info(
    "arquivo processado",
    extra={
        "arquivo": "vendas.csv",
        "linhas": 1000,
        "duracao_ms": 250,
    },
)
```

---

## Testes

Use arquivos temporários.

```python
def test_salvar_linhas(tmp_path):
    caminho = tmp_path / "saida.txt"

    salvar_linhas(caminho, ["A", "B"])

    assert caminho.read_text(encoding="utf-8").splitlines() == ["A", "B"]
```

Teste CSV:

```python
def test_ler_clientes(tmp_path):
    caminho = tmp_path / "clientes.csv"
    caminho.write_text("id,nome\n1,Ana\n", encoding="utf-8")

    clientes = ler_clientes(caminho)

    assert clientes[0]["nome"] == "Ana"
```

Use `BytesIO` para binários:

```python
from io import BytesIO

buffer = BytesIO(b"abc")
```

---

## Tratamento de Erros

Erros comuns:

- `FileNotFoundError`;
- `PermissionError`;
- `UnicodeDecodeError`;
- `json.JSONDecodeError`;
- `csv.Error`;
- erro de parsing XML/YAML;
- arquivo corrompido;
- disco cheio;
- timeout de download.

Exemplo:

```python
import json
from pathlib import Path

def carregar_json(caminho):
    try:
        return json.loads(Path(caminho).read_text(encoding="utf-8"))
    except FileNotFoundError as erro:
        raise RuntimeError(f"arquivo não encontrado: {caminho}") from erro
    except json.JSONDecodeError as erro:
        raise ValueError(f"JSON inválido: {caminho}") from erro
```

---

## Atomicidade e Consistência

Para evitar arquivo parcialmente escrito:

```python
from pathlib import Path
import os
import tempfile

def escrever_atomicamente(destino: Path, conteudo: str):
    destino.parent.mkdir(parents=True, exist_ok=True)

    with tempfile.NamedTemporaryFile(
        "w",
        encoding="utf-8",
        dir=destino.parent,
        delete=False,
    ) as tmp:
        tmp.write(conteudo)
        temporario = Path(tmp.name)

    os.replace(temporario, destino)
```

`os.replace` é atômico no mesmo filesystem.

---

## Roadmap de Especialista

### Nível 1: Base

- `open`;
- `with`;
- `pathlib`;
- TXT;
- encoding.

### Nível 2: Formatos

- CSV;
- JSON;
- XML;
- YAML;
- TOML;
- Markdown;
- Pickle;
- validação.

### Nível 3: Documentos

- Excel com Pandas;
- Excel com OpenPyXL;
- PDF texto;
- PDF tabelas;
- geração de PDF.
- Parquet;
- Avro;
- ORC;
- `pyarrow`;
- `fastparquet`.

### Nível 4: Binários e Mídia

- imagens com Pillow;
- vídeos com OpenCV/MoviePy;
- streams binários;
- metadados.

### Nível 5: Operação

- ZIP/TAR;
- uploads;
- downloads;
- checksums;
- arquivos grandes;
- atomicidade.

### Nível 6: Produção

- segurança;
- observabilidade;
- performance;
- testes;
- auditoria;
- pipelines robustos.

---

## Projetos Progressivos

1. Leitor e escritor de TXT com encoding.
2. Conversor CSV para JSONL.
3. Validador de JSON com schema.
4. Gerador de relatório Excel formatado.
5. Extrator de texto e tabelas de PDF.
6. Compactador seguro de pastas.
7. Download com checksum.
8. Upload com validação de tipo e tamanho.
9. Gerador de thumbnails em lote.
10. Pipeline completo de ingestão de arquivos.

---

## Checklist Final

- Sei usar `pathlib`.
- Sei ler e escrever texto com encoding correto.
- Sei processar arquivos grandes em streaming.
- Sei manipular CSV, JSON, XML, YAML e Pickle.
- Sei manipular Markdown e TOML.
- Sei usar Parquet, Avro e ORC quando há dados analíticos.
- Sei quando não usar Pickle.
- Sei trabalhar com Excel e PDF.
- Sei compactar e extrair ZIP/TAR com segurança.
- Sei fazer upload/download em blocos.
- Sei calcular checksum.
- Sei manipular imagens com Pillow.
- Sei escolher entre `pyarrow` e `fastparquet`.
- Sei processar vídeo sem carregar tudo em memória.
- Sei escrever testes com `tmp_path`.
- Sei evitar path traversal.
- Sei criar escrita atômica.
- Sei projetar pipeline profissional de arquivos.
