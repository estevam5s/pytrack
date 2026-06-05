# Programação Orientada a Objetos (POO) em Python

## Índice
1. [Conceitos Básicos](#conceitos-básicos)
2. [Classes e Objetos](#classes-e-objetos)
3. [Métodos Mágicos (Dunder Methods)](#métodos-mágicos)
4. [Atributos e Propriedades](#atributos-e-propriedades)
5. [Herança](#herança)
6. [Polimorfismo](#polimorfismo)
7. [Encapsulamento](#encapsulamento)
8. [Classes Abstratas](#classes-abstratas)
9. [Métodos Abstratos](#métodos-abstratos)
10. [Exemplos Práticos](#exemplos-práticos)

---

## Conceitos Básicos

### O que é POO?
Programação Orientada a Objetos é um paradigma que organiza o código em **objetos** e **classes**, onde:
- **Classe**: é um modelo ou template que define propriedades (atributos) e comportamentos (métodos)
- **Objeto**: é uma instância de uma classe (um exemplo concreto)

### Pilares da POO
1. **Encapsulamento**: Agrupar dados e métodos em uma classe
2. **Herança**: Permitir que uma classe herde características de outra
3. **Polimorfismo**: Mesma interface, múltiplas implementações
4. **Abstração**: Esconder complexidade, expor apenas o essencial

---

## Classes e Objetos

### Definindo uma Classe

```python
class Pessoa:
    def __init__(self, nome, idade):
        self.nome = nome
        self.idade = idade
    
    def apresentar(self):
        return f"Olá, meu nome é {self.nome} e tenho {self.idade} anos"

# Criando instâncias (objetos)
p1 = Pessoa("Ana", 25)
p2 = Pessoa("Bruno", 30)

print(p1.apresentar())  # Olá, meu nome é Ana e tenho 25 anos
```

### Atributos de Classe vs Atributos de Instância

```python
class Carro:
    # Atributo de classe (compartilhado por todas as instâncias)
    rodas = 4
    
    def __init__(self, marca, modelo):
        # Atributos de instância (únicos para cada objeto)
        self.marca = marca
        self.modelo = modelo

c1 = Carro("Toyota", "Corolla")
c2 = Carro("Honda", "Civic")

print(c1.rodas)      # 4 (do atributo de classe)
print(Carro.rodas)   # 4 (acessando pela classe)
print(c1.marca)      # Toyota (atributo de instância)
```

---

## Métodos Mágicos (Dunder Methods)

Métodos mágicos são especiais em Python, cercados por dois underscores (`__`). Eles permitem customizar o comportamento de objetos.

### Métodos de Inicialização e Representação

```python
class Livro:
    def __init__(self, titulo, autor, paginas):
        """Construtor - chamado ao criar uma instância"""
        self.titulo = titulo
        self.autor = autor
        self.paginas = paginas
    
    def __str__(self):
        """Retorna uma representação em string legível (para print())"""
        return f"'{self.titulo}' por {self.autor}"
    
    def __repr__(self):
        """Retorna uma representação técnica para desenvolvedor"""
        return f"Livro('{self.titulo}', '{self.autor}', {self.paginas})"
    
    def __del__(self):
        """Destrutor - chamado quando o objeto é deletado"""
        print(f"Livro '{self.titulo}' foi removido da memória")

livro = Livro("Python 101", "João", 350)
print(str(livro))      # 'Python 101' por João
print(repr(livro))     # Livro('Python 101', 'João', 350)
del livro              # Imprime: Livro 'Python 101' foi removido da memória
```

### Métodos de Comparação

```python
class Produto:
    def __init__(self, nome, preco):
        self.nome = nome
        self.preco = preco
    
    def __eq__(self, outro):
        """Igualdade (==)"""
        return self.preco == outro.preco
    
    def __lt__(self, outro):
        """Menor que (<)"""
        return self.preco < outro.preco
    
    def __le__(self, outro):
        """Menor ou igual (<=)"""
        return self.preco <= outro.preco
    
    def __gt__(self, outro):
        """Maior que (>)"""
        return self.preco > outro.preco
    
    def __ge__(self, outro):
        """Maior ou igual (>=)"""
        return self.preco >= outro.preco
    
    def __ne__(self, outro):
        """Diferente (!=)"""
        return self.preco != outro.preco

p1 = Produto("Notebook", 3000)
p2 = Produto("Mouse", 50)

print(p1 > p2)   # True
print(p1 == p2)  # False
```

### Métodos Aritméticos

```python
class Vetor:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    
    def __add__(self, outro):
        """Adição (+)"""
        return Vetor(self.x + outro.x, self.y + outro.y)
    
    def __sub__(self, outro):
        """Subtração (-)"""
        return Vetor(self.x - outro.x, self.y - outro.y)
    
    def __mul__(self, escalar):
        """Multiplicação (*)"""
        return Vetor(self.x * escalar, self.y * escalar)
    
    def __truediv__(self, escalar):
        """Divisão (/)"""
        return Vetor(self.x / escalar, self.y / escalar)
    
    def __str__(self):
        return f"({self.x}, {self.y})"

v1 = Vetor(3, 4)
v2 = Vetor(1, 2)

print(v1 + v2)   # (4, 6)
print(v1 - v2)   # (2, 2)
print(v1 * 2)    # (6, 8)
print(v1 / 2)    # (1.5, 2.0)
```

### Métodos de Contêiner

```python
class Playlist:
    def __init__(self, nome):
        self.nome = nome
        self.musicas = []
    
    def __len__(self):
        """Retorna o comprimento (len())"""
        return len(self.musicas)
    
    def __getitem__(self, indice):
        """Acesso por índice (playlist[0])"""
        return self.musicas[indice]
    
    def __setitem__(self, indice, valor):
        """Atribuição por índice (playlist[0] = 'Nova Música')"""
        self.musicas[indice] = valor
    
    def __delitem__(self, indice):
        """Deleção por índice (del playlist[0])"""
        del self.musicas[indice]
    
    def __contains__(self, musica):
        """Testa se item existe ('música' in playlist)"""
        return musica in self.musicas
    
    def __iter__(self):
        """Permite iterar (for m in playlist)"""
        return iter(self.musicas)
    
    def adicionar(self, musica):
        self.musicas.append(musica)

playlist = Playlist("Minhas Favoritas")
playlist.adicionar("Bohemian Rhapsody")
playlist.adicionar("Imagine")

print(len(playlist))          # 2
print(playlist[0])            # Bohemian Rhapsody
print("Imagine" in playlist)  # True

for musica in playlist:
    print(musica)
```

### Métodos de Chamada

```python
class Calculadora:
    def __call__(self, x, y, operacao="+"):
        """Permite chamar a instância como função"""
        if operacao == "+":
            return x + y
        elif operacao == "-":
            return x - y
        elif operacao == "*":
            return x * y
        elif operacao == "/":
            return x / y

calc = Calculadora()
print(calc(10, 5))           # 15
print(calc(10, 5, "-"))      # 5
print(calc(10, 5, "*"))      # 50
```

### Lista Completa de Métodos Mágicos

| Método | Uso |
|--------|-----|
| `__init__` | Construtor |
| `__del__` | Destrutor |
| `__str__` | String legível |
| `__repr__` | Representação técnica |
| `__len__` | Comprimento `len()` |
| `__getitem__` | Acesso `obj[key]` |
| `__setitem__` | Atribuição `obj[key] = val` |
| `__delitem__` | Deleção `del obj[key]` |
| `__contains__` | Teste `key in obj` |
| `__iter__` | Iteração `for x in obj` |
| `__next__` | Próximo item em iteração |
| `__call__` | Chamada `obj()` |
| `__eq__` | Igualdade `==` |
| `__ne__` | Desigualdade `!=` |
| `__lt__` | Menor `<` |
| `__le__` | Menor/igual `<=` |
| `__gt__` | Maior `>` |
| `__ge__` | Maior/igual `>=` |
| `__add__` | Adição `+` |
| `__sub__` | Subtração `-` |
| `__mul__` | Multiplicação `*` |
| `__truediv__` | Divisão `/` |
| `__floordiv__` | Divisão inteira `//` |
| `__mod__` | Módulo `%` |
| `__pow__` | Potência `**` |
| `__hash__` | Hash `hash()` |

---

## Atributos e Propriedades

### Usando @property e @setter

```python
class Pessoa:
    def __init__(self, nome, nascimento):
        self._nome = nome
        self._nascimento = nascimento
    
    @property
    def nome(self):
        """Propriedade de leitura"""
        return self._nome.upper()
    
    @nome.setter
    def nome(self, valor):
        """Propriedade de escrita"""
        if len(valor) < 3:
            raise ValueError("Nome deve ter pelo menos 3 caracteres")
        self._nome = valor
    
    @property
    def idade(self):
        """Propriedade calculada"""
        from datetime import datetime
        return datetime.now().year - self._nascimento

p = Pessoa("Ana", 1995)
print(p.nome)      # ANA (propriedade getter)
p.nome = "Bruno"   # Valida antes de atribuir
print(p.idade)     # Calcula automaticamente
```

### Atributos Privados

```python
class ContaBancaria:
    def __init__(self, titular, saldo):
        self._titular = titular       # Privado por convenção
        self.__saldo = saldo          # Muito privado (name mangling)
    
    def depositar(self, valor):
        if valor > 0:
            self.__saldo += valor
    
    def sacar(self, valor):
        if 0 < valor <= self.__saldo:
            self.__saldo -= valor
    
    def obter_saldo(self):
        return self.__saldo

conta = ContaBancaria("João", 1000)
conta.depositar(500)
print(conta.obter_saldo())  # 1500
# conta.__saldo = 99999      # Erro! Não é acessível diretamente
```

---

## Herança

### Herança Simples

```python
class Animal:
    def __init__(self, nome, som):
        self.nome = nome
        self.som = som
    
    def fazer_som(self):
        return f"{self.nome} faz: {self.som}"

class Cachorro(Animal):
    def __init__(self, nome, raca):
        super().__init__(nome, "Au au")
        self.raca = raca
    
    def trazer_objeto(self):
        return f"{self.nome} trouxe o objeto!"

class Gato(Animal):
    def __init__(self, nome, cor):
        super().__init__(nome, "Miau")
        self.cor = cor

dog = Cachorro("Rex", "Labrador")
print(dog.fazer_som())        # Rex faz: Au au
print(dog.trazer_objeto())    # Rex trouxe o objeto!

gato = Gato("Mimi", "Preto")
print(gato.fazer_som())       # Mimi faz: Miau
```

### Herança Múltipla

```python
class Terrestre:
    def andar(self):
        return "Andando na terra..."

class Aquatico:
    def nadar(self):
        return "Nadando na água..."

class Pato(Terrestre, Aquatico):
    pass

pato = Pato()
print(pato.andar())    # Andando na terra...
print(pato.nadar())    # Nadando na água...
```

### Método Resolver de Ordem (MRO)

```python
class A:
    def metodo(self):
        return "A"

class B(A):
    def metodo(self):
        return "B"

class C(A):
    def metodo(self):
        return "C"

class D(B, C):
    pass

d = D()
print(d.metodo())        # B (segue a ordem de herança)
print(D.mro())          # Exibe a ordem de resolução
```

---

## Polimorfismo

### Polimorfismo de Métodos

```python
class Pessoa:
    def __init__(self, nome):
        self.nome = nome
    
    def apresentar(self):
        return f"Sou uma pessoa chamada {self.nome}"

class Aluno(Pessoa):
    def __init__(self, nome, matricula):
        super().__init__(nome)
        self.matricula = matricula
    
    def apresentar(self):  # Override (sobrescrita)
        return f"Sou aluno e meu nome é {self.nome}"

class Professor(Pessoa):
    def __init__(self, nome, disciplina):
        super().__init__(nome)
        self.disciplina = disciplina
    
    def apresentar(self):  # Override (sobrescrita)
        return f"Sou professor de {self.disciplina}"

pessoas = [
    Pessoa("João"),
    Aluno("Maria", "2021001"),
    Professor("Carlos", "Matemática")
]

for pessoa in pessoas:
    print(pessoa.apresentar())  # Chama o método apropriado
```

### Polimorfismo de Funções (Duck Typing)

```python
class Pato:
    def quack(self):
        return "Quack!"
    
    def voar(self):
        return "Voando como pato..."

class Pessoa:
    def quack(self):
        return "Pessoa imitando pato: Quack!"
    
    def voar(self):
        return "Pessoa pulando..."

def fazer_quack(animal):
    print(animal.quack())  # Não importa o tipo, só importa ter o método

def fazer_voar(animal):
    print(animal.voar())

pato = Pato()
pessoa = Pessoa()

fazer_quack(pato)      # Quack!
fazer_quack(pessoa)    # Pessoa imitando pato: Quack!

fazer_voar(pato)       # Voando como pato...
fazer_voar(pessoa)     # Pessoa pulando...
```

---

## Encapsulamento

### Modificadores de Acesso

```python
class Veiculo:
    def __init__(self, velocidade_max):
        self.velocidade_maxima = velocidade_max      # Público
        self._velocidade_atual = 0                   # Privado (convenção)
        self.__combustivel = 100                     # Muito privado
    
    def acelerar(self):
        if self._velocidade_atual < self.velocidade_maxima:
            self._velocidade_atual += 10
    
    def obter_combustivel(self):
        return self.__combustivel
    
    def abastecer(self, litros):
        self.__combustivel = min(100, self.__combustivel + litros)

v = Veiculo(200)
print(v.velocidade_maxima)      # 200 (público)
v.acelerar()
print(v._velocidade_atual)      # 10 (privado, mas acessível)
print(v.obter_combustivel())    # 100 (acesso via método)
# print(v.__combustivel)         # Erro! Muito privado
```

---

## Classes Abstratas

Classes abstratas não podem ser instanciadas diretamente. Servem como template para classes filhas.

```python
from abc import ABC, abstractmethod

class Veiculo(ABC):
    """Classe abstrata"""
    
    def __init__(self, marca):
        self.marca = marca
    
    @abstractmethod
    def iniciar(self):
        """Método abstrato - deve ser implementado nas subclasses"""
        pass
    
    @abstractmethod
    def parar(self):
        pass
    
    def informacoes(self):
        """Método concreto - pode ser usado diretamente"""
        return f"Veículo de marca {self.marca}"

class Carro(Veiculo):
    def iniciar(self):
        return f"Carro {self.marca} iniciado com chave"
    
    def parar(self):
        return f"Carro {self.marca} desligado"

class Moto(Veiculo):
    def iniciar(self):
        return f"Moto {self.marca} iniciada com botão"
    
    def parar(self):
        return f"Moto {self.marca} desligada"

# veiculo = Veiculo("Genérico")  # Erro! Não pode instanciar classe abstrata

carro = Carro("Toyota")
print(carro.iniciar())           # Carro Toyota iniciado com chave
print(carro.informacoes())       # Veículo de marca Toyota

moto = Moto("Honda")
print(moto.iniciar())            # Moto Honda iniciada com botão
```

---

## Métodos Abstratos

Métodos que devem ser implementados por todas as subclasses.

```python
from abc import ABC, abstractmethod

class FormaGeometrica(ABC):
    
    @abstractmethod
    def calcular_area(self):
        """Toda forma deve saber calcular sua área"""
        pass
    
    @abstractmethod
    def calcular_perimetro(self):
        """Toda forma deve saber calcular seu perímetro"""
        pass

class Quadrado(FormaGeometrica):
    def __init__(self, lado):
        self.lado = lado
    
    def calcular_area(self):
        return self.lado ** 2
    
    def calcular_perimetro(self):
        return 4 * self.lado

class Circulo(FormaGeometrica):
    def __init__(self, raio):
        self.raio = raio
    
    def calcular_area(self):
        import math
        return math.pi * self.raio ** 2
    
    def calcular_perimetro(self):
        import math
        return 2 * math.pi * self.raio

formas = [
    Quadrado(5),
    Circulo(3)
]

for forma in formas:
    print(f"Área: {forma.calcular_area():.2f}")
    print(f"Perímetro: {forma.calcular_perimetro():.2f}")
    print()
```

---

## Exemplos Práticos

### Exemplo 1: Sistema de Funcionários

```python
from abc import ABC, abstractmethod

class Funcionario(ABC):
    def __init__(self, nome, salario):
        self.nome = nome
        self._salario = salario
    
    @abstractmethod
    def calcular_bonus(self):
        pass
    
    def obter_salario_total(self):
        return self._salario + self.calcular_bonus()
    
    def __str__(self):
        return f"{self.nome} - Salário: R${self.obter_salario_total():.2f}"

class Gerente(Funcionario):
    def __init__(self, nome, salario, departamento):
        super().__init__(nome, salario)
        self.departamento = departamento
    
    def calcular_bonus(self):
        return self._salario * 0.20

class Desenvolvedor(Funcionario):
    def __init__(self, nome, salario, linguagem):
        super().__init__(nome, salario)
        self.linguagem = linguagem
    
    def calcular_bonus(self):
        return self._salario * 0.15

class Estagiario(Funcionario):
    def calcular_bonus(self):
        return 0

# Usando
funcionarios = [
    Gerente("Ana", 5000, "TI"),
    Desenvolvedor("Bruno", 3000, "Python"),
    Estagiario("Carlos", 1000)
]

for f in funcionarios:
    print(f)
```

### Exemplo 2: Sistema de Banco

```python
class ContaBancaria:
    def __init__(self, titular, saldo_inicial=0):
        self._titular = titular
        self.__saldo = saldo_inicial
        self.__historico = []
    
    def depositar(self, valor):
        if valor <= 0:
            raise ValueError("Valor deve ser positivo")
        self.__saldo += valor
        self.__historico.append(f"+R${valor:.2f}")
    
    def sacar(self, valor):
        if valor <= 0:
            raise ValueError("Valor deve ser positivo")
        if valor > self.__saldo:
            raise ValueError("Saldo insuficiente")
        self.__saldo -= valor
        self.__historico.append(f"-R${valor:.2f}")
    
    def obter_saldo(self):
        return self.__saldo
    
    def obter_historico(self):
        return self.__historico
    
    def __str__(self):
        return f"Conta de {self._titular}: R${self.__saldo:.2f}"

class ContaPoupanca(ContaBancaria):
    def __init__(self, titular, taxa_juros=0.01):
        super().__init__(titular)
        self.taxa_juros = taxa_juros
    
    def aplicar_juros(self):
        juros = self.obter_saldo() * self.taxa_juros
        self.depositar(juros)
        return juros

# Usando
conta = ContaPoupanca("João", taxa_juros=0.02)
conta.depositar(1000)
juros = conta.aplicar_juros()
print(f"Juros aplicados: R${juros:.2f}")
print(conta)
```

### Exemplo 3: Herança e Polimorfismo com Formas

```python
import math
from abc import ABC, abstractmethod

class Forma(ABC):
    def __init__(self, nome):
        self.nome = nome
    
    @abstractmethod
    def area(self):
        pass
    
    @abstractmethod
    def perimetro(self):
        pass
    
    def __str__(self):
        return f"{self.nome}: Área={self.area():.2f}, Perímetro={self.perimetro():.2f}"

class Retangulo(Forma):
    def __init__(self, largura, altura):
        super().__init__("Retângulo")
        self.largura = largura
        self.altura = altura
    
    def area(self):
        return self.largura * self.altura
    
    def perimetro(self):
        return 2 * (self.largura + self.altura)

class Circulo(Forma):
    def __init__(self, raio):
        super().__init__("Círculo")
        self.raio = raio
    
    def area(self):
        return math.pi * self.raio ** 2
    
    def perimetro(self):
        return 2 * math.pi * self.raio

class Triangulo(Forma):
    def __init__(self, a, b, c):
        super().__init__("Triângulo")
        self.a, self.b, self.c = a, b, c
    
    def area(self):
        s = (self.a + self.b + self.c) / 2
        return math.sqrt(s * (s - self.a) * (s - self.b) * (s - self.c))
    
    def perimetro(self):
        return self.a + self.b + self.c

# Usando
formas = [
    Retangulo(5, 3),
    Circulo(4),
    Triangulo(3, 4, 5)
]

for forma in formas:
    print(forma)
```

---

## Boas Práticas

### ✅ Faça
- Use nomes descritivos para classes e métodos
- Aplique o princípio DRY (Don't Repeat Yourself)
- Use type hints para maior clareza
- Documente suas classes e métodos
- Prefira composição sobre herança quando apropriado

### ❌ Evite
- Herança profunda (muitos níveis)
- Muitos atributos públicos
- Métodos muito longos
- Nomes genéricos como `dados` ou `valor`
- Ignorar exceções

### Exemplo de Boas Práticas

```python
class Usuario:
    """Representa um usuário do sistema.
    
    Attributes:
        email (str): Email único do usuário
        nome (str): Nome completo do usuário
    """
    
    def __init__(self, email: str, nome: str) -> None:
        """Inicializa um novo usuário.
        
        Args:
            email: Email válido do usuário
            nome: Nome completo (3+ caracteres)
        
        Raises:
            ValueError: Se email ou nome inválidos
        """
        if "@" not in email:
            raise ValueError("Email inválido")
        if len(nome) < 3:
            raise ValueError("Nome deve ter pelo menos 3 caracteres")
        
        self._email = email
        self._nome = nome
    
    @property
    def email(self) -> str:
        """Retorna o email do usuário."""
        return self._email
    
    @property
    def nome(self) -> str:
        """Retorna o nome do usuário."""
        return self._nome
    
    def __repr__(self) -> str:
        return f"Usuario(email='{self._email}', nome='{self._nome}')"
```

---

## Resumo

| Conceito | Descrição |
|----------|-----------|
| **Classe** | Template para criar objetos |
| **Objeto** | Instância de uma classe |
| **Atributo** | Propriedade de um objeto |
| **Método** | Função pertencente a uma classe |
| **Herança** | Reutilizar código de outra classe |
| **Polimorfismo** | Mesma interface, implementações diferentes |
| **Encapsulamento** | Esconder detalhes internos |
| **Abstração** | Interface simplificada |
| **Método Mágico** | Método especial com `__` no início e fim |
| **Classe Abstrata** | Não pode ser instanciada, serve como template |

