# BeautifulSoup: Parsing HTML e Extração de Dados

BeautifulSoup é uma biblioteca para analisar HTML e XML. Ela não baixa páginas por conta própria; normalmente é usada com `requests`, arquivos HTML salvos ou respostas obtidas por outras ferramentas.

É ideal para páginas estáticas, extrações pontuais, normalização de HTML imperfeito e protótipos de scraping.

---

## Instalação

```bash
pip install beautifulsoup4 lxml requests
```

Use `lxml` como parser quando possível porque costuma ser mais rápido e tolerante.

---

## Criando o Objeto Soup

```python
from bs4 import BeautifulSoup


html = """
<html>
  <body>
    <h1>Produtos</h1>
    <div class="produto" data-id="10">
      <span class="nome">Teclado</span>
      <span class="preco">R$ 199,90</span>
    </div>
  </body>
</html>
"""

soup = BeautifulSoup(html, "lxml")
print(soup.select_one("h1").get_text(strip=True))
```

---

## Seletores Essenciais

```python
soup.find("h1")
soup.find_all("a")
soup.select(".produto")
soup.select_one("div.produto span.preco")
soup.select("a[href]")
```

Prefira `select` quando você já conhece CSS selectors.

---

## Extraindo Texto com Segurança

```python
def texto_ou_none(elemento) -> str | None:
    if elemento is None:
        return None
    return elemento.get_text(" ", strip=True)


nome = texto_ou_none(soup.select_one(".nome"))
```

Evite:

```python
nome = soup.select_one(".nome").text
```

Isso quebra se o elemento não existir.

---

## Extraindo Atributos

```python
from urllib.parse import urljoin


base_url = "https://example.com/produtos/"

for link in soup.select("a[href]"):
    href = link.get("href")
    url_absoluta = urljoin(base_url, href)
    print(url_absoluta)
```

Use `urljoin` para lidar com links relativos.

---

## Limpando Tabelas HTML

```python
def extrair_tabela(soup: BeautifulSoup, seletor: str) -> list[dict[str, str]]:
    tabela = soup.select_one(seletor)
    if tabela is None:
        return []

    cabecalhos = [
        th.get_text(" ", strip=True)
        for th in tabela.select("thead th")
    ]

    linhas = []
    for tr in tabela.select("tbody tr"):
        valores = [td.get_text(" ", strip=True) for td in tr.select("td")]
        if len(valores) == len(cabecalhos):
            linhas.append(dict(zip(cabecalhos, valores)))

    return linhas
```

Para tabelas simples, `pandas.read_html` também pode resolver.

---

## Parsing de Cards

```python
from dataclasses import dataclass


@dataclass
class Produto:
    id: str
    nome: str
    preco: str
    disponivel: bool


def parsear_produtos(html: str) -> list[Produto]:
    soup = BeautifulSoup(html, "lxml")
    produtos = []

    for card in soup.select("[data-produto-id]"):
        nome = card.select_one(".nome")
        preco = card.select_one(".preco")

        if nome is None or preco is None:
            continue

        produtos.append(Produto(
            id=card["data-produto-id"],
            nome=nome.get_text(" ", strip=True),
            preco=preco.get_text(" ", strip=True),
            disponivel=card.select_one(".indisponivel") is None,
        ))

    return produtos
```

---

## Removendo Tags Indesejadas

```python
def limpar_html_artigo(html: str) -> str:
    soup = BeautifulSoup(html, "lxml")

    for tag in soup.select("script, style, nav, footer, aside"):
        tag.decompose()

    artigo = soup.select_one("article")
    if artigo is None:
        return ""

    return artigo.get_text("\n", strip=True)
```

`decompose()` remove a tag da árvore.

---

## Projeto Completo: Extrator de Notícias

```python
from __future__ import annotations

from dataclasses import dataclass, asdict
from pathlib import Path
from urllib.parse import urljoin
import csv
import logging

import requests
from bs4 import BeautifulSoup


logger = logging.getLogger("noticias")


@dataclass
class Noticia:
    titulo: str
    url: str
    resumo: str | None


def baixar(url: str) -> str:
    resposta = requests.get(url, timeout=20, headers={
        "User-Agent": "ExtratorNoticias/1.0"
    })
    resposta.raise_for_status()
    return resposta.text


def texto(elemento) -> str | None:
    if elemento is None:
        return None
    return elemento.get_text(" ", strip=True)


def parsear_listagem(html: str, base_url: str) -> list[Noticia]:
    soup = BeautifulSoup(html, "lxml")
    noticias = []

    for card in soup.select(".noticia"):
        link = card.select_one("a[href]")
        titulo = texto(card.select_one(".titulo"))
        resumo = texto(card.select_one(".resumo"))

        if not link or not titulo:
            logger.warning("Card ignorado por falta de link ou título")
            continue

        noticias.append(Noticia(
            titulo=titulo,
            url=urljoin(base_url, link["href"]),
            resumo=resumo,
        ))

    return noticias


def salvar_csv(noticias: list[Noticia], caminho: Path) -> None:
    caminho.parent.mkdir(parents=True, exist_ok=True)
    with caminho.open("w", newline="", encoding="utf-8") as arquivo:
        writer = csv.DictWriter(arquivo, fieldnames=["titulo", "url", "resumo"])
        writer.writeheader()
        for noticia in noticias:
            writer.writerow(asdict(noticia))


def main() -> None:
    logging.basicConfig(level=logging.INFO)
    url = "https://example.com/noticias"
    html = baixar(url)
    noticias = parsear_listagem(html, url)
    salvar_csv(noticias, Path("data/output/noticias.csv"))
    logger.info("Notícias extraídas: %s", len(noticias))


if __name__ == "__main__":
    main()
```

---

## Boas Práticas

- parseie HTML salvo em testes;
- centralize funções de limpeza;
- use seletores específicos;
- trate elementos ausentes;
- normalize links;
- salve HTML bruto quando a coleta for importante;
- registre cards ignorados;
- valide schema final antes de salvar;
- mantenha exemplos de HTML em fixtures de teste.

