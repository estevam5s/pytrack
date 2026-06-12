# Full-stack com FastAPI e templates

Você pode entregar HTML direto do FastAPI usando Jinja2, sem um frontend separado.

> **Tema:** Web · **Nível:** intermediario · **Trilha:** Web Full-Stack com Python

## Conceitos-chave

Nesta lição você vai entender:

- **Jinja2 renderiza templates com dados do servidor**
- **Rotas retornam HTML ou JSON**
- **Arquivos estáticos (CSS/JS) servidos pelo app**
- **Formulários e validação no servidor**

## Exemplo prático

```python
from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates

app = FastAPI()
tpl = Jinja2Templates(directory='templates')

@app.get('/')
def home(request: Request):
    return tpl.TemplateResponse('home.html', {'request': request, 'nome': 'Ana'})
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Separe templates por componente
- Escape sempre a saída (o Jinja faz por padrão)

## Pratique

Para fixar, escreva um pequeno script que combine **jinja2 renderiza templates com dados do servidor** e **rotas retornam html ou json** em um caso do seu dia a dia. Depois refatore aplicando "Separe templates por componente".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Jinja2 renderiza templates com dados do servidor
- [ ] Explicar e aplicar: Rotas retornam HTML ou JSON
- [ ] Explicar e aplicar: Arquivos estáticos (CSS/JS) servidos pelo app
- [ ] Explicar e aplicar: Formulários e validação no servidor

## Saiba mais

- [Documentação oficial](https://fastapi.tiangolo.com/advanced/templates/)
