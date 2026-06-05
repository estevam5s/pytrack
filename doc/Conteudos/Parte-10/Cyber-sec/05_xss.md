# XSS: Cross-Site Scripting

XSS ocorre quando uma aplicação permite que código JavaScript malicioso seja executado no navegador de outro usuário. É comum em aplicações que exibem conteúdo vindo de usuários.

Mesmo APIs Python podem contribuir para XSS se retornam HTML inseguro, armazenam conteúdo perigoso ou configuram CORS/cookies de forma inadequada.

---

## Tipos de XSS

- **Stored XSS**: payload salvo no banco e exibido depois.
- **Reflected XSS**: payload vem na request e volta na response.
- **DOM XSS**: vulnerabilidade no JavaScript do frontend.

Payload clássico:

```html
<script>alert('xss')</script>
```

---

## Exemplo Vulnerável em Flask

```python
from flask import request


@app.get("/buscar")
def buscar():
    termo = request.args["q"]
    return f"<h1>Resultado para {termo}</h1>"
```

Se `q=<script>alert(1)</script>`, o script pode executar.

---

## Escaping com Templates

Jinja2 escapa por padrão em templates HTML.

```html
<h1>Resultado para {{ termo }}</h1>
```

Evite `|safe` com conteúdo de usuário:

```html
{{ comentario|safe }}
```

Só use se o conteúdo foi sanitizado corretamente.

---

## APIs JSON

Em APIs JSON, o risco principal aparece quando o frontend insere dados no DOM com `innerHTML`.

Backend ainda deve:

- validar tamanho;
- restringir campos;
- sanitizar HTML se aceita rich text;
- definir `Content-Type: application/json`;
- não retornar HTML quando deveria retornar JSON.

---

## Sanitização de HTML

Se sua aplicação permite HTML rico, use sanitização com allowlist.

```bash
pip install bleach
```

```python
import bleach


ALLOWED_TAGS = ["p", "strong", "em", "ul", "ol", "li", "a"]
ALLOWED_ATTRIBUTES = {"a": ["href", "title"]}


def sanitizar_html(html: str) -> str:
    return bleach.clean(
        html,
        tags=ALLOWED_TAGS,
        attributes=ALLOWED_ATTRIBUTES,
        strip=True,
    )
```

Não tente sanitizar HTML com regex.

---

## Content Security Policy

CSP reduz impacto de XSS.

```http
Content-Security-Policy: default-src 'self'; script-src 'self'
```

Flask:

```python
@app.after_request
def security_headers(response):
    response.headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self'"
    return response
```

CSP precisa ser ajustada ao frontend real.

---

## Cookies e XSS

Mitigue roubo de sessão:

```http
Set-Cookie: session=...; HttpOnly; Secure; SameSite=Lax
```

- `HttpOnly`: JS não lê cookie.
- `Secure`: só HTTPS.
- `SameSite`: reduz CSRF.

HttpOnly não impede XSS, mas reduz roubo direto de cookie.

---

## Checklist

- templates escapam por padrão?
- conteúdo de usuário evita `safe`?
- HTML rico é sanitizado com allowlist?
- APIs retornam Content-Type correto?
- frontend evita `innerHTML` com dados externos?
- CSP foi considerada?
- cookies usam HttpOnly, Secure e SameSite?
- payloads XSS básicos são testados?
- dados armazenados são tratados como não confiáveis ao exibir?

