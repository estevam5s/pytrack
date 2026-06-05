# Bots com Python

Bot é um programa que executa ações automaticamente em resposta a eventos, comandos, mensagens, horários ou dados externos. Bots podem operar em chats, e-mails, APIs, sistemas internos, filas, ERPs, CRMs e painéis administrativos.

Um bot profissional precisa ter escopo claro, controle de permissões, logs, limites de uso, tratamento de erro e proteção contra comandos perigosos.

---

## Tipos de Bots

- **Chatbots**: respondem mensagens no Telegram, Discord, Slack ou WhatsApp via provedor.
- **Bots operacionais**: consultam APIs, abrem tickets, atualizam planilhas.
- **Bots de monitoramento**: verificam sistemas e enviam alertas.
- **Bots de coleta**: executam scraping ou consultas periódicas.
- **Bots internos**: automatizam rotinas de equipes.

---

## Arquitetura Básica

```text
Evento/Comando
    -> Validação
    -> Autorização
    -> Execução da ação
    -> Persistência opcional
    -> Resposta ao usuário
    -> Log e métrica
```

Separe a camada de plataforma da regra de negócio. O código que calcula um relatório não deve depender diretamente do Telegram ou Slack.

---

## Bot Simples de Linha de Comando

```python
from datetime import datetime


def responder(comando: str) -> str:
    comando = comando.strip().lower()

    if comando == "hora":
        return datetime.now().strftime("%H:%M:%S")
    if comando == "ajuda":
        return "Comandos: hora, ajuda, sair"
    return "Comando desconhecido"


def main() -> None:
    while True:
        comando = input("> ")
        if comando == "sair":
            break
        print(responder(comando))


if __name__ == "__main__":
    main()
```

Esse exemplo é simples, mas já mostra a ideia: entrada, roteamento e resposta.

---

## Roteador de Comandos

```python
from collections.abc import Callable


Handler = Callable[[list[str]], str]


class Bot:
    def __init__(self) -> None:
        self.comandos: dict[str, Handler] = {}

    def comando(self, nome: str) -> Callable[[Handler], Handler]:
        def decorator(func: Handler) -> Handler:
            self.comandos[nome] = func
            return func
        return decorator

    def executar(self, texto: str) -> str:
        partes = texto.split()
        if not partes:
            return "Digite um comando."

        nome, *args = partes
        handler = self.comandos.get(nome)
        if not handler:
            return f"Comando desconhecido: {nome}"
        return handler(args)


bot = Bot()


@bot.comando("somar")
def somar(args: list[str]) -> str:
    numeros = [float(arg) for arg in args]
    return str(sum(numeros))


@bot.comando("ping")
def ping(args: list[str]) -> str:
    return "pong"
```

---

## Bot de Monitoramento com Requests

```python
import logging
import requests


logger = logging.getLogger("monitor")


def verificar_url(url: str) -> tuple[bool, str]:
    try:
        resposta = requests.get(url, timeout=10)
        if resposta.status_code >= 500:
            return False, f"Servidor com erro {resposta.status_code}"
        return True, f"OK {resposta.status_code}"
    except requests.RequestException as exc:
        logger.exception("Falha ao verificar %s", url)
        return False, str(exc)


def enviar_alerta(mensagem: str) -> None:
    print(f"ALERTA: {mensagem}")


def main() -> None:
    ok, detalhe = verificar_url("https://example.com")
    if not ok:
        enviar_alerta(f"Site indisponível: {detalhe}")


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    main()
```

---

## Bot Telegram com `python-telegram-bot`

Instalação:

```bash
pip install python-telegram-bot
```

Exemplo:

```python
import os
from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await update.message.reply_text("Bot online. Use /status.")


async def status(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await update.message.reply_text("Tudo operacional.")


def main() -> None:
    token = os.environ["TELEGRAM_BOT_TOKEN"]
    app = Application.builder().token(token).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("status", status))
    app.run_polling()


if __name__ == "__main__":
    main()
```

Boas práticas:

- use variáveis de ambiente para token;
- valide `chat_id` ou usuário autorizado;
- limite comandos administrativos;
- registre logs de comando, usuário e resultado;
- não exponha dados sensíveis na resposta.

---

## Autorização Simples

```python
USUARIOS_AUTORIZADOS = {123456789, 987654321}


def usuario_autorizado(user_id: int) -> bool:
    return user_id in USUARIOS_AUTORIZADOS
```

Em sistemas reais, permissões podem vir de banco, LDAP, IAM, arquivo assinado ou painel administrativo.

---

## Bot com Fila de Tarefas

Para ações demoradas, não bloqueie a resposta ao usuário. Enfileire o trabalho.

```python
from queue import Queue
from threading import Thread
import time


fila: Queue[str] = Queue()


def worker() -> None:
    while True:
        tarefa = fila.get()
        try:
            print(f"Executando {tarefa}")
            time.sleep(5)
        finally:
            fila.task_done()


Thread(target=worker, daemon=True).start()


def receber_comando(texto: str) -> str:
    fila.put(texto)
    return "Tarefa recebida e será processada em segundo plano."
```

Para produção, use Redis Queue, Celery, Dramatiq, RabbitMQ ou SQS.

---

## Projeto Completo: Bot Operacional Modular

```python
from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
import logging


logger = logging.getLogger("bot_operacional")


@dataclass
class Usuario:
    id: int
    nome: str
    admin: bool = False


class PermissaoNegada(Exception):
    pass


class ServicoRelatorio:
    def gerar_resumo(self) -> str:
        agora = datetime.now().strftime("%d/%m/%Y %H:%M")
        return f"Resumo gerado em {agora}: 42 pedidos processados."


class BotOperacional:
    def __init__(self, relatorios: ServicoRelatorio) -> None:
        self.relatorios = relatorios

    def executar(self, usuario: Usuario, comando: str) -> str:
        logger.info("Comando recebido: usuario=%s comando=%s", usuario.id, comando)

        if comando == "status":
            return "Sistema online."

        if comando == "relatorio":
            self._exigir_admin(usuario)
            return self.relatorios.gerar_resumo()

        return "Comando não reconhecido."

    def _exigir_admin(self, usuario: Usuario) -> None:
        if not usuario.admin:
            raise PermissaoNegada("Usuário sem permissão para esta ação.")


def main() -> None:
    logging.basicConfig(level=logging.INFO)
    bot = BotOperacional(ServicoRelatorio())
    usuario = Usuario(id=1, nome="Ana", admin=True)
    print(bot.executar(usuario, "relatorio"))


if __name__ == "__main__":
    main()
```

---

## Checklist de Segurança para Bots

- Tokens ficam fora do código?
- Há controle de usuários autorizados?
- Comandos destrutivos exigem confirmação?
- O bot limita frequência por usuário?
- Logs não gravam senhas ou documentos?
- Erros internos não são enviados integralmente ao usuário?
- Ações demoradas rodam em background?
- Há timeout para chamadas externas?
- O bot pode ser desligado com segurança?

