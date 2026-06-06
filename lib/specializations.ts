import {
  Database,
  Boxes,
  LineChart,
  Building2,
  BrainCircuit,
  ServerCog,
  Bot,
  ShieldCheck,
  Cpu,
  Network,
  type LucideIcon,
} from "lucide-react";

export interface Phase {
  title: string;
  topics: string[];
}

export interface Specialization {
  id: string;
  title: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  level: "Avançado" | "Especialista";
  duration: string;
  accent: string;
  skills: string[];
  technologies: string[];
  phases: Phase[];
  projects: string[];
  roles: string[];
  salary: string;
}

export const SPECIALIZATIONS: Specialization[] = [
  {
    id: "engenharia-de-dados",
    title: "Engenheiro de Dados",
    tagline: "Construa pipelines e plataformas de dados em escala",
    description:
      "Domine a engenharia de dados com Python: ingestão, transformação, orquestração e disponibilização de dados confiáveis para analytics e ML.",
    icon: Database,
    level: "Especialista",
    duration: "~120h",
    accent: "from-magenta/20 to-magenta/5 text-magenta",
    skills: ["Modelagem de dados", "ETL/ELT", "Orquestração", "Streaming", "Data quality", "Cloud"],
    technologies: ["PySpark", "Polars", "DuckDB", "Airflow", "Kafka", "dbt", "Delta Lake", "Snowflake"],
    phases: [
      { title: "Fundamentos de dados", topics: ["SQL avançado", "Modelagem dimensional", "Formatos colunares (Parquet)", "Particionamento"] },
      { title: "ETL e transformação", topics: ["Pandas/Polars em escala", "DuckDB analítico", "dbt e transformações governadas", "Validação com Great Expectations"] },
      { title: "Orquestração", topics: ["Airflow/Prefect/Dagster", "DAGs idempotentes", "Lineage e data assets", "Agendamento e backfill"] },
      { title: "Big Data e streaming", topics: ["PySpark e processamento distribuído", "Kafka e eventos", "Lakehouse (Delta/Iceberg)", "Otimização de jobs"] },
      { title: "Plataforma e operação", topics: ["Data warehouses (Snowflake/BigQuery)", "Observabilidade de dados", "Custo e performance", "CI/CD de pipelines"] },
    ],
    projects: ["Pipeline ETL orquestrado", "Data lake em camadas (bronze/silver/gold)", "Streaming de eventos com Kafka", "Plataforma de qualidade de dados"],
    roles: ["Data Engineer", "Analytics Engineer", "Big Data Engineer"],
    salary: "R$ 8.000 – R$ 25.000",
  },
  {
    id: "engenharia-de-software",
    title: "Engenheiro de Software",
    tagline: "Projete sistemas robustos, testáveis e escaláveis",
    description:
      "Eleve sua engenharia: arquitetura limpa, design patterns, testes, performance, concorrência e operação de sistemas em produção com Python.",
    icon: Boxes,
    level: "Especialista",
    duration: "~130h",
    accent: "from-primary-light/20 to-primary/5 text-primary-light",
    skills: ["SOLID", "Design patterns", "Arquitetura", "Testes", "Performance", "Observabilidade"],
    technologies: ["FastAPI", "SQLAlchemy", "PostgreSQL", "Docker", "Kubernetes", "Pytest", "OpenTelemetry"],
    phases: [
      { title: "Design e POO avançado", topics: ["SOLID na prática", "Design patterns", "Protocols e tipagem", "Metaprogramação consciente"] },
      { title: "Arquitetura", topics: ["Clean/Hexagonal Architecture", "DDD", "CQRS e Event-driven", "Fronteiras e contratos"] },
      { title: "Qualidade", topics: ["Pytest avançado", "TDD e property-based", "Cobertura e CI", "Code review sênior"] },
      { title: "Performance e concorrência", topics: ["Profiling (cProfile/py-spy)", "Async e paralelismo", "Otimização medida", "Caching"] },
      { title: "Operação", topics: ["Docker e Kubernetes", "Observabilidade (logs/métricas/tracing)", "Resiliência (timeouts/retries/circuit breaker)", "Deploy e rollback"] },
    ],
    projects: ["API em camadas com DDD", "Sistema event-driven", "Serviço com observabilidade completa", "Projeto full-stack com CI/CD"],
    roles: ["Software Engineer", "Backend Engineer", "Staff Engineer"],
    salary: "R$ 8.000 – R$ 28.000",
  },
  {
    id: "analise-de-dados",
    title: "Analista de Dados",
    tagline: "Transforme dados em decisões de negócio",
    description:
      "Aprenda a coletar, limpar, analisar e comunicar dados com Python — de EDA e estatística a dashboards e storytelling.",
    icon: LineChart,
    level: "Avançado",
    duration: "~90h",
    accent: "from-blue/20 to-blue/5 text-blue",
    skills: ["Pandas", "SQL", "Estatística", "Visualização", "Storytelling", "Métricas"],
    technologies: ["Pandas", "NumPy", "Matplotlib", "Seaborn", "Plotly", "DuckDB", "Streamlit"],
    phases: [
      { title: "Manipulação de dados", topics: ["Pandas avançado", "Limpeza e tipos", "Joins e reshape", "SQL analítico"] },
      { title: "Estatística aplicada", topics: ["Estatística descritiva", "Distribuições", "Testes de hipótese", "Correlação vs causalidade"] },
      { title: "Visualização", topics: ["Matplotlib/Seaborn", "Gráficos interativos (Plotly)", "Boas práticas visuais", "Dashboards"] },
      { title: "Comunicação", topics: ["Storytelling com dados", "KPIs e métricas", "Relatórios automatizados", "Apresentação executiva"] },
    ],
    projects: ["EDA completo de um dataset real", "Dashboard interativo de KPIs", "Relatório analítico automatizado", "Análise de coorte/retenção"],
    roles: ["Data Analyst", "Business Analyst", "BI Analyst"],
    salary: "R$ 4.000 – R$ 14.000",
  },
  {
    id: "arquitetura-de-software",
    title: "Arquiteto de Software",
    tagline: "Desenhe sistemas que evoluem sem virar caos",
    description:
      "Pense em arquitetura: modelagem de domínio, decisões de design, escalabilidade, resiliência e governança técnica para times.",
    icon: Building2,
    level: "Especialista",
    duration: "~110h",
    accent: "from-primary-light/20 to-primary/5 text-primary-light",
    skills: ["Modelagem de domínio", "Trade-offs", "Escalabilidade", "Resiliência", "Liderança técnica"],
    technologies: ["FastAPI", "Kafka", "Redis", "PostgreSQL", "Kubernetes", "Terraform"],
    phases: [
      { title: "Fundamentos arquiteturais", topics: ["Coesão e acoplamento", "Camadas e fronteiras", "Clean/Hexagonal", "ADRs e documentação"] },
      { title: "Domínio e dados", topics: ["DDD e bounded contexts", "Consistência forte vs eventual", "CQRS e Event Sourcing", "Modelagem de dados"] },
      { title: "Sistemas distribuídos", topics: ["Microsserviços vs monólito", "Mensageria e eventos", "Sagas e idempotência", "Resiliência"] },
      { title: "Escala e operação", topics: ["Escalabilidade horizontal", "Cache e performance", "Observabilidade e SRE", "Custo e governança"] },
    ],
    projects: ["Desenho de arquitetura de um produto", "Migração de monólito para serviços", "Sistema event-driven resiliente", "Plataforma interna (platform engineering)"],
    roles: ["Software Architect", "Solutions Architect", "Principal Engineer"],
    salary: "R$ 14.000 – R$ 40.000",
  },
  {
    id: "machine-learning",
    title: "Engenheiro de Machine Learning",
    tagline: "Leve modelos do notebook à produção",
    description:
      "Construa, treine e opere modelos de ML em produção com Python: pipelines, serving, MLOps e monitoramento de drift.",
    icon: BrainCircuit,
    level: "Especialista",
    duration: "~120h",
    accent: "from-green/20 to-green/5 text-green",
    skills: ["ML clássico", "Deep learning", "Feature engineering", "MLOps", "Serving", "Monitoramento"],
    technologies: ["scikit-learn", "PyTorch", "MLflow", "DVC", "FastAPI", "Optuna", "Docker"],
    phases: [
      { title: "ML clássico", topics: ["Pipelines sklearn", "Validação e métricas", "Feature engineering", "Tuning de hiperparâmetros"] },
      { title: "Deep learning", topics: ["PyTorch e tensores", "Treino e avaliação", "Transfer learning", "Regularização"] },
      { title: "MLOps", topics: ["MLflow (tracking/registry)", "DVC e versionamento", "Reprodutibilidade", "CI/CD de modelos"] },
      { title: "Produção", topics: ["Serving (FastAPI/BentoML)", "Monitoramento de drift", "A/B testing", "Custo e latência"] },
    ],
    projects: ["Modelo end-to-end servido via API", "Pipeline de ML reprodutível", "Sistema de recomendação", "Monitoramento de drift em produção"],
    roles: ["ML Engineer", "MLOps Engineer", "Applied Scientist"],
    salary: "R$ 10.000 – R$ 30.000",
  },
  {
    id: "devops-cloud",
    title: "Engenheiro DevOps / Cloud",
    tagline: "Automatize entrega e operação de software",
    description:
      "Domine containers, CI/CD, infraestrutura como código, observabilidade e nuvem para entregar e operar sistemas Python com confiabilidade.",
    icon: ServerCog,
    level: "Especialista",
    duration: "~100h",
    accent: "from-blue/20 to-blue/5 text-blue",
    skills: ["Docker", "Kubernetes", "CI/CD", "IaC", "Observabilidade", "SRE"],
    technologies: ["Docker", "Kubernetes", "Terraform", "GitHub Actions", "Prometheus", "Grafana", "AWS"],
    phases: [
      { title: "Containers", topics: ["Docker e multi-stage", "Compose", "Imagens seguras", "Registries"] },
      { title: "CI/CD", topics: ["GitHub Actions/GitLab CI", "Lint/test/build/deploy", "GitOps", "Rollback"] },
      { title: "Orquestração e IaC", topics: ["Kubernetes e Helm", "Terraform", "Configuração e segredos", "Escalabilidade"] },
      { title: "Observabilidade e SRE", topics: ["Prometheus/Grafana", "OpenTelemetry", "SLIs/SLOs", "Incidentes e runbooks"] },
    ],
    projects: ["Pipeline CI/CD completo", "Deploy em Kubernetes com Helm", "Stack de observabilidade", "Infra como código com Terraform"],
    roles: ["DevOps Engineer", "Platform Engineer", "SRE", "Cloud Engineer"],
    salary: "R$ 8.000 – R$ 26.000",
  },
  {
    id: "ia-llms",
    title: "Engenheiro de IA / LLMs",
    tagline: "Construa aplicações com IA generativa",
    description:
      "Crie aplicações com LLMs em Python: RAG, embeddings, bancos vetoriais, avaliação, guardrails e observabilidade de IA.",
    icon: Bot,
    level: "Especialista",
    duration: "~90h",
    accent: "from-magenta/20 to-magenta/5 text-magenta",
    skills: ["LLMs", "RAG", "Embeddings", "Prompt engineering", "Avaliação", "Guardrails"],
    technologies: ["Transformers", "LangChain", "FAISS", "Qdrant", "FastAPI", "sentence-transformers"],
    phases: [
      { title: "Fundamentos de NLP", topics: ["Tokenização", "Embeddings", "Transformers", "spaCy"] },
      { title: "RAG", topics: ["Busca semântica", "Bancos vetoriais", "Chunking e contexto", "Grounding"] },
      { title: "Aplicações", topics: ["Orquestração (LangChain/LlamaIndex)", "APIs de IA com FastAPI", "Cache e streaming", "Function calling"] },
      { title: "Qualidade e operação", topics: ["Avaliação de prompts", "Guardrails", "Observabilidade de LLM", "Custo e latência"] },
    ],
    projects: ["Chatbot com RAG sobre documentos", "Busca semântica", "API de IA com guardrails", "Avaliação automatizada de prompts"],
    roles: ["AI Engineer", "LLM Engineer", "Applied AI Engineer"],
    salary: "R$ 10.000 – R$ 32.000",
  },
  {
    id: "cybersecurity",
    title: "Engenheiro de Segurança",
    tagline: "Proteja aplicações e dados com Python",
    description:
      "Aprenda segurança aplicada: OWASP, criptografia, autenticação, análise de vulnerabilidades e segurança em pipelines (DevSecOps).",
    icon: ShieldCheck,
    level: "Especialista",
    duration: "~95h",
    accent: "from-danger/20 to-danger/5 text-danger",
    skills: ["OWASP", "Criptografia", "Auth", "Threat modeling", "DevSecOps"],
    technologies: ["cryptography", "PyJWT", "bcrypt", "Bandit", "pip-audit", "Scapy", "Semgrep"],
    phases: [
      { title: "Fundamentos", topics: ["Criptografia e hashing", "Secrets e gestão de chaves", "TLS/HTTPS", "Modelagem de ameaças"] },
      { title: "Segurança de aplicações", topics: ["OWASP Top 10", "SQL injection/XSS/CSRF", "Validação e sanitização", "Auth (JWT/OAuth2)"] },
      { title: "Autorização", topics: ["RBAC e ABAC", "Sessões seguras", "Rate limiting", "Auditoria"] },
      { title: "DevSecOps", topics: ["Bandit/Semgrep/Trivy", "pip-audit", "Pipeline seguro", "Resposta a incidentes"] },
    ],
    projects: ["Cofre de senhas criptografado", "Serviço de auth seguro", "Auditoria de vulnerabilidades", "Pipeline DevSecOps"],
    roles: ["Security Engineer", "AppSec Engineer", "DevSecOps"],
    salary: "R$ 9.000 – R$ 28.000",
  },
  {
    id: "iot-embarcados",
    title: "Engenheiro de IoT",
    tagline: "Conecte o mundo físico com Python",
    description:
      "Desenvolva soluções IoT: microcontroladores, sensores, MQTT, gateways e integração com a nuvem usando MicroPython e Python.",
    icon: Cpu,
    level: "Avançado",
    duration: "~85h",
    accent: "from-green/20 to-green/5 text-green",
    skills: ["MicroPython", "Sensores", "MQTT", "Edge", "Séries temporais"],
    technologies: ["MicroPython", "paho-mqtt", "Raspberry Pi", "InfluxDB", "FastAPI"],
    phases: [
      { title: "Hardware e Python", topics: ["MicroPython/CircuitPython", "GPIO, PWM, ADC", "I2C/SPI", "Consumo de energia"] },
      { title: "Sensores e protocolos", topics: ["Leitura de sensores", "MQTT", "HTTP/CoAP", "Edge computing"] },
      { title: "Gateways e nuvem", topics: ["Coleta e agregação", "Persistência (InfluxDB)", "APIs de ingestão", "Dashboards"] },
      { title: "Operação", topics: ["Segurança IoT", "OTA updates", "Confiabilidade", "Observabilidade"] },
    ],
    projects: ["Estação meteorológica IoT", "Gateway de sensores com MQTT", "Dashboard de telemetria", "Sistema de irrigação inteligente"],
    roles: ["IoT Developer", "Embedded Engineer", "Edge Engineer"],
    salary: "R$ 5.000 – R$ 18.000",
  },
  {
    id: "arquiteto-de-solucoes",
    title: "Arquiteto de Soluções",
    tagline: "Conecte negócio e tecnologia em soluções end-to-end",
    description:
      "Desenhe soluções completas que equilibram requisitos de negócio, custo, escala e operação — do backend à nuvem.",
    icon: Network,
    level: "Especialista",
    duration: "~115h",
    accent: "from-blue/20 to-blue/5 text-blue",
    skills: ["Visão de produto", "Trade-offs", "Cloud", "Integrações", "Custo e escala"],
    technologies: ["FastAPI", "PostgreSQL", "Kafka", "Redis", "Kubernetes", "AWS/GCP"],
    phases: [
      { title: "Requisitos e domínio", topics: ["Requisitos funcionais e não-funcionais", "Modelagem de domínio", "Restrições e trade-offs", "ADRs"] },
      { title: "Arquitetura de solução", topics: ["Componentes e integrações", "APIs e contratos", "Mensageria e eventos", "Dados e cache"] },
      { title: "Cloud e escala", topics: ["Serverless vs containers", "Escalabilidade e HA", "Custo (FinOps)", "IaC"] },
      { title: "Operação e governança", topics: ["Observabilidade", "Segurança", "Resiliência", "Padrões para times"] },
    ],
    projects: ["Desenho de solução cloud", "Plataforma multi-serviço", "Integração entre sistemas", "Blueprint de arquitetura"],
    roles: ["Solutions Architect", "Cloud Architect", "Tech Lead"],
    salary: "R$ 14.000 – R$ 38.000",
  },
];
