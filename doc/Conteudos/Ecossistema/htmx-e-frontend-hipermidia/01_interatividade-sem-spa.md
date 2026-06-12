# Interatividade sem SPA

HTMX adiciona AJAX, swaps e eventos via atributos HTML — sem escrever JavaScript.

> **Tema:** Frontend · **Nível:** intermediario · **Trilha:** HTMX e Frontend Hipermídia

## Conceitos-chave

Nesta lição você vai entender:

- **hx-get/hx-post disparam requisições**
- **hx-target e hx-swap atualizam pedaços da página**
- **O servidor responde com HTML, não JSON**
- **Progressive enhancement: funciona sem JS**

## Exemplo prático

```python
<button hx-post="/curtir/42"
        hx-target="#contador"
        hx-swap="innerHTML">
  Curtir
</button>
<span id="contador">10</span>
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Responda com fragmentos HTML pequenos e focados
- Use no-JS como linha de base e melhore progressivamente

## Pratique

Para fixar, escreva um pequeno script que combine **hx-get/hx-post disparam requisições** e **hx-target e hx-swap atualizam pedaços da página** em um caso do seu dia a dia. Depois refatore aplicando "Responda com fragmentos HTML pequenos e focados".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: hx-get/hx-post disparam requisições
- [ ] Explicar e aplicar: hx-target e hx-swap atualizam pedaços da página
- [ ] Explicar e aplicar: O servidor responde com HTML, não JSON
- [ ] Explicar e aplicar: Progressive enhancement: funciona sem JS

## Saiba mais

- [Documentação oficial](https://htmx.org/docs/)
