# Criptografia: Conceitos, Chaves, TLS e Uso Seguro em Python

Criptografia protege confidencialidade, integridade, autenticidade e não repúdio em sistemas digitais. Em aplicações Python, ela aparece em TLS, tokens, assinatura de mensagens, criptografia de campos sensíveis, armazenamento de segredos e comunicação entre serviços.

Criptografia é uma área em que improvisar é perigoso. Não crie algoritmo próprio, não invente modo de operação e não reutilize exemplos sem entender ameaças.

---

## Conceitos Essenciais

- **Plaintext**: dado original.
- **Ciphertext**: dado criptografado.
- **Chave**: segredo usado no algoritmo.
- **Nonce/IV**: valor único usado em operações criptográficas.
- **Criptografia simétrica**: mesma chave cifra e decifra.
- **Criptografia assimétrica**: par de chaves pública/privada.
- **Assinatura digital**: prova autenticidade e integridade.
- **TLS**: protege comunicação em trânsito.
- **Encoding**: representação, não segurança.

Base64 não é criptografia:

```python
import base64

valor = base64.b64encode(b"segredo").decode()
print(valor)
print(base64.b64decode(valor))
```

Qualquer pessoa pode decodificar.

---

## Criptografia Simétrica

Use quando a mesma parte ou serviço confiável precisa cifrar e decifrar.

Biblioteca recomendada:

```bash
pip install cryptography
```

Fernet é uma API de alto nível que combina criptografia autenticada, timestamp e formato seguro.

```python
from cryptography.fernet import Fernet


key = Fernet.generate_key()
fernet = Fernet(key)

token = fernet.encrypt(b"dado sensivel")
plaintext = fernet.decrypt(token)

print(plaintext.decode())
```

Guarde a chave fora do código: secret manager, variável de ambiente, KMS ou vault.

---

## Chave via Variável de Ambiente

```python
import os
from cryptography.fernet import Fernet


def get_fernet() -> Fernet:
    key = os.environ["FERNET_KEY"].encode()
    return Fernet(key)


def criptografar(valor: str) -> str:
    return get_fernet().encrypt(valor.encode()).decode()


def descriptografar(token: str) -> str:
    return get_fernet().decrypt(token.encode()).decode()
```

Gerar chave:

```bash
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```

---

## Criptografia Autenticada

Criptografia precisa proteger confidencialidade e integridade. Modos modernos como AES-GCM e ChaCha20-Poly1305 são exemplos de AEAD.

Exemplo com AES-GCM:

```python
import os
from cryptography.hazmat.primitives.ciphers.aead import AESGCM


def encrypt(key: bytes, plaintext: bytes, associated_data: bytes | None = None) -> tuple[bytes, bytes]:
    nonce = os.urandom(12)
    aesgcm = AESGCM(key)
    ciphertext = aesgcm.encrypt(nonce, plaintext, associated_data)
    return nonce, ciphertext


def decrypt(key: bytes, nonce: bytes, ciphertext: bytes, associated_data: bytes | None = None) -> bytes:
    aesgcm = AESGCM(key)
    return aesgcm.decrypt(nonce, ciphertext, associated_data)


key = AESGCM.generate_key(bit_length=256)
nonce, ciphertext = encrypt(key, b"segredo")
print(decrypt(key, nonce, ciphertext))
```

Nunca reutilize nonce com a mesma chave em AES-GCM.

---

## Criptografia Assimétrica

Usa chave pública e privada.

Casos:

- assinatura de tokens;
- troca de chaves;
- mTLS;
- assinatura de artefatos;
- comunicação entre sistemas.

Exemplo de assinatura Ed25519:

```python
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey


private_key = Ed25519PrivateKey.generate()
public_key = private_key.public_key()

mensagem = b"payload importante"
assinatura = private_key.sign(mensagem)

public_key.verify(assinatura, mensagem)
```

Se a mensagem for alterada, a verificação falha.

---

## TLS

TLS protege dados em trânsito. Para APIs:

- use HTTPS;
- redirecione HTTP para HTTPS;
- configure certificados válidos;
- use HSTS quando adequado;
- valide certificados em clientes HTTP;
- não desative verificação SSL.

Errado:

```python
requests.get("https://api.example.com", verify=False)
```

Correto:

```python
requests.get("https://api.example.com", timeout=10)
```

---

## Rotação de Chaves

Chaves precisam de ciclo de vida:

- geração segura;
- armazenamento seguro;
- controle de acesso;
- rotação;
- revogação;
- auditoria;
- destruição.

Estratégia comum:

- manter `key_id`;
- cifrar novo dado com chave atual;
- conseguir ler dados antigos com chaves antigas;
- recifrar gradualmente.

---

## Erros Comuns

- guardar chave no Git;
- usar Base64 como proteção;
- reutilizar IV/nonce;
- usar algoritmo obsoleto;
- desativar TLS verification;
- criptografar senha em vez de aplicar hash de senha;
- usar `random` para segredo;
- escrever função criptográfica própria.

Use `secrets`, não `random`, para tokens:

```python
import secrets

token = secrets.token_urlsafe(32)
```

---

## Checklist

- biblioteca criptográfica é madura?
- chaves estão fora do código?
- há rotação de chaves?
- TLS está obrigatório?
- certificados são validados?
- dados sensíveis precisam mesmo ser reversíveis?
- nonce/IV é único?
- senha usa hashing próprio para senha, não criptografia reversível?
- logs não expõem plaintext?

