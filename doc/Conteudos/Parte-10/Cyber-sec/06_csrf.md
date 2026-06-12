# CSRF: Cross-Site Request Forgery

CSRF ocorre quando um site malicioso induz o navegador de um usuário autenticado a enviar uma request para outro site usando cookies automaticamente.

CSRF afeta principalmente aplicações que usam cookies para autenticação. APIs que usam Bearer token em header `Authorization` são menos expostas ao CSRF clássico, porque outro site não consegue enviar esse header sem CORS permitido.

---

## Exemplo de Ataque

Usuário está logado em `banco.com`. Site malicioso contém:

```html
<form action="https://banco.com/transferir" method="POST">
  <input name="valor" value="1000">
  <input name="destino" value="atacante">
</form>
<script>document.forms[0].submit()</script>
```

O navegador pode enviar cookies de `banco.com` junto.

---

## Proteções

- CSRF token;
- SameSite cookies;
- verificar Origin/Referer;
- exigir métodos seguros;
- não aceitar GET para ações mutáveis;
- reautenticação para ações críticas.

---

## SameSite Cookies

```http
Set-Cookie: session=abc; HttpOnly; Secure; SameSite=Lax
```

Modos:

- `Strict`: mais seguro, pode afetar navegação.
- `Lax`: bom padrão para muitos apps.
- `None`: permite cross-site, exige Secure.

---

## CSRF Token

Servidor gera token, coloca no formulário e valida no POST.

```html
<input type="hidden" name="csrf_token" value="{{ csrf_token }}">
```

Na request:

```python
def validar_csrf(session_token: str, form_token: str) -> None:
    if not secrets.compare_digest(session_token, form_token):
        raise PermissionError("CSRF inválido")
```

---

## Flask-WTF

```bash
pip install flask-wtf
```

```python
from flask_wtf import CSRFProtect

csrf = CSRFProtect(app)
app.config["SECRET_KEY"] = "segredo-forte"
```

Formulários Flask-WTF incluem CSRF automaticamente.

---

## APIs SPA com Cookies

Se SPA usa cookie de sessão:

- configure SameSite;
- use CSRF token em header customizado;
- CORS restrito;
- `withCredentials` somente para origem confiável.

Header:

```http
X-CSRF-Token: token
```

Outro site não consegue enviar header customizado sem preflight e CORS permitido.

---

## Verificação de Origin

```python
ALLOWED_ORIGINS = {"https://app.exemplo.com"}


def validar_origin(origin: str | None) -> None:
    if origin not in ALLOWED_ORIGINS:
        raise PermissionError("Origin inválida")
```

Não use como única defesa em todos os cenários, mas é uma camada útil.

---

## Quando CSRF Não É o Principal Risco

Se a API usa:

```http
Authorization: Bearer token
```

e o token fica em memória ou storage e precisa ser adicionado pelo JS, outro site não envia automaticamente esse header. Nesse caso, XSS pode ser risco maior.

Mas se token fica em cookie enviado automaticamente, CSRF volta a importar.

---

## Checklist

- ações mutáveis não usam GET?
- cookies têm SameSite, Secure e HttpOnly?
- formulários têm CSRF token?
- APIs com cookie validam CSRF token/header?
- CORS é restrito?
- Origin/Referer é validado quando adequado?
- ações críticas exigem confirmação ou reautenticação?
- testes cobrem ausência/token inválido?

