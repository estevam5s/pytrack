# Arquitetura limpa e DDD

Separe domínio, casos de uso e infraestrutura para sistemas testáveis e duráveis.

## Pontos-chave

- Camadas: domínio -> aplicação -> infra
- A regra de dependência aponta para dentro
- Casos de uso orquestram o domínio
- DDD: linguagem ubíqua e bounded contexts

## Exemplo

```python
# domínio (sem dependências externas)
class Pedido:
    def confirmar(self):
        if not self.itens: raise ValueError('vazio')
        self.status = 'confirmado'
```

## Boas práticas

- Mantenha o domínio livre de frameworks
- Teste casos de uso sem banco/HTTP

## Saiba mais

- [Documentação oficial](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
