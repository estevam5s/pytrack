# Validação, Secrets, Variáveis de Ambiente e Ferramentas de Segurança

Este módulo consolida práticas defensivas de entrada, configuração segura, secrets e ferramentas para encontrar vulnerabilidades em código, dependências, containers e infraestrutura.

---

## Validação de Entrada

Validação garante que dados recebidos respeitam formato, tipo, tamanho e regra de negócio.

Valide em fronteiras:

- API;
- CLI;
- formulários;
- filas;
- webhooks;
- arquivos importados;
- jobs agendados;
- integrações externas.

Exemplo simples:

```python
def validar_quantidade(valor: int) -> int:
    if not isinstance(valor, int):
        raise TypeError("quantidade deve ser int")
    if valor <= 0:
        raise ValueError("quantidade deve ser positiva")
    if valor > 10_000:
        raise ValueError("quantidade acima do limite")
    return valor
```

Prefira validação por allowlist:

```python
STATUS_VALIDOS = {"pendente", "aprovado", "cancelado"}


def validar_status(status: str) -> str:
    if status not in STATUS_VALIDOS:
        raise ValueError("status inválido")
    return status
```

---

## Sanitização

Sanitização transforma ou remove conteúdo perigoso. Ela não substitui validação.

Exemplos:

- remover HTML não permitido;
- normalizar espaços;
- escapar saída em HTML;
- limitar tamanho de strings;
- remover caracteres de controle quando apropriado.

Para XSS, sanitização deve usar parser/allowlist, não regex manual.

```python
import bleach


def sanitizar_html(html: str) -> str:
    return bleach.clean(
        html,
        tags={"p", "strong", "em", "ul", "ol", "li", "a"},
        attributes={"a": ["href", "title"]},
        strip=True,
    )
```

Para SQL injection, não sanitize concatenando strings. Use queries parametrizadas.

---

## Secrets

Secrets são valores que concedem acesso:

- senhas;
- tokens;
- chaves privadas;
- API keys;
- refresh tokens;
- connection strings;
- pepper de senha;
- chaves JWT;
- credenciais de serviço.

Boas práticas:

- não commitar secrets;
- usar secret manager, vault, KMS ou variáveis de ambiente controladas;
- rotacionar periodicamente;
- limitar escopo;
- separar secrets por ambiente;
- registrar acesso quando possível;
- usar `.env.example`, nunca `.env` real no repositório.

---

## Environment Variables

Variáveis de ambiente são forma comum de configurar aplicações.

```python
import os

DATABASE_URL = os.environ["DATABASE_URL"]
DEBUG = os.getenv("DEBUG", "false").lower() == "true"
```

Cuidados:

- falhe cedo quando variável obrigatória não existe;
- não imprima secrets em logs;
- normalize booleanos e números;
- documente variáveis em `.env.example`;
- não confie em variáveis vindas de ambiente comprometido.

Exemplo:

```python
def ler_secret(nome: str) -> str:
    valor = os.getenv(nome)
    if not valor:
        raise RuntimeError(f"variavel obrigatoria ausente: {nome}")
    return valor
```

---

## Cryptography, bcrypt, passlib, argon2-cffi e PyJWT

Mapa de uso:

| Biblioteca | Uso principal |
|---|---|
| `cryptography` | criptografia simétrica/assimétrica, Fernet, AES-GCM, assinaturas |
| `bcrypt` | hashing de senhas com bcrypt |
| `passlib` | camada de alto nível para hashing e migração de esquemas |
| `argon2-cffi` | Argon2 para senhas |
| `PyJWT` | criação e validação de JWT |

Regras práticas:

- não crie algoritmo próprio;
- senha não é criptografada, é hasheada com algoritmo próprio para senha;
- JWT assinado não é criptografado;
- chave de criptografia não fica no código;
- rotação de chaves deve ser planejada.

---

## OWASP Top 10 Como Checklist

Use OWASP Top 10 como revisão mínima:

- controle de acesso quebrado;
- falhas criptográficas;
- injection;
- design inseguro;
- configuração incorreta;
- componentes vulneráveis;
- autenticação falha;
- integridade de software/dados;
- logging e monitoramento insuficientes;
- SSRF.

Além disso, revise CORS, CSRF, XSS, SQL injection e rate limiting em toda API exposta.

---

## Safety

Safety verifica dependências Python vulneráveis.

```bash
pip install safety
safety check
```

Uso:

- auditoria rápida de dependências;
- CI em projetos Python;
- inventário de vulnerabilidades conhecidas.

Observação: bases e comandos podem mudar entre versões. Mantenha a ferramenta atualizada e leia a saída com critério.

---

## Bandit

Bandit faz análise estática de segurança em código Python.

```bash
pip install bandit
bandit -r src
```

Ele encontra padrões como:

- uso perigoso de `subprocess` com `shell=True`;
- `assert` usado como controle de segurança;
- criptografia fraca;
- hardcoded password;
- uso inseguro de `pickle`;
- geração aleatória inadequada.

Nem todo alerta é vulnerabilidade real, mas todo alerta deve ser triado.

---

## pip-audit

`pip-audit` verifica dependências instaladas ou arquivos de requisitos.

```bash
pip install pip-audit
pip-audit
pip-audit -r requirements.txt
```

Use em CI para falhar builds com vulnerabilidades conhecidas quando a política do projeto exigir.

---

## Semgrep

Semgrep faz análise estática com regras para múltiplas linguagens.

```bash
semgrep --config auto .
```

Usos:

- SAST;
- regras customizadas da empresa;
- encontrar padrões inseguros;
- validar práticas de framework;
- rodar em pull requests.

Exemplo de risco que Semgrep pode detectar: query SQL montada por f-string, segredo hardcoded ou uso inseguro de biblioteca.

---

## Trivy

Trivy analisa containers, sistemas de arquivos, dependências e configurações.

```bash
trivy fs .
trivy image minha-api:latest
```

Usos:

- vulnerabilidades em imagem Docker;
- dependências;
- arquivos de IaC;
- segredos acidentais;
- SBOM dependendo da configuração.

Trivy é especialmente útil quando a aplicação Python será empacotada em container.

---

## Pipeline de Segurança Recomendado

Exemplo de camadas:

```text
pré-commit:
  ruff, bandit básico, detecção de secrets

pull request:
  testes, mypy/pyright, bandit, semgrep, pip-audit

build de container:
  trivy image

produção:
  logs, alertas, rate limiting, WAF quando aplicável
```

Ferramentas não substituem revisão humana. Elas reduzem esquecimento e aumentam consistência.

---

## Checklist

- Entradas externas são validadas por tipo, tamanho e allowlist?
- Sanitização usa biblioteca adequada quando aceita HTML?
- Queries SQL são parametrizadas?
- Secrets estão fora do código e fora do Git?
- `.env.example` documenta configuração sem segredos reais?
- Senhas usam Argon2, bcrypt ou PBKDF2/passlib?
- JWT é validado com emissor, audiência e expiração?
- Dependências são auditadas com Safety ou pip-audit?
- Código é analisado com Bandit e Semgrep?
- Containers e filesystem são verificados com Trivy?
- Alertas de ferramentas têm triagem e dono?
