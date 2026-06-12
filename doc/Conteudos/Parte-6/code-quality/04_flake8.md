# Flake8: Linting Clássico e Ecossistema de Plugins

Flake8 é uma ferramenta clássica de linting que combina pyflakes, pycodestyle e McCabe. Foi por muitos anos padrão em projetos Python e ainda aparece em bases legadas e empresas com plugins específicos.

Mesmo com Ruff ganhando espaço, entender Flake8 ajuda a manter projetos existentes e migrar com segurança.

---

## Instalação

```bash
pip install flake8
```

Rodar:

```bash
flake8 .
```

---

## Configuração

Flake8 pode usar `.flake8`, `setup.cfg` ou `tox.ini`.

`.flake8`:

```ini
[flake8]
max-line-length = 88
extend-ignore = E203, W503
exclude =
    .git,
    .venv,
    build,
    dist,
    migrations
```

`E203` costuma ser ignorado para compatibilidade com Black.

---

## Erros Comuns

- `F401`: import não usado.
- `F821`: nome não definido.
- `E501`: linha longa.
- `E302`: blank lines.
- `C901`: complexidade alta.

Exemplo:

```python
def funcao():
    return nome_nao_definido
```

Flake8 aponta `F821`.

---

## Plugins Populares

```bash
pip install flake8-bugbear flake8-comprehensions flake8-builtins flake8-docstrings
```

Plugins:

- `flake8-bugbear`: possíveis bugs e más práticas.
- `flake8-comprehensions`: melhorias em comprehensions.
- `flake8-builtins`: nomes que sombreiam builtins.
- `flake8-docstrings`: docstrings.
- `flake8-bandit`: segurança.

---

## Complexidade McCabe

```ini
[flake8]
max-complexity = 10
```

Código com muitos branches fica difícil de testar e manter.

```python
def processar(x):
    if ...:
        ...
    elif ...:
        ...
    elif ...:
        ...
```

Complexidade alta pode indicar necessidade de separar funções, estratégias ou regras.

---

## Flake8 com Black

Configuração típica:

```ini
[flake8]
max-line-length = 88
extend-ignore = E203, W503
```

Black e Flake8 podem discordar de algumas regras antigas. Ajuste para evitar conflito.

---

## Flake8 em CI

```yaml
- name: Flake8
  run: flake8 .
```

---

## Migração de Flake8 para Ruff

Mapeie regras:

```toml
[tool.ruff.lint]
select = ["E", "F", "B", "C4"]
```

Passos:

1. rode Ruff em paralelo;
2. compare achados;
3. configure ignores equivalentes;
4. remova Flake8 quando cobertura for suficiente;
5. preserve plugins que Ruff ainda não cobre, se houver.

---

## Quando Manter Flake8

Mantenha quando:

- há plugin essencial sem alternativa;
- projeto legado já está estável;
- equipe não quer mudança agora;
- pipeline corporativo exige Flake8.

Caso contrário, Ruff reduz tempo de execução e complexidade de ferramentas.

---

## Checklist Flake8

- max line length está alinhado com Black?
- ignores têm motivo?
- plugins são realmente usados?
- complexidade máxima está configurada?
- CI roda Flake8?
- regras não duplicam Ruff sem necessidade?
- há plano de migração se fizer sentido?

