-- =====================================================================
-- Expansão do ecossistema Python: mais stack_items e career_paths
-- Derivado de doc/Conteudos (Async, Data Science, APIs, DevOps, Segurança...)
-- Idempotente: remove os extras antes de reinserir.
-- =====================================================================

delete from public.stack_items where name in (
  'Pydantic','SQLModel','Alembic','Polars','DuckDB','SciPy','Plotly','scikit-learn',
  'PyTorch','Hugging Face','Celery','RabbitMQ','Kafka','Redis','asyncio','httpx',
  'Scrapy','Playwright','BeautifulSoup','Typer','Rich','Ruff','mypy','Black',
  'Prometheus','Grafana','OpenTelemetry','Sentry','Kubernetes','Terraform',
  'GitHub Actions','Nginx','Gunicorn','Uvicorn','GraphQL','gRPC','WebSockets',
  'Streamlit','OpenCV','paho-mqtt'
);

insert into public.stack_items (name, description, category, level, documentation_url, icon) values
-- Linguagem & qualidade
('Pydantic', 'Validação de dados e settings com type hints — base de FastAPI.', 'Web/APIs', 'intermediario', 'https://docs.pydantic.dev/', 'zap'),
('Ruff', 'Linter e formatador extremamente rápido para Python.', 'Qualidade', 'intermediario', 'https://docs.astral.sh/ruff/', 'check-check'),
('mypy', 'Checagem estática de tipos para Python.', 'Qualidade', 'intermediario', 'https://mypy.readthedocs.io/', 'check-check'),
('Black', 'Formatador de código opinativo e determinístico.', 'Qualidade', 'basico', 'https://black.readthedocs.io/', 'check-check'),
('Typer', 'CLIs modernas com type hints, sobre o Click.', 'Automação', 'basico', 'https://typer.tiangolo.com/', 'code'),
('Rich', 'Saída de terminal bonita: tabelas, progresso, logs e markdown.', 'Automação', 'basico', 'https://rich.readthedocs.io/', 'code'),
-- APIs & comunicação
('GraphQL', 'Linguagem de consulta para APIs (Strawberry, Graphene, Ariadne).', 'Web/APIs', 'avancado', 'https://strawberry.rocks/', 'zap'),
('gRPC', 'RPC binário de alto desempenho com contratos protobuf.', 'Web/APIs', 'avancado', 'https://grpc.io/docs/languages/python/', 'zap'),
('WebSockets', 'Comunicação bidirecional em tempo real.', 'Web/APIs', 'intermediario', 'https://websockets.readthedocs.io/', 'radio'),
('httpx', 'Cliente HTTP moderno com suporte sync e async.', 'Web/APIs', 'intermediario', 'https://www.python-httpx.org/', 'zap'),
-- Banco & ORM
('SQLModel', 'Une SQLAlchemy e Pydantic para APIs modernas.', 'Banco de Dados', 'intermediario', 'https://sqlmodel.tiangolo.com/', 'database'),
('Alembic', 'Migrations versionadas para SQLAlchemy.', 'Banco de Dados', 'intermediario', 'https://alembic.sqlalchemy.org/', 'database'),
('Redis', 'Cache, filas, locks, rate limiting e pub/sub em memória.', 'Banco de Dados', 'intermediario', 'https://redis.io/docs/', 'database'),
-- Async & mensageria
('asyncio', 'Concorrência cooperativa nativa: event loop, tasks e futures.', 'Async', 'avancado', 'https://docs.python.org/3/library/asyncio.html', 'workflow'),
('Celery', 'Workers distribuídos e ecossistema maduro de filas.', 'Async', 'avancado', 'https://docs.celeryq.dev/', 'workflow'),
('RabbitMQ', 'Broker de mensageria e filas tradicionais (AMQP).', 'Async', 'avancado', 'https://www.rabbitmq.com/', 'radio'),
('Kafka', 'Streaming durável, escalável e orientado a eventos.', 'Async', 'avancado', 'https://kafka.apache.org/documentation/', 'flame'),
-- Data Science & ML
('Polars', 'DataFrames de alta performance com execução lazy.', 'Data Science', 'intermediario', 'https://docs.pola.rs/', 'table'),
('DuckDB', 'SQL analítico local e leitura direta de Parquet/CSV.', 'Data Science', 'intermediario', 'https://duckdb.org/docs/', 'database'),
('SciPy', 'Estatística, otimização e funções científicas sobre NumPy.', 'Data Science', 'intermediario', 'https://docs.scipy.org/doc/scipy/', 'sigma'),
('Plotly', 'Gráficos interativos e dashboards.', 'Data Science', 'intermediario', 'https://plotly.com/python/', 'line-chart'),
('Streamlit', 'Apps de dados interativos em Python puro.', 'Data Science', 'basico', 'https://docs.streamlit.io/', 'bar-chart-3'),
('scikit-learn', 'Pipelines, modelos e validação de machine learning clássico.', 'Machine Learning', 'intermediario', 'https://scikit-learn.org/stable/', 'sigma'),
('PyTorch', 'Deep learning flexível com ecossistema moderno.', 'Machine Learning', 'avancado', 'https://pytorch.org/docs/', 'flame'),
('Hugging Face', 'Transformers, datasets e modelos de NLP/IA generativa.', 'Machine Learning', 'avancado', 'https://huggingface.co/docs', 'flame'),
('OpenCV', 'Processamento de imagem e visão computacional.', 'Machine Learning', 'avancado', 'https://docs.opencv.org/', 'code'),
-- Automação & scraping
('Scrapy', 'Framework de crawlers estruturados e pipelines.', 'Automação', 'intermediario', 'https://docs.scrapy.org/', 'code'),
('Playwright', 'Automação moderna de browser para testes e scraping.', 'Automação', 'intermediario', 'https://playwright.dev/python/', 'code'),
('BeautifulSoup', 'Parsing de HTML/XML para extração de dados.', 'Automação', 'basico', 'https://www.crummy.com/software/BeautifulSoup/bs4/doc/', 'code'),
('paho-mqtt', 'Cliente MQTT para IoT em Python.', 'IoT', 'intermediario', 'https://eclipse.dev/paho/', 'radio'),
-- DevOps & produção
('Kubernetes', 'Orquestração de containers em escala.', 'DevOps', 'avancado', 'https://kubernetes.io/docs/', 'container'),
('Terraform', 'Infraestrutura como código multi-cloud.', 'DevOps', 'avancado', 'https://developer.hashicorp.com/terraform/docs', 'container'),
('GitHub Actions', 'CI/CD integrado ao GitHub.', 'DevOps', 'intermediario', 'https://docs.github.com/actions', 'git-branch'),
('Nginx', 'Reverse proxy, load balancer e servidor web.', 'DevOps', 'intermediario', 'https://nginx.org/en/docs/', 'container'),
('Gunicorn', 'Servidor WSGI/ASGI para produção.', 'DevOps', 'intermediario', 'https://docs.gunicorn.org/', 'container'),
('Uvicorn', 'Servidor ASGI rápido para FastAPI/Starlette.', 'DevOps', 'intermediario', 'https://www.uvicorn.org/', 'zap'),
-- Observabilidade & segurança
('Prometheus', 'Coleta de métricas e alertas.', 'DevOps', 'avancado', 'https://prometheus.io/docs/', 'line-chart'),
('Grafana', 'Dashboards de métricas e observabilidade.', 'DevOps', 'avancado', 'https://grafana.com/docs/', 'bar-chart-3'),
('OpenTelemetry', 'Traces, métricas e logs padronizados.', 'DevOps', 'avancado', 'https://opentelemetry.io/docs/languages/python/', 'workflow'),
('Sentry', 'Monitoramento de erros de aplicação.', 'DevOps', 'intermediario', 'https://docs.sentry.io/platforms/python/', 'radio');

-- =====================================================================
-- Mais trilhas de carreira
-- =====================================================================
delete from public.career_paths where title in (
  'DevOps Engineer','Machine Learning Engineer','Cybersecurity Analyst',
  'QA / Automation Engineer','Quant Developer','Cloud / Platform Engineer'
);

insert into public.career_paths (title, description, area, skills, roadmap, technologies, salary_range, level) values
('DevOps Engineer', 'Automatiza build, deploy e operação de sistemas, garantindo entrega contínua e confiável.', 'DevOps',
  array['Docker','Kubernetes','CI/CD','IaC','Observabilidade'],
  array['Linux e redes','Containers e Docker','CI/CD e GitHub Actions','Kubernetes e Helm','Terraform e cloud','Observabilidade e SRE'],
  array['Docker','Kubernetes','Terraform','GitHub Actions','Prometheus'],
  'R$ 8.000 - R$ 20.000', 'avancado'),
('Machine Learning Engineer', 'Leva modelos de ML do notebook à produção com pipelines, serving e monitoramento.', 'Machine Learning',
  array['scikit-learn','PyTorch','MLOps','APIs','Cloud'],
  array['Python para dados','ML clássico','Deep learning','MLOps e tracking','Serving e monitoramento de drift'],
  array['scikit-learn','PyTorch','Hugging Face','FastAPI','Docker'],
  'R$ 10.000 - R$ 25.000', 'avancado'),
('Cybersecurity Analyst', 'Protege aplicações e dados, aplicando OWASP, criptografia e testes de segurança.', 'Segurança',
  array['OWASP Top 10','Criptografia','JWT/OAuth2','SAST/DAST','Hardening'],
  array['Fundamentos de segurança','Criptografia e hashing','Segurança de APIs','OWASP e vulnerabilidades','Ferramentas SAST e secrets'],
  array['cryptography','PyJWT','Bandit','pip-audit','Scapy'],
  'R$ 8.000 - R$ 22.000', 'avancado'),
('QA / Automation Engineer', 'Garante qualidade com testes automatizados, TDD, cobertura e pipelines de CI.', 'Qualidade',
  array['pytest','TDD','Mocking','Coverage','CI'],
  array['Fundamentos de testes','pytest e fixtures','Unit e integration tests','Mocking e TDD','Cobertura, benchmark e CI'],
  array['pytest','Playwright','mypy','Ruff','GitHub Actions'],
  'R$ 5.000 - R$ 14.000', 'intermediario'),
('Quant Developer', 'Modela estratégias financeiras com Python: dados de mercado, risco e backtesting.', 'Finanças',
  array['NumPy/Pandas','Séries temporais','Risco','Backtesting','Estatística'],
  array['Matemática e estatística','Dados de mercado e retornos','Séries temporais','Risco e portfólio','Backtesting e execução'],
  array['Pandas','NumPy','SciPy','Backtrader','statsmodels'],
  'R$ 10.000 - R$ 30.000', 'avancado'),
('Cloud / Platform Engineer', 'Constrói plataformas internas escaláveis e resilientes em nuvem.', 'DevOps',
  array['Cloud (AWS/GCP)','Kubernetes','IaC','Escalabilidade','Serverless'],
  array['Fundamentos de cloud','Containers e orquestração','IaC e GitOps','Escalabilidade e balanceamento','Serverless e custo'],
  array['Kubernetes','Terraform','Docker','Nginx','OpenTelemetry'],
  'R$ 10.000 - R$ 26.000', 'avancado');
