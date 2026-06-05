# Fundamentos de Documentação Técnica em Python

Documentação técnica é parte do produto. Em projetos Python, ela aparece em `README.md`, docstrings, guias de instalação, documentação de API, arquitetura, changelog, ADRs, exemplos, notebooks, Swagger/OpenAPI e portais publicados.

Boa documentação responde rapidamente:

- o que é isto?
- como instalar?
- como usar?
- como configurar?
- como testar?
- como contribuir?
- quais contratos existem?
- quais decisões foram tomadas?

---

## Documentação para Públicos Diferentes

Usuário final:

- como usar a ferramenta;
- comandos principais;
- exemplos completos;
- erros comuns.

Desenvolvedor:

- arquitetura;
- setup local;
- testes;
- padrões do projeto;
- APIs internas.

Operação:

- variáveis de ambiente;
- deploy;
- logs;
- health checks;
- troubleshooting.

Consumidor de API:

- endpoints;
- autenticação;
- payloads;
- status codes;
- rate limits;
- exemplos.

---

## README Profissional

Estrutura recomendada:

```markdown
# Nome do Projeto

Descrição curta.

## Requisitos

- Python 3.12
- PostgreSQL 16

## Instalação

```bash
python -m venv .venv
pip install -r requirements.txt
```

## Configuração

Copie `.env.example` para `.env`.

## Execução

```bash
uvicorn app.main:app --reload
```

## Testes

```bash
pytest
```
```

README deve permitir que alguém rode o projeto sem conversar com você.

---

## Docstrings

Docstring ruim:

```python
def calcular_total(itens):
    """Calcula total."""
```

Docstring útil:

```python
def calcular_total(itens: list[dict]) -> float:
    """Calcula o total monetário de uma lista de itens de pedido.

    Cada item deve conter `quantidade` e `preco_unitario`.
    Levanta `ValueError` quando quantidade ou preço são negativos.
    """
```

Não documente o óbvio. Documente contrato, regra, exceção, formato e decisão.

---

## Estilos de Docstring

Google style:

```python
def transferir(origem: int, destino: int, valor: float) -> str:
    """Transfere valor entre contas.

    Args:
        origem: ID da conta de origem.
        destino: ID da conta de destino.
        valor: Valor positivo a transferir.

    Returns:
        ID da transação criada.

    Raises:
        SaldoInsuficiente: Quando a conta origem não possui saldo.
    """
```

NumPy style:

```python
def media(valores: list[float]) -> float:
    """Calcula a média aritmética.

    Parameters
    ----------
    valores:
        Lista de valores numéricos.

    Returns
    -------
    float
        Média dos valores.
    """
```

Escolha um padrão e mantenha.

---

## Comentários vs Documentação

Comentário explica uma decisão local:

```python
# O provedor rejeita payloads acima de 500 itens por chamada.
chunks = dividir_em_lotes(items, tamanho=500)
```

Documentação explica uso, arquitetura ou contrato.

Evite comentários que repetem o código:

```python
# incrementa x
x += 1
```

---

## ADR: Architecture Decision Record

ADR registra decisões arquiteturais.

```markdown
# ADR 001: Usar FastAPI para a API pública

## Status

Aceita

## Contexto

Precisamos de OpenAPI automática, validação robusta e suporte async.

## Decisão

Usaremos FastAPI.

## Consequências

Equipe precisa dominar Pydantic e ASGI.
```

ADRs evitam que decisões importantes fiquem só na memória da equipe.

---

## Changelog

```markdown
# Changelog

## 1.4.0

- Adiciona endpoint `POST /pedidos`.
- Corrige validação de CPF.
- Deprecia campo `nomeCompleto`.
```

Para bibliotecas e APIs públicas, changelog é contrato de evolução.

---

## Checklist

- README permite rodar o projeto?
- docstrings explicam contratos não óbvios?
- documentação separa tutorial, how-to, reference e explanation?
- variáveis de ambiente estão documentadas?
- erros comuns têm troubleshooting?
- decisões importantes têm ADR?
- changelog registra mudanças relevantes?
- documentação é versionada junto ao código?

