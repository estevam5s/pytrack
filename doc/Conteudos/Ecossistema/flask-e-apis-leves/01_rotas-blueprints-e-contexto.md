# Rotas, blueprints e contexto

Flask é minimalista e flexível — você monta só o que precisa.

> **Tema:** Web Framework · **Nível:** intermediario · **Trilha:** Flask e APIs Leves

## Conceitos-chave

Nesta lição você vai entender:

- **@app.route define rotas e métodos HTTP**
- **Blueprints organizam apps grandes em módulos**
- **request/session/g para o contexto da requisição**
- **jsonify para respostas JSON**

## Exemplo prático

```python
from flask import Flask, jsonify, request
app = Flask(__name__)

@app.post('/eco')
def eco():
    dados = request.get_json()
    return jsonify(recebido=dados), 201
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Use blueprints assim que o app crescer
- Valide o corpo da requisição antes de usá-lo

## Pratique

Para fixar, escreva um pequeno script que combine **@app.route define rotas e métodos http** e **blueprints organizam apps grandes em módulos** em um caso do seu dia a dia. Depois refatore aplicando "Use blueprints assim que o app crescer".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: @app.route define rotas e métodos HTTP
- [ ] Explicar e aplicar: Blueprints organizam apps grandes em módulos
- [ ] Explicar e aplicar: request/session/g para o contexto da requisição
- [ ] Explicar e aplicar: jsonify para respostas JSON

## Saiba mais

- [Documentação oficial](https://flask.palletsprojects.com/)
