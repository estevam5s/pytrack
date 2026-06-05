# Stack Python Profissional: Guia Completo e Avancado

> Documento consolidado e curado a partir de:
> [stack.md](./stack.md), [stack_completa.md](./stack_completa.md) e [stack_completo_avancado.md](./stack_completo_avancado.md).
>
> Este arquivo nao e uma concatenacao dos tres documentos. Ele reorganiza, aprofunda e transforma o conteudo em um guia profissional para escolher, estudar e aplicar a stack Python em projetos reais.

---

## Sumario

1. [Como usar este guia](#como-usar-este-guia)
2. [Visao executiva da stack](#visao-executiva-da-stack)
3. [Fundamentos de Python](#fundamentos-de-python)
4. [Biblioteca padrao e core tooling](#biblioteca-padrao-e-core-tooling)
5. [POO, arquitetura e design](#poo-arquitetura-e-design)
6. [Estruturas de dados, algoritmos e performance](#estruturas-de-dados-algoritmos-e-performance)
7. [Arquivos, formatos e serializacao](#arquivos-formatos-e-serializacao)
8. [Web, APIs e backend](#web-apis-e-backend)
9. [Bancos de dados e persistencia](#bancos-de-dados-e-persistencia)
10. [Data Science, analytics e visualizacao](#data-science-analytics-e-visualizacao)
11. [Machine Learning, IA e MLOps](#machine-learning-ia-e-mlops)
12. [Async, concorrencia e processamento em background](#async-concorrencia-e-processamento-em-background)
13. [Automacao, CLI, scraping e bots](#automacao-cli-scraping-e-bots)
14. [DevOps, infraestrutura e deploy](#devops-infraestrutura-e-deploy)
15. [Big Data, streaming e orquestracao de dados](#big-data-streaming-e-orquestracao-de-dados)
16. [Testes, qualidade e seguranca](#testes-qualidade-e-seguranca)
17. [Observabilidade e operacao](#observabilidade-e-operacao)
18. [Full stack, desktop, mobile, games e redes](#full-stack-desktop-mobile-games-e-redes)
19. [Areas especializadas](#areas-especializadas)
20. [Stack por caso de uso](#stack-por-caso-de-uso)
21. [Matriz de decisao tecnica](#matriz-de-decisao-tecnica)
22. [Templates essenciais](#templates-essenciais)
23. [Checklists profissionais](#checklists-profissionais)
24. [Roteiro de evolucao profissional](#roteiro-de-evolucao-profissional)

---

## Como usar este guia

Use este documento como um mapa de decisao, nao como uma lista de bibliotecas para instalar todas de uma vez.

### Classificacao de prioridade

| Nivel | Significado | Quando estudar ou usar |
|---|---|---|
| Essencial | Base para praticamente qualquer trilha Python | Antes de projetos maiores |
| Recomendado | Forte diferencial para projetos profissionais | Quando ja domina o essencial |
| Especializado | Depende da area de atuacao | Quando o projeto ou carreira exigir |
| Avancado | Aumenta profundidade tecnica e senioridade | Ao trabalhar com escala, arquitetura ou performance |

### Principio de escolha

Uma stack profissional deve ser:

- Simples o bastante para ser mantida.
- Completa o bastante para resolver o problema real.
- Observavel o bastante para operar em producao.
- Testavel o bastante para evoluir sem medo.
- Segura o bastante para lidar com usuarios, dados e integracoes.

---

## Visao executiva da stack

| Area | Stack principal | Alternativas e complementos |
|---|---|---|
| Linguagem | Python 3.11+, Python 3.12+ | PyPy, CPython internals |
| Ambientes | `venv`, `pip`, `pipx`, Poetry, uv | pyenv, conda, pip-tools |
| Qualidade | Ruff, Black, mypy, pytest | Pyright, Pylint, Flake8, isort |
| Web APIs | FastAPI, Django, Flask | Starlette, Sanic, Tornado, Falcon, Quart |
| HTTP client | httpx, requests | aiohttp, urllib3 |
| Banco relacional | PostgreSQL, SQLite, MySQL | MariaDB, SQL Server, Oracle |
| ORM | SQLAlchemy, Django ORM, SQLModel | Tortoise ORM, Peewee, Pony ORM |
| NoSQL | Redis, MongoDB, Elasticsearch | Cassandra, DynamoDB, Firestore, Couchbase |
| Data Science | NumPy, Pandas, Polars, SciPy | Dask, DuckDB, Vaex, Modin |
| Visualizacao | Matplotlib, Seaborn, Plotly | Altair, Bokeh, Dash, Streamlit |
| ML | scikit-learn, XGBoost, LightGBM | CatBoost, imbalanced-learn, Feature-engine |
| Deep Learning | PyTorch, TensorFlow/Keras | JAX, FastAI |
| MLOps | MLflow, DVC, BentoML | Weights & Biases, Neptune, KServe, Seldon |
| Async | asyncio, async/await | Trio, AnyIO |
| Workers | Celery, RQ, Dramatiq, Arq | APScheduler, schedule, cron |
| DevOps | Docker, Docker Compose, Kubernetes | Podman, Helm, Kustomize, Nomad |
| Cloud | AWS, GCP, Azure | Heroku, Render, Fly.io, Railway |
| Big Data | PySpark, Dask, Ray | Hadoop, Flink, Beam |
| Streaming | Kafka, RabbitMQ, Redis Streams | Pulsar, Faust, Confluent Kafka |
| Observabilidade | logging, structlog, OpenTelemetry | Prometheus, Grafana, Sentry, ELK |
| Seguranca | secrets, cryptography, PyJWT | bcrypt, argon2-cffi, passlib, Bandit, pip-audit |

---

## Fundamentos de Python

### Essencial

- Sintaxe, indentacao, comentarios, imports e organizacao de modulos.
- Tipos primitivos: `int`, `float`, `bool`, `str`, `bytes`, `None`.
- Colecoes: `list`, `tuple`, `dict`, `set`, `frozenset`.
- Operadores aritmeticos, relacionais, logicos, bitwise e operadores de identidade.
- Condicionais: `if`, `elif`, `else`, guard clauses e pattern matching com `match`.
- Loops: `for`, `while`, `break`, `continue`, `else` em loops.
- Funcoes, parametros, retorno, escopo, `global`, `nonlocal`.
- `*args`, `**kwargs`, parametros posicionais e keyword-only.
- Lambdas, closures, higher-order functions.
- List, dict e set comprehensions.
- Slicing, unpacking, packing, destructuring e starred expressions.
- String formatting com f-strings, `format`, templates e format specifiers.

### Tipagem e contratos

- Type hints para variaveis, parametros e retorno.
- `typing`: `Optional`, `Union`, `Literal`, `TypedDict`, `Callable`, `Iterable`, `Sequence`.
- `Protocol`, `TypeVar`, `Generic`, variancia e tipos parametrizados.
- `NewType`, `Final`, `ClassVar`, `Self`, `TypeAlias`.
- Validacao em runtime quando necessario com Pydantic, attrs ou dataclasses.
- Checagem estatica com mypy ou pyright.

### Recursos avancados

- Decorators de funcao e classe.
- Generators com `yield`, generator expressions e lazy evaluation.
- Coroutines, `async def`, `await`, async generators e async context managers.
- Context managers com `with`, `contextlib.contextmanager` e `ExitStack`.
- Iterators e iterables com `__iter__` e `__next__`.
- Descriptors, metaclasses e `__init_subclass__`.
- GIL, gerenciamento de memoria, reference counting e garbage collection.
- Internals uteis: object model, bytecode, import system e data model.

### Ambientes e empacotamento

- `venv` para isolamento local.
- `pip` para instalacao de pacotes.
- `pipx` para ferramentas CLI globais.
- Poetry, uv ou pip-tools para lockfile e reproducibilidade.
- `pyproject.toml` como centro moderno de configuracao.
- Build e publicacao com `build`, `twine` e PyPI.
- Versionamento semantico, changelog e tags.

---

## Biblioteca padrao e core tooling

### Modulos built-in essenciais

| Categoria | Modulos |
|---|---|
| Colecoes | `collections`, `array`, `heapq`, `bisect`, `queue` |
| Iteracao | `itertools`, `functools`, `operator` |
| Sistema | `os`, `sys`, `platform`, `subprocess`, `signal`, `atexit` |
| Arquivos | `pathlib`, `shutil`, `tempfile`, `glob`, `fnmatch` |
| Serializacao | `json`, `pickle`, `marshal`, `csv`, `configparser` |
| Data e hora | `datetime`, `time`, `calendar`, `zoneinfo` |
| Texto | `re`, `string`, `textwrap`, `unicodedata` |
| Seguranca | `hashlib`, `hmac`, `secrets`, `ssl` |
| Concorrencia | `threading`, `multiprocessing`, `concurrent.futures`, `asyncio` |
| Tipagem e modelos | `typing`, `dataclasses`, `enum`, `abc` |
| Contexto | `contextlib`, `contextvars` |
| Rede | `socket`, `urllib`, `http`, `email`, `smtplib`, `imaplib` |
| Compactacao | `zipfile`, `tarfile`, `gzip`, `bz2`, `lzma` |
| Debug e perfil | `pdb`, `traceback`, `cProfile`, `pstats`, `timeit` |
| Logging | `logging`, `logging.config` |

### Ferramentas de projeto

- `pre-commit` para automatizar checks antes de commits.
- `Ruff` para linting e formatacao rapida.
- `Black` quando o projeto optar por formatter dedicado.
- `mypy` ou `pyright` para tipos.
- `pytest` para testes.
- `tox` ou `nox` para matriz de ambientes.
- `MkDocs`, `Sphinx` ou `pdoc` para documentacao.

---

## POO, arquitetura e design

### POO essencial

- Classes, objetos, atributos e metodos.
- Atributos de instancia e de classe.
- Encapsulamento por convencao, propriedades e validacao controlada.
- Heranca, composicao e polimorfismo.
- Duck typing e interfaces implicitas.
- MRO, `super()` e heranca multipla.
- Classes abstratas com `abc.ABC` e `@abstractmethod`.
- Mixins pequenos, coesos e sem estado complexo.

### Data model e metaprogramacao

- `__init__`, `__str__`, `__repr__`, `__eq__`, `__hash__`.
- `__len__`, `__getitem__`, `__iter__`, `__contains__`.
- `__enter__`, `__exit__`, `__aenter__`, `__aexit__`.
- `__call__`, `__getattr__`, `__getattribute__`, `__setattr__`.
- `@property`, setters e deleters.
- `@staticmethod`, `@classmethod`.
- `dataclasses`, `attrs` e Pydantic models.
- `__slots__` para reducao de memoria em muitos objetos.
- Descriptors para controle fino de acesso a atributos.
- Metaclasses somente quando descriptors, decorators ou `__init_subclass__` nao resolvem.

### Principios de engenharia

- SOLID: responsabilidade unica, aberto/fechado, substituicao de Liskov, segregacao de interfaces e inversao de dependencia.
- DRY: remova duplicacao real, nao similaridade acidental.
- KISS: prefira o desenho mais simples que sustenta a evolucao.
- YAGNI: nao implemente abstracoes antes da necessidade concreta.
- Coesao alta e acoplamento baixo.
- Separacao entre dominio, aplicacao, infraestrutura e interface.

### Design patterns

| Familia | Patterns |
|---|---|
| Criacionais | Factory Method, Abstract Factory, Builder, Prototype, Singleton controlado |
| Estruturais | Adapter, Facade, Proxy, Decorator, Composite, Bridge |
| Comportamentais | Strategy, Command, Observer, Template Method, Chain of Responsibility, State |
| Arquiteturais | Clean Architecture, Hexagonal Architecture, Layered Architecture, CQRS, Event-driven |

### Regra pratica

Use design patterns para reduzir complexidade existente. Se o pattern aumenta o numero de arquivos, classes e indirecoes sem melhorar testabilidade ou troca de implementacao, ele provavelmente ainda nao e necessario.

---

## Estruturas de dados, algoritmos e performance

### Estruturas

- Basicas: listas, tuplas, dicionarios, sets, strings e bytes.
- Lineares: pilhas, filas, deques, linked lists.
- Hierarquicas: arvores, heaps, tries.
- Relacionais: grafos dirigidos, nao dirigidos, ponderados e aciclicos.
- Indexacao: hash tables, B-trees, indices invertidos.

### Algoritmos

- Busca linear e busca binaria.
- BFS, DFS, Dijkstra, A* e algoritmos de menor caminho.
- Ordenacao: quicksort, mergesort, heapsort, Timsort e counting sort quando aplicavel.
- Recursao, backtracking, greedy e programacao dinamica.
- Algoritmos de strings: KMP, Rabin-Karp, tries, suffix arrays quando necessario.
- Algoritmos de grafos: topological sort, union-find, MST e componentes conexos.

### Complexidade e medicao

- Big O para limite superior.
- Big Theta para crescimento exato assintotico.
- Big Omega para limite inferior.
- Benchmarking com `timeit`, `pytest-benchmark` e dados realistas.
- Profiling com `cProfile`, `py-spy`, `scalene`, `line_profiler` e `memory_profiler`.
- Otimizacao somente depois de medir.

---

## Arquivos, formatos e serializacao

### Formatos comuns

| Tipo | Formatos | Bibliotecas |
|---|---|---|
| Texto | TXT, Markdown, logs | `pathlib`, `io`, `re` |
| Tabular | CSV, TSV | `csv`, Pandas, Polars |
| Configuracao | INI, YAML, TOML, JSON | `configparser`, PyYAML, `tomllib`, `json` |
| Estruturado | XML, JSON, MessagePack, Protobuf | `xml`, `json`, msgpack, protobuf |
| Planilhas | XLSX, XLS | openpyxl, xlwings, xlrd, xlwt, xlsxwriter |
| Colunar | Parquet, ORC, Avro | pyarrow, fastparquet, fastavro |
| Documentos | PDF, DOCX | pypdf, pdfplumber, reportlab, python-docx |
| Imagens | PNG, JPG, TIFF, WEBP | Pillow, OpenCV |
| Compactados | ZIP, TAR, GZIP, BZ2, LZMA | `zipfile`, `tarfile`, `gzip`, `bz2`, `lzma` |

### Operacoes profissionais

- Leitura e escrita com encoding explicito.
- Uso de `pathlib.Path` para caminhos.
- Streams para arquivos grandes.
- Upload e download com validacao de tamanho, tipo e extensao.
- Manipulacao de diretorios com criacao idempotente.
- Arquivos temporarios com `tempfile`.
- Validacao de schema para JSON, YAML e dados tabulares.
- Evitar `pickle` para dados nao confiaveis.

---

## Web, APIs e backend

### Frameworks

| Framework | Melhor uso |
|---|---|
| FastAPI | APIs modernas, alta produtividade, validacao com tipos, OpenAPI automatico |
| Django | Sistemas completos, admin, ORM, autenticacao e monolitos robustos |
| Flask | APIs e apps pequenos, flexiveis e com baixo acoplamento inicial |
| Starlette | Base ASGI leve para servicos async |
| Sanic | APIs async com foco em performance |
| Tornado | Long polling, WebSockets e sistemas de rede |
| Pyramid | Projetos que exigem flexibilidade arquitetural |
| Falcon | APIs enxutas e performaticas |
| Quart | Flask-like com suporte async |

### APIs e comunicacao

- REST, recursos, status codes, idempotencia e versionamento.
- GraphQL com Strawberry, Graphene ou Ariadne.
- WebSockets com FastAPI, Starlette, websockets ou Django Channels.
- gRPC com grpcio quando contratos binarios e alto desempenho forem relevantes.
- Documentacao OpenAPI/Swagger e Redoc.
- Testes de API com pytest, TestClient, httpx, requests, Insomnia e Postman.

### Autenticacao e autorizacao

- Sessions e cookies seguros para apps server-side.
- JWT com expiracao curta, refresh token e rotacao.
- OAuth2 e OpenID Connect para login federado.
- RBAC para papeis simples.
- ABAC quando decisoes dependem de atributos do usuario, recurso e contexto.

### Boas praticas de backend

- Separar rotas, schemas, servicos, repositorios e dominio.
- Validar entrada no limite da aplicacao.
- Centralizar tratamento de erros.
- Usar migrations para schema de banco.
- Configurar CORS de forma restritiva.
- Aplicar rate limiting em endpoints sensiveis.
- Registrar logs estruturados com correlation id.

---

## Bancos de dados e persistencia

### SQL

- PostgreSQL: escolha padrao para sistemas profissionais, analytics leve, JSONB, indices e extensoes.
- SQLite: excelente para prototipos, CLIs, testes e apps locais.
- MySQL/MariaDB: comum em hospedagens e legados.
- SQL Server e Oracle: ambientes corporativos.

### ORMs e query builders

- SQLAlchemy: ORM e Core poderosos, adequado para arquiteturas desacopladas.
- Django ORM: integrado ao ecossistema Django, rapido para produtos completos.
- SQLModel: combina SQLAlchemy e Pydantic para APIs modernas.
- Tortoise ORM: async ORM inspirado no Django.
- Peewee: leve para apps menores.
- Alembic: migrations com SQLAlchemy.
- Django migrations: fluxo nativo em projetos Django.

### NoSQL e busca

- Redis: cache, filas, locks, rate limiting e pub/sub.
- MongoDB: documentos flexiveis e agregacoes.
- Elasticsearch/OpenSearch: busca textual, logs e analytics.
- Cassandra: escrita massiva e distribuida.
- DynamoDB e Firestore: serverless NoSQL em cloud.
- Couchbase: documentos, cache e distribuicao.

### Praticas de persistencia

- Modelar transacoes e isolamento explicitamente.
- Criar indices com base nas queries reais.
- Evitar N+1 queries.
- Separar schema de leitura e escrita quando necessario.
- Planejar backup, restore e retencao.
- Medir queries com `EXPLAIN`.

---

## Data Science, analytics e visualizacao

### Manipulacao de dados

- NumPy para arrays, algebra linear e vetorizacao.
- Pandas para analise tabular, limpeza e transformacoes.
- Polars para performance em dados tabulares e lazy execution.
- Dask para paralelizar workloads familiares ao Pandas.
- DuckDB para SQL analitico local e leitura direta de Parquet/CSV.
- Vaex e Modin para cenarios especificos de dados maiores que memoria.

### Visualizacao

- Matplotlib para base e controle fino.
- Seaborn para estatistica visual rapida.
- Plotly para graficos interativos.
- Altair para visualizacao declarativa.
- Bokeh para dashboards interativos customizados.
- Dash e Streamlit para apps de dados.

### Estatistica

- SciPy para estatistica, otimizacao e funcoes cientificas.
- Statsmodels para modelos estatisticos e econometria.
- Pingouin para testes estatisticos de alto nivel.
- Scikit-posthocs para pos-testes e comparacoes multiplas.

### ETL e qualidade de dados

- Pandas e Polars para wrangling.
- Great Expectations para validacao e contratos de dados.
- dbt quando transformacoes SQL governadas fizerem sentido.
- Airflow, Prefect ou Dagster para orquestracao.
- Parquet como formato analitico padrao.

---

## Machine Learning, IA e MLOps

### Machine Learning classico

- scikit-learn para pipelines, preprocessamento, modelos e validacao.
- XGBoost, LightGBM e CatBoost para gradient boosting.
- imbalanced-learn para bases desbalanceadas.
- Feature-engine para engenharia de atributos.
- Optuna, Hyperopt ou Ray Tune para otimizacao de hiperparametros.
- SHAP e ELI5 para interpretabilidade.

### Deep Learning

- PyTorch para pesquisa, flexibilidade e ecossistema moderno.
- TensorFlow/Keras para producao, mobile e ecossistema consolidado.
- JAX para computacao diferenciavel de alto desempenho.
- FastAI para prototipacao rapida sobre PyTorch.

### NLP, LLMs e IA generativa

- Hugging Face Transformers e Datasets.
- spaCy para NLP industrial.
- NLTK e Gensim para fundamentos e topicos classicos.
- LangChain, LlamaIndex e ferramentas similares para RAG e orquestracao.
- Vector databases: FAISS, Chroma, Weaviate, Pinecone, Qdrant, Milvus.
- Avaliacao de prompts, grounding, guardrails e observabilidade de LLM.

### Computer Vision

- OpenCV para processamento de imagem e video.
- Pillow para manipulacao simples de imagens.
- scikit-image para algoritmos cientificos.
- torchvision e albumentations para pipelines de deep learning.
- Detectron2, Ultralytics/YOLO e Segment Anything para tarefas avancadas.

### MLOps

- MLflow para experimentos, registry e tracking.
- DVC para versionamento de dados e pipelines.
- Weights & Biases e Neptune para tracking avancado.
- BentoML, KServe e Seldon para serving.
- Monitoramento de drift, performance, latencia e custo.

---

## Async, concorrencia e processamento em background

### Conceitos

- `asyncio`, `async def`, `await`, event loop, tasks e futures.
- I/O-bound vs CPU-bound.
- Concorrencia cooperativa vs paralelismo real.
- Backpressure, timeout, cancelamento e retries.
- Context propagation com `contextvars`.

### Bibliotecas async

- httpx e aiohttp para HTTP async.
- asyncpg para PostgreSQL.
- aiomysql para MySQL.
- redis.asyncio ou aioredis para Redis.
- websockets para comunicacao bidirecional.
- AnyIO para compatibilidade entre asyncio e Trio.

### Threads, processos e executors

- `threading` para I/O bloqueante e integracoes legadas.
- `multiprocessing` para CPU-bound.
- `concurrent.futures.ThreadPoolExecutor`.
- `concurrent.futures.ProcessPoolExecutor`.
- Cuidado com shared state, locks, deadlocks e serializacao.

### Filas e workers

- Celery para workers robustos e ecossistema maduro.
- RQ para filas simples baseadas em Redis.
- Dramatiq para alternativa moderna e objetiva.
- Arq para tarefas async com Redis.
- RabbitMQ, Redis, Kafka ou SQS como brokers conforme necessidade.

### Scheduling

- APScheduler para agendamento dentro da aplicacao.
- schedule para scripts simples.
- Celery Beat para tarefas recorrentes em projetos Celery.
- Cron/systemd timers para automacoes de sistema.

---

## Automacao, CLI, scraping e bots

### CLI

- argparse para dependencia zero.
- Click para CLIs maduras e extensivas.
- Typer para CLIs modernas com type hints.
- Rich para output bonito, tabelas, progresso e logs.
- Textual para TUIs completas.
- Fire para exposicao rapida de funcoes como CLI.
- Hydra para configuracao em projetos de ML e experimentos.

### Web scraping e browser automation

- requests/httpx para requisicoes HTTP.
- BeautifulSoup, lxml e Parsel para parsing.
- Scrapy para crawlers estruturados.
- Selenium para automacao de browsers legados.
- Playwright para automacao moderna, testes e scraping com browser real.
- Respeitar robots.txt, rate limits e termos de uso.

### Desktop, bots e planilhas

- PyAutoGUI, pynput, keyboard e pyperclip para automacao desktop.
- python-telegram-bot, discord.py e slack-sdk para bots.
- Tweepy para integracoes com X/Twitter quando aplicavel.
- openpyxl, xlwings, gspread, Google Sheets API e pandas para planilhas.

---

## DevOps, infraestrutura e deploy

### Containerizacao

- Docker para empacotar aplicacoes.
- Docker Compose para desenvolvimento local multi-servico.
- Podman como alternativa daemonless.
- Multi-stage builds para imagens menores.
- Usuario nao-root em containers.
- Healthchecks, variaveis de ambiente e logs em stdout/stderr.

### Orquestracao

- Kubernetes para escala, rollouts e operacao distribuida.
- Helm para empacotar manifests.
- Kustomize para overlays declarativos.
- Docker Swarm ou Nomad em ambientes especificos.

### CI/CD

- GitHub Actions, GitLab CI, Jenkins, CircleCI, Travis CI e Drone.
- Etapas minimas: lint, format check, type check, tests, build, security scan e deploy.
- GitOps com Argo CD ou Flux quando Kubernetes for central.
- Deploy automatizado com rollback e ambientes separados.

### Infrastructure as Code e cloud

- Terraform para infraestrutura multi-cloud.
- Pulumi para IaC com linguagens de programacao.
- CloudFormation para AWS.
- Ansible para configuracao e automacao de servidores.
- AWS, GCP e Azure para compute, storage, filas, databases e serverless.

### Deploy

- Uvicorn para ASGI em desenvolvimento e containers simples.
- Gunicorn com workers ASGI/WSGI para producao tradicional.
- Nginx, Apache ou HAProxy como reverse proxy.
- Lambda, Cloud Run, Azure Functions e similares para serverless.
- Heroku, Render, Railway, Fly.io e PythonAnywhere para deploy simplificado.

---

## Big Data, streaming e orquestracao de dados

### Processamento distribuido

- PySpark para Spark e processamento distribuido consolidado.
- Dask para escalar APIs familiares de Python.
- Ray para workloads distribuidos, ML e serving.
- Hadoop/HDFS em ambientes legados ou corporativos.
- RAPIDS quando GPU acelerar pipelines tabulares.

### Streaming e mensageria

- Kafka para streaming duravel, escalavel e orientado a eventos.
- Confluent Kafka para integracao profissional com Kafka.
- Flink para stream processing stateful.
- Beam para pipelines portaveis.
- Faust para stream processing em Python.
- Redis Streams para filas/streams leves.
- RabbitMQ para mensageria e filas tradicionais.
- Pulsar para streaming distribuido multi-tenant.

### Orquestracao e data platforms

- Airflow para DAGs agendadas e ecossistema amplo.
- Prefect para fluxos Pythonicos e experiencia moderna.
- Dagster para data assets, lineage e qualidade.
- Luigi para pipelines simples e legados.
- Snowflake, BigQuery, Redshift, Databricks e Synapse para analytics cloud.
- S3, GCS, Azure Blob e HDFS para data lakes.
- Delta Lake, Iceberg e Hudi para lakehouse.
- Parquet, ORC e Avro para formatos de dados.

---

## Testes, qualidade e seguranca

### Testes

- unittest para biblioteca padrao e legados.
- pytest como padrao profissional moderno.
- doctest para exemplos executaveis em documentacao.
- Hypothesis para property-based testing.
- pytest-cov para cobertura.
- pytest-xdist para paralelizacao.
- pytest-mock, unittest.mock, responses, respx, freezegun, factory-boy e Faker.
- Playwright e Selenium para testes end-to-end.
- Locust, JMeter e k6 para carga e performance.

### Qualidade

- Ruff para linting rapido.
- Black para formatacao padronizada quando adotado.
- isort para ordenacao de imports quando nao coberto por Ruff.
- mypy ou pyright para tipos.
- Radon, Xenon e wily para complexidade.
- pre-commit para impedir regressao local.
- Code review com foco em comportamento, testabilidade, seguranca e manutencao.

### Seguranca

- Validacao de entrada e sanitizacao de saida.
- Secrets fora do codigo: environment variables, vaults e secret managers.
- `secrets` para tokens e valores aleatorios seguros.
- cryptography para primitivas criptograficas.
- bcrypt, passlib e argon2-cffi para senhas.
- PyJWT para tokens JWT.
- OAuth2, OpenID Connect, RBAC e ABAC.
- OWASP Top 10: injection, broken auth, sensitive data exposure, XXE, broken access control, security misconfiguration, XSS, insecure deserialization, vulnerable components e logging insuficiente.
- CORS, CSRF, XSS, SQL injection e rate limiting.
- Safety, Bandit, pip-audit, Semgrep e Trivy em CI.

---

## Observabilidade e operacao

### Logging

- `logging` para base padrao.
- structlog ou loguru para logs estruturados.
- Correlation id e request id em servicos web.
- Separar logs de aplicacao, acesso, auditoria e seguranca.

### Metricas e tracing

- Prometheus para metricas.
- Grafana para dashboards.
- OpenTelemetry para traces, metricas e logs padronizados.
- Jaeger ou Tempo para tracing distribuido.
- Sentry para erros de aplicacao.
- ELK/OpenSearch para centralizacao de logs.
- Datadog e New Relic em ambientes gerenciados.

### Operacao

- Healthchecks e readiness checks.
- Timeouts, retries e circuit breakers.
- Graceful shutdown.
- Backups testados.
- Alertas acionaveis.
- Runbooks para incidentes recorrentes.

---

## Full stack, desktop, mobile, games e redes

### Web full stack

- Server-side rendering: Django Templates, Jinja2, HTMX e Alpine.js.
- SPA: React, Vue, Svelte ou Angular consumindo API Python.
- Static sites: MkDocs, Sphinx, Pelican, Nikola e Docusaurus.

### Desktop e mobile

- Tkinter para interfaces simples com biblioteca padrao.
- PyQt, PySide e wxPython para desktop completo.
- Kivy e BeeWare para desktop/mobile multiplataforma.
- DearPyGui para interfaces tecnicas e ferramentas internas.
- Buildozer e PyJNIus em cenarios Android especificos.

### Games

- Pygame para jogos 2D e aprendizado.
- Arcade para 2D moderno.
- Panda3D e Ursina para 3D.
- Godot com Python-like scripting ou integracoes quando fizer sentido.

### Redes e protocolos

- `socket` para fundamentos.
- requests, httpx e aiohttp para HTTP.
- websockets para real-time.
- Paramiko e Netmiko para SSH e automacao de rede.
- Scapy para pacotes e seguranca.
- Twisted para protocolos e redes event-driven.
- Protocolos: TCP, UDP, HTTP, WebSocket, MQTT, AMQP, gRPC, FTP, SFTP, SSH, SMTP e IMAP.

---

## Areas especializadas

| Area | Bibliotecas e ferramentas |
|---|---|
| Bioinformatica | Biopython, scikit-bio, pysam |
| Financas quantitativas | QuantLib, Zipline, Backtrader, yfinance, pandas-ta |
| Cybersecurity | Scapy, pwntools, impacket, Volatility, YARA |
| IoT e embarcados | MicroPython, CircuitPython, GPIO Zero, paho-mqtt |
| Blockchain | web3.py, eth-brownie, py-solc-x |
| NLP avancado | Transformers, spaCy, sentence-transformers, LangChain, LlamaIndex |
| Visao computacional avancada | OpenCV, Detectron2, YOLO, MediaPipe, Kornia |
| Sistemas distribuidos | Ray, Celery, Kafka, gRPC, Kubernetes |

---

## Stack por caso de uso

### Backend API REST profissional

- FastAPI, Pydantic, SQLAlchemy/SQLModel, Alembic.
- PostgreSQL, Redis, Celery ou Arq.
- pytest, httpx, Ruff, mypy.
- Docker, GitHub Actions, OpenTelemetry, Sentry.

### Sistema web completo

- Django, Django ORM, Django REST Framework quando API for necessaria.
- PostgreSQL, Redis, Celery.
- Django templates, HTMX ou SPA separada.
- pytest-django, factory-boy, coverage.

### Microservico leve

- FastAPI ou Flask.
- SQLite/PostgreSQL conforme persistencia.
- httpx para integracoes.
- Docker, healthcheck, logs estruturados.

### Data Science e analytics

- JupyterLab, NumPy, Pandas, Polars, DuckDB.
- Matplotlib, Seaborn, Plotly.
- SciPy, Statsmodels, Great Expectations.
- Parquet, pyarrow, openpyxl.

### Machine Learning em producao

- scikit-learn/PyTorch/TensorFlow.
- MLflow, DVC, Optuna.
- FastAPI ou BentoML para serving.
- Docker, CI/CD, monitoramento de drift.

### Web scraping profissional

- httpx/requests, BeautifulSoup/lxml.
- Scrapy para crawlers.
- Playwright para paginas dinamicas.
- Redis/PostgreSQL para filas e armazenamento.
- Backoff, proxies quando permitidos, rate limiting e logs.

### Automacao e CLI

- Typer ou Click.
- Rich para UX de terminal.
- pathlib, logging, pydantic-settings.
- pytest, freezegun, responses.
- Empacotamento com Poetry/uv e distribuicao via PyPI ou pipx.

### DevOps e infraestrutura

- Python para automacao, boto3/google-cloud/azure-sdk.
- Ansible, Terraform/Pulumi.
- Docker, Kubernetes, Helm.
- GitHub Actions/GitLab CI.
- Prometheus, Grafana, OpenTelemetry.

### Big Data e streaming

- PySpark, Dask ou Ray.
- Kafka, Flink ou Beam.
- Airflow, Dagster ou Prefect.
- S3, Delta Lake/Iceberg/Hudi, Parquet.
- Snowflake, BigQuery, Redshift ou Databricks.

### Aplicacao real-time

- FastAPI/Starlette, WebSockets.
- Redis pub/sub ou Kafka.
- PostgreSQL para estado persistente.
- Horizontal scaling com cuidado em conexoes WebSocket.

### NLP e LLM

- Transformers, sentence-transformers, spaCy.
- LangChain/LlamaIndex para RAG quando necessario.
- FAISS/Qdrant/Weaviate/Chroma.
- FastAPI para API.
- Avaliacao, guardrails, cache e observabilidade.

---

## Matriz de decisao tecnica

### FastAPI, Flask ou Django

| Escolha | Use quando |
|---|---|
| FastAPI | API moderna, type hints, OpenAPI, async e alta produtividade |
| Flask | App pequeno, liberdade arquitetural e baixo overhead |
| Django | Produto completo com admin, auth, ORM e convencoes fortes |

### Pandas, Polars, Dask ou Spark

| Escolha | Use quando |
|---|---|
| Pandas | Analise local, ecossistema amplo e datasets medios |
| Polars | Performance local, lazy execution e dados tabulares maiores |
| Dask | Escalar workloads Python familiares em cluster ou multicore |
| Spark | Big Data distribuido, lakehouse e ecossistema corporativo |

### Threading, asyncio ou multiprocessing

| Escolha | Use quando |
|---|---|
| threading | I/O bloqueante de bibliotecas sync e integracoes legadas |
| asyncio | Muitas conexoes I/O async com bibliotecas compativeis |
| multiprocessing | CPU-bound e paralelismo real em multiplos cores |

### SQL ou NoSQL

| Escolha | Use quando |
|---|---|
| SQL | Relacionamentos, transacoes, consistencia e consultas fortes |
| Document store | Estrutura flexivel e documentos agregados |
| Key-value | Cache, sessao, locks, contadores e filas simples |
| Search engine | Busca textual, relevancia e agregacoes de logs |

### Docker Compose ou Kubernetes

| Escolha | Use quando |
|---|---|
| Docker Compose | Desenvolvimento local, demos e ambientes simples |
| Kubernetes | Escala, alta disponibilidade, rollouts, multi-servico e operacao madura |

---

## Templates essenciais

### Estrutura recomendada para API

```text
app/
  api/
    routes/
    dependencies.py
  core/
    config.py
    security.py
    logging.py
  domain/
    entities.py
    services.py
  infrastructure/
    database.py
    repositories.py
  schemas/
  main.py
tests/
pyproject.toml
README.md
Dockerfile
docker-compose.yml
```

### FastAPI minimo com saude e tipagem

```python
from fastapi import FastAPI
from pydantic import BaseModel


class HealthResponse(BaseModel):
    status: str


app = FastAPI(title="Minha API", version="1.0.0")


@app.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(status="ok")
```

### SQLAlchemy moderno

```python
from sqlalchemy import create_engine, select
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(unique=True, index=True)


engine = create_engine("postgresql+psycopg://user:pass@localhost/app")

with Session(engine) as session:
    users = session.scalars(select(User)).all()
```

### Dockerfile base para aplicacao Python

```dockerfile
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY pyproject.toml ./
RUN pip install --no-cache-dir .

COPY . .

CMD ["python", "-m", "app.main"]
```

### Pipeline GitHub Actions

```yaml
name: ci

on:
  push:
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - run: python -m pip install --upgrade pip
      - run: pip install -e ".[dev]"
      - run: ruff check .
      - run: mypy .
      - run: pytest
```

### Checklist de `pyproject.toml`

```toml
[project]
name = "meu-projeto"
version = "0.1.0"
requires-python = ">=3.11"

[tool.ruff]
line-length = 100

[tool.pytest.ini_options]
testpaths = ["tests"]

[tool.mypy]
python_version = "3.12"
strict = true
```

---

## Checklists profissionais

### Novo projeto Python

- Repositorio Git criado.
- `README.md` com objetivo, instalacao, uso e testes.
- Ambiente virtual configurado.
- `pyproject.toml` centralizando metadados e ferramentas.
- Lint, formatacao, testes e tipagem configurados.
- Estrutura de pastas clara.
- `.gitignore` adequado.
- Variaveis sensiveis fora do codigo.
- Teste minimo cobrindo fluxo principal.
- CI rodando em push e pull request.

### Pronto para producao

- Configuracao por ambiente.
- Logs estruturados.
- Healthcheck.
- Timeouts em chamadas externas.
- Retries com backoff onde faz sentido.
- Migrations versionadas.
- Backup e restore testados.
- Monitoramento de erro, latencia, throughput e saturacao.
- Rate limiting e protecao de endpoints sensiveis.
- Scan de dependencias e imagem de container.
- Deploy reproduzivel e rollback definido.

### Revisao tecnica senior

- O desenho resolve o problema atual sem complexidade desnecessaria.
- Dependencias externas tem motivo claro.
- O dominio nao depende diretamente de framework.
- Erros sao tratados de forma previsivel.
- Testes cobrem comportamento, nao detalhes irrelevantes.
- Queries criticas foram analisadas.
- Seguranca foi considerada desde entrada ate armazenamento.
- Observabilidade permite diagnosticar incidentes.
- Documentacao explica decisoes importantes.

---

## Roteiro de evolucao profissional

### Nivel 1: Base solida

- Python moderno, biblioteca padrao, ambientes virtuais e Git.
- Funcoes, POO, erros, arquivos e testes.
- Projetos pequenos com CLI, arquivos e APIs simples.

### Nivel 2: Desenvolvimento profissional

- FastAPI ou Django.
- PostgreSQL, SQLAlchemy/Django ORM e migrations.
- pytest, Ruff, type hints e CI.
- Docker e deploy basico.

### Nivel 3: Especializacao

- Backend, Data Science, ML, DevOps, automacao, seguranca ou Big Data.
- Escolha a stack por problema, nao por popularidade.
- Aprenda operacao, observabilidade e custos.

### Nivel 4: Senioridade

- Arquitetura, modelagem de dominio e design de sistemas.
- Performance, concorrencia e resiliencia.
- Seguranca aplicada.
- Mentoria, documentacao tecnica e decisoes sustentaveis.

### Nivel 5: Referencia tecnica

- Profundidade em internals, protocolos, sistemas distribuidos ou IA.
- Capacidade de definir padroes para times.
- Avaliacao critica de trade-offs.
- Criacao de ferramentas, bibliotecas e plataformas internas.

---

## Conclusao

A stack Python profissional nao e uma lista fixa de ferramentas. Ela e uma combinacao entre fundamentos fortes, boas escolhas tecnicas, qualidade de engenharia e capacidade de operar sistemas reais. Dominar Python significa saber quando usar a biblioteca padrao, quando adotar frameworks, quando escalar com infraestrutura e quando manter a solucao simples.