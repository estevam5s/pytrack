# Configuração por ambiente

Separe config do código com segurança.

> **Tema:** Observabilidade · **Nível:** intermediario · **Trilha:** Logging e Configuração

## Conceitos-chave

Nesta lição você vai entender:

- **Variáveis de ambiente e .env**
- **pydantic-settings tipado**
- **Configs por ambiente (dev/prod)**
- **Segredos em vaults**

## Exemplo prático

```python
from pydantic_settings import BaseSettings

class Config(BaseSettings):
    db_url: str
    debug: bool = False

config = Config()
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Valide config no startup
- Nunca versione segredos

## Pratique

Para fixar, escreva um pequeno script que combine **variáveis de ambiente e .env** e **pydantic-settings tipado** em um caso do seu dia a dia. Depois refatore aplicando "Valide config no startup".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Variáveis de ambiente e .env
- [ ] Explicar e aplicar: pydantic-settings tipado
- [ ] Explicar e aplicar: Configs por ambiente (dev/prod)
- [ ] Explicar e aplicar: Segredos em vaults

## Saiba mais

- [Documentação oficial](https://docs.pydantic.dev/latest/concepts/pydantic_settings/)
