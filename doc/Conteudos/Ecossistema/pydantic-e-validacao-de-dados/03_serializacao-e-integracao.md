# Serialização e integração

Como serializar, lidar com aliases e integrar com APIs.

> **Tema:** Validação · **Nível:** intermediario · **Trilha:** Pydantic e Validação de Dados

## Conceitos-chave

Nesta lição você vai entender:

- **model_dump(mode='json') para JSON serializável**
- **Aliases para nomes camelCase de APIs**
- **Modelos aninhados e listas tipadas**
- **Integração nativa com FastAPI**

## Exemplo prático

```python
class Endereco(BaseModel):
    cidade: str

class Cliente(BaseModel):
    nome: str
    enderecos: list[Endereco]

print(Cliente(nome='Ana', enderecos=[{'cidade':'SP'}]).model_dump())
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Prefira modelos a dicts soltos
- Documente o contrato com exemplos

## Pratique

Para fixar, escreva um pequeno script que combine **model_dump(mode='json') para json serializável** e **aliases para nomes camelcase de apis** em um caso do seu dia a dia. Depois refatore aplicando "Prefira modelos a dicts soltos".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: model_dump(mode='json') para JSON serializável
- [ ] Explicar e aplicar: Aliases para nomes camelCase de APIs
- [ ] Explicar e aplicar: Modelos aninhados e listas tipadas
- [ ] Explicar e aplicar: Integração nativa com FastAPI

## Saiba mais

- [Documentação oficial](https://docs.pydantic.dev/latest/concepts/serialization/)
