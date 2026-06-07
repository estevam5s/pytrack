import {
  Sprout,
  Code2,
  Server,
  BarChart3,
  Bot,
  Database,
  BrainCircuit,
  ServerCog,
  Boxes,
  Cpu,
  Shield,
  Blocks,
  Dna,
  CandlestickChart,
  Monitor,
  Crown,
  type LucideIcon,
} from "lucide-react";
import type { Tier } from "@/lib/billing-access";
import { FREE_MODULE_SLUG, TIER_RANK } from "@/lib/billing-access";

export interface Trilha {
  id: string;
  title: string;
  subtitle: string;
  goal: string; // "Quero ..."
  icon: LucideIcon;
  tier: Tier;
  areas: string[]; // ["*"] = todas
  moduleSlugs?: string[]; // mapeamento preciso (sobrepõe areas)
  level: "basico" | "intermediario" | "avancado";
  accent: string;
  topics: string[]; // currículo (chips)
  adModules: number; // escopo divulgado
  adLessons: number;
  adHours: number;
}

export const TRILHAS: Trilha[] = [
  // ───────────── GRÁTIS ─────────────
  {
    id: "primeiros-passos",
    title: "Primeiros Passos",
    subtitle: "Comece do absoluto zero",
    goal: "Estou começando agora em Python",
    icon: Sprout,
    tier: "free",
    areas: ["Fundamentos"],
    level: "basico",
    accent: "from-green/20 to-green/5 text-green",
    topics: [
      "Introdução ao Python 3.14+",
      "Instalação e ambiente",
      "VS Code + Cursor + Windsurf",
      "Sintaxe fundamental",
      "Variáveis e tipos",
      "Condicionais",
      "Loops",
      "Funções",
      "Módulos",
      "PEP8",
      "Git e GitHub",
    ],
    adModules: 2,
    adLessons: 25,
    adHours: 20,
  },

  // ───────────── ESSENCIAL ─────────────
  {
    id: "python-developer",
    title: "Python Developer",
    subtitle: "Domínio completo da linguagem",
    goal: "Quero dominar Python de verdade",
    icon: Code2,
    tier: "essencial",
    areas: ["Algoritmos", "Engenharia de Software", "Qualidade", "Persistência", "Performance & Assincronia"],
    level: "intermediario",
    accent: "from-primary-light/20 to-primary/5 text-primary-light",
    topics: [
      "POO", "Dataclasses", "Type Hints", "Generics", "Protocols",
      "Design Patterns", "AsyncIO", "Context Managers", "Decorators avançados",
      "Metaclasses", "Testing com Pytest", "Packaging", "Publicação no PyPI",
    ],
    adModules: 15,
    adLessons: 120,
    adHours: 180,
  },
  {
    id: "backend",
    title: "Backend Developer",
    subtitle: "APIs modernas e sistemas escaláveis",
    goal: "Quero criar APIs e back-ends profissionais",
    icon: Server,
    tier: "essencial",
    areas: ["Backend", "Banco de Dados", "Redes"],
    level: "avancado",
    accent: "from-blue/20 to-blue/5 text-blue",
    topics: [
      "FastAPI", "Django", "Django Ninja", "SQLAlchemy", "Alembic",
      "PostgreSQL", "Redis", "JWT", "OAuth2", "WebSockets", "RabbitMQ",
      "Celery", "Microservices", "API Gateway", "Event Driven Architecture",
    ],
    adModules: 20,
    adLessons: 160,
    adHours: 250,
  },
  {
    id: "data-analytics",
    title: "Data Analytics",
    subtitle: "Dados para negócios",
    goal: "Quero analisar e visualizar dados",
    icon: BarChart3,
    tier: "essencial",
    areas: ["Data Science", "Matemática"],
    level: "intermediario",
    accent: "from-blue/20 to-blue/5 text-blue",
    topics: [
      "Pandas", "NumPy", "Polars", "Matplotlib", "Plotly", "Seaborn",
      "DuckDB", "Excel Automation", "Dashboarding", "BI com Python",
    ],
    adModules: 10,
    adLessons: 80,
    adHours: 120,
  },
  {
    id: "automacao",
    title: "Automação & Produtividade",
    subtitle: "Automatize qualquer processo",
    goal: "Quero automatizar tarefas e processos",
    icon: Bot,
    tier: "essencial",
    areas: ["Automação"],
    level: "intermediario",
    accent: "from-green/20 to-green/5 text-green",
    topics: [
      "Selenium", "Playwright", "PyAutoGUI", "OCR", "PDF Processing",
      "Scraping", "APIs", "Bots", "RPA", "Automação Empresarial",
    ],
    adModules: 12,
    adLessons: 90,
    adHours: 130,
  },
  {
    id: "desktop-apps",
    title: "Desktop Apps",
    subtitle: "Aplicações profissionais",
    goal: "Quero criar apps desktop e jogos",
    icon: Monitor,
    tier: "essencial",
    areas: ["Desktop", "Jogos"],
    level: "intermediario",
    accent: "from-magenta/20 to-magenta/5 text-magenta",
    topics: [
      "PySide6", "Qt Designer", "Flet", "Tkinter Moderno",
      "Tauri + Python", "Desktop Packaging",
    ],
    adModules: 8,
    adLessons: 60,
    adHours: 90,
  },

  // ───────────── COMPLETO ─────────────
  {
    id: "engenharia-dados",
    title: "Engenharia de Dados",
    subtitle: "Dados em escala",
    goal: "Quero construir pipelines de dados",
    icon: Database,
    tier: "completo",
    areas: ["Engenharia de Dados"],
    level: "avancado",
    accent: "from-magenta/20 to-magenta/5 text-magenta",
    topics: [
      "Apache Airflow", "Kafka", "Spark", "PySpark", "Delta Lake",
      "Data Warehouse", "ETL", "ELT", "Data Lake", "Lakehouse",
    ],
    adModules: 15,
    adLessons: 130,
    adHours: 200,
  },
  {
    id: "machine-learning",
    title: "Machine Learning & IA",
    subtitle: "IA moderna com Python",
    goal: "Quero trabalhar com IA e machine learning",
    icon: BrainCircuit,
    tier: "completo",
    areas: ["Machine Learning"],
    level: "avancado",
    accent: "from-green/20 to-green/5 text-green",
    topics: [
      "Scikit-Learn", "TensorFlow", "PyTorch", "HuggingFace", "LangChain",
      "LlamaIndex", "RAG", "Fine-Tuning", "Agentes IA", "Multi-Agent Systems",
    ],
    adModules: 18,
    adLessons: 150,
    adHours: 220,
  },
  {
    id: "devops-cloud",
    title: "DevOps & Cloud",
    subtitle: "Infraestrutura para Python",
    goal: "Quero deploy, infra e nuvem",
    icon: ServerCog,
    tier: "completo",
    areas: ["DevOps", "Performance & Assincronia"],
    level: "avancado",
    accent: "from-blue/20 to-blue/5 text-blue",
    topics: [
      "Docker", "Docker Compose", "Kubernetes", "Terraform", "GitHub Actions",
      "CI/CD", "AWS", "GCP", "Azure", "Observabilidade",
    ],
    adModules: 12,
    adLessons: 100,
    adHours: 150,
  },
  {
    id: "arquitetura",
    title: "Arquitetura de Software",
    subtitle: "Sistemas de alta escala",
    goal: "Quero projetar sistemas robustos",
    icon: Boxes,
    tier: "completo",
    areas: ["Arquitetura", "Engenharia de Software"],
    level: "avancado",
    accent: "from-primary-light/20 to-primary/5 text-primary-light",
    topics: [
      "Clean Architecture", "DDD", "Hexagonal Architecture", "CQRS",
      "Event Sourcing", "SOLID", "Design Patterns Avançados", "Arquiteturas Distribuídas",
    ],
    adModules: 10,
    adLessons: 90,
    adHours: 140,
  },
  {
    id: "iot",
    title: "IoT & Embarcados",
    subtitle: "Python no mundo físico",
    goal: "Quero programar dispositivos e IoT",
    icon: Cpu,
    tier: "completo",
    areas: ["IoT"],
    level: "avancado",
    accent: "from-green/20 to-green/5 text-green",
    topics: [
      "Raspberry Pi", "MicroPython", "ESP32", "Sensores", "MQTT", "Edge Computing",
    ],
    adModules: 8,
    adLessons: 60,
    adHours: 90,
  },
  {
    id: "cyber-security",
    title: "Cyber Security com Python",
    subtitle: "Segurança ofensiva e defensiva",
    goal: "Quero atuar com segurança",
    icon: Shield,
    tier: "completo",
    areas: ["Segurança"],
    level: "avancado",
    accent: "from-magenta/20 to-magenta/5 text-magenta",
    topics: [
      "Pentest Automation", "Network Analysis", "Packet Inspection",
      "Ethical Hacking", "Malware Analysis", "Security Tools",
    ],
    adModules: 10,
    adLessons: 85,
    adHours: 120,
  },
  {
    id: "blockchain",
    title: "Blockchain com Python",
    subtitle: "Web3 e contratos inteligentes",
    goal: "Quero trabalhar com Web3",
    icon: Blocks,
    tier: "completo",
    areas: [],
    moduleSlugs: ["ext-blockchain-e-web3"],
    level: "avancado",
    accent: "from-blue/20 to-blue/5 text-blue",
    topics: [
      "Web3.py", "Ethereum", "Solidity Integration", "Smart Contracts", "DeFi", "NFTs",
    ],
    adModules: 8,
    adLessons: 70,
    adHours: 100,
  },
  {
    id: "bioinformatica",
    title: "Bioinformática",
    subtitle: "Ciência aplicada",
    goal: "Quero usar Python na biologia",
    icon: Dna,
    tier: "completo",
    areas: [],
    moduleSlugs: ["parte-10-bioinformatica"],
    level: "avancado",
    accent: "from-green/20 to-green/5 text-green",
    topics: [
      "Biopython", "Genômica", "DNA Analysis", "Machine Learning para Biologia",
    ],
    adModules: 6,
    adLessons: 50,
    adHours: 80,
  },
  {
    id: "quant-financas",
    title: "Quant & Finanças",
    subtitle: "Mercado financeiro",
    goal: "Quero atuar no mercado financeiro",
    icon: CandlestickChart,
    tier: "completo",
    areas: [],
    moduleSlugs: ["parte-6-financas", "parte-6-financas-quantitativas"],
    level: "avancado",
    accent: "from-magenta/20 to-magenta/5 text-magenta",
    topics: [
      "Quantitative Finance", "Backtesting", "Trading Bots",
      "Risk Analysis", "Portfolio Optimization",
    ],
    adModules: 10,
    adLessons: 90,
    adHours: 130,
  },

  // ───────────── SUPREMA ─────────────
  {
    id: "suprema",
    title: "Python Mastery — Trilha Suprema",
    subtitle: "Todos os módulos + projeto final SaaS",
    goal: "Quero dominar o ecossistema inteiro",
    icon: Crown,
    tier: "suprema",
    areas: ["*"],
    level: "avancado",
    accent: "from-primary/25 to-magenta/10 text-primary-light",
    topics: [
      "Backend", "Data Analytics", "Engenharia de Dados", "Machine Learning",
      "IA Generativa", "DevOps", "Cloud", "Arquitetura", "Desktop", "IoT",
      "Segurança", "Blockchain", "Finanças Quant", "Bioinformática",
      "Projeto Final: SaaS com FastAPI, Postgres, Redis, Docker, K8s, CI/CD, RAG, Agentes IA e deploy AWS",
    ],
    adModules: 120,
    adLessons: 1000,
    adHours: 2000,
  },
];

export function getTrilha(id: string): Trilha | undefined {
  return TRILHAS.find((t) => t.id === id);
}

/** Áreas cujo conteúdo é exclusivo do plano Completo (ou superior). */
export const COMPLETO_AREAS = [
  "Machine Learning",
  "Engenharia de Dados",
  "IoT",
  "Arquitetura",
  "Especializações",
  "Segurança",
];

/** Tier necessário para acessar um módulo de conteúdo. */
export function moduleTier(area: string, slug: string): Tier {
  if (slug === FREE_MODULE_SLUG) return "free";
  if (COMPLETO_AREAS.includes(area)) return "completo";
  return "essencial";
}

export function canAccess(userTier: Tier, required: Tier): boolean {
  return TIER_RANK[userTier] >= TIER_RANK[required];
}

/** Um módulo pertence à trilha? (por slug explícito ou por área; "*" = todas) */
export function moduleInTrilha(trilha: Trilha, area: string, slug: string): boolean {
  if (trilha.moduleSlugs && trilha.moduleSlugs.length) {
    return trilha.moduleSlugs.includes(slug);
  }
  return trilha.areas.includes("*") || trilha.areas.includes(area);
}
