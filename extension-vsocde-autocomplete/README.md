<div align="center">

# ⚡ PyTrack Autocomplete

### Autocomplete profissional de **Python** + criação de **28 tipos de projeto**

[![Version](https://img.shields.io/visual-studio-marketplace/v/EstevamSouza.pytrack-autocomplete?color=8257E5&label=Marketplace)](https://marketplace.visualstudio.com/items?itemName=EstevamSouza.pytrack-autocomplete)
[![License: MIT](https://img.shields.io/badge/License-MIT-9956F6.svg)](./LICENSE)

**Exclusivo do plano Completo (R$19)** da [PyTrack](https://www.pytrack.com.br).

</div>

---

## ✨ O que ela faz

### 1. 🧠 Autocomplete de Python — completo e contextual

Sugestões inteligentes para **todo o Python**, ativadas automaticamente ao abrir um arquivo `.py`:

- **Palavras-chave** da linguagem (`def`, `class`, `async`, `match`, `await`, `yield`…).
- **Builtins** — 70+ funções e tipos (`print`, `len`, `enumerate`, `zip`, `sorted`, `map`, `filter`, `isinstance`…), com **assinatura e descrição** ao lado.
- **Biblioteca padrão** — 25+ módulos (`os`, `sys`, `json`, `datetime`, `pathlib`, `collections`, `itertools`, `functools`, `re`, `math`, `random`, `typing`, `asyncio`, `subprocess`, `logging`, `dataclasses`, `enum`, `hashlib`, `csv`, `shutil`, `uuid`, `base64`…).
- **Membros de módulo** com **reconhecimento de contexto**: digite `os.` e veja `getcwd`, `listdir`, `path`, `environ`…; digite `json.` e veja `loads`, `dumps`…
- **`import` inteligente**: ao escrever `import ` ou `from `, a extensão sugere os módulos disponíveis.
- **Snippets profissionais** (20+): `main`, `class`, `dataclass`, `def`, `adef` (async), `try`, `with`, `prop`, `ctx` (context manager), `test`, `fixture`, `enum`, `typeddict`, comprehensions e mais — com **tab stops** para preencher rápido.

> Funciona junto com o Pylance: a PyTrack adiciona snippets e dicas do ecossistema; o Pylance cuida da análise de tipos do seu código.

### 2. 🏗️ Criar projetos — 28 tipos prontos

Comando **`PyTrack: Criar novo projeto Python…`** (paleta `Ctrl+Shift+P` / `⌘⇧P`). Escolha o tipo, dê um nome e pronto — os arquivos são criados com **conteúdo real**, não stubs:

| Categoria | Tipos de projeto |
|-----------|------------------|
| **API / Web** | FastAPI, FastAPI estruturado, Flask, Django, GraphQL (Strawberry), WebSocket, Cliente HTTP (httpx) |
| **CLI** | Typer, argparse |
| **Dados / IA** | Data Science (pandas), Machine Learning (scikit-learn), RAG com LLM, Streamlit, ETL, Notebook Jupyter |
| **Backend / BD** | Pydantic + Settings, SQLAlchemy 2.0 |
| **Bots** | Telegram, Discord |
| **Automação** | Web Scraping, Script de automação |
| **Fundamentos** | POO (classes, ABC, dataclasses) |
| **Biblioteca** | Pacote PyPI (pyproject) |
| **Qualidade** | Testes com pytest |
| **Performance** | Assíncrono (asyncio) |
| **Jogos / Desktop** | pygame, tkinter |
| **DevOps** | Microsserviço (FastAPI + Docker) |

Cada projeto vem com `requirements.txt`, `.gitignore`, `README.md` e o arquivo principal já aberto.

---

## 🔐 Plano necessário

Esta extensão é **exclusiva do plano Completo (R$19/mês)** ou superior (Suprema, Vitalício). Ela verifica seu plano com segurança através da sua conta PyTrack.

### Como ativar
1. Instale a extensão.
2. Abra a paleta de comandos e rode **`PyTrack Autocomplete: Entrar`**.
3. Informe o **e-mail e a senha** da sua conta PyTrack.
4. Pronto — o status na barra inferior mostra **`⚡ PyTrack Pro`**.

> 🔒 **Segurança:** seu token de sessão fica no **SecretStorage** do VS Code (keychain do sistema) — nunca em texto puro. A extensão só conversa com `www.pytrack.com.br` para verificar o plano.

Ainda não tem o plano Completo? [Assine aqui](https://www.pytrack.com.br/assinar).

---

## 🚀 Instalação

```bash
code --install-extension EstevamSouza.pytrack-autocomplete
# ou pelo arquivo:
code --install-extension pytrack-autocomplete-1.0.0.vsix
```

---

## ⌨️ Comandos

| Comando | O que faz |
|---------|-----------|
| **PyTrack: Criar novo projeto Python…** | Abre o seletor com os 28 tipos de projeto. |
| **PyTrack Autocomplete: Entrar** | Login + verificação do plano Completo. |
| **PyTrack Autocomplete: Status do plano** | Mostra seu plano e o estado do autocomplete. |
| **PyTrack Autocomplete: Sair** | Remove o token e desativa o autocomplete. |

---

## ⚙️ Configurações

| Configuração | Padrão | Descrição |
|--------------|--------|-----------|
| `pytrackAutocomplete.enableCompletions` | `true` | Liga/desliga o autocomplete de Python. |
| `pytrackAutocomplete.apiBaseUrl` | `https://www.pytrack.com.br` | URL base da API (para ambientes de teste). |

---

## ❓ FAQ

**O autocomplete substitui o Pylance?**
Não — ele **complementa**. A PyTrack foca em snippets do ecossistema, builtins documentados e criação de projetos. Mantenha o Pylance para análise de tipos.

**Funciona offline?**
O autocomplete funciona offline depois de logado (a verificação de plano é cacheada). A criação de projetos é 100% local.

**Por que pede login?**
Porque a extensão é um benefício do plano **Completo**. O login confirma seu plano com segurança.

---

## 🔗 Ecossistema PyTrack

- 🌐 [Plataforma](https://www.pytrack.com.br) — trilhas, +5.000 exercícios, IDE no navegador, IA.
- 🎨 **PyTrack Themes** (grátis) — 5 temas para Python.
- 🧩 **PyTrack** (Suprema) — projetos, aulas, exercícios e IA dentro do editor.

---

<div align="center">

Feito com 🐍 e 💜 pela **PyTrack** · [Suporte](https://www.pytrack.com.br/contato)

</div>
