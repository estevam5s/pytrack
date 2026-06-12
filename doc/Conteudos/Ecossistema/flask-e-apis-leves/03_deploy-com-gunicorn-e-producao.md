# Deploy com Gunicorn e produção

Servir Flask de forma robusta com um WSGI server e boas práticas.

> **Tema:** Web Framework · **Nível:** intermediario · **Trilha:** Flask e APIs Leves

## Conceitos-chave

Nesta lição você vai entender:

- **Gunicorn como servidor WSGI de produção**
- **Variáveis de ambiente para config (12-factor)**
- **Proxy reverso (Nginx) à frente**
- **Healthcheck e logs estruturados**

## Exemplo prático

```python
# gunicorn -w 4 -b 0.0.0.0:8000 app:app
import os
app.config['SECRET_KEY'] = os.environ['SECRET_KEY']
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Nunca rode o servidor de desenvolvimento em produção
- Mantenha segredos fora do código

## Pratique

Para fixar, escreva um pequeno script que combine **gunicorn como servidor wsgi de produção** e **variáveis de ambiente para config (12-factor)** em um caso do seu dia a dia. Depois refatore aplicando "Nunca rode o servidor de desenvolvimento em produção".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Gunicorn como servidor WSGI de produção
- [ ] Explicar e aplicar: Variáveis de ambiente para config (12-factor)
- [ ] Explicar e aplicar: Proxy reverso (Nginx) à frente
- [ ] Explicar e aplicar: Healthcheck e logs estruturados

## Saiba mais

- [Documentação oficial](https://docs.gunicorn.org/)
