# Automação de navegador real

Playwright controla Chromium/Firefox/WebKit para páginas dinâmicas (JS).

## Pontos-chave

- Headless e headful, seletores robustos
- Espera automática por elementos
- Captura de screenshots e PDFs
- Intercepção de requisições

## Exemplo

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page()
    pg.goto('https://example.com')
    print(pg.title())
    b.close()
```

## Boas práticas

- Respeite robots.txt e termos de uso
- Use esperas explícitas, não sleep fixo

## Saiba mais

- [Documentação oficial](https://playwright.dev/python/)
