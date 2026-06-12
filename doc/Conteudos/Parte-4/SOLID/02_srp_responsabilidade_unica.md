# SRP: Single Responsibility Principle

SRP é o Princípio da Responsabilidade Única. Uma unidade de código deve ter um motivo principal para mudar.

Essa unidade pode ser classe, função, módulo, pacote ou serviço. Em Python, SRP não significa criar uma classe para cada linha de código. Significa manter responsabilidades coesas e separar motivos de mudança que evoluem por razões diferentes.

---

## Responsabilidade

Responsabilidade é um papel que o código cumpre.

Exemplos:

- validar dados;
- calcular regra de negócio;
- persistir no banco;
- formatar resposta HTTP;
- enviar e-mail;
- ler arquivo;
- renderizar HTML;
- chamar API externa.

Quando uma classe faz muitas dessas coisas, ela tem múltiplos motivos para mudar.

---

## Exemplo Ruim: Classe Faz Tudo

```python
import sqlite3
import smtplib


class PedidoService:
    def criar_pedido(self, cliente_email: str, itens: list[dict]) -> int:
        if not cliente_email or "@" not in cliente_email:
            raise ValueError("E-mail inválido")

        total = 0
        for item in itens:
            if item["quantidade"] <= 0:
                raise ValueError("Quantidade inválida")
            total += item["quantidade"] * item["preco"]

        conn = sqlite3.connect("app.db")
        cursor = conn.cursor()
        cursor.execute("INSERT INTO pedidos (email, total) VALUES (?, ?)", (cliente_email, total))
        pedido_id = cursor.lastrowid
        conn.commit()
        conn.close()

        smtp = smtplib.SMTP("smtp.example.com")
        smtp.sendmail("loja@example.com", cliente_email, f"Pedido {pedido_id} criado")
        smtp.quit()

        return pedido_id
```

Problemas:

- validação misturada com regra de negócio;
- cálculo misturado com SQL;
- envio de e-mail misturado com criação;
- infraestrutura acoplada;
- difícil testar sem banco e SMTP;
- qualquer mudança em e-mail, banco ou regra altera a mesma classe.

---

## Separando Responsabilidades

```python
from dataclasses import dataclass
from typing import Protocol


@dataclass(frozen=True)
class ItemPedido:
    produto_id: int
    quantidade: int
    preco: float


@dataclass
class Pedido:
    id: int | None
    cliente_email: str
    itens: list[ItemPedido]
    total: float


class ValidadorPedido:
    def validar(self, email: str, itens: list[ItemPedido]) -> None:
        if not email or "@" not in email:
            raise ValueError("E-mail inválido")
        if not itens:
            raise ValueError("Pedido sem itens")
        for item in itens:
            if item.quantidade <= 0:
                raise ValueError("Quantidade inválida")


class CalculadoraTotal:
    def calcular(self, itens: list[ItemPedido]) -> float:
        return sum(item.quantidade * item.preco for item in itens)


class PedidoRepository(Protocol):
    def salvar(self, pedido: Pedido) -> Pedido:
        ...


class Notificador(Protocol):
    def enviar(self, destino: str, mensagem: str) -> None:
        ...


class CriarPedido:
    def __init__(
        self,
        validador: ValidadorPedido,
        calculadora: CalculadoraTotal,
        repositorio: PedidoRepository,
        notificador: Notificador,
    ) -> None:
        self.validador = validador
        self.calculadora = calculadora
        self.repositorio = repositorio
        self.notificador = notificador

    def executar(self, email: str, itens: list[ItemPedido]) -> Pedido:
        self.validador.validar(email, itens)
        total = self.calculadora.calcular(itens)
        pedido = Pedido(id=None, cliente_email=email, itens=itens, total=total)
        pedido_salvo = self.repositorio.salvar(pedido)
        self.notificador.enviar(email, f"Pedido {pedido_salvo.id} criado")
        return pedido_salvo
```

Agora cada componente tem foco.

---

## Classe com Foco Único

Uma classe coesa costuma ter métodos que trabalham sobre o mesmo conceito.

```python
class Carrinho:
    def __init__(self) -> None:
        self._itens: list[ItemPedido] = []

    def adicionar(self, item: ItemPedido) -> None:
        if item.quantidade <= 0:
            raise ValueError("Quantidade inválida")
        self._itens.append(item)

    def total(self) -> float:
        return sum(item.quantidade * item.preco for item in self._itens)
```

Essa classe não salva no banco, não envia e-mail e não renderiza JSON.

---

## Função com Foco Único

Funções também devem ter responsabilidade clara.

Ruim:

```python
def processar_arquivo(caminho):
    dados = open(caminho).read()
    linhas = dados.splitlines()
    total = sum(float(linha.split(",")[2]) for linha in linhas)
    requests.post("https://api.example.com/relatorio", json={"total": total})
```

Melhor:

```python
from pathlib import Path


def ler_linhas(caminho: Path) -> list[str]:
    return caminho.read_text(encoding="utf-8").splitlines()


def calcular_total_csv(linhas: list[str]) -> float:
    return sum(float(linha.split(",")[2]) for linha in linhas)


def enviar_total(total: float) -> None:
    requests.post("https://api.example.com/relatorio", json={"total": total}, timeout=10)
```

---

## Separação Entre Regra de Negócio e Infraestrutura

Regra de negócio deve ser testável sem banco, HTTP, SMTP ou framework.

```python
class DescontoPorVolume:
    def calcular(self, quantidade: int, valor_unitario: float) -> float:
        subtotal = quantidade * valor_unitario
        if quantidade >= 100:
            return subtotal * 0.9
        return subtotal
```

Teste:

```python
def test_desconto_por_volume():
    assert DescontoPorVolume().calcular(100, 10) == 900
```

Sem banco. Sem API. Sem mock.

---

## Separando Validação, Persistência e Apresentação

Camadas:

```text
HTTP Controller
    -> valida entrada de transporte
    -> chama caso de uso
Use Case
    -> coordena regra de negócio
Domain
    -> invariantes e regras puras
Repository
    -> persistência
Presenter/Serializer
    -> saída
```

Exemplo:

```python
class CriarTarefaUseCase:
    def __init__(self, repositorio) -> None:
        self.repositorio = repositorio

    def executar(self, titulo: str):
        if not titulo.strip():
            raise ValueError("Título obrigatório")
        tarefa = Tarefa(id=None, titulo=titulo, concluida=False)
        return self.repositorio.salvar(tarefa)
```

O endpoint HTTP só adapta request/response.

---

## Sinais de Violação do SRP

- classe com nome genérico: `Manager`, `Helper`, `Utils`;
- muitos imports de naturezas diferentes;
- métodos que mudam por demandas de equipes diferentes;
- testes precisam configurar banco, e-mail e HTTP para testar cálculo simples;
- alterações pequenas quebram áreas não relacionadas;
- classe tem muitas razões para mudar;
- construtor recebe dependências demais;
- arquivo cresce sem limite.

---

## SRP Não É Fragmentação Cega

Separar demais também prejudica:

```text
ValidadorTitulo
NormalizadorTitulo
ServicoTitulo
ProcessadorTitulo
ExecutorTitulo
```

Se a regra é pequena e muda junto, mantenha próxima. SRP busca coesão, não burocracia.

---

## Refatoração Guiada por SRP

Processo:

1. Identifique motivos de mudança.
2. Agrupe código que muda junto.
3. Extraia funções puras primeiro.
4. Extraia classes quando há estado ou papel claro.
5. Introduza abstrações somente onde existe variação real.
6. Proteja comportamento com testes.

---

## Checklist SRP

- esta classe/função tem um propósito claro?
- consigo explicar a responsabilidade em uma frase?
- ela mistura negócio com infraestrutura?
- ela valida, persiste e apresenta ao mesmo tempo?
- ela tem mais de um motivo provável para mudar?
- testes são difíceis por dependências externas?
- nome da classe é específico ou genérico demais?
- os métodos trabalham sobre o mesmo conceito?
- separar melhora clareza ou só cria cerimônia?

