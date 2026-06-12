# Full-stack com FastAPI e templates

Você pode entregar HTML direto do FastAPI usando Jinja2, sem um frontend separado.

## Pontos-chave

- Jinja2 renderiza templates com dados do servidor
- Rotas retornam HTML ou JSON
- Arquivos estáticos (CSS/JS) servidos pelo app
- Formulários e validação no servidor

## Exemplo

```python
from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates

app = FastAPI()
tpl = Jinja2Templates(directory='templates')

@app.get('/')
def home(request: Request):
    return tpl.TemplateResponse('home.html', {'request': request, 'nome': 'Ana'})
```

## Boas práticas

- Separe templates por componente
- Escape sempre a saída (o Jinja faz por padrão)

## Saiba mais

- [Documentação oficial](https://fastapi.tiangolo.com/advanced/templates/)
