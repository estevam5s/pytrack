# Validators e settings

Validators customizados e pydantic-settings para configuração por ambiente.

## Pontos-chave

- @field_validator para regras customizadas
- model_config e computed fields
- BaseSettings lê variáveis de ambiente tipadas
- Segredos fora do código, validados no boot

## Exemplo

```python
from pydantic import field_validator, BaseModel

class Conta(BaseModel):
    saldo: float

    @field_validator('saldo')
    @classmethod
    def positivo(cls, v):
        if v < 0:
            raise ValueError('saldo negativo')
        return v
```

## Boas práticas

- Falhe cedo: valide configs no startup
- Centralize settings em um único módulo

## Saiba mais

- [Documentação oficial](https://docs.pydantic.dev/latest/concepts/pydantic_settings/)
