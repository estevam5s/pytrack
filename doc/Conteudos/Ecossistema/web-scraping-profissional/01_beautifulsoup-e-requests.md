# BeautifulSoup e requests

Extraia dados de páginas estáticas com parsing HTML.

> **Tema:** Scraping · **Nível:** intermediario · **Trilha:** Web Scraping Profissional

## Conceitos-chave

Nesta lição você vai entender:

- **httpx/requests para baixar**
- **BeautifulSoup para navegar no DOM**
- **Seletores CSS**
- **Respeite robots.txt e rate limits**

## Exemplo prático

```python
import httpx
from bs4 import BeautifulSoup
html = httpx.get('https://exemplo.com').text
soup = BeautifulSoup(html, 'html.parser')
for h in soup.select('h2'):
    print(h.get_text(strip=True))
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Adicione delays e backoff
- Trate erros de rede

## Pratique

Para fixar, escreva um pequeno script que combine **httpx/requests para baixar** e **beautifulsoup para navegar no dom** em um caso do seu dia a dia. Depois refatore aplicando "Adicione delays e backoff".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: httpx/requests para baixar
- [ ] Explicar e aplicar: BeautifulSoup para navegar no DOM
- [ ] Explicar e aplicar: Seletores CSS
- [ ] Explicar e aplicar: Respeite robots.txt e rate limits

## Saiba mais

- [Documentação oficial](https://www.crummy.com/software/BeautifulSoup/bs4/doc/)
