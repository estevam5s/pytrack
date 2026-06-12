# Hashing: Senhas, Integridade, HMAC e Armazenamento Seguro

Hashing transforma dados em um resumo de tamanho fixo. É usado para integridade, identificação e armazenamento seguro de senhas quando combinado com algoritmos adequados.

Hash não é criptografia reversível. Você não "descriptografa" hash.

---

## Hash Criptográfico

```python
import hashlib


digest = hashlib.sha256(b"mensagem").hexdigest()
print(digest)
```

SHA-256 é bom para integridade, mas não para armazenar senhas diretamente.

---

## Hash de Senha

Senhas precisam de algoritmos lentos e com salt:

- Argon2;
- bcrypt;
- scrypt;
- PBKDF2.

Evite:

```python
hashlib.sha256(senha.encode()).hexdigest()
```

É rápido demais para senhas e vulnerável a ataques de força bruta com GPUs.

---

## Argon2

```bash
pip install argon2-cffi
```

```python
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError


ph = PasswordHasher()


def gerar_hash_senha(senha: str) -> str:
    return ph.hash(senha)


def verificar_senha(hash_salvo: str, senha: str) -> bool:
    try:
        return ph.verify(hash_salvo, senha)
    except VerifyMismatchError:
        return False
```

O hash gerado já inclui salt e parâmetros.

---

## bcrypt

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

## Salt e Pepper

Salt:

- aleatório;
- único por senha;
- pode ser público;
- impede rainbow tables.

Pepper:

- segredo global;
- fica fora do banco;
- aumenta proteção se banco vazar;
- exige estratégia de rotação.

Exemplo conceitual:

```python
import os


PEPPER = os.environ["PASSWORD_PEPPER"]


def aplicar_pepper(senha: str) -> str:
    return senha + PEPPER
```

Use com cuidado. Perder pepper pode impedir validação de senhas.

---

## HMAC

HMAC autentica mensagem com segredo compartilhado.

```python
import hmac
import hashlib


def assinar(payload: bytes, segredo: bytes) -> str:
    return hmac.new(segredo, payload, hashlib.sha256).hexdigest()


def verificar(payload: bytes, assinatura: str, segredo: bytes) -> bool:
    esperada = assinar(payload, segredo)
    return hmac.compare_digest(esperada, assinatura)
```

Use `compare_digest` para evitar timing attacks simples.

---

## Assinatura de Webhook

```python
def verificar_webhook(body: bytes, header_signature: str) -> bool:
    segredo = os.environ["WEBHOOK_SECRET"].encode()
    return verificar(body, header_signature, segredo)
```

Boas práticas:

- assine corpo bruto;
- inclua timestamp;
- rejeite mensagens antigas;
- use comparação constante;
- registre tentativas inválidas sem logar segredo.

---

## Tokens Aleatórios

```python
import secrets


def gerar_token_reset() -> str:
    return secrets.token_urlsafe(32)
```

Armazene hash do token, não o token puro:

```python
def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()
```

Quando usuário envia token, compare hash.

---

## Checklist

- senhas usam Argon2/bcrypt/scrypt/PBKDF2?
- cada senha tem salt?
- parâmetros de custo são adequados?
- tokens são gerados com `secrets`?
- tokens sensíveis são armazenados como hash?
- HMAC usa `compare_digest`?
- webhook valida timestamp?
- logs não expõem senhas ou tokens?
- fluxo de reset expira tokens?

