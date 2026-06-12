# Models, ORM e migrations

Django é um framework 'baterias inclusas': ORM, admin, auth e mais. Tudo começa pelos models.

> **Tema:** Web Framework · **Nível:** intermediario · **Trilha:** Django na Prática

## Conceitos-chave

Nesta lição você vai entender:

- **models.Model mapeia classes para tabelas**
- **makemigrations e migrate versionam o schema**
- **QuerySets são lazy e encadeáveis**
- **select_related/prefetch_related evitam o N+1**

## Exemplo prático

```python
from django.db import models

class Post(models.Model):
    titulo = models.CharField(max_length=200)
    corpo = models.TextField()
    criado = models.DateTimeField(auto_now_add=True)
    autor = models.ForeignKey('auth.User', on_delete=models.CASCADE)

    def __str__(self):
        return self.titulo
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Use migrations sempre — nunca altere o schema na mão
- Defina __str__ para objetos legíveis no admin

## Pratique

Para fixar, escreva um pequeno script que combine **models.model mapeia classes para tabelas** e **makemigrations e migrate versionam o schema** em um caso do seu dia a dia. Depois refatore aplicando "Use migrations sempre — nunca altere o schema na mão".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: models.Model mapeia classes para tabelas
- [ ] Explicar e aplicar: makemigrations e migrate versionam o schema
- [ ] Explicar e aplicar: QuerySets são lazy e encadeáveis
- [ ] Explicar e aplicar: select_related/prefetch_related evitam o N+1

## Saiba mais

- [Documentação oficial](https://docs.djangoproject.com/en/stable/topics/db/models/)
