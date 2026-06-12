# Modelos e validação com Pydantic

Pydantic valida e converte dados a partir de type hints, sendo a base do FastAPI e de configurações tipadas.

> **Tema:** Validação · **Nível:** intermediario · **Trilha:** Pydantic e Validação de Dados

## Conceitos-chave

Nesta lição você vai entender:

- **BaseModel define campos tipados com validação automática**
- **Conversão (coerção) de tipos e mensagens de erro claras**
- **Field() adiciona restrições (min, max, regex, default)**
- **model_validate / model_dump para entrada e saída**

## Exemplo prático

```python
from pydantic import BaseModel, Field

class Usuario(BaseModel):
    nome: str = Field(min_length=2)
    idade: int = Field(ge=0, le=120)
    email: str

u = Usuario.model_validate({'nome': 'Ana', 'idade': '30', 'email': 'a@x.com'})
print(u.idade)  # 30 (int)
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Valide na borda da aplicação, antes da lógica de negócio
- Use modelos separados para entrada e saída

## Pratique

Para fixar, escreva um pequeno script que combine **basemodel define campos tipados com validação automática** e **conversão (coerção) de tipos e mensagens de erro claras** em um caso do seu dia a dia. Depois refatore aplicando "Valide na borda da aplicação, antes da lógica de negócio".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: BaseModel define campos tipados com validação automática
- [ ] Explicar e aplicar: Conversão (coerção) de tipos e mensagens de erro claras
- [ ] Explicar e aplicar: Field() adiciona restrições (min, max, regex, default)
- [ ] Explicar e aplicar: model_validate / model_dump para entrada e saída

## Saiba mais

- [Documentação oficial](https://docs.pydantic.dev/)
