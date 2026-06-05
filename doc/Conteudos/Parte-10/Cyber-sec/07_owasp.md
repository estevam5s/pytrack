# OWASP: Riscos, Controles e Checklist Profissional

OWASP é uma fundação que publica guias e listas de riscos de segurança em aplicações. A lista OWASP Top 10 é uma referência importante para desenvolvedores backend.

OWASP não é uma checklist completa de conformidade, mas é uma ótima base para revisar riscos comuns.

---

## OWASP Top 10: Visão Geral

Categorias recentes incluem:

- Broken Access Control;
- Cryptographic Failures;
- Injection;
- Insecure Design;
- Security Misconfiguration;
- Vulnerable and Outdated Components;
- Identification and Authentication Failures;
- Software and Data Integrity Failures;
- Security Logging and Monitoring Failures;
- Server-Side Request Forgery.

Os nomes podem mudar entre edições, mas os problemas continuam aparecendo em sistemas reais.

---

## Broken Access Control

Falhas de autorização.

Exemplo:

```http
GET /usuarios/123/pedidos
```

Usuário muda para:

```http
GET /usuarios/124/pedidos
```

Controle:

```python
if pedido.usuario_id != usuario_atual.id:
    raise HTTPException(status_code=403)
```

Não confie em ID vindo do cliente para determinar escopo.

---

## Cryptographic Failures

Falhas:

- sem HTTPS;
- senha com SHA-256 simples;
- segredo no Git;
- dados sensíveis em log;
- certificado não validado;
- criptografia caseira.

Controles:

- TLS obrigatório;
- Argon2/bcrypt para senha;
- secret manager;
- mascaramento em logs;
- bibliotecas maduras.

---

## Injection

Inclui SQL Injection, command injection, LDAP injection e outros.

Command injection vulnerável:

```python
os.system(f"convert {filename}")
```

Melhor:

```python
subprocess.run(["convert", filename], check=True)
```

Ainda valide `filename` e permissões.

---

## Insecure Design

Problema de desenho, não apenas bug.

Exemplo:

- reset de senha sem expiração;
- ausência de rate limit em login;
- fluxo de pagamento sem idempotência;
- autorização impossível de aplicar por falta de modelo de permissões.

Segurança precisa entrar no design.

---

## Security Misconfiguration

Falhas:

- debug ligado em produção;
- CORS aberto;
- bucket público;
- headers ausentes;
- usuário root;
- permissões amplas;
- stack trace exposto.

FastAPI/Flask em produção não devem rodar com debug/reload.

---

## Vulnerable and Outdated Components

Dependências vulneráveis são risco real.

Ferramentas:

```bash
pip-audit
safety
trivy
dependabot
renovate
```

Exemplo:

```bash
pip install pip-audit
pip-audit
```

---

## Authentication Failures

Falhas:

- senha fraca sem política;
- sessão sem expiração;
- token sem rotação;
- reset inseguro;
- MFA ausente para admins;
- enumeração de usuário.

Controles:

- hash forte;
- rate limit;
- MFA para perfis críticos;
- tokens com expiração;
- mensagens genéricas;
- auditoria de login.

---

## Software and Data Integrity Failures

Riscos:

- pipeline sem proteção;
- dependência não verificada;
- deploy sem assinatura;
- CI com segredo exposto;
- atualização automática insegura.

Controles:

- branch protection;
- revisão de PR;
- secrets protegidos;
- SBOM;
- assinatura de artefatos;
- imagens versionadas.

---

## Logging and Monitoring Failures

Sem logs, ataques passam despercebidos.

Logue:

- falhas de login;
- acesso negado;
- alteração de permissões;
- tokens criados/revogados;
- erros 5xx;
- rate limits acionados.

Alerta:

- muitas falhas de login;
- pico de 403/401;
- aumento de 500;
- comportamento anormal em endpoints sensíveis.

---

## SSRF

Server-Side Request Forgery ocorre quando atacante faz o servidor chamar URL controlada.

Vulnerável:

```python
url = request.json["url"]
response = requests.get(url)
```

Risco: acessar metadata cloud, rede interna ou serviços privados.

Controles:

- allowlist de domínios;
- bloquear IPs privados/link-local;
- timeout;
- limite de redirects;
- proxy controlado;
- validação de esquema `https`.

---

## Checklist Profissional OWASP

- autorização é verificada por recurso?
- HTTPS é obrigatório?
- senhas usam hash forte?
- queries são parametrizadas?
- uploads são validados?
- debug está desligado?
- CORS é restrito?
- dependências são auditadas?
- logs de segurança existem?
- rate limit protege endpoints críticos?
- reset de senha é seguro?
- segredos estão fora do repositório?
- SSRF foi considerado em chamadas por URL?
- CI/CD protege artefatos e secrets?

