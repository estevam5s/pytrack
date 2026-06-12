# Segurança em APIs e Autenticação

APIs expõem regras de negócio para clientes, sistemas e usuários. Uma API segura valida entrada, autentica corretamente, autoriza por recurso, limita abuso, registra eventos relevantes e evita vazamento de dados.

---

## Superfície de Ataque

APIs recebem:

- headers;
- query params;
- path params;
- JSON body;
- uploads;
- cookies;
- tokens;
- webhooks.

Tudo que vem de fora é não confiável.

---

## Validação de Entrada

FastAPI com Pydantic:

```python
from pydantic import BaseModel, Field


class CriarUsuario(BaseModel):
    email: str = Field(pattern=r"^[^@]+@[^@]+\.[^@]+$")
    senha: str = Field(min_length=12, max_length=128)
```

Valide:

- tipo;
- tamanho;
- formato;
- faixa;
- enum;
- obrigatoriedade;
- consistência entre campos.

---

## Autenticação Bearer

```python
from typing import Annotated
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()


def get_token(credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)]) -> str:
    return credentials.credentials
```

Sempre use HTTPS para tokens.

---

## Autorização por Recurso

Não basta estar logado.

```python
def buscar_tarefa_do_usuario(tarefa_id: int, usuario_id: int):
    tarefa = repo.buscar(tarefa_id)
    if tarefa is None:
        raise HTTPException(status_code=404)
    if tarefa.usuario_id != usuario_id:
        raise HTTPException(status_code=403)
    return tarefa
```

Falha comum: IDOR, quando usuário acessa recurso de outro alterando o ID.

---

## Rate Limiting

Protege contra abuso:

- login brute force;
- scraping;
- DoS simples;
- uso indevido de API key.

```python
def chave_rate_limit(request, usuario=None) -> str:
    if usuario:
        return f"user:{usuario.id}"
    return f"ip:{request.client.host}"
```

Login deve ter limite específico e resposta genérica.

---

## Respostas de Erro Seguras

Evite:

```json
{"erro": "Usuário ana@example.com não existe"}
```

Prefira:

```json
{"erro": "Credenciais inválidas"}
```

Não revele se e-mail existe no login ou reset de senha.

---

## Headers de Segurança

```python
@app.middleware("http")
async def security_headers(request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response
```

Para APIs puras, CSP pode ser menos relevante; para apps web, é importante.

---

## API Keys

API keys devem:

- ser longas e aleatórias;
- ser armazenadas como hash;
- ter escopo;
- ter expiração ou rotação;
- ser revogáveis;
- ser exibidas uma vez.

```python
import secrets


def gerar_api_key() -> str:
    return "sk_" + secrets.token_urlsafe(32)
```

---

## Segurança em Uploads

Cuidados:

- limitar tamanho;
- validar extensão e MIME;
- gerar nome próprio;
- armazenar fora do diretório público;
- escanear malware em cenários críticos;
- impedir path traversal;
- não executar arquivo enviado.

```python
from pathlib import Path
from uuid import uuid4


def nome_upload_seguro(nome_original: str) -> str:
    return uuid4().hex + Path(nome_original).suffix.lower()
```

---

## Logs de Segurança

Logue:

- login bem-sucedido;
- falhas repetidas;
- alteração de senha;
- criação/revogação de token;
- acesso negado;
- mudanças administrativas.

Não logue:

- senha;
- token;
- API key;
- documentos sem necessidade.

---

## Checklist

- todas entradas são validadas?
- autenticação exige HTTPS?
- autorização é por recurso?
- rate limit protege login e endpoints caros?
- erros não enumeram usuários?
- API keys são armazenadas como hash?
- uploads são validados?
- eventos de segurança são auditados?
- CORS é restrito?
- segredos estão fora do código?

