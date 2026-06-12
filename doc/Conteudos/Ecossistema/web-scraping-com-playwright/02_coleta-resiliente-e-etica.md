# Coleta resiliente e ética

Boas práticas para scraping confiável e legal.

> **Tema:** Scraping · **Nível:** intermediario · **Trilha:** Web Scraping com Playwright

## Conceitos-chave

Nesta lição você vai entender:

- **Rate limiting e retries com backoff**
- **Rotação de user-agent quando apropriado**
- **Parsing com selectolax/BeautifulSoup**
- **Armazenamento incremental dos dados**

## Exemplo prático

```python
import time, random

def coletar(urls):
    for u in urls:
        # ... requisição ...
        time.sleep(random.uniform(1, 3))  # educado com o servidor
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Não sobrecarregue o servidor alvo
- Prefira APIs oficiais quando existirem

## Pratique

Para fixar, escreva um pequeno script que combine **rate limiting e retries com backoff** e **rotação de user-agent quando apropriado** em um caso do seu dia a dia. Depois refatore aplicando "Não sobrecarregue o servidor alvo".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Rate limiting e retries com backoff
- [ ] Explicar e aplicar: Rotação de user-agent quando apropriado
- [ ] Explicar e aplicar: Parsing com selectolax/BeautifulSoup
- [ ] Explicar e aplicar: Armazenamento incremental dos dados

## Saiba mais

- [Documentação oficial](https://playwright.dev/python/docs/intro)
