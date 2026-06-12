# Scrapy e Playwright

Crawlers estruturados e páginas dinâmicas.

## Pontos-chave

- Scrapy para crawlers com pipelines
- Playwright para JS/SPA
- Filas e deduplicação
- Exportação para CSV/DB

## Exemplo

```python
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch()
    page = b.new_page()
    page.goto('https://exemplo.com')
    print(page.title())
```

## Boas práticas

- Use browser real só quando necessário
- Respeite os termos de uso

## Saiba mais

- [Documentação oficial](https://playwright.dev/python/)
