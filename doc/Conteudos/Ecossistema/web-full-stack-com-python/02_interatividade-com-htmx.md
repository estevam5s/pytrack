# Interatividade com HTMX

HTMX traz interatividade moderna (sem SPA) trocando pedaços de HTML via AJAX.

## Pontos-chave

- Atributos hx-get/hx-post fazem requisições
- O servidor responde com fragmentos de HTML
- Atualiza partes da página sem recarregar
- Menos JavaScript, mais produtividade

## Exemplo

```python
# template
<button hx-get='/contador' hx-swap='outerHTML'>
  Cliques: {{ n }}
</button>

# a rota /contador devolve o HTML atualizado do botão
```

## Boas práticas

- Combine HTMX com Tailwind para UI rápida
- Retorne fragmentos pequenos e focados

## Saiba mais

- [Documentação oficial](https://htmx.org/)
