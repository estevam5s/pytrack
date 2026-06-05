# Conceitos Essenciais de APIs: Cliente, Servidor, HTTP, Endpoints e Contratos

Uma API permite que sistemas conversem por meio de regras bem definidas. Em APIs web, essa conversa normalmente acontece sobre HTTP: um cliente envia uma requisição para um servidor, e o servidor devolve uma resposta.

---

## Cliente e Servidor

Cliente é quem inicia a comunicação.

Exemplos de clientes:

- navegador;
- app mobile;
- frontend React/Vue/Angular;
- script Python;
- outro backend;
- ferramenta como `curl`, Postman ou Insomnia.

Servidor é quem recebe a requisição, processa a regra e devolve uma resposta.

Exemplos de servidores:

- API Flask;
- API FastAPI;
- backend Django;
- serviço Node.js;
- gateway;
- microsserviço interno.

Fluxo:

```text
cliente -> request HTTP -> servidor
cliente <- response HTTP <- servidor
```

---

## Request e Response

Uma request HTTP tem:

- método;
- URL;
- headers;
- query parameters;
- path parameters;
- body opcional.

Exemplo:

```http
POST /api/v1/tarefas?notify=true HTTP/1.1
Host: exemplo.com
Content-Type: application/json
Authorization: Bearer token

{
  "titulo": "Estudar APIs"
}
```

Uma response HTTP tem:

- status code;
- headers;
- body opcional.

```http
HTTP/1.1 201 Created
Content-Type: application/json
Location: /api/v1/tarefas/10

{
  "id": 10,
  "titulo": "Estudar APIs",
  "concluida": false
}
```

---

## HTTP

HTTP é um protocolo de aplicação. Ele define a semântica da comunicação entre cliente e servidor.

Conceitos principais:

- método: intenção da operação;
- recurso: entidade acessada;
- status code: resultado da operação;
- headers: metadados;
- body: dados enviados ou recebidos;
- cache: reaproveitamento de respostas;
- autenticação: identificação do cliente;
- content negotiation: formato de dados aceito.

HTTP não é apenas transporte. Usar bem HTTP significa respeitar a semântica do protocolo.

---

## URL, Path, Query e Endpoint

Endpoint é uma combinação de método HTTP e caminho.

```text
GET /api/v1/tarefas
POST /api/v1/tarefas
GET /api/v1/tarefas/{id}
PATCH /api/v1/tarefas/{id}
DELETE /api/v1/tarefas/{id}
```

Path identifica recurso:

```text
/api/v1/tarefas/10
```

Query parameter filtra, pagina ou altera representação:

```text
/api/v1/tarefas?concluida=false&limit=20&offset=0
```

Regra prática:

- path: identidade e hierarquia do recurso;
- query: filtro, paginação, ordenação e opções de leitura;
- body: dados de criação ou alteração.

---

## Recurso

Recurso é uma entidade conceitual exposta pela API.

Exemplos:

- tarefas;
- usuários;
- pedidos;
- produtos;
- pagamentos;
- relatórios;
- permissões.

Use substantivos no path:

```text
GET /usuarios/10
POST /pedidos
GET /pedidos/20/itens
```

Evite verbos desnecessários:

```text
GET /buscarUsuario
POST /criarPedido
POST /deletarProduto
```

O método HTTP já expressa a ação.

---

## Contrato de API

Contrato é a promessa entre API e consumidores.

Inclui:

- endpoints disponíveis;
- métodos aceitos;
- formato de entrada;
- formato de saída;
- status codes;
- erros possíveis;
- autenticação;
- limites;
- paginação;
- versionamento.

Contrato ruim quebra clientes. Contrato bom permite evolução previsível.

---

## JSON

JSON é o formato mais comum em APIs REST.

```json
{
  "id": 1,
  "titulo": "Estudar HTTP",
  "concluida": false
}
```

Cuidados:

- datas em ISO 8601;
- nomes consistentes;
- evitar expor campos internos;
- não retornar senha, token secreto ou dado sensível;
- manter compatibilidade quando possível.

---

## Headers Importantes

- `Content-Type`: formato do corpo enviado.
- `Accept`: formato desejado na resposta.
- `Authorization`: credenciais.
- `Location`: URL de recurso criado.
- `Cache-Control`: regra de cache.
- `ETag`: validação de cache/concorrência.
- `X-Request-ID`: rastreamento de requisição.

---

## Idempotência e Segurança

Método seguro não altera estado no servidor. `GET` deve ser seguro.

Método idempotente pode ser repetido com o mesmo efeito final. `PUT` e `DELETE` devem ser idempotentes em design REST comum.

Isso importa porque redes falham e clientes podem repetir requisições.

---

## Checklist de Domínio

- Sei explicar cliente e servidor.
- Sei decompor uma request HTTP.
- Sei decompor uma response HTTP.
- Sei diferenciar path, query e body.
- Sei definir endpoint como método + caminho.
- Sei modelar recursos com substantivos.
- Sei explicar contrato de API.
- Sei identificar headers importantes.

---

## Exercícios

1. Desenhe endpoints para usuários, tarefas e pedidos.
2. Separe path, query e body em uma requisição fictícia.
3. Modele um contrato de criação de usuário.
4. Liste headers necessários para autenticação e JSON.
5. Explique por que `GET /deletar/10` é um design ruim.
