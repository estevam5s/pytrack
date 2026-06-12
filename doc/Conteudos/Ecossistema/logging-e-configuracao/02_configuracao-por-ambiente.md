# Configuração por ambiente

Separe config do código com segurança.

## Pontos-chave

- Variáveis de ambiente e .env
- pydantic-settings tipado
- Configs por ambiente (dev/prod)
- Segredos em vaults

## Exemplo

```python
from pydantic_settings import BaseSettings

class Config(BaseSettings):
    db_url: str
    debug: bool = False

config = Config()
```

## Boas práticas

- Valide config no startup
- Nunca versione segredos

## Saiba mais

- [Documentação oficial](https://docs.pydantic.dev/latest/concepts/pydantic_settings/)
