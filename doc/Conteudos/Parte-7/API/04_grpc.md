# gRPC: Contratos, Protobuf, Streaming e Microsserviços

gRPC é um framework de comunicação RPC moderno que usa HTTP/2 e Protocol Buffers. Ele é comum em comunicação entre serviços internos, sistemas de baixa latência, streaming e ambientes poliglotas.

Enquanto REST é orientado a recursos, gRPC é orientado a métodos de serviço. O contrato é definido em arquivos `.proto`, gerando código cliente e servidor.

---

## Quando Usar gRPC

Use gRPC quando:

- serviços internos precisam de contrato forte;
- há múltiplas linguagens;
- performance e payload compacto importam;
- streaming é necessário;
- você controla cliente e servidor;
- quer geração de código.

Evite quando:

- API é pública para browsers diretamente;
- consumidores esperam JSON simples;
- ferramentas HTTP convencionais são prioridade;
- equipe não quer lidar com Protobuf e HTTP/2.

---

## Instalação

```bash
pip install grpcio grpcio-tools
```

---

## Primeiro `.proto`

`tarefas.proto`:

```proto
syntax = "proto3";

package tarefas;

service TarefaService {
  rpc BuscarTarefa (BuscarTarefaRequest) returns (TarefaResponse);
  rpc CriarTarefa (CriarTarefaRequest) returns (TarefaResponse);
}

message BuscarTarefaRequest {
  int64 id = 1;
}

message CriarTarefaRequest {
  string titulo = 1;
}

message TarefaResponse {
  int64 id = 1;
  string titulo = 2;
  bool concluida = 3;
}
```

Gerar código:

```bash
python -m grpc_tools.protoc \
  -I. \
  --python_out=. \
  --grpc_python_out=. \
  tarefas.proto
```

Gera:

```text
tarefas_pb2.py
tarefas_pb2_grpc.py
```

---

## Servidor gRPC

```python
from concurrent import futures
import grpc

import tarefas_pb2
import tarefas_pb2_grpc


class TarefaService(tarefas_pb2_grpc.TarefaServiceServicer):
    def __init__(self) -> None:
        self.tarefas = {
            1: tarefas_pb2.TarefaResponse(id=1, titulo="Estudar gRPC", concluida=False)
        }

    def BuscarTarefa(self, request, context):
        tarefa = self.tarefas.get(request.id)
        if tarefa is None:
            context.abort(grpc.StatusCode.NOT_FOUND, "Tarefa não encontrada")
        return tarefa

    def CriarTarefa(self, request, context):
        novo_id = max(self.tarefas) + 1
        tarefa = tarefas_pb2.TarefaResponse(id=novo_id, titulo=request.titulo, concluida=False)
        self.tarefas[novo_id] = tarefa
        return tarefa


def serve() -> None:
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    tarefas_pb2_grpc.add_TarefaServiceServicer_to_server(TarefaService(), server)
    server.add_insecure_port("[::]:50051")
    server.start()
    server.wait_for_termination()


if __name__ == "__main__":
    serve()
```

---

## Cliente gRPC

```python
import grpc
import tarefas_pb2
import tarefas_pb2_grpc


def main() -> None:
    with grpc.insecure_channel("localhost:50051") as channel:
        client = tarefas_pb2_grpc.TarefaServiceStub(channel)
        response = client.BuscarTarefa(tarefas_pb2.BuscarTarefaRequest(id=1))
        print(response.id, response.titulo)


if __name__ == "__main__":
    main()
```

---

## Status Codes

Principais:

- `OK`
- `INVALID_ARGUMENT`
- `NOT_FOUND`
- `ALREADY_EXISTS`
- `PERMISSION_DENIED`
- `UNAUTHENTICATED`
- `FAILED_PRECONDITION`
- `UNAVAILABLE`
- `DEADLINE_EXCEEDED`
- `INTERNAL`

Exemplo:

```python
if not request.titulo:
    context.abort(grpc.StatusCode.INVALID_ARGUMENT, "Título é obrigatório")
```

---

## Deadlines e Timeouts

Cliente:

```python
response = client.BuscarTarefa(
    tarefas_pb2.BuscarTarefaRequest(id=1),
    timeout=2.0,
)
```

Servidores devem respeitar deadlines:

```python
if not context.is_active():
    return tarefas_pb2.TarefaResponse()
```

Sem timeout, clientes podem ficar presos esperando.

---

## Metadata

Cliente:

```python
metadata = [("authorization", "Bearer token")]
response = client.BuscarTarefa(request, metadata=metadata)
```

Servidor:

```python
def BuscarTarefa(self, request, context):
    metadata = dict(context.invocation_metadata())
    token = metadata.get("authorization")
    if token != "Bearer token":
        context.abort(grpc.StatusCode.UNAUTHENTICATED, "Token inválido")
```

---

## Interceptors

Interceptors são úteis para logs, autenticação, métricas e tracing.

```python
import grpc


class LoggingInterceptor(grpc.ServerInterceptor):
    def intercept_service(self, continuation, handler_call_details):
        print(f"Chamando {handler_call_details.method}")
        return continuation(handler_call_details)
```

Servidor:

```python
server = grpc.server(
    futures.ThreadPoolExecutor(max_workers=10),
    interceptors=[LoggingInterceptor()],
)
```

---

## Server Streaming

Proto:

```proto
rpc ListarTarefas (ListarTarefasRequest) returns (stream TarefaResponse);

message ListarTarefasRequest {
  int32 limit = 1;
}
```

Servidor:

```python
def ListarTarefas(self, request, context):
    for tarefa in self.tarefas.values():
        yield tarefa
```

Cliente:

```python
for tarefa in client.ListarTarefas(tarefas_pb2.ListarTarefasRequest(limit=10)):
    print(tarefa.titulo)
```

---

## Client Streaming

Proto:

```proto
rpc CriarTarefasEmLote (stream CriarTarefaRequest) returns (ResumoLote);

message ResumoLote {
  int32 total = 1;
}
```

Servidor:

```python
def CriarTarefasEmLote(self, request_iterator, context):
    total = 0
    for request in request_iterator:
        total += 1
    return tarefas_pb2.ResumoLote(total=total)
```

---

## Bidirectional Streaming

Proto:

```proto
rpc ChatTarefas (stream ChatMessage) returns (stream ChatMessage);

message ChatMessage {
  string usuario = 1;
  string texto = 2;
}
```

Servidor:

```python
def ChatTarefas(self, request_iterator, context):
    for msg in request_iterator:
        yield tarefas_pb2.ChatMessage(
            usuario="servidor",
            texto=f"Recebido: {msg.texto}",
        )
```

---

## Evolução de Protobuf

Regras importantes:

- nunca reutilize números de campos removidos;
- adicione campos novos com novos números;
- mantenha compatibilidade quando possível;
- use `reserved` para campos removidos;
- evite mudar tipo de campo existente.

Exemplo:

```proto
message TarefaResponse {
  reserved 4;
  reserved "campo_antigo";

  int64 id = 1;
  string titulo = 2;
  bool concluida = 3;
  string prioridade = 5;
}
```

---

## gRPC Async

```python
import asyncio
import grpc
import tarefas_pb2_grpc


class TarefaService(tarefas_pb2_grpc.TarefaServiceServicer):
    async def BuscarTarefa(self, request, context):
        return tarefas_pb2.TarefaResponse(id=request.id, titulo="Async", concluida=False)


async def serve():
    server = grpc.aio.server()
    tarefas_pb2_grpc.add_TarefaServiceServicer_to_server(TarefaService(), server)
    server.add_insecure_port("[::]:50051")
    await server.start()
    await server.wait_for_termination()


asyncio.run(serve())
```

---

## Checklist gRPC Profissional

- contratos `.proto` estão versionados?
- nomes de serviços e mensagens são claros?
- timeouts/deadlines são obrigatórios no cliente?
- status codes são usados corretamente?
- autenticação usa metadata/interceptor?
- streaming tem backpressure considerado?
- campos removidos são `reserved`?
- há testes de contrato?
- logs e métricas incluem método gRPC?
- TLS/mTLS foi considerado para produção?

