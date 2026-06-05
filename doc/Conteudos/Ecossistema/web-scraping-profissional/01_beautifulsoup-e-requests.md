# BeautifulSoup e requests

Extraia dados de páginas estáticas com parsing HTML.

## Pontos-chave

- httpx/requests para baixar
- BeautifulSoup para navegar no DOM
- Seletores CSS
- Respeite robots.txt e rate limits

## Exemplo

```python
import httpx
from bs4 import BeautifulSoup
html = httpx.get('https://exemplo.com').text
soup = BeautifulSoup(html, 'html.parser')
for h in soup.select('h2'):
    print(h.get_text(strip=True))
```

## Boas práticas

- Adicione delays e backoff
- Trate erros de rede

## Saiba mais

- [Documentação oficial](https://www.crummy.com/software/BeautifulSoup/bs4/doc/)
