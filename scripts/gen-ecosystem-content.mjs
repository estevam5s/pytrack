/**
 * Gera módulos extras do ecossistema Python como lições markdown reais.
 *  - escreve doc/Conteudos/Ecossistema/<folder>/NN_*.md (+ README)
 *  - escreve lib/content/extra-manifest.ts (EXTRA_MODULES)
 *  - escreve supabase/contents_extra.sql (insert dos novos módulos)
 * O registry mescla MODULES + EXTRA_MODULES; o reader lê os .md do disco.
 */
import { mkdirSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const BASE = join(ROOT, "doc", "Conteudos", "Ecossistema");

function slug(s) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

// L = [title, summary, [points], code, [boas praticas], docsUrl]
const M = [
  ["Pydantic e Validação de Dados", "Backend", "intermediario", "Validação", [
    ["Modelos e validação com Pydantic", "Pydantic valida e converte dados a partir de type hints, sendo a base do FastAPI e de configurações tipadas.",
      ["BaseModel define campos tipados com validação automática", "Conversão (coerção) de tipos e mensagens de erro claras", "Field() adiciona restrições (min, max, regex, default)", "model_validate / model_dump para entrada e saída"],
      "from pydantic import BaseModel, Field\n\nclass Usuario(BaseModel):\n    nome: str = Field(min_length=2)\n    idade: int = Field(ge=0, le=120)\n    email: str\n\nu = Usuario.model_validate({'nome': 'Ana', 'idade': '30', 'email': 'a@x.com'})\nprint(u.idade)  # 30 (int)",
      ["Valide na borda da aplicação, antes da lógica de negócio", "Use modelos separados para entrada e saída"], "https://docs.pydantic.dev/"],
    ["Validators e settings", "Validators customizados e pydantic-settings para configuração por ambiente.",
      ["@field_validator para regras customizadas", "model_config e computed fields", "BaseSettings lê variáveis de ambiente tipadas", "Segredos fora do código, validados no boot"],
      "from pydantic import field_validator, BaseModel\n\nclass Conta(BaseModel):\n    saldo: float\n\n    @field_validator('saldo')\n    @classmethod\n    def positivo(cls, v):\n        if v < 0:\n            raise ValueError('saldo negativo')\n        return v",
      ["Falhe cedo: valide configs no startup", "Centralize settings em um único módulo"], "https://docs.pydantic.dev/latest/concepts/pydantic_settings/"],
    ["Serialização e integração", "Como serializar, lidar com aliases e integrar com APIs.",
      ["model_dump(mode='json') para JSON serializável", "Aliases para nomes camelCase de APIs", "Modelos aninhados e listas tipadas", "Integração nativa com FastAPI"],
      "class Endereco(BaseModel):\n    cidade: str\n\nclass Cliente(BaseModel):\n    nome: str\n    enderecos: list[Endereco]\n\nprint(Cliente(nome='Ana', enderecos=[{'cidade':'SP'}]).model_dump())",
      ["Prefira modelos a dicts soltos", "Documente o contrato com exemplos"], "https://docs.pydantic.dev/latest/concepts/serialization/"],
  ]],

  ["SQLAlchemy 2.0 na Prática", "Banco de Dados", "avancado", "ORM", [
    ["Mapeamento declarativo moderno", "O estilo 2.0 usa DeclarativeBase, Mapped e mapped_column para modelos tipados.",
      ["DeclarativeBase + Mapped[tipo] para tipagem", "Engine, Session e o padrão de unidade de trabalho", "Relacionamentos com relationship()", "select() em vez de query() legado"],
      "from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column\n\nclass Base(DeclarativeBase): pass\n\nclass User(Base):\n    __tablename__ = 'users'\n    id: Mapped[int] = mapped_column(primary_key=True)\n    email: Mapped[str] = mapped_column(unique=True)",
      ["Use sessões com escopo curto (context manager)", "Evite acessar atributos lazy fora da sessão"], "https://docs.sqlalchemy.org/en/20/"],
    ["Consultas e relacionamentos", "Selects, joins e carregamento eager para evitar N+1.",
      ["select(), where(), join() e order_by()", "selectinload/joinedload para eager loading", "scalars() para obter objetos", "Transações explícitas com session.begin()"],
      "from sqlalchemy import select\nfrom sqlalchemy.orm import selectinload\n\nstmt = select(User).options(selectinload(User.posts)).where(User.email == 'a@x.com')\nusuarios = session.scalars(stmt).all()",
      ["Resolva N+1 com eager loading consciente", "Meça queries com echo=True em dev"], "https://docs.sqlalchemy.org/en/20/orm/queryguide/"],
    ["Migrations com Alembic", "Versione o schema do banco de forma reproduzível.",
      ["alembic init e autogenerate", "revisões versionadas (upgrade/downgrade)", "Revise migrations geradas antes de aplicar", "Integre ao pipeline de deploy"],
      "# alembic revision --autogenerate -m 'add users'\n# alembic upgrade head\ndef upgrade():\n    op.create_table('users', sa.Column('id', sa.Integer, primary_key=True))",
      ["Nunca edite migrations já aplicadas em produção", "Teste upgrade e downgrade"], "https://alembic.sqlalchemy.org/"],
  ]],

  ["Redis na Prática", "Banco de Dados", "intermediario", "Cache & Filas", [
    ["Cache com Redis", "Redis é um armazenamento em memória usado para cache, filas, locks e pub/sub.",
      ["Strings, hashes, lists, sets e sorted sets", "TTL e expiração para cache", "Padrão cache-aside", "Cliente redis-py (sync e async)"],
      "import redis\nr = redis.Redis()\nr.set('user:1', 'Ana', ex=60)  # expira em 60s\nprint(r.get('user:1'))",
      ["Defina TTL para evitar cache infinito", "Planeje a invalidação do cache"], "https://redis.io/docs/"],
    ["Rate limiting e locks", "Use Redis para limitar requisições e coordenar processos.",
      ["INCR + EXPIRE para janela fixa", "Locks distribuídos com SET NX", "Filas simples com listas (LPUSH/BRPOP)", "Pub/Sub para eventos em tempo real"],
      "async def allow(r, key, limit, window):\n    n = await r.incr(key)\n    if n == 1:\n        await r.expire(key, window)\n    return n <= limit",
      ["Cuidado com locks sem expiração (deadlock)", "Monitore memória e política de evicção"], "https://redis.io/docs/manual/patterns/"],
  ]],

  ["Celery e Processamento Assíncrono", "Backend", "avancado", "Filas", [
    ["Tarefas em background", "Celery executa trabalho fora do ciclo de request com workers e brokers.",
      ["Broker (Redis/RabbitMQ) e backend de resultado", "@app.task define tarefas", "delay()/apply_async para enfileirar", "Retries com backoff"],
      "from celery import Celery\napp = Celery('tasks', broker='redis://localhost')\n\n@app.task(bind=True, max_retries=3)\ndef enviar_email(self, dest):\n    ...  # trabalho pesado",
      ["Tarefas devem ser idempotentes", "Defina timeouts e limites de retry"], "https://docs.celeryq.dev/"],
    ["Agendamento e monitoramento", "Tarefas periódicas e observabilidade do worker.",
      ["Celery Beat para tarefas recorrentes", "Roteamento por filas e prioridades", "Flower para monitorar", "DLQ para falhas"],
      "app.conf.beat_schedule = {\n    'limpeza': {'task': 'tasks.limpar', 'schedule': 3600.0}\n}",
      ["Separe filas por tipo de carga", "Alerta para filas crescendo"], "https://docs.celeryq.dev/en/stable/userguide/periodic-tasks.html"],
  ]],

  ["Pandas Avançado", "Data Science", "avancado", "Dados", [
    ["GroupBy, merge e reshape", "Operações poderosas para transformar dados tabulares.",
      ["groupby + agg para estatísticas por grupo", "merge/join entre DataFrames", "pivot_table e melt para reshape", "Operações vetorizadas em vez de loops"],
      "import pandas as pd\nresumo = (df.groupby('categoria')\n            .agg(total=('valor','sum'), media=('valor','mean'))\n            .reset_index())",
      ["Vetorize: evite apply linha a linha", "Use categorias para colunas de baixa cardinalidade"], "https://pandas.pydata.org/docs/"],
    ["Limpeza e performance", "Tratamento de nulos, tipos e otimização de memória.",
      ["dropna/fillna e detecção de outliers", "astype e downcast para reduzir memória", "datas com to_datetime e features temporais", "read_csv com dtypes e chunksize"],
      "df['data'] = pd.to_datetime(df['data'])\ndf['mes'] = df['data'].dt.month\ndf['categoria'] = df['categoria'].astype('category')",
      ["Trate nulos conforme o mecanismo de ausência", "Carregue só as colunas necessárias"], "https://pandas.pydata.org/docs/user_guide/"],
    ["Janelas e séries temporais", "Rolling, resample e análise temporal.",
      ["rolling() para médias móveis", "resample() para reamostrar séries", "shift() para defasagens", "Index temporal e fuso"],
      "df.set_index('data').resample('M')['valor'].sum()\ndf['media_movel'] = df['valor'].rolling(7).mean()",
      ["Cuide do alinhamento de índices", "Documente o fuso horário"], "https://pandas.pydata.org/docs/user_guide/timeseries.html"],
  ]],

  ["Polars para Performance", "Data Science", "intermediario", "Dados", [
    ["DataFrames rápidos e lazy", "Polars é uma engine de DataFrame em Rust com execução lazy e paralela.",
      ["API expressiva com expressões", "LazyFrame e otimização de query", "Muito mais rápido que Pandas em grandes volumes", "Leitura direta de Parquet/CSV"],
      "import polars as pl\nq = (pl.scan_csv('dados.csv')\n       .filter(pl.col('valor') > 0)\n       .group_by('categoria').agg(pl.col('valor').sum()))\nprint(q.collect())",
      ["Use scan_* + collect() para lazy", "Prefira expressões a apply"], "https://docs.pola.rs/"],
  ]],

  ["NumPy e Computação Científica", "Data Science", "intermediario", "Científico", [
    ["Arrays e vetorização", "NumPy fornece arrays n-dimensionais e operações vetorizadas eficientes.",
      ["ndarray, dtype e shape", "Broadcasting para operações sem loops", "Slicing e indexação avançada", "Funções universais (ufuncs)"],
      "import numpy as np\na = np.arange(12).reshape(3, 4)\nprint(a.mean(axis=0))\nprint(a[a > 5])",
      ["Vetorize: evite loops Python", "Cuidado com cópias vs views"], "https://numpy.org/doc/"],
    ["Álgebra linear e estatística", "Operações matriciais e numéricas.",
      ["dot, matmul e álgebra linear (linalg)", "Estatísticas (mean, std, percentile)", "Geração de números aleatórios", "Integração com SciPy"],
      "M = np.array([[1,2],[3,4]])\nprint(np.linalg.inv(M))\nprint(np.random.default_rng(42).normal(size=3))",
      ["Use o gerador moderno default_rng", "Fixe seeds para reprodutibilidade"], "https://numpy.org/doc/stable/reference/routines.linalg.html"],
  ]],

  ["Visualização de Dados", "Data Science", "intermediario", "Visualização", [
    ["Matplotlib e Seaborn", "Construa gráficos estáticos com controle fino e estatística visual.",
      ["Figura, eixos e subplots", "Seaborn para gráficos estatísticos rápidos", "Estilos e paletas", "Exportar para PNG/SVG"],
      "import seaborn as sns, matplotlib.pyplot as plt\nsns.barplot(data=df, x='categoria', y='valor')\nplt.title('Vendas')\nplt.tight_layout()",
      ["Escolha o gráfico certo para a mensagem", "Rotule eixos e use títulos claros"], "https://seaborn.pydata.org/"],
    ["Gráficos interativos e dashboards", "Plotly e Streamlit para interatividade.",
      ["Plotly Express para gráficos interativos", "Hover, zoom e filtros", "Streamlit para apps de dados", "Deploy simples"],
      "import plotly.express as px\nfig = px.scatter(df, x='x', y='y', color='grupo')\nfig.show()",
      ["Não exagere na interatividade", "Otimize para grandes volumes"], "https://plotly.com/python/"],
  ]],

  ["Machine Learning com scikit-learn", "Machine Learning", "avancado", "ML", [
    ["Pipelines e pré-processamento", "scikit-learn padroniza preparo de dados e modelos em pipelines.",
      ["Pipeline encadeia transformações e modelo", "ColumnTransformer para colunas mistas", "fit/transform/predict", "Evita vazamento de dados"],
      "from sklearn.pipeline import Pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\n\npipe = Pipeline([('scaler', StandardScaler()), ('clf', LogisticRegression())])\npipe.fit(X_train, y_train)",
      ["Faça pré-processamento dentro do pipeline", "Separe treino/teste antes de tudo"], "https://scikit-learn.org/stable/"],
    ["Validação e métricas", "Avalie modelos de forma robusta.",
      ["train_test_split e cross_val_score", "Métricas conforme o problema (F1, ROC-AUC)", "Matriz de confusão", "GridSearchCV para hiperparâmetros"],
      "from sklearn.model_selection import cross_val_score\nscores = cross_val_score(pipe, X, y, cv=5, scoring='f1')\nprint(scores.mean())",
      ["Use validação cruzada", "Escolha métrica pelo custo do erro"], "https://scikit-learn.org/stable/model_selection.html"],
  ]],

  ["Deep Learning com PyTorch", "Machine Learning", "avancado", "Deep Learning", [
    ["Tensores e autograd", "PyTorch oferece tensores com diferenciação automática.",
      ["Tensores em CPU/GPU", "autograd calcula gradientes", "nn.Module define modelos", "Loop de treino explícito"],
      "import torch\nfrom torch import nn\n\nmodel = nn.Sequential(nn.Linear(10, 32), nn.ReLU(), nn.Linear(32, 1))\nopt = torch.optim.Adam(model.parameters())\nloss = nn.MSELoss()",
      ["Mova dados e modelo para o mesmo device", "Zere gradientes a cada passo"], "https://pytorch.org/docs/"],
    ["Treino e inferência", "Estruture o ciclo de treino e avaliação.",
      ["DataLoader para batches", "forward, backward e optimizer.step", "model.eval() e torch.no_grad() na inferência", "Salvar/carregar state_dict"],
      "for xb, yb in loader:\n    opt.zero_grad()\n    out = model(xb)\n    l = loss(out, yb)\n    l.backward()\n    opt.step()",
      ["Use no_grad na avaliação", "Monitore overfitting"], "https://pytorch.org/tutorials/"],
  ]],

  ["NLP e LLMs", "Machine Learning", "avancado", "IA", [
    ["Transformers e Hugging Face", "Modelos de linguagem pré-treinados para NLP.",
      ["pipeline() para tarefas prontas", "Tokenização e modelos pré-treinados", "Fine-tuning quando necessário", "Datasets da Hugging Face"],
      "from transformers import pipeline\nclf = pipeline('sentiment-analysis')\nprint(clf('Eu amo Python!'))",
      ["Comece com modelos prontos", "Avalie custo/latência do modelo"], "https://huggingface.co/docs/transformers"],
    ["RAG e busca semântica", "Recuperação aumentada por geração com bancos vetoriais.",
      ["Embeddings representam significado", "Bancos vetoriais (FAISS, Qdrant, Chroma)", "Recupera contexto e gera resposta fundamentada", "Guardrails e avaliação"],
      "from sentence_transformers import SentenceTransformer\nmodel = SentenceTransformer('all-MiniLM-L6-v2')\nvecs = model.encode(['texto 1', 'texto 2'])",
      ["Fundamente respostas em fontes", "Monitore qualidade e custo"], "https://www.sbert.net/"],
  ]],

  ["PySpark e Big Data", "Engenharia de Dados", "avancado", "Big Data", [
    ["DataFrames distribuídos", "Spark processa grandes volumes de forma distribuída.",
      ["SparkSession e DataFrame API", "Transformações lazy e ações", "select, filter, groupBy", "Leitura/escrita de Parquet"],
      "from pyspark.sql import SparkSession, functions as F\nspark = SparkSession.builder.getOrCreate()\ndf = spark.read.parquet('dados/')\ndf.groupBy('categoria').agg(F.sum('valor')).show()",
      ["Minimize shuffles", "Particione adequadamente"], "https://spark.apache.org/docs/latest/api/python/"],
  ]],

  ["Airflow e Orquestração", "Engenharia de Dados", "avancado", "Orquestração", [
    ["DAGs e tasks", "Airflow agenda e orquestra pipelines como grafos de tarefas.",
      ["DAG define o fluxo e o agendamento", "Operators e dependências entre tasks", "XCom para passar dados", "Retries e SLAs"],
      "from airflow import DAG\nfrom airflow.operators.python import PythonOperator\n\nwith DAG('etl', schedule='@daily') as dag:\n    t1 = PythonOperator(task_id='extrair', python_callable=extrair)\n    t2 = PythonOperator(task_id='carregar', python_callable=carregar)\n    t1 >> t2",
      ["Tarefas idempotentes e atômicas", "Monitore execuções e backfills"], "https://airflow.apache.org/docs/"],
  ]],

  ["Docker para Python", "DevOps", "intermediario", "Containers", [
    ["Imagens e Dockerfile", "Empacote a aplicação Python em uma imagem reproduzível.",
      ["FROM python:slim e camadas", "Copiar deps antes do código (cache)", "Multi-stage para imagens menores", "Usuário não-root"],
      "FROM python:3.12-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\nCOPY . .\nCMD [\"uvicorn\", \"main:app\", \"--host\", \"0.0.0.0\"]",
      ["Use .dockerignore", "Fixe versões de dependências"], "https://docs.docker.com/language/python/"],
    ["Compose para múltiplos serviços", "Orquestre app + banco + cache localmente.",
      ["docker-compose.yml define serviços", "Redes e volumes", "Variáveis de ambiente", "Healthchecks e depends_on"],
      "services:\n  app:\n    build: .\n    ports: ['8000:8000']\n  db:\n    image: postgres:16\n    environment:\n      POSTGRES_PASSWORD: senha",
      ["Não coloque segredos no compose versionado", "Use healthchecks"], "https://docs.docker.com/compose/"],
  ]],

  ["Kubernetes para Python", "DevOps", "avancado", "Orquestração", [
    ["Pods, Deployments e Services", "Kubernetes orquestra containers em escala.",
      ["Deployment gerencia réplicas", "Service expõe os pods", "ConfigMap e Secret para configuração", "Probes de liveness/readiness"],
      "apiVersion: apps/v1\nkind: Deployment\nmetadata: { name: api }\nspec:\n  replicas: 3\n  template:\n    spec:\n      containers:\n        - name: api\n          image: minha-api:1.0",
      ["Defina requests/limits de recursos", "Use probes para resiliência"], "https://kubernetes.io/docs/"],
  ]],

  ["CI/CD com GitHub Actions", "DevOps", "intermediario", "CI/CD", [
    ["Workflows de CI", "Automatize lint, testes e build a cada push.",
      ["Eventos (push, pull_request)", "Jobs e steps", "Cache de dependências", "Matriz de versões"],
      "name: ci\non: [push]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: pip install -e '.[dev]'\n      - run: ruff check . && pytest",
      ["Falhe rápido: lint e testes primeiro", "Use secrets do GitHub"], "https://docs.github.com/actions"],
    ["Deploy contínuo", "Publique artefatos e implante automaticamente.",
      ["Build e push de imagem", "Ambientes e aprovações", "Deploy com rollback", "Tags e releases"],
      "      - name: build\n        run: docker build -t app:${{ github.sha }} .\n      - name: push\n        run: docker push app:${{ github.sha }}",
      ["Separe ambientes (staging/prod)", "Tenha rollback definido"], "https://docs.github.com/actions/deployment"],
  ]],

  ["Web Scraping Profissional", "Automação", "intermediario", "Scraping", [
    ["BeautifulSoup e requests", "Extraia dados de páginas estáticas com parsing HTML.",
      ["httpx/requests para baixar", "BeautifulSoup para navegar no DOM", "Seletores CSS", "Respeite robots.txt e rate limits"],
      "import httpx\nfrom bs4 import BeautifulSoup\nhtml = httpx.get('https://exemplo.com').text\nsoup = BeautifulSoup(html, 'html.parser')\nfor h in soup.select('h2'):\n    print(h.get_text(strip=True))",
      ["Adicione delays e backoff", "Trate erros de rede"], "https://www.crummy.com/software/BeautifulSoup/bs4/doc/"],
    ["Scrapy e Playwright", "Crawlers estruturados e páginas dinâmicas.",
      ["Scrapy para crawlers com pipelines", "Playwright para JS/SPA", "Filas e deduplicação", "Exportação para CSV/DB"],
      "from playwright.sync_api import sync_playwright\nwith sync_playwright() as p:\n    b = p.chromium.launch()\n    page = b.new_page()\n    page.goto('https://exemplo.com')\n    print(page.title())",
      ["Use browser real só quando necessário", "Respeite os termos de uso"], "https://playwright.dev/python/"],
  ]],

  ["CLIs Modernas com Typer", "Automação", "basico", "CLI", [
    ["Comandos e argumentos", "Typer cria CLIs com type hints e ajuda automática.",
      ["Funções viram comandos", "Argumentos e opções tipados", "Ajuda gerada automaticamente", "Subcomandos"],
      "import typer\napp = typer.Typer()\n\n@app.command()\ndef saudar(nome: str, formal: bool = False):\n    print(f'{\"Prezado\" if formal else \"Oi\"}, {nome}')\n\nif __name__ == '__main__':\n    app()",
      ["Valide entradas com tipos", "Documente cada comando"], "https://typer.tiangolo.com/"],
    ["UX de terminal com Rich", "Saída bonita: tabelas, progresso e cores.",
      ["Console e markup", "Tabelas e painéis", "Barras de progresso", "Logs formatados"],
      "from rich.table import Table\nfrom rich import print\nt = Table('Nome', 'Idade')\nt.add_row('Ana', '30')\nprint(t)",
      ["Não abuse de cores", "Mantenha saída legível em logs"], "https://rich.readthedocs.io/"],
  ]],

  ["Pytest Avançado", "Qualidade", "intermediario", "Testes", [
    ["Fixtures e parametrização", "Recursos do pytest para testes limpos e abrangentes.",
      ["Fixtures para setup/teardown", "Escopo de fixtures (function/module/session)", "@pytest.mark.parametrize", "conftest.py compartilhado"],
      "import pytest\n\n@pytest.fixture\ndef cliente():\n    return {'saldo': 100}\n\n@pytest.mark.parametrize('valor,ok', [(50, True), (200, False)])\ndef test_saque(cliente, valor, ok):\n    assert (valor <= cliente['saldo']) == ok",
      ["Teste comportamento, não implementação", "Mantenha fixtures pequenas"], "https://docs.pytest.org/"],
    ["Mocks e cobertura", "Isole dependências e meça o que é testado.",
      ["unittest.mock e monkeypatch", "responses/respx para HTTP", "pytest-cov para cobertura", "freezegun para tempo"],
      "def test_api(mocker):\n    mock = mocker.patch('app.buscar', return_value=42)\n    assert processar() == 42\n    mock.assert_called_once()",
      ["Mocke nas fronteiras (I/O)", "Cobertura é sinal, não meta"], "https://pytest-cov.readthedocs.io/"],
  ]],

  ["Type Hints e mypy", "Qualidade", "intermediario", "Tipagem", [
    ["Anotações e o módulo typing", "Tipagem estática melhora legibilidade e captura erros cedo.",
      ["Anotações em variáveis, parâmetros e retorno", "Optional, Union, Literal, TypedDict", "Generics com TypeVar", "Protocols (tipagem estrutural)"],
      "from typing import Protocol\n\nclass Repo(Protocol):\n    def salvar(self, x: dict) -> None: ...\n\ndef usar(repo: Repo, dado: dict) -> None:\n    repo.salvar(dado)",
      ["Tipe APIs públicas primeiro", "Ative mypy no CI"], "https://mypy.readthedocs.io/"],
  ]],

  ["Empacotamento e Publicação", "Qualidade", "intermediario", "Packaging", [
    ["pyproject.toml e ambientes", "Estruture, isole e publique pacotes Python.",
      ["pyproject.toml centraliza metadados e ferramentas", "venv, pip e pipx", "Poetry/uv para lockfile reprodutível", "Versionamento semântico"],
      "[project]\nname = 'meu-pacote'\nversion = '0.1.0'\nrequires-python = '>=3.11'\ndependencies = ['httpx']",
      ["Use lockfile para reprodutibilidade", "Mantenha um changelog"], "https://packaging.python.org/"],
    ["Build e publicação no PyPI", "Gere e publique distribuições.",
      ["build gera wheel e sdist", "twine para enviar ao PyPI", "Teste no TestPyPI", "CI para publicar em tags"],
      "# python -m build\n# twine upload dist/*\n# pip install meu-pacote",
      ["Publique a partir do CI em tags", "Assine/valide artefatos"], "https://packaging.python.org/en/latest/tutorials/packaging-projects/"],
  ]],

  ["GraphQL e gRPC", "Backend", "avancado", "APIs", [
    ["GraphQL com Strawberry", "Uma alternativa flexível ao REST para o cliente consultar o que precisa.",
      ["Schema tipado com Strawberry", "Queries, mutations e resolvers", "Evita over/under-fetching", "Integra com FastAPI"],
      "import strawberry\n\n@strawberry.type\nclass Query:\n    @strawberry.field\n    def ola(self) -> str:\n        return 'mundo'\n\nschema = strawberry.Schema(Query)",
      ["Cuide do N+1 com dataloaders", "Limite profundidade de queries"], "https://strawberry.rocks/"],
    ["gRPC para alta performance", "RPC binário com contratos protobuf.",
      ["Contratos .proto e geração de stubs", "Streaming bidirecional", "Alta performance e baixa latência", "Bom para microsserviços internos"],
      "# service.proto\nservice Calc {\n  rpc Somar(Par) returns (Resultado);\n}",
      ["Versione contratos com cuidado", "Use para serviços internos"], "https://grpc.io/docs/languages/python/"],
  ]],

  ["WebSockets e Tempo Real", "Backend", "avancado", "Real-time", [
    ["Comunicação bidirecional", "WebSockets mantêm um canal aberto para tempo real.",
      ["Handshake e conexão persistente", "Endpoints WebSocket no FastAPI", "Broadcast para múltiplos clientes", "Backplane (Redis) para escalar"],
      "from fastapi import FastAPI, WebSocket\napp = FastAPI()\n\n@app.websocket('/ws')\nasync def ws(socket: WebSocket):\n    await socket.accept()\n    while True:\n        msg = await socket.receive_text()\n        await socket.send_text(f'eco: {msg}')",
      ["Trate desconexões", "Escale com pub/sub"], "https://fastapi.tiangolo.com/advanced/websockets/"],
  ]],

  ["Autenticação e Autorização", "Backend", "avancado", "Segurança", [
    ["JWT e OAuth2", "Proteja APIs com tokens e fluxos padronizados.",
      ["JWT assinado com claims e expiração", "OAuth2 password e authorization code", "Hash de senha com bcrypt", "Refresh tokens"],
      "from passlib.hash import bcrypt\nhash = bcrypt.hash('senha')\nassert bcrypt.verify('senha', hash)",
      ["Expiração curta + refresh", "Nunca guarde senha em texto puro"], "https://fastapi.tiangolo.com/tutorial/security/"],
    ["RBAC e ABAC", "Controle de acesso por papéis e atributos.",
      ["RBAC: permissões por papel", "ABAC: decisões por atributos e contexto", "Dependências de autorização no FastAPI", "Princípio do menor privilégio"],
      "def require_role(role):\n    def dep(user = Depends(get_user)):\n        if role not in user.roles:\n            raise HTTPException(403)\n    return dep",
      ["Negue por padrão", "Audite acessos sensíveis"], "https://owasp.org/www-project-top-ten/"],
  ]],

  ["Streamlit e Apps de Dados", "Data Science", "basico", "Apps", [
    ["Construindo apps em Python puro", "Streamlit transforma scripts em apps web interativos.",
      ["Widgets (slider, selectbox, file_uploader)", "Reatividade automática", "Cache com @st.cache_data", "Deploy simples"],
      "import streamlit as st\nimport pandas as pd\n\narquivo = st.file_uploader('CSV')\nif arquivo:\n    df = pd.read_csv(arquivo)\n    st.dataframe(df)\n    st.bar_chart(df.select_dtypes('number'))",
      ["Use cache para dados pesados", "Mantenha o app responsivo"], "https://docs.streamlit.io/"],
  ]],

  ["Git e GitHub Avançado", "DevOps", "intermediario", "Versionamento", [
    ["Branches, merge e rebase", "Fluxos de trabalho colaborativos com Git.",
      ["Branches por feature", "merge vs rebase", "Resolução de conflitos", "Commits atômicos e mensagens claras"],
      "git switch -c feature/login\ngit add -p\ngit commit -m 'feat: login com JWT'\ngit rebase main",
      ["Commits pequenos e descritivos", "Rebase local, merge no remoto"], "https://git-scm.com/doc"],
    ["Pull requests e revisão", "Colabore com qualidade no GitHub.",
      ["PRs pequenos e focados", "Code review construtivo", "CI obrigatória antes do merge", "Conventional commits"],
      "# .github/pull_request_template.md\n## O que muda\n## Como testar\n## Checklist",
      ["Revise comportamento e testes", "Mantenha PRs pequenos"], "https://docs.github.com/pull-requests"],
  ]],

  ["Clean Code e Refatoração", "Engenharia de Software", "intermediario", "Qualidade", [
    ["Princípios de código limpo", "Escreva código legível, simples e fácil de manter.",
      ["Nomes claros e intenção explícita", "Funções pequenas e coesas", "Evite duplicação real (DRY)", "KISS e YAGNI"],
      "# ruim\nd = {}\nfor x in l:\n    d[x[0]] = x[1]\n# bom\nusuarios_por_id = {u.id: u for u in usuarios}",
      ["Otimize para leitura", "Comente o porquê, não o quê"], "https://docs.python-guide.org/"],
    ["Refatoração segura", "Melhore o design sem mudar o comportamento.",
      ["Tenha testes antes de refatorar", "Pequenos passos reversíveis", "Extrair função/classe", "Reduzir complexidade ciclomática"],
      "# extrair função\ndef calcular_desconto(valor, cupom):\n    if not cupom:\n        return valor\n    return valor * (1 - cupom.percentual)",
      ["Refatore com a rede de testes ligada", "Um motivo por commit"], "https://refactoring.guru/"],
  ]],

  ["Interfaces Desktop com PySide/Tkinter", "Desktop", "intermediario", "GUI", [
    ["GUIs com Tkinter", "Tkinter é a biblioteca padrão para interfaces gráficas simples.",
      ["Widgets, layout (pack/grid) e eventos", "Janelas, diálogos e menus", "Binding de variáveis", "Loop principal mainloop()"],
      "import tkinter as tk\nroot = tk.Tk()\ntk.Label(root, text='Olá').pack()\ntk.Button(root, text='Sair', command=root.destroy).pack()\nroot.mainloop()",
      ["Separe UI da lógica", "Use grid para layouts complexos"], "https://docs.python.org/3/library/tkinter.html"],
    ["Apps modernos com PySide6", "Qt para desktop completo e profissional.",
      ["Widgets ricos e estilização (QSS)", "Signals e slots", "Qt Designer para telas", "Empacotamento com PyInstaller"],
      "from PySide6.QtWidgets import QApplication, QPushButton\napp = QApplication([])\nbtn = QPushButton('Clique')\nbtn.clicked.connect(lambda: print('clicou'))\nbtn.show()\napp.exec()",
      ["Use threads para não travar a UI", "Separe em MVC/MVVM"], "https://doc.qt.io/qtforpython/"],
  ]],

  ["Desenvolvimento de Jogos com Pygame", "Jogos", "intermediario", "Games", [
    ["Loop de jogo e sprites", "Pygame fornece a base para jogos 2D e aprendizado.",
      ["Game loop: eventos, update, render", "Surfaces, sprites e colisões", "Controle de FPS com Clock", "Entrada de teclado/mouse"],
      "import pygame\npygame.init()\ntela = pygame.display.set_mode((640, 480))\nrodando = True\nwhile rodando:\n    for e in pygame.event.get():\n        if e.type == pygame.QUIT:\n            rodando = False\n    tela.fill((0, 0, 0))\n    pygame.display.flip()",
      ["Separe lógica de renderização", "Use grupos de sprites"], "https://www.pygame.org/docs/"],
  ]],

  ["Visão Computacional com OpenCV", "Machine Learning", "avancado", "Visão", [
    ["Processamento de imagem", "OpenCV manipula imagens e vídeo para visão computacional.",
      ["Leitura, escrita e conversão de cores", "Filtros, bordas e thresholding", "Detecção de contornos e faces", "Captura de webcam"],
      "import cv2\nimg = cv2.imread('foto.jpg')\ncinza = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)\nbordas = cv2.Canny(cinza, 100, 200)\ncv2.imwrite('bordas.jpg', bordas)",
      ["Trabalhe em escala de cinza quando possível", "Cuide do desempenho em vídeo"], "https://docs.opencv.org/"],
  ]],

  ["Processamento de Imagens com Pillow", "Automação", "basico", "Imagens", [
    ["Manipulação de imagens", "Pillow (PIL) edita, converte e gera imagens.",
      ["Abrir, redimensionar e recortar", "Filtros e ajustes", "Desenhar texto e formas", "Conversão de formatos e thumbnails"],
      "from PIL import Image\nimg = Image.open('foto.jpg')\nimg.thumbnail((200, 200))\nimg.convert('RGB').save('thumb.webp')",
      ["Preserve a proporção ao redimensionar", "Otimize o tamanho de saída"], "https://pillow.readthedocs.io/"],
  ]],

  ["Séries Temporais", "Data Science", "avancado", "Séries Temporais", [
    ["Análise e decomposição", "Modele dados que variam no tempo.",
      ["Índice temporal e resampling", "Tendência, sazonalidade e ruído", "Autocorrelação (ACF/PACF)", "Estacionariedade"],
      "import pandas as pd\nserie = pd.read_csv('vendas.csv', parse_dates=['data'], index_col='data')['valor']\nmensal = serie.resample('M').sum()\nprint(mensal.rolling(3).mean())",
      ["Garanta frequência regular", "Trate gaps e outliers"], "https://otexts.com/fpp3/"],
    ["Forecasting", "Previsão com modelos estatísticos e ML.",
      ["ARIMA/SARIMA com statsmodels", "Prophet para sazonalidade", "Validação com janela deslizante", "Métricas (MAE, RMSE, MAPE)"],
      "from statsmodels.tsa.arima.model import ARIMA\nmodelo = ARIMA(serie, order=(1,1,1)).fit()\nprint(modelo.forecast(12))",
      ["Valide no tempo (não embaralhe)", "Compare com baseline ingênuo"], "https://www.statsmodels.org/"],
  ]],

  ["Dados Geoespaciais", "Data Science", "avancado", "Geo", [
    ["GeoPandas e mapas", "Trabalhe com dados geográficos e geometrias.",
      ["GeoDataFrame e geometrias", "Sistemas de coordenadas (CRS)", "Joins espaciais", "Visualização de mapas"],
      "import geopandas as gpd\ngdf = gpd.read_file('regioes.geojson')\ngdf = gdf.to_crs(4326)\ngdf.plot(column='populacao', legend=True)",
      ["Cuide do CRS ao combinar dados", "Simplifique geometrias pesadas"], "https://geopandas.org/"],
  ]],

  ["Blockchain e Web3", "Especializações", "avancado", "Blockchain", [
    ["Interagindo com a blockchain", "web3.py conecta Python à rede Ethereum.",
      ["Conexão via provider (RPC)", "Ler saldos e enviar transações", "Interagir com smart contracts (ABI)", "Carteiras e chaves"],
      "from web3 import Web3\nw3 = Web3(Web3.HTTPProvider('https://rpc...'))\nprint(w3.is_connected())\nsaldo = w3.eth.get_balance('0x...')",
      ["Nunca exponha chaves privadas", "Teste em redes de teste primeiro"], "https://web3py.readthedocs.io/"],
  ]],

  ["MicroPython e IoT", "IoT", "avancado", "Embarcados", [
    ["Python em microcontroladores", "MicroPython roda em ESP32/Raspberry Pi Pico.",
      ["GPIO: ler sensores e acionar atuadores", "PWM, ADC e I2C/SPI", "Wi-Fi e requisições", "Publicar via MQTT"],
      "from machine import Pin\nimport time\nled = Pin(2, Pin.OUT)\nwhile True:\n    led.value(not led.value())\n    time.sleep(1)",
      ["Cuide do consumo de energia", "Trate reconexões de rede"], "https://docs.micropython.org/"],
  ]],

  ["Expressões Regulares", "Fundamentos", "intermediario", "Regex", [
    ["Regex com o módulo re", "Encontre e extraia padrões em texto.",
      ["search, match, findall e sub", "Grupos e grupos nomeados", "Classes, quantificadores e âncoras", "Compilação de padrões"],
      "import re\ntexto = 'tel: (11) 99999-8888'\nm = re.search(r'\\((\\d{2})\\)\\s*(\\d{4,5})-(\\d{4})', texto)\nprint(m.groups())",
      ["Compile padrões reutilizados", "Evite regex para parsear HTML/JSON"], "https://docs.python.org/3/library/re.html"],
  ]],

  ["Logging e Configuração", "Qualidade", "intermediario", "Observabilidade", [
    ["Logging estruturado", "Registre eventos de forma útil para operar em produção.",
      ["Níveis (DEBUG..CRITICAL) e handlers", "Formatação e arquivos rotativos", "structlog/loguru para logs estruturados", "Correlation id em serviços web"],
      "import logging\nlogging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')\nlog = logging.getLogger(__name__)\nlog.info('app iniciada', extra={'user': 42})",
      ["Não logue segredos", "Use níveis adequados"], "https://docs.python.org/3/library/logging.html"],
    ["Configuração por ambiente", "Separe config do código com segurança.",
      ["Variáveis de ambiente e .env", "pydantic-settings tipado", "Configs por ambiente (dev/prod)", "Segredos em vaults"],
      "from pydantic_settings import BaseSettings\n\nclass Config(BaseSettings):\n    db_url: str\n    debug: bool = False\n\nconfig = Config()",
      ["Valide config no startup", "Nunca versione segredos"], "https://docs.pydantic.dev/latest/concepts/pydantic_settings/"],
  ]],

  ["Automação de E-mail e PDF", "Automação", "intermediario", "Documentos", [
    ["Envio de e-mails", "Automatize comunicação por e-mail.",
      ["smtplib e EmailMessage", "Anexos e HTML", "Templates com Jinja2", "Agendamento de envios"],
      "import smtplib\nfrom email.message import EmailMessage\nmsg = EmailMessage()\nmsg['Subject'] = 'Relatório'\nmsg['To'] = 'dest@x.com'\nmsg.set_content('Segue o relatório.')\n# smtp.send_message(msg)",
      ["Use App Passwords/credenciais seguras", "Respeite limites de envio"], "https://docs.python.org/3/library/email.examples.html"],
    ["Gerando e lendo PDFs", "Crie e extraia conteúdo de PDFs.",
      ["reportlab para gerar PDFs", "pypdf/pdfplumber para ler", "Mesclar e dividir páginas", "Extrair tabelas"],
      "from pypdf import PdfReader\nr = PdfReader('doc.pdf')\nprint(r.pages[0].extract_text())",
      ["Valide PDFs de fontes não confiáveis", "Cuide da formatação"], "https://pypdf.readthedocs.io/"],
  ]],

  ["Dask e Computação Paralela", "Engenharia de Dados", "avancado", "Paralelismo", [
    ["Escalando o Pandas", "Dask paraleliza APIs familiares para dados grandes.",
      ["DataFrame e Array distribuídos", "Avaliação lazy e compute()", "Paralelismo em multicore/cluster", "Familiar a quem usa Pandas/NumPy"],
      "import dask.dataframe as dd\ndf = dd.read_csv('dados/*.csv')\nresultado = df.groupby('categoria').valor.mean().compute()",
      ["Use particionamento adequado", "Persista resultados intermediários"], "https://docs.dask.org/"],
  ]],

  ["MLOps na Prática", "Machine Learning", "avancado", "MLOps", [
    ["Tracking e versionamento", "Reprodutibilidade e governança de modelos.",
      ["MLflow para experimentos e registry", "DVC para versionar dados/pipelines", "Versione código, dados e artefatos", "Métricas e parâmetros registrados"],
      "import mlflow\nwith mlflow.start_run():\n    mlflow.log_param('alpha', 0.1)\n    mlflow.log_metric('rmse', 0.42)\n    mlflow.sklearn.log_model(modelo, 'modelo')",
      ["Registre tudo do experimento", "Automatize com CI"], "https://mlflow.org/docs/latest/index.html"],
    ["Serving e monitoramento", "Coloque modelos em produção e acompanhe.",
      ["API de inferência (FastAPI/BentoML)", "Monitoramento de drift e performance", "Versionamento de modelo", "Rollback e A/B testing"],
      "from fastapi import FastAPI\napp = FastAPI()\n\n@app.post('/prever')\ndef prever(dados: dict):\n    return {'classe': modelo.predict([list(dados.values())])[0]}",
      ["Monitore drift de dados", "Tenha rollback de modelo"], "https://docs.bentoml.org/"],
  ]],

  ["Sistemas de Recomendação", "Machine Learning", "avancado", "Recomendação", [
    ["Filtragem colaborativa e de conteúdo", "Recomende itens relevantes a usuários.",
      ["Baseada em conteúdo (similaridade)", "Filtragem colaborativa (usuários/itens)", "Matriz de utilidade e fatoração", "Avaliação (precision@k, recall@k)"],
      "from sklearn.metrics.pairwise import cosine_similarity\nsim = cosine_similarity(matriz_itens)\n# recomenda itens mais similares aos já curtidos",
      ["Trate o cold start", "Cuide de viés e diversidade"], "https://scikit-learn.org/stable/modules/metrics.html"],
  ]],

  ["Engenharia de Features", "Data Science", "avancado", "Features", [
    ["Criando boas features", "A qualidade das features define o teto do modelo.",
      ["Encoding de categóricas (one-hot, target)", "Escalonamento e transformações", "Features de data/texto/agregação", "Seleção de features"],
      "import pandas as pd\ndf = pd.get_dummies(df, columns=['categoria'])\ndf['log_valor'] = np.log1p(df['valor'])\ndf['dia_semana'] = df['data'].dt.dayofweek",
      ["Evite vazamento de dados", "Documente cada feature"], "https://feature-engine.trainindata.com/"],
  ]],

  ["Mensageria e Arquitetura de Eventos", "Backend", "avancado", "Eventos", [
    ["Filas e tópicos", "Desacople sistemas com mensageria assíncrona.",
      ["Filas (RabbitMQ) vs streaming (Kafka)", "Produtores e consumidores", "Garantias de entrega (at-least-once)", "Dead-letter queues"],
      "# produtor Kafka (confluent)\nproducer.produce('pedidos', key='1', value='{\"id\": 1}')\nproducer.flush()",
      ["Handlers idempotentes", "Monitore lag de consumidores"], "https://kafka.apache.org/documentation/"],
    ["Padrões de eventos", "Construa sistemas event-driven robustos.",
      ["Event sourcing e outbox pattern", "Sagas para transações distribuídas", "Ordenação por partição", "Versionamento de eventos"],
      "# outbox: grava evento na mesma transação do dado\nwith session.begin():\n    session.add(pedido)\n    session.add(Evento(tipo='pedido_criado', payload=...))",
      ["Eventos imutáveis e versionados", "Garanta consistência eventual"], "https://microservices.io/patterns/data/event-sourcing.html"],
  ]],

  ["Caching e Performance Web", "Backend", "avancado", "Performance", [
    ["Estratégias de cache", "Reduza latência e carga com cache consciente.",
      ["Cache-aside, write-through e write-behind", "Invalidação e TTL", "Cache em camadas (CDN, app, DB)", "Cache de respostas HTTP"],
      "import redis\nr = redis.Redis()\n\ndef get_user(uid):\n    cached = r.get(f'u:{uid}')\n    if cached:\n        return cached\n    user = db_buscar(uid)\n    r.set(f'u:{uid}', user, ex=300)\n    return user",
      ["Planeje a invalidação", "Meça hit ratio"], "https://redis.io/docs/manual/patterns/"],
  ]],

  ["LangChain e RAG", "Machine Learning", "avancado", "IA Generativa", [
    ["Fundamentos de LLMs e LangChain", "LangChain orquestra chamadas a modelos de linguagem (LLMs), conectando prompts, modelos e ferramentas em cadeias.",
      ["LLMs geram texto a partir de prompts e contexto", "Prompt templates parametrizam instruções", "Chains encadeiam prompt -> modelo -> parser", "Integração com OpenAI, Anthropic, Ollama e outros"],
      "from langchain_openai import ChatOpenAI\nfrom langchain_core.prompts import ChatPromptTemplate\n\nllm = ChatOpenAI(model='gpt-4o-mini')\nprompt = ChatPromptTemplate.from_template('Explique {tema} em uma frase')\nchain = prompt | llm\nprint(chain.invoke({'tema': 'RAG'}).content)",
      ["Versione e teste seus prompts", "Ajuste a temperatura conforme a tarefa"], "https://python.langchain.com/"],
    ["Embeddings e bancos vetoriais", "RAG (Retrieval-Augmented Generation) busca trechos relevantes em um banco vetorial e injeta no prompt.",
      ["Embeddings transformam texto em vetores", "Bancos vetoriais (Chroma, FAISS, pgvector) buscam por similaridade", "Chunking divide documentos em pedaços", "Top-k recupera os trechos mais relevantes"],
      "from langchain_community.vectorstores import Chroma\nfrom langchain_openai import OpenAIEmbeddings\n\ndb = Chroma.from_texts(textos, OpenAIEmbeddings())\ndocs = db.similarity_search('como fazer deploy?', k=4)",
      ["Ajuste o tamanho do chunk ao domínio", "Guarde metadados para filtrar a busca"], "https://python.langchain.com/docs/concepts/rag/"],
    ["Pipeline RAG completo", "Combine recuperação e geração para responder com base nos seus dados, reduzindo alucinações.",
      ["Retriever busca contexto relevante", "Prompt injeta contexto e pergunta", "LLM gera resposta fundamentada", "Cite fontes e avalie a qualidade"],
      "from langchain_core.runnables import RunnablePassthrough\n\nrag = (\n    {'contexto': retriever, 'pergunta': RunnablePassthrough()}\n    | prompt | llm\n)\nprint(rag.invoke('Qual a política de reembolso?'))",
      ["Avalie com perguntas de teste (RAGAS)", "Limite o contexto ao essencial"], "https://python.langchain.com/docs/tutorials/rag/"],
  ]],

  ["Agentes de IA com Python", "Machine Learning", "avancado", "IA Generativa", [
    ["O que são agentes de IA", "Agentes usam um LLM como cérebro que decide quais ferramentas chamar para cumprir um objetivo.",
      ["O LLM raciocina e escolhe ações (tools)", "Ferramentas dão acesso a APIs, busca e código", "Loop: pensar -> agir -> observar -> repetir", "Frameworks: LangGraph, CrewAI, AutoGen"],
      "from langchain.agents import create_react_agent, AgentExecutor\nfrom langchain_core.tools import tool\n\n@tool\ndef somar(a: int, b: int) -> int:\n    'Soma dois números.'\n    return a + b\n\nagent = create_react_agent(llm, [somar], prompt)\nexecutor = AgentExecutor(agent=agent, tools=[somar])",
      ["Descreva bem cada ferramenta (o LLM lê a docstring)", "Limite o número de passos para evitar loops"], "https://python.langchain.com/docs/concepts/agents/"],
    ["Ferramentas e function calling", "Function calling permite que o modelo invoque funções tipadas com argumentos estruturados.",
      ["Defina tools com tipos e descrições claras", "O modelo retorna a função e os argumentos", "Você executa e devolve o resultado", "Valide as saídas com Pydantic"],
      "@tool\ndef buscar_clima(cidade: str) -> str:\n    'Retorna o clima atual de uma cidade.'\n    return api_clima(cidade)\n\nllm_tools = llm.bind_tools([buscar_clima])\nresp = llm_tools.invoke('Como está o tempo em SP?')",
      ["Trate erros das ferramentas com mensagens úteis", "Nunca confie cegamente na saída do agente"], "https://python.langchain.com/docs/concepts/tool_calling/"],
    ["Multi-agentes com LangGraph", "Sistemas multi-agente coordenam vários agentes especializados via um grafo de estados.",
      ["LangGraph modela fluxos como grafos de estado", "Nós são agentes/ferramentas; arestas são transições", "Estado compartilhado entre os passos", "Um supervisor roteia tarefas entre agentes"],
      "from langgraph.graph import StateGraph, END\n\ng = StateGraph(Estado)\ng.add_node('pesquisar', pesquisar)\ng.add_node('escrever', escrever)\ng.add_edge('pesquisar', 'escrever')\ng.add_edge('escrever', END)\napp = g.compile()",
      ["Comece com 1 agente; só adicione mais se necessário", "Persista o estado para retomar execuções"], "https://langchain-ai.github.io/langgraph/"],
  ]],

  ["Web Full-Stack com Python", "Backend", "intermediario", "Web", [
    ["Full-stack com FastAPI e templates", "Você pode entregar HTML direto do FastAPI usando Jinja2, sem um frontend separado.",
      ["Jinja2 renderiza templates com dados do servidor", "Rotas retornam HTML ou JSON", "Arquivos estáticos (CSS/JS) servidos pelo app", "Formulários e validação no servidor"],
      "from fastapi import FastAPI, Request\nfrom fastapi.templating import Jinja2Templates\n\napp = FastAPI()\ntpl = Jinja2Templates(directory='templates')\n\n@app.get('/')\ndef home(request: Request):\n    return tpl.TemplateResponse('home.html', {'request': request, 'nome': 'Ana'})",
      ["Separe templates por componente", "Escape sempre a saída (o Jinja faz por padrão)"], "https://fastapi.tiangolo.com/advanced/templates/"],
    ["Interatividade com HTMX", "HTMX traz interatividade moderna (sem SPA) trocando pedaços de HTML via AJAX.",
      ["Atributos hx-get/hx-post fazem requisições", "O servidor responde com fragmentos de HTML", "Atualiza partes da página sem recarregar", "Menos JavaScript, mais produtividade"],
      "# template\n<button hx-get='/contador' hx-swap='outerHTML'>\n  Cliques: {{ n }}\n</button>\n\n# a rota /contador devolve o HTML atualizado do botão",
      ["Combine HTMX com Tailwind para UI rápida", "Retorne fragmentos pequenos e focados"], "https://htmx.org/"],
    ["Autenticação e deploy full-stack", "Sessões, senhas com hash e deploy de uma app full-stack Python.",
      ["Sessões com cookies assinados", "Hash de senha com passlib/bcrypt", "Middleware de autenticação", "Deploy com Uvicorn/Gunicorn atrás de Nginx"],
      "from passlib.hash import bcrypt\n\nhashed = bcrypt.hash('senha123')\nassert bcrypt.verify('senha123', hashed)",
      ["Nunca armazene senha em texto puro", "Use HTTPS e cookies HttpOnly/Secure"], "https://fastapi.tiangolo.com/tutorial/security/"],
  ]],

  ["AWS para Python", "DevOps", "avancado", "Cloud", [
    ["boto3: o SDK da AWS", "boto3 é a biblioteca oficial para interagir com serviços AWS a partir do Python.",
      ["Clients e resources para cada serviço", "Credenciais via IAM roles ou variáveis", "S3, EC2, DynamoDB, SQS e mais", "Paginação e tratamento de erros"],
      "import boto3\n\ns3 = boto3.client('s3')\ns3.upload_file('relatorio.pdf', 'meu-bucket', 'relatorios/jan.pdf')\nfor obj in s3.list_objects_v2(Bucket='meu-bucket')['Contents']:\n    print(obj['Key'])",
      ["Use IAM roles, nunca chaves no código", "Princípio do menor privilégio nas policies"], "https://boto3.amazonaws.com/v1/documentation/api/latest/index.html"],
    ["Lambda e serverless", "AWS Lambda executa funções Python sob demanda, sem gerenciar servidores.",
      ["handler(event, context) é o ponto de entrada", "Cobrança por tempo de execução (ms)", "Triggers: API Gateway, S3, SQS, EventBridge", "Empacote dependências em layers"],
      "def handler(event, context):\n    nome = event.get('nome', 'mundo')\n    return {'statusCode': 200, 'body': f'Olá, {nome}!'}",
      ["Mantenha funções pequenas e focadas", "Cuidado com cold starts e timeouts"], "https://docs.aws.amazon.com/lambda/latest/dg/lambda-python.html"],
    ["Infraestrutura como código (CDK)", "Defina infra AWS de forma reproduzível com Terraform ou AWS CDK em Python.",
      ["IaC versiona a infraestrutura", "Terraform: declarativo e multi-cloud", "AWS CDK: infra em Python puro", "Planeje (plan) antes de aplicar (apply)"],
      "from aws_cdk import App, Stack\nfrom aws_cdk import aws_s3 as s3\n\nclass MeuStack(Stack):\n    def __init__(self, scope, id):\n        super().__init__(scope, id)\n        s3.Bucket(self, 'Dados', versioned=True)",
      ["Nunca altere infra de produção na mão", "Guarde o state remoto e travado"], "https://docs.aws.amazon.com/cdk/v2/guide/work-with-cdk-python.html"],
  ]],

  ["Cloud e Serverless", "DevOps", "avancado", "Cloud", [
    ["Containers na nuvem", "Empacote sua app em containers e rode em qualquer nuvem (AWS ECS, GCP Cloud Run, Azure).",
      ["Docker padroniza o ambiente", "Cloud Run e ECS Fargate rodam containers sem servidor", "Escala automática conforme o tráfego", "Variáveis e segredos gerenciados"],
      "FROM python:3.13-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install -r requirements.txt\nCOPY . .\nCMD uvicorn main:app --host 0.0.0.0 --port 8080",
      ["Imagens slim e multi-stage para tamanho menor", "Healthchecks para a orquestração"], "https://cloud.google.com/run/docs/quickstarts"],
    ["Filas, eventos e mensageria", "Arquiteturas serverless desacoplam serviços com filas e eventos.",
      ["SQS/Pub-Sub para filas", "EventBridge/Pub-Sub para eventos", "Processamento assíncrono e resiliente", "Dead-letter queues para falhas"],
      "import boto3\nsqs = boto3.client('sqs')\nsqs.send_message(QueueUrl=URL, MessageBody='pedido:123')",
      ["Torne os consumidores idempotentes", "Monitore o tamanho das filas"], "https://docs.aws.amazon.com/sqs/"],
    ["Observabilidade e custos", "Monitore, registre e controle os custos de aplicações na nuvem.",
      ["Logs estruturados (JSON) centralizados", "Métricas e traces (OpenTelemetry)", "Alertas baseados em SLO", "FinOps: monitore e otimize gastos"],
      "import logging, json\nlogging.basicConfig(level=logging.INFO)\nlogging.info(json.dumps({'evento': 'pedido', 'id': 123, 'valor': 99.9}))",
      ["Defina alertas antes do incidente", "Marque recursos com tags para rastrear custo"], "https://opentelemetry.io/docs/languages/python/"],
  ]],

  ["POO Avançada em Python", "Engenharia de Software", "avancado", "POO", [
    ["Dunder methods e modelo de dados", "Métodos especiais (dunder) integram seus objetos à linguagem: operadores, iteração e contexto.",
      ["__init__, __repr__, __eq__ e __hash__", "__len__, __getitem__, __iter__ para coleções", "__enter__/__exit__ para context managers", "Sobrecarga de operadores com __add__ etc."],
      "class Vetor:\n    def __init__(self, x, y): self.x, self.y = x, y\n    def __add__(self, o): return Vetor(self.x + o.x, self.y + o.y)\n    def __repr__(self): return f'Vetor({self.x}, {self.y})'\n\nprint(Vetor(1, 2) + Vetor(3, 4))",
      ["Implemente __repr__ em toda classe", "__eq__ e __hash__ andam juntos"], "https://docs.python.org/3/reference/datamodel.html"],
    ["Properties, descritores e slots", "Controle de acesso a atributos e otimização de memória.",
      ["@property cria getters/setters pythônicos", "Descritores reutilizam lógica de atributos", "__slots__ economiza memória", "Validação no setter"],
      "class Conta:\n    def __init__(self): self._saldo = 0\n    @property\n    def saldo(self): return self._saldo\n    @saldo.setter\n    def saldo(self, v):\n        if v < 0: raise ValueError('negativo')\n        self._saldo = v",
      ["Use property só quando há lógica real", "__slots__ em classes com muitas instâncias"], "https://docs.python.org/3/howto/descriptor.html"],
    ["Herança, mixins e ABCs", "Estruture hierarquias com classes abstratas, mixins e composição.",
      ["ABCs definem interfaces com @abstractmethod", "Mixins adicionam comportamento reutilizável", "MRO e super() em herança múltipla", "Prefira composição a herança profunda"],
      "from abc import ABC, abstractmethod\n\nclass Notificador(ABC):\n    @abstractmethod\n    def enviar(self, msg: str) -> None: ...\n\nclass Email(Notificador):\n    def enviar(self, msg): print('email:', msg)",
      ["Composição costuma vencer herança", "Use ABCs para contratos claros"], "https://docs.python.org/3/library/abc.html"],
  ]],

  ["SOLID Avançado e Design Patterns", "Arquitetura", "avancado", "Arquitetura", [
    ["SOLID na prática", "Os cinco princípios SOLID guiam um design orientado a objetos sustentável.",
      ["SRP: uma única razão para mudar por classe", "OCP: aberto p/ extensão, fechado p/ modificação", "LSP: subtipos substituíveis", "ISP e DIP: interfaces enxutas e inversão de dependência"],
      "from typing import Protocol\n\nclass Repo(Protocol):\n    def salvar(self, x) -> None: ...\n\nclass Servico:\n    def __init__(self, repo: Repo):  # DIP: depende da abstração\n        self.repo = repo",
      ["Aplique SOLID onde há mudança real", "Não exagere: comece simples"], "https://en.wikipedia.org/wiki/SOLID"],
    ["Padrões criacionais e estruturais", "Design patterns são soluções reutilizáveis para problemas recorrentes.",
      ["Factory e Builder para criação flexível", "Adapter e Facade para integração", "Strategy para algoritmos intercambiáveis", "Em Python, funções muitas vezes bastam"],
      "class PagamentoPix:\n    def pagar(self, v): print('pix', v)\nclass PagamentoCartao:\n    def pagar(self, v): print('cartão', v)\n\ndef checkout(metodo, valor):  # Strategy\n    metodo.pagar(valor)",
      ["Use o padrão certo, não todos", "O pythônico costuma ser mais simples que o GoF clássico"], "https://refactoring.guru/design-patterns"],
    ["Arquitetura limpa e DDD", "Separe domínio, casos de uso e infraestrutura para sistemas testáveis e duráveis.",
      ["Camadas: domínio -> aplicação -> infra", "A regra de dependência aponta para dentro", "Casos de uso orquestram o domínio", "DDD: linguagem ubíqua e bounded contexts"],
      "# domínio (sem dependências externas)\nclass Pedido:\n    def confirmar(self):\n        if not self.itens: raise ValueError('vazio')\n        self.status = 'confirmado'",
      ["Mantenha o domínio livre de frameworks", "Teste casos de uso sem banco/HTTP"], "https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html"],
  ]],
  ["Streamlit e Data Apps", "Data Science", "intermediario", "Visualização", [
    ["Apps de dados em minutos", "Streamlit transforma scripts Python em web apps interativos sem HTML/JS.",
      ["st.write, st.dataframe e widgets reativos", "Reexecução do script a cada interação", "st.cache_data para evitar recomputar", "Layout com colunas, abas e sidebar"],
      "import streamlit as st\nimport pandas as pd\n\nst.title('Dashboard')\nn = st.slider('Linhas', 5, 100, 20)\ndf = pd.DataFrame({'x': range(n)})\nst.line_chart(df)",
      ["Use cache para dados e modelos pesados", "Separe lógica de dados da camada visual"], "https://docs.streamlit.io/"],
    ["Gráficos, estado e deploy", "Sessão, formulários e publicação na nuvem.",
      ["st.session_state para manter estado", "st.form para agrupar inputs", "Integração com Plotly/Altair", "Deploy no Streamlit Community Cloud"],
      "import streamlit as st\n\nif 'cont' not in st.session_state:\n    st.session_state.cont = 0\nif st.button('Somar'):\n    st.session_state.cont += 1\nst.metric('Total', st.session_state.cont)",
      ["Evite recomputar com cache e session_state", "Valide inputs antes de processar"], "https://docs.streamlit.io/library/api-reference"],
  ]],
  ["Web Scraping com Playwright", "Automação", "intermediario", "Scraping", [
    ["Automação de navegador real", "Playwright controla Chromium/Firefox/WebKit para páginas dinâmicas (JS).",
      ["Headless e headful, seletores robustos", "Espera automática por elementos", "Captura de screenshots e PDFs", "Intercepção de requisições"],
      "from playwright.sync_api import sync_playwright\n\nwith sync_playwright() as p:\n    b = p.chromium.launch()\n    pg = b.new_page()\n    pg.goto('https://example.com')\n    print(pg.title())\n    b.close()",
      ["Respeite robots.txt e termos de uso", "Use esperas explícitas, não sleep fixo"], "https://playwright.dev/python/"],
    ["Coleta resiliente e ética", "Boas práticas para scraping confiável e legal.",
      ["Rate limiting e retries com backoff", "Rotação de user-agent quando apropriado", "Parsing com selectolax/BeautifulSoup", "Armazenamento incremental dos dados"],
      "import time, random\n\ndef coletar(urls):\n    for u in urls:\n        # ... requisição ...\n        time.sleep(random.uniform(1, 3))  # educado com o servidor",
      ["Não sobrecarregue o servidor alvo", "Prefira APIs oficiais quando existirem"], "https://playwright.dev/python/docs/intro"],
  ]],
  ["Observabilidade com OpenTelemetry", "DevOps", "avancado", "Observabilidade", [
    ["Logs, métricas e traces", "Os três pilares para entender sistemas em produção.",
      ["Logs estruturados em JSON", "Métricas (contadores, histogramas)", "Traces distribuídos com spans", "Correlação por trace_id"],
      "from opentelemetry import trace\n\ntracer = trace.get_tracer(__name__)\n\nwith tracer.start_as_current_span('processar_pedido'):\n    # ... lógica instrumentada ...\n    pass",
      ["Padronize logs estruturados desde o início", "Propague o contexto entre serviços"], "https://opentelemetry.io/docs/languages/python/"],
    ["Instrumentação e dashboards", "Exporte para Prometheus, Grafana e Jaeger.",
      ["Auto-instrumentação de frameworks", "Exporters (OTLP) para coletores", "SLI/SLO e alertas", "Dashboards de latência e erros"],
      "# instrumentação automática de FastAPI\n# opentelemetry-instrument uvicorn app:app\nfrom prometheus_client import Counter\nreqs = Counter('http_requests_total', 'total de requisições')",
      ["Defina SLOs antes de criar alertas", "Evite cardinalidade alta em labels"], "https://opentelemetry.io/docs/"],
  ]],
  ["Qualidade com mypy e Ruff", "Backend", "intermediario", "Qualidade", [
    ["Checagem estática de tipos", "mypy encontra erros de tipo antes da execução.",
      ["Type hints graduais (gradual typing)", "mypy --strict para rigor máximo", "Protocolos e generics tipados", "Stubs para libs sem tipos"],
      "def media(notas: list[float]) -> float:\n    return sum(notas) / len(notas)\n\n# mypy aponta: media(['a'])  -> erro de tipo",
      ["Ative o modo strict em código novo", "Trate avisos do mypy como erros no CI"], "https://mypy.readthedocs.io/"],
    ["Lint e formatação ultrarrápidos", "Ruff substitui flake8, isort e black com performance em Rust.",
      ["Lint + format em um só tool", "Regras configuráveis em pyproject.toml", "Autofix de muitos problemas", "Integração com pre-commit e CI"],
      "# pyproject.toml\n[tool.ruff]\nline-length = 100\n[tool.ruff.lint]\nselect = ['E', 'F', 'I', 'UP']\n# ruff check --fix .  e  ruff format .",
      ["Rode ruff no pre-commit e no CI", "Padronize a config em pyproject.toml"], "https://docs.astral.sh/ruff/"],
  ]],
  ["Construindo um LLM do Zero", "Machine Learning", "avancado", "IA Generativa", [["Tokenização e vocabulário (BPE)", "Antes de treinar um modelo de linguagem, o texto vira tokens. O Byte-Pair Encoding (BPE) é o algoritmo padrão.", ["Tokens são subpalavras, não letras nem palavras inteiras", "BPE funde os pares mais frequentes iterativamente", "Vocabulário típico: 30k a 100k tokens", "tiktoken (OpenAI) e o tokenizer do HuggingFace"], "from collections import Counter\n\ndef pares(tokens):\n    return Counter(zip(tokens, tokens[1:]))\n\ntoks = list('banana')\nprint(pares(toks).most_common(1))", ["Reutilize um tokenizer treinado quando possível", "O tamanho do vocabulário afeta memória e velocidade"], "https://huggingface.co/learn/nlp-course/chapter6/5"], ["Embeddings e representação", "Cada token vira um vetor denso (embedding) que o modelo aprende durante o treino.", ["nn.Embedding mapeia id de token para vetor", "Dimensão do embedding (d_model): 256, 768, 4096", "Vetores próximos = significados próximos", "Embeddings são treináveis (aprendidos por gradiente)"], "import torch, torch.nn as nn\n\nemb = nn.Embedding(num_embeddings=50000, embedding_dim=768)\nids = torch.tensor([10, 42, 7])\nprint(emb(ids).shape)  # [3, 768]", ["Compartilhe pesos entre embedding e camada de saída", "Normalize embeddings quando fizer sentido"], "https://pytorch.org/docs/stable/generated/torch.nn.Embedding.html"], ["Self-attention", "O coração do Transformer: cada token olha para os outros e decide no que prestar atenção.", ["Query, Key e Value são projeções lineares do input", "Atenção = softmax(QK^T / sqrt(d)) V", "Máscara causal impede ver o futuro (modelos GPT)", "Complexidade O(n^2) no tamanho da sequência"], "import torch, torch.nn.functional as F\n\ndef attention(q, k, v, mask=None):\n    d = q.size(-1)\n    scores = q @ k.transpose(-2, -1) / d**0.5\n    if mask is not None:\n        scores = scores.masked_fill(mask == 0, float('-inf'))\n    return F.softmax(scores, dim=-1) @ v", ["Use máscara causal para geração autoregressiva", "Flash Attention acelera muito o treino"], "https://arxiv.org/abs/1706.03762"], ["Multi-head attention e bloco Transformer", "Várias cabeças de atenção em paralelo capturam relações diferentes; o bloco junta atenção + MLP.", ["Multi-head divide d_model em h cabeças", "Residual connections + LayerNorm estabilizam o treino", "Feed-forward (MLP) expande e contrai a dimensão", "Empilhar N blocos forma o modelo"], "import torch.nn as nn\n\nclass Bloco(nn.Module):\n    def __init__(self, d, h):\n        super().__init__()\n        self.attn = nn.MultiheadAttention(d, h, batch_first=True)\n        self.ln1, self.ln2 = nn.LayerNorm(d), nn.LayerNorm(d)\n        self.mlp = nn.Sequential(nn.Linear(d, 4*d), nn.GELU(), nn.Linear(4*d, d))\n    def forward(self, x):\n        a, _ = self.attn(self.ln1(x), self.ln1(x), self.ln1(x))\n        x = x + a\n        return x + self.mlp(self.ln2(x))", ["Pre-norm treina mais estável que post-norm", "GELU costuma superar ReLU em Transformers"], "https://nlp.seas.harvard.edu/annotated-transformer/"], ["Positional encoding", "Atenção não tem noção de ordem; a posição precisa ser injetada (senoidal ou RoPE).", ["Encoding senoidal (Transformer original)", "Embeddings de posição aprendidos (GPT-2)", "RoPE (rotary) usado em LLaMA e modelos modernos", "ALiBi como alternativa para extrapolar contexto"], "import torch, math\n\ndef pos_encoding(seq_len, d):\n    pe = torch.zeros(seq_len, d)\n    pos = torch.arange(seq_len).unsqueeze(1)\n    div = torch.exp(torch.arange(0, d, 2) * -(math.log(10000)/d))\n    pe[:, 0::2] = torch.sin(pos*div)\n    pe[:, 1::2] = torch.cos(pos*div)\n    return pe", ["RoPE generaliza melhor para sequências longas", "Some o encoding aos embeddings antes do primeiro bloco"], "https://arxiv.org/abs/2104.09864"], ["Loop de treino com PyTorch", "Treinar = prever o próximo token e minimizar a cross-entropy em muitos textos.", ["Objetivo: prever token t+1 dado tokens até t", "Loss = cross-entropy entre logits e o próximo token", "Otimizador AdamW + warmup + cosine decay", "Gradient clipping evita explosão de gradiente"], "import torch.nn.functional as F\n\nfor x, y in loader:  # y = x deslocado em 1\n    logits = model(x)\n    loss = F.cross_entropy(logits.view(-1, V), y.view(-1))\n    loss.backward()\n    torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)\n    opt.step(); opt.zero_grad()", ["Comece pequeno (nanoGPT) para entender o fluxo", "Monitore a loss de validação para overfitting"], "https://github.com/karpathy/nanoGPT"], ["Pré-treino, fine-tuning e LoRA", "Pré-treino aprende linguagem geral; fine-tuning especializa. LoRA torna isso barato.", ["Pré-treino: muito texto, caro, feito uma vez", "Fine-tuning supervisionado (SFT) com pares instrução-resposta", "LoRA treina matrizes de baixa rank, congelando o resto", "QLoRA: LoRA + quantização em 4 bits"], "from peft import LoraConfig, get_peft_model\n\ncfg = LoraConfig(r=8, lora_alpha=16, target_modules=['q_proj','v_proj'])\nmodel = get_peft_model(base_model, cfg)\nmodel.print_trainable_parameters()", ["LoRA permite treinar 7B+ numa GPU de consumo", "Salve só os adaptadores, não o modelo inteiro"], "https://huggingface.co/docs/peft"], ["Alinhamento (RLHF/DPO) e geração", "Depois do SFT, alinhar o modelo às preferências humanas e gerar texto com sampling.", ["RLHF: modelo de recompensa + PPO", "DPO: alinhamento direto, mais simples que RLHF", "Geração: greedy, temperatura, top-k, top-p", "Guardrails e avaliação antes de produzir"], "import torch.nn.functional as F\n\ndef sample(logits, temperatura=0.8):\n    probs = F.softmax(logits / temperatura, dim=-1)\n    return torch.multinomial(probs, 1)", ["DPO virou padrão por ser estável e barato", "Avalie sempre com um conjunto de testes próprio"], "https://arxiv.org/abs/2305.18290"], ["Quantização, inferência e servir", "Para usar o modelo em produção: quantizar, otimizar e servir com alta vazão.", ["Quantização 8/4 bits reduz memória drasticamente", "KV cache acelera a geração autoregressiva", "vLLM e TGI servem com batching contínuo", "GGUF/llama.cpp roda em CPU e dispositivos locais"], "from vllm import LLM, SamplingParams\n\nllm = LLM(model='meta-llama/Llama-3.1-8B')\nout = llm.generate(['Explique atenção:'], SamplingParams(max_tokens=128))\nprint(out[0].outputs[0].text)", ["KV cache é essencial para latência baixa", "Quantize para caber na sua GPU sem perder muito"], "https://docs.vllm.ai/"]]],

  // ───────── Web Full-Stack com Python ─────────
  ["Django na Prática", "Web", "intermediario", "Web Framework", [
    ["Models, ORM e migrations", "Django é um framework 'baterias inclusas': ORM, admin, auth e mais. Tudo começa pelos models.",
      ["models.Model mapeia classes para tabelas", "makemigrations e migrate versionam o schema", "QuerySets são lazy e encadeáveis", "select_related/prefetch_related evitam o N+1"],
      "from django.db import models\n\nclass Post(models.Model):\n    titulo = models.CharField(max_length=200)\n    corpo = models.TextField()\n    criado = models.DateTimeField(auto_now_add=True)\n    autor = models.ForeignKey('auth.User', on_delete=models.CASCADE)\n\n    def __str__(self):\n        return self.titulo",
      ["Use migrations sempre — nunca altere o schema na mão", "Defina __str__ para objetos legíveis no admin"], "https://docs.djangoproject.com/en/stable/topics/db/models/"],
    ["Views, URLs e templates", "O ciclo request→view→response, com roteamento por URLconf e renderização de templates.",
      ["Function-based e class-based views", "URLconf com path() e nomes de rota", "Templates com herança ({% extends %})", "Context processors injetam dados globais"],
      "from django.shortcuts import render, get_object_or_404\nfrom .models import Post\n\ndef detalhe(request, pk):\n    post = get_object_or_404(Post, pk=pk)\n    return render(request, 'blog/detalhe.html', {'post': post})",
      ["Prefira get_object_or_404 a try/except manual", "Mantenha a lógica de negócio fora dos templates"], "https://docs.djangoproject.com/en/stable/topics/http/views/"],
    ["Forms, auth e admin", "Validação com Forms, autenticação pronta e o admin gerado automaticamente.",
      ["ModelForm gera formulários a partir de models", "Sistema de auth (login, permissões, grupos)", "admin.site.register expõe CRUD instantâneo", "CSRF e validação de formulário embutidos"],
      "from django.contrib import admin\nfrom .models import Post\n\n@admin.register(Post)\nclass PostAdmin(admin.ModelAdmin):\n    list_display = ('titulo', 'autor', 'criado')\n    search_fields = ('titulo',)",
      ["Nunca desative o CSRF em formulários de mutação", "Use o admin para operações internas, não como API pública"], "https://docs.djangoproject.com/en/stable/ref/contrib/admin/"],
  ]],
  ["Flask e APIs Leves", "Web", "intermediario", "Web Framework", [
    ["Rotas, blueprints e contexto", "Flask é minimalista e flexível — você monta só o que precisa.",
      ["@app.route define rotas e métodos HTTP", "Blueprints organizam apps grandes em módulos", "request/session/g para o contexto da requisição", "jsonify para respostas JSON"],
      "from flask import Flask, jsonify, request\napp = Flask(__name__)\n\n@app.post('/eco')\ndef eco():\n    dados = request.get_json()\n    return jsonify(recebido=dados), 201",
      ["Use blueprints assim que o app crescer", "Valide o corpo da requisição antes de usá-lo"], "https://flask.palletsprojects.com/"],
    ["Templates Jinja e formulários", "Renderização server-side com Jinja2 e formulários seguros.",
      ["Jinja2: variáveis, filtros, loops e herança", "url_for evita URLs hardcoded", "Flask-WTF para forms com CSRF", "Flash messages para feedback"],
      "from flask import render_template\n\n@app.get('/')\ndef home():\n    return render_template('home.html', titulo='PyTrack')",
      ["Escape de saída é automático no Jinja — não desative", "Centralize layout com um template base"], "https://jinja.palletsprojects.com/"],
    ["Deploy com Gunicorn e produção", "Servir Flask de forma robusta com um WSGI server e boas práticas.",
      ["Gunicorn como servidor WSGI de produção", "Variáveis de ambiente para config (12-factor)", "Proxy reverso (Nginx) à frente", "Healthcheck e logs estruturados"],
      "# gunicorn -w 4 -b 0.0.0.0:8000 app:app\nimport os\napp.config['SECRET_KEY'] = os.environ['SECRET_KEY']",
      ["Nunca rode o servidor de desenvolvimento em produção", "Mantenha segredos fora do código"], "https://docs.gunicorn.org/"],
  ]],
  ["HTMX e Frontend Hipermídia", "Web", "intermediario", "Frontend", [
    ["Interatividade sem SPA", "HTMX adiciona AJAX, swaps e eventos via atributos HTML — sem escrever JavaScript.",
      ["hx-get/hx-post disparam requisições", "hx-target e hx-swap atualizam pedaços da página", "O servidor responde com HTML, não JSON", "Progressive enhancement: funciona sem JS"],
      "<button hx-post=\"/curtir/42\"\n        hx-target=\"#contador\"\n        hx-swap=\"innerHTML\">\n  Curtir\n</button>\n<span id=\"contador\">10</span>",
      ["Responda com fragmentos HTML pequenos e focados", "Use no-JS como linha de base e melhore progressivamente"], "https://htmx.org/docs/"],
    ["Padrões com Django/Flask", "Combinar HTMX com templates server-side gera apps reativos e simples.",
      ["Endpoints que retornam parciais de template", "hx-trigger para eventos (load, change, intervalo)", "Indicadores de loading com hx-indicator", "Boosting de links e formulários"],
      "# Flask: retorna só o fragmento\n@app.post('/curtir/<int:id>')\ndef curtir(id):\n    n = incrementar(id)\n    return f'<span id=\"contador\">{n}</span>'",
      ["Reaproveite parciais entre página cheia e resposta HTMX", "Cuide do CSRF também nas requisições HTMX"], "https://htmx.org/examples/"],
  ]],

  // ───────── Testes & Qualidade (QA) ─────────
  ["Pytest Avançado e TDD", "Qualidade", "intermediario", "Testes", [
    ["Fixtures, parametrização e escopo", "Pytest escala de testes simples a suítes complexas com fixtures reutilizáveis.",
      ["@pytest.fixture injeta dependências nos testes", "scope (function/module/session) controla o ciclo de vida", "@pytest.mark.parametrize roda o mesmo teste com vários dados", "conftest.py compartilha fixtures entre arquivos"],
      "import pytest\n\n@pytest.fixture\ndef carrinho():\n    return Carrinho()\n\n@pytest.mark.parametrize('itens,total', [([10,20],30), ([],0)])\ndef test_total(carrinho, itens, total):\n    for i in itens: carrinho.add(i)\n    assert carrinho.total() == total",
      ["Fixtures pequenas e compostas são melhores que setups gigantes", "Parametrize para cobrir casos de borda sem duplicar código"], "https://docs.pytest.org/"],
    ["TDD: o ciclo red-green-refactor", "Test-Driven Development guia o design escrevendo o teste antes do código.",
      ["Red: escreva um teste que falha", "Green: o código mínimo para passar", "Refactor: melhore sem quebrar os testes", "Testes viram especificação executável"],
      "# 1) Red\ndef test_soma():\n    assert soma(2, 3) == 5  # soma ainda não existe\n\n# 2) Green\ndef soma(a, b):\n    return a + b\n\n# 3) Refactor com a rede de segurança dos testes",
      ["Escreva o menor teste que captura o próximo comportamento", "Refatore só com a suíte verde"], "https://docs.pytest.org/en/stable/explanation/goodpractices.html"],
    ["Mocks, cobertura e CI", "Isolar dependências externas, medir cobertura e rodar tudo no pipeline.",
      ["monkeypatch e unittest.mock para isolar I/O", "pytest-cov mede cobertura de linhas/branches", "Marcadores para separar unit/integration", "Falhe o CI abaixo de um limite de cobertura"],
      "def test_envia(monkeypatch):\n    chamadas = []\n    monkeypatch.setattr('app.smtp.send', lambda m: chamadas.append(m))\n    notificar('oi')\n    assert chamadas == ['oi']",
      ["Mocke a borda (rede, disco), não a sua lógica", "Cobertura é um piso, não uma garantia de qualidade"], "https://pytest-cov.readthedocs.io/"],
  ]],
  ["Testes de Carga, Propriedade e Mutação", "Qualidade", "avancado", "Testes", [
    ["Property-based com Hypothesis", "Em vez de exemplos fixos, gere centenas de entradas e teste invariantes.",
      ["@given gera dados aleatórios estruturados", "Strategies descrevem o espaço de entradas", "Hypothesis encolhe (shrink) o contra-exemplo mínimo", "Ótimo para encontrar casos de borda esquecidos"],
      "from hypothesis import given, strategies as st\n\n@given(st.lists(st.integers()))\ndef test_reverso_duplo(xs):\n    assert list(reversed(list(reversed(xs)))) == xs",
      ["Teste invariantes (propriedades), não saídas exatas", "Deixe o Hypothesis achar o menor caso que quebra"], "https://hypothesis.readthedocs.io/"],
    ["Carga com Locust e mutação", "Meça o sistema sob carga e avalie a qualidade da própria suíte de testes.",
      ["Locust simula milhares de usuários em Python", "Métricas: throughput, latência p95/p99, erros", "Mutation testing (mutmut) muda o código e vê se os testes pegam", "Testes que sobrevivem a mutações são fracos"],
      "from locust import HttpUser, task\n\nclass Usuario(HttpUser):\n    @task\n    def home(self):\n        self.client.get('/')",
      ["Teste carga em ambiente parecido com produção", "Mutation score revela testes que não testam nada"], "https://locust.io/"],
  ]],

  // ───────── Performance & Otimização ─────────
  ["Profiling e Otimização de Python", "Performance & Async", "avancado", "Performance", [
    ["Medir antes de otimizar", "Otimização sem medição é chute. Profile primeiro, depois aja no gargalo real.",
      ["cProfile mostra onde o tempo é gasto", "timeit mede trechos pequenos com precisão", "py-spy faz profiling de produção sem parar o app", "A regra: 90% do tempo está em 10% do código"],
      "import cProfile\n\ncProfile.run('processar(dados)', sort='cumulative')\n# ou: python -m cProfile -s cumulative script.py",
      ["Nunca otimize sem um profile na mão", "Otimize o gargalo medido, não o que você 'acha'"], "https://docs.python.org/3/library/profile.html"],
    ["Estruturas e algoritmos certos", "A maior otimização quase sempre é trocar a estrutura de dados ou o algoritmo.",
      ["set/dict para busca O(1) vs list O(n)", "collections (deque, Counter, defaultdict)", "Geradores poupam memória em grandes volumes", "Big-O domina constantes em escala"],
      "# Lento: O(n) por busca\nif x in lista: ...\n# Rápido: O(1)\nvistos = set(lista)\nif x in vistos: ...",
      ["Escolha a estrutura pelo padrão de acesso", "Meça memória além de tempo"], "https://wiki.python.org/moin/TimeComplexity"],
    ["Paralelismo: threads, processos e async", "Escapar do GIL quando faz sentido e escolher o modelo de concorrência certo.",
      ["GIL serializa bytecode — threads não aceleram CPU", "multiprocessing para trabalho CPU-bound", "asyncio para I/O-bound concorrente", "concurrent.futures unifica a API"],
      "from concurrent.futures import ProcessPoolExecutor\n\nwith ProcessPoolExecutor() as ex:\n    resultados = list(ex.map(tarefa_pesada, itens))",
      ["CPU-bound → processos; I/O-bound → async/threads", "Meça: paralelizar tem custo de coordenação"], "https://docs.python.org/3/library/concurrent.futures.html"],
  ]],
  ["Cython, Extensões C e CPython", "Performance & Async", "avancado", "Performance", [
    ["Acelerando com Cython", "Cython compila Python anotado para C, ganhando ordens de magnitude em loops numéricos.",
      ["Tipos estáticos (cdef) removem overhead", "Compilação para módulo de extensão", "Libera o GIL em seções numéricas", "Ótimo para hot loops já identificados no profile"],
      "# arquivo.pyx\ncdef double soma_quadrados(int n):\n    cdef double s = 0\n    cdef int i\n    for i in range(n):\n        s += i * i\n    return s",
      ["Cythonize só o gargalo, não o programa todo", "Meça o ganho real antes de manter a complexidade"], "https://cython.org/"],
    ["CPython por dentro", "Entender o interpretador explica o desempenho e os limites do Python.",
      ["Tudo é objeto (PyObject) com contagem de referência", "Bytecode executado pela máquina virtual (ceval)", "GIL protege o gerenciamento de memória", "dis mostra o bytecode de qualquer função"],
      "import dis\n\ndef f(x):\n    return x + 1\n\ndis.dis(f)  # mostra LOAD_FAST, BINARY_OP, RETURN_VALUE...",
      ["Use dis para entender por que algo é lento", "Conheça as otimizações do CPython (ex.: interning de ints)"], "https://docs.python.org/3/library/dis.html"],
  ]],

  // ───────── MLOps & IA em Produção ─────────
  ["MLOps: Deploy e Serving de Modelos", "MLOps", "avancado", "MLOps", [
    ["Empacotar e servir um modelo", "Tirar um modelo do notebook e colocá-lo atrás de uma API confiável.",
      ["Serialização com joblib/pickle ou ONNX", "API de inferência com FastAPI", "Validação de entrada com Pydantic", "Versionar o modelo junto com o código"],
      "from fastapi import FastAPI\nimport joblib\n\nmodelo = joblib.load('modelo.pkl')\napp = FastAPI()\n\n@app.post('/prever')\ndef prever(features: list[float]):\n    return {'classe': int(modelo.predict([features])[0])}",
      ["Valide e normalize a entrada igual ao treino", "Fixe versões de libs — modelo e ambiente andam juntos"], "https://fastapi.tiangolo.com/"],
    ["Rastreamento de experimentos", "Reproduzir resultados exige registrar parâmetros, métricas e artefatos.",
      ["MLflow registra params, metrics e modelos", "Model Registry versiona e promove modelos", "Reprodutibilidade: seed, dados e ambiente fixos", "Compare experimentos lado a lado"],
      "import mlflow\n\nwith mlflow.start_run():\n    mlflow.log_param('lr', 0.01)\n    mlflow.log_metric('acc', 0.93)\n    mlflow.sklearn.log_model(modelo, 'modelo')",
      ["Registre tudo que afeta o resultado", "Promova modelos por estágio (staging → production)"], "https://mlflow.org/docs/latest/index.html"],
    ["CI/CD para machine learning", "Automatizar treino, teste e deploy de modelos com qualidade.",
      ["Pipelines que treinam e validam automaticamente", "Testes de dados (schema, distribuição)", "Gate de métrica: só promove se melhorar", "Rollback rápido quando o modelo degrada"],
      "# pseudo-pipeline\n# 1. validar dados  2. treinar  3. avaliar\n# 4. if metrica > baseline: registrar e promover\nassert acc >= baseline_acc, 'modelo pior que o atual'",
      ["Teste os dados, não só o código", "Tenha um caminho de rollback sempre pronto"], "https://ml-ops.org/"],
  ]],
  ["Monitoramento e Pipelines de ML", "MLOps", "avancado", "MLOps", [
    ["Drift e monitoramento em produção", "Modelos degradam quando o mundo muda. Monitorar é parte do MLOps.",
      ["Data drift: a distribuição de entrada mudou", "Concept drift: a relação X→y mudou", "Monitore métricas de negócio, não só técnicas", "Alertas quando a performance cai"],
      "# compara distribuição atual vs treino\nfrom scipy.stats import ks_2samp\nstat, p = ks_2samp(treino_col, producao_col)\nif p < 0.05:\n    alertar('possível data drift')",
      ["Monitore entrada, saída e métricas de negócio", "Reentreine com gatilho, não por calendário cego"], "https://evidentlyai.com/"],
    ["Orquestração de pipelines", "Pipelines de dados e ML precisam de orquestração confiável e observável.",
      ["DAGs definem dependências entre tarefas", "Airflow/Prefect/Dagster agendam e monitoram", "Retries, alertas e backfill", "Idempotência: rodar de novo não corrompe"],
      "from prefect import flow, task\n\n@task\ndef extrair(): ...\n@task\ndef treinar(d): ...\n\n@flow\ndef pipeline():\n    treinar(extrair())",
      ["Tarefas idempotentes facilitam reprocessar", "Observabilidade no pipeline economiza horas de debug"], "https://docs.prefect.io/"],
  ]],

  // ───────── Agentes de IA & Automação com LLMs ─────────
  ["RAG: Geração Aumentada por Recuperação", "IA Generativa", "avancado", "LLMs Aplicados", [
    ["Embeddings e busca semântica", "RAG dá ao LLM acesso aos seus dados buscando trechos relevantes por significado.",
      ["Embeddings transformam texto em vetores", "Busca por similaridade (cosseno) acha trechos relevantes", "Vector DBs: FAISS, Chroma, pgvector", "Chunking: dividir documentos em pedaços úteis"],
      "from sentence_transformers import SentenceTransformer\nimport numpy as np\n\nm = SentenceTransformer('all-MiniLM-L6-v2')\nvs = m.encode(['gato', 'felino', 'carro'])\nprint(np.dot(vs[0], vs[1]))  # alto: gato~felino",
      ["Ajuste o tamanho do chunk ao seu conteúdo", "Guarde metadados junto dos vetores para filtrar"], "https://www.sbert.net/"],
    ["Montando o pipeline RAG", "Recuperar contexto, montar o prompt e gerar a resposta fundamentada.",
      ["Indexar: documentos → chunks → embeddings → DB", "Recuperar: top-k trechos mais similares à pergunta", "Aumentar: injetar trechos no prompt do LLM", "Gerar: resposta citando as fontes"],
      "def responder(pergunta, db, llm):\n    trechos = db.buscar(pergunta, k=4)\n    contexto = '\\n'.join(trechos)\n    prompt = f'Contexto:\\n{contexto}\\n\\nPergunta: {pergunta}'\n    return llm(prompt)",
      ["Cite as fontes para o usuário confiar", "Recupere o suficiente, sem estourar a janela de contexto"], "https://python.langchain.com/docs/tutorials/rag/"],
    ["Avaliação e qualidade do RAG", "Sem avaliação, você não sabe se o RAG ajuda ou alucina.",
      ["Relevância da recuperação (recall@k)", "Fidelidade: a resposta vem do contexto?", "Frameworks: RAGAS, DeepEval", "Conjunto de perguntas-resposta de referência"],
      "# métrica simples de recuperação\ndef recall_at_k(esperados, recuperados, k):\n    return len(set(esperados) & set(recuperados[:k])) / len(esperados)",
      ["Monte um dataset de avaliação cedo", "Meça recuperação e geração separadamente"], "https://docs.ragas.io/"],
  ]],
  ["Agentes de IA com Tool Use", "IA Generativa", "avancado", "LLMs Aplicados", [
    ["Tool use e function calling", "Um agente é um LLM que decide chamar ferramentas (funções) para agir no mundo.",
      ["O modelo escolhe a função e os argumentos", "Você define ferramentas com schema (nome, params)", "O loop: pensar → chamar tool → observar → repetir", "Ferramentas: busca, código, APIs, banco de dados"],
      "def buscar_clima(cidade: str) -> str:\n    '''Retorna o clima atual de uma cidade.'''\n    return consultar_api(cidade)\n\n# o LLM recebe o schema e decide chamar buscar_clima('SP')",
      ["Descreva bem cada ferramenta — o modelo lê a docstring", "Valide os argumentos antes de executar a ação"], "https://docs.anthropic.com/en/docs/build-with-claude/tool-use"],
    ["Padrões de agentes e orquestração", "Do agente único a sistemas multi-agente com memória e planejamento.",
      ["ReAct: alterna raciocínio e ação", "Memória de curto e longo prazo", "Planejar-executar para tarefas complexas", "Multi-agente: especialistas que colaboram"],
      "while not tarefa.concluida:\n    pensamento = llm.pensar(estado)\n    acao = pensamento.acao\n    obs = executar(acao)\n    estado.adicionar(obs)",
      ["Limite o número de passos para evitar loops infinitos", "Comece com um agente simples antes de multi-agente"], "https://www.anthropic.com/research/building-effective-agents"],
    ["Segurança e guardrails", "Agentes que agem no mundo precisam de limites, validação e supervisão.",
      ["Sandbox para execução de código/ferramentas", "Allowlist de ações permitidas", "Human-in-the-loop para ações irreversíveis", "Limites de custo, tempo e taxa"],
      "ACOES_PERMITIDAS = {'buscar', 'ler'}\n\ndef executar(acao):\n    if acao.nome not in ACOES_PERMITIDAS:\n        raise PermissionError(acao.nome)\n    return acao.run()",
      ["Peça confirmação humana para ações destrutivas", "Nunca dê ao agente mais permissão do que a tarefa exige"], "https://www.anthropic.com/research/building-effective-agents"],
  ]],

  // ───────── Computação Científica & Simulação ─────────
  ["SciPy, Simulação e Monte Carlo", "Computação Científica", "avancado", "Científico", [
    ["SciPy: otimização e álgebra", "SciPy estende o NumPy com algoritmos científicos de alto nível.",
      ["optimize: minimização e ajuste de curvas", "integrate: integração numérica e EDOs", "stats: distribuições e testes de hipótese", "linalg/sparse para álgebra avançada"],
      "from scipy import optimize\n\ndef f(x):\n    return (x - 3) ** 2\n\nres = optimize.minimize(f, x0=0)\nprint(res.x)  # ~3",
      ["Escolha o algoritmo conforme o problema (convexo?)", "Forneça gradiente quando possível para convergir melhor"], "https://docs.scipy.org/doc/scipy/"],
    ["Simulação de Monte Carlo", "Resolver problemas por amostragem aleatória — de risco financeiro a física.",
      ["Amostragem aleatória para estimar valores", "Lei dos grandes números garante convergência", "Estimar π, integrais e risco", "Reprodutibilidade com seed fixa"],
      "import numpy as np\n\nrng = np.random.default_rng(42)\npontos = rng.random((1_000_000, 2))\ndentro = (pontos ** 2).sum(axis=1) <= 1\nprint(4 * dentro.mean())  # estimativa de pi",
      ["Mais amostras = menos variância (custa tempo)", "Vetorize a simulação com NumPy para velocidade"], "https://numpy.org/doc/stable/reference/random/"],
    ["Matemática simbólica com SymPy", "Quando você precisa de respostas exatas, não numéricas.",
      ["Símbolos, expressões e simplificação", "Derivadas, integrais e limites exatos", "Resolver equações algébricas e EDOs", "Gerar código a partir de fórmulas (lambdify)"],
      "import sympy as sp\n\nx = sp.symbols('x')\nexpr = sp.integrate(sp.sin(x) * x, x)\nprint(expr)  # -x*cos(x) + sin(x)",
      ["Use SymPy para deduzir, NumPy para calcular em massa", "lambdify converte fórmula simbólica em função rápida"], "https://docs.sympy.org/"],
  ]],

  // ───────── Cloud Native & Platform Engineering ─────────
  ["Kubernetes e Cloud Native para Pythonistas", "DevOps", "avancado", "Cloud Native", [
    ["Containerizar apps Python", "O primeiro passo cloud native: empacotar a app em uma imagem reprodutível.",
      ["Dockerfile multi-stage reduz a imagem final", "Imagens slim e usuário não-root", "12-factor: config por ambiente", "Healthcheck para orquestradores"],
      "FROM python:3.12-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\nCOPY . .\nUSER 1000\nCMD [\"gunicorn\", \"-b\", \"0.0.0.0:8000\", \"app:app\"]",
      ["Imagens pequenas sobem e escalam mais rápido", "Nunca rode containers como root"], "https://docs.docker.com/language/python/"],
    ["Deploy no Kubernetes", "K8s orquestra containers: escala, recupera falhas e faz rollout.",
      ["Pod, Deployment e Service", "Replicas e self-healing automático", "ConfigMap e Secret para configuração", "Readiness/liveness probes"],
      "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: api\nspec:\n  replicas: 3\n  selector:\n    matchLabels: {app: api}\n  template:\n    metadata:\n      labels: {app: api}\n    spec:\n      containers:\n      - name: api\n        image: minha-api:1.0",
      ["Defina requests/limits de CPU e memória", "Use probes para o K8s saber se o pod está saudável"], "https://kubernetes.io/docs/home/"],
    ["Infra como código com Python", "Provisionar nuvem de forma versionada e reproduzível usando Python.",
      ["Pulumi escreve infraestrutura em Python puro", "Estado versionado e previews antes de aplicar", "Reutilização com funções e classes", "Mesma linguagem para app e infra"],
      "import pulumi\nimport pulumi_aws as aws\n\nbucket = aws.s3.Bucket('dados')\npulumi.export('bucket', bucket.id)",
      ["Versione a infra junto com o código", "Sempre revise o preview antes de aplicar em produção"], "https://www.pulumi.com/docs/"],
  ]],

];

// limpa e regera
if (existsSync(BASE)) rmSync(BASE, { recursive: true, force: true });
mkdirSync(BASE, { recursive: true });

const extraModules = [];
let order = 100;

M.forEach(([title, area, level, category, lessons], mi) => {
  const folder = slug(title);
  const dir = join(BASE, folder);
  mkdirSync(dir, { recursive: true });

  const lessonObjs = lessons.map(([t, s, p, c, bp, d], li) => {
    // Template pedagógico enriquecido: cada seção é construída a partir dos
    // dados reais da lição (pontos, código, boas práticas) — sem texto genérico.
    let md = `# ${t}\n\n${s}\n\n`;
    md += `> **Tema:** ${category} · **Nível:** ${level} · **Trilha:** ${title}\n\n`;

    md += `## Conceitos-chave\n\nNesta lição você vai entender:\n\n`;
    md += p.map((x) => `- **${x}**`).join("\n") + "\n\n";

    if (c) {
      md += "## Exemplo prático\n\n```python\n" + c + "\n```\n\n";
      md +=
        "Leia o exemplo linha a linha e rode-o no seu ambiente. " +
        "Em seguida, altere os valores e observe o que muda — entender *por que* " +
        "o código se comporta assim vale mais do que decorar a sintaxe.\n\n";
    }

    if (bp?.length) {
      md += `## Boas práticas\n\n` + bp.map((x) => `- ${x}`).join("\n") + "\n\n";
    }

    // Exercício específico, montado a partir dos pontos e boas práticas reais
    const p0 = p[0] ? p[0].toLowerCase() : "o conceito principal";
    const p1 = p[1] ? p[1].toLowerCase() : p0;
    md += `## Pratique\n\n`;
    md +=
      `Para fixar, escreva um pequeno script que combine **${p0}** e ` +
      `**${p1}** em um caso do seu dia a dia.` +
      (bp?.length ? ` Depois refatore aplicando "${bp[0]}".` : "") +
      `\n\nDesafio extra: explique, em uma frase, quando **não** usar esta ` +
      `abordagem — saber os limites de uma ferramenta é tão importante quanto ` +
      `saber usá-la.\n\n`;

    // Checklist de autoavaliação derivado dos pontos
    md += `## Checklist de domínio\n\nVocê domina esta lição quando consegue:\n\n`;
    md += p.map((x) => `- [ ] Explicar e aplicar: ${x}`).join("\n") + "\n\n";

    if (d) md += `## Saiba mais\n\n- [Documentação oficial](${d})\n`;

    const fname = `${String(li + 1).padStart(2, "0")}_${slug(t)}.md`;
    const rel = `doc/Conteudos/Ecossistema/${folder}/${fname}`;
    writeFileSync(join(dir, fname), md);
    return { slug: slug(t), title: t, file: rel, order: li + 1 };
  });

  writeFileSync(
    join(dir, "README.md"),
    `# ${title}\n\nTrilha do ecossistema Python sobre ${title.toLowerCase()}.\n`,
  );

  order += 1;
  extraModules.push({
    slug: `ext-${folder}`,
    title,
    description: `Trilha prática e direta sobre ${title.toLowerCase()}, com pontos-chave, exemplos de código e boas práticas.`,
    part: 11,
    partLabel: "Ecossistema",
    folder,
    area,
    level,
    category,
    orderIndex: order,
    estimatedHours: Math.max(4, lessonObjs.length * 3),
    lessons: lessonObjs,
  });
});

// manifest extra (TS)
const ts = `// GERADO por scripts/gen-ecosystem-content.mjs — não edite à mão.\nimport type { ContentModule } from "./manifest";\n\nexport const EXTRA_MODULES: ContentModule[] = ${JSON.stringify(extraModules, null, 2)};\n`;
writeFileSync(join(ROOT, "lib", "content", "extra-manifest.ts"), ts);

// SQL (insert append)
const esc = (s) => String(s ?? "").replace(/'/g, "''");
const rows = extraModules
  .map((m) => `('${esc(m.title)}', '${esc(m.description)}', '${esc(m.category)}', '${m.level}', '${esc(m.area)}', ${m.orderIndex}, ${m.estimatedHours}, '${m.slug}', ${m.lessons.length})`)
  .join(",\n");
// upsert por slug (não-destrutivo): preserva os ids e o progresso já gravado
const sql = `-- GERADO por gen-ecosystem-content.mjs\ninsert into public.contents\n  (title, description, category, level, area, order_index, estimated_hours, slug, lessons_count)\nvalues\n${rows}\non conflict (slug) where slug is not null do update set\n  title=excluded.title, description=excluded.description, category=excluded.category,\n  level=excluded.level, area=excluded.area, order_index=excluded.order_index,\n  estimated_hours=excluded.estimated_hours, lessons_count=excluded.lessons_count;\n`;
writeFileSync(join(ROOT, "supabase", "contents_extra.sql"), sql);

const totalLessons = extraModules.reduce((a, m) => a + m.lessons.length, 0);
console.log(`Módulos extras: ${extraModules.length} | lições: ${totalLessons}`);
console.log("Áreas:", [...new Set(extraModules.map((m) => m.area))].join(", "));
