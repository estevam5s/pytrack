# APIs e Backend com Python

Trilha completa e progressiva para construir APIs e backends profissionais com Python, cobrindo REST, GraphQL, WebSockets, gRPC e os frameworks Flask, FastAPI e Tornado.

O objetivo é sair de uma primeira rota HTTP até serviços prontos para produção: contratos claros, validação, autenticação, autorização, paginação, versionamento, testes, observabilidade, documentação, performance, async, streaming, comunicação entre serviços e deploy.

---

## Arquivos da Trilha

### APIs

1. [REST: Fundamentos, Design, Segurança e Produção](./01_rest_apis.md)
2. [GraphQL: Schema, Resolvers, Queries, Mutations e Performance](./02_graphql.md)
3. [WebSockets: Tempo Real, Conexões Persistentes e Escala](./03_websockets.md)
4. [gRPC: Contratos, Protobuf, Streaming e Microsserviços](./04_grpc.md)

### Frameworks

5. [Flask: Do Básico ao Backend Profissional](./05_flask.md)
6. [FastAPI: APIs Modernas, Async, OpenAPI e Produção](./06_fastapi.md)
7. [Tornado: Async Web, WebSockets e Alta Concorrência](./07_tornado.md)

### Fundamentos Complementares

8. [Conceitos Essenciais de APIs: Cliente, Servidor, HTTP, Endpoints e Contratos](./08_conceitos_essenciais_apis.md)
9. [Métodos HTTP e Status Codes: Semântica Correta para APIs REST](./09_http_methods_status_codes.md)
10. [Escolha de Framework: FastAPI, Flask, ASGI, WSGI, Tipagem e OpenAPI](./10_escolha_framework_fastapi_flask.md)

---

## Competências Esperadas

Ao concluir esta trilha, você deve saber:

- desenhar APIs REST consistentes;
- explicar cliente, servidor, request, response, endpoint, recurso e contrato;
- escolher corretamente `GET`, `POST`, `PUT`, `PATCH` e `DELETE`;
- validar entrada e saída de dados;
- escolher códigos HTTP corretamente;
- diferenciar status `200`, `201`, `204`, `400`, `401`, `403`, `404`, `409`, `422` e `500`;
- decidir entre FastAPI e Flask conforme requisitos técnicos;
- entender WSGI, ASGI, sync, async, tipagem e documentação OpenAPI;
- implementar autenticação e autorização;
- criar APIs GraphQL com schema bem definido;
- usar WebSockets para tempo real;
- criar serviços gRPC com Protobuf;
- construir backends com Flask, FastAPI e Tornado;
- integrar APIs com banco, cache, filas e workers;
- testar endpoints, contratos e regras de negócio;
- aplicar logs, métricas, tracing, health checks e deploy profissional.

---

## Projeto Base Usado nos Exemplos

Domínio simples de tarefas:

```text
backend-tarefas/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── services.py
│   └── repositories.py
├── tests/
├── requirements.txt
└── README.md
```

Entidade principal:

```python
from dataclasses import dataclass
from datetime import datetime


@dataclass
class Tarefa:
    id: int
    titulo: str
    concluida: bool
    criada_em: datetime
```

---

## Ordem Recomendada

Estude os conceitos essenciais primeiro, depois métodos HTTP e status codes. Em seguida, leia REST, porque ele estabelece base de recursos, contratos e erros. Depois avance para Flask e FastAPI comparando as decisões de framework. Em seguida, aprofunde GraphQL, WebSockets e gRPC. Tornado fecha a trilha com foco em async, conexões longas e alta concorrência.
