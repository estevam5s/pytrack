# Selenium: Navegadores, Testes e RPA Web

Selenium controla navegadores reais. Ele é útil para automação web quando a página depende de JavaScript, autenticação, cliques, uploads, downloads, componentes dinâmicos ou fluxos que não podem ser resolvidos com `requests`.

Use Selenium com critério. Ele é mais lento e frágil do que consumir APIs ou baixar HTML diretamente. Em RPA web, a estabilidade depende de bons seletores, esperas explícitas, logs, screenshots e tratamento de erro.

---

## Instalação

```bash
pip install selenium
```

Versões modernas do Selenium usam Selenium Manager para localizar/baixar drivers quando possível.

---

## Primeiro Script

```python
from selenium import webdriver
from selenium.webdriver.common.by import By


driver = webdriver.Chrome()
try:
    driver.get("https://example.com")
    titulo = driver.find_element(By.TAG_NAME, "h1").text
    print(titulo)
finally:
    driver.quit()
```

Sempre chame `quit()` para fechar o navegador e liberar recursos.

---

## Esperas Explícitas

Evite depender de `time.sleep` como solução principal. Use `WebDriverWait`.

```python
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


def esperar_visivel(driver, seletor_css: str, timeout: int = 20):
    return WebDriverWait(driver, timeout).until(
        EC.visibility_of_element_located((By.CSS_SELECTOR, seletor_css))
    )
```

Condições úteis:

- `presence_of_element_located`;
- `visibility_of_element_located`;
- `element_to_be_clickable`;
- `url_contains`;
- `text_to_be_present_in_element`.

---

## Login com Selenium

```python
import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


def login(driver: webdriver.Chrome) -> None:
    driver.get("https://sistema.exemplo.com/login")
    wait = WebDriverWait(driver, 20)

    email = wait.until(EC.visibility_of_element_located((By.NAME, "email")))
    senha = driver.find_element(By.NAME, "password")

    email.send_keys(os.environ["SISTEMA_EMAIL"])
    senha.send_keys(os.environ["SISTEMA_SENHA"])
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

    wait.until(EC.url_contains("/dashboard"))
```

Nunca salve credenciais no código.

---

## Seletores Bons e Ruins

Bons seletores:

- `data-testid`;
- `data-automation`;
- `id` estável;
- `name` de campo;
- texto acessível quando estável.

Seletores frágeis:

- classes geradas por framework;
- XPath absoluto;
- posição visual;
- texto que muda por idioma;
- elementos muito genéricos.

Exemplo:

```python
driver.find_element(By.CSS_SELECTOR, "[data-testid='botao-salvar']").click()
```

---

## Preenchendo Formulários

```python
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select


def preencher_cliente(driver, cliente: dict[str, str]) -> None:
    driver.find_element(By.NAME, "nome").send_keys(cliente["nome"])
    driver.find_element(By.NAME, "email").send_keys(cliente["email"])

    select_estado = Select(driver.find_element(By.NAME, "estado"))
    select_estado.select_by_value(cliente["estado"])

    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
```

---

## Download de Arquivos

```python
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options


def criar_driver_download(pasta_download: Path) -> webdriver.Chrome:
    pasta_download.mkdir(parents=True, exist_ok=True)
    options = Options()
    options.add_experimental_option("prefs", {
        "download.default_directory": str(pasta_download.resolve()),
        "download.prompt_for_download": False,
        "download.directory_upgrade": True,
    })
    return webdriver.Chrome(options=options)
```

Para confirmar download, verifique se o arquivo apareceu e se não existe extensão temporária como `.crdownload`.

---

## Headless

```python
from selenium.webdriver.chrome.options import Options


options = Options()
options.add_argument("--headless=new")
options.add_argument("--window-size=1366,768")
driver = webdriver.Chrome(options=options)
```

Mesmo em headless, defina tamanho de janela para reduzir diferenças de layout.

---

## Screenshots em Falhas

```python
from pathlib import Path
from datetime import datetime


def screenshot_falha(driver, nome: str) -> Path:
    pasta = Path("logs/screenshots")
    pasta.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    caminho = pasta / f"{timestamp}_{nome}.png"
    driver.save_screenshot(str(caminho))
    return caminho
```

Screenshots são essenciais para debugar automações que falham em produção.

---

## Projeto Completo: Baixar Relatório de um Sistema

```python
from __future__ import annotations

from pathlib import Path
import os
import time
import logging

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


logger = logging.getLogger("baixar_relatorio")


def criar_driver(download_dir: Path) -> webdriver.Chrome:
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--window-size=1366,768")
    options.add_experimental_option("prefs", {
        "download.default_directory": str(download_dir.resolve()),
        "download.prompt_for_download": False,
    })
    return webdriver.Chrome(options=options)


def aguardar_download(download_dir: Path, timeout: int = 60) -> Path:
    limite = time.time() + timeout
    while time.time() < limite:
        arquivos = list(download_dir.glob("*.xlsx"))
        temporarios = list(download_dir.glob("*.crdownload"))
        if arquivos and not temporarios:
            return max(arquivos, key=lambda p: p.stat().st_mtime)
        time.sleep(1)
    raise TimeoutError("Download não finalizou dentro do prazo")


def executar() -> Path:
    download_dir = Path("data/downloads")
    download_dir.mkdir(parents=True, exist_ok=True)
    driver = criar_driver(download_dir)
    wait = WebDriverWait(driver, 30)

    try:
        driver.get(os.environ["URL_SISTEMA"])
        wait.until(EC.visibility_of_element_located((By.NAME, "email"))).send_keys(os.environ["EMAIL"])
        driver.find_element(By.NAME, "password").send_keys(os.environ["SENHA"])
        driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

        wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-testid='menu-relatorios']"))).click()
        wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-testid='exportar-xlsx']"))).click()

        arquivo = aguardar_download(download_dir)
        logger.info("Relatório baixado: %s", arquivo)
        return arquivo
    except Exception:
        driver.save_screenshot("logs/falha_selenium.png")
        raise
    finally:
        driver.quit()


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    executar()
```

---

## Boas Práticas

- prefira APIs quando disponíveis;
- use seletores estáveis;
- use esperas explícitas;
- tire screenshots em falhas;
- rode em janela com tamanho fixo;
- mantenha credenciais em variáveis de ambiente;
- não use Selenium para scraping massivo;
- isole ações de página em funções ou classes;
- crie testes pequenos para parsing e regras de negócio;
- monitore tempo de execução e falhas recorrentes.

