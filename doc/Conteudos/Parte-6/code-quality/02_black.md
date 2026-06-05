# Black: Formatação Automática e Padronização

Black é um formatador automático de código Python. Ele aplica um estilo consistente, com pouca configuração. A proposta é eliminar debates de formatação e permitir que a equipe foque comportamento, design e arquitetura.

---

## Instalação

```bash
pip install black
```

Formatar projeto:

```bash
black .
```

Verificar sem alterar:

```bash
black --check .
```

Mostrar diff:

```bash
black --diff .
```

---

## Antes e Depois

Antes:

```python
def criar_usuario(nome,email,ativo=True):
    return {"nome":nome,"email":email,"ativo":ativo}
```

Depois:

```python
def criar_usuario(nome, email, ativo=True):
    return {"nome": nome, "email": email, "ativo": ativo}
```

---

## Configuração no pyproject.toml

```toml
[tool.black]
line-length = 88
target-version = ["py312"]
include = '\.pyi?$'
extend-exclude = '''
/(
  migrations
  | .venv
  | build
  | dist
)/
'''
```

`line-length = 88` é o padrão do Black. Mudar é possível, mas mantenha consistência com Ruff/isort.

---

## Black em CI

GitHub Actions:

```yaml
- name: Check formatting
  run: black --check .
```

Se falhar, o desenvolvedor roda:

```bash
black .
```

---

## Black com pre-commit

`.pre-commit-config.yaml`:

```yaml
repos:
  - repo: https://github.com/psf/black
    rev: 24.8.0
    hooks:
      - id: black
```

Instalar:

```bash
pip install pre-commit
pre-commit install
```

Rodar em tudo:

```bash
pre-commit run --all-files
```

---

## Strings e Aspas

Black tende a normalizar aspas para duplas quando possível.

```python
nome = "Ana"
```

Se você precisa evitar normalização:

```bash
black --skip-string-normalization .
```

Use essa opção apenas por decisão de equipe, não por preferência individual.

---

## Black e Diffs

Black reduz diffs subjetivos:

```python
resultado = minha_funcao(
    primeiro_argumento,
    segundo_argumento,
    terceiro_argumento,
)
```

Adicionar novo argumento gera diff pequeno.

---

## Black em Projeto Legado

Estratégia:

1. crie PR só de formatação;
2. não misture mudança funcional;
3. alinhe time antes;
4. aplique `black .`;
5. ative `black --check` no CI depois.

Misturar formatação massiva com lógica dificulta revisão.

---

## Black vs Ruff Formatter

Ruff também tem formatter. Em projetos novos, você pode escolher:

- Black como formatador consolidado;
- Ruff formatter para reduzir ferramentas.

Evite usar dois formatadores simultaneamente se eles brigam. Escolha um padrão.

---

## Checklist Black

- Black está no `pyproject.toml`?
- CI roda `black --check`?
- pre-commit roda Black?
- line length está alinhado com Ruff/isort?
- projeto legado recebeu PR só de formatação?
- equipe evita discutir estilo manualmente?

