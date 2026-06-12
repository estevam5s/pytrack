# Segurança em Python e Backend

Trilha completa e progressiva sobre segurança para aplicações Python, APIs e backends: validação de entrada, secrets, criptografia, hashing, segurança em APIs, OAuth2, OpenID Connect, RBAC, ABAC, proteção contra SQL Injection, XSS, CSRF, autenticação segura, OWASP e ferramentas de análise.

O objetivo é formar uma base profissional para escrever código defensivo, entender ameaças comuns, aplicar controles corretos e evitar vulnerabilidades frequentes em sistemas reais.

---

## Arquivos da Trilha

1. [Criptografia: Conceitos, Chaves, TLS e Uso Seguro em Python](./01_criptografia.md)
2. [Hashing: Senhas, Integridade, HMAC e Armazenamento Seguro](./02_hashing_senhas_integridade.md)
3. [Segurança em APIs e Autenticação](./03_seguranca_apis_autenticacao.md)
4. [Proteção contra SQL Injection](./04_sql_injection.md)
5. [XSS: Cross-Site Scripting](./05_xss.md)
6. [CSRF: Cross-Site Request Forgery](./06_csrf.md)
7. [OWASP: Riscos, Controles e Checklist Profissional](./07_owasp.md)
8. [Identidade, Autorização, OAuth2, OpenID Connect e JWT](./08_identidade_autorizacao_jwt.md)
9. [Validação, Secrets, Variáveis de Ambiente e Ferramentas de Segurança](./09_validacao_secrets_ferramentas_sast.md)

---

## Competências Esperadas

Ao concluir esta trilha, você deve saber:

- diferenciar criptografia, hashing, assinatura e encoding;
- usar bibliotecas criptográficas com segurança;
- armazenar senhas com Argon2, bcrypt ou PBKDF2;
- usar `cryptography`, `bcrypt`, `passlib`, `argon2-cffi` e `PyJWT` de forma adequada;
- proteger APIs com autenticação, autorização, rate limit e validação;
- aplicar OAuth2, OpenID Connect, RBAC e ABAC em APIs modernas;
- prevenir SQL Injection com queries parametrizadas e ORMs;
- evitar XSS com escaping, CSP e sanitização;
- prevenir CSRF em aplicações com cookies;
- configurar CORS de forma restrita;
- aplicar boas práticas de autenticação;
- entender OWASP Top 10;
- auditar dependências e código com Safety, Bandit, pip-audit, Semgrep e Trivy;
- revisar código Python com olhar de segurança.

---

## Cobertura dos Conceitos Solicitados

| Conceito | Onde estudar |
|---|---|
| Segurança em Python e backend | [01](./01_criptografia.md), [02](./02_hashing_senhas_integridade.md), [03](./03_seguranca_apis_autenticacao.md), [07](./07_owasp.md) |
| Validação de entrada e sanitização | [04](./04_sql_injection.md), [05](./05_xss.md), [09](./09_validacao_secrets_ferramentas_sast.md) |
| Secrets e environment variables | [01](./01_criptografia.md), [02](./02_hashing_senhas_integridade.md), [09](./09_validacao_secrets_ferramentas_sast.md) |
| `cryptography`, `bcrypt`, `passlib`, `argon2-cffi` e `PyJWT` | [01](./01_criptografia.md), [02](./02_hashing_senhas_integridade.md), [08](./08_identidade_autorizacao_jwt.md), [09](./09_validacao_secrets_ferramentas_sast.md) |
| OAuth2 e OpenID Connect | [08](./08_identidade_autorizacao_jwt.md) |
| RBAC e ABAC | [08](./08_identidade_autorizacao_jwt.md) |
| OWASP Top 10 | [07](./07_owasp.md), [09](./09_validacao_secrets_ferramentas_sast.md) |
| CORS, CSRF, XSS, SQL injection e rate limiting | [03](./03_seguranca_apis_autenticacao.md), [04](./04_sql_injection.md), [05](./05_xss.md), [06](./06_csrf.md), [08](./08_identidade_autorizacao_jwt.md) |
| Safety, Bandit, pip-audit, Semgrep e Trivy | [07](./07_owasp.md), [09](./09_validacao_secrets_ferramentas_sast.md) |

---

## Regra Principal

Não implemente criptografia própria. Use bibliotecas maduras, padrões conhecidos e configurações seguras. Segurança ruim costuma parecer correta em testes simples, mas falhar contra atacantes reais.
