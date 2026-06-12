# Templates Jinja e formulários

Renderização server-side com Jinja2 e formulários seguros.

> **Tema:** Web Framework · **Nível:** intermediario · **Trilha:** Flask e APIs Leves

## Conceitos-chave

Nesta lição você vai entender:

- **Jinja2: variáveis, filtros, loops e herança**
- **url_for evita URLs hardcoded**
- **Flask-WTF para forms com CSRF**
- **Flash messages para feedback**

## Exemplo prático

```python
from flask import render_template

@app.get('/')
def home():
    return render_template('home.html', titulo='PyTrack')
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Escape de saída é automático no Jinja — não desative
- Centralize layout com um template base

## Pratique

Para fixar, escreva um pequeno script que combine **jinja2: variáveis, filtros, loops e herança** e **url_for evita urls hardcoded** em um caso do seu dia a dia. Depois refatore aplicando "Escape de saída é automático no Jinja — não desative".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Jinja2: variáveis, filtros, loops e herança
- [ ] Explicar e aplicar: url_for evita URLs hardcoded
- [ ] Explicar e aplicar: Flask-WTF para forms com CSRF
- [ ] Explicar e aplicar: Flash messages para feedback

## Saiba mais

- [Documentação oficial](https://jinja.palletsprojects.com/)
