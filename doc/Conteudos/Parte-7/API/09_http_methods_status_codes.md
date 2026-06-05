# Métodos HTTP e Status Codes: Semântica Correta para APIs REST

Métodos HTTP expressam intenção. Status codes expressam resultado. Uma API profissional usa os dois de forma consistente para que clientes consigam integrar, tratar erros e automatizar fluxos com segurança.

---

## GET: Ler Recursos

Use `GET` para consultar.

```http
GET /api/v1/tarefas
GET /api/v1/tarefas/10
```

Características:

- seguro: não deve alterar estado;
- idempotente;
- pode ser cacheável;
- não deve depender de body;
- filtros devem ir em query parameters.

Resposta comum:

```http
HTTP/1.1 200 OK
```

Se recurso não existe:

```http
HTTP/1.1 404 Not Found
```

---

## POST: Criar ou Executar Operação

Use `POST` para criar recurso ou executar operação não idempotente.

```http
POST /api/v1/tarefas
Content-Type: application/json

{
  "titulo": "Nova tarefa"
}
```

Resposta de criação:

```http
HTTP/1.1 201 Created
Location: /api/v1/tarefas/10
```

`POST` normalmente não é idempotente. Repetir a mesma request pode criar dois recursos.

---

## PUT: Substituir Recurso Inteiro

Use `PUT` para substituir a representação completa.

```http
PUT /api/v1/tarefas/10
Content-Type: application/json

{
  "titulo": "Título novo",
  "descricao": "Descrição nova",
  "concluida": true
}
```

Características:

- idempotente;
- cliente envia o estado completo;
- campos ausentes podem ser interpretados como remoção ou valor padrão, conforme contrato.

Resposta:

```http
HTTP/1.1 200 OK
```

ou:

```http
HTTP/1.1 204 No Content
```

---

## PATCH: Atualizar Parcialmente

Use `PATCH` para alteração parcial.

```http
PATCH /api/v1/tarefas/10
Content-Type: application/json

{
  "concluida": true
}
```

Características:

- altera apenas campos enviados;
- pode ser idempotente dependendo do contrato;
- ideal para edições parciais.

Resposta:

```http
HTTP/1.1 200 OK
```

ou:

```http
HTTP/1.1 204 No Content
```

---

## DELETE: Remover ou Desativar

Use `DELETE` para remover recurso.

```http
DELETE /api/v1/tarefas/10
```

Resposta comum:

```http
HTTP/1.1 204 No Content
```

Remoção física apaga o registro. Remoção lógica marca como inativo/deletado. O contrato deve deixar isso claro.

---

## PUT versus PATCH

Use `PUT` quando o cliente substitui o recurso inteiro.

Use `PATCH` quando o cliente altera apenas alguns campos.

Exemplo:

```http
PUT /usuarios/10
{
  "nome": "Ana",
  "email": "ana@example.com",
  "ativo": true
}
```

```http
PATCH /usuarios/10
{
  "ativo": false
}
```

---

## Status Codes 2xx

- `200 OK`: sucesso com corpo.
- `201 Created`: recurso criado.
- `202 Accepted`: aceito para processamento assíncrono.
- `204 No Content`: sucesso sem corpo.

Use `201` em criação. Use `204` quando não há resposta útil.

---

## Status Codes 3xx

- `301 Moved Permanently`: mudança permanente.
- `302 Found`: redirecionamento temporário.
- `304 Not Modified`: cache ainda válido.

APIs REST usam menos redirecionamento que sites, mas `304` é útil para cache.

---

## Status Codes 4xx

Erro atribuível ao cliente.

- `400 Bad Request`: request malformada.
- `401 Unauthorized`: não autenticado.
- `403 Forbidden`: autenticado, mas sem permissão.
- `404 Not Found`: recurso inexistente.
- `405 Method Not Allowed`: método não permitido no endpoint.
- `409 Conflict`: conflito com estado atual.
- `415 Unsupported Media Type`: `Content-Type` inválido.
- `422 Unprocessable Entity`: JSON válido, mas semanticamente inválido.
- `429 Too Many Requests`: limite de requisições.

---

## Status Codes 5xx

Erro do servidor ou dependência.

- `500 Internal Server Error`: falha inesperada.
- `502 Bad Gateway`: gateway recebeu resposta inválida.
- `503 Service Unavailable`: indisponível.
- `504 Gateway Timeout`: timeout em gateway.

Não use `500` para erro de validação. Se o cliente enviou dados inválidos, é `4xx`.

---

## Modelo de Erro Consistente

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

Campos recomendados:

- código estável;
- mensagem legível;
- detalhes opcionais;
- campos inválidos quando houver validação;
- request id para suporte.

---

## Tabela de Decisão

| Situação | Status |
|---|---|
| Listagem OK | `200` |
| Busca OK | `200` |
| Criação OK | `201` |
| Atualização sem corpo | `204` |
| Deleção OK | `204` |
| JSON inválido | `400` |
| Token ausente/inválido | `401` |
| Sem permissão | `403` |
| Recurso não encontrado | `404` |
| Email já cadastrado | `409` |
| Campo obrigatório ausente | `422` |
| Rate limit | `429` |
| Erro inesperado | `500` |

---

## Exercícios

1. Escolha método e status para criar usuário.
2. Escolha método e status para concluir tarefa.
3. Explique diferença entre `401` e `403`.
4. Explique diferença entre `400` e `422`.
5. Modele respostas para `GET`, `POST`, `PATCH` e `DELETE`.
