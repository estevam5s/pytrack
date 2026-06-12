# MVVM: Model-View-ViewModel e Separação de Estado

MVVM significa Model-View-ViewModel. Ele nasceu forte em interfaces ricas, desktop e mobile, mas seus princípios aparecem em frontends modernos, dashboards, aplicações reativas e telas complexas.

O foco do MVVM é separar a interface visual do estado que ela exibe e manipula. A ViewModel prepara dados, comandos, validações e estados para a View, enquanto o Model representa domínio, dados e serviços.

---

## Diferença entre MVC e MVVM

No MVC, o Controller recebe ações e coordena respostas. No MVVM, a View se liga a uma ViewModel que expõe estado e operações.

```text
MVC:
Usuario -> Controller -> Model -> View

MVVM:
View <-> ViewModel -> Model/Services
```

Em aplicações reativas, quando o estado da ViewModel muda, a View atualiza automaticamente.

---

## Componentes

- **Model**: regras, dados, entidades, APIs e persistência.
- **View**: interface visual, sem regra de negócio.
- **ViewModel**: estado da tela, comandos, validações, carregamento, erros e transformação de dados.

Exemplo de responsabilidades:

```text
Tela de checkout
├── View
│   ├── inputs
│   ├── botoes
│   └── mensagens
├── ViewModel
│   ├── itens exibidos
│   ├── total formatado
│   ├── estado de carregamento
│   ├── validacao de cupom
│   └── comando finalizar_compra
└── Model/Services
    ├── Pedido
    ├── Cupom
    └── API de pagamentos
```

---

## ViewModel em Python

Embora Python backend não use MVVM como padrão principal, o conceito é útil em interfaces com PySide, Tkinter, Textual, Flet, dashboards ou camadas que preparam dados para tela.

```python
from dataclasses import dataclass, field
from decimal import Decimal


@dataclass
class CheckoutViewModel:
    cliente_id: int
    itens: list[dict] = field(default_factory=list)
    cupom: str | None = None
    carregando: bool = False
    erro: str | None = None

    @property
    def total(self) -> Decimal:
        return sum(
            Decimal(str(item["preco"])) * item["quantidade"]
            for item in self.itens
        )

    @property
    def total_formatado(self) -> str:
        return f"R$ {self.total:.2f}"

    @property
    def pode_finalizar(self) -> bool:
        return bool(self.itens) and not self.carregando and self.erro is None

    def adicionar_item(self, produto_id: int, nome: str, preco: Decimal, quantidade: int) -> None:
        if quantidade <= 0:
            self.erro = "Quantidade deve ser maior que zero"
            return

        self.itens.append(
            {
                "produto_id": produto_id,
                "nome": nome,
                "preco": preco,
                "quantidade": quantidade,
            }
        )
        self.erro = None
```

A View pode exibir `total_formatado`, desabilitar botão com `pode_finalizar` e renderizar `erro`.

---

## ViewModel Não é Entidade de Domínio

Uma ViewModel deve ser conveniente para a tela, não uma representação pura do negócio.

Exemplo:

```python
@dataclass
class PedidoResumoViewModel:
    titulo: str
    total: str
    status_label: str
    pode_cancelar: bool
    cor_status: str
```

Campos como `cor_status` e `status_label` pertencem à experiência da interface. Não devem entrar em uma entidade `Pedido` de domínio.

---

## Commands

Em MVVM, ações da interface podem ser expostas como comandos.

```python
class FinalizarCheckoutCommand:
    def __init__(self, pedidos_api):
        self.pedidos_api = pedidos_api

    def executar(self, vm: CheckoutViewModel) -> None:
        if not vm.pode_finalizar:
            return

        vm.carregando = True
        vm.erro = None

        try:
            self.pedidos_api.criar_pedido(
                cliente_id=vm.cliente_id,
                itens=[
                    {
                        "produto_id": item["produto_id"],
                        "quantidade": item["quantidade"],
                    }
                    for item in vm.itens
                ],
            )
        except Exception:
            vm.erro = "Nao foi possivel finalizar o pedido"
        finally:
            vm.carregando = False
```

Essa abordagem mantém a View simples: ao clicar, ela chama o comando.

---

## Estado Derivado

MVVM é forte quando existem muitos dados derivados:

- total formatado;
- campos habilitados/desabilitados;
- mensagens de erro;
- progresso de carregamento;
- filtros aplicados;
- paginação;
- ordenação;
- permissões visuais;
- agrupamentos de listas.

Em vez de espalhar isso pela View, a ViewModel centraliza:

```python
@dataclass
class ListaPedidosViewModel:
    pedidos: list[dict]
    filtro_status: str | None = None

    @property
    def pedidos_filtrados(self) -> list[dict]:
        if self.filtro_status is None:
            return self.pedidos
        return [
            pedido
            for pedido in self.pedidos
            if pedido["status"] == self.filtro_status
        ]

    @property
    def total_visivel(self) -> int:
        return len(self.pedidos_filtrados)
```

---

## MVVM em Frontends Modernos

React, Vue, Angular, Svelte e similares não seguem MVVM clássico exatamente, mas usam ideias parecidas:

- estado separado da renderização;
- propriedades computadas;
- actions/commands;
- binding;
- componentes reativos;
- stores;
- hooks/composables.

Exemplo conceitual:

```text
View: componente visual
ViewModel: hook/store/composable
Model: API, dominio, schema, cache
```

Para um frontend que consome API Python, a separação pode ficar assim:

```text
src/
├── api/pedidos.ts
├── domain/pedido.ts
├── viewmodels/useCheckout.ts
└── views/CheckoutPage.tsx
```

O backend não precisa conhecer a ViewModel. Ela é contrato interno da interface.

---

## Validação

Validação de interface e validação de domínio não são a mesma coisa.

Validação de ViewModel:

- campo obrigatório na tela;
- formato antes de enviar;
- mensagens amigáveis;
- habilitar/desabilitar botão;
- feedback imediato.

Validação de domínio/backend:

- regra de negócio real;
- autorização;
- consistência;
- integridade;
- proteção contra cliente malicioso.

Mesmo que a ViewModel valide, o backend deve validar novamente.

---

## Testes

ViewModels são ótimas para testes porque não exigem renderização.

```python
from decimal import Decimal


def test_checkout_calcula_total_formatado():
    vm = CheckoutViewModel(cliente_id=1)
    vm.adicionar_item(10, "Livro", Decimal("50.00"), 2)

    assert vm.total == Decimal("100.00")
    assert vm.total_formatado == "R$ 100.00"
    assert vm.pode_finalizar is True
```

Teste de erro:

```python
def test_quantidade_invalida_bloqueia_finalizacao():
    vm = CheckoutViewModel(cliente_id=1)
    vm.adicionar_item(10, "Livro", Decimal("50.00"), 0)

    assert vm.erro == "Quantidade deve ser maior que zero"
    assert vm.pode_finalizar is False
```

---

## Quando Usar

Use MVVM quando:

- a tela tem muitos estados;
- há lógica de apresentação relevante;
- a interface precisa reagir a mudanças;
- você quer testar comportamento visual sem renderizar UI;
- existe diferença forte entre dados do domínio e dados exibidos.

Evite quando:

- a tela é simples;
- a ViewModel vira cópia inútil do Model;
- a equipe não tem problema real de estado;
- a separação cria camadas sem benefício.

---

## Erros Comuns

- colocar regra de negócio definitiva na ViewModel;
- deixar ViewModel chamar banco diretamente;
- duplicar entidades inteiras sem necessidade;
- misturar formatação visual com persistência;
- não tratar carregamento, erro e estados vazios;
- confiar em validação de UI como segurança;
- transformar ViewModel em classe gigante.

---

## Checklist Avançado

- A ViewModel representa necessidades da tela?
- A View consegue ser simples e declarativa?
- Estados vazios, loading e erro estão modelados?
- Dados derivados estão centralizados?
- Regras críticas continuam no domínio/backend?
- Testes cobrem comandos e propriedades computadas?
- Mudanças visuais não exigem mudar entidades de domínio?

MVVM é especialmente valioso quando a complexidade está na experiência de uso e no estado da interface. Para backend puro, seus conceitos são úteis ao preparar dados para telas, relatórios e dashboards, mas não substituem camadas de aplicação, domínio e infraestrutura.

