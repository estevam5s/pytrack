# REST: Fundamentos, Design, Segurança e Produção

REST é um estilo arquitetural para construir APIs usando recursos, representações, métodos HTTP e semântica de protocolo. Em APIs web modernas, REST costuma usar JSON sobre HTTP.

Uma API REST profissional não é apenas um conjunto de endpoints que retornam JSON. Ela precisa ter contrato claro, status codes corretos, validação, autenticação, autorização, paginação, versionamento, tratamento de erros, observabilidade, testes e documentação.

---

## HTTP como Base

HTTP define:

- método: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`;
- caminho: `/clientes/10`;
- headers: `Authorization`, `Content-Type`, `Accept`;
- corpo: JSON, form-data, bytes;
- status code: `200`, `201`, `400`, `404`, `500`;
- cache, negociação de conteúdo e autenticação.

Exemplo bruto:

```http
GET /api/v1/tarefas/10 HTTP/1.1
Host: exemplo.com
Accept: application/json
Authorization: Bearer token
```

Resposta:

```json
{
  "id": 10,
  "titulo": "Estudar REST",
  "concluida": false
}
```

---

## Recursos

REST modela recursos:

- `/clientes`
- `/clientes/{id}`
- `/pedidos`
- `/pedidos/{id}/itens`
- `/usuarios/{id}/permissoes`

Evite verbos no path quando o método HTTP já expressa ação.

Menos adequado:

```text
POST /criarCliente
GET /buscarCliente/10
POST /deletarCliente/10
```

Melhor:

```text
POST /clientes
GET /clientes/10
DELETE /clientes/10
```

---

## Métodos HTTP

### GET

Consulta recurso. Deve ser seguro, sem alterar estado.

```http
GET /tarefas/10
```

### POST

Cria recurso ou executa operação não idempotente.

```http
POST /tarefas
```

### PUT

Substitui o recurso inteiro. Deve ser idempotente.

```http
PUT /tarefas/10
```

### PATCH

Atualiza parcialmente.

```http
PATCH /tarefas/10
```

### DELETE

Remove ou desativa recurso.

```http
DELETE /tarefas/10
```

---

## Status Codes

Principais:

- `200 OK`: sucesso com resposta.
- `201 Created`: recurso criado.
- `204 No Content`: sucesso sem corpo.
- `400 Bad Request`: entrada inválida.
- `401 Unauthorized`: não autenticado.
- `403 Forbidden`: autenticado, mas sem permissão.
- `404 Not Found`: recurso não encontrado.
- `409 Conflict`: conflito de estado ou unicidade.
- `422 Unprocessable Entity`: dados semanticamente inválidos.
- `429 Too Many Requests`: rate limit.
- `500 Internal Server Error`: falha inesperada.
- `503 Service Unavailable`: serviço indisponível.

Exemplo criação:

```http
HTTP/1.1 201 Created
Location: /api/v1/tarefas/10
Content-Type: application/json
```

---

## Contratos de Entrada e Saída

Entrada para criação:

```json
{
  "titulo": "Estudar APIs",
  "descricao": "Revisar REST, GraphQL e gRPC"
}
```

Saída:

```json
{
  "id": 1,
  "titulo": "Estudar APIs",
  "descricao": "Revisar REST, GraphQL e gRPC",
  "concluida": false,
  "criada_em": "2026-05-15T10:00:00Z"
}
```

Não exponha diretamente o modelo do banco se o contrato público precisa ser estável.

---

## Modelo de Erro Profissional

Erro consistente:

```json
{
  "erro": {
    "codigo": "TAREFA_NAO_ENCONTRADA",
    "mensagem": "Tarefa não encontrada.",
    "detalhes": {
      "id": 10
    }
  }
}
```

Erro de validação:

```json
{
  "erro": {
    "codigo": "VALIDACAO_INVALIDA",
    "mensagem": "Dados inválidos.",
    "campos": [
      {"campo": "titulo", "mensagem": "Campo obrigatório."}
    ]
  }
}
```

Evite retornar stack trace ao cliente.

---

## Paginação

Offset pagination:

```http
GET /tarefas?limit=20&offset=40
```

Resposta:

```json
{
  "items": [],
  "limit": 20,
  "offset": 40,
  "total": 125
}
```

Keyset pagination:

```http
GET /tarefas?limit=20&after_id=100
```

Mais eficiente para grandes volumes.

---

## Filtros e Ordenação

```http
GET /tarefas?concluida=false&criada_de=2026-01-01&sort=-criada_em
```

Boas práticas:

- documente filtros permitidos;
- valide tipos;
- limite ordenações;
- crie índices alinhados;
- evite permitir ordenação arbitrária por qualquer coluna.

---

## Versionamento

Por path:

```text
/api/v1/tarefas
/api/v2/tarefas
```

Por header:

```http
Accept: application/vnd.empresa.tarefas.v1+json
```

Path é mais simples e comum. Header é mais flexível, mas aumenta complexidade operacional.

---

## Autenticação e Autorização

Autenticação responde: quem é o usuário?

Autorização responde: ele pode fazer isso?

Bearer token:

```http
Authorization: Bearer eyJhbGciOi...
```

Exemplo conceitual:

```python
def exigir_permissao(usuario, permissao: str) -> None:
    if permissao not in usuario.permissoes:
        raise PermissionError("Permissão negada")
```

Nunca confie apenas no frontend para autorização.

---

## Idempotência

Operações idempotentes podem ser repetidas sem criar efeito duplicado.

`PUT /tarefas/10` com o mesmo corpo deve deixar o recurso no mesmo estado.

Para `POST` sensível, use chave de idempotência:

```http
Idempotency-Key: 5d5c4e2d-1234-4567
```

Útil para pagamentos, criação de pedidos e integrações instáveis.

---

## CORS

CORS controla quais origens no navegador podem acessar a API.

Configuração deve ser restrita:

```text
https://app.exemplo.com
```

Evite liberar `*` com credenciais.

---

## Rate Limit

Protege contra abuso e erros de clientes.

Resposta:

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 60
```

Pode ser implementado com Redis, API Gateway, NGINX, Cloudflare ou serviço gerenciado.

---

## Exemplo Completo com Biblioteca Padrão

Este exemplo é didático. Para produção, use Flask, FastAPI, Django, Tornado ou outro framework.

```python
from http.server import BaseHTTPRequestHandler, HTTPServer
import json
from urllib.parse import urlparse


TAREFAS = {
    1: {"id": 1, "titulo": "Estudar REST", "concluida": False}
}


class Handler(BaseHTTPRequestHandler):
    def enviar_json(self, status: int, payload: dict) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self) -> None:
        path = urlparse(self.path).path

        if path == "/health":
            self.enviar_json(200, {"status": "ok"})
            return

        if path == "/tarefas":
            self.enviar_json(200, {"items": list(TAREFAS.values())})
            return

        self.enviar_json(404, {"erro": {"codigo": "NAO_ENCONTRADO"}})


if __name__ == "__main__":
    server = HTTPServer(("0.0.0.0", 8000), Handler)
    server.serve_forever()
```

---

## Testes de API com requests

```python
import requests


def test_health():
    response = requests.get("http://localhost:8000/health", timeout=5)
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
```

Para testes automatizados, frameworks como FastAPI e Flask têm clientes de teste melhores.

---

## OpenAPI

OpenAPI documenta endpoints, parâmetros, schemas, autenticação e respostas. FastAPI gera automaticamente. Flask pode usar extensões como Flask-Smorest, Flasgger ou apispec.

Contrato OpenAPI ajuda:

- frontend;
- QA;
- SDKs;
- documentação;
- validação;
- governança de APIs.

---

## Checklist REST Profissional

- recursos estão bem nomeados?
- métodos HTTP têm semântica correta?
- status codes são consistentes?
- erros seguem formato padrão?
- entradas são validadas?
- saídas não vazam campos internos?
- paginação e filtros são documentados?
- autenticação e autorização são obrigatórias onde necessário?
- rate limit foi considerado?
- logs têm request id?
- API tem health check?
- contrato OpenAPI está atualizado?
- testes cobrem sucesso, erro, autenticação e autorização?

---

## Aprofundamento: Cliente, Servidor e Endpoints

Em REST, o cliente não chama funções internas do servidor. Ele manipula recursos por meio de endpoints HTTP.

```text
GET /api/v1/tarefas/10
```

Esse endpoint significa:

- método: `GET`;
- recurso: tarefa;
- identificador: `10`;
- intenção: ler a representação da tarefa.

O servidor decide como buscar a tarefa: banco, cache, outro serviço ou memória. O cliente não deve depender desses detalhes.

---

## Aprofundamento: Semântica dos Métodos

`GET` deve apenas ler. Se um `GET` altera estado, caches, navegadores, crawlers e proxies podem causar efeitos inesperados.

`POST` cria ou executa operação não idempotente.

`PUT` substitui o recurso inteiro e deve ser idempotente.

`PATCH` altera parte do recurso.

`DELETE` remove ou desativa e deve ser projetado para repetição segura.

Exemplo de coleção:

```text
GET    /tarefas       -> lista tarefas
POST   /tarefas       -> cria tarefa
GET    /tarefas/10    -> busca tarefa 10
PUT    /tarefas/10    -> substitui tarefa 10
PATCH  /tarefas/10    -> atualiza campos da tarefa 10
DELETE /tarefas/10    -> remove tarefa 10
```

---

## Aprofundamento: Status Codes Como Contrato

Status code não é detalhe. Ele informa ao cliente como reagir.

```text
201 -> cliente pode assumir que recurso foi criado
401 -> cliente deve autenticar
403 -> cliente autenticou, mas não pode acessar
404 -> cliente pediu recurso inexistente
409 -> cliente precisa resolver conflito
422 -> cliente enviou dados semanticamente inválidos
500 -> cliente não consegue corrigir sozinho
```

Uma API que retorna `200` para tudo força o cliente a interpretar mensagens textuais e quebra integração profissional.

---

## Exercícios de Fixação

1. Modele endpoints REST para produtos e categorias.
2. Defina status codes para sucesso e erro em cada endpoint.
3. Explique por que `POST /tarefas/10/concluir` pode ser aceitável em operação de domínio, mas `POST /deletarTarefa` não é bom REST.
4. Crie um modelo padrão de erro com código, mensagem e detalhes.
5. Descreva quais endpoints devem ser protegidos por autenticação.
