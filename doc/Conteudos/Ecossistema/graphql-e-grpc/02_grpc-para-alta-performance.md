# gRPC para alta performance

RPC binário com contratos protobuf.

> **Tema:** APIs · **Nível:** avancado · **Trilha:** GraphQL e gRPC

## Conceitos-chave

Nesta lição você vai entender:

- **Contratos .proto e geração de stubs**
- **Streaming bidirecional**
- **Alta performance e baixa latência**
- **Bom para microsserviços internos**

## Exemplo prático

```python
# service.proto
service Calc {
  rpc Somar(Par) returns (Resultado);
}
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Versione contratos com cuidado
- Use para serviços internos

## Pratique

Para fixar, escreva um pequeno script que combine **contratos .proto e geração de stubs** e **streaming bidirecional** em um caso do seu dia a dia. Depois refatore aplicando "Versione contratos com cuidado".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Contratos .proto e geração de stubs
- [ ] Explicar e aplicar: Streaming bidirecional
- [ ] Explicar e aplicar: Alta performance e baixa latência
- [ ] Explicar e aplicar: Bom para microsserviços internos

## Saiba mais

- [Documentação oficial](https://grpc.io/docs/languages/python/)
