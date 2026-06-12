# Interatividade com HTMX

HTMX traz interatividade moderna (sem SPA) trocando pedaços de HTML via AJAX.

> **Tema:** Web · **Nível:** intermediario · **Trilha:** Web Full-Stack com Python

## Conceitos-chave

Nesta lição você vai entender:

- **Atributos hx-get/hx-post fazem requisições**
- **O servidor responde com fragmentos de HTML**
- **Atualiza partes da página sem recarregar**
- **Menos JavaScript, mais produtividade**

## Exemplo prático

```python
# template
<button hx-get='/contador' hx-swap='outerHTML'>
  Cliques: {{ n }}
</button>

# a rota /contador devolve o HTML atualizado do botão
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Combine HTMX com Tailwind para UI rápida
- Retorne fragmentos pequenos e focados

## Pratique

Para fixar, escreva um pequeno script que combine **atributos hx-get/hx-post fazem requisições** e **o servidor responde com fragmentos de html** em um caso do seu dia a dia. Depois refatore aplicando "Combine HTMX com Tailwind para UI rápida".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Atributos hx-get/hx-post fazem requisições
- [ ] Explicar e aplicar: O servidor responde com fragmentos de HTML
- [ ] Explicar e aplicar: Atualiza partes da página sem recarregar
- [ ] Explicar e aplicar: Menos JavaScript, mais produtividade

## Saiba mais

- [Documentação oficial](https://htmx.org/)
