# Views, URLs e templates

O ciclo request→view→response, com roteamento por URLconf e renderização de templates.

> **Tema:** Web Framework · **Nível:** intermediario · **Trilha:** Django na Prática

## Conceitos-chave

Nesta lição você vai entender:

- **Function-based e class-based views**
- **URLconf com path() e nomes de rota**
- **Templates com herança ({% extends %})**
- **Context processors injetam dados globais**

## Exemplo prático

```python
from django.shortcuts import render, get_object_or_404
from .models import Post

def detalhe(request, pk):
    post = get_object_or_404(Post, pk=pk)
    return render(request, 'blog/detalhe.html', {'post': post})
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Prefira get_object_or_404 a try/except manual
- Mantenha a lógica de negócio fora dos templates

## Pratique

Para fixar, escreva um pequeno script que combine **function-based e class-based views** e **urlconf com path() e nomes de rota** em um caso do seu dia a dia. Depois refatore aplicando "Prefira get_object_or_404 a try/except manual".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Function-based e class-based views
- [ ] Explicar e aplicar: URLconf com path() e nomes de rota
- [ ] Explicar e aplicar: Templates com herança ({% extends %})
- [ ] Explicar e aplicar: Context processors injetam dados globais

## Saiba mais

- [Documentação oficial](https://docs.djangoproject.com/en/stable/topics/http/views/)
