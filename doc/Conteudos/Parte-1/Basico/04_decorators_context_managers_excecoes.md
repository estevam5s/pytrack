# Decorators, Context Managers e Tratamento de Exceções

Este guia cobre três recursos essenciais para escrever Python profissional: decorators para modificar comportamento, context managers para gerenciar recursos e exceções para lidar com falhas de forma explícita.

---

## Sumário

1. [Objetivo](#objetivo)
2. [Funções como Objetos](#funções-como-objetos)
3. [Decorators](#decorators)
4. [Decorators com Argumentos](#decorators-com-argumentos)
5. [Preservando Metadados com Wraps](#preservando-metadados-com-wraps)
6. [Context Managers com With](#context-managers-com-with)
7. [Criando Context Managers](#criando-context-managers)
8. [Tratamento de Exceções](#tratamento-de-exceções)
9. [Exceções Personalizadas](#exceções-personalizadas)
10. [Boas Práticas](#boas-práticas)
11. [Nível Avançado: Recursos Transversais e Confiabilidade](#nível-avançado-recursos-transversais-e-confiabilidade)
12. [Armadilhas de Especialista](#armadilhas-de-especialista)
13. [Checklist de Proficiência](#checklist-de-proficiência)
14. [Exercícios](#exercícios)

---

## Objetivo

Você deve aprender a:

- entender funções como valores;
- criar decorators simples e parametrizados;
- usar `with` para recursos que precisam ser abertos e fechados;
- capturar exceções específicas;
- criar exceções do domínio;
- evitar esconder erros importantes.

---

## Funções como Objetos

Em Python, funções podem ser passadas como argumentos.

```python
def dobrar(x):
    return x * 2

def aplicar(funcao, valor):
    return funcao(valor)

resultado = aplicar(dobrar, 10)
```

Funções também podem ser retornadas.

```python
def criar_saudacao(prefixo):
    def saudar(nome):
        return f"{prefixo}, {nome}"
    return saudar

ola = criar_saudacao("Olá")
print(ola("Ana"))
```

Decorators usam esse princípio.

---

## Decorators

Decorator é uma função que recebe uma função e retorna outra função.

```python
def logar_execucao(funcao):
    def wrapper():
        print("Antes")
        resultado = funcao()
        print("Depois")
        return resultado
    return wrapper

@logar_execucao
def tarefa():
    print("Executando")

tarefa()
```

Equivalente a:

```python
tarefa = logar_execucao(tarefa)
```

### Decorator com argumentos da função decorada

```python
def logar(funcao):
    def wrapper(*args, **kwargs):
        print(f"Chamando {funcao.__name__}")
        return funcao(*args, **kwargs)
    return wrapper

@logar
def somar(a, b):
    return a + b
```

---

## Decorators com Argumentos

Decorator parametrizado tem uma camada a mais.

```python
def repetir(vezes):
    def decorador(funcao):
        def wrapper(*args, **kwargs):
            resultado = None
            for _ in range(vezes):
                resultado = funcao(*args, **kwargs)
            return resultado
        return wrapper
    return decorador

@repetir(3)
def dizer_ola():
    print("Olá")
```

Casos comuns:

- retry;
- cache;
- autenticação;
- autorização;
- logging;
- medição de tempo;
- validação.

---

## Preservando Metadados com Wraps

Sem `functools.wraps`, a função decorada perde metadados.

```python
from functools import wraps

def logar(funcao):
    @wraps(funcao)
    def wrapper(*args, **kwargs):
        print(f"Chamando {funcao.__name__}")
        return funcao(*args, **kwargs)
    return wrapper
```

Use `@wraps` em decorators profissionais.

---

## Context Managers com With

`with` garante entrada e saída controladas de um contexto.

```python
with open("dados.txt", encoding="utf-8") as arquivo:
    conteudo = arquivo.read()
```

O arquivo é fechado automaticamente, mesmo se ocorrer erro.

Outros usos:

- conexão com banco;
- transação;
- lock;
- arquivo temporário;
- medição de tempo;
- alteração temporária de configuração.

---

## Criando Context Managers

### Com classe

```python
class MedidorTempo:
    def __enter__(self):
        from time import perf_counter
        self.inicio = perf_counter()
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        from time import perf_counter
        self.fim = perf_counter()
        self.duracao = self.fim - self.inicio
        print(f"Duração: {self.duracao:.4f}s")
        return False

with MedidorTempo():
    sum(range(1_000_000))
```

`__exit__` pode suprimir exceções se retornar `True`. Normalmente, retorne `False`.

### Com contextlib

```python
from contextlib import contextmanager
from time import perf_counter

@contextmanager
def medir_tempo():
    inicio = perf_counter()
    try:
        yield
    finally:
        fim = perf_counter()
        print(f"Duração: {fim - inicio:.4f}s")

with medir_tempo():
    sum(range(1_000_000))
```

---

## Tratamento de Exceções

Use `try/except` quando souber como reagir ao erro.

```python
try:
    numero = int("abc")
except ValueError:
    numero = 0
```

### Capturando exceções específicas

```python
try:
    with open("config.json", encoding="utf-8") as arquivo:
        conteudo = arquivo.read()
except FileNotFoundError:
    conteudo = "{}"
```

Evite:

```python
try:
    executar()
except Exception:
    pass
```

Isso esconde falhas.

### Else e Finally

```python
try:
    numero = int("10")
except ValueError:
    print("valor inválido")
else:
    print("conversão concluída", numero)
finally:
    print("finalizado")
```

`else` roda se não houve exceção.

`finally` roda sempre.

### Relançando exceção

```python
try:
    processar()
except ValueError as erro:
    print("erro de validação")
    raise
```

---

## Exceções Personalizadas

Crie exceções do domínio quando isso melhora clareza.

```python
class SaldoInsuficienteError(Exception):
    pass

def sacar(saldo, valor):
    if valor > saldo:
        raise SaldoInsuficienteError("saldo insuficiente")
    return saldo - valor
```

Uso:

```python
try:
    novo_saldo = sacar(100, 150)
except SaldoInsuficienteError as erro:
    print(erro)
```

### Hierarquia de exceções

```python
class PedidoError(Exception):
    pass

class PedidoNaoEncontradoError(PedidoError):
    pass

class PedidoCanceladoError(PedidoError):
    pass
```

Permite capturar erros do mesmo domínio.

---

## Boas Práticas

- Capture exceções específicas.
- Não use `except` vazio.
- Não silencie erro sem registrar ou decidir algo.
- Use `finally` para limpeza.
- Use `with` para recursos.
- Use decorators para comportamento transversal, não para esconder regras de negócio.
- Use `@wraps` em decorators.
- Crie exceções de domínio quando a regra for importante.
- Mensagens de erro devem ser úteis.

---

## Nível Avançado: Recursos Transversais e Confiabilidade

Decorators, context managers e exceções são ferramentas de arquitetura. Eles ajudam a aplicar comportamento transversal sem espalhar código repetido.

### Decorator de retry

```python
from functools import wraps
from time import sleep

def retry(tentativas: int = 3, espera: float = 0.5, excecoes: tuple[type[Exception], ...] = (Exception,)):
    def decorador(funcao):
        @wraps(funcao)
        def wrapper(*args, **kwargs):
            ultimo_erro = None

            for tentativa in range(1, tentativas + 1):
                try:
                    return funcao(*args, **kwargs)
                except excecoes as erro:
                    ultimo_erro = erro
                    if tentativa == tentativas:
                        break
                    sleep(espera)

            raise ultimo_erro
        return wrapper
    return decorador
```

Uso:

```python
@retry(tentativas=3, espera=1.0, excecoes=(TimeoutError,))
def buscar_dados():
    ...
```

Em produção, prefira registrar logs e usar backoff exponencial.

### Decorator de autorização

```python
from functools import wraps

def requer_permissao(permissao):
    def decorador(funcao):
        @wraps(funcao)
        def wrapper(usuario, *args, **kwargs):
            if permissao not in usuario.permissoes:
                raise PermissionError(f"permissão exigida: {permissao}")
            return funcao(usuario, *args, **kwargs)
        return wrapper
    return decorador
```

Decorators são bons para regras transversais. Regras centrais de negócio não devem ficar escondidas demais.

### Context manager transacional

```python
from contextlib import contextmanager

@contextmanager
def transacao(conexao):
    try:
        yield conexao
    except Exception:
        conexao.rollback()
        raise
    else:
        conexao.commit()
```

Uso:

```python
with transacao(conexao) as conn:
    conn.executar("insert into pedidos ...")
```

Esse padrão garante consistência.

### ExitStack para múltiplos contextos dinâmicos

```python
from contextlib import ExitStack

def abrir_arquivos(caminhos):
    with ExitStack() as stack:
        arquivos = [
            stack.enter_context(open(caminho, encoding="utf-8"))
            for caminho in caminhos
        ]
        return [arquivo.read() for arquivo in arquivos]
```

Útil quando a quantidade de recursos é dinâmica.

### Exception chaining

Preserve causa original do erro.

```python
class ConfigError(Exception):
    pass

def carregar_config(caminho):
    try:
        with open(caminho, encoding="utf-8") as arquivo:
            return arquivo.read()
    except FileNotFoundError as erro:
        raise ConfigError(f"configuração não encontrada: {caminho}") from erro
```

Isso melhora depuração sem expor erro técnico em camadas superiores.

### Hierarquia profissional de erros

```python
class AppError(Exception):
    """Erro base da aplicação."""

class ValidationError(AppError):
    """Entrada inválida."""

class ExternalServiceError(AppError):
    """Falha em serviço externo."""

class RepositoryError(AppError):
    """Falha de persistência."""
```

Camadas superiores podem capturar `AppError` sem capturar erros inesperados do Python.

### `raise` vs retorno de erro

Use exceção quando:

- fluxo normal não consegue continuar;
- o erro precisa atravessar camadas;
- a falha representa violação de contrato;
- o chamador precisa decidir recuperação.

Use retorno quando:

- ausência é esperada;
- resultado alternativo é parte normal do fluxo;
- a decisão é local.

```python
def buscar_usuario(id: int) -> dict | None:
    ...
```

Ausência pode ser `None`. Banco indisponível deve ser exceção.

---

## Armadilhas de Especialista

### Decorator que muda assinatura sem clareza

Se o decorator altera argumentos, retorno ou exceções, documente e teste.

### Capturar `Exception` cedo demais

Capture em bordas do sistema: CLI, worker, request handler. No núcleo, prefira deixar erro subir ou capturar tipos específicos.

### Context manager que engole exceções

`__exit__` retornando `True` suprime erro. Só faça isso intencionalmente.

---

## Checklist de Proficiência

- Sei criar decorators com `wraps`.
- Sei criar decorators parametrizados.
- Sei usar context managers para arquivos, transações, locks e recursos externos.
- Sei criar context managers com classe e `contextlib`.
- Sei usar `ExitStack`.
- Sei criar hierarquia de exceções do domínio.
- Sei preservar causa com `raise ... from`.
- Sei decidir entre retorno, `None` e exceção.

---

## Ampliação de Proficiência

### Quando usar decorator

Use decorator para comportamento transversal, não para esconder regra principal.

Bons casos:

- medir tempo;
- registrar logs;
- aplicar retry;
- validar permissão;
- cachear resultado;
- padronizar auditoria.

Caso ruim:

```python
@faz_tudo
def criar_pedido():
    ...
```

Se o decorator impede entender o fluxo principal, ele provavelmente está carregando responsabilidade demais.

### Context manager como garantia

Use context manager quando algo precisa ser aberto e fechado, iniciado e finalizado, ativado e restaurado.

```python
from contextlib import contextmanager

@contextmanager
def alterar_config(config, chave, valor_temporario):
    valor_original = config[chave]
    config[chave] = valor_temporario
    try:
        yield
    finally:
        config[chave] = valor_original
```

O `finally` garante restauração mesmo com erro.

### Estratégia de exceções

Trate erro no nível que sabe tomar decisão.

```python
def carregar_config(caminho):
    ...

def main():
    try:
        config = carregar_config("config.json")
    except FileNotFoundError:
        print("Arquivo de configuração não encontrado.")
        return 1
```

A função baixa pode levantar erro. A camada de interface decide como comunicar.

### Encadeamento de exceções

```python
try:
    porta = int(valor)
except ValueError as erro:
    raise ValueError(f"porta inválida: {valor}") from erro
```

Use `from erro` para preservar a causa original.

### Mini-checklist de domínio

- Sei criar decorators com `*args`, `**kwargs` e `wraps`.
- Sei criar context manager com classe ou `contextlib`.
- Sei evitar `except Exception: pass`.
- Sei criar exceções específicas do domínio.
- Sei decidir onde capturar uma exceção.
- Sei preservar causa com `raise ... from erro`.

---

## Exercícios

1. Crie um decorator que registre o nome da função chamada.
2. Crie um decorator que mede tempo de execução.
3. Crie um decorator `@repetir(vezes)`.
4. Crie um context manager com classe para abrir e fechar um recurso fictício.
5. Crie um context manager com `contextlib`.
6. Trate `ValueError` ao converter entrada para inteiro.
7. Trate `FileNotFoundError` ao ler arquivo.
8. Crie uma exceção personalizada para email inválido.
9. Reescreva um `except Exception: pass` de forma correta.
10. Combine decorator de log com tratamento de exceção.

---

## Aprofundamento Complementar

### Decorators em camadas

Decorators podem ser empilhados, mas a ordem importa.

```python
@decorador_a
@decorador_b
def executar():
    ...
```

Isso equivale a:

```python
executar = decorador_a(decorador_b(executar))
```

Quanto mais decorators, maior a necessidade de nomes claros e testes.

### Exceções de domínio

Em vez de usar apenas `ValueError`, projetos maiores podem definir exceções específicas.

```python
class SaldoInsuficienteError(Exception):
    pass

def sacar(saldo: float, valor: float) -> float:
    if valor > saldo:
        raise SaldoInsuficienteError("saldo insuficiente para saque")
    return saldo - valor
```

Isso permite capturar falhas de negócio separadamente de falhas técnicas.

### Context managers e transações

O padrão de context manager aparece em transações:

```python
try:
    iniciar_transacao()
    executar_operacoes()
except Exception:
    desfazer_transacao()
    raise
else:
    confirmar_transacao()
```

O `with` encapsula esse padrão para não repetir controle de recurso.

### Não capture erro cedo demais

Se uma função não sabe como recuperar, ela deve deixar a exceção subir. Capturar apenas para imprimir e continuar pode esconder dados corrompidos.

### Exercícios extras

1. Crie um decorator `@medir_tempo`.
2. Crie um decorator `@validar_usuario_ativo`.
3. Crie uma exceção `ProdutoIndisponivelError`.
4. Use `raise ... from erro` ao converter entrada inválida.
5. Crie um context manager que cria e remove um arquivo temporário.
