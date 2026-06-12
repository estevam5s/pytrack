# Coleta resiliente e ética

Boas práticas para scraping confiável e legal.

## Pontos-chave

- Rate limiting e retries com backoff
- Rotação de user-agent quando apropriado
- Parsing com selectolax/BeautifulSoup
- Armazenamento incremental dos dados

## Exemplo

```python
import time, random

def coletar(urls):
    for u in urls:
        # ... requisição ...
        time.sleep(random.uniform(1, 3))  # educado com o servidor
```

## Boas práticas

- Não sobrecarregue o servidor alvo
- Prefira APIs oficiais quando existirem

## Saiba mais

- [Documentação oficial](https://playwright.dev/python/docs/intro)
