# Carreira Python: Guia Principal dos Conteúdos

Este é o ponto de entrada para estudar os conteúdos de Python deste diretório.

O material está organizado em partes progressivas. A ideia não é apenas "aprender sintaxe", mas construir uma base profissional: fundamentos sólidos, estrutura de dados, matemática aplicada, arquivos, orientação a objetos, algoritmos, testes, automação, dados, APIs, banco, infraestrutura, produção, segurança, arquitetura e especializações.

Use este README como mapa. Os arquivos internos continuam sendo a fonte de estudo detalhada de cada tema.

---

## Como Usar Este Guia

1. Se você está começando, siga a trilha principal em ordem: Parte 1 até Parte 8.
2. Se você já programa, faça uma leitura diagnóstica da Parte 1, Parte 2, Parte 4, Parte 5 e Parte 6 antes de pular para áreas específicas.
3. Se seu objetivo é mercado backend, priorize Python base, OOP, SOLID, testes, qualidade, SQL, APIs, ORM, infra, produção, segurança e arquitetura.
4. Se seu objetivo é dados, priorize Python base, estruturas, matemática, arquivos, Excel, HTTP, SQL, Data Science e finanças quantitativas quando fizer sentido.
5. Se seu objetivo é automação, priorize Python base, arquivos, HTTP, Excel, automação, testes, qualidade e deploy simples.
6. Não estude só lendo. Para cada parte, implemente pelo menos um projeto pequeno e um projeto integrador.

---

## Estrutura Geral

| Parte | Tema | Papel na formação |
| --- | --- | --- |
| [Parte 1](./Parte-1/Basico/README.md) | Python básico e proficiência inicial | Base da linguagem, fluxo, funções, módulos, CLI, arquivos, testes básicos e projeto guiado |
| [Parte 2](./Parte-2/Estruturas/README.md) | Estruturas, algoritmos e matemática | Raciocínio computacional, estruturas de dados, cálculo e base científica |
| [Parte 3](./Parte-3/Arquivos/README.md) | Arquivos e conceitos de banco | Persistência, formatos, processamento de arquivos e fundamentos de banco de dados |
| [Parte 4](./Parte-4/OOP/README.md) | OOP, SOLID e design | Modelagem profissional, orientação a objetos, princípios de design e arquitetura inicial |
| [Parte 5](./Parte-5/BigO/README.md) | Performance, Big O e async | Complexidade, otimização, concorrência, paralelismo, filas e mensageria |
| [Parte 6](./Parte-6/Test/README.md) | Ferramentas profissionais | Testes, qualidade, documentação, HTTP, automação, Excel, finanças e workflows |
| [Parte 7](./Parte-7/API/README.md) | Backend, APIs e dados persistentes | SQL, ORMs, NoSQL, APIs REST, GraphQL, WebSockets, gRPC, Flask e FastAPI |
| [Parte 8](./Parte-8/Infra/README.md) | Infraestrutura, produção e operação | Servidores, CI/CD, observabilidade, deploy, IoT e operação de aplicações reais |
| [Parte 9](./Parte-9/Data_science/README.md) | Dados, análise e engenharia de dados | NumPy, SciPy, pandas, Polars, EDA, visualização, ETL e projetos |
| [Parte 10](./Parte-10/Engenharia/README.md) | Especializações avançadas | Arquitetura, DevOps, segurança, bioinformática e sistemas embarcados |

O arquivo [conteudo_completo.md](./conteudo_completo.md) funciona como um panorama resumido e histórico da trilha. Para estudar de forma organizada, prefira este README e os READMEs de cada categoria, porque eles refletem melhor a estrutura atual em `Parte-*`.

---

## Inventário Coberto

Este guia considera as categorias atuais do diretório `carreira/conteudos`:

- Parte 1: `Basico`.
- Parte 2: `Estruturas` e `Calculo_complete`, com 12 subtrilhas matemáticas.
- Parte 3: `Arquivos` e `Conceitos`.
- Parte 4: `OOP` e `SOLID`.
- Parte 5: `BigO` e `Async`.
- Parte 6: `Python-doc`, `Automacao`, `Test`, `Excel`, `HTTP`, `Financas`, `Financas_quantitativas` e `code-quality`.
- Parte 7: `SQL`, `ORM` e `API`.
- Parte 8: `Infra`, `Infra/Servidores`, `Infra/Actions`, `Infra/Conceitos`, `Observabilidade`, `IoT` e `Productions`.
- Parte 9: `Data_science`.
- Parte 10: `Sistemas_embarcados`, `DevOPS`, `Bioinformática`, `Engenharia` e `Cyber-sec`.

Os READMEs internos são os índices detalhados de cada categoria. Este arquivo organiza a navegação entre eles e define a progressão de estudo.

---

## Trilha Principal Recomendada

### Fase 1: Fundamentos de Python

Comece em [Parte-1/Basico](./Parte-1/Basico/README.md).

Objetivo: escrever Python correto, simples e legível.

Você deve dominar:

- sintaxe, variáveis, tipos e operadores;
- controle de fluxo;
- funções, escopo, comprehensions e generators;
- exceções, decorators e context managers em nível inicial;
- tipagem, PEP 8 e boas práticas;
- ambientes virtuais, módulos, imports e empacotamento;
- entrada e saída via CLI;
- arquivos, JSON, CSV e persistência básica;
- debugging, logs e testes básicos;
- um projeto CLI guiado.

Sinal de domínio: você consegue criar scripts úteis sem copiar estrutura pronta e sabe explicar o fluxo do programa.

### Fase 2: Estruturas, Algoritmos e Matemática

Estude [Parte-2/Estruturas](./Parte-2/Estruturas/README.md) e use [Parte-2/Calculo_complete](./Parte-2/Calculo_complete/README.md) conforme sua trilha exigir.

Objetivo: pensar melhor sobre dados, custo, modelagem e problemas.

Você deve dominar:

- coleções nativas, pilhas, filas, deques, hashes, busca e ordenação;
- módulos, pacotes, iteradores, generators e organização;
- recursão, árvores, grafos e programação dinâmica;
- matemática básica, funções, trigonometria, limites, derivadas, integrais, séries, cálculo multivariável, álgebra linear e equações diferenciais quando trabalhar com dados, ciência, finanças, engenharia ou otimização.

Sinal de domínio: você escolhe a estrutura de dados por motivo técnico, não por hábito.

### Fase 3: Persistência, Arquivos e Bancos

Estude [Parte-3/Arquivos](./Parte-3/Arquivos/README.md) e [Parte-3/Conceitos](./Parte-3/Conceitos/README.md).

Objetivo: lidar com dados reais fora da memória.

Você deve dominar:

- paths, leitura e escrita;
- texto, JSON, CSV, Excel, PDFs, compressão, uploads, downloads e streams;
- arquivos binários, imagens, vídeos e processamento em lote;
- segurança, performance, atomicidade e tratamento de erros em arquivos;
- CRUD, joins, índices, transações, procedures, views, normalização e modelagem.

Sinal de domínio: você consegue criar pipelines pequenos que leem, validam, transformam e persistem dados com segurança.

### Fase 4: OOP, SOLID e Design

Estude [Parte-4/OOP](./Parte-4/OOP/README.md) e [Parte-4/SOLID](./Parte-4/SOLID/README.md).

Objetivo: modelar software que cresce sem virar confusão.

Você deve dominar:

- classe, objeto, atributos, métodos, encapsulamento, herança, polimorfismo e composição;
- métodos mágicos, properties, dataclasses, slots, decorators, descriptors, context managers e metaclasses;
- ABC, Protocols, duck typing, mixins, MRO e generics;
- SOLID, DDD, design patterns, clean architecture, persistência, concorrência, testes e performance em OOP.

Sinal de domínio: você sabe quando usar classe, função, composição, herança, Protocol ou ABC.

### Fase 5: Performance, Big O e Concorrência

Estude [Parte-5/BigO](./Parte-5/BigO/README.md) e [Parte-5/Async](./Parte-5/Async/README.md).

Objetivo: entender custo, escala e execução concorrente.

Você deve dominar:

- notação Big O, tempo, espaço, loops, recursão, recorrências e custo real em Python;
- listas, dicts, sets, deques, heapq, strings, ordenação, busca e hashing;
- profiling, benchmark, otimização e estudos de caso;
- async/await, asyncio, aiohttp, threads, processos, Celery, RabbitMQ, Kafka e arquitetura de sistemas concorrentes.

Sinal de domínio: você mede antes de otimizar e sabe diferenciar I/O bound, CPU bound e gargalo de arquitetura.

### Fase 6: Ferramentas Profissionais

Estude os módulos da [Parte-6](./Parte-6/Test/README.md) conforme sua necessidade.

Objetivo: trabalhar como profissional em projetos reais.

Áreas da Parte 6:

- [Testes](./Parte-6/Test/README.md): pytest, unit tests, integration tests, mocking, TDD, coverage e benchmark.
- [Qualidade de Código](./Parte-6/code-quality/README.md): fundamentos, Black, Ruff, Flake8, isort, mypy e CI.
- [Documentação](./Parte-6/Python-doc/README.md): docstrings, Sphinx, MkDocs, OpenAPI e workflow profissional.
- [HTTP e Redes](./Parte-6/HTTP/README.md): TCP/IP, sockets, HTTP/HTTPS, FTP/SFTP, UDP, MQTT e IoT.
- [Automação](./Parte-6/Automacao/README.md): scripts, scraping, bots, Selenium, BeautifulSoup, Scrapy, desktop/RPA, planilhas e agendamentos.
- [Excel](./Parte-6/Excel/README.md): Excel solo, fórmulas, dados, dashboards, Power Query, Python com Excel e relatórios.
- [Finanças](./Parte-6/Financas/README.md): fundamentos, cálculo financeiro, contabilidade, renda fixa, variável, risco e Python para finanças.
- [Finanças Quantitativas](./Parte-6/Financas_quantitativas/README.md): retornos, estatística, séries temporais, risco, portfólio, backtesting, fatores, renda fixa, derivativos e execução.

Sinal de domínio: seu código tem testes, lint, tipos, documentação e automação básica de qualidade.

### Fase 7: Backend, APIs, SQL e ORM

Estude [Parte-7/SQL](./Parte-7/SQL/README.md), [Parte-7/ORM](./Parte-7/ORM/README.md) e [Parte-7/API](./Parte-7/API/README.md).

Objetivo: criar aplicações backend integradas com dados.

Você deve dominar:

- SQL, consultas avançadas, MySQL com Docker, Python com MySQL, CRUD, transações, Excel e arquitetura de projetos;
- SQLAlchemy, Django ORM, Tortoise, Peewee, MongoDB, Redis, Cassandra e Elasticsearch;
- REST, GraphQL, WebSockets, gRPC, Flask, FastAPI, Tornado, conceitos essenciais de APIs, métodos HTTP, status codes e escolha de framework.

Sinal de domínio: você consegue construir uma API com banco, validação, testes, documentação e uma separação mínima entre domínio, aplicação e infraestrutura.

### Fase 8: Infraestrutura, Produção e Operação

Estude [Parte-8/Infra](./Parte-8/Infra/README.md), [Parte-8/Productions](./Parte-8/Productions/README.md), [Parte-8/Observabilidade](./Parte-8/Observabilidade/README.md) e [Parte-8/IoT](./Parte-8/IoT/README.md) quando fizer sentido.

Objetivo: colocar software no ar e operar com responsabilidade.

Você deve dominar:

- Linux, deploy, Gunicorn, Uvicorn, Nginx, Apache, reverse proxy, autenticação, CORS, rate limiting, upload, background tasks, cache, logs e observabilidade;
- GitHub Actions, GitLab, Jenkins, versionamento, releases e CI/CD;
- VPS, Docker deploy, Kubernetes deploy, serverless, pipelines, balanceamento, escalabilidade e reverse proxy;
- logging, monitoring, Prometheus, Grafana, OpenTelemetry e Sentry;
- fundamentos de IoT, hardware, protocolos, Python embarcado, gateways, dados, segurança e projetos.

Sinal de domínio: você sabe diagnosticar erro em produção por logs, métricas, traces, status de serviço e configuração de rede.

### Fase 9: Dados e Ciência de Dados

Estude [Parte-9/Data_science](./Parte-9/Data_science/README.md).

Objetivo: transformar dados em análise confiável e pipelines.

Você deve dominar:

- ambiente, fluxo de trabalho e fundamentos;
- NumPy, SciPy, pandas, Polars e performance;
- limpeza, wrangling, estatística, EDA, visualização e dashboards;
- ETL, qualidade, pipelines, engenharia de dados, storytelling e projetos.

Sinal de domínio: você produz análises reproduzíveis, com dados limpos, hipóteses claras e entrega compreensível.

### Fase 10: Especialização Profissional

Escolha uma ou mais trilhas da [Parte-10](./Parte-10/Engenharia/README.md).

Áreas:

- [Arquitetura e Engenharia de Software](./Parte-10/Engenharia/README.md): MVC, MVVM, microsserviços, monolitos, DDD, event-driven architecture e hexagonal architecture.
- [DevOps](./Parte-10/DevOPS/README.md): Docker, Docker Compose e Kubernetes com Python.
- [Segurança](./Parte-10/Cyber-sec/README.md): criptografia, hashing, autenticação, SQL injection, XSS, CSRF e OWASP.
- [Sistemas Embarcados](./Parte-10/Sistemas_embarcados/README.md): hardware, MicroPython, GPIO, protocolos, tempo real, IoT, Linux embarcado, segurança e projetos.
- [Bioinformática](./Parte-10/Bioinformática/README.md): biologia molecular, ambiente Python, formatos biológicos, Biopython, NGS, alinhamento, genômica, RNA-seq, filogenia, proteômica e pipelines.

Sinal de domínio: você consegue defender decisões técnicas considerando manutenção, segurança, custo, observabilidade e evolução.

---

## Mapa Completo Por Parte

### Parte 1: Base da Linguagem

- [Basico](./Parte-1/Basico/README.md): trilha completa do básico à proficiência inicial.

Arquivos principais:

- [Sintaxe, variáveis, tipos e operadores](./Parte-1/Basico/01_sintaxe_variaveis_tipos_operadores.md)
- [Controle de fluxo](./Parte-1/Basico/02_controle_de_fluxo.md)
- [Funções, escopo, comprehensions e geradores](./Parte-1/Basico/03_funcoes_escopo_comprehensions_geradores.md)
- [Decorators, context managers e exceções](./Parte-1/Basico/04_decorators_context_managers_excecoes.md)
- [Tipagem, PEP 8 e boas práticas](./Parte-1/Basico/05_tipagem_pep8_boas_praticas.md)
- [Ambientes virtuais e empacotamento](./Parte-1/Basico/06_ambientes_virtuais_empacotamento.md)
- [Entrada e saída via CLI](./Parte-1/Basico/07_entrada_saida_cli.md)
- [Arquivos, JSON, CSV e persistência](./Parte-1/Basico/08_arquivos_json_csv_persistencia.md)
- [Módulos, imports e biblioteca padrão](./Parte-1/Basico/09_modulos_imports_biblioteca_padrao.md)
- [Debugging, logs e diagnóstico](./Parte-1/Basico/10_debugging_logs_diagnostico.md)
- [Testes básicos com pytest](./Parte-1/Basico/11_testes_basicos_pytest_qualidade.md)
- [Projeto guiado CLI](./Parte-1/Basico/12_projeto_guiado_cli.md)
- [Mapa de proficiência Python](./Parte-1/Basico/13_mapa_proficiencia_python.md)

### Parte 2: Estruturas, Algoritmos e Matemática

- [Estruturas](./Parte-2/Estruturas/README.md): fundamentos, coleções, funções, módulos, pilhas, filas, busca, ordenação, recursão, árvores, grafos e programação dinâmica.
- [Cálculo Completo](./Parte-2/Calculo_complete/README.md): matemática para programação científica, dados, finanças, engenharia e modelagem.

Trilhas de cálculo:

- [Matemática Básica](./Parte-2/Calculo_complete/01-Matematica-Basica/README.md)
- [Álgebra e Funções](./Parte-2/Calculo_complete/02-Algebra-Funcoes/README.md)
- [Geometria e Trigonometria](./Parte-2/Calculo_complete/03-Geometria-Trigonometria/README.md)
- [Limites e Continuidade](./Parte-2/Calculo_complete/04-Limites-Continuidade/README.md)
- [Cálculo 1: Derivadas](./Parte-2/Calculo_complete/05-Calculo-1-Derivadas/README.md)
- [Cálculo 1: Integrais](./Parte-2/Calculo_complete/06-Calculo-1-Integrais/README.md)
- [Cálculo 2: Séries e Integrais Avançadas](./Parte-2/Calculo_complete/07-Calculo-2-Series-Integrais/README.md)
- [Cálculo 3: Multivariável](./Parte-2/Calculo_complete/08-Calculo-3-Multivariavel/README.md)
- [Álgebra Linear](./Parte-2/Calculo_complete/09-Algebra-Linear/README.md)
- [Equações Diferenciais](./Parte-2/Calculo_complete/10-Equacoes-Diferenciais/README.md)
- [Matemática Avançada](./Parte-2/Calculo_complete/11-Matematica-Avancada/README.md)
- [Python para Cálculo e Projetos](./Parte-2/Calculo_complete/12-Python-Calculo-Projetos/README.md)

### Parte 3: Arquivos e Banco de Dados Conceitual

- [Arquivos](./Parte-3/Arquivos/README.md): paths, leitura, escrita, formatos, Excel, PDFs, compressão, streams, imagens, vídeos, segurança e performance.
- [Conceitos de Banco de Dados](./Parte-3/Conceitos/README.md): CRUD, joins, índices, transações, procedures, views, normalização e modelagem.

### Parte 4: Design de Código

- [OOP](./Parte-4/OOP/README.md): orientação a objetos completa, de fundamentos a recursos avançados de Python.
- [SOLID](./Parte-4/SOLID/README.md): fundamentos de design OO, SRP, OCP, LSP, ISP, DIP e aplicação com arquitetura e testes.

### Parte 5: Performance e Concorrência

- [Big O](./Parte-5/BigO/README.md): complexidade, custo real em Python, algoritmos clássicos, otimização, teoria avançada e profiling.
- [Async](./Parte-5/Async/README.md): concorrência, async/await, asyncio, aiohttp, threads, processos, Celery, RabbitMQ, Kafka e produção.

### Parte 6: Ferramentas e Áreas Aplicadas

- [Python-doc](./Parte-6/Python-doc/README.md): documentação profissional com docstrings, Sphinx, MkDocs e OpenAPI.
- [Automação](./Parte-6/Automacao/README.md): scripts, scraping, bots, RPA, planilhas e agendamentos.
- [Test](./Parte-6/Test/README.md): pytest, testes unitários, integração, mocking, TDD, coverage e benchmark.
- [Excel](./Parte-6/Excel/README.md): Excel profissional, dashboards, Power Query, Python com Excel e relatórios.
- [HTTP](./Parte-6/HTTP/README.md): redes, sockets, HTTP, FTP/SFTP, UDP e MQTT.
- [Finanças](./Parte-6/Financas/README.md): finanças, cálculo financeiro, contabilidade, renda fixa, variável, derivativos e Python.
- [Finanças Quantitativas](./Parte-6/Financas_quantitativas/README.md): dados de mercado, estatística, risco, portfólio, backtesting, modelos fatoriais, derivativos e projetos.
- [Qualidade de Código](./Parte-6/code-quality/README.md): Black, Ruff, Flake8, isort, mypy e workflows de qualidade.

### Parte 7: Backend e Dados Persistentes

- [SQL](./Parte-7/SQL/README.md): fundamentos, consultas avançadas, MySQL, Python, CRUD, transações, Excel e arquitetura.
- [ORM](./Parte-7/ORM/README.md): SQLAlchemy, Django ORM, Tortoise, Peewee, MongoDB, Redis, Cassandra e Elasticsearch.
- [API](./Parte-7/API/README.md): REST, GraphQL, WebSockets, gRPC, Flask, FastAPI, Tornado e conceitos essenciais.

### Parte 8: Infraestrutura, Operação e Produção

- [Infra](./Parte-8/Infra/README.md): servidores, runtime, CI/CD e conceitos de backend.
- [Infra/Servidores](./Parte-8/Infra/Servidores/README.md): Linux, Nginx, Apache, reverse proxy, Gunicorn e Uvicorn.
- [Infra/Actions](./Parte-8/Infra/Actions/README.md): GitHub Actions, GitLab, Jenkins, deploy, versionamento e release.
- [Infra/Conceitos](./Parte-8/Infra/Conceitos/README.md): autenticação, JWT, OAuth2, CORS, rate limiting, serialização, uploads, background tasks, cache, logs e observabilidade.
- [Observabilidade](./Parte-8/Observabilidade/README.md): logging, monitoring, Prometheus, Grafana, OpenTelemetry e Sentry.
- [IoT](./Parte-8/IoT/README.md): fundamentos, hardware, protocolos, Python embarcado, gateways, dados, segurança e projetos.
- [Productions](./Parte-8/Productions/README.md): VPS, Docker, Kubernetes, serverless, CI/CD, balanceamento, escalabilidade e reverse proxy.

### Parte 9: Dados

- [Data Science](./Parte-9/Data_science/README.md): ambiente, NumPy, SciPy, pandas, Polars, estatística, EDA, visualização, ETL, dashboards e projetos.

### Parte 10: Especializações

- [Sistemas Embarcados](./Parte-10/Sistemas_embarcados/README.md): eletrônica, MicroPython, GPIO, sensores, protocolos, tempo real, IoT, Linux embarcado e projetos.
- [DevOPS](./Parte-10/DevOPS/README.md): Docker, Docker Compose e Kubernetes aplicados a Python.
- [Bioinformática](./Parte-10/Bioinformática/README.md): fundamentos, formatos biológicos, Biopython, NGS, alinhamento, genômica, transcriptômica, filogenia, proteômica e pipelines.
- [Engenharia](./Parte-10/Engenharia/README.md): MVC, MVVM, microsserviços, monolitos, DDD, event-driven architecture e hexagonal architecture.
- [Cyber-sec](./Parte-10/Cyber-sec/README.md): criptografia, hashing, segurança de APIs, SQL injection, XSS, CSRF e OWASP.

---

## Trilhas Por Objetivo Profissional

### Backend Developer Python

Ordem recomendada:

1. [Parte 1: Básico](./Parte-1/Basico/README.md)
2. [Parte 2: Estruturas](./Parte-2/Estruturas/README.md)
3. [Parte 4: OOP](./Parte-4/OOP/README.md)
4. [Parte 4: SOLID](./Parte-4/SOLID/README.md)
5. [Parte 6: Testes](./Parte-6/Test/README.md)
6. [Parte 6: Qualidade](./Parte-6/code-quality/README.md)
7. [Parte 7: SQL](./Parte-7/SQL/README.md)
8. [Parte 7: ORM](./Parte-7/ORM/README.md)
9. [Parte 7: API](./Parte-7/API/README.md)
10. [Parte 8: Infra e Produção](./Parte-8/Productions/README.md)
11. [Parte 10: Engenharia](./Parte-10/Engenharia/README.md)
12. [Parte 10: Segurança](./Parte-10/Cyber-sec/README.md)

Projeto de validação: API FastAPI com autenticação, banco relacional, migrations, testes, Docker, CI, logs e deploy.

### Data Analyst ou Data Engineer

Ordem recomendada:

1. [Parte 1: Básico](./Parte-1/Basico/README.md)
2. [Parte 2: Estruturas](./Parte-2/Estruturas/README.md)
3. [Parte 2: Matemática e Cálculo](./Parte-2/Calculo_complete/README.md)
4. [Parte 3: Arquivos](./Parte-3/Arquivos/README.md)
5. [Parte 6: Excel](./Parte-6/Excel/README.md)
6. [Parte 6: HTTP](./Parte-6/HTTP/README.md)
7. [Parte 7: SQL](./Parte-7/SQL/README.md)
8. [Parte 9: Data Science](./Parte-9/Data_science/README.md)
9. [Parte 5: Big O](./Parte-5/BigO/README.md)
10. [Parte 8: Observabilidade](./Parte-8/Observabilidade/README.md)

Projeto de validação: pipeline ETL com ingestão de API, limpeza, validação, persistência SQL, dashboard e relatório automatizado.

### Automação e RPA

Ordem recomendada:

1. [Parte 1: Básico](./Parte-1/Basico/README.md)
2. [Parte 3: Arquivos](./Parte-3/Arquivos/README.md)
3. [Parte 6: Automação](./Parte-6/Automacao/README.md)
4. [Parte 6: Excel](./Parte-6/Excel/README.md)
5. [Parte 6: HTTP](./Parte-6/HTTP/README.md)
6. [Parte 6: Testes](./Parte-6/Test/README.md)
7. [Parte 6: Qualidade](./Parte-6/code-quality/README.md)
8. [Parte 8: Produção](./Parte-8/Productions/README.md)

Projeto de validação: automação que coleta dados, gera relatório Excel/PDF, registra logs, trata erros, envia notificação e roda por agendamento.

### DevOps, Plataforma e SRE

Ordem recomendada:

1. [Parte 1: Básico](./Parte-1/Basico/README.md)
2. [Parte 6: Testes](./Parte-6/Test/README.md)
3. [Parte 6: Qualidade](./Parte-6/code-quality/README.md)
4. [Parte 7: API](./Parte-7/API/README.md)
5. [Parte 8: Infra](./Parte-8/Infra/README.md)
6. [Parte 8: Produção](./Parte-8/Productions/README.md)
7. [Parte 8: Observabilidade](./Parte-8/Observabilidade/README.md)
8. [Parte 10: DevOPS](./Parte-10/DevOPS/README.md)
9. [Parte 10: Segurança](./Parte-10/Cyber-sec/README.md)

Projeto de validação: deploy de API Python com Docker, CI/CD, reverse proxy, TLS, métricas, logs, alertas e estratégia de rollback.

### Python para Finanças

Ordem recomendada:

1. [Parte 1: Básico](./Parte-1/Basico/README.md)
2. [Parte 2: Matemática](./Parte-2/Calculo_complete/README.md)
3. [Parte 3: Arquivos](./Parte-3/Arquivos/README.md)
4. [Parte 6: Excel](./Parte-6/Excel/README.md)
5. [Parte 6: Finanças](./Parte-6/Financas/README.md)
6. [Parte 6: Finanças Quantitativas](./Parte-6/Financas_quantitativas/README.md)
7. [Parte 7: SQL](./Parte-7/SQL/README.md)
8. [Parte 9: Data Science](./Parte-9/Data_science/README.md)

Projeto de validação: análise de ativos com ingestão de dados, cálculo de retornos, risco, backtesting, relatório e dashboard.

### Segurança e Engenharia de Software

Ordem recomendada:

1. [Parte 1: Básico](./Parte-1/Basico/README.md)
2. [Parte 4: OOP](./Parte-4/OOP/README.md)
3. [Parte 4: SOLID](./Parte-4/SOLID/README.md)
4. [Parte 6: Testes](./Parte-6/Test/README.md)
5. [Parte 7: API](./Parte-7/API/README.md)
6. [Parte 8: Infra](./Parte-8/Infra/README.md)
7. [Parte 10: Engenharia](./Parte-10/Engenharia/README.md)
8. [Parte 10: Cyber-sec](./Parte-10/Cyber-sec/README.md)

Projeto de validação: serviço backend com autenticação, autorização por recurso, proteção contra SQL injection, XSS, CSRF, logs de auditoria e testes de segurança.

---

## Como Estudar Cada Módulo

Para cada categoria:

1. Leia o `README.md` da categoria.
2. Estude os arquivos numerados na ordem.
3. Reproduza os exemplos localmente.
4. Crie variações próprias dos exemplos.
5. Faça um resumo com decisões, não apenas definições.
6. Implemente um mini projeto.
7. Escreva testes quando houver código.
8. Revise erros comuns e checklists.

Para cada parte:

1. Conclua os arquivos principais.
2. Faça um projeto de integração da parte.
3. Revise conceitos que aparecem em partes anteriores.
4. Só avance quando conseguir explicar o tema sem depender do texto.

---

## Projetos Integradores Progressivos

1. CLI de tarefas com arquivos JSON, logs e testes.
2. Processador de CSV/Excel com validação, relatório e tratamento de erro.
3. Biblioteca de domínio usando OOP, dataclasses, Protocols e testes.
4. API REST com FastAPI, SQLAlchemy, migrations, pytest e Docker.
5. Pipeline ETL com ingestão HTTP, persistência SQL e dashboard.
6. Sistema assíncrono com filas, worker e retry.
7. Deploy em VPS com Nginx, TLS, systemd, logs e backup.
8. Observabilidade com logs estruturados, métricas e tracing.
9. Projeto de segurança com autenticação, autorização e checklist OWASP.
10. Projeto final por especialidade: backend, dados, finanças, DevOps, IoT, bioinformática ou segurança.

---

## Checklist de Profissional Python

Você está saindo do nível iniciante quando consegue:

- escrever funções pequenas, claras e testáveis;
- organizar módulos e pacotes sem improviso;
- usar ambiente virtual e dependências isoladas;
- lidar com arquivos, erros, logs e entrada do usuário;
- escrever testes básicos.

Você está em nível intermediário quando consegue:

- modelar dados com classes, dataclasses e estruturas adequadas;
- usar OOP, composição e Protocols com critério;
- explicar custo de algoritmos comuns;
- integrar APIs, SQL e arquivos;
- automatizar tarefas reais;
- aplicar lint, formatação, tipagem e CI.

Você está em nível profissional quando consegue:

- construir APIs com banco, testes, documentação e deploy;
- diagnosticar problemas com logs, métricas e traces;
- proteger segredos e validar entradas;
- projetar arquitetura simples e evolutiva;
- medir performance antes de otimizar;
- manter código legível por outras pessoas;
- entregar projetos reproduzíveis.

Você está em nível avançado quando consegue:

- tomar decisões de arquitetura com trade-offs explícitos;
- projetar sistemas concorrentes e assíncronos;
- operar serviços em produção;
- aplicar segurança desde o design;
- criar pipelines de dados confiáveis;
- orientar outros desenvolvedores com critérios técnicos claros.

---

## Regra de Ouro

Estudar Python profissionalmente não é acumular arquivos lidos. É construir repertório para resolver problemas reais com código claro, testável, seguro, observável e sustentável.

Leia, pratique, teste, publique pequenos projetos e revise. A ordem importa, mas a prática consistente importa mais.