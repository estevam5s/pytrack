# Validators e settings

Validators customizados e pydantic-settings para configuração por ambiente.

> **Tema:** Validação · **Nível:** intermediario · **Trilha:** Pydantic e Validação de Dados

## Conceitos-chave

Nesta lição você vai entender:

- **@field_validator para regras customizadas**
- **model_config e computed fields**
- **BaseSettings lê variáveis de ambiente tipadas**
- **Segredos fora do código, validados no boot**

## Exemplo prático

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

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Falhe cedo: valide configs no startup
- Centralize settings em um único módulo

## Pratique

Para fixar, escreva um pequeno script que combine **@field_validator para regras customizadas** e **model_config e computed fields** em um caso do seu dia a dia. Depois refatore aplicando "Falhe cedo: valide configs no startup".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: @field_validator para regras customizadas
- [ ] Explicar e aplicar: model_config e computed fields
- [ ] Explicar e aplicar: BaseSettings lê variáveis de ambiente tipadas
- [ ] Explicar e aplicar: Segredos fora do código, validados no boot

## Saiba mais

- [Documentação oficial](https://docs.pydantic.dev/latest/concepts/pydantic_settings/)
