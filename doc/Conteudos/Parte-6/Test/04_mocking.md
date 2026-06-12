# Mocking: Mocks, Stubs, Fakes, Spies e Patches

Mocking substitui dependências reais por objetos controlados em testes. É útil para isolar comportamento, evitar rede, simular falhas, verificar interações e acelerar testes.

Mas mocks em excesso tornam testes frágeis. Teste comportamento, não detalhes internos.

---

## Test Double

Tipos comuns:

- **Dummy**: objeto passado mas não usado.
- **Stub**: retorna resposta fixa.
- **Fake**: implementação simplificada funcional.
- **Spy**: registra chamadas.
- **Mock**: configura expectativas e verifica interações.

---

## Stub

```python
class StubGatewayPagamento:
    def cobrar(self, valor: float) -> str:
        return "pagamento-123"
```

Uso:

```python
def test_checkout_aprovado():
    checkout = Checkout(gateway=StubGatewayPagamento())
    assert checkout.finalizar(100) == "pagamento-123"
```

---

## Fake

```python
class FakeRepositorio:
    def __init__(self) -> None:
        self.dados = {}

    def salvar(self, obj):
        obj["id"] = len(self.dados) + 1
        self.dados[obj["id"]] = obj
        return obj

    def buscar(self, id: int):
        return self.dados.get(id)
```

Fakes são ótimos para repositories e cache em unit tests.

---

## unittest.mock

```python
from unittest.mock import Mock


def test_notificador_chamado():
    notificador = Mock()
    service = PedidoService(notificador=notificador)

    service.confirmar("ana@example.com")

    notificador.enviar.assert_called_once_with("ana@example.com", "Pedido confirmado")
```

---

## pytest-mock

```bash
pip install pytest-mock
```

```python
def test_com_mocker(mocker):
    enviar = mocker.Mock()
    enviar("x")
    enviar.assert_called_once_with("x")
```

---

## patch

Código:

```python
# app/email.py
def enviar_email(destino: str, mensagem: str) -> None:
    ...


# app/service.py
from app.email import enviar_email


def confirmar(email: str) -> None:
    enviar_email(email, "Confirmado")
```

Teste:

```python
def test_confirmar(mocker):
    enviar_mock = mocker.patch("app.service.enviar_email")

    confirmar("ana@example.com")

    enviar_mock.assert_called_once_with("ana@example.com", "Confirmado")
```

Regra importante: faça patch onde o objeto é usado, não necessariamente onde foi definido.

---

## Mockando Requests

Prefira bibliotecas como `responses` ou `respx`. Mas com patch:

```python
def test_api(mocker):
    response = mocker.Mock()
    response.json.return_value = {"ok": True}
    response.raise_for_status.return_value = None

    mocker.patch("app.client.requests.get", return_value=response)

    assert chamar_api() == {"ok": True}
```

---

## side_effect

Simular erro:

```python
def test_retry(mocker):
    func = mocker.Mock(side_effect=[TimeoutError, "ok"])
    assert executar_com_retry(func) == "ok"
    assert func.call_count == 2
```

---

## autospec

`autospec` ajuda a detectar chamadas com assinatura errada.

```python
mocker.patch("app.service.enviar_email", autospec=True)
```

Use quando possível.

---

## Mock vs Fake

Mock:

- bom para verificar interação com gateway externo;
- pode acoplar ao detalhe de chamada.

Fake:

- bom para testar comportamento;
- menos frágil;
- exige implementar comportamento simplificado.

Exemplo preferível:

```python
repo = FakeRepositorio()
use_case = CriarPedido(repo)
pedido = use_case.executar(...)
assert repo.buscar(pedido.id) == pedido
```

---

## Cheiro de Teste com Mock

Sinais:

- teste tem mais configuração que comportamento;
- troca implementação interna quebra teste sem bug real;
- muitos `assert_called_once`;
- mocks de objetos de domínio;
- patch em cadeia;
- teste não falha quando resultado final está errado.

---

## Checklist Mocking

- mock substitui dependência externa real?
- fake seria mais adequado?
- patch está no local correto?
- teste verifica comportamento observável?
- autospec pode ser usado?
- side_effect cobre falhas importantes?
- mocks não estão escondendo integração crítica?
- teste continua legível?

