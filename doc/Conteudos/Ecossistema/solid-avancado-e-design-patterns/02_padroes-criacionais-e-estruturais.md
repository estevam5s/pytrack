# Padrões criacionais e estruturais

Design patterns são soluções reutilizáveis para problemas recorrentes.

## Pontos-chave

- Factory e Builder para criação flexível
- Adapter e Facade para integração
- Strategy para algoritmos intercambiáveis
- Em Python, funções muitas vezes bastam

## Exemplo

```python
class PagamentoPix:
    def pagar(self, v): print('pix', v)
class PagamentoCartao:
    def pagar(self, v): print('cartão', v)

def checkout(metodo, valor):  # Strategy
    metodo.pagar(valor)
```

## Boas práticas

- Use o padrão certo, não todos
- O pythônico costuma ser mais simples que o GoF clássico

## Saiba mais

- [Documentação oficial](https://refactoring.guru/design-patterns)
