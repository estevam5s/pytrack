# Automação Desktop e RPA Local

Automação desktop controla aplicações locais: teclado, mouse, janelas, arquivos, menus e sistemas legados. É útil quando não existe API, integração ou acesso direto ao banco.

Esse tipo de automação é poderoso, mas frágil. Mudanças de resolução, idioma, tema, posição da janela ou lentidão podem quebrar o fluxo. Use como último recurso quando integrações mais estáveis não estão disponíveis.

---

## Ferramentas

- `pyautogui`: mouse, teclado, screenshots e imagens.
- `pyperclip`: área de transferência.
- `subprocess`: abrir programas e comandos.
- `pathlib` e `shutil`: arquivos e pastas.
- `pynput`: eventos de teclado/mouse.
- `pywinauto`: automação Windows mais estruturada.
- AppleScript/osascript: automações específicas no macOS.

---

## Instalação

```bash
pip install pyautogui pyperclip pillow
```

No macOS, pode ser necessário liberar permissões de Acessibilidade e Gravação de Tela para o terminal ou IDE.

---

## Mouse e Teclado

```python
import pyautogui
import time


pyautogui.hotkey("command", "space")
time.sleep(0.5)
pyautogui.write("Calculadora", interval=0.02)
pyautogui.press("enter")
```

No Windows, troque `command` por `win` ou `ctrl` conforme o caso.

---

## Fail-safe

```python
import pyautogui


pyautogui.FAILSAFE = True
pyautogui.PAUSE = 0.2
```

Com `FAILSAFE = True`, mover o mouse para o canto superior esquerdo interrompe a automação.

---

## Usando Área de Transferência

Digitar textos longos com `write` pode falhar com caracteres especiais. Use clipboard.

```python
import pyautogui
import pyperclip


def colar_texto(texto: str) -> None:
    pyperclip.copy(texto)
    pyautogui.hotkey("command", "v")
```

---

## Localização por Imagem

```python
import pyautogui


posicao = pyautogui.locateCenterOnScreen("assets/botao_salvar.png", confidence=0.8)
if posicao is None:
    raise RuntimeError("Botão salvar não encontrado")

pyautogui.click(posicao)
```

Cuidados:

- imagem precisa estar na mesma escala;
- tema claro/escuro pode alterar pixels;
- use região da tela quando possível;
- tenha fallback e screenshot em erro.

---

## Abrindo Programas

```python
import subprocess
from pathlib import Path


def abrir_arquivo(caminho: Path) -> None:
    subprocess.run(["open", str(caminho)], check=True)  # macOS
```

Windows:

```python
import os

os.startfile("relatorio.xlsx")
```

Linux:

```python
subprocess.run(["xdg-open", "relatorio.xlsx"], check=True)
```

---

## Espera por Janela ou Imagem

```python
import time
import pyautogui


def esperar_imagem(caminho: str, timeout: int = 20):
    limite = time.time() + timeout
    while time.time() < limite:
        posicao = pyautogui.locateCenterOnScreen(caminho, confidence=0.8)
        if posicao:
            return posicao
        time.sleep(0.5)
    raise TimeoutError(f"Imagem não encontrada: {caminho}")
```

---

## Projeto Completo: Preencher Sistema Legado

```python
from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
import csv
import logging
import time

import pyautogui
import pyperclip


logger = logging.getLogger("rpa_desktop")
pyautogui.FAILSAFE = True
pyautogui.PAUSE = 0.15


@dataclass
class Cliente:
    nome: str
    documento: str
    email: str


def carregar_clientes(caminho: Path) -> list[Cliente]:
    with caminho.open(newline="", encoding="utf-8") as arquivo:
        return [Cliente(**linha) for linha in csv.DictReader(arquivo)]


def colar(texto: str) -> None:
    pyperclip.copy(texto)
    pyautogui.hotkey("command", "v")


def clicar_imagem(imagem: str, timeout: int = 20) -> None:
    limite = time.time() + timeout
    while time.time() < limite:
        pos = pyautogui.locateCenterOnScreen(imagem, confidence=0.8)
        if pos:
            pyautogui.click(pos)
            return
        time.sleep(0.5)
    raise TimeoutError(f"Não encontrou {imagem}")


def preencher_cliente(cliente: Cliente) -> None:
    clicar_imagem("assets/campo_nome.png")
    colar(cliente.nome)
    pyautogui.press("tab")
    colar(cliente.documento)
    pyautogui.press("tab")
    colar(cliente.email)
    clicar_imagem("assets/botao_salvar.png")
    clicar_imagem("assets/mensagem_sucesso.png", timeout=30)


def main() -> None:
    logging.basicConfig(level=logging.INFO)
    clientes = carregar_clientes(Path("data/input/clientes.csv"))

    for cliente in clientes:
        try:
            logger.info("Cadastrando %s", cliente.documento)
            preencher_cliente(cliente)
        except Exception:
            pyautogui.screenshot("logs/falha_desktop.png")
            logger.exception("Falha ao cadastrar %s", cliente.documento)


if __name__ == "__main__":
    main()
```

---

## Estratégias para Reduzir Fragilidade

- use API ou banco antes de tela;
- fixe resolução e escala;
- maximize janelas;
- use imagens pequenas e específicas;
- crie checkpoints;
- tire screenshots em falhas;
- processe item por item com log;
- tenha arquivo de reprocessamento;
- evite depender de coordenadas absolutas;
- use clipboard para texto;
- valide sucesso após cada ação.

---

## Checklist de Segurança

- Existe botão de parada ou fail-safe?
- A automação não clica em locais perigosos sem confirmação?
- Há backup antes de alterações em massa?
- O usuário sabe que não deve usar mouse/teclado durante a execução?
- Logs indicam qual registro falhou?
- Há modo de teste com poucos registros?

