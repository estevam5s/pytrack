# Depuração, Logs, Erros e Diagnóstico

Proficiência em Python não é apenas escrever código que funciona quando tudo está correto. É saber investigar falhas, ler mensagens de erro, reproduzir problemas e registrar informações úteis para manutenção.

---

## Objetivo

Ao final, você deve saber:

- ler traceback;
- reproduzir erros;
- usar `print` de forma temporária;
- usar `breakpoint`;
- registrar logs com `logging`;
- criar mensagens de erro úteis;
- diagnosticar problemas sem alterar comportamento do programa.

---

## Traceback

Quando ocorre erro, Python mostra um traceback.

```python
def dividir(a, b):
    return a / b

dividir(10, 0)
```

Erro:

```text
ZeroDivisionError: division by zero
```

Leia de baixo para cima para encontrar o tipo do erro e a mensagem. Depois leia a pilha para entender o caminho até a falha.

---

## Erros Comuns

### NameError

```python
print(nome)
```

O nome não foi definido.

### TypeError

```python
"idade: " + 30
```

Operação entre tipos incompatíveis.

### ValueError

```python
int("abc")
```

Tipo correto, valor inválido.

### KeyError

```python
usuario = {"nome": "Ana"}
print(usuario["idade"])
```

Chave inexistente.

### IndexError

```python
valores = [10]
print(valores[3])
```

Índice fora da lista.

---

## Debug com Print

`print` pode ajudar em estudo e investigação rápida.

```python
def calcular_total(preco, quantidade):
    print("DEBUG:", preco, quantidade)
    return preco * quantidade
```

Remova prints temporários antes de finalizar. Em código mantido, prefira logs.

---

## Breakpoint

`breakpoint()` abre o depurador.

```python
def calcular_total(preco, quantidade):
    breakpoint()
    return preco * quantidade

calcular_total(10, 3)
```

Comandos úteis no depurador:

- `n`: próxima linha;
- `s`: entrar na função;
- `c`: continuar;
- `p variavel`: imprimir variável;
- `q`: sair.

---

## Logging

`logging` registra eventos com níveis.

```python
import logging

logging.basicConfig(level=logging.INFO)

logging.debug("Detalhe técnico")
logging.info("Processo iniciado")
logging.warning("Situação inesperada")
logging.error("Erro ao processar")
logging.critical("Falha crítica")
```

Exemplo em função:

```python
import logging

logger = logging.getLogger(__name__)

def processar_pedido(pedido_id: int) -> None:
    logger.info("Processando pedido %s", pedido_id)
```

Use placeholders do logging em vez de f-string quando possível, porque o logging pode adiar a formatação.

---

## Mensagens de Erro Úteis

Ruim:

```python
raise ValueError("Erro")
```

Melhor:

```python
raise ValueError("preco deve ser maior ou igual a zero")
```

Com contexto:

```python
def calcular_desconto(preco: float, desconto: float) -> float:
    if desconto < 0 or desconto > 1:
        raise ValueError(f"desconto deve estar entre 0 e 1. Recebido: {desconto}")
    return preco * (1 - desconto)
```

---

## Reproduzindo Problemas

Antes de corrigir:

1. Identifique entrada que gera erro.
2. Reduza o caso ao mínimo.
3. Confirme que o erro acontece de forma repetível.
4. Escreva um teste ou exemplo que falha.
5. Corrija.
6. Rode novamente.

Esse processo evita correções por tentativa.

---

## Diagnóstico de Bugs Lógicos

Nem todo bug gera exceção.

Exemplo:

```python
def aplicar_desconto(preco, desconto):
    return preco * desconto
```

Se `desconto = 0.10`, o resultado deveria ser 90% do preço, não 10%.

Correção:

```python
def aplicar_desconto(preco, desconto):
    return preco * (1 - desconto)
```

Bugs lógicos exigem exemplos, testes e comparação com resultado esperado.

---

## Boas Práticas

- Leia o erro antes de mudar código.
- Reproduza o problema com entrada mínima.
- Use `breakpoint` quando prints ficarem confusos.
- Use logs para eventos importantes.
- Não esconda exceções com `except Exception: pass`.
- Mensagens de erro devem orientar correção.
- Transforme bug corrigido em teste quando possível.

---

## Checklist de Proficiência

Você domina este tópico quando consegue:

- explicar um traceback;
- identificar erros comuns pelo tipo;
- usar `breakpoint`;
- configurar logging básico;
- criar mensagens de erro claras;
- reproduzir um bug com exemplo mínimo;
- diferenciar exceção de bug lógico.

---

## Exercícios

1. Crie exemplos que gerem `NameError`, `TypeError`, `ValueError`, `KeyError` e `IndexError`.
2. Use `breakpoint` para inspecionar uma função.
3. Troque prints de depuração por logs.
4. Corrija uma função com bug lógico e escreva o caso esperado.
5. Crie uma exceção com mensagem clara para entrada inválida.

---

## Aprofundamento Complementar

### Diagnóstico com hipótese

Depurar bem não é alterar código aleatoriamente. Use hipóteses:

1. O erro acontece com qualquer entrada ou uma entrada específica?
2. O dado chega correto na função?
3. O valor muda onde não deveria?
4. A exceção é causa ou consequência?
5. O comportamento mudou após qual alteração?

### Logs com contexto

Log útil tem contexto suficiente.

```python
logger.info("pedido_processado", extra={"pedido_id": pedido_id, "total": total})
```

Mesmo em logging simples, inclua identificadores: usuário, pedido, arquivo, linha, etapa ou comando.

### Níveis de log

- `DEBUG`: detalhe para investigação.
- `INFO`: evento normal importante.
- `WARNING`: situação inesperada, mas recuperável.
- `ERROR`: falha de operação.
- `CRITICAL`: falha grave do sistema.

### Bug intermitente

Quando um bug aparece às vezes, investigue:

- ordem de execução;
- estado compartilhado;
- arquivo reaproveitado;
- dependência externa;
- data e hora;
- aleatoriedade;
- concorrência;
- cache.

### Exercícios extras

1. Adicione logs com contexto a uma função de processamento.
2. Classifique cinco mensagens entre debug, info, warning, error e critical.
3. Reproduza um bug usando entrada mínima.
4. Use `breakpoint` para verificar uma variável dentro de loop.
5. Escreva um checklist de diagnóstico para seus próprios projetos.
