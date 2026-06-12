# Dicas Completas de POO em Python

Este guia resume como estudar, praticar e aplicar Programação Orientada a Objetos em Python de forma progressiva. Use como checklist antes, durante e depois dos exercícios de POO.

---

## Sumário

1. [Objetivo](#objetivo)
2. [Conceitos Fundamentais](#conceitos-fundamentais)
3. [Pilares da POO](#pilares-da-poo)
4. [Como Pensar em Objetos](#como-pensar-em-objetos)
5. [Boas Práticas em Classes](#boas-práticas-em-classes)
6. [Quando Usar Herança ou Composição](#quando-usar-herança-ou-composição)
7. [Métodos Especiais Importantes](#métodos-especiais-importantes)
8. [Encapsulamento em Python](#encapsulamento-em-python)
9. [Abstração, Interfaces e Protocolos](#abstração-interfaces-e-protocolos)
10. [Erros Comuns](#erros-comuns)
11. [Progressão de Estudos](#progressão-de-estudos)
12. [Exercícios Recomendados](#exercícios-recomendados)
13. [Projeto Final](#projeto-final)
14. [Checklist de Domínio](#checklist-de-domínio)

---

## Objetivo

O objetivo de estudar POO não é apenas decorar termos como classe, objeto, herança e polimorfismo. O objetivo real é aprender a organizar sistemas com responsabilidades claras, baixo acoplamento e código fácil de manter.

POO deve ajudar você a responder perguntas como:

- Qual entidade do problema merece virar classe?
- Quais dados pertencem a essa entidade?
- Quais comportamentos pertencem a essa entidade?
- O que deve ficar escondido dentro da classe?
- O que precisa ser exposto para o restante do sistema?
- Quando uma classe deve depender de outra?
- Quando herança complica mais do que ajuda?

---

## Conceitos Fundamentais

Estude bastante:

- Classes
- Objetos
- Instâncias
- Atributos
- Métodos
- Construtor `__init__`
- Atributos de instância
- Atributos de classe
- Métodos de instância
- Métodos de classe com `@classmethod`
- Métodos estáticos com `@staticmethod`
- Encapsulamento
- Herança
- Polimorfismo
- Abstração
- Composição
- Métodos especiais
- Dataclasses
- Type hints
- Classes abstratas
- Protocolos

Exemplo mínimo:

```python
class ContaBancaria:
    def __init__(self, titular: str, saldo: float = 0.0):
        self.titular = titular
        self.saldo = saldo

    def depositar(self, valor: float) -> None:
        if valor <= 0:
            raise ValueError("O valor do depósito deve ser positivo")
        self.saldo += valor

    def sacar(self, valor: float) -> None:
        if valor <= 0:
            raise ValueError("O valor do saque deve ser positivo")
        if valor > self.saldo:
            raise ValueError("Saldo insuficiente")
        self.saldo -= valor
```

---

## Pilares da POO

### Encapsulamento

Encapsular é proteger o estado interno de um objeto e permitir que ele seja alterado por métodos controlados.

```python
class Produto:
    def __init__(self, nome: str, preco: float):
        self.nome = nome
        self._preco = 0.0
        self.preco = preco

    @property
    def preco(self) -> float:
        return self._preco

    @preco.setter
    def preco(self, valor: float) -> None:
        if valor < 0:
            raise ValueError("Preço não pode ser negativo")
        self._preco = valor
```

Use encapsulamento quando uma mudança de valor precisa respeitar regras.

### Herança

Herança representa uma relação "é um".

```python
class Funcionario:
    def __init__(self, nome: str, salario: float):
        self.nome = nome
        self.salario = salario

    def calcular_bonus(self) -> float:
        return self.salario * 0.1


class Gerente(Funcionario):
    def calcular_bonus(self) -> float:
        return self.salario * 0.2
```

Use herança quando a classe filha realmente for uma especialização da classe base.

### Polimorfismo

Polimorfismo permite usar objetos diferentes por meio da mesma interface.

```python
class Email:
    def enviar(self, mensagem: str) -> None:
        print(f"Enviando email: {mensagem}")


class SMS:
    def enviar(self, mensagem: str) -> None:
        print(f"Enviando SMS: {mensagem}")


def notificar(canal, mensagem: str) -> None:
    canal.enviar(mensagem)
```

O código que chama `notificar` não precisa saber se o canal é email, SMS, WhatsApp ou outro meio.

### Abstração

Abstração é esconder detalhes e expor apenas o que importa.

```python
from abc import ABC, abstractmethod


class RepositorioUsuarios(ABC):
    @abstractmethod
    def buscar_por_id(self, usuario_id: int):
        pass
```

Use abstração quando várias implementações precisam seguir o mesmo contrato.

---

## Como Pensar em Objetos

Antes de criar classes, descreva o domínio:

- Quais são as entidades principais?
- Quais ações cada entidade executa?
- Quais regras pertencem ao domínio?
- Quais classes apenas coordenam o fluxo?
- Quais classes conversam com banco, arquivo, API ou interface?

Exemplo para um sistema escolar:

- `Aluno`: nome, matrícula, notas
- `Professor`: nome, disciplina
- `Turma`: alunos, professor, horário
- `Boletim`: calcula média e situação
- `RepositorioAlunos`: salva e busca alunos
- `SistemaEscolar`: coordena operações principais

Uma boa classe deve ter uma responsabilidade clara. Se uma classe faz muitas coisas, provavelmente ela precisa ser dividida.

---

## Boas Práticas em Classes

- Dê nomes claros: `ContaBancaria`, `Pedido`, `Produto`, `Cliente`.
- Evite classes genéricas como `Manager`, `Helper`, `Utils` sem necessidade.
- Mantenha atributos relacionados ao objeto.
- Mantenha métodos relacionados ao comportamento do objeto.
- Não coloque tudo em uma classe gigante.
- Prefira métodos pequenos e com nomes explícitos.
- Use type hints para melhorar leitura e manutenção.
- Use `@dataclass` para classes focadas em dados.
- Use `property` quando precisar validar ou proteger atributos.
- Escreva testes para regras de negócio.

Exemplo com `dataclass`:

```python
from dataclasses import dataclass


@dataclass
class Endereco:
    rua: str
    cidade: str
    estado: str
    cep: str
```

Use `dataclass` quando a classe guarda dados e tem pouca lógica. Se houver muita regra de negócio, uma classe comum pode ser mais adequada.

---

## Quando Usar Herança ou Composição

### Use herança quando:

- Existe relação clara de especialização.
- A classe filha pode substituir a classe pai sem quebrar comportamento.
- Existe reaproveitamento real de contrato e comportamento.

Exemplo:

```python
class Animal:
    def emitir_som(self) -> str:
        raise NotImplementedError


class Cachorro(Animal):
    def emitir_som(self) -> str:
        return "Au au"
```

### Use composição quando:

- Uma classe usa outra para executar parte do trabalho.
- Você quer trocar uma dependência sem mudar a classe principal.
- Herança deixaria a estrutura rígida.

Exemplo:

```python
class Motor:
    def ligar(self) -> None:
        print("Motor ligado")


class Carro:
    def __init__(self, motor: Motor):
        self.motor = motor

    def ligar(self) -> None:
        self.motor.ligar()
```

Regra prática: prefira composição, use herança quando a relação "é um" for forte e natural.

---

## Métodos Especiais Importantes

Métodos especiais, também chamados de dunder methods, permitem que seus objetos funcionem bem com recursos nativos do Python.

Os mais úteis:

- `__init__`: inicializa o objeto.
- `__str__`: representação amigável para usuários.
- `__repr__`: representação útil para debugging.
- `__eq__`: comparação com `==`.
- `__lt__`: comparação com `<`.
- `__len__`: uso com `len()`.
- `__contains__`: uso com `in`.
- `__getitem__`: acesso com colchetes.
- `__enter__` e `__exit__`: context manager com `with`.

Exemplo:

```python
class Carrinho:
    def __init__(self):
        self._itens = []

    def adicionar(self, produto: str) -> None:
        self._itens.append(produto)

    def __len__(self) -> int:
        return len(self._itens)

    def __contains__(self, produto: str) -> bool:
        return produto in self._itens

    def __repr__(self) -> str:
        return f"Carrinho(itens={self._itens!r})"
```

---

## Encapsulamento em Python

Python não usa modificadores rígidos como `private`, `protected` e `public`. A linguagem usa convenções:

- `nome`: público.
- `_nome`: interno/protegido por convenção.
- `__nome`: name mangling, evita colisão em herança.

Exemplo:

```python
class Usuario:
    def __init__(self, email: str):
        self._email = email

    @property
    def email(self) -> str:
        return self._email
```

Não use getters e setters sem necessidade. Em Python, comece simples com atributo público. Adicione `property` quando surgir uma regra.

---

## Abstração, Interfaces e Protocolos

Em Python, você pode criar contratos com classes abstratas ou com `Protocol`.

### Classe abstrata

```python
from abc import ABC, abstractmethod


class GatewayPagamento(ABC):
    @abstractmethod
    def pagar(self, valor: float) -> bool:
        pass
```

### Protocol

```python
from typing import Protocol


class Notificador(Protocol):
    def enviar(self, mensagem: str) -> None:
        ...


def processar_alerta(notificador: Notificador) -> None:
    notificador.enviar("Alerta gerado")
```

Use `Protocol` quando quiser trabalhar com duck typing tipado. Use `ABC` quando quiser obrigar subclasses a implementar métodos.

---

## Erros Comuns

- Criar classes sem necessidade para tudo.
- Criar uma classe gigante que faz banco, regra, interface e relatório.
- Usar herança só para reaproveitar código.
- Esquecer que composição muitas vezes é mais simples.
- Deixar atributos públicos quando deveriam passar por validação.
- Criar muitos getters e setters sem regra nenhuma.
- Colocar lógica de negócio espalhada fora das classes.
- Misturar entrada de dados (`input`) com regra de negócio.
- Misturar persistência em arquivo/banco com entidade de domínio.
- Escrever métodos longos demais.
- Não testar regras importantes.
- Usar nomes vagos como `Classe1`, `Objeto`, `Dados`, `Sistema`.

---

## Progressão de Estudos

Siga esta ordem:

1. Entenda classes, objetos, atributos e métodos.
2. Faça exercícios básicos com `__init__`.
3. Pratique métodos que alteram estado interno.
4. Use listas de objetos.
5. Separe classes em múltiplos arquivos.
6. Aprenda encapsulamento com `property`.
7. Pratique herança simples.
8. Pratique polimorfismo.
9. Compare herança com composição.
10. Use classes abstratas e protocolos.
11. Use métodos especiais.
12. Escreva testes unitários para as classes.
13. Transforme exercícios em projetos pequenos.
14. Refatore projetos antigos usando POO.

Para cada exercício:

- Faça olhando exemplos.
- Refaça sem olhar.
- Crie uma versão própria.
- Adicione validações.
- Adicione testes.
- Separe em arquivos.
- Documente as decisões.

---

## Exercícios Recomendados

### Nível 1: Fundamentos

- Classe `Pessoa` com nome e idade.
- Classe `Produto` com nome, preço e estoque.
- Classe `ContaBancaria` com depósito, saque e extrato.
- Classe `Livro` e `Biblioteca`.
- Classe `Aluno` com cálculo de média.

### Nível 2: Relacionamento entre classes

- `Cliente`, `Pedido` e `ItemPedido`.
- `Professor`, `Aluno` e `Turma`.
- `Autor`, `Livro` e `Editora`.
- `Usuario`, `Tarefa` e `Projeto`.
- `Restaurante`, `Pedido`, `Produto` e `Entregador`.

### Nível 3: Herança e polimorfismo

- Sistema de funcionários com `Funcionario`, `Gerente` e `Vendedor`.
- Sistema de pagamentos com `CartaoCredito`, `Pix` e `Boleto`.
- Sistema de notificações com `Email`, `SMS` e `Push`.
- Sistema de animais com subclasses e método `emitir_som`.

### Nível 4: Arquitetura simples

- Separar domínio, repositórios e interface.
- Salvar dados em JSON.
- Trocar persistência de JSON para SQLite.
- Criar testes com `pytest`.
- Criar uma interface CLI com menu.

---

## Projeto Final

Depois de concluir os exercícios, crie um sistema completo de sua escolha utilizando:

- Classes e objetos
- Encapsulamento
- Herança quando fizer sentido
- Polimorfismo
- Composição
- Persistência
- Organização em múltiplos arquivos
- Interface de uso
- Testes unitários
- README com explicação

Exemplos de projetos:

- Sistema bancário
- Sistema escolar
- E-commerce
- Rede social simples
- Gerenciador de tarefas
- Sistema de delivery
- Sistema de biblioteca
- Sistema de estoque
- Sistema de agendamento
- Sistema de suporte com tickets

Estrutura sugerida:

```text
meu_projeto/
├── README.md
├── requirements.txt
├── src/
│   ├── main.py
│   ├── models/
│   │   ├── cliente.py
│   │   ├── pedido.py
│   │   └── produto.py
│   ├── repositories/
│   │   └── pedido_repository.py
│   └── services/
│       └── pedido_service.py
└── tests/
    ├── test_pedido.py
    └── test_produto.py
```

---

## Checklist de Domínio

Antes de avançar para POO avançada, confirme:

- [ ] Sei explicar classe e objeto com minhas palavras.
- [ ] Sei diferenciar atributo de instância e atributo de classe.
- [ ] Sei criar métodos que alteram o estado do objeto.
- [ ] Sei usar `__init__`, `__str__` e `__repr__`.
- [ ] Sei aplicar encapsulamento com `property`.
- [ ] Sei usar herança sem exagerar.
- [ ] Sei explicar polimorfismo com exemplos.
- [ ] Sei quando usar composição no lugar de herança.
- [ ] Sei separar classes em arquivos.
- [ ] Sei criar listas de objetos e manipulá-las.
- [ ] Sei criar uma classe abstrata simples.
- [ ] Sei usar type hints em classes e métodos.
- [ ] Sei escrever testes para uma classe.
- [ ] Sei transformar um exercício em mini-projeto.

---

## Dica Final

POO fica clara com prática. Não tente aprender tudo apenas lendo. Crie sistemas pequenos, erre, refatore e compare versões. O sinal de evolução é quando suas classes começam a ter responsabilidades claras e quando mudar uma parte do sistema não quebra todo o restante.

Bons estudos.
