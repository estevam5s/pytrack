# GraphQL com Strawberry

Uma alternativa flexível ao REST para o cliente consultar o que precisa.

## Pontos-chave

- Schema tipado com Strawberry
- Queries, mutations e resolvers
- Evita over/under-fetching
- Integra com FastAPI

## Exemplo

```python
import strawberry

@strawberry.type
class Query:
    @strawberry.field
    def ola(self) -> str:
        return 'mundo'

schema = strawberry.Schema(Query)
```

## Boas práticas

- Cuide do N+1 com dataloaders
- Limite profundidade de queries

## Saiba mais

- [Documentação oficial](https://strawberry.rocks/)
