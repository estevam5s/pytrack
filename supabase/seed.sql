-- =====================================================================
-- Python Learning Dashboard — Seed
-- Dados curados a partir de informacao.md (Stack Python Profissional)
-- Idempotente: limpa o catálogo antes de inserir.
-- =====================================================================

truncate table public.contents,
               public.stack_items,
               public.udemy_courses,
               public.materials,
               public.books,
               public.career_paths,
               public.exercises,
               public.projects
  restart identity cascade;

-- =====================================================================
-- CONTENTS — trilhas e módulos
-- =====================================================================
insert into public.contents (title, description, category, level, area, order_index, estimated_hours) values
('Sintaxe e fundamentos', 'Indentação, imports, organização de módulos, tipos primitivos e coleções (list, tuple, dict, set, frozenset).', 'Fundamentos de Python', 'basico', 'Fundamentos', 1, 10),
('Controle de fluxo', 'Condicionais, guard clauses, pattern matching com match, loops e else em loops.', 'Fundamentos de Python', 'basico', 'Fundamentos', 2, 6),
('Funções e escopo', 'Parâmetros, retorno, escopo, global/nonlocal, *args/**kwargs, lambdas, closures e higher-order functions.', 'Fundamentos de Python', 'basico', 'Fundamentos', 3, 8),
('Comprehensions e unpacking', 'List/dict/set comprehensions, slicing, unpacking, packing e starred expressions.', 'Fundamentos de Python', 'basico', 'Fundamentos', 4, 5),
('Tipagem e contratos', 'Type hints, typing (Optional, Union, Literal, TypedDict, Protocol, Generic), mypy/pyright.', 'Fundamentos de Python', 'intermediario', 'Fundamentos', 5, 8),
('Recursos avançados da linguagem', 'Decorators, generators, coroutines, context managers, descriptors, metaclasses, GIL e GC.', 'Fundamentos de Python', 'avancado', 'Fundamentos', 6, 14),
('Ambientes e empacotamento', 'venv, pip, pipx, Poetry/uv, pyproject.toml, build, twine e versionamento semântico.', 'Fundamentos de Python', 'intermediario', 'Fundamentos', 7, 6),

('Estruturas lineares e hierárquicas', 'Pilhas, filas, deques, linked lists, árvores, heaps e tries.', 'Estruturas de Dados', 'intermediario', 'Algoritmos', 10, 12),
('Algoritmos essenciais', 'Busca binária, BFS, DFS, Dijkstra, ordenação, recursão, backtracking, greedy e programação dinâmica.', 'Estruturas de Dados', 'avancado', 'Algoritmos', 11, 16),
('Complexidade e performance', 'Big O/Theta/Omega, benchmarking com timeit/pytest-benchmark e profiling (cProfile, py-spy, scalene).', 'Estruturas de Dados', 'avancado', 'Algoritmos', 12, 8),

('POO essencial', 'Classes, atributos, encapsulamento, herança, composição, polimorfismo, duck typing, MRO e ABC.', 'Programação Orientada a Objetos', 'intermediario', 'Engenharia de Software', 20, 10),
('Data model e metaprogramação', 'Dunder methods, property, dataclasses, attrs, Pydantic, __slots__ e descriptors.', 'Programação Orientada a Objetos', 'avancado', 'Engenharia de Software', 21, 10),
('Princípios e design patterns', 'SOLID, DRY, KISS, YAGNI e patterns criacionais, estruturais, comportamentais e arquiteturais.', 'Programação Orientada a Objetos', 'avancado', 'Engenharia de Software', 22, 12),

('Frameworks web', 'FastAPI, Django, Flask, Starlette — quando usar cada um.', 'APIs', 'intermediario', 'Backend', 30, 10),
('Construindo APIs REST', 'Recursos, status codes, idempotência, versionamento, OpenAPI/Swagger e testes com httpx/TestClient.', 'APIs', 'intermediario', 'Backend', 31, 12),
('Autenticação e autorização', 'Sessions/cookies, JWT com refresh, OAuth2/OpenID Connect, RBAC e ABAC.', 'APIs', 'avancado', 'Backend', 32, 8),
('Boas práticas de backend', 'Separação de camadas, validação no limite, tratamento central de erros, CORS, rate limiting e logs.', 'APIs', 'avancado', 'Backend', 33, 8),

('Bancos SQL', 'PostgreSQL, SQLite, MySQL — modelagem, transações, isolamento e EXPLAIN.', 'Banco de Dados', 'intermediario', 'Backend', 40, 10),
('ORMs e migrations', 'SQLAlchemy, SQLModel, Django ORM, Alembic e padrões de repositório.', 'Banco de Dados', 'intermediario', 'Backend', 41, 10),
('NoSQL e busca', 'Redis (cache, filas, locks), MongoDB e Elasticsearch/OpenSearch.', 'Banco de Dados', 'avancado', 'Backend', 42, 8),

('Web scraping profissional', 'requests/httpx, BeautifulSoup/lxml, Scrapy, Playwright e respeito a robots.txt e rate limits.', 'Web Scraping', 'intermediario', 'Automação', 50, 8),
('Automação e CLI', 'Typer/Click, Rich, pathlib, pydantic-settings, bots e automação de planilhas.', 'Automação', 'intermediario', 'Automação', 51, 8),

('Testes com pytest', 'pytest, fixtures, mocks, Hypothesis, cobertura com pytest-cov e testes E2E.', 'Testes', 'intermediario', 'Qualidade', 60, 8),
('Qualidade e segurança', 'Ruff, Black, mypy, pre-commit, OWASP Top 10, secrets, cryptography e scans (Bandit, pip-audit).', 'Testes', 'avancado', 'Qualidade', 61, 10),

('Manipulação de dados', 'NumPy, Pandas, Polars, DuckDB e Dask para análise tabular e vetorização.', 'Análise de Dados', 'intermediario', 'Data Science', 70, 14),
('Visualização', 'Matplotlib, Seaborn, Plotly, Altair, Dash e Streamlit.', 'Análise de Dados', 'intermediario', 'Data Science', 71, 8),
('ETL e qualidade de dados', 'Wrangling com Pandas/Polars, Great Expectations, dbt e orquestração com Airflow/Prefect/Dagster.', 'Análise de Dados', 'avancado', 'Data Science', 72, 10),

('IoT e embarcados', 'MicroPython, CircuitPython, GPIO Zero, paho-mqtt e protocolo MQTT.', 'IoT', 'intermediario', 'IoT', 80, 10),

('Async e concorrência', 'asyncio, event loop, tasks/futures, I/O-bound vs CPU-bound, httpx/asyncpg e workers (Celery, RQ, Arq).', 'Engenharia de Software', 'avancado', 'Backend', 90, 12),
('DevOps e deploy', 'Docker, Docker Compose, Kubernetes, CI/CD, Terraform e deploy com Uvicorn/Gunicorn + Nginx.', 'Engenharia de Software', 'avancado', 'DevOps', 91, 14),
('Observabilidade', 'logging/structlog, OpenTelemetry, Prometheus, Grafana e Sentry.', 'Engenharia de Software', 'avancado', 'DevOps', 92, 6),

('Big Data e streaming', 'PySpark, Dask, Ray, Kafka, Flink e formatos colunares (Parquet, Delta Lake, Iceberg).', 'Engenharia de Dados', 'avancado', 'Engenharia de Dados', 100, 16),
('Orquestração de dados', 'Airflow, Prefect, Dagster, data lakes (S3/GCS) e warehouses (Snowflake, BigQuery, Redshift).', 'Engenharia de Dados', 'avancado', 'Engenharia de Dados', 101, 12);

-- =====================================================================
-- STACK_ITEMS
-- =====================================================================
insert into public.stack_items (name, description, category, level, documentation_url, icon) values
('Python', 'Linguagem base do ecossistema. Foque em Python 3.11+/3.12+.', 'Linguagem', 'basico', 'https://docs.python.org/3/', 'code'),
('FastAPI', 'Framework moderno para APIs com type hints, validação e OpenAPI automático.', 'Web/APIs', 'intermediario', 'https://fastapi.tiangolo.com/', 'zap'),
('Django', 'Framework completo: admin, ORM, autenticação e convenções fortes.', 'Web/APIs', 'intermediario', 'https://docs.djangoproject.com/', 'layout'),
('Flask', 'Micro-framework flexível para apps e APIs pequenos.', 'Web/APIs', 'basico', 'https://flask.palletsprojects.com/', 'feather'),
('Pandas', 'Análise tabular, limpeza e transformação de dados.', 'Data Science', 'intermediario', 'https://pandas.pydata.org/docs/', 'table'),
('NumPy', 'Arrays, álgebra linear e vetorização — base do stack científico.', 'Data Science', 'intermediario', 'https://numpy.org/doc/', 'sigma'),
('Matplotlib', 'Biblioteca base de visualização com controle fino.', 'Data Science', 'intermediario', 'https://matplotlib.org/stable/', 'bar-chart-3'),
('Seaborn', 'Estatística visual rápida sobre Matplotlib.', 'Data Science', 'intermediario', 'https://seaborn.pydata.org/', 'line-chart'),
('Jupyter', 'Notebooks interativos para exploração e prototipação.', 'Data Science', 'basico', 'https://jupyter.org/', 'notebook'),
('SQLAlchemy', 'ORM e Core poderosos para arquiteturas desacopladas.', 'Banco de Dados', 'avancado', 'https://docs.sqlalchemy.org/', 'database'),
('PostgreSQL', 'Banco relacional padrão para sistemas profissionais.', 'Banco de Dados', 'intermediario', 'https://www.postgresql.org/docs/', 'database'),
('Supabase', 'Backend-as-a-service sobre Postgres: auth, storage e realtime.', 'Banco de Dados', 'intermediario', 'https://supabase.com/docs', 'cloud'),
('Docker', 'Empacotamento de aplicações em containers reproduzíveis.', 'DevOps', 'intermediario', 'https://docs.docker.com/', 'container'),
('Git', 'Controle de versão distribuído.', 'DevOps', 'basico', 'https://git-scm.com/doc', 'git-branch'),
('GitHub', 'Hospedagem de repositórios, Actions e colaboração.', 'DevOps', 'basico', 'https://docs.github.com/', 'github'),
('MQTT', 'Protocolo leve de mensageria para IoT (paho-mqtt).', 'IoT', 'intermediario', 'https://mqtt.org/', 'radio'),
('Raspberry Pi', 'Plataforma de hardware para projetos IoT e embarcados.', 'IoT', 'intermediario', 'https://www.raspberrypi.com/documentation/', 'cpu'),
('Airflow', 'Orquestração de pipelines de dados via DAGs agendadas.', 'Engenharia de Dados', 'avancado', 'https://airflow.apache.org/docs/', 'workflow'),
('Spark', 'Processamento distribuído de Big Data com PySpark.', 'Engenharia de Dados', 'avancado', 'https://spark.apache.org/docs/latest/api/python/', 'flame'),
('Pytest', 'Framework padrão de testes profissionais em Python.', 'Qualidade', 'intermediario', 'https://docs.pytest.org/', 'check-check');

-- =====================================================================
-- UDEMY_COURSES (exemplos para organizar o estudo)
-- =====================================================================
insert into public.udemy_courses (title, instructor, url, category, level, duration, status) values
('Python para Iniciantes', 'Comunidade Python BR', 'https://www.udemy.com/', 'Fundamentos', 'basico', '20h', 'nao_iniciado'),
('FastAPI do Zero ao Deploy', 'Instrutor FastAPI', 'https://www.udemy.com/', 'Backend', 'intermediario', '15h', 'nao_iniciado'),
('Análise de Dados com Pandas', 'Instrutor Data', 'https://www.udemy.com/', 'Análise de Dados', 'intermediario', '18h', 'nao_iniciado'),
('Docker e Kubernetes para Devs Python', 'Instrutor DevOps', 'https://www.udemy.com/', 'DevOps', 'avancado', '22h', 'nao_iniciado'),
('Engenharia de Dados com Airflow e Spark', 'Instrutor Data Eng', 'https://www.udemy.com/', 'Engenharia de Dados', 'avancado', '30h', 'nao_iniciado');

-- =====================================================================
-- MATERIALS
-- =====================================================================
insert into public.materials (title, description, type, url, category, level) values
('Documentação oficial do Python', 'Referência completa da linguagem e biblioteca padrão.', 'Documentação', 'https://docs.python.org/3/', 'Fundamentos', 'basico'),
('PEP 8 — Style Guide', 'Guia de estilo oficial para código Python.', 'Guias', 'https://peps.python.org/pep-0008/', 'Fundamentos', 'basico'),
('Real Python', 'Artigos e tutoriais aprofundados sobre Python.', 'Artigos', 'https://realpython.com/', 'Fundamentos', 'intermediario'),
('FastAPI Docs', 'Tutorial e referência do FastAPI.', 'Documentação', 'https://fastapi.tiangolo.com/', 'Backend', 'intermediario'),
('Pandas Cheatsheet', 'Folha de referência rápida do Pandas.', 'Cheatsheets', 'https://pandas.pydata.org/Pandas_Cheat_Sheet.pdf', 'Análise de Dados', 'intermediario'),
('Awesome Python', 'Repositório curado de bibliotecas e recursos Python.', 'Repositórios', 'https://github.com/vinta/awesome-python', 'Fundamentos', 'intermediario'),
('Type hints cheat sheet (mypy)', 'Referência rápida de tipagem estática.', 'Cheatsheets', 'https://mypy.readthedocs.io/en/stable/cheat_sheet_py3.html', 'Fundamentos', 'intermediario'),
('Docker para Python', 'Boas práticas de containerização de apps Python.', 'Guias', 'https://docs.docker.com/language/python/', 'DevOps', 'intermediario'),
('OWASP Top 10', 'Principais riscos de segurança em aplicações web.', 'Links úteis', 'https://owasp.org/www-project-top-ten/', 'Qualidade', 'avancado'),
('SQLAlchemy 2.0 Tutorial', 'Guia oficial do ORM e Core modernos.', 'Documentação', 'https://docs.sqlalchemy.org/en/20/tutorial/', 'Banco de Dados', 'avancado');

-- =====================================================================
-- BOOKS
-- =====================================================================
insert into public.books (title, author, description, url, category, level, status) values
('Python Fluente', 'Luciano Ramalho', 'Aprofundamento no modelo de dados, idiomático e recursos avançados de Python.', 'https://novatec.com.br/livros/python-fluente-2ed/', 'Fundamentos', 'avancado', 'nao_iniciado'),
('Automatize Tarefas Maçantes com Python', 'Al Sweigart', 'Automação prática do dia a dia com Python.', 'https://automatetheboringstuff.com/', 'Automação', 'basico', 'nao_iniciado'),
('Fluent Python (EN)', 'Luciano Ramalho', 'Edição em inglês do clássico sobre Python idiomático.', 'https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/', 'Fundamentos', 'avancado', 'nao_iniciado'),
('Architecture Patterns with Python', 'Percival & Gregory', 'DDD, arquitetura limpa e padrões com Python.', 'https://www.cosmicpython.com/', 'Engenharia de Software', 'avancado', 'nao_iniciado'),
('Effective Python', 'Brett Slatkin', '90 maneiras de escrever Python melhor.', 'https://effectivepython.com/', 'Fundamentos', 'intermediario', 'nao_iniciado'),
('Python for Data Analysis', 'Wes McKinney', 'Análise de dados com Pandas, NumPy e Jupyter pelo criador do Pandas.', 'https://wesmckinney.com/book/', 'Análise de Dados', 'intermediario', 'nao_iniciado'),
('Designing Data-Intensive Applications', 'Martin Kleppmann', 'Fundamentos de sistemas de dados distribuídos e confiáveis.', 'https://dataintensive.net/', 'Engenharia de Dados', 'avancado', 'nao_iniciado');

-- =====================================================================
-- CAREER_PATHS
-- =====================================================================
insert into public.career_paths (title, description, area, skills, roadmap, technologies, salary_range, level) values
('Python Developer', 'Desenvolvedor generalista capaz de construir scripts, APIs e aplicações com Python.', 'Backend',
  array['Python moderno','POO','Git','Testes','SQL básico'],
  array['Fundamentos da linguagem','POO e estruturas de dados','APIs simples','Banco de dados','Projetos com CLI e API'],
  array['Python','Git','SQLite','Flask','Pytest'],
  'R$ 3.000 - R$ 8.000', 'basico'),
('Backend Developer', 'Especialista em APIs, persistência, autenticação e arquitetura de serviços.', 'Backend',
  array['FastAPI/Django','SQLAlchemy','PostgreSQL','Auth JWT/OAuth2','Docker'],
  array['Frameworks web','REST e OpenAPI','ORM e migrations','Autenticação e segurança','Deploy com Docker'],
  array['FastAPI','PostgreSQL','SQLAlchemy','Redis','Docker'],
  'R$ 6.000 - R$ 15.000', 'intermediario'),
('Data Analyst', 'Profissional que transforma dados em insights através de análise e visualização.', 'Data Science',
  array['Pandas','SQL','Visualização','Estatística','Storytelling'],
  array['Python para dados','Pandas e NumPy','SQL analítico','Visualização','Dashboards'],
  array['Pandas','NumPy','Matplotlib','Seaborn','DuckDB'],
  'R$ 4.000 - R$ 12.000', 'intermediario'),
('Data Engineer', 'Constrói pipelines, ETLs e plataformas de dados escaláveis.', 'Engenharia de Dados',
  array['SQL avançado','Spark/Dask','Airflow','Modelagem de dados','Cloud'],
  array['Fundamentos de dados','ETL com Python','Orquestração','Big Data e streaming','Lakehouse e warehouses'],
  array['PySpark','Airflow','Kafka','Parquet','Snowflake'],
  'R$ 8.000 - R$ 20.000', 'avancado'),
('IoT Developer', 'Desenvolve soluções conectadas com sensores, microcontroladores e mensageria.', 'IoT',
  array['MicroPython','MQTT','Eletrônica básica','Redes','Cloud IoT'],
  array['Python para hardware','GPIO e sensores','MQTT e mensageria','Integração com nuvem','Dashboards IoT'],
  array['MicroPython','paho-mqtt','Raspberry Pi','MQTT','InfluxDB'],
  'R$ 5.000 - R$ 14.000', 'intermediario'),
('Software Engineer', 'Engenheiro com domínio de arquitetura, qualidade, testes e operação.', 'Engenharia de Software',
  array['Design patterns','SOLID','Testes','CI/CD','Observabilidade'],
  array['POO e design','Arquitetura limpa','Testes e qualidade','Async e performance','DevOps e observabilidade'],
  array['Python','Docker','Kubernetes','Pytest','OpenTelemetry'],
  'R$ 8.000 - R$ 22.000', 'avancado'),
('Automation Developer', 'Cria automações, bots e integrações que eliminam trabalho repetitivo.', 'Automação',
  array['Scripting','Web scraping','APIs','CLIs','Agendamento'],
  array['Automação de tarefas','Web scraping','Bots e integrações','CLIs com Typer/Rich','Agendamento e deploy'],
  array['Playwright','BeautifulSoup','Typer','Rich','APScheduler'],
  'R$ 4.000 - R$ 11.000', 'intermediario');

-- =====================================================================
-- EXERCISES
-- =====================================================================
insert into public.exercises (title, description, difficulty, category, tags, starter_code, solution) values
('FizzBuzz', 'Imprima de 1 a n: "Fizz" para múltiplos de 3, "Buzz" para 5 e "FizzBuzz" para ambos.', 'basico', 'Fundamentos', array['loops','condicionais'],
'def fizzbuzz(n: int) -> None:\n    # seu código aqui\n    pass\n\nfizzbuzz(15)',
'def fizzbuzz(n: int) -> None:\n    for i in range(1, n + 1):\n        out = ""\n        if i % 3 == 0:\n            out += "Fizz"\n        if i % 5 == 0:\n            out += "Buzz"\n        print(out or i)\n\nfizzbuzz(15)'),
('Inverter string', 'Escreva uma função que inverte uma string sem usar reversed().', 'basico', 'Fundamentos', array['strings','slicing'],
'def reverse(s: str) -> str:\n    # seu código aqui\n    return s',
'def reverse(s: str) -> str:\n    return s[::-1]'),
('Contar palavras', 'Conte a frequência de cada palavra em um texto e retorne um dicionário ordenado.', 'intermediario', 'Estruturas de Dados', array['dict','collections'],
'from collections import Counter\n\ndef word_count(text: str) -> dict[str, int]:\n    # seu código aqui\n    return {}',
'from collections import Counter\n\ndef word_count(text: str) -> dict[str, int]:\n    words = text.lower().split()\n    return dict(Counter(words).most_common())'),
('Fibonacci com memoization', 'Calcule o n-ésimo termo de Fibonacci de forma eficiente.', 'intermediario', 'Algoritmos', array['recursão','dp'],
'def fib(n: int) -> int:\n    # use functools.lru_cache\n    pass',
'from functools import lru_cache\n\n@lru_cache(maxsize=None)\ndef fib(n: int) -> int:\n    if n < 2:\n        return n\n    return fib(n - 1) + fib(n - 2)'),
('Validador de parênteses', 'Verifique se uma expressão tem parênteses, colchetes e chaves balanceados.', 'avancado', 'Algoritmos', array['pilha','stack'],
'def is_balanced(s: str) -> bool:\n    # use uma pilha\n    return False',
'def is_balanced(s: str) -> bool:\n    pairs = {")": "(", "]": "[", "}": "{"}\n    stack: list[str] = []\n    for ch in s:\n        if ch in "([{":\n            stack.append(ch)\n        elif ch in pairs:\n            if not stack or stack.pop() != pairs[ch]:\n                return False\n    return not stack'),
('Endpoint de health check', 'Crie um endpoint GET /health em FastAPI que retorna {"status": "ok"} tipado.', 'avancado', 'APIs', array['fastapi','pydantic'],
'from fastapi import FastAPI\n\napp = FastAPI()\n\n# crie o endpoint /health',
'from fastapi import FastAPI\nfrom pydantic import BaseModel\n\nclass Health(BaseModel):\n    status: str\n\napp = FastAPI()\n\n@app.get("/health", response_model=Health)\ndef health() -> Health:\n    return Health(status="ok")'),
('Rate limiter com Redis', 'Implemente um rate limiter de janela fixa usando Redis (sliding opcional).', 'desafio', 'Backend', array['redis','async'],
'import redis.asyncio as redis\n\nasync def allow(key: str, limit: int, window: int) -> bool:\n    # implemente o rate limiting\n    return True',
'import redis.asyncio as redis\n\nr = redis.Redis()\n\nasync def allow(key: str, limit: int, window: int) -> bool:\n    count = await r.incr(key)\n    if count == 1:\n        await r.expire(key, window)\n    return count <= limit'),
('Pipeline ETL simples', 'Leia um CSV, limpe valores nulos, agregue por categoria e escreva um Parquet.', 'desafio', 'Engenharia de Dados', array['pandas','etl'],
'import pandas as pd\n\ndef etl(src: str, dst: str) -> None:\n    # extract, transform, load\n    pass',
'import pandas as pd\n\ndef etl(src: str, dst: str) -> None:\n    df = pd.read_csv(src)\n    df = df.dropna()\n    agg = df.groupby("categoria", as_index=False).sum(numeric_only=True)\n    agg.to_parquet(dst, index=False)');

-- =====================================================================
-- PROJECTS
-- =====================================================================
insert into public.projects (title, description, difficulty, area, technologies, requirements, steps, github_url, status) values
('Calculadora CLI', 'Calculadora de linha de comando com operações básicas e histórico.', 'basico', 'Automação',
  array['Python','argparse/Typer'],
  array['Operações +,-,*,/','Validação de entrada','Histórico de operações'],
  array['Modele as operações','Crie a interface CLI','Adicione tratamento de erros','Salve histórico em arquivo'],
  null, 'nao_iniciado'),
('Sistema de tarefas (To-Do)', 'Gerenciador de tarefas com persistência local e prioridades.', 'basico', 'Backend',
  array['Python','SQLite','Typer'],
  array['CRUD de tarefas','Prioridades e status','Filtros e busca'],
  array['Modele a tabela de tarefas','Implemente CRUD','Adicione filtros','Crie a CLI'],
  null, 'nao_iniciado'),
('Web Scraper', 'Coletor de dados de um site com parsing e exportação para CSV.', 'intermediario', 'Automação',
  array['httpx','BeautifulSoup','Pandas'],
  array['Respeitar robots.txt','Paginação','Rate limiting','Exportar CSV'],
  array['Analise o HTML alvo','Implemente o fetch com backoff','Faça o parsing','Exporte os dados'],
  null, 'nao_iniciado'),
('API REST com FastAPI', 'API completa com autenticação JWT, banco e testes.', 'intermediario', 'Backend',
  array['FastAPI','SQLAlchemy','PostgreSQL','Pytest'],
  array['CRUD com validação','Auth JWT','Migrations','Testes automatizados'],
  array['Estruture o projeto','Modele o domínio','Implemente rotas e auth','Escreva testes','Containerize com Docker'],
  null, 'nao_iniciado'),
('Dashboard de dados', 'Aplicação de visualização interativa de um dataset real.', 'intermediario', 'Data Science',
  array['Pandas','Plotly','Streamlit'],
  array['Carregar e limpar dados','Filtros interativos','Gráficos dinâmicos'],
  array['Escolha o dataset','Limpe os dados','Construa os gráficos','Adicione filtros e deploy'],
  null, 'nao_iniciado'),
('Bot de automação', 'Bot do Telegram que executa tarefas e responde comandos.', 'intermediario', 'Automação',
  array['python-telegram-bot','APScheduler'],
  array['Comandos','Agendamento','Integração com API externa'],
  array['Crie o bot no BotFather','Implemente os comandos','Adicione agendamento','Faça deploy'],
  null, 'nao_iniciado'),
('Sistema IoT com MQTT', 'Coleta de sensores publicando via MQTT e armazenando séries temporais.', 'avancado', 'IoT',
  array['MicroPython','paho-mqtt','InfluxDB'],
  array['Leitura de sensores','Publicação MQTT','Persistência','Dashboard'],
  array['Configure o broker MQTT','Programe o dispositivo','Crie o consumidor','Visualize os dados'],
  null, 'nao_iniciado'),
('Pipeline de dados', 'Pipeline orquestrado que ingere, transforma e disponibiliza dados.', 'avancado', 'Engenharia de Dados',
  array['Airflow','Pandas','Parquet'],
  array['Ingestão agendada','Transformações','Validação de dados','Armazenamento colunar'],
  array['Modele as DAGs','Implemente as tasks','Adicione validações','Monitore as execuções'],
  null, 'nao_iniciado'),
('ETL com Python', 'Processo ETL de uma fonte transacional para um data warehouse.', 'avancado', 'Engenharia de Dados',
  array['Polars','DuckDB','SQLAlchemy'],
  array['Extração incremental','Transformação','Carga idempotente','Logs estruturados'],
  array['Defina as fontes','Implemente extract/transform/load','Garanta idempotência','Adicione observabilidade'],
  null, 'nao_iniciado'),
('Projeto final full-stack Python', 'Aplicação completa: backend FastAPI, banco, frontend e deploy.', 'desafio', 'Engenharia de Software',
  array['FastAPI','PostgreSQL','Docker','CI/CD'],
  array['Domínio bem modelado','Auth','Testes','CI/CD','Observabilidade'],
  array['Planeje a arquitetura','Implemente o backend','Conecte o frontend','Escreva testes','Configure CI/CD e deploy'],
  null, 'nao_iniciado');
