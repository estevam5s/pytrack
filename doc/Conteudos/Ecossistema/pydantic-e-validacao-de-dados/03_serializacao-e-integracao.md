# Serialização e integração

Como serializar, lidar com aliases e integrar com APIs.

## Pontos-chave

- model_dump(mode='json') para JSON serializável
- Aliases para nomes camelCase de APIs
- Modelos aninhados e listas tipadas
- Integração nativa com FastAPI

## Exemplo

```python
class Endereco(BaseModel):
    cidade: str

class Cliente(BaseModel):
    nome: str
    enderecos: list[Endereco]

print(Cliente(nome='Ana', enderecos=[{'cidade':'SP'}]).model_dump())
```

## Boas práticas

- Prefira modelos a dicts soltos
- Documente o contrato com exemplos

## Saiba mais

- [Documentação oficial](https://docs.pydantic.dev/latest/concepts/serialization/)
