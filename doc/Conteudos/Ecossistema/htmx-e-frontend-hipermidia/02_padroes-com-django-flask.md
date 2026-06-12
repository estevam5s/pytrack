# Padrões com Django/Flask

Combinar HTMX com templates server-side gera apps reativos e simples.

> **Tema:** Frontend · **Nível:** intermediario · **Trilha:** HTMX e Frontend Hipermídia

## Conceitos-chave

Nesta lição você vai entender:

- **Endpoints que retornam parciais de template**
- **hx-trigger para eventos (load, change, intervalo)**
- **Indicadores de loading com hx-indicator**
- **Boosting de links e formulários**

## Exemplo prático

```python
# Flask: retorna só o fragmento
@app.post('/curtir/<int:id>')
def curtir(id):
    n = incrementar(id)
    return f'<span id="contador">{n}</span>'
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Reaproveite parciais entre página cheia e resposta HTMX
- Cuide do CSRF também nas requisições HTMX

## Pratique

Para fixar, escreva um pequeno script que combine **endpoints que retornam parciais de template** e **hx-trigger para eventos (load, change, intervalo)** em um caso do seu dia a dia. Depois refatore aplicando "Reaproveite parciais entre página cheia e resposta HTMX".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Endpoints que retornam parciais de template
- [ ] Explicar e aplicar: hx-trigger para eventos (load, change, intervalo)
- [ ] Explicar e aplicar: Indicadores de loading com hx-indicator
- [ ] Explicar e aplicar: Boosting de links e formulários

## Saiba mais

- [Documentação oficial](https://htmx.org/examples/)
