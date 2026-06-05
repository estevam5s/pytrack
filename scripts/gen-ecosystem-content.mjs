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
    let md = `# ${t}\n\n${s}\n\n`;
    md += `## Pontos-chave\n\n` + p.map((x) => `- ${x}`).join("\n") + "\n\n";
    if (c) md += "## Exemplo\n\n```python\n" + c + "\n```\n\n";
    if (bp?.length) md += `## Boas práticas\n\n` + bp.map((x) => `- ${x}`).join("\n") + "\n\n";
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
const sql = `-- GERADO por gen-ecosystem-content.mjs\ndelete from public.contents where slug like 'ext-%';\ninsert into public.contents\n  (title, description, category, level, area, order_index, estimated_hours, slug, lessons_count)\nvalues\n${rows};\n`;
writeFileSync(join(ROOT, "supabase", "contents_extra.sql"), sql);

const totalLessons = extraModules.reduce((a, m) => a + m.lessons.length, 0);
console.log(`Módulos extras: ${extraModules.length} | lições: ${totalLessons}`);
console.log("Áreas:", [...new Set(extraModules.map((m) => m.area))].join(", "));
