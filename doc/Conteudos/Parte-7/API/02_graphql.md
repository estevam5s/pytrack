# GraphQL: Schema, Resolvers, Queries, Mutations e Performance

GraphQL é uma linguagem de consulta e runtime para APIs. Diferente de REST, em que o servidor define múltiplos endpoints, GraphQL expõe normalmente um endpoint e o cliente especifica quais campos deseja.

GraphQL é excelente quando clientes precisam de flexibilidade, múltiplas telas consomem variações dos mesmos dados, ou quando REST geraria excesso de endpoints. Porém exige disciplina em schema, autorização, paginação, performance e limites de consulta.

---

## Conceitos

- **Schema**: contrato tipado da API.
- **Query**: leitura de dados.
- **Mutation**: alteração de dados.
- **Subscription**: eventos em tempo real.
- **Resolver**: função que resolve um campo.
- **Type**: estrutura de dados.
- **Input**: estrutura para entrada.

---

## Query Básica

```graphql
query {
  tarefa(id: 1) {
    id
    titulo
    concluida
  }
}
```

Resposta:

```json
{
  "data": {
    "tarefa": {
      "id": "1",
      "titulo": "Estudar GraphQL",
      "concluida": false
    }
  }
}
```

O cliente pede apenas os campos necessários.

---

## Schema Exemplo

```graphql
type Tarefa {
  id: ID!
  titulo: String!
  descricao: String
  concluida: Boolean!
}

type Query {
  tarefa(id: ID!): Tarefa
  tarefas(concluida: Boolean, first: Int = 20): [Tarefa!]!
}

input CriarTarefaInput {
  titulo: String!
  descricao: String
}

type Mutation {
  criarTarefa(input: CriarTarefaInput!): Tarefa!
  concluirTarefa(id: ID!): Tarefa!
}
```

---

## GraphQL com Strawberry

Instalação:

```bash
pip install strawberry-graphql fastapi uvicorn
```

Exemplo:

```python
import strawberry
from fastapi import FastAPI
from strawberry.fastapi import GraphQLRouter


@strawberry.type
class Tarefa:
    id: strawberry.ID
    titulo: str
    concluida: bool


TAREFAS = {
    "1": Tarefa(id="1", titulo="Estudar GraphQL", concluida=False)
}


@strawberry.type
class Query:
    @strawberry.field
    def tarefa(self, id: strawberry.ID) -> Tarefa | None:
        return TAREFAS.get(str(id))

    @strawberry.field
    def tarefas(self) -> list[Tarefa]:
        return list(TAREFAS.values())


schema = strawberry.Schema(query=Query)

app = FastAPI()
app.include_router(GraphQLRouter(schema), prefix="/graphql")
```

Execução:

```bash
uvicorn app:app --reload
```

---

## Mutations

```python
@strawberry.input
class CriarTarefaInput:
    titulo: str
    descricao: str | None = None


@strawberry.type
class Mutation:
    @strawberry.mutation
    def criar_tarefa(self, input: CriarTarefaInput) -> Tarefa:
        novo_id = str(len(TAREFAS) + 1)
        tarefa = Tarefa(id=novo_id, titulo=input.titulo, concluida=False)
        TAREFAS[novo_id] = tarefa
        return tarefa

    @strawberry.mutation
    def concluir_tarefa(self, id: strawberry.ID) -> Tarefa:
        tarefa = TAREFAS.get(str(id))
        if tarefa is None:
            raise ValueError("Tarefa não encontrada")

        atualizada = Tarefa(id=tarefa.id, titulo=tarefa.titulo, concluida=True)
        TAREFAS[str(id)] = atualizada
        return atualizada


schema = strawberry.Schema(query=Query, mutation=Mutation)
```

Mutation:

```graphql
mutation {
  criarTarefa(input: {titulo: "Aprender Strawberry"}) {
    id
    titulo
    concluida
  }
}
```

---

## Resolvers com Banco

Exemplo conceitual com SQLAlchemy:

```python
@strawberry.type
class Query:
    @strawberry.field
    def tarefa(self, info, id: strawberry.ID) -> Tarefa | None:
        session = info.context["session"]
        model = session.get(TarefaModel, int(id))
        if not model:
            return None
        return Tarefa(id=str(model.id), titulo=model.titulo, concluida=model.concluida)
```

Contexto:

```python
async def get_context():
    return {"session": SessionLocal()}


graphql_app = GraphQLRouter(schema, context_getter=get_context)
```

Garanta fechamento da session no ciclo da request.

---

## Problema N+1

Query:

```graphql
query {
  clientes {
    id
    nome
    pedidos {
      id
      total
    }
  }
}
```

Resolver ingênuo pode fazer:

- 1 query para clientes;
- 1 query por cliente para pedidos.

Solução: DataLoader.

---

## DataLoader

```python
from strawberry.dataloader import DataLoader


async def carregar_pedidos_por_cliente(cliente_ids: list[int]) -> list[list[dict]]:
    rows = await buscar_pedidos_agrupados(cliente_ids)
    return [rows.get(cliente_id, []) for cliente_id in cliente_ids]


async def get_context():
    return {
        "pedidos_loader": DataLoader(load_fn=carregar_pedidos_por_cliente)
    }
```

Uso no resolver:

```python
@strawberry.field
async def pedidos(self, info) -> list[Pedido]:
    return await info.context["pedidos_loader"].load(int(self.id))
```

DataLoader agrupa e cacheia carregamentos dentro da mesma request.

---

## Paginação com Connection

Padrão Relay usa edges e pageInfo:

```graphql
query {
  tarefas(first: 10, after: "cursor") {
    edges {
      cursor
      node {
        id
        titulo
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

Esse padrão é mais complexo, mas funciona bem para listas grandes e paginação por cursor.

---

## Autorização

Autorização precisa ser aplicada por campo ou resolver.

```python
def exigir_usuario(info):
    usuario = info.context.get("usuario")
    if usuario is None:
        raise PermissionError("Não autenticado")
    return usuario


@strawberry.type
class Query:
    @strawberry.field
    def minhas_tarefas(self, info) -> list[Tarefa]:
        usuario = exigir_usuario(info)
        return buscar_tarefas_do_usuario(usuario.id)
```

Não esconda autorização apenas no frontend.

---

## Erros

GraphQL retorna erros em uma chave `errors`.

```json
{
  "data": null,
  "errors": [
    {
      "message": "Tarefa não encontrada",
      "path": ["concluirTarefa"]
    }
  ]
}
```

Em produção, padronize erros de domínio e evite vazar detalhes internos.

---

## Segurança

Riscos comuns:

- queries profundas demais;
- introspection aberta em produção sem necessidade;
- ausência de autenticação;
- N+1 causando negação de serviço;
- payloads enormes;
- mutations sem rate limit;
- exposição de campos sensíveis.

Mitigações:

- limite profundidade;
- limite complexidade;
- timeout;
- rate limit;
- persisted queries;
- DataLoader;
- auditoria de schema.

---

## GraphQL vs REST

GraphQL é bom quando:

- clientes precisam compor campos;
- há muitas telas com variações;
- múltiplas fontes são agregadas;
- você quer schema fortemente tipado.

REST é melhor quando:

- recursos são simples;
- caching HTTP é importante;
- equipe quer simplicidade operacional;
- há integração pública ampla;
- downloads/uploads e status HTTP são centrais.

---

## Checklist GraphQL Profissional

- schema expressa domínio com clareza?
- queries e mutations têm nomes consistentes?
- autorização existe em resolvers sensíveis?
- N+1 foi tratado com DataLoader ou prefetch?
- paginação por cursor foi considerada?
- há limite de profundidade e complexidade?
- introspection é política consciente?
- erros não vazam stack trace?
- schema tem testes?
- clientes conhecem política de evolução/depreciação?

