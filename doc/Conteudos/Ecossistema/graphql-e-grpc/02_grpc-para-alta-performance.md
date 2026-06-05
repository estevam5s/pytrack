# gRPC para alta performance

RPC binário com contratos protobuf.

## Pontos-chave

- Contratos .proto e geração de stubs
- Streaming bidirecional
- Alta performance e baixa latência
- Bom para microsserviços internos

## Exemplo

```python
# service.proto
service Calc {
  rpc Somar(Par) returns (Resultado);
}
```

## Boas práticas

- Versione contratos com cuidado
- Use para serviços internos

## Saiba mais

- [Documentação oficial](https://grpc.io/docs/languages/python/)
