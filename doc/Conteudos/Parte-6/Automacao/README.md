# Automação e Scripts com Python

Trilha completa e profissional para criar automações com Python: tarefas locais, scripts, CLI, web scraping, bots, Selenium, Playwright, BeautifulSoup, Scrapy, automação desktop, planilhas e agendamentos com `cron` e `schedule`.

Automação profissional não é apenas "fazer um script funcionar". É construir processos repetíveis, observáveis, seguros, tolerantes a erro e fáceis de manter.

---

## Arquivos da Trilha

1. [Automação de Tarefas e Scripts Profissionais](./01_automacao_tarefas_scripts.md)
2. [Web Scraping Profissional](./02_web_scraping_profissional.md)
3. [Bots com Python](./03_bots_python.md)
4. [Selenium: Navegadores, Testes e RPA Web](./04_selenium_rpa_web.md)
5. [BeautifulSoup: Parsing HTML e Extração de Dados](./05_beautifulsoup_parsing.md)
6. [Scrapy: Crawlers Profissionais e Pipelines](./06_scrapy_crawlers_pipelines.md)
7. [Automação Desktop e RPA Local](./07_automacao_desktop_rpa.md)
8. [Automação de Planilhas com Excel, CSV e Google Sheets](./08_automacao_planilhas.md)
9. [Agendamentos com cron, schedule, APScheduler e Produção](./09_agendamentos_cron_schedule.md)
10. [CLI Moderna: argparse, Click, Typer, Rich e Textual](./10_cli_moderna_click_typer_rich_textual.md)
11. [Playwright, Bots, Desktop e Planilhas Avançadas](./11_playwright_bots_desktop_sheets.md)

---

## Competências Esperadas

Ao concluir esta trilha, você deve saber:

- transformar tarefas manuais em scripts confiáveis;
- organizar automações como projetos profissionais;
- criar CLIs com `argparse`, Click, Typer, Rich e Textual;
- lidar com arquivos, APIs, páginas web, planilhas e sistemas desktop;
- extrair dados com `requests`, `BeautifulSoup`, Scrapy, Selenium e Playwright;
- criar bots com `python-telegram-bot`, `discord.py` e `slack-sdk`;
- automatizar Excel, CSV, Google Sheets, `openpyxl`, `xlwings` e Google Sheets API;
- automatizar desktop com PyAutoGUI, `pynput` e `keyboard`;
- agendar rotinas com `cron`, `schedule` e APScheduler;
- registrar logs, tratar erros e monitorar execuções;
- respeitar segurança, privacidade, autenticação e limites legais;
- empacotar e executar automações em ambiente local, servidor ou container.

---

## Estrutura Recomendada de Projeto

```text
automacao-vendas/
├── pyproject.toml
├── README.md
├── .env.example
├── src/
│   └── automacao_vendas/
│       ├── __init__.py
│       ├── config.py
│       ├── logging_config.py
│       ├── main.py
│       ├── coleta/
│       ├── processamento/
│       ├── saida/
│       └── utils/
├── tests/
├── data/
│   ├── input/
│   ├── output/
│   └── temp/
└── logs/
```

---

## Bibliotecas Principais

```bash
pip install requests beautifulsoup4 lxml selenium scrapy playwright pandas openpyxl xlwings pyautogui pynput keyboard schedule apscheduler python-dotenv tenacity structlog click typer rich textual python-telegram-bot discord.py slack-sdk gspread google-auth google-api-python-client
```

Use apenas as dependências necessárias para cada projeto. Uma automação pequena pode usar somente a biblioteca padrão; uma automação corporativa pode precisar de logs estruturados, retry, métricas, filas e containers.

---

## Cobertura dos Conceitos Solicitados

| Conceito | Onde estudar |
|---|---|
| Automação, scripts e CLI | [01](./01_automacao_tarefas_scripts.md), [10](./10_cli_moderna_click_typer_rich_textual.md) |
| Click, Typer, argparse, Rich e Textual | [01](./01_automacao_tarefas_scripts.md), [10](./10_cli_moderna_click_typer_rich_textual.md) |
| Web scraping com BeautifulSoup, Scrapy, Selenium e Playwright | [02](./02_web_scraping_profissional.md), [04](./04_selenium_rpa_web.md), [05](./05_beautifulsoup_parsing.md), [06](./06_scrapy_crawlers_pipelines.md), [11](./11_playwright_bots_desktop_sheets.md) |
| Automação desktop com PyAutoGUI, pynput e keyboard | [07](./07_automacao_desktop_rpa.md), [11](./11_playwright_bots_desktop_sheets.md) |
| Bots com python-telegram-bot, discord.py e slack-sdk | [03](./03_bots_python.md), [11](./11_playwright_bots_desktop_sheets.md) |
| Planilhas com openpyxl, xlwings e Google Sheets API | [08](./08_automacao_planilhas.md), [11](./11_playwright_bots_desktop_sheets.md) |
