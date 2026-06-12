# Serving e monitoramento

Coloque modelos em produção e acompanhe.

## Pontos-chave

- API de inferência (FastAPI/BentoML)
- Monitoramento de drift e performance
- Versionamento de modelo
- Rollback e A/B testing

## Exemplo

```python
from fastapi import FastAPI
app = FastAPI()

@app.post('/prever')
def prever(dados: dict):
    return {'classe': modelo.predict([list(dados.values())])[0]}
```

## Boas práticas

- Monitore drift de dados
- Tenha rollback de modelo

## Saiba mais

- [Documentação oficial](https://docs.bentoml.org/)
