# Serialização, Uploads e Background Tasks

Serialização transforma objetos Python em formatos transportáveis, como JSON. Uploads recebem arquivos de clientes. Background tasks executam trabalho fora do fluxo principal da request. Esses três temas aparecem em quase todo backend real.

---

## Serialização

Serializar:

```python
import json
from datetime import datetime

payload = {"id": 1, "criado_em": datetime.utcnow().isoformat()}
body = json.dumps(payload)
```

Desserializar:

```python
dados = json.loads(body)
```

Problema: tipos como `datetime`, `Decimal` e UUID precisam de conversão.

---

## Pydantic

```python
from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, Field


class ProdutoOut(BaseModel):
    id: int
    nome: str
    preco: Decimal
    criado_em: datetime


produto = ProdutoOut(id=1, nome="Teclado", preco=Decimal("199.90"), criado_em=datetime.utcnow())
print(produto.model_dump(mode="json"))
```

Use schemas diferentes para entrada e saída.

```python
class ProdutoCreate(BaseModel):
    nome: str = Field(min_length=1, max_length=120)
    preco: Decimal = Field(gt=0)


class ProdutoResponse(BaseModel):
    id: int
    nome: str
    preco: Decimal
```

---

## Serialização e Segurança

Não exponha:

- senha hash;
- tokens;
- documentos sensíveis;
- flags internas;
- campos de auditoria privados;
- dados de outro tenant.

Errado:

```python
return usuario.__dict__
```

Correto:

```python
return UsuarioPublico.model_validate(usuario).model_dump()
```

---

## Upload com FastAPI

```python
from pathlib import Path
from fastapi import FastAPI, File, UploadFile

app = FastAPI()
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    destino = UPLOAD_DIR / file.filename
    conteudo = await file.read()
    destino.write_bytes(conteudo)
    return {"filename": file.filename, "size": len(conteudo)}
```

Esse exemplo é didático. Em produção, valide nome, tamanho e tipo.

---

## Upload Seguro

```python
from pathlib import Path
from uuid import uuid4

ALLOWED_CONTENT_TYPES = {"image/png", "image/jpeg", "application/pdf"}
MAX_SIZE = 10 * 1024 * 1024


def nome_seguro(nome_original: str) -> str:
    extensao = Path(nome_original).suffix.lower()
    return f"{uuid4().hex}{extensao}"


@app.post("/arquivos")
async def receber_arquivo(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(status_code=415, detail="Tipo não permitido")

    total = 0
    destino = UPLOAD_DIR / nome_seguro(file.filename or "arquivo")

    with destino.open("wb") as out:
        while chunk := await file.read(1024 * 1024):
            total += len(chunk)
            if total > MAX_SIZE:
                destino.unlink(missing_ok=True)
                raise HTTPException(status_code=413, detail="Arquivo muito grande")
            out.write(chunk)

    return {"id": destino.name, "size": total}
```

Cuidados:

- não confie em `filename`;
- limite tamanho;
- valide content type e, se necessário, assinatura do arquivo;
- salve fora do diretório público;
- faça scan de malware em ambientes críticos;
- use storage externo para escala.

---

## Upload com Flask

```python
from flask import Flask, request
from werkzeug.utils import secure_filename

app = Flask(__name__)


@app.post("/upload")
def upload():
    file = request.files["file"]
    filename = secure_filename(file.filename)
    file.save(f"uploads/{filename}")
    return {"filename": filename}
```

Ainda valide tamanho, extensão e conteúdo.

---

## Background Tasks Simples

FastAPI:

```python
from fastapi import BackgroundTasks


def enviar_email(email: str) -> None:
    print(f"Enviando email para {email}")


@app.post("/convites")
def criar_convite(email: str, background_tasks: BackgroundTasks):
    background_tasks.add_task(enviar_email, email)
    return {"status": "agendado"}
```

Bom para tarefas curtas e não críticas. Se o processo cair, a tarefa pode ser perdida.

---

## Filas Profissionais

Use fila quando:

- tarefa é demorada;
- precisa de retry;
- precisa de reprocessamento;
- tarefa é crítica;
- há workers separados;
- precisa controlar concorrência.

Opções:

- Celery com Redis/RabbitMQ;
- RQ com Redis;
- Dramatiq;
- Arq;
- SQS, Pub/Sub, Kafka.

---

## Celery

```bash
pip install celery redis
```

`tasks.py`:

```python
from celery import Celery

celery_app = Celery(
    "app",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/1",
)


@celery_app.task(bind=True, autoretry_for=(Exception,), retry_backoff=True, max_retries=3)
def enviar_email_task(self, email: str, assunto: str) -> None:
    print(f"Enviando {assunto} para {email}")
```

Chamada:

```python
enviar_email_task.delay("ana@example.com", "Bem-vinda")
```

Worker:

```bash
celery -A tasks.celery_app worker --loglevel=INFO
```

---

## Idempotência em Background Tasks

Workers podem executar novamente a mesma tarefa.

```python
def processar_pagamento(pagamento_id: int) -> None:
    pagamento = buscar_pagamento(pagamento_id)
    if pagamento.status == "processado":
        return
    cobrar_cliente(pagamento)
    marcar_processado(pagamento_id)
```

Tarefas críticas devem ser idempotentes.

---

## Checklist

- schemas de entrada e saída são separados?
- JSON não expõe campos internos?
- uploads têm limite de tamanho?
- nome de arquivo é normalizado?
- arquivo é salvo fora de path público?
- tarefas críticas usam fila real?
- background tasks têm retry?
- tarefas são idempotentes?
- workers têm logs e métricas?
- falhas vão para dead letter ou reprocessamento?

