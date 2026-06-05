# Autenticação JWT e OAuth2

Autenticação identifica quem está chamando a aplicação. Autorização decide o que essa identidade pode fazer. Em APIs Python, JWT e OAuth2 aparecem com frequência em login, APIs internas, integrações, aplicações mobile, SPAs e microsserviços.

---

## Autenticação vs Autorização

Autenticação:

```text
Quem é você?
```

Autorização:

```text
Você pode acessar este recurso?
```

Exemplo:

```python
def pode_editar_tarefa(usuario, tarefa) -> bool:
    return usuario["id"] == tarefa["dono_id"] or "admin" in usuario["roles"]
```

Não confie apenas no frontend para esconder botões. A autorização precisa estar no backend.

---

## JWT

JWT é um token compacto com três partes:

```text
header.payload.signature
```

Payload típico:

```json
{
  "sub": "123",
  "email": "ana@example.com",
  "roles": ["admin"],
  "exp": 1778840000,
  "iat": 1778836400,
  "iss": "api.exemplo.com",
  "aud": "app.exemplo.com"
}
```

JWT assinado garante integridade, não sigilo. O payload pode ser lido por quem possui o token. Não coloque senha, documento sensível ou segredos no token.

---

## Criando JWT com Python

```bash
pip install pyjwt
```

```python
from datetime import datetime, timedelta, timezone
import jwt


SECRET = "troque-por-segredo-forte"
ALGORITHM = "HS256"


def criar_access_token(usuario_id: int, roles: list[str]) -> str:
    agora = datetime.now(timezone.utc)
    payload = {
        "sub": str(usuario_id),
        "roles": roles,
        "iat": agora,
        "exp": agora + timedelta(minutes=15),
        "iss": "api.exemplo.com",
        "aud": "app.exemplo.com",
    }
    return jwt.encode(payload, SECRET, algorithm=ALGORITHM)


def verificar_token(token: str) -> dict:
    return jwt.decode(
        token,
        SECRET,
        algorithms=[ALGORITHM],
        issuer="api.exemplo.com",
        audience="app.exemplo.com",
    )
```

Em produção, prefira segredo forte vindo de secret manager e considere RS256 com chave privada/pública.

---

## FastAPI com Bearer Token

```python
from typing import Annotated
from fastapi import Depends, FastAPI, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import jwt

app = FastAPI()
security = HTTPBearer()


def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)]
) -> dict:
    token = credentials.credentials
    try:
        payload = verificar_token(token)
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Token inválido")
    return {"id": int(payload["sub"]), "roles": payload.get("roles", [])}


@app.get("/me")
def me(usuario: Annotated[dict, Depends(get_current_user)]):
    return usuario
```

---

## Permissões por Role

```python
from collections.abc import Callable


def exigir_role(role: str) -> Callable:
    def dependency(usuario: Annotated[dict, Depends(get_current_user)]) -> dict:
        if role not in usuario["roles"]:
            raise HTTPException(status_code=403, detail="Permissão negada")
        return usuario
    return dependency


@app.get("/admin")
def admin(usuario: Annotated[dict, Depends(exigir_role("admin"))]):
    return {"ok": True}
```

RBAC por role é simples. Para domínios complexos, use permissões granulares, políticas ou ABAC.

---

## Access Token e Refresh Token

Access token:

- vida curta;
- usado em cada request;
- expõe menos risco se vazar.

Refresh token:

- vida maior;
- usado para gerar novo access token;
- deve ser armazenado com mais cuidado;
- pode ser revogado.

Armazene refresh tokens no banco como hash, com expiração e dispositivo.

---

## OAuth2

OAuth2 é um framework de autorização. Ele permite que uma aplicação acesse recursos em nome de um usuário ou serviço.

Papéis:

- **Resource Owner**: usuário.
- **Client**: aplicação que pede acesso.
- **Authorization Server**: emite tokens.
- **Resource Server**: API protegida.

Fluxos comuns:

- Authorization Code com PKCE: apps web/mobile modernas.
- Client Credentials: comunicação serviço-serviço.
- Refresh Token: renovação de sessão.

---

## OAuth2 Password Flow

Muito usado em exemplos, mas menos recomendado para terceiros.

FastAPI:

```python
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")


@app.post("/auth/token")
def login(form: Annotated[OAuth2PasswordRequestForm, Depends()]):
    usuario = autenticar_usuario(form.username, form.password)
    if not usuario:
        raise HTTPException(status_code=401, detail="Credenciais inválidas")
    token = criar_access_token(usuario.id, usuario.roles)
    return {"access_token": token, "token_type": "bearer"}
```

---

## Client Credentials

Usado para máquina falando com máquina.

```python
def autenticar_client(client_id: str, client_secret: str) -> dict | None:
    client = buscar_client(client_id)
    if not client or not verificar_secret(client_secret, client.secret_hash):
        return None
    return {"sub": client_id, "scopes": client.scopes}
```

Scopes:

```text
pedidos:read
pedidos:write
relatorios:admin
```

---

## Segurança de Senhas

Nunca salve senha pura.

```bash
pip install passlib[bcrypt]
```

```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    return pwd_context.verify(password, password_hash)
```

---

## Checklist

- tokens têm expiração curta?
- payload não contém dados sensíveis?
- `iss` e `aud` são validados?
- algoritmo é fixado no decode?
- refresh token pode ser revogado?
- senhas usam hash forte?
- autorização é checada no backend?
- scopes/roles são documentados?
- HTTPS é obrigatório?
- logs não registram tokens?

