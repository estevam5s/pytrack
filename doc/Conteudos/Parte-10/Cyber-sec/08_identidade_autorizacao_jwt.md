# Identidade, Autorização, OAuth2, OpenID Connect e JWT

Este módulo complementa a trilha de segurança com os conceitos usados em APIs modernas: autenticação, autorização, tokens, OAuth2, OpenID Connect, RBAC, ABAC e validação segura de JWT com PyJWT.

---

## Autenticação vs Autorização

Autenticação responde:

```text
Quem é você?
```

Autorização responde:

```text
O que você pode fazer?
```

Exemplo:

- login com senha, MFA ou provedor externo autentica o usuário;
- verificar se o usuário pode acessar `/admin` autoriza a ação.

Misturar os dois conceitos gera falhas comuns: aceitar um token válido sem verificar permissões, organização, escopo ou propriedade do recurso.

---

## JWT com PyJWT

JWT é um formato de token assinado. Ele não é criptografado por padrão; o conteúdo é apenas codificado em Base64URL e assinado.

Instalação:

```bash
pip install PyJWT
```

Gerando token:

```python
from datetime import datetime, timedelta, timezone

import jwt


def gerar_token(user_id: str, chave: str) -> str:
    agora = datetime.now(timezone.utc)
    payload = {
        "sub": user_id,
        "iat": agora,
        "exp": agora + timedelta(minutes=15),
        "iss": "https://auth.exemplo.com",
        "aud": "api-pedidos",
        "scope": "pedidos:read",
    }
    return jwt.encode(payload, chave, algorithm="HS256")
```

Validando:

```python
import jwt


def validar_token(token: str, chave: str) -> dict:
    return jwt.decode(
        token,
        chave,
        algorithms=["HS256"],
        audience="api-pedidos",
        issuer="https://auth.exemplo.com",
    )
```

Boas práticas:

- valide `exp`, `iss` e `aud`;
- fixe algoritmos permitidos;
- não aceite `alg=none`;
- use chaves fortes;
- use RS256/ES256 quando há múltiplos serviços validando tokens;
- mantenha tokens curtos em duração;
- use refresh token com rotação quando necessário;
- não coloque dados sensíveis no payload.

---

## OAuth2

OAuth2 é um framework de autorização. Ele permite que uma aplicação acesse recursos em nome de um usuário ou cliente, normalmente por meio de access tokens.

Papéis:

- resource owner: dono do recurso;
- client: aplicação que pede acesso;
- authorization server: emite tokens;
- resource server: API que valida tokens;
- scope: permissão concedida.

Fluxos comuns:

| Fluxo | Uso |
|---|---|
| Authorization Code + PKCE | aplicações web, mobile e SPA modernas |
| Client Credentials | comunicação serviço-serviço |
| Device Authorization | dispositivos sem navegador confortável |
| Refresh Token | renovação controlada de sessão |

Evite fluxos obsoletos como Implicit Flow e Password Grant em projetos novos.

---

## OpenID Connect

OpenID Connect, ou OIDC, é uma camada de identidade sobre OAuth2.

OAuth2 responde:

```text
Este cliente pode acessar este recurso?
```

OIDC adiciona:

```text
Quem é o usuário autenticado?
```

Tokens comuns:

- access token: usado para acessar APIs;
- ID token: contém informações de autenticação do usuário;
- refresh token: usado para obter novos tokens.

Validações importantes em OIDC:

- assinatura pelo JWKS do provedor;
- `iss` correto;
- `aud` correto;
- `exp` válido;
- `nonce` em fluxos que exigem proteção contra replay;
- scopes como `openid`, `profile`, `email`.

---

## Scopes e Claims

Scopes expressam permissões concedidas:

```text
pedidos:read pedidos:write
```

Claims expressam atributos:

```json
{
  "sub": "user-123",
  "org_id": "org-456",
  "roles": ["admin"],
  "scope": "pedidos:read"
}
```

Não confie apenas em claims vindas do cliente. A API deve validar assinatura, emissor, audiência e regras de autorização no servidor.

---

## RBAC

RBAC é autorização baseada em papéis.

Exemplo:

| Papel | Permissões |
|---|---|
| `admin` | gerenciar usuários, pedidos e configurações |
| `gerente` | aprovar pedidos |
| `operador` | ler e atualizar pedidos |
| `leitor` | apenas leitura |

Implementação simples:

```python
PERMISSOES = {
    "admin": {"usuarios:write", "pedidos:read", "pedidos:write"},
    "leitor": {"pedidos:read"},
}


def tem_permissao(roles: list[str], permissao: str) -> bool:
    return any(permissao in PERMISSOES.get(role, set()) for role in roles)
```

RBAC é simples e auditável, mas pode ficar rígido quando há regras por organização, horário, propriedade do recurso ou contexto.

---

## ABAC

ABAC é autorização baseada em atributos.

Exemplo de atributos:

- usuário: cargo, organização, departamento;
- recurso: dono, classificação, status;
- ação: ler, criar, aprovar, excluir;
- contexto: horário, IP, dispositivo, ambiente.

```python
def pode_ler_pedido(usuario: dict, pedido: dict) -> bool:
    mesma_org = usuario["org_id"] == pedido["org_id"]
    dono = usuario["id"] == pedido["user_id"]
    suporte = "suporte" in usuario.get("roles", [])
    return mesma_org and (dono or suporte)
```

ABAC é flexível, mas exige disciplina:

- centralize políticas;
- registre decisões de autorização;
- teste cenários de negação;
- evite regras espalhadas em controllers;
- prefira negar por padrão.

---

## CORS e Tokens

CORS não é autenticação. CORS define quais origens podem ler respostas do navegador.

Configuração perigosa:

```text
Access-Control-Allow-Origin: *
Access-Control-Allow-Credentials: true
```

Boas práticas:

- permita apenas origens conhecidas;
- evite credentials com wildcard;
- restrinja métodos e headers;
- trate preflight corretamente;
- não use CORS para proteger API server-to-server.

---

## Rate Limiting em APIs Autenticadas

Rate limiting reduz abuso, brute force e scraping agressivo.

Dimensões comuns:

- por IP;
- por usuário;
- por token/client_id;
- por rota;
- por organização;
- por custo da operação.

Resposta comum:

```text
HTTP/1.1 429 Too Many Requests
Retry-After: 60
```

Registre eventos de limite para detecção de ataque e troubleshooting.

---

## Checklist

- A API diferencia autenticação de autorização?
- Tokens JWT validam assinatura, `exp`, `iss` e `aud`?
- Algoritmos aceitos são fixos e explícitos?
- OAuth2 usa Authorization Code + PKCE para usuários?
- OIDC valida ID token corretamente?
- Scopes e roles são verificados no servidor?
- RBAC tem matriz clara de permissões?
- ABAC nega por padrão e testa contexto?
- CORS está restrito a origens conhecidas?
- Rate limiting considera IP, usuário e cliente?
