# Arquitetura limpa e DDD

Separe domínio, casos de uso e infraestrutura para sistemas testáveis e duráveis.

> **Tema:** Arquitetura · **Nível:** avancado · **Trilha:** SOLID Avançado e Design Patterns

## Conceitos-chave

Nesta lição você vai entender:

- **Camadas: domínio -> aplicação -> infra**
- **A regra de dependência aponta para dentro**
- **Casos de uso orquestram o domínio**
- **DDD: linguagem ubíqua e bounded contexts**

## Exemplo prático

```python
# domínio (sem dependências externas)
class Pedido:
    def confirmar(self):
        if not self.itens: raise ValueError('vazio')
        self.status = 'confirmado'
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Mantenha o domínio livre de frameworks
- Teste casos de uso sem banco/HTTP

## Pratique

Para fixar, escreva um pequeno script que combine **camadas: domínio -> aplicação -> infra** e **a regra de dependência aponta para dentro** em um caso do seu dia a dia. Depois refatore aplicando "Mantenha o domínio livre de frameworks".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Camadas: domínio -> aplicação -> infra
- [ ] Explicar e aplicar: A regra de dependência aponta para dentro
- [ ] Explicar e aplicar: Casos de uso orquestram o domínio
- [ ] Explicar e aplicar: DDD: linguagem ubíqua e bounded contexts

## Saiba mais

- [Documentação oficial](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
