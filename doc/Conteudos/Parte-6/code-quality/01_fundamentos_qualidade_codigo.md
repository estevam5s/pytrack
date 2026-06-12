# Fundamentos de Qualidade de Código em Python

Qualidade de código é a capacidade do software ser entendido, mantido, testado, evoluído e operado com segurança. Ferramentas como Black, Ruff, Flake8, isort e MyPy ajudam, mas elas não substituem design, testes, revisão e bom senso.

---

## Dimensões de Qualidade

- **Legibilidade**: código fácil de ler.
- **Consistência**: padrões aplicados em todo o projeto.
- **Corretude**: comportamento esperado e menos bugs.
- **Manutenibilidade**: mudanças localizadas e seguras.
- **Testabilidade**: unidades fáceis de testar.
- **Segurança**: menos práticas perigosas.
- **Automação**: feedback rápido antes do merge.

---

## Ferramentas e Papéis

Black:

- formata código automaticamente;
- reduz discussões de estilo;
- deixa diffs mais previsíveis.

Ruff:

- linter rápido;
- substitui muitas regras de Flake8, pyflakes, pycodestyle, isort e plugins;
- também possui formatter.

Flake8:

- linter clássico;
- ecossistema maduro de plugins;
- ainda comum em projetos legados.

isort:

- organiza imports;
- separa standard library, terceiros e módulos locais.

MyPy:

- análise estática de tipos;
- encontra incompatibilidades antes da execução.

---

## Ordem de Adoção

Para projeto novo:

1. Black ou Ruff formatter.
2. Ruff lint.
3. MyPy em modo gradual.
4. pre-commit.
5. CI obrigatório.

Para projeto legado:

1. rode ferramentas em modo relatório;
2. aplique formatação em PR separado;
3. ative poucas regras primeiro;
4. exclua temporariamente áreas problemáticas;
5. aumente rigor por pacote.

---

## pyproject.toml

O `pyproject.toml` centraliza configuração moderna.

```toml
[tool.black]
line-length = 88
target-version = ["py312"]

[tool.ruff]
line-length = 88
target-version = "py312"

[tool.mypy]
python_version = "3.12"
strict = false
```

---

## Qualidade Não É Só Ferramenta

Ferramentas não detectam tudo:

- regra de negócio errada;
- modelagem confusa;
- acoplamento alto;
- nomes ruins porém válidos;
- abstração prematura;
- falhas de segurança complexas;
- ausência de testes úteis.

Use ferramentas como rede de segurança, não como substituto de engenharia.

---

## Código Ruim que Passa no Linter

```python
def processar(x, y, z):
    if x:
        if y:
            if z:
                return True
    return False
```

Pode passar em várias ferramentas, mas ainda é pouco expressivo.

Melhor:

```python
def usuario_pode_publicar(ativo: bool, email_confirmado: bool, sem_bloqueio: bool) -> bool:
    return ativo and email_confirmado and sem_bloqueio
```

---

## Métricas Úteis

- tempo de execução da suite;
- número de warnings;
- cobertura em código crítico;
- complexidade ciclomática;
- bugs por área;
- frequência de rollback;
- diffs menores em PRs;
- tempo médio de revisão.

---

## Checklist

- existe configuração única no repositório?
- ferramentas rodam localmente e no CI?
- formatação é automática?
- lint tem regras úteis, não ruído?
- tipagem é gradual e sustentável?
- projeto tem pre-commit?
- PRs não misturam formatação massiva com mudança funcional?
- exceções são justificadas?

