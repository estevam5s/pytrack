# Scrapy: Crawlers Profissionais e Pipelines

Scrapy é um framework completo para crawling e scraping. Ele gerencia requisições, concorrência, retries, pipelines, middlewares, exports, cache HTTP, tratamento de erros e estrutura de projeto.

Use Scrapy quando a coleta envolve muitas páginas, paginação profunda, múltiplos domínios permitidos, pipelines de limpeza, persistência organizada e necessidade de escala.

---

## Instalação e Projeto

```bash
pip install scrapy
scrapy startproject catalogo
cd catalogo
scrapy genspider produtos example.com
```

Estrutura típica:

```text
catalogo/
├── scrapy.cfg
└── catalogo/
    ├── items.py
    ├── middlewares.py
    ├── pipelines.py
    ├── settings.py
    └── spiders/
        └── produtos.py
```

---

## Spider Básica

```python
import scrapy


class ProdutosSpider(scrapy.Spider):
    name = "produtos"
    allowed_domains = ["example.com"]
    start_urls = ["https://example.com/produtos"]

    def parse(self, response):
        for card in response.css(".produto"):
            yield {
                "nome": card.css(".nome::text").get(),
                "preco": card.css(".preco::text").get(),
                "url": response.urljoin(card.css("a::attr(href)").get()),
            }

        proxima = response.css("a.next::attr(href)").get()
        if proxima:
            yield response.follow(proxima, callback=self.parse)
```

Execução:

```bash
scrapy crawl produtos -O produtos.jsonl
scrapy crawl produtos -O produtos.csv
```

---

## Items

`items.py`:

```python
import scrapy


class ProdutoItem(scrapy.Item):
    nome = scrapy.Field()
    preco = scrapy.Field()
    url = scrapy.Field()
    coletado_em = scrapy.Field()
```

Spider:

```python
from datetime import datetime, timezone
from catalogo.items import ProdutoItem


yield ProdutoItem(
    nome=nome,
    preco=preco,
    url=url,
    coletado_em=datetime.now(timezone.utc).isoformat(),
)
```

---

## Loaders e Normalização

```python
from itemloaders.processors import MapCompose, TakeFirst
from scrapy.loader import ItemLoader
import re


def limpar_texto(valor: str) -> str:
    return " ".join(valor.split())


def limpar_preco(valor: str) -> str:
    return re.sub(r"[^\d,.-]", "", valor)


class ProdutoLoader(ItemLoader):
    default_output_processor = TakeFirst()
    nome_in = MapCompose(limpar_texto)
    preco_in = MapCompose(limpar_texto, limpar_preco)
```

Uso:

```python
loader = ProdutoLoader(item=ProdutoItem(), selector=card, response=response)
loader.add_css("nome", ".nome::text")
loader.add_css("preco", ".preco::text")
loader.add_css("url", "a::attr(href)")
yield loader.load_item()
```

---

## Pipelines

`pipelines.py`:

```python
from itemadapter import ItemAdapter
from decimal import Decimal
import re


class ValidarProdutoPipeline:
    def process_item(self, item, spider):
        adapter = ItemAdapter(item)
        if not adapter.get("nome"):
            raise ValueError("Produto sem nome")
        return item


class NormalizarPrecoPipeline:
    def process_item(self, item, spider):
        adapter = ItemAdapter(item)
        preco = adapter.get("preco")
        if preco:
            limpo = re.sub(r"[^\d,.-]", "", preco).replace(".", "").replace(",", ".")
            adapter["preco_decimal"] = str(Decimal(limpo))
        return item
```

`settings.py`:

```python
ITEM_PIPELINES = {
    "catalogo.pipelines.ValidarProdutoPipeline": 300,
    "catalogo.pipelines.NormalizarPrecoPipeline": 400,
}
```

---

## Configurações Importantes

```python
ROBOTSTXT_OBEY = True
CONCURRENT_REQUESTS = 8
DOWNLOAD_DELAY = 1
RANDOMIZE_DOWNLOAD_DELAY = True
RETRY_ENABLED = True
RETRY_TIMES = 3
HTTPCACHE_ENABLED = True
HTTPCACHE_EXPIRATION_SECS = 3600
USER_AGENT = "CatalogoBot/1.0 contato:email@example.com"
```

Ajuste concorrência e delay conforme o site, os termos de uso e o impacto no servidor.

---

## Passando Argumentos

```python
class ProdutosSpider(scrapy.Spider):
    name = "produtos"

    def __init__(self, categoria=None, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.categoria = categoria or "todos"

    def start_requests(self):
        url = f"https://example.com/produtos?categoria={self.categoria}"
        yield scrapy.Request(url, callback=self.parse)
```

Execução:

```bash
scrapy crawl produtos -a categoria=notebooks -O notebooks.jsonl
```

---

## Salvando em Banco

```python
import sqlite3
from itemadapter import ItemAdapter


class SQLitePipeline:
    def open_spider(self, spider):
        self.conn = sqlite3.connect("produtos.db")
        self.conn.execute("""
            CREATE TABLE IF NOT EXISTS produtos (
                url TEXT PRIMARY KEY,
                nome TEXT NOT NULL,
                preco TEXT
            )
        """)

    def process_item(self, item, spider):
        adapter = ItemAdapter(item)
        self.conn.execute(
            "INSERT OR REPLACE INTO produtos (url, nome, preco) VALUES (?, ?, ?)",
            (adapter["url"], adapter["nome"], adapter.get("preco")),
        )
        self.conn.commit()
        return item

    def close_spider(self, spider):
        self.conn.close()
```

---

## Projeto Completo: Spider com Detalhes

```python
import scrapy


class ProdutosDetalheSpider(scrapy.Spider):
    name = "produtos_detalhe"
    allowed_domains = ["example.com"]

    def start_requests(self):
        yield scrapy.Request("https://example.com/produtos", callback=self.parse_listagem)

    def parse_listagem(self, response):
        for href in response.css(".produto a::attr(href)").getall():
            yield response.follow(href, callback=self.parse_detalhe)

        proxima = response.css("a.next::attr(href)").get()
        if proxima:
            yield response.follow(proxima, callback=self.parse_listagem)

    def parse_detalhe(self, response):
        yield {
            "url": response.url,
            "nome": response.css("h1::text").get(default="").strip(),
            "preco": response.css("[data-testid='preco']::text").get(),
            "descricao": " ".join(response.css(".descricao *::text").getall()).strip(),
            "imagens": [response.urljoin(src) for src in response.css(".galeria img::attr(src)").getall()],
        }
```

---

## Boas Práticas

- respeite `robots.txt` quando aplicável;
- use `allowed_domains`;
- salve em JSONL para grandes volumes;
- deduplique por URL ou chave de negócio;
- teste seletores no `scrapy shell`;
- configure cache para desenvolvimento;
- monitore taxa de erro;
- use pipelines para validação e persistência;
- não use Scrapy para páginas que exigem renderização pesada sem avaliar Splash, Playwright ou Selenium.

