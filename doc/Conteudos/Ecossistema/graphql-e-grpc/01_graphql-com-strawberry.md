# GraphQL com Strawberry

Uma alternativa flexível ao REST para o cliente consultar o que precisa.

> **Tema:** APIs · **Nível:** avancado · **Trilha:** GraphQL e gRPC

## Conceitos-chave

Nesta lição você vai entender:

- **Schema tipado com Strawberry**
- **Queries, mutations e resolvers**
- **Evita over/under-fetching**
- **Integra com FastAPI**

## Exemplo prático

```python
import strawberry

@strawberry.type
class Query:
    @strawberry.field
    def ola(self) -> str:
        return 'mundo'

schema = strawberry.Schema(Query)
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Cuide do N+1 com dataloaders
- Limite profundidade de queries

## Pratique

Para fixar, escreva um pequeno script que combine **schema tipado com strawberry** e **queries, mutations e resolvers** em um caso do seu dia a dia. Depois refatore aplicando "Cuide do N+1 com dataloaders".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Schema tipado com Strawberry
- [ ] Explicar e aplicar: Queries, mutations e resolvers
- [ ] Explicar e aplicar: Evita over/under-fetching
- [ ] Explicar e aplicar: Integra com FastAPI

## Saiba mais

- [Documentação oficial](https://strawberry.rocks/)
