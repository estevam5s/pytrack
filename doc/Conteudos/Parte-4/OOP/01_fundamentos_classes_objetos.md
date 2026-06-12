# Fundamentos, Classes, Objetos e Pilares da POO

Este arquivo cobre a base da Programação Orientada a Objetos em Python, do conceito inicial até decisões de modelagem profissional.

---

## Sumário

1. [Introdução à POO](#introdução-à-poo)
2. [Fundamentos da Orientação a Objetos](#fundamentos-da-orientação-a-objetos)
3. [Classes e Objetos](#classes-e-objetos)
4. [Atributos](#atributos)
5. [Métodos](#métodos)
6. [Encapsulamento](#encapsulamento)
7. [Abstração](#abstração)
8. [Herança](#herança)
9. [Polimorfismo](#polimorfismo)
10. [Quando Usar POO](#quando-usar-poo)
11. [Boas Práticas](#boas-práticas)
12. [Exercícios](#exercícios)

---

## Introdução à POO

POO organiza software em objetos que combinam dados e comportamentos.

Em Python, tudo é objeto:

```python
print(type(10))
print(type("python"))
print(type([]))
```

Uma classe é um molde. Um objeto é uma instância concreta desse molde.

```python
class Pessoa:
    pass


ana = Pessoa()
print(type(ana))
```

POO é útil quando o domínio tem entidades, responsabilidades, regras e colaboração entre objetos.

---

## Fundamentos da Orientação a Objetos

Os quatro pilares mais citados:

- encapsulamento;
- abstração;
- herança;
- polimorfismo.

Mas POO profissional também exige:

- coesão;
- baixo acoplamento;
- composição;
- contratos;
- invariantes;
- testabilidade;
- separação entre domínio, infraestrutura e interface.

---

## Classes e Objetos

```python
class ContaBancaria:
    def __init__(self, titular: str, saldo_inicial: float = 0.0):
        self.titular = titular
        self.saldo = saldo_inicial

    def depositar(self, valor: float) -> None:
        self.saldo += valor

    def sacar(self, valor: float) -> None:
        self.saldo -= valor
```

Uso:

```python
conta = ContaBancaria("Ana", 100)
conta.depositar(50)
conta.sacar(30)
print(conta.saldo)
```

Versão mais profissional com validação:

```python
class ContaBancaria:
    def __init__(self, titular: str, saldo_inicial: float = 0.0):
        if not titular:
            raise ValueError("titular é obrigatório")
        if saldo_inicial < 0:
            raise ValueError("saldo inicial não pode ser negativo")

        self.titular = titular
        self._saldo = saldo_inicial

    @property
    def saldo(self) -> float:
        return self._saldo

    def depositar(self, valor: float) -> None:
        if valor <= 0:
            raise ValueError("depósito deve ser positivo")
        self._saldo += valor

    def sacar(self, valor: float) -> None:
        if valor <= 0:
            raise ValueError("saque deve ser positivo")
        if valor > self._saldo:
            raise ValueError("saldo insuficiente")
        self._saldo -= valor
```

---

## Atributos

### Atributo de instância

Pertence ao objeto.

```python
class Usuario:
    def __init__(self, nome: str):
        self.nome = nome
```

### Atributo de classe

Compartilhado pela classe.

```python
class Usuario:
    total = 0

    def __init__(self, nome: str):
        self.nome = nome
        Usuario.total += 1
```

### Cuidado com mutáveis em atributo de classe

Errado:

```python
class Turma:
    alunos = []
```

Todos os objetos compartilham a mesma lista.

Correto:

```python
class Turma:
    def __init__(self):
        self.alunos = []
```

---

## Métodos

Método de instância recebe `self`.

```python
class Produto:
    def __init__(self, nome: str, preco: float):
        self.nome = nome
        self.preco = preco

    def aplicar_desconto(self, percentual: float) -> None:
        self.preco *= 1 - percentual
```

Método deve representar comportamento do objeto, não apenas manipulação genérica.

Ruim:

```python
class Calculadora:
    def processar_usuario(self, usuario):
        ...
```

Melhor:

```python
class Usuario:
    def pode_acessar(self) -> bool:
        return self.ativo and not self.bloqueado
```

---

## Encapsulamento

Encapsular é proteger invariantes e expor uma API clara.

```python
class Pedido:
    def __init__(self):
        self._itens = []
        self._fechado = False

    def adicionar_item(self, nome: str, valor: float) -> None:
        if self._fechado:
            raise ValueError("pedido fechado")
        if valor <= 0:
            raise ValueError("valor deve ser positivo")
        self._itens.append({"nome": nome, "valor": valor})

    def fechar(self) -> None:
        if not self._itens:
            raise ValueError("pedido vazio")
        self._fechado = True

    @property
    def total(self) -> float:
        return sum(item["valor"] for item in self._itens)
```

Python usa convenção:

- `nome`: público;
- `_nome`: interno/protegido por convenção;
- `__nome`: name mangling.

---

## Abstração

Abstração é esconder detalhe e mostrar intenção.

```python
class Notificador:
    def enviar_boas_vindas(self, email: str) -> None:
        mensagem = self._montar_mensagem()
        self._enviar_email(email, mensagem)

    def _montar_mensagem(self) -> str:
        return "Bem-vindo"

    def _enviar_email(self, email: str, mensagem: str) -> None:
        print(f"enviando para {email}: {mensagem}")
```

Quem usa `Notificador` não precisa saber como a mensagem é montada.

---

## Herança

Herança representa relação "é um".

```python
class Animal:
    def falar(self) -> str:
        raise NotImplementedError


class Cachorro(Animal):
    def falar(self) -> str:
        return "au"
```

Em Python, herança deve ser usada com cuidado. Muitas vezes composição é melhor.

Use herança quando:

- existe contrato comum real;
- subclasses são substituíveis;
- comportamento compartilhado faz sentido;
- a hierarquia não precisa mudar com frequência.

---

## Polimorfismo

Polimorfismo permite usar objetos diferentes pela mesma interface.

```python
class EmailSender:
    def enviar(self, destino: str, mensagem: str) -> None:
        print("email", destino, mensagem)


class SmsSender:
    def enviar(self, destino: str, mensagem: str) -> None:
        print("sms", destino, mensagem)


def notificar(sender, destino: str, mensagem: str) -> None:
    sender.enviar(destino, mensagem)
```

Python favorece duck typing:

> Se o objeto tem o comportamento necessário, ele pode ser usado.

---

## Quando Usar POO

Use POO quando:

- existem entidades com estado e comportamento;
- há regras de domínio importantes;
- você precisa proteger invariantes;
- o sistema tem múltiplas implementações de um contrato;
- testabilidade e extensão são importantes.

Evite POO desnecessária quando:

- uma função pura resolve melhor;
- a classe só agrupa funções estáticas;
- não há estado nem comportamento;
- a hierarquia existe apenas por estética.

---

## Boas Práticas

- Modele comportamento junto dos dados quando fizer sentido.
- Proteja invariantes no construtor e nos métodos.
- Prefira nomes do domínio.
- Evite getters/setters vazios sem regra.
- Prefira composição quando herança não for uma relação natural.
- Escreva objetos pequenos e coesos.
- Evite objetos que sabem demais sobre outros objetos.

---

## Exercícios

1. Modele `ContaBancaria` com saque, depósito e validações.
2. Modele `Pedido` com itens, fechamento e total.
3. Crie classes `EmailSender` e `SmsSender` com polimorfismo.
4. Reescreva uma classe anêmica adicionando comportamento.
5. Explique quando herança seria inadequada.
6. Crie uma classe que protege invariantes com atributos internos.

