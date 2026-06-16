<div align="center">

<img src="https://www.pytrack.com.br/new-logo.png" width="96" alt="PyTrack" />

# PyTrack — Python na sua IDE

**Sua plataforma de Python dentro do VS Code.** Gerencie sua assinatura, importe projetos, aulas e exercícios, use snippets de todo o ecossistema Python, instale pacotes e conte com uma IA para programar — sem sair do editor.

[![Plataforma](https://img.shields.io/badge/PyTrack-www.pytrack.com.br-5F75F2)](https://www.pytrack.com.br)
[![Plano](https://img.shields.io/badge/Exclusivo-Plano%20Suprema-9956F6)](https://www.pytrack.com.br/precos)

</div>

---

## ✨ O que a extensão faz

| Recurso | Descrição |
|--------|-----------|
| 🔐 **Login** | Entre com a sua conta PyTrack (apenas login — o cadastro é feito no site). |
| 📊 **Dashboard completo** | Painel com plano, XP, nível, projetos, aulas e exercícios — tudo num lugar. |
| 💳 **Assinatura** | Veja seu plano, status e data de renovação; gerencie com um clique. |
| 📦 **Importar projetos** | Traga os projetos do seu plano para o seu workspace, prontos para codar. |
| 📚 **Aulas** | Acesse os módulos e conteúdos do seu plano direto da barra lateral. |
| ✅ **Exercícios** | Navegue pelos +5.000 exercícios, busque e abra como arquivo para resolver. |
| 🎯 **Desafio do dia** | Um exercício novo a cada dia para manter o ritmo. |
| 🧩 **Snippets** | +50 snippets de todo o ecossistema Python (FastAPI, pandas, pytest, async, SQLAlchemy…). |
| 🔀 **Sintaxe por versão** | Veja como o mesmo código muda do Python 3.0 ao 3.13. |
| ▶️ **Rodar & formatar** | Rode o arquivo, crie venv, gere `requirements.txt` e formate com Ruff. |
| ⬇️ **Instalar pacotes** | Instale pacotes pip pela paleta, sem decorar comandos. |
| 🤖 **IA (sua chave)** | Explique, refatore, gere testes e docstrings. Use **a sua própria chave** (OpenAI, OpenRouter, Anthropic, NVIDIA ou custom). |
| 🚪 **Sair da conta** | Botão de logout seguro a qualquer momento. |

> ⚠️ **Exclusivo do plano [Suprema (R$46)](https://www.pytrack.com.br/precos).** Apenas assinantes Suprema conseguem fazer login na extensão — outros planos verão um aviso para fazer upgrade.

---

## 🚀 Começando

1. Instale a extensão **PyTrack** no VS Code.
2. Clique no ícone da PyTrack na barra de atividades (lateral esquerda).
3. **Entrar** → informe e-mail e senha da sua conta PyTrack.
4. Pronto! Seus projetos, aulas e exercícios aparecem na barra lateral.

Ainda não tem conta? **[Crie a sua em www.pytrack.com.br](https://www.pytrack.com.br)** e assine o plano Suprema.

---

## 🤖 Configurando a IA (sua chave)

A extensão **não cobra tokens de IA** — você usa a **sua própria chave**, com total controle de custo e privacidade.

1. Paleta de comandos (`Ctrl/Cmd+Shift+P`) → **PyTrack: Configurar IA**.
2. Escolha o **provedor** (OpenAI, OpenRouter, Anthropic, NVIDIA ou custom).
3. Informe o **modelo** (ex.: `gpt-4o-mini`, `claude-3-5-sonnet-latest`, `meta/llama-3.3-70b-instruct`).
4. Cole a sua **chave de API** — ela é guardada com segurança no **SecretStorage** do VS Code (nunca sai do seu computador, exceto para o provedor que você escolheu).

Depois, selecione um trecho de código e rode **PyTrack: Assistente de IA** para explicar, refatorar ou gerar código.

---

## 🧩 Snippets incluídos

Digite o prefixo e pressione `Tab`:

`pymain` · `pyfn` · `pyasync` · `pyclass` · `pydataclass` · `pypydantic` · `pyfastapi` · `pyroute` ·
`pytest` · `pyfixture` · `pyparam` · `pytry` · `pyctx` · `pydecorator` · `pylog` · `pyargparse` ·
`pytyper` · `pyopen` · `pyjson` · `pylc` · `pydc` · `pygen` · `pyenum` · `pytype` · `pyrequests` ·
`pyhttpx` · `pypandas` · `pysqlalchemy` · `pyasyncrun`

---

## ⚙️ Configurações

| Configuração | Padrão | Descrição |
|--------------|--------|-----------|
| `pytrack.apiBaseUrl` | `https://www.pytrack.com.br` | URL base da API da PyTrack. |
| `pytrack.ai.provider` | `openai` | Provedor de IA. |
| `pytrack.ai.model` | `gpt-4o-mini` | Modelo de IA. |
| `pytrack.ai.baseUrl` | `` | URL base (apenas provedor `custom`). |

---

## 🔒 Privacidade & segurança

- Seu **token de sessão** e a **chave de IA** ficam no **SecretStorage** do VS Code (armazenamento seguro do sistema).
- A extensão se comunica **apenas** com a API da PyTrack e com o provedor de IA que **você** configurar.
- Nenhum dado é compartilhado com terceiros.

---

## 📦 Instalação alternativa (.vsix)

Além da Marketplace, assinantes **Suprema** podem baixar o arquivo `.vsix` na
**[página da extensão](https://www.pytrack.com.br/extensao)** e instalar manualmente:

```bash
code --install-extension pytrack-1.0.0.vsix
```

---

## 🛟 Suporte

- 🌐 Plataforma: **[www.pytrack.com.br](https://www.pytrack.com.br)**
- 💬 Contato: **[www.pytrack.com.br/contato](https://www.pytrack.com.br/contato)**

---

<div align="center">

Feito com 🐍 pela **PyTrack** — domine todo o ecossistema Python.

</div>
