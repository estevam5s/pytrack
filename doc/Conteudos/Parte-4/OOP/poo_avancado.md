# POO Avançada em Python - Tópicos Não Vistos em Faculdade

## Índice
1. [Decoradores](#decoradores)
2. [Metaclasses](#metaclasses)
3. [Descriptores](#descriptores)
4. [Context Managers](#context-managers)
5. [Generators e Coroutines](#generators-e-coroutines)
6. [Mixins](#mixins)
7. [Protocolos (Typing)](#protocolos-typing)
8. [Slots](#slots)
9. [Property Avançado](#property-avançado)
10. [Padrões de Projeto](#padrões-de-projeto)
11. [Weakref e Garbage Collection](#weakref-e-garbage-collection)
12. [Functools Avançado](#functools-avançado)

---

## Decoradores

### Decoradores de Classe

```python
def registrador_classe(cls):
    """Decorador que registra todas as instâncias criadas"""
    cls.instancias = []
    
    original_init = cls.__init__
    
    def novo_init(self, *args, **kwargs):
        original_init(self, *args, **kwargs)
        cls.instancias.append(self)
    
    cls.__init__ = novo_init
    return cls

@registrador_classe
class Usuario:
    def __init__(self, nome):
        self.nome = nome
    
    @classmethod
    def listar_instancias(cls):
        return [u.nome for u in cls.instancias]

u1 = Usuario("Ana")
u2 = Usuario("Bruno")
print(Usuario.listar_instancias())  # ['Ana', 'Bruno']
```

### Decorador com Argumentos

```python
def validar_tipos(**tipos_esperados):
    """Decorador que valida tipos dos argumentos"""
    def decorador(metodo):
        def wrapper(self, *args, **kwargs):
            # Validar kwargs
            for chave, tipo in tipos_esperados.items():
                if chave in kwargs:
                    if not isinstance(kwargs[chave], tipo):
                        raise TypeError(f"{chave} deve ser {tipo.__name__}")
            return metodo(self, *args, **kwargs)
        return wrapper
    return decorador

class Produto:
    @validar_tipos(nome=str, preco=float)
    def __init__(self, nome, preco):
        self.nome = nome
        self.preco = preco

# p = Produto("Notebook", "3000")  # Erro! preco deve ser float
p = Produto("Notebook", 3000.0)  # OK
```

### Decorador de Método Que Cria Propriedades

```python
def lazy_property(func):
    """Calcula propriedade uma vez e cacheia o resultado"""
    attr_name = f'_lazy_{func.__name__}'
    
    @property
    def wrapper(self):
        if not hasattr(self, attr_name):
            setattr(self, attr_name, func(self))
        return getattr(self, attr_name)
    
    return wrapper

class DadosPesados:
    def __init__(self, arquivo):
        self.arquivo = arquivo
    
    @lazy_property
    def dados(self):
        print("Carregando dados...")  # Só executa uma vez
        import time
        time.sleep(2)
        return f"Dados do {self.arquivo}"

dados = DadosPesados("grande.txt")
print(dados.dados)  # Carrega e espera 2s
print(dados.dados)  # Retorna imediatamente (cacheado)
```

### Stack de Decoradores

```python
def logar(func):
    def wrapper(*args, **kwargs):
        print(f"Chamando {func.__name__}")
        return func(*args, **kwargs)
    return wrapper

def validar_positivo(func):
    def wrapper(x):
        if x < 0:
            raise ValueError("Deve ser positivo")
        return func(x)
    return wrapper

@logar
@validar_positivo
def raiz_quadrada(x):
    return x ** 0.5

print(raiz_quadrada(4))    # Loga e calcula
# print(raiz_quadrada(-1))  # Loga e valida (erro)
```

---

## Metaclasses

### Introdução a Metaclasses

```python
# Uma metaclasse é uma "classe de uma classe"

class Meta(type):
    """Metaclasse customizada"""
    
    def __new__(mcs, nome, bases, dicio):
        print(f"Criando classe {nome}")
        dicio['criada_por_meta'] = True
        return super().__new__(mcs, nome, bases, dicio)

class MinhaClasse(metaclass=Meta):
    pass

print(MinhaClasse.criada_por_meta)  # True
```

### Metaclasse para Validação

```python
class ValidadorMeta(type):
    """Metaclasse que valida atributos"""
    
    def __new__(mcs, nome, bases, dicio):
        if nome != 'Base':
            # Verifica se tem docstring
            if not dicio.get('__doc__'):
                raise TypeError(f"{nome} precisa de docstring")
        
        return super().__new__(mcs, nome, bases, dicio)

class Base(metaclass=ValidadorMeta):
    pass

# class Invalida(Base):
#     pass  # Erro: sem docstring

class Valida(Base):
    """Esta classe tem docstring"""
    pass
```

### Singleton com Metaclasse

```python
class Singleton(type):
    """Metaclasse para padrão Singleton"""
    _instancias = {}
    
    def __call__(cls, *args, **kwargs):
        if cls not in cls._instancias:
            cls._instancias[cls] = super().__call__(*args, **kwargs)
        return cls._instancias[cls]

class BancoDados(metaclass=Singleton):
    def __init__(self):
        self.conectado = False
    
    def conectar(self):
        self.conectado = True

db1 = BancoDados()
db2 = BancoDados()

print(db1 is db2)  # True (mesma instância)
db1.conectar()
print(db2.conectado)  # True (mesmo objeto)
```

---

## Descriptores

### Criando Descriptores

```python
class Validador:
    """Descriptor para validar valores"""
    
    def __init__(self, nome, tipo):
        self.nome = nome
        self.tipo = tipo
    
    def __get__(self, obj, objtype=None):
        if obj is None:
            return self
        return obj.__dict__.get(self.nome, None)
    
    def __set__(self, obj, valor):
        if not isinstance(valor, self.tipo):
            raise TypeError(f"{self.nome} deve ser {self.tipo.__name__}")
        obj.__dict__[self.nome] = valor
    
    def __delete__(self, obj):
        del obj.__dict__[self.nome]

class Pessoa:
    nome = Validador('nome', str)
    idade = Validador('idade', int)
    
    def __init__(self, nome, idade):
        self.nome = nome
        self.idade = idade

p = Pessoa("Ana", 25)
print(p.nome)      # Ana
p.idade = 26       # OK
# p.idade = "vinte e seis"  # Erro!
```

### Descriptor com Intervalo

```python
class Intervalo:
    """Descriptor que valida um valor em intervalo"""
    
    def __init__(self, minimo, maximo):
        self.minimo = minimo
        self.maximo = maximo
    
    def __get__(self, obj, objtype=None):
        if obj is None:
            return self
        return obj.__dict__.get(self.nome, None)
    
    def __set__(self, obj, valor):
        if not (self.minimo <= valor <= self.maximo):
            raise ValueError(f"Deve estar entre {self.minimo} e {self.maximo}")
        obj.__dict__[self.nome] = valor
    
    def __set_name__(self, owner, name):
        self.nome = name

class Produto:
    preco = Intervalo(0, 100000)
    estoque = Intervalo(0, 10000)
    
    def __init__(self, preco, estoque):
        self.preco = preco
        self.estoque = estoque

p = Produto(100, 50)
# p.preco = 200000  # Erro! Fora do intervalo
```

---

## Context Managers

### Context Manager com Classe

```python
class ArquivoSeguro:
    """Context manager para gerenciar arquivos com segurança"""
    
    def __init__(self, arquivo, modo):
        self.arquivo = arquivo
        self.modo = modo
        self.file = None
    
    def __enter__(self):
        print(f"Abrindo {self.arquivo}")
        self.file = open(self.arquivo, self.modo)
        return self.file
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        print(f"Fechando {self.arquivo}")
        if self.file:
            self.file.close()
        
        if exc_type:
            print(f"Erro: {exc_val}")
        
        return False  # Propagar exceções

# Uso
with ArquivoSeguro("teste.txt", "w") as f:
    f.write("Conteúdo seguro")
```

### Context Manager com Generator

```python
from contextlib import contextmanager

@contextmanager
def gerenciador_banco_dados(url):
    """Context manager para conexão com BD"""
    print(f"Conectando a {url}")
    conexao = {"url": url, "conectado": True}
    
    try:
        yield conexao
    finally:
        print(f"Desconectando de {url}")
        conexao["conectado"] = False

# Uso
with gerenciador_banco_dados("localhost") as db:
    print(db["conectado"])
```

### Context Manager para Timing

```python
from contextlib import contextmanager
import time

@contextmanager
def temporizador(tarefa):
    inicio = time.time()
    print(f"Iniciando {tarefa}")
    try:
        yield
    finally:
        fim = time.time()
        print(f"{tarefa} levou {fim - inicio:.2f}s")

# Uso
with temporizador("Processamento"):
    time.sleep(1)
```

---

## Generators e Coroutines

### Generators Avançados

```python
def gerador_infinito():
    """Gera números infinitamente"""
    n = 0
    while True:
        yield n
        n += 1

# Uso
gen = gerador_infinito()
print(next(gen))  # 0
print(next(gen))  # 1
print(next(gen))  # 2
```

### Generator com Send

```python
def calculadora():
    """Generator que aceita valores com send()"""
    total = 0
    while True:
        valor = yield total
        if valor is not None:
            total += valor

# Uso
calc = calculadora()
next(calc)  # Inicializa
print(calc.send(10))  # 10
print(calc.send(5))   # 15
print(calc.send(3))   # 18
```

### Coroutines

```python
def consumidor(nome):
    """Coroutine que consome dados"""
    print(f"{nome} iniciado")
    while True:
        dado = yield
        print(f"{nome} recebeu: {dado}")

def produtor(consumidores):
    """Produz dados para múltiplos consumidores"""
    for i in range(5):
        for c in consumidores:
            c.send(i)

# Uso
c1 = consumidor("Consumidor 1")
c2 = consumidor("Consumidor 2")

next(c1)  # Inicializa
next(c2)

produtor([c1, c2])
```

---

## Mixins

### Mixin para Adicionar Funcionalidades

```python
class TabelaMixin:
    """Mixin para exibir dados como tabela"""
    
    def como_tabela(self):
        atributos = vars(self)
        largura = max(len(k) for k in atributos.keys())
        for chave, valor in atributos.items():
            print(f"{chave:<{largura}} | {valor}")

class JSONMixin:
    """Mixin para converter para JSON"""
    
    def para_json(self):
        import json
        return json.dumps(vars(self))

class Pessoa(TabelaMixin, JSONMixin):
    def __init__(self, nome, idade):
        self.nome = nome
        self.idade = idade

p = Pessoa("Ana", 25)
p.como_tabela()  # Exibe como tabela
print(p.para_json())  # JSON
```

### Mixin para Comparação

```python
class ComparaMixin:
    """Mixin que implementa comparações"""
    
    def __eq__(self, outro):
        return vars(self) == vars(outro)
    
    def __lt__(self, outro):
        return str(vars(self)) < str(vars(outro))
    
    def __repr__(self):
        atributos = ", ".join(f"{k}={v}" for k, v in vars(self).items())
        return f"{self.__class__.__name__}({atributos})"

class Produto(ComparaMixin):
    def __init__(self, nome, preco):
        self.nome = nome
        self.preco = preco

p1 = Produto("Notebook", 3000)
p2 = Produto("Notebook", 3000)
p3 = Produto("Mouse", 50)

print(p1 == p2)  # True
print(p1 < p3)   # False
print(p1)        # Produto(nome=Notebook, preco=3000)
```

---

## Protocolos (Typing)

### Usando Protocolos

```python
from typing import Protocol

class Desenhavel(Protocol):
    """Protocol: qualquer coisa com método draw()"""
    def draw(self) -> None: ...

class Circulo:
    def draw(self) -> None:
        print("Desenhando círculo")

class Quadrado:
    def draw(self) -> None:
        print("Desenhando quadrado")

def renderizar(obj: Desenhavel) -> None:
    obj.draw()

renderizar(Circulo())   # OK
renderizar(Quadrado())  # OK
```

### Protocol com Múltiplos Métodos

```python
from typing import Protocol

class Iteravel(Protocol):
    def __iter__(self):
        ...
    
    def __len__(self) -> int:
        ...

class MinhaLista:
    def __init__(self, items):
        self.items = items
    
    def __iter__(self):
        return iter(self.items)
    
    def __len__(self) -> int:
        return len(self.items)

def processar(obj: Iteravel) -> None:
    for item in obj:
        print(item)

lista = MinhaLista([1, 2, 3])
processar(lista)
```

---

## Slots

### Otimizando Memória com Slots

```python
class SemSlots:
    def __init__(self, x, y):
        self.x = x
        self.y = y

class ComSlots:
    __slots__ = ['x', 'y']  # Restringe atributos
    
    def __init__(self, x, y):
        self.x = x
        self.y = y

# ComSlots usa menos memória
obj = ComSlots(1, 2)
# obj.z = 3  # Erro! Só pode ter x e y
```

### Slots com Herança

```python
class Animal:
    __slots__ = ['nome']
    
    def __init__(self, nome):
        self.nome = nome

class Cachorro(Animal):
    __slots__ = ['raca']  # Adiciona novos slots
    
    def __init__(self, nome, raca):
        super().__init__(nome)
        self.raca = raca

dog = Cachorro("Rex", "Labrador")
print(dog.nome)   # Rex
print(dog.raca)   # Labrador
```

---

## Property Avançado

### Property Customizado

```python
class PropertyCustomizado:
    """Descriptor para propriedades com validação"""
    
    def __init__(self, func_get, func_set=None, func_del=None):
        self.func_get = func_get
        self.func_set = func_set
        self.func_del = func_del
        self.__doc__ = func_get.__doc__
    
    def __get__(self, obj, objtype=None):
        if obj is None:
            return self
        return self.func_get(obj)
    
    def __set__(self, obj, valor):
        if self.func_set is None:
            raise AttributeError("Não pode ser alterado")
        self.func_set(obj, valor)
    
    def __delete__(self, obj):
        if self.func_del is None:
            raise AttributeError("Não pode ser deletado")
        self.func_del(obj)

class Temperatura:
    def __init__(self):
        self._celsius = 0
    
    def get_celsius(self):
        return self._celsius
    
    def set_celsius(self, valor):
        if valor < -273.15:
            raise ValueError("Temperatura impossível")
        self._celsius = valor
    
    celsius = PropertyCustomizado(get_celsius, set_celsius)

t = Temperatura()
t.celsius = 100
print(t.celsius)  # 100
```

### Lazy Loading com Property

```python
class Recurso:
    def __init__(self, id):
        self.id = id
        self._dados = None
    
    @property
    def dados(self):
        if self._dados is None:
            print(f"Carregando dados para {self.id}")
            # Simula carregamento pesado
            self._dados = f"Dados do recurso {self.id}"
        return self._dados

r = Recurso(1)
print(r.dados)  # Carrega
print(r.dados)  # Já carregado, não carrega novamente
```

---

## Padrões de Projeto

### Factory Pattern

```python
class Animal:
    pass

class Cachorro(Animal):
    def fazer_som(self):
        return "Au au"

class Gato(Animal):
    def fazer_som(self):
        return "Miau"

class AnimalFactory:
    @staticmethod
    def criar(tipo):
        if tipo == "cachorro":
            return Cachorro()
        elif tipo == "gato":
            return Gato()
        raise ValueError(f"Tipo desconhecido: {tipo}")

# Uso
animal = AnimalFactory.criar("cachorro")
print(animal.fazer_som())
```

### Observer Pattern

```python
class Observador:
    def atualizar(self, evento):
        pass

class Assunto:
    def __init__(self):
        self._observadores = []
    
    def adicionar_observador(self, obs):
        self._observadores.append(obs)
    
    def remover_observador(self, obs):
        self._observadores.remove(obs)
    
    def notificar(self, evento):
        for obs in self._observadores:
            obs.atualizar(evento)

class Observador1(Observador):
    def atualizar(self, evento):
        print(f"Observador 1 recebeu: {evento}")

class Observador2(Observador):
    def atualizar(self, evento):
        print(f"Observador 2 recebeu: {evento}")

# Uso
assunto = Assunto()
obs1 = Observador1()
obs2 = Observador2()

assunto.adicionar_observador(obs1)
assunto.adicionar_observador(obs2)
assunto.notificar("Evento 1")
```

### Strategy Pattern

```python
class Estrategia:
    def executar(self):
        pass

class EstrategiaA(Estrategia):
    def executar(self):
        return "Executando estratégia A"

class EstrategiaB(Estrategia):
    def executar(self):
        return "Executando estratégia B"

class Contexto:
    def __init__(self, estrategia):
        self.estrategia = estrategia
    
    def executar(self):
        return self.estrategia.executar()

# Uso
ctx = Contexto(EstrategiaA())
print(ctx.executar())

ctx.estrategia = EstrategiaB()
print(ctx.executar())
```

---

## Weakref e Garbage Collection

### Referências Fracas

```python
import weakref
import gc

class Recurso:
    def __init__(self, nome):
        self.nome = nome
    
    def __del__(self):
        print(f"{self.nome} foi deletado")

class Cache:
    def __init__(self):
        self._cache = {}
    
    def adicionar(self, chave, valor):
        # Usar weakref para não impedir garbage collection
        self._cache[chave] = weakref.ref(valor)
    
    def obter(self, chave):
        ref = self._cache.get(chave)
        if ref:
            valor = ref()  # Obter valor da referência
            if valor is not None:
                return valor
        return None

cache = Cache()
r = Recurso("Importante")
cache.adicionar("key", r)

print(cache.obter("key").nome)  # Importante

del r
gc.collect()  # Força garbage collection

print(cache.obter("key"))  # None (foi deletado)
```

---

## Functools Avançado

### LRU Cache

```python
from functools import lru_cache
import time

@lru_cache(maxsize=128)
def fibonacci(n):
    """Fibonacci com cache"""
    if n < 2:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

inicio = time.time()
print(fibonacci(35))
fim = time.time()
print(f"Tempo: {fim - inicio:.4f}s")

print(fibonacci.cache_info())  # Mostra hit/miss
fibonacci.cache_clear()  # Limpa cache
```

### Wraps para Preservar Metadados

```python
from functools import wraps

def meu_decorador(func):
    @wraps(func)  # Preserva nome e docstring
    def wrapper(*args, **kwargs):
        """Wrapper"""
        return func(*args, **kwargs)
    return wrapper

@meu_decorador
def minha_funcao():
    """Minha função original"""
    pass

print(minha_funcao.__name__)  # minha_funcao (não wrapper)
print(minha_funcao.__doc__)   # Minha função original
```

### Total Ordering

```python
from functools import total_ordering

@total_ordering
class Livro:
    def __init__(self, titulo, paginas):
        self.titulo = titulo
        self.paginas = paginas
    
    def __eq__(self, outro):
        return self.paginas == outro.paginas
    
    def __lt__(self, outro):
        return self.paginas < outro.paginas

# total_ordering implementa automaticamente __le__, __gt__, __ge__

livro1 = Livro("Python", 350)
livro2 = Livro("JavaScript", 400)

print(livro1 < livro2)   # True
print(livro1 <= livro2)  # True
print(livro1 > livro2)   # False
```

---

## Resumo de Tópicos Avançados

| Tópico | Use Quando |
|--------|-----------|
| **Decoradores** | Quer reutilizar funcionalidade |
| **Metaclasses** | Precisa customizar criação de classes |
| **Descriptores** | Quer comportamento customizado para atributos |
| **Context Managers** | Gerencia recursos (arquivos, conexões) |
| **Generators** | Quer dados sob demanda |
| **Mixins** | Quer múltiplas herança sem diamante |
| **Protocolos** | Quer type hints mais flexível |
| **Slots** | Otimizar memória |
| **Padrões** | Quer código mais manutenível |

