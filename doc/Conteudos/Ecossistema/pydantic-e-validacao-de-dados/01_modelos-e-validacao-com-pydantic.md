# Modelos e validação com Pydantic

Pydantic valida e converte dados a partir de type hints, sendo a base do FastAPI e de configurações tipadas.

## Pontos-chave

- BaseModel define campos tipados com validação automática
- Conversão (coerção) de tipos e mensagens de erro claras
- Field() adiciona restrições (min, max, regex, default)
- model_validate / model_dump para entrada e saída

## Exemplo

```python
from pydantic import BaseModel, Field

class Usuario(BaseModel):
    nome: str = Field(min_length=2)
    idade: int = Field(ge=0, le=120)
    email: str

u = Usuario.model_validate({'nome': 'Ana', 'idade': '30', 'email': 'a@x.com'})
print(u.idade)  # 30 (int)
```

## Boas práticas

- Valide na borda da aplicação, antes da lógica de negócio
- Use modelos separados para entrada e saída

## Saiba mais

- [Documentação oficial](https://docs.pydantic.dev/)
