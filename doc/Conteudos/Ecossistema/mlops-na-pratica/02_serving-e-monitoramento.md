# Serving e monitoramento

Coloque modelos em produção e acompanhe.

> **Tema:** MLOps · **Nível:** avancado · **Trilha:** MLOps na Prática

## Conceitos-chave

Nesta lição você vai entender:

- **API de inferência (FastAPI/BentoML)**
- **Monitoramento de drift e performance**
- **Versionamento de modelo**
- **Rollback e A/B testing**

## Exemplo prático

```python
from fastapi import FastAPI
app = FastAPI()

@app.post('/prever')
def prever(dados: dict):
    return {'classe': modelo.predict([list(dados.values())])[0]}
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Monitore drift de dados
- Tenha rollback de modelo

## Pratique

Para fixar, escreva um pequeno script que combine **api de inferência (fastapi/bentoml)** e **monitoramento de drift e performance** em um caso do seu dia a dia. Depois refatore aplicando "Monitore drift de dados".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: API de inferência (FastAPI/BentoML)
- [ ] Explicar e aplicar: Monitoramento de drift e performance
- [ ] Explicar e aplicar: Versionamento de modelo
- [ ] Explicar e aplicar: Rollback e A/B testing

## Saiba mais

- [Documentação oficial](https://docs.bentoml.org/)
