import {
  Boxes,
  BrainCircuit,
  Cpu,
  Database,
  GitBranch,
  LayoutDashboard,
  LineChart,
  Server,
  Bot,
  Code2,
  BookOpen,
  GraduationCap,
  FileText,
  Library,
  Trophy,
  FolderGit2,
  Briefcase,
  Layers,
  Workflow,
  Terminal,
  Globe,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export interface Track {
  icon: LucideIcon;
  title: string;
  description: string;
  level: string;
  duration: string;
  accent: string;
}

export const TRACKS: Track[] = [
  { icon: Code2, title: "Fundamentos de Python", description: "Sintaxe, tipos, estruturas, funções, POO e boas práticas para uma base sólida.", level: "Iniciante", duration: "~40h", accent: "from-green/20 to-green/5 text-green" },
  { icon: Server, title: "Python para Backend", description: "APIs com FastAPI e Django, autenticação, banco de dados, testes e deploy.", level: "Intermediário", duration: "~60h", accent: "from-blue/20 to-blue/5 text-blue" },
  { icon: LineChart, title: "Python para Análise de Dados", description: "Pandas, NumPy, visualização e estatística para transformar dados em decisões.", level: "Intermediário", duration: "~50h", accent: "from-primary-light/20 to-primary/5 text-primary-light" },
  { icon: Database, title: "Python para Engenharia de Dados", description: "ETL, Polars, DuckDB, Spark, Airflow e pipelines de dados em escala.", level: "Avançado", duration: "~70h", accent: "from-magenta/20 to-magenta/5 text-magenta" },
  { icon: Cpu, title: "Python para IoT", description: "MicroPython, sensores, MQTT e integração de dispositivos com a nuvem.", level: "Avançado", duration: "~45h", accent: "from-green/20 to-green/5 text-green" },
  { icon: Bot, title: "Python para Automação", description: "Scripts, web scraping, bots, RPA e automação de tarefas do dia a dia.", level: "Intermediário", duration: "~35h", accent: "from-blue/20 to-blue/5 text-blue" },
  { icon: Boxes, title: "Engenharia de Software", description: "SOLID, design patterns, arquitetura limpa, testes, qualidade e DevOps.", level: "Avançado", duration: "~65h", accent: "from-primary-light/20 to-primary/5 text-primary-light" },
  { icon: FolderGit2, title: "Projetos Profissionais", description: "Construa um portfólio real com projetos full-stack ponta a ponta.", level: "Todos os níveis", duration: "~80h", accent: "from-magenta/20 to-magenta/5 text-magenta" },
];

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const FEATURES: Feature[] = [
  { icon: BookOpen, title: "Conteúdos organizados", description: "74 módulos e centenas de lições do básico ao avançado, em trilhas guiadas." },
  { icon: LineChart, title: "Evolução visual", description: "Dashboard com progresso, XP, gráficos e seu nível no ecossistema Python." },
  { icon: Layers, title: "Stack Python completa", description: "Conheça as tecnologias essenciais com logos reais e links da documentação." },
  { icon: GraduationCap, title: "Aulas da Udemy e YouTube", description: "Organize cursos e playlists com importação automática de banner e dados." },
  { icon: FileText, title: "Materiais extras", description: "Documentação, artigos, cheatsheets e repositórios centralizados." },
  { icon: Library, title: "Livros recomendados", description: "Biblioteca curada com upload de capa e do próprio arquivo do livro." },
  { icon: Trophy, title: "Exercícios com IA", description: "Mais de 2400 exercícios. Escreva o código e a IA dá feedback e a melhor solução." },
  { icon: FolderGit2, title: "Projetos para portfólio", description: "Mais de 1300 projetos com requisitos, tecnologias e passo a passo." },
  { icon: Briefcase, title: "Roadmap de carreira", description: "Trilhas profissionais e um consultor de IA que avalia sua prontidão." },
  { icon: ShieldCheck, title: "Persistência com Supabase", description: "Seu progresso salvo com segurança, autenticação e dados sempre sincronizados." },
];

export interface Project {
  title: string;
  difficulty: string;
  technologies: string[];
  result: string;
}

export const PROJECTS: Project[] = [
  { title: "Calculadora CLI", difficulty: "Básico", technologies: ["Python", "Typer"], result: "Uma ferramenta de terminal com histórico e validação." },
  { title: "Sistema de tarefas", difficulty: "Básico", technologies: ["Python", "SQLite"], result: "CRUD com prioridades e persistência local." },
  { title: "Web scraper", difficulty: "Intermediário", technologies: ["httpx", "BeautifulSoup"], result: "Coletor de dados com exportação para CSV." },
  { title: "API REST com FastAPI", difficulty: "Intermediário", technologies: ["FastAPI", "PostgreSQL"], result: "API completa com autenticação JWT e testes." },
  { title: "Dashboard de dados", difficulty: "Intermediário", technologies: ["Streamlit", "Plotly"], result: "Visualização interativa de um dataset real." },
  { title: "Bot de automação", difficulty: "Intermediário", technologies: ["python-telegram-bot"], result: "Bot que executa tarefas e responde comandos." },
  { title: "Sistema IoT com MQTT", difficulty: "Avançado", technologies: ["MicroPython", "MQTT"], result: "Sensores publicando dados em tempo real." },
  { title: "Pipeline ETL", difficulty: "Avançado", technologies: ["Polars", "DuckDB"], result: "Ingestão, transformação e carga de dados." },
  { title: "Projeto final full-stack", difficulty: "Desafio", technologies: ["FastAPI", "Docker", "CI/CD"], result: "Aplicação completa com deploy e observabilidade." },
];

export interface Career {
  icon: LucideIcon;
  title: string;
  skills: string[];
  technologies: string[];
  path: string;
}

export const CAREERS: Career[] = [
  { icon: Code2, title: "Python Developer", skills: ["Python moderno", "POO", "Git", "Testes"], technologies: ["Python", "Flask", "Pytest"], path: "Fundamentos → POO → APIs → Projetos" },
  { icon: Server, title: "Backend Developer", skills: ["APIs", "Auth", "Banco de dados", "Docker"], technologies: ["FastAPI", "PostgreSQL", "Redis"], path: "Frameworks → ORM → Segurança → Deploy" },
  { icon: LineChart, title: "Data Analyst", skills: ["Pandas", "SQL", "Visualização"], technologies: ["Pandas", "Matplotlib", "DuckDB"], path: "Python → Pandas → SQL → Dashboards" },
  { icon: Database, title: "Data Engineer", skills: ["ETL", "Spark", "Orquestração"], technologies: ["PySpark", "Airflow", "Parquet"], path: "Dados → ETL → Big Data → Lakehouse" },
  { icon: Cpu, title: "IoT Developer", skills: ["MicroPython", "MQTT", "Redes"], technologies: ["paho-mqtt", "Raspberry Pi"], path: "Hardware → Sensores → MQTT → Nuvem" },
  { icon: Bot, title: "Automation Developer", skills: ["Scraping", "Bots", "CLIs"], technologies: ["Playwright", "Typer"], path: "Scripts → Scraping → Bots → Deploy" },
  { icon: Boxes, title: "Software Engineer", skills: ["Design patterns", "SOLID", "CI/CD"], technologies: ["Docker", "Kubernetes", "Pytest"], path: "POO → Arquitetura → Testes → DevOps" },
];

export interface Step {
  number: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

export const STEPS: Step[] = [
  { number: "01", icon: GraduationCap, title: "Crie sua conta", description: "Cadastro rápido e gratuito para acessar todo o ecossistema de aprendizado." },
  { number: "02", icon: Workflow, title: "Escolha sua trilha", description: "Selecione o caminho ideal: fundamentos, backend, dados, IoT e mais." },
  { number: "03", icon: Terminal, title: "Estude na prática", description: "Conteúdos, exercícios com IA e projetos reais para fixar de verdade." },
  { number: "04", icon: LayoutDashboard, title: "Acompanhe a evolução", description: "Veja seu progresso, XP e nível crescerem no dashboard inteligente." },
];

export const DASHBOARD_FEATURES = [
  "Progresso geral e nível em Python",
  "Conteúdos em andamento",
  "Próximos estudos recomendados",
  "Stack de tecnologias",
  "Aulas da Udemy e YouTube",
  "Materiais complementares",
  "Livros recomendados",
  "Exercícios práticos com IA",
  "Projetos reais para portfólio",
  "Área de carreira e consultor de IA",
  "Configurações personalizadas",
];

export interface Testimonial {
  name: string;
  role: string;
  text: string;
  initials: string;
  color: string;
}

export const TESTIMONIALS: Testimonial[] = [
  { name: "Marina Costa", role: "Aspirante a Data Analyst", text: "Finalmente parei de me perder em vídeos soltos. As trilhas me deram direção e o dashboard mostra minha evolução de verdade.", initials: "MC", color: "from-green to-blue" },
  { name: "Rafael Lima", role: "Estudando Backend", text: "Os exercícios com feedback de IA são surreais. Recebo a correção e uma solução melhor na hora — aprendi muito mais rápido.", initials: "RL", color: "from-primary to-magenta" },
  { name: "Beatriz Souza", role: "Transição para IoT", text: "Consegui montar um portfólio com os projetos reais da plataforma. O roadmap de carreira me deu clareza sobre os próximos passos.", initials: "BS", color: "from-blue to-primary-light" },
];

export const PRICING_FEATURES = [
  "Acesso completo ao dashboard",
  "Todas as trilhas do ecossistema Python",
  "Mais de 2400 exercícios com IA",
  "Mais de 1300 projetos práticos",
  "Materiais, livros e cursos organizados",
  "Área de carreira e consultor de IA",
  "Evolução personalizada com XP e níveis",
  "Atualizações contínuas de conteúdo",
];

export const FAQS = [
  { q: "Para quem é a plataforma?", a: "Para quem quer aprender ou se aprofundar em Python — do iniciante absoluto a quem busca especialização em backend, dados, IoT, automação ou engenharia de software." },
  { q: "Preciso saber programar?", a: "Não. A trilha de Fundamentos começa do zero, com sintaxe, lógica e os primeiros programas, evoluindo de forma guiada até temas avançados." },
  { q: "A plataforma ensina Python do zero?", a: "Sim. Você começa pelos fundamentos e avança no seu ritmo por trilhas estruturadas, com exercícios e projetos a cada etapa." },
  { q: "Tem projetos práticos?", a: "Mais de 1300 projetos, de calculadoras CLI a APIs, pipelines de dados e sistemas full-stack — com requisitos e passo a passo para o seu portfólio." },
  { q: "Posso acompanhar minha evolução?", a: "Sim. O dashboard mostra progresso, horas estudadas, XP e seu nível no ecossistema Python, com gráficos e mapa de proficiência." },
  { q: "O conteúdo serve para dados, backend e IoT?", a: "Sim. Há trilhas dedicadas para análise e engenharia de dados, backend, IoT, automação e engenharia de software." },
  { q: "Preciso pagar cursos externos?", a: "Não. Tudo o que você precisa está centralizado: conteúdos, exercícios, projetos, materiais e livros. Você ainda pode organizar cursos da Udemy e YouTube que já tenha." },
  { q: "Como funciona o dashboard?", a: "Após o login, você acessa um painel com suas trilhas, progresso, recomendações, stack, materiais, exercícios, projetos e área de carreira — tudo em um só lugar." },
];
