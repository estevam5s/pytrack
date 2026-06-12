# Padrões criacionais e estruturais

Design patterns são soluções reutilizáveis para problemas recorrentes.

> **Tema:** Arquitetura · **Nível:** avancado · **Trilha:** SOLID Avançado e Design Patterns

## Conceitos-chave

Nesta lição você vai entender:

- **Factory e Builder para criação flexível**
- **Adapter e Facade para integração**
- **Strategy para algoritmos intercambiáveis**
- **Em Python, funções muitas vezes bastam**

## Exemplo prático

```python
class PagamentoPix:
    def pagar(self, v): print('pix', v)
class PagamentoCartao:
    def pagar(self, v): print('cartão', v)

def checkout(metodo, valor):  # Strategy
    metodo.pagar(valor)
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Use o padrão certo, não todos
- O pythônico costuma ser mais simples que o GoF clássico

## Pratique

Para fixar, escreva um pequeno script que combine **factory e builder para criação flexível** e **adapter e facade para integração** em um caso do seu dia a dia. Depois refatore aplicando "Use o padrão certo, não todos".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Factory e Builder para criação flexível
- [ ] Explicar e aplicar: Adapter e Facade para integração
- [ ] Explicar e aplicar: Strategy para algoritmos intercambiáveis
- [ ] Explicar e aplicar: Em Python, funções muitas vezes bastam

## Saiba mais

- [Documentação oficial](https://refactoring.guru/design-patterns)
