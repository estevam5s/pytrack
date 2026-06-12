# Forms, auth e admin

Validação com Forms, autenticação pronta e o admin gerado automaticamente.

> **Tema:** Web Framework · **Nível:** intermediario · **Trilha:** Django na Prática

## Conceitos-chave

Nesta lição você vai entender:

- **ModelForm gera formulários a partir de models**
- **Sistema de auth (login, permissões, grupos)**
- **admin.site.register expõe CRUD instantâneo**
- **CSRF e validação de formulário embutidos**

## Exemplo prático

```python
from django.contrib import admin
from .models import Post

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'autor', 'criado')
    search_fields = ('titulo',)
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Nunca desative o CSRF em formulários de mutação
- Use o admin para operações internas, não como API pública

## Pratique

Para fixar, escreva um pequeno script que combine **modelform gera formulários a partir de models** e **sistema de auth (login, permissões, grupos)** em um caso do seu dia a dia. Depois refatore aplicando "Nunca desative o CSRF em formulários de mutação".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: ModelForm gera formulários a partir de models
- [ ] Explicar e aplicar: Sistema de auth (login, permissões, grupos)
- [ ] Explicar e aplicar: admin.site.register expõe CRUD instantâneo
- [ ] Explicar e aplicar: CSRF e validação de formulário embutidos

## Saiba mais

- [Documentação oficial](https://docs.djangoproject.com/en/stable/ref/contrib/admin/)
