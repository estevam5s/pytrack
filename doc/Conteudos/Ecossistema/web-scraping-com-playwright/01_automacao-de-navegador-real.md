# Automação de navegador real

Playwright controla Chromium/Firefox/WebKit para páginas dinâmicas (JS).

> **Tema:** Scraping · **Nível:** intermediario · **Trilha:** Web Scraping com Playwright

## Conceitos-chave

Nesta lição você vai entender:

- **Headless e headful, seletores robustos**
- **Espera automática por elementos**
- **Captura de screenshots e PDFs**
- **Intercepção de requisições**

## Exemplo prático

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page()
    pg.goto('https://example.com')
    print(pg.title())
    b.close()
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Respeite robots.txt e termos de uso
- Use esperas explícitas, não sleep fixo

## Pratique

Para fixar, escreva um pequeno script que combine **headless e headful, seletores robustos** e **espera automática por elementos** em um caso do seu dia a dia. Depois refatore aplicando "Respeite robots.txt e termos de uso".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Headless e headful, seletores robustos
- [ ] Explicar e aplicar: Espera automática por elementos
- [ ] Explicar e aplicar: Captura de screenshots e PDFs
- [ ] Explicar e aplicar: Intercepção de requisições

## Saiba mais

- [Documentação oficial](https://playwright.dev/python/)
