# Web Scraping Profissional

Web scraping é a extração automatizada de dados de páginas web. Pode ser simples, como coletar títulos de uma página estática, ou complexo, como navegar por paginação, autenticação, JavaScript, bloqueios, rate limits e mudanças frequentes de layout.

Scraping profissional exige técnica e responsabilidade. Antes de coletar dados, avalie termos de uso, `robots.txt`, privacidade, direitos autorais, volume de requisições e impacto no servidor.

---

## Scraping, Crawling e APIs

- **API**: melhor opção quando existe. Mais estável, documentada e legalmente clara.
- **Scraping**: extrai dados do HTML renderizado ou retornado pelo servidor.
- **Crawling**: navega por várias páginas seguindo links.
- **Browser automation**: usa navegador real quando há JavaScript, login ou interação complexa.

Regra prática: tente API primeiro, depois `requests` + parser, depois Scrapy, e use Selenium/Playwright somente quando necessário.

---

## Fluxo Profissional

1. Investigar a origem dos dados.
2. Verificar se há API pública ou endpoint JSON.
3. Avaliar `robots.txt` e termos de uso.
4. Criar um coletor pequeno e controlado.
5. Adicionar parsing robusto.
6. Adicionar retry, timeout, cache e rate limit.
7. Salvar dados brutos e dados normalizados.
8. Monitorar falhas e mudanças no layout.

---

## Exemplo Simples com `requests`

```python
import requests


def baixar_html(url: str) -> str:
    headers = {
        "User-Agent": "CursoPythonAutomacao/1.0 contato:email@example.com"
    }
    resposta = requests.get(url, headers=headers, timeout=20)
    resposta.raise_for_status()
    return resposta.text


html = baixar_html("https://example.com")
print(html[:500])
```

Sempre use:

- `timeout`;
- `raise_for_status`;
- `User-Agent` identificável;
- tratamento de exceções;
- limite de frequência.

---

## Extração com BeautifulSoup

```python
from bs4 import BeautifulSoup
import requests


def coletar_links(url: str) -> list[dict[str, str]]:
    resposta = requests.get(url, timeout=20)
    resposta.raise_for_status()

    soup = BeautifulSoup(resposta.text, "lxml")
    links = []

    for tag in soup.select("a[href]"):
        texto = tag.get_text(strip=True)
        href = tag["href"]
        if texto:
            links.append({"texto": texto, "url": href})

    return links
```

---

## Paginação

```python
from urllib.parse import urljoin
import time
import requests
from bs4 import BeautifulSoup


def coletar_paginas(url_inicial: str, limite: int = 10) -> list[dict[str, str]]:
    url_atual = url_inicial
    resultados = []

    for _ in range(limite):
        resposta = requests.get(url_atual, timeout=20)
        resposta.raise_for_status()
        soup = BeautifulSoup(resposta.text, "lxml")

        for item in soup.select(".produto"):
            resultados.append({
                "nome": item.select_one(".nome").get_text(strip=True),
                "preco": item.select_one(".preco").get_text(strip=True),
            })

        proxima = soup.select_one("a.next[href]")
        if not proxima:
            break

        url_atual = urljoin(url_atual, proxima["href"])
        time.sleep(1)

    return resultados
```

---

## Rate Limit e Respeito ao Servidor

```python
import time
from collections.abc import Iterator


def limitar_taxa(urls: list[str], intervalo: float = 1.5) -> Iterator[str]:
    for url in urls:
        yield url
        time.sleep(intervalo)
```

Em produção, prefira configurar:

- requisições por segundo;
- concorrência máxima;
- backoff em HTTP 429;
- cache para páginas já coletadas;
- janela de execução fora de horário de pico.

---

## Cache Local de Respostas

```python
from pathlib import Path
import hashlib
import requests


CACHE_DIR = Path(".cache_html")
CACHE_DIR.mkdir(exist_ok=True)


def nome_cache(url: str) -> Path:
    digest = hashlib.sha256(url.encode("utf-8")).hexdigest()
    return CACHE_DIR / f"{digest}.html"


def obter_html_com_cache(url: str) -> str:
    arquivo = nome_cache(url)
    if arquivo.exists():
        return arquivo.read_text(encoding="utf-8")

    resposta = requests.get(url, timeout=20)
    resposta.raise_for_status()
    html = resposta.text
    arquivo.write_text(html, encoding="utf-8")
    return html
```

Cache reduz tráfego, acelera testes e ajuda a reproduzir bugs de parsing.

---

## Normalização dos Dados

Dados extraídos costumam vir sujos.

```python
from decimal import Decimal
import re


def normalizar_preco(valor: str) -> Decimal:
    limpo = re.sub(r"[^\d,.-]", "", valor)
    limpo = limpo.replace(".", "").replace(",", ".")
    return Decimal(limpo)


def normalizar_texto(texto: str) -> str:
    return " ".join(texto.split())
```

---

## Salvando em CSV e JSONL

```python
import csv
import json
from pathlib import Path


def salvar_csv(registros: list[dict], caminho: Path) -> None:
    if not registros:
        return

    caminho.parent.mkdir(parents=True, exist_ok=True)
    with caminho.open("w", newline="", encoding="utf-8") as arquivo:
        writer = csv.DictWriter(arquivo, fieldnames=registros[0].keys())
        writer.writeheader()
        writer.writerows(registros)


def salvar_jsonl(registros: list[dict], caminho: Path) -> None:
    caminho.parent.mkdir(parents=True, exist_ok=True)
    with caminho.open("w", encoding="utf-8") as arquivo:
        for registro in registros:
            arquivo.write(json.dumps(registro, ensure_ascii=False) + "\n")
```

JSONL é excelente para grandes volumes porque permite processar linha por linha.

---

## Erros Comuns

- não usar timeout;
- fazer requisições em loop sem pausa;
- depender de seletores frágeis;
- ignorar encoding;
- sobrescrever dados brutos;
- não versionar o schema dos dados coletados;
- não tratar captcha, login expirado ou HTTP 429;
- confundir scraping permitido com scraping aceitável em grande escala.

---

## Projeto Completo: Coletor HTTP com Logs e Retry

```python
from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
import csv
import logging
import time

import requests
from bs4 import BeautifulSoup


logger = logging.getLogger("coletor")


@dataclass
class Produto:
    nome: str
    preco: str
    url: str


class ColetorProdutos:
    def __init__(self, base_url: str, pausa: float = 1.0) -> None:
        self.base_url = base_url
        self.pausa = pausa
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": "ColetorProdutos/1.0 contato:email@example.com"
        })

    def baixar(self, url: str) -> str:
        for tentativa in range(1, 4):
            try:
                resposta = self.session.get(url, timeout=20)
                resposta.raise_for_status()
                return resposta.text
            except requests.RequestException as exc:
                logger.warning("Falha tentativa %s em %s: %s", tentativa, url, exc)
                if tentativa == 3:
                    raise
                time.sleep(2 * tentativa)

        raise RuntimeError("Fluxo inesperado")

    def parsear(self, html: str) -> list[Produto]:
        soup = BeautifulSoup(html, "lxml")
        produtos = []

        for card in soup.select(".produto"):
            nome_tag = card.select_one(".nome")
            preco_tag = card.select_one(".preco")
            link_tag = card.select_one("a[href]")

            if not (nome_tag and preco_tag and link_tag):
                continue

            produtos.append(Produto(
                nome=nome_tag.get_text(strip=True),
                preco=preco_tag.get_text(strip=True),
                url=link_tag["href"],
            ))

        return produtos

    def coletar(self, paginas: list[str]) -> list[Produto]:
        todos = []
        for pagina in paginas:
            logger.info("Coletando %s", pagina)
            html = self.baixar(pagina)
            todos.extend(self.parsear(html))
            time.sleep(self.pausa)
        return todos


def salvar(produtos: list[Produto], caminho: Path) -> None:
    caminho.parent.mkdir(parents=True, exist_ok=True)
    with caminho.open("w", newline="", encoding="utf-8") as arquivo:
        writer = csv.DictWriter(arquivo, fieldnames=["nome", "preco", "url"])
        writer.writeheader()
        for produto in produtos:
            writer.writerow(produto.__dict__)


def main() -> None:
    logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | %(message)s")
    coletor = ColetorProdutos("https://example.com")
    paginas = ["https://example.com/produtos?page=1", "https://example.com/produtos?page=2"]
    produtos = coletor.coletar(paginas)
    salvar(produtos, Path("data/output/produtos.csv"))


if __name__ == "__main__":
    main()
```

