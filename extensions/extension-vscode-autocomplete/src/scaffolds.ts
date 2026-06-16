/* 24+ tipos de projeto Python prontos para usar. Cada template define um
 * conjunto de arquivos com conteúdo real (não stubs). */

export interface Template {
  id: string;
  label: string;
  description: string;
  category: string;
  files: Record<string, string>;
}

const GITIGNORE = `__pycache__/\n*.py[cod]\n.venv/\nvenv/\n.env\n*.egg-info/\ndist/\nbuild/\n.pytest_cache/\n.mypy_cache/\n.ruff_cache/\n.coverage\n`;

const readme = (title: string, body: string) =>
  `# ${title}\n\n${body}\n\n## Como rodar\n\n\`\`\`bash\npython -m venv .venv\nsource .venv/bin/activate   # Windows: .venv\\\\Scripts\\\\activate\npip install -r requirements.txt\n\`\`\`\n\n---\n_Gerado pela extensão PyTrack Autocomplete · [pytrack.com.br](https://www.pytrack.com.br)_\n`;

export const TEMPLATES: Template[] = [
  {
    id: "fastapi", label: "API REST — FastAPI", category: "API / Web",
    description: "API moderna com FastAPI, Pydantic e Uvicorn.",
    files: {
      "main.py": `from fastapi import FastAPI\nfrom pydantic import BaseModel\n\napp = FastAPI(title="Minha API")\n\n\nclass Item(BaseModel):\n    nome: str\n    preco: float\n\n\n@app.get("/")\ndef raiz() -> dict[str, str]:\n    return {"status": "ok"}\n\n\n@app.post("/itens")\ndef criar_item(item: Item) -> Item:\n    return item\n\n\n# uvicorn main:app --reload\n`,
      "requirements.txt": "fastapi\nuvicorn[standard]\n",
      ".gitignore": GITIGNORE,
      "README.md": readme("API REST — FastAPI", "API com FastAPI. Rode com `uvicorn main:app --reload` e abra http://localhost:8000/docs."),
    },
  },
  {
    id: "fastapi-full", label: "API REST — FastAPI (estruturado)", category: "API / Web",
    description: "FastAPI com camadas: routers, schemas e services.",
    files: {
      "app/__init__.py": "",
      "app/main.py": `from fastapi import FastAPI\nfrom app.routers import itens\n\napp = FastAPI(title="API estruturada")\napp.include_router(itens.router)\n\n\n@app.get("/health")\ndef health() -> dict[str, str]:\n    return {"status": "ok"}\n`,
      "app/routers/__init__.py": "",
      "app/routers/itens.py": `from fastapi import APIRouter\nfrom app.schemas import Item\nfrom app.services import listar, criar\n\nrouter = APIRouter(prefix="/itens", tags=["itens"])\n\n\n@router.get("")\ndef get_itens() -> list[Item]:\n    return listar()\n\n\n@router.post("")\ndef post_item(item: Item) -> Item:\n    return criar(item)\n`,
      "app/schemas.py": `from pydantic import BaseModel\n\n\nclass Item(BaseModel):\n    id: int\n    nome: str\n`,
      "app/services.py": `from app.schemas import Item\n\n_DB: list[Item] = []\n\n\ndef listar() -> list[Item]:\n    return _DB\n\n\ndef criar(item: Item) -> Item:\n    _DB.append(item)\n    return item\n`,
      "requirements.txt": "fastapi\nuvicorn[standard]\n",
      ".gitignore": GITIGNORE,
      "README.md": readme("API FastAPI estruturada", "Camadas routers/schemas/services. Rode `uvicorn app.main:app --reload`."),
    },
  },
  {
    id: "flask", label: "Web — Flask", category: "API / Web",
    description: "Aplicação web com Flask e templates Jinja2.",
    files: {
      "app.py": `from flask import Flask, jsonify, render_template\n\napp = Flask(__name__)\n\n\n@app.get("/")\ndef home() -> str:\n    return render_template("index.html", titulo="Flask")\n\n\n@app.get("/api/ping")\ndef ping():\n    return jsonify(pong=True)\n\n\nif __name__ == "__main__":\n    app.run(debug=True)\n`,
      "templates/index.html": "<!doctype html>\n<html lang=\"pt-br\">\n<head><meta charset=\"utf-8\"><title>{{ titulo }}</title></head>\n<body><h1>{{ titulo }}</h1></body>\n</html>\n",
      "requirements.txt": "flask\n",
      ".gitignore": GITIGNORE,
      "README.md": readme("Web — Flask", "App Flask com template. Rode `python app.py`."),
    },
  },
  {
    id: "django", label: "Web — Django (mínimo)", category: "API / Web",
    description: "Esqueleto Django com um app inicial.",
    files: {
      "manage.py": `#!/usr/bin/env python\nimport os, sys\n\nif __name__ == "__main__":\n    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")\n    from django.core.management import execute_from_command_line\n    execute_from_command_line(sys.argv)\n`,
      "config/__init__.py": "",
      "config/settings.py": `from pathlib import Path\n\nBASE_DIR = Path(__file__).resolve().parent.parent\nSECRET_KEY = "dev-mude-em-producao"\nDEBUG = True\nALLOWED_HOSTS: list[str] = []\nINSTALLED_APPS = [\n    "django.contrib.contenttypes",\n    "django.contrib.auth",\n    "core",\n]\nROOT_URLCONF = "config.urls"\nDATABASES = {"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": BASE_DIR / "db.sqlite3"}}\nDEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"\n`,
      "config/urls.py": `from django.http import JsonResponse\nfrom django.urls import path\n\n\ndef home(request):\n    return JsonResponse({"status": "ok"})\n\n\nurlpatterns = [path("", home)]\n`,
      "core/__init__.py": "",
      "core/models.py": "from django.db import models\n",
      "requirements.txt": "django\n",
      ".gitignore": GITIGNORE,
      "README.md": readme("Web — Django", "Esqueleto Django. `python manage.py migrate && python manage.py runserver`."),
    },
  },
  {
    id: "cli-typer", label: "CLI — Typer", category: "CLI",
    description: "Aplicativo de linha de comando moderno com Typer + Rich.",
    files: {
      "cli.py": `import typer\nfrom rich import print\n\napp = typer.Typer(help="Minha CLI")\n\n\n@app.command()\ndef ola(nome: str = "mundo") -> None:\n    """Cumprimenta alguém."""\n    print(f"[bold green]Olá, {nome}![/]")\n\n\n@app.command()\ndef somar(a: int, b: int) -> None:\n    """Soma dois números."""\n    print(a + b)\n\n\nif __name__ == "__main__":\n    app()\n`,
      "requirements.txt": "typer\nrich\n",
      ".gitignore": GITIGNORE,
      "README.md": readme("CLI — Typer", "CLI com Typer. Rode `python cli.py ola --nome Ana`."),
    },
  },
  {
    id: "cli-argparse", label: "CLI — argparse (stdlib)", category: "CLI",
    description: "CLI usando só a biblioteca padrão (argparse).",
    files: {
      "cli.py": `import argparse\n\n\ndef main() -> None:\n    parser = argparse.ArgumentParser(description="Minha CLI")\n    parser.add_argument("nome", help="seu nome")\n    parser.add_argument("--maiusculo", action="store_true")\n    args = parser.parse_args()\n    saudacao = f"Olá, {args.nome}!"\n    print(saudacao.upper() if args.maiusculo else saudacao)\n\n\nif __name__ == "__main__":\n    main()\n`,
      ".gitignore": GITIGNORE,
      "README.md": readme("CLI — argparse", "CLI sem dependências. `python cli.py Ana --maiusculo`."),
    },
  },
  {
    id: "oop", label: "POO — Orientação a Objetos", category: "Fundamentos",
    description: "Projeto exemplo de POO: classes, herança, dataclasses e ABC.",
    files: {
      "models.py": `from abc import ABC, abstractmethod\nfrom dataclasses import dataclass\n\n\nclass Forma(ABC):\n    @abstractmethod\n    def area(self) -> float: ...\n\n\n@dataclass\nclass Retangulo(Forma):\n    largura: float\n    altura: float\n\n    def area(self) -> float:\n        return self.largura * self.altura\n\n\n@dataclass\nclass Circulo(Forma):\n    raio: float\n\n    def area(self) -> float:\n        return 3.14159 * self.raio**2\n`,
      "main.py": `from models import Retangulo, Circulo, Forma\n\n\ndef total_area(formas: list[Forma]) -> float:\n    return sum(f.area() for f in formas)\n\n\nif __name__ == "__main__":\n    formas = [Retangulo(3, 4), Circulo(5)]\n    print(f"Área total: {total_area(formas):.2f}")\n`,
      ".gitignore": GITIGNORE,
      "README.md": readme("POO em Python", "Classes abstratas, herança e dataclasses. `python main.py`."),
    },
  },
  {
    id: "package", label: "Pacote PyPI (pyproject)", category: "Biblioteca",
    description: "Biblioteca instalável com pyproject.toml e src layout.",
    files: {
      "pyproject.toml": `[build-system]\nrequires = ["hatchling"]\nbuild-backend = "hatchling.build"\n\n[project]\nname = "meu-pacote"\nversion = "0.1.0"\ndescription = "Minha biblioteca"\nreadme = "README.md"\nrequires-python = ">=3.10"\n\n[tool.ruff]\nline-length = 100\n`,
      "src/meu_pacote/__init__.py": '__version__ = "0.1.0"\n\n\ndef saudacao(nome: str) -> str:\n    return f"Olá, {nome}!"\n',
      "tests/test_basico.py": "from meu_pacote import saudacao\n\n\ndef test_saudacao() -> None:\n    assert saudacao(\"Ana\") == \"Olá, Ana!\"\n",
      ".gitignore": GITIGNORE,
      "README.md": readme("Pacote PyPI", "Biblioteca com src layout. `pip install -e .` e `pytest`."),
    },
  },
  {
    id: "pytest", label: "Testes — pytest", category: "Qualidade",
    description: "Projeto com suíte de testes, fixtures e cobertura.",
    files: {
      "src/calc.py": "def soma(a: float, b: float) -> float:\n    return a + b\n\n\ndef dividir(a: float, b: float) -> float:\n    if b == 0:\n        raise ZeroDivisionError(\"divisão por zero\")\n    return a / b\n",
      "tests/test_calc.py": `import pytest\nfrom src.calc import soma, dividir\n\n\n@pytest.mark.parametrize("a,b,esperado", [(2, 3, 5), (-1, 1, 0)])\ndef test_soma(a, b, esperado) -> None:\n    assert soma(a, b) == esperado\n\n\ndef test_dividir_por_zero() -> None:\n    with pytest.raises(ZeroDivisionError):\n        dividir(1, 0)\n`,
      "pytest.ini": "[pytest]\npythonpath = .\naddopts = -v\n",
      "requirements.txt": "pytest\npytest-cov\n",
      ".gitignore": GITIGNORE,
      "README.md": readme("Testes — pytest", "Suíte com fixtures e parametrização. `pytest --cov=src`."),
    },
  },
  {
    id: "data-science", label: "Data Science — pandas", category: "Dados / IA",
    description: "Análise de dados com pandas e matplotlib.",
    files: {
      "analise.py": `import pandas as pd\n\n\ndef carregar(caminho: str) -> pd.DataFrame:\n    return pd.read_csv(caminho)\n\n\ndef resumo(df: pd.DataFrame) -> pd.DataFrame:\n    return df.describe()\n\n\nif __name__ == "__main__":\n    df = pd.DataFrame({"valor": [10, 20, 30], "grupo": ["a", "b", "a"]})\n    print(df.groupby("grupo")["valor"].sum())\n`,
      "requirements.txt": "pandas\nmatplotlib\njupyter\n",
      ".gitignore": GITIGNORE,
      "README.md": readme("Data Science — pandas", "Análise com pandas. `python analise.py` ou `jupyter notebook`."),
    },
  },
  {
    id: "ml-sklearn", label: "Machine Learning — scikit-learn", category: "Dados / IA",
    description: "Pipeline de ML com treino, avaliação e previsão.",
    files: {
      "treino.py": `from sklearn.datasets import load_iris\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.pipeline import Pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\n\nX, y = load_iris(return_X_y=True)\nX_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, random_state=42)\n\npipe = Pipeline([("scaler", StandardScaler()), ("clf", LogisticRegression(max_iter=200))])\npipe.fit(X_tr, y_tr)\nprint(f"Acurácia: {pipe.score(X_te, y_te):.2%}")\n`,
      "requirements.txt": "scikit-learn\nnumpy\n",
      ".gitignore": GITIGNORE,
      "README.md": readme("ML — scikit-learn", "Pipeline com StandardScaler + LogisticRegression. `python treino.py`."),
    },
  },
  {
    id: "rag-llm", label: "IA — RAG com LLM", category: "Dados / IA",
    description: "Esqueleto de RAG: embeddings, busca e geração.",
    files: {
      "rag.py": `"""Esqueleto de RAG — preencha o cliente do LLM e o vector store."""\nfrom dataclasses import dataclass\n\n\n@dataclass\nclass Documento:\n    texto: str\n\n\nclass VectorStore:\n    def __init__(self) -> None:\n        self.docs: list[Documento] = []\n\n    def adicionar(self, texto: str) -> None:\n        self.docs.append(Documento(texto))\n\n    def buscar(self, pergunta: str, k: int = 3) -> list[str]:\n        # TODO: embeddings + similaridade de cosseno\n        return [d.texto for d in self.docs[:k]]\n\n\ndef responder(pergunta: str, store: VectorStore) -> str:\n    contexto = "\\n".join(store.buscar(pergunta))\n    prompt = f"Contexto:\\n{contexto}\\n\\nPergunta: {pergunta}"\n    # TODO: chamar o LLM com o prompt\n    return prompt\n`,
      "requirements.txt": "sentence-transformers\nnumpy\n",
      ".gitignore": GITIGNORE,
      "README.md": readme("IA — RAG", "Esqueleto de RAG (busca + geração). Conecte seu LLM e vector DB."),
    },
  },
  {
    id: "scraping", label: "Web Scraping", category: "Automação",
    description: "Coleta de dados com requests e BeautifulSoup.",
    files: {
      "scraper.py": `import time\nimport requests\nfrom bs4 import BeautifulSoup\n\n\ndef coletar(url: str) -> list[str]:\n    resp = requests.get(url, timeout=10, headers={"User-Agent": "PyTrackBot/1.0"})\n    resp.raise_for_status()\n    soup = BeautifulSoup(resp.text, "html.parser")\n    return [a.get_text(strip=True) for a in soup.select("h2")]\n\n\nif __name__ == "__main__":\n    for titulo in coletar("https://example.com"):\n        print(titulo)\n        time.sleep(1)  # educado com o servidor\n`,
      "requirements.txt": "requests\nbeautifulsoup4\n",
      ".gitignore": GITIGNORE,
      "README.md": readme("Web Scraping", "Coleta com requests + BeautifulSoup. Respeite robots.txt."),
    },
  },
  {
    id: "telegram-bot", label: "Bot — Telegram", category: "Bots",
    description: "Bot do Telegram com python-telegram-bot.",
    files: {
      "bot.py": `import os\nfrom telegram import Update\nfrom telegram.ext import Application, CommandHandler, ContextTypes\n\n\nasync def start(update: Update, ctx: ContextTypes.DEFAULT_TYPE) -> None:\n    await update.message.reply_text("Olá! Sou um bot da PyTrack.")\n\n\ndef main() -> None:\n    app = Application.builder().token(os.environ["TELEGRAM_TOKEN"]).build()\n    app.add_handler(CommandHandler("start", start))\n    app.run_polling()\n\n\nif __name__ == "__main__":\n    main()\n`,
      "requirements.txt": "python-telegram-bot\n",
      ".env.example": "TELEGRAM_TOKEN=coloque-seu-token-aqui\n",
      ".gitignore": GITIGNORE,
      "README.md": readme("Bot — Telegram", "Defina TELEGRAM_TOKEN e rode `python bot.py`."),
    },
  },
  {
    id: "discord-bot", label: "Bot — Discord", category: "Bots",
    description: "Bot do Discord com discord.py.",
    files: {
      "bot.py": `import os\nimport discord\nfrom discord.ext import commands\n\nbot = commands.Bot(command_prefix="!", intents=discord.Intents.default())\n\n\n@bot.command()\nasync def ping(ctx) -> None:\n    await ctx.send("pong 🏓")\n\n\nbot.run(os.environ["DISCORD_TOKEN"])\n`,
      "requirements.txt": "discord.py\n",
      ".env.example": "DISCORD_TOKEN=coloque-seu-token-aqui\n",
      ".gitignore": GITIGNORE,
      "README.md": readme("Bot — Discord", "Defina DISCORD_TOKEN e rode `python bot.py`."),
    },
  },
  {
    id: "async-app", label: "Assíncrono — asyncio", category: "Performance",
    description: "Aplicação concorrente com asyncio.",
    files: {
      "main.py": `import asyncio\n\n\nasync def tarefa(nome: str, segundos: float) -> str:\n    await asyncio.sleep(segundos)\n    return f"{nome} pronto em {segundos}s"\n\n\nasync def main() -> None:\n    resultados = await asyncio.gather(\n        tarefa("A", 1),\n        tarefa("B", 2),\n        tarefa("C", 0.5),\n    )\n    for r in resultados:\n        print(r)\n\n\nif __name__ == "__main__":\n    asyncio.run(main())\n`,
      ".gitignore": GITIGNORE,
      "README.md": readme("Assíncrono — asyncio", "Concorrência com gather. `python main.py`."),
    },
  },
  {
    id: "streamlit", label: "Dashboard — Streamlit", category: "Dados / IA",
    description: "Dashboard interativo de dados com Streamlit.",
    files: {
      "app.py": `import streamlit as st\nimport pandas as pd\n\nst.title("📊 Dashboard PyTrack")\n\ndf = pd.DataFrame({"mes": ["Jan", "Fev", "Mar"], "vendas": [100, 140, 90]})\nst.bar_chart(df.set_index("mes"))\nst.dataframe(df)\n`,
      "requirements.txt": "streamlit\npandas\n",
      ".gitignore": GITIGNORE,
      "README.md": readme("Dashboard — Streamlit", "Rode `streamlit run app.py`."),
    },
  },
  {
    id: "etl", label: "ETL — Pipeline de Dados", category: "Dados / IA",
    description: "Pipeline Extract-Transform-Load.",
    files: {
      "pipeline.py": `import pandas as pd\n\n\ndef extract(caminho: str) -> pd.DataFrame:\n    return pd.read_csv(caminho)\n\n\ndef transform(df: pd.DataFrame) -> pd.DataFrame:\n    df = df.dropna()\n    df["total"] = df.get("qtd", 1) * df.get("preco", 0)\n    return df\n\n\ndef load(df: pd.DataFrame, destino: str) -> None:\n    df.to_parquet(destino, index=False)\n\n\nif __name__ == "__main__":\n    dados = pd.DataFrame({"qtd": [2, 3], "preco": [10.0, 5.0]})\n    print(transform(dados))\n`,
      "requirements.txt": "pandas\npyarrow\n",
      ".gitignore": GITIGNORE,
      "README.md": readme("ETL", "Extract/Transform/Load com pandas. `python pipeline.py`."),
    },
  },
  {
    id: "sqlalchemy", label: "Banco de Dados — SQLAlchemy 2.0", category: "Banco de Dados",
    description: "App com ORM SQLAlchemy 2.0 (estilo declarativo).",
    files: {
      "db.py": `from sqlalchemy import create_engine, select\nfrom sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, Session\n\n\nclass Base(DeclarativeBase):\n    pass\n\n\nclass Usuario(Base):\n    __tablename__ = "usuarios"\n    id: Mapped[int] = mapped_column(primary_key=True)\n    nome: Mapped[str]\n\n\nengine = create_engine("sqlite:///app.db")\nBase.metadata.create_all(engine)\n\nwith Session(engine) as s:\n    s.add(Usuario(nome="Ana"))\n    s.commit()\n    for u in s.scalars(select(Usuario)):\n        print(u.id, u.nome)\n`,
      "requirements.txt": "sqlalchemy\n",
      ".gitignore": GITIGNORE,
      "README.md": readme("SQLAlchemy 2.0", "ORM declarativo moderno. `python db.py`."),
    },
  },
  {
    id: "pydantic", label: "Validação — Pydantic + Settings", category: "Backend",
    description: "Modelos validados e configuração por ambiente.",
    files: {
      "models.py": `from pydantic import BaseModel, Field, field_validator\n\n\nclass Usuario(BaseModel):\n    nome: str = Field(min_length=2)\n    idade: int = Field(ge=0, le=120)\n    email: str\n\n    @field_validator("email")\n    @classmethod\n    def valida_email(cls, v: str) -> str:\n        if "@" not in v:\n            raise ValueError("email inválido")\n        return v\n\n\nif __name__ == "__main__":\n    print(Usuario(nome="Ana", idade=30, email="a@x.com"))\n`,
      "settings.py": `from pydantic_settings import BaseSettings\n\n\nclass Settings(BaseSettings):\n    app_name: str = "PyTrack"\n    debug: bool = False\n\n    class Config:\n        env_file = ".env"\n\n\nsettings = Settings()\n`,
      "requirements.txt": "pydantic\npydantic-settings\n",
      ".gitignore": GITIGNORE,
      "README.md": readme("Pydantic", "Validação + settings por ambiente. `python models.py`."),
    },
  },
  {
    id: "graphql", label: "API — GraphQL (Strawberry)", category: "API / Web",
    description: "API GraphQL com Strawberry + FastAPI.",
    files: {
      "schema.py": `import strawberry\n\n\n@strawberry.type\nclass Query:\n    @strawberry.field\n    def ola(self, nome: str = "mundo") -> str:\n        return f"Olá, {nome}!"\n\n\nschema = strawberry.Schema(query=Query)\n`,
      "main.py": `from fastapi import FastAPI\nfrom strawberry.fastapi import GraphQLRouter\nfrom schema import schema\n\napp = FastAPI()\napp.include_router(GraphQLRouter(schema), prefix="/graphql")\n`,
      "requirements.txt": "strawberry-graphql[fastapi]\nuvicorn[standard]\n",
      ".gitignore": GITIGNORE,
      "README.md": readme("GraphQL — Strawberry", "`uvicorn main:app --reload` e abra /graphql."),
    },
  },
  {
    id: "websocket", label: "Tempo Real — WebSocket", category: "API / Web",
    description: "Servidor WebSocket com a lib websockets.",
    files: {
      "server.py": `import asyncio\nimport websockets\n\n\nasync def echo(ws) -> None:\n    async for mensagem in ws:\n        await ws.send(f"eco: {mensagem}")\n\n\nasync def main() -> None:\n    async with websockets.serve(echo, "localhost", 8765):\n        print("WS em ws://localhost:8765")\n        await asyncio.Future()\n\n\nif __name__ == "__main__":\n    asyncio.run(main())\n`,
      "requirements.txt": "websockets\n",
      ".gitignore": GITIGNORE,
      "README.md": readme("WebSocket", "Servidor de eco. `python server.py`."),
    },
  },
  {
    id: "automation", label: "Automação — Script", category: "Automação",
    description: "Script de automação de arquivos e tarefas.",
    files: {
      "organizar.py": `from pathlib import Path\nimport shutil\n\nEXTENSOES = {".jpg": "imagens", ".png": "imagens", ".pdf": "documentos", ".zip": "compactados"}\n\n\ndef organizar(pasta: str) -> None:\n    base = Path(pasta)\n    for arquivo in base.iterdir():\n        if arquivo.is_file() and arquivo.suffix in EXTENSOES:\n            destino = base / EXTENSOES[arquivo.suffix]\n            destino.mkdir(exist_ok=True)\n            shutil.move(str(arquivo), destino / arquivo.name)\n\n\nif __name__ == "__main__":\n    organizar(".")\n`,
      ".gitignore": GITIGNORE,
      "README.md": readme("Automação", "Organiza arquivos por extensão. `python organizar.py`."),
    },
  },
  {
    id: "pygame", label: "Jogo — pygame", category: "Jogos",
    description: "Esqueleto de jogo 2D com pygame.",
    files: {
      "game.py": `import pygame\n\npygame.init()\ntela = pygame.display.set_mode((640, 480))\npygame.display.set_caption("Jogo PyTrack")\nclock = pygame.time.Clock()\n\nx = 320\nrodando = True\nwhile rodando:\n    for evento in pygame.event.get():\n        if evento.type == pygame.QUIT:\n            rodando = False\n    teclas = pygame.key.get_pressed()\n    if teclas[pygame.K_LEFT]:\n        x -= 4\n    if teclas[pygame.K_RIGHT]:\n        x += 4\n    tela.fill((15, 15, 18))\n    pygame.draw.circle(tela, (130, 87, 229), (x, 240), 24)\n    pygame.display.flip()\n    clock.tick(60)\n\npygame.quit()\n`,
      "requirements.txt": "pygame\n",
      ".gitignore": GITIGNORE,
      "README.md": readme("Jogo — pygame", "Mova a bola com as setas. `python game.py`."),
    },
  },
  {
    id: "tkinter", label: "Desktop GUI — tkinter", category: "Desktop",
    description: "App de desktop com interface gráfica (tkinter).",
    files: {
      "app.py": `import tkinter as tk\n\n\ndef ao_clicar() -> None:\n    label.config(text=f"Olá, {entrada.get() or 'mundo'}!")\n\n\njanela = tk.Tk()\njanela.title("App PyTrack")\njanela.geometry("320x160")\n\nentrada = tk.Entry(janela)\nentrada.pack(pady=12)\ntk.Button(janela, text="Cumprimentar", command=ao_clicar).pack()\nlabel = tk.Label(janela, text="")\nlabel.pack(pady=8)\n\njanela.mainloop()\n`,
      ".gitignore": GITIGNORE,
      "README.md": readme("Desktop GUI — tkinter", "GUI com tkinter (stdlib). `python app.py`."),
    },
  },
  {
    id: "microservice", label: "Microsserviço — FastAPI + Docker", category: "DevOps",
    description: "Microsserviço pronto para container, com healthcheck.",
    files: {
      "main.py": `from fastapi import FastAPI\n\napp = FastAPI(title="microsserviço")\n\n\n@app.get("/health")\ndef health() -> dict[str, str]:\n    return {"status": "healthy"}\n\n\n@app.get("/")\ndef raiz() -> dict[str, str]:\n    return {"service": "pytrack-micro"}\n`,
      "Dockerfile": `FROM python:3.12-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\nCOPY . .\nUSER 1000\nEXPOSE 8000\nCMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]\n`,
      "requirements.txt": "fastapi\nuvicorn[standard]\n",
      ".dockerignore": "__pycache__/\n.venv/\n.git/\n",
      ".gitignore": GITIGNORE,
      "README.md": readme("Microsserviço", "Build: `docker build -t micro .` · Run: `docker run -p 8000:8000 micro`."),
    },
  },
  {
    id: "notebook", label: "Notebook — Jupyter", category: "Dados / IA",
    description: "Notebook inicial para experimentação.",
    files: {
      "analise.ipynb": JSON.stringify({
        cells: [
          { cell_type: "markdown", metadata: {}, source: ["# Análise PyTrack\\n", "\\n", "Experimente aqui."] },
          { cell_type: "code", execution_count: null, metadata: {}, outputs: [], source: ["import pandas as pd\\n", "df = pd.DataFrame({'x': [1, 2, 3]})\\n", "df.describe()"] },
        ],
        metadata: { language_info: { name: "python" } },
        nbformat: 4, nbformat_minor: 5,
      }, null, 1),
      "requirements.txt": "jupyter\npandas\n",
      ".gitignore": GITIGNORE,
      "README.md": readme("Notebook — Jupyter", "`jupyter notebook analise.ipynb`."),
    },
  },
  {
    id: "rest-client", label: "Cliente HTTP — httpx", category: "API / Web",
    description: "Cliente de API com httpx (sync e async).",
    files: {
      "cliente.py": `import httpx\n\n\ndef buscar(url: str) -> dict:\n    resp = httpx.get(url, timeout=10)\n    resp.raise_for_status()\n    return resp.json()\n\n\nasync def buscar_async(url: str) -> dict:\n    async with httpx.AsyncClient() as client:\n        resp = await client.get(url, timeout=10)\n        resp.raise_for_status()\n        return resp.json()\n\n\nif __name__ == "__main__":\n    print(buscar("https://httpbin.org/json"))\n`,
      "requirements.txt": "httpx\n",
      ".gitignore": GITIGNORE,
      "README.md": readme("Cliente HTTP — httpx", "Cliente sync/async. `python cliente.py`."),
    },
  },
];

export function templatesByCategory(): Map<string, Template[]> {
  const map = new Map<string, Template[]>();
  for (const t of TEMPLATES) {
    const arr = map.get(t.category) ?? [];
    arr.push(t);
    map.set(t.category, arr);
  }
  return map;
}
