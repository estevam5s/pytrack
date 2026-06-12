# Scrapy e Playwright

Crawlers estruturados e páginas dinâmicas.

> **Tema:** Scraping · **Nível:** intermediario · **Trilha:** Web Scraping Profissional

## Conceitos-chave

Nesta lição você vai entender:

- **Scrapy para crawlers com pipelines**
- **Playwright para JS/SPA**
- **Filas e deduplicação**
- **Exportação para CSV/DB**

## Exemplo prático

```python
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch()
    page = b.new_page()
    page.goto('https://exemplo.com')
    print(page.title())
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Use browser real só quando necessário
- Respeite os termos de uso

## Pratique

Para fixar, escreva um pequeno script que combine **scrapy para crawlers com pipelines** e **playwright para js/spa** em um caso do seu dia a dia. Depois refatore aplicando "Use browser real só quando necessário".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Scrapy para crawlers com pipelines
- [ ] Explicar e aplicar: Playwright para JS/SPA
- [ ] Explicar e aplicar: Filas e deduplicação
- [ ] Explicar e aplicar: Exportação para CSV/DB

## Saiba mais

- [Documentação oficial](https://playwright.dev/python/)
