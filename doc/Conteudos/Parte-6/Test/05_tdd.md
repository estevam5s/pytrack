# TDD: Test-Driven Development em Python

TDD é Test-Driven Development: escrever o teste antes da implementação. O ciclo clássico é Red, Green, Refactor.

TDD não é religião. É uma técnica para clarificar design, reduzir medo de mudança e guiar implementação por comportamento esperado.

---

## Ciclo Red, Green, Refactor

1. **Red**: escreva um teste que falha.
2. **Green**: implemente o mínimo para passar.
3. **Refactor**: melhore o design mantendo testes verdes.

---

## Exemplo Simples

Teste primeiro:

```python
def test_total_pedido_sem_itens_e_zero():
    pedido = Pedido()
    assert pedido.total() == 0
```

Implementação mínima:

```python
class Pedido:
    def total(self) -> int:
        return 0
```

Novo teste:

```python
def test_total_pedido_com_itens():
    pedido = Pedido()
    pedido.adicionar_item(preco=10, quantidade=2)
    assert pedido.total() == 20
```

Implementação:

```python
class Pedido:
    def __init__(self) -> None:
        self.itens = []

    def adicionar_item(self, preco: int, quantidade: int) -> None:
        self.itens.append((preco, quantidade))

    def total(self) -> int:
        return sum(preco * quantidade for preco, quantidade in self.itens)
```

---

## TDD Ajuda no Design

Se o teste é difícil de escrever, talvez o design esteja acoplado.

Difícil:

```python
def criar_pedido():
    conn = conectar_banco()
    smtp = conectar_smtp()
    ...
```

Mais testável:

```python
class CriarPedido:
    def __init__(self, repo, notificador) -> None:
        self.repo = repo
        self.notificador = notificador
```

TDD frequentemente empurra o código para injeção de dependência e responsabilidades menores.

---

## TDD em Regras de Negócio

Comece pelos exemplos do domínio.

```python
def test_cliente_vip_recebe_10_porcento_de_desconto():
    desconto = calcular_desconto(total=200, cliente_vip=True)
    assert desconto == 20


def test_compra_acima_de_1000_recebe_15_porcento():
    desconto = calcular_desconto(total=1000, cliente_vip=False)
    assert desconto == 150
```

Depois implemente.

---

## TDD em APIs

Teste contrato primeiro:

```python
def test_criar_tarefa(client):
    response = client.post("/tarefas", json={"titulo": "Estudar TDD"})

    assert response.status_code == 201
    assert response.json()["titulo"] == "Estudar TDD"
```

Depois implemente endpoint, schema, caso de uso e repository.

Para APIs, TDD pode ser feito em nível de endpoint ou caso de uso. Não precisa começar sempre pela borda HTTP.

---

## Baby Steps

Passos pequenos reduzem incerteza:

- teste para entrada mínima;
- teste para caso inválido;
- teste para borda;
- teste para exceção;
- refatoração.

Evite implementar cinco comportamentos antes de rodar teste.

---

## Triangulação

Não generalize cedo demais. Use exemplos para forçar generalização.

```python
def test_dobro_de_2():
    assert dobro(2) == 4


def test_dobro_de_3():
    assert dobro(3) == 6
```

Implementação deixa de ser constante e vira regra.

---

## Quando TDD Não É Ideal

TDD pode ser menos eficiente quando:

- você está explorando biblioteca desconhecida;
- interface ainda é incerta;
- protótipo descartável;
- UI visual sem contrato claro;
- investigação de performance.

Nesses casos, faça spike/protótipo e depois consolide com testes.

---

## TDD e Refatoração

Refatorar com testes verdes:

- renomear;
- extrair função;
- extrair classe;
- remover duplicação;
- trocar implementação;
- melhorar design.

Regra: refatoração não muda comportamento observável.

---

## Checklist TDD

- teste falhou pelo motivo certo?
- implementação foi mínima?
- refatoração manteve testes verdes?
- teste descreve comportamento?
- casos de borda aparecem cedo?
- design ficou mais testável?
- dependências externas foram isoladas?
- TDD está ajudando ou virando cerimônia?

