// Metadados ricos por categoria de stack — usados na rota /stack.
export interface StackCategoryMeta {
  tagline: string;
  projectTypes: string[]; // que tipos de projeto usam essa stack
  prerequisites: string[]; // o que saber antes de começar
  technologies: string[]; // tecnologias/conceitos relacionados
  tools: string[]; // ferramentas do dia a dia
  hoursToMaster: number; // horas estimadas para dominar
  careers: string[]; // cargos que usam
  relatedTrack?: string; // id de trilha relacionada
}

export const STACK_META: Record<string, StackCategoryMeta> = {
  Linguagem: {
    tagline: "A base de tudo: a linguagem Python e seu núcleo.",
    projectTypes: ["Scripts e automações", "Qualquer aplicação Python", "Prototipagem rápida"],
    prerequisites: ["Lógica de programação básica", "Noções de terminal"],
    technologies: ["Tipos, funções, POO", "Comprehensions, geradores", "Decorators, context managers", "Type hints"],
    tools: ["Python 3.13+", "VS Code", "pip / venv", "IPython"],
    hoursToMaster: 60,
    careers: ["Qualquer dev Python"],
    relatedTrack: "primeiros-passos",
  },
  "Web/APIs": {
    tagline: "APIs e aplicações web performáticas e seguras.",
    projectTypes: ["APIs REST/GraphQL", "Backends de SaaS", "Microserviços", "Webhooks e integrações"],
    prerequisites: ["Python intermediário", "HTTP, JSON, REST", "Bancos de dados básico"],
    technologies: ["FastAPI / Django / Flask", "Pydantic (validação)", "JWT / OAuth", "WebSockets, gRPC"],
    tools: ["Postman/Insomnia", "Uvicorn", "Swagger/OpenAPI", "httpx"],
    hoursToMaster: 90,
    careers: ["Backend Developer", "API Engineer", "Full Stack"],
    relatedTrack: "backend-developer",
  },
  "Banco de Dados": {
    tagline: "Modelagem, ORM, cache e persistência de dados.",
    projectTypes: ["Backends com persistência", "Sistemas transacionais", "Cache e filas"],
    prerequisites: ["SQL básico", "Python intermediário", "Modelagem de dados"],
    technologies: ["PostgreSQL", "SQLAlchemy / SQLModel", "Alembic (migrations)", "Redis (cache)"],
    tools: ["DBeaver / pgAdmin", "Supabase", "psql", "Redis CLI"],
    hoursToMaster: 70,
    careers: ["Backend Developer", "DBA", "Data Engineer"],
    relatedTrack: "backend-developer",
  },
  "Data Science": {
    tagline: "Análise, visualização e ciência de dados.",
    projectTypes: ["Análise exploratória", "Dashboards", "Relatórios automatizados", "Pipelines de dados"],
    prerequisites: ["Python intermediário", "Estatística básica", "Matemática (média, desvio)"],
    technologies: ["Pandas / Polars", "NumPy / SciPy", "Matplotlib / Plotly", "Jupyter, DuckDB"],
    tools: ["Jupyter Lab", "Google Colab", "Kaggle", "Excel/CSV"],
    hoursToMaster: 100,
    careers: ["Data Analyst", "Data Scientist", "BI Analyst"],
    relatedTrack: "data-analytics",
  },
  "Machine Learning": {
    tagline: "Modelos preditivos, deep learning e IA.",
    projectTypes: ["Classificação/regressão", "Visão computacional", "NLP / LLMs", "Sistemas de recomendação"],
    prerequisites: ["Data Science sólido", "Álgebra linear", "Estatística e cálculo básico"],
    technologies: ["scikit-learn", "PyTorch", "Hugging Face", "OpenCV"],
    tools: ["Jupyter / Colab", "Weights & Biases", "GPU/CUDA", "MLflow"],
    hoursToMaster: 160,
    careers: ["ML Engineer", "Data Scientist", "AI Researcher"],
    relatedTrack: "machine-learning",
  },
  "Engenharia de Dados": {
    tagline: "Pipelines, orquestração e processamento em escala.",
    projectTypes: ["ETL/ELT", "Data lakes/warehouses", "Pipelines batch e streaming"],
    prerequisites: ["SQL avançado", "Python intermediário", "Bancos de dados", "Cloud básico"],
    technologies: ["Airflow", "Spark / PySpark", "Kafka", "dbt, Parquet"],
    tools: ["Airflow UI", "Spark UI", "Docker", "Cloud (AWS/GCP)"],
    hoursToMaster: 140,
    careers: ["Data Engineer", "Analytics Engineer"],
    relatedTrack: "engenharia-dados",
  },
  DevOps: {
    tagline: "Containers, CI/CD, observabilidade e deploy.",
    projectTypes: ["Deploy de apps", "Infra como código", "Monitoramento", "Pipelines CI/CD"],
    prerequisites: ["Linux e terminal", "Git", "Redes básico", "Docker"],
    technologies: ["Docker / Kubernetes", "GitHub Actions", "Nginx / Gunicorn", "Prometheus / Grafana"],
    tools: ["Docker Desktop", "kubectl", "GitHub", "Terminal/SSH"],
    hoursToMaster: 130,
    careers: ["DevOps Engineer", "SRE", "Platform Engineer"],
    relatedTrack: "devops-cloud",
  },
  "Async": {
    tagline: "Concorrência, filas e processamento assíncrono.",
    projectTypes: ["Tarefas em background", "Filas de mensagens", "Scrapers concorrentes", "Real-time"],
    prerequisites: ["Python intermediário", "I/O e rede", "APIs"],
    technologies: ["asyncio", "Celery", "Kafka / RabbitMQ", "Redis"],
    tools: ["Flower (Celery)", "Redis CLI", "RabbitMQ Mgmt", "httpx async"],
    hoursToMaster: 80,
    careers: ["Backend Developer", "Platform Engineer"],
    relatedTrack: "backend-developer",
  },
  "Automação": {
    tagline: "Scraping, bots, CLIs e automação de tarefas.",
    projectTypes: ["Web scraping", "Bots e CLIs", "Automação de planilhas", "RPA"],
    prerequisites: ["Python básico/intermediário", "HTML/CSS básico", "Regex"],
    technologies: ["Scrapy / BeautifulSoup", "Playwright", "Typer / Rich", "Requests/httpx"],
    tools: ["Playwright Inspector", "cron / scheduler", "Terminal", "VS Code"],
    hoursToMaster: 50,
    careers: ["Automation Engineer", "Backend Developer"],
    relatedTrack: "automacao",
  },
  Qualidade: {
    tagline: "Testes, lint, tipos e qualidade de código.",
    projectTypes: ["Qualquer projeto profissional", "Bibliotecas", "Pipelines CI"],
    prerequisites: ["Python intermediário", "Git"],
    technologies: ["Pytest", "mypy (tipos)", "Ruff / Black", "Coverage"],
    tools: ["pre-commit", "GitHub Actions", "VS Code", "tox"],
    hoursToMaster: 40,
    careers: ["Qualquer dev sênior", "QA Engineer"],
    relatedTrack: "python-developer",
  },
  IoT: {
    tagline: "Dispositivos, sensores e mensageria leve.",
    projectTypes: ["Telemetria de sensores", "Automação residencial", "Edge computing"],
    prerequisites: ["Python básico", "Eletrônica básica", "Redes/MQTT"],
    technologies: ["MQTT / paho-mqtt", "MicroPython", "Raspberry Pi", "GPIO"],
    tools: ["Mosquitto", "Raspberry Pi", "Sensores", "Wokwi"],
    hoursToMaster: 70,
    careers: ["IoT Developer", "Embedded Engineer"],
    relatedTrack: "iot-embarcados",
  },
};

export const DEFAULT_META: StackCategoryMeta = {
  tagline: "Tecnologias do ecossistema Python.",
  projectTypes: ["Projetos Python diversos"],
  prerequisites: ["Python intermediário"],
  technologies: [],
  tools: ["Python", "VS Code"],
  hoursToMaster: 60,
  careers: ["Python Developer"],
};
