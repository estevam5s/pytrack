# Playwright, Bots, Desktop e Planilhas Avançadas

Este módulo complementa a trilha de automação cobrindo ferramentas modernas e integrações específicas: Playwright para navegador, PyAutoGUI/pynput/keyboard para desktop, bots com Telegram/Discord/Slack e planilhas com openpyxl, xlwings e Google Sheets API.

---

## Playwright

Playwright controla navegadores modernos e é excelente para automação web, testes E2E e scraping de páginas com JavaScript.

Instalação:

```bash
pip install playwright
playwright install
```

Exemplo síncrono:

```python
from playwright.sync_api import sync_playwright


def coletar_titulo(url: str) -> str:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(url, wait_until="networkidle")
        titulo = page.title()
        browser.close()
        return titulo
```

Exemplo assíncrono:

```python
from playwright.async_api import async_playwright


async def coletar_texto(url: str, seletor: str) -> str:
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto(url)
        texto = await page.locator(seletor).inner_text()
        await browser.close()
        return texto
```

Quando usar Playwright:

- páginas com JavaScript pesado;
- fluxos com login, clique e navegação;
- screenshots e PDFs;
- testes E2E;
- automação multi-browser.

Evite usar navegador real quando API ou HTML estático resolvem. Navegador é mais lento, caro e frágil.

---

## BeautifulSoup, Scrapy, Selenium e Playwright

| Ferramenta | Melhor uso |
|---|---|
| BeautifulSoup | parsing de HTML estático |
| Scrapy | crawlers grandes, filas, pipelines e exports |
| Selenium | RPA web e compatibilidade ampla |
| Playwright | automação moderna, JS intenso e testes E2E |

Sequência recomendada:

1. Verifique API oficial.
2. Tente `requests` + BeautifulSoup.
3. Use Scrapy se houver crawling em escala.
4. Use Selenium ou Playwright quando precisar de navegador real.

---

## PyAutoGUI

PyAutoGUI controla mouse, teclado e tela.

```python
import pyautogui

pyautogui.hotkey("ctrl", "l")
pyautogui.write("https://example.com")
pyautogui.press("enter")
```

Boas práticas:

- use `pyautogui.PAUSE`;
- configure failsafe;
- tire screenshots em erro;
- prefira coordenadas relativas ou busca por imagem;
- não use para sistemas que oferecem API confiável.

---

## pynput

`pynput` permite controlar e observar eventos de mouse/teclado.

```python
from pynput.keyboard import Controller, Key

teclado = Controller()
teclado.press(Key.ctrl)
teclado.press("s")
teclado.release("s")
teclado.release(Key.ctrl)
```

Use quando precisa de controle mais baixo nível ou listeners de eventos.

---

## keyboard

`keyboard` oferece atalhos globais e automação de teclado.

```python
import keyboard

keyboard.add_hotkey("ctrl+shift+r", lambda: print("rodando automação"))
keyboard.wait("esc")
```

Cuidados:

- pode exigir permissões elevadas;
- comportamento varia por sistema operacional;
- atalhos globais podem interferir no usuário;
- documente como parar a automação.

---

## Bots com python-telegram-bot

Instalação:

```bash
pip install python-telegram-bot
```

Exemplo:

```python
from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await update.message.reply_text("Bot ativo")


def criar_app(token: str) -> Application:
    app = Application.builder().token(token).build()
    app.add_handler(CommandHandler("start", start))
    return app
```

Use para alertas operacionais, comandos internos, consultas e fluxos simples.

---

## Bots com discord.py

Instalação:

```bash
pip install discord.py
```

Exemplo:

```python
import discord

intents = discord.Intents.default()
client = discord.Client(intents=intents)


@client.event
async def on_ready():
    print(f"conectado como {client.user}")


@client.event
async def on_message(message):
    if message.author == client.user:
        return
    if message.content == "!ping":
        await message.channel.send("pong")
```

Cuidados:

- proteja token;
- habilite intents necessárias;
- trate rate limits;
- registre erros;
- não bloqueie event loop com código síncrono pesado.

---

## Bots com slack-sdk

Instalação:

```bash
pip install slack-sdk
```

Exemplo:

```python
from slack_sdk import WebClient


def enviar_alerta(token: str, canal: str, texto: str) -> None:
    client = WebClient(token=token)
    client.chat_postMessage(channel=canal, text=texto)
```

Use Slack para alertas, aprovações, comandos operacionais e integração com workflows.

---

## Segurança em Bots

- Guarde tokens em variáveis de ambiente ou secret manager.
- Restrinja comandos por usuário, canal ou role.
- Valide payloads.
- Faça rate limiting.
- Registre auditoria de ações sensíveis.
- Evite expor dados pessoais em canais públicos.
- Tenha comando de healthcheck.

---

## Planilhas com openpyxl

`openpyxl` manipula `.xlsx` sem depender do Excel instalado.

```python
from openpyxl import Workbook

wb = Workbook()
ws = wb.active
ws["A1"] = "Produto"
ws["B1"] = "Total"
ws.append(["Curso", 100])
wb.save("relatorio.xlsx")
```

Use para:

- gerar relatórios Excel;
- aplicar estilos;
- criar abas;
- inserir fórmulas;
- ler planilhas `.xlsx`.

---

## Planilhas com xlwings

`xlwings` automatiza Excel instalado e interage com workbooks reais.

```bash
pip install xlwings
```

Exemplo:

```python
import xlwings as xw

app = xw.App(visible=False)
book = app.books.open("modelo.xlsx")
sheet = book.sheets["Dados"]
sheet.range("A1").value = "Atualizado"
book.save("saida.xlsx")
book.close()
app.quit()
```

Use `xlwings` quando precisa de:

- macros;
- fórmulas calculadas pelo Excel;
- modelos corporativos;
- interação com Excel desktop.

Evite em servidores sem Excel ou em ambientes Linux sem suporte adequado.

---

## Google Sheets API

Google Sheets pode ser acessado por bibliotecas como `gspread` ou diretamente pela Google Sheets API.

Com `gspread`:

```bash
pip install gspread google-auth
```

```python
import gspread
from google.oauth2.service_account import Credentials


def abrir_sheet(spreadsheet_id: str):
    scopes = ["https://www.googleapis.com/auth/spreadsheets"]
    creds = Credentials.from_service_account_file("service-account.json", scopes=scopes)
    client = gspread.authorize(creds)
    return client.open_by_key(spreadsheet_id)
```

Com Google Sheets API oficial:

```bash
pip install google-api-python-client google-auth
```

```python
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build


def criar_servico():
    scopes = ["https://www.googleapis.com/auth/spreadsheets"]
    creds = Credentials.from_service_account_file("service-account.json", scopes=scopes)
    return build("sheets", "v4", credentials=creds)
```

Boas práticas:

- compartilhe a planilha com a service account;
- proteja o JSON de credenciais;
- use escopos mínimos;
- trate quotas e retries;
- valide dados antes de escrever;
- mantenha logs de alterações automatizadas.

---

## Checklist

- Sei escolher entre BeautifulSoup, Scrapy, Selenium e Playwright.
- Sei usar Playwright quando a página depende de JavaScript.
- Sei usar PyAutoGUI, pynput e keyboard com cuidado operacional.
- Bots protegem tokens e restringem comandos?
- Sei criar bot com python-telegram-bot, discord.py ou slack-sdk?
- Sei gerar `.xlsx` com openpyxl?
- Sei quando xlwings é necessário?
- Sei acessar Google Sheets com service account e escopos mínimos?
- A automação tem logs, retries, screenshots ou evidências de erro?
