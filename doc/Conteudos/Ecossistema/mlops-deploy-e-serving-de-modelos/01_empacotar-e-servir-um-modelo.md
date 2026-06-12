# Empacotar e servir um modelo

Tirar um modelo do notebook e colocá-lo atrás de uma API confiável.

> **Tema:** MLOps · **Nível:** avancado · **Trilha:** MLOps: Deploy e Serving de Modelos

## Conceitos-chave

Nesta lição você vai entender:

- **Serialização com joblib/pickle ou ONNX**
- **API de inferência com FastAPI**
- **Validação de entrada com Pydantic**
- **Versionar o modelo junto com o código**

## Exemplo prático

```python
from fastapi import FastAPI
import joblib

modelo = joblib.load('modelo.pkl')
app = FastAPI()

@app.post('/prever')
def prever(features: list[float]):
    return {'classe': int(modelo.predict([features])[0])}
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Valide e normalize a entrada igual ao treino
- Fixe versões de libs — modelo e ambiente andam juntos

## Pratique

Para fixar, escreva um pequeno script que combine **serialização com joblib/pickle ou onnx** e **api de inferência com fastapi** em um caso do seu dia a dia. Depois refatore aplicando "Valide e normalize a entrada igual ao treino".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Serialização com joblib/pickle ou ONNX
- [ ] Explicar e aplicar: API de inferência com FastAPI
- [ ] Explicar e aplicar: Validação de entrada com Pydantic
- [ ] Explicar e aplicar: Versionar o modelo junto com o código

## Saiba mais

- [Documentação oficial](https://fastapi.tiangolo.com/)
