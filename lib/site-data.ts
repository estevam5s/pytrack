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
  { icon: BookOpen, title: "Conteúdos organizados", description: "Dezenas de módulos e centenas de lições do básico ao avançado, em trilhas guiadas." },
  { icon: LineChart, title: "Evolução visual", description: "Dashboard com progresso, XP, gráficos e seu nível no ecossistema Python." },
  { icon: Layers, title: "Stack Python completa", description: "Conheça as tecnologias essenciais com logos reais e links da documentação." },
  { icon: GraduationCap, title: "Aulas da Udemy e YouTube", description: "Organize cursos e playlists com importação automática de banner e dados." },
  { icon: FileText, title: "Materiais extras", description: "Documentação, artigos, cheatsheets e repositórios centralizados." },
  { icon: Library, title: "Livros recomendados", description: "Biblioteca curada com upload de capa e do próprio arquivo do livro." },
  { icon: Trophy, title: "Exercícios com IA", description: "Milhares de exercícios. Escreva o código e a IA dá feedback e a melhor solução." },
  { icon: FolderGit2, title: "Projetos para portfólio", description: "Milhares de projetos com requisitos, tecnologias e passo a passo." },
  { icon: Briefcase, title: "Roadmap de carreira", description: "Trilhas profissionais e um consultor de IA que avalia sua prontidão." },
  { icon: ShieldCheck, title: "Persistência com Supabase", description: "Seu progresso salvo com segurança, autenticação e dados sempre sincronizados." },
];

export interface Project {
  id: string;
  title: string;
  difficulty: string;
  technologies: string[];
  result: string;
  time?: string;
  overview?: string;
  features?: string[];
  steps?: string[];
  learnings?: string[];
}

export const PROJECTS: Project[] = [
  // ── Iniciante ──
  { id: "calculadora-cli", title: "Calculadora de terminal (CLI)", difficulty: "Iniciante", technologies: ["Python", "argparse"], result: "Uma calculadora de linha de comando com histórico e validação de entrada.", time: "2–4h",
    overview: "Seu primeiro programa útil: uma calculadora que recebe operações pelo terminal, valida a entrada e guarda o histórico. Ideal para fixar tipos, funções e tratamento de erros.",
    features: ["Soma, subtração, multiplicação e divisão", "Validação de entrada (sem dividir por zero)", "Histórico das últimas operações", "Modo interativo no terminal"],
    steps: ["Crie a estrutura do projeto e um arquivo main.py", "Implemente funções puras para cada operação", "Leia a entrada do usuário com input() e valide", "Trate erros com try/except (ValueError, ZeroDivisionError)", "Guarde o histórico em uma lista e mostre ao sair", "(Bônus) Aceite argumentos via argparse"],
    learnings: ["Funções e tipos", "Tratamento de erros", "Entrada/saída no terminal"] },
  { id: "lista-tarefas", title: "Lista de tarefas com persistência", difficulty: "Iniciante", technologies: ["Python", "JSON"], result: "Um app de terminal que salva tarefas em arquivo e sobrevive entre execuções.", time: "3–5h",
    overview: "Um gerenciador de tarefas (to-do) que adiciona, lista, conclui e remove tarefas, salvando tudo em um arquivo JSON. Você aprende persistência sem banco de dados.",
    features: ["Adicionar, listar, concluir e remover tarefas", "Prioridade e data de criação", "Persistência em arquivo JSON", "Filtro por status (pendente/concluída)"],
    steps: ["Modele a tarefa como um dicionário", "Implemente funções CRUD em memória", "Salve e carregue de um arquivo JSON", "Crie um menu interativo no terminal", "Adicione filtros e ordenação", "(Bônus) Exporte para CSV"],
    learnings: ["Estruturas de dados", "Leitura/escrita de arquivos", "Serialização JSON"] },
  { id: "gerador-senhas", title: "Gerador e cofre de senhas", difficulty: "Iniciante", technologies: ["Python", "secrets", "cryptography"], result: "Gerador de senhas fortes com um cofre criptografado local.", time: "4–6h",
    overview: "Gere senhas seguras e guarde-as em um cofre criptografado. Introdução prática à segurança e criptografia em Python.",
    features: ["Geração de senhas com regras configuráveis", "Avaliação de força da senha", "Cofre criptografado (Fernet)", "Busca e cópia para a área de transferência"],
    steps: ["Use secrets para gerar senhas aleatórias", "Permita configurar tamanho e tipos de caracteres", "Criptografe o cofre com cryptography (Fernet)", "Implemente uma senha-mestra", "Adicione busca por serviço", "(Bônus) Interface com Typer"],
    learnings: ["Aleatoriedade segura", "Criptografia simétrica", "Boas práticas de segurança"] },
  { id: "weather-cli", title: "Consulta de clima via API", difficulty: "Iniciante", technologies: ["Python", "httpx", "API REST"], result: "App que consome uma API pública de clima e formata os dados no terminal.", time: "3–4h",
    overview: "Consuma uma API REST real (clima) e aprenda a fazer requisições HTTP, tratar respostas JSON e lidar com erros de rede.",
    features: ["Busca por cidade", "Temperatura, umidade e previsão", "Cache local para evitar chamadas repetidas", "Tratamento de erros de rede e cidade inválida"],
    steps: ["Escolha uma API de clima gratuita", "Faça a requisição com httpx", "Parseie o JSON e extraia os dados", "Trate timeouts e respostas de erro", "Adicione cache simples em arquivo", "(Bônus) Exiba um ícone do tempo"],
    learnings: ["Requisições HTTP", "Parsing de JSON", "Consumo de APIs"] },

  // ── Intermediário ──
  { id: "web-scraper", title: "Web scraper com exportação", difficulty: "Intermediário", technologies: ["httpx", "BeautifulSoup", "pandas"], result: "Coletor de dados de um site com limpeza e exportação para CSV/Excel.", time: "1–2 dias",
    overview: "Extraia dados estruturados de páginas web, limpe e exporte. Um clássico de automação que aparece muito no mercado.",
    features: ["Coleta de múltiplas páginas (paginação)", "Limpeza e normalização dos dados", "Exportação para CSV e Excel", "Respeito a robots.txt e rate limiting"],
    steps: ["Inspecione o HTML do site-alvo", "Baixe as páginas com httpx", "Extraia os campos com BeautifulSoup", "Trate paginação e dados ausentes", "Limpe com pandas e exporte", "(Bônus) Agende com cron"],
    learnings: ["Web scraping ético", "Manipulação de HTML", "Pandas para limpeza"] },
  { id: "api-rest-fastapi", title: "API REST com autenticação", difficulty: "Intermediário", technologies: ["FastAPI", "PostgreSQL", "SQLAlchemy", "JWT"], result: "API completa de tarefas com autenticação JWT, banco e testes.", time: "3–5 dias",
    overview: "Construa uma API profissional: rotas CRUD, autenticação por token, banco relacional com ORM e testes automatizados. A base de qualquer backend.",
    features: ["CRUD com validação (Pydantic)", "Registro/login com JWT", "ORM com SQLAlchemy + migrations (Alembic)", "Documentação automática (Swagger)", "Testes com pytest"],
    steps: ["Modele as entidades com SQLAlchemy", "Crie schemas Pydantic de entrada/saída", "Implemente as rotas CRUD", "Adicione registro/login e proteção por JWT", "Escreva testes com pytest", "Faça deploy (Docker + Postgres)"],
    learnings: ["Arquitetura de APIs", "Autenticação JWT", "ORM e testes"] },
  { id: "dashboard-streamlit", title: "Dashboard de dados interativo", difficulty: "Intermediário", technologies: ["Streamlit", "pandas", "Plotly"], result: "Dashboard web que carrega um dataset real e gera visualizações interativas.", time: "2–3 dias",
    overview: "Transforme dados em um painel interativo sem escrever frontend. Ótimo para portfólio de dados.",
    features: ["Upload de CSV/Excel", "Filtros interativos", "Gráficos dinâmicos com Plotly", "KPIs e tabela com busca", "Deploy gratuito"],
    steps: ["Carregue e limpe o dataset com pandas", "Monte o layout com Streamlit", "Crie filtros (selectbox, slider)", "Adicione gráficos Plotly reativos", "Calcule KPIs", "Faça deploy no Streamlit Cloud"],
    learnings: ["Análise de dados", "Visualização", "Apps de dados"] },
  { id: "bot-telegram", title: "Bot do Telegram com lembretes", difficulty: "Intermediário", technologies: ["python-telegram-bot", "APScheduler", "SQLite"], result: "Bot que responde comandos e envia lembretes agendados.", time: "2–4 dias",
    overview: "Um bot real que recebe comandos, guarda dados e dispara mensagens agendadas. Ótima introdução a automação e eventos.",
    features: ["Comandos personalizados", "Lembretes agendados por usuário", "Persistência em SQLite", "Mensagens com botões inline"],
    steps: ["Crie o bot no BotFather", "Implemente os handlers de comando", "Guarde lembretes no SQLite", "Agende envios com APScheduler", "Adicione botões interativos", "Faça deploy (Railway/Fly.io)"],
    learnings: ["Bots e webhooks", "Agendamento", "Persistência"] },
  { id: "etl-pipeline", title: "Pipeline ETL automatizado", difficulty: "Intermediário", technologies: ["Polars", "DuckDB", "Prefect"], result: "Pipeline que extrai, transforma e carrega dados de forma agendada.", time: "3–5 dias",
    overview: "Um ETL de verdade: extrai de uma fonte, transforma com Polars, carrega num DuckDB e orquestra com agendamento. Base da engenharia de dados.",
    features: ["Extração de múltiplas fontes", "Transformações com Polars (rápido)", "Carga em DuckDB/Parquet", "Orquestração e retries", "Logs e validação de qualidade"],
    steps: ["Defina as fontes e o schema final", "Extraia os dados brutos", "Transforme e valide com Polars", "Carregue em DuckDB/Parquet", "Orquestre com Prefect", "Adicione alertas de falha"],
    learnings: ["ETL/ELT", "Orquestração", "Qualidade de dados"] },
  { id: "jogo-pygame", title: "Jogo 2D com Pygame", difficulty: "Intermediário", technologies: ["Pygame", "OOP"], result: "Um jogo arcade completo com física simples, pontuação e sons.", time: "3–6 dias",
    overview: "Construa um jogo do zero: loop de jogo, colisões, sprites, pontuação e sons. Diversão enquanto pratica POO.",
    features: ["Loop de jogo e física básica", "Colisões e inimigos", "Sistema de pontuação e vidas", "Sons e menu", "Aumento de dificuldade"],
    steps: ["Configure a janela e o game loop", "Crie a classe do jogador (sprite)", "Implemente movimento e colisões", "Adicione inimigos e pontuação", "Inclua sons e menu", "Empacote como executável"],
    learnings: ["POO aplicada", "Game loop", "Estado e eventos"] },
  { id: "automacao-relatorios", title: "Automação de relatórios + e-mail", difficulty: "Intermediário", technologies: ["pandas", "openpyxl", "smtplib"], result: "Robô que gera relatórios em Excel/PDF e envia por e-mail automaticamente.", time: "2–3 dias",
    overview: "Automatize uma tarefa empresarial real: ler dados, gerar um relatório formatado e enviar por e-mail — sozinho, no horário certo.",
    features: ["Leitura de planilhas e bancos", "Geração de Excel formatado", "Geração de PDF", "Envio por e-mail (anexos)", "Agendamento"],
    steps: ["Leia os dados de origem com pandas", "Gere a planilha com openpyxl", "Crie um PDF com reportlab", "Envie por e-mail com smtplib", "Agende a execução", "(Bônus) Dashboard de status"],
    learnings: ["Automação de processos", "Geração de documentos", "E-mail programático"] },

  // ── Avançado ──
  { id: "sistema-recomendacao", title: "Sistema de recomendação", difficulty: "Avançado", technologies: ["scikit-learn", "FastAPI", "Redis"], result: "Recomendações personalizadas servidas em produção com cache e A/B testing.", time: "1–2 semanas",
    overview: "Um recomendador estilo Netflix: filtragem colaborativa e baseada em conteúdo, servido por uma API com cache e teste A/B.",
    features: ["Filtragem colaborativa e por conteúdo", "API de recomendação em tempo real", "Cache com Redis", "A/B testing de estratégias", "Avaliação offline (precision@k)"],
    steps: ["Prepare o dataset de interações", "Treine modelos de recomendação", "Avalie com métricas de ranking", "Sirva via FastAPI", "Adicione cache Redis", "Implemente A/B testing"],
    learnings: ["Recommender systems", "Servir ML em produção", "Avaliação de modelos"] },
  { id: "visao-computacional", title: "Visão computacional em tempo real", difficulty: "Avançado", technologies: ["PyTorch", "OpenCV", "FastAPI"], result: "Detecção de objetos em vídeo com API de inferência de baixa latência.", time: "1–2 semanas",
    overview: "Detecte objetos em vídeo ao vivo e sirva a inferência por uma API rápida. IA aplicada de ponta a ponta.",
    features: ["Detecção de objetos (YOLO)", "Processamento de vídeo com OpenCV", "API de inferência", "Otimização para latência", "Anotação dos frames"],
    steps: ["Carregue um modelo pré-treinado", "Capture e processe frames com OpenCV", "Rode a detecção e anote os frames", "Otimize (batch, GPU, quantização)", "Sirva via FastAPI", "Faça deploy com Docker"],
    learnings: ["Deep learning aplicado", "Processamento de vídeo", "Inferência otimizada"] },
  { id: "assistente-rag", title: "Assistente de IA com RAG", difficulty: "Avançado", technologies: ["LangChain", "pgvector", "FastAPI"], result: "Chatbot que responde com base nos seus documentos, com citações e avaliação.", time: "1–2 semanas",
    overview: "Construa um assistente que responde perguntas usando seus próprios documentos (RAG), com busca vetorial e citação de fontes.",
    features: ["Ingestão e chunking de documentos", "Busca vetorial (pgvector)", "Geração com citações", "Avaliação de qualidade (RAGAS)", "Interface de chat"],
    steps: ["Faça o chunking e gere embeddings", "Armazene no pgvector", "Implemente o retriever", "Monte a cadeia RAG (LangChain)", "Adicione citações e avaliação", "Sirva via API + chat"],
    learnings: ["RAG e embeddings", "Busca vetorial", "IA generativa"] },
  { id: "saas-billing", title: "SaaS multi-tenant com billing", difficulty: "Desafio", technologies: ["FastAPI", "PostgreSQL", "Stripe", "Redis"], result: "Plataforma de assinaturas com multi-tenant, webhooks e métricas — pronta para produção.", time: "2–4 semanas",
    overview: "Um SaaS completo: cadastro, assinaturas com Stripe, isolamento por tenant, webhooks e painel de métricas. O projeto que prova senioridade.",
    features: ["Multi-tenancy (isolamento por organização)", "Assinaturas e billing com Stripe", "Webhooks com verificação", "Painel de métricas (MRR, churn)", "RBAC e segurança"],
    steps: ["Modele tenants e usuários", "Implemente auth + RBAC", "Integre o checkout da Stripe", "Trate webhooks com idempotência", "Construa o painel de métricas", "Deploy com CI/CD"],
    learnings: ["Arquitetura SaaS", "Billing recorrente", "Multi-tenancy"] },
  { id: "microsservicos", title: "Microsserviços event-driven", difficulty: "Desafio", technologies: ["FastAPI", "RabbitMQ", "Kubernetes"], result: "Serviços desacoplados por mensageria, com deploy em K8s e escala automática.", time: "2–4 semanas",
    overview: "Quebre um monólito em serviços que se comunicam por eventos, com filas, deploy em Kubernetes e escala automática.",
    features: ["Comunicação por mensageria (RabbitMQ)", "Serviços independentes", "Saga/coreografia de eventos", "Deploy em Kubernetes", "Observabilidade"],
    steps: ["Defina os bounded contexts", "Crie os serviços com FastAPI", "Conecte por filas (RabbitMQ)", "Implemente padrões de resiliência", "Containerize e deploy no K8s", "Adicione tracing distribuído"],
    learnings: ["Arquitetura distribuída", "Mensageria", "Kubernetes"] },
  { id: "pipeline-streaming", title: "Pipeline de dados em tempo real", difficulty: "Desafio", technologies: ["Kafka", "PySpark", "Airflow", "Delta Lake"], result: "Ingestão streaming, transformação distribuída e data lakehouse versionado.", time: "3–5 semanas",
    overview: "Engenharia de dados em escala: ingestão por streaming, processamento distribuído com Spark e um lakehouse versionado.",
    features: ["Ingestão em streaming (Kafka)", "Processamento com PySpark", "Lakehouse com Delta Lake", "Orquestração com Airflow", "Qualidade e governança"],
    steps: ["Configure o produtor/consumidor Kafka", "Processe streams com PySpark", "Escreva em Delta Lake (ACID)", "Orquestre batches com Airflow", "Adicione data quality", "Monitore o pipeline"],
    learnings: ["Streaming", "Spark distribuído", "Lakehouse"] },
  { id: "mlops", title: "MLOps: do treino ao deploy", difficulty: "Desafio", technologies: ["MLflow", "Docker", "FastAPI", "CI/CD"], result: "Pipeline de ML versionado, com registro de modelos, monitoramento e deploy contínuo.", time: "2–4 semanas",
    overview: "Leve modelos de ML do notebook à produção com versionamento, registro, deploy automático e monitoramento de drift.",
    features: ["Tracking de experimentos (MLflow)", "Registro e versão de modelos", "Deploy contínuo (CI/CD)", "Monitoramento de drift", "Rollback de modelos"],
    steps: ["Versione dados e experimentos", "Treine e registre o modelo", "Empacote a inferência (FastAPI + Docker)", "Automatize o deploy (CI/CD)", "Monitore performance e drift", "Implemente rollback"],
    learnings: ["MLOps", "Versionamento de modelos", "Monitoramento"] },
  { id: "trading-bot", title: "Bot de trading quantitativo", difficulty: "Desafio", technologies: ["pandas", "NumPy", "Backtesting"], result: "Estratégia com backtest, gestão de risco e execução automatizada.", time: "2–4 semanas",
    overview: "Desenvolva uma estratégia quantitativa, valide com backtest rigoroso, gerencie risco e automatize a execução.",
    features: ["Indicadores técnicos", "Backtest com dados históricos", "Gestão de risco e position sizing", "Métricas (Sharpe, drawdown)", "Execução automatizada (paper trading)"],
    steps: ["Colete dados históricos", "Defina a estratégia e os sinais", "Faça backtest com custos realistas", "Avalie risco e retorno", "Otimize parâmetros (sem overfit)", "Conecte a um broker em paper trading"],
    learnings: ["Finanças quantitativas", "Backtesting", "Gestão de risco"] },
  { id: "iot-inteligente", title: "Plataforma IoT inteligente", difficulty: "Avançado", technologies: ["MicroPython", "MQTT", "scikit-learn"], result: "Sensores + modelo de ML para automação e detecção de anomalias em tempo real.", time: "2–3 semanas",
    overview: "Conecte dispositivos físicos, colete dados de sensores e aplique ML para detectar anomalias e automatizar ações.",
    features: ["Firmware com MicroPython (ESP32)", "Comunicação via MQTT", "Coleta e armazenamento de telemetria", "Detecção de anomalias com ML", "Dashboard em tempo real"],
    steps: ["Programe o ESP32 com MicroPython", "Publique telemetria via MQTT", "Armazene as séries temporais", "Treine um modelo de anomalia", "Automatize ações", "Construa o dashboard"],
    learnings: ["IoT e embarcados", "MQTT", "ML em séries temporais"] },
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
  { name: "Lucas Andrade", role: "Dev Júnior", text: "A IDE no navegador foi um divisor de águas. Comecei a praticar no mesmo dia, sem perder tempo configurando ambiente.", initials: "LA", color: "from-primary-light to-secondary" },
  { name: "Camila Ferreira", role: "Migrando para Dados", text: "O plano de estudos com IA montou um cronograma realista pra minha rotina. Em 3 meses eu já tinha base sólida em Pandas.", initials: "CF", color: "from-magenta to-primary" },
  { name: "Thiago Mendes", role: "Estudando DevOps", text: "Os 'Bugs Reais' me prepararam pra entrevista melhor que qualquer curso. São cenários de verdade, do mercado.", initials: "TM", color: "from-blue to-green" },
  { name: "Júlia Rocha", role: "Futura ML Engineer", text: "A trilha de Machine Learning é densa e bem encadeada. Saí do zero ao primeiro modelo treinado com confiança.", initials: "JR", color: "from-secondary to-blue" },
  { name: "Pedro Henrique", role: "Freelancer Python", text: "A comunidade e o gerador de currículo me ajudaram a fechar meus primeiros clientes. Tudo conectado num lugar só.", initials: "PH", color: "from-primary to-blue" },
  { name: "Aline Martins", role: "Estudante de Automação", text: "Os desafios diários mantêm minha constância. Ver a sequência crescer me motiva a estudar todo dia.", initials: "AM", color: "from-green to-primary-light" },
];

export const PRICING_FEATURES = [
  "Acesso completo ao dashboard",
  "Todas as trilhas do ecossistema Python",
  "Milhares de exercícios com IA",
  "Milhares de projetos práticos",
  "Materiais, livros e cursos organizados",
  "Área de carreira e consultor de IA",
  "Evolução personalizada com XP e níveis",
  "Atualizações contínuas de conteúdo",
];

export const FAQS = [
  { q: "Para quem é a plataforma?", a: "Para quem quer aprender ou se aprofundar em Python — do iniciante absoluto a quem busca especialização em backend, dados, IoT, automação ou engenharia de software." },
  { q: "Preciso saber programar?", a: "Não. A trilha de Fundamentos começa do zero, com sintaxe, lógica e os primeiros programas, evoluindo de forma guiada até temas avançados." },
  { q: "A plataforma ensina Python do zero?", a: "Sim. Você começa pelos fundamentos e avança no seu ritmo por trilhas estruturadas, com exercícios e projetos a cada etapa." },
  { q: "Tem projetos práticos?", a: "Milhares de projetos, de calculadoras CLI a APIs, pipelines de dados e sistemas full-stack — com requisitos e passo a passo para o seu portfólio." },
  { q: "Posso acompanhar minha evolução?", a: "Sim. O dashboard mostra progresso, horas estudadas, XP e seu nível no ecossistema Python, com gráficos e mapa de proficiência." },
  { q: "O conteúdo serve para dados, backend e IoT?", a: "Sim. Há trilhas dedicadas para análise e engenharia de dados, backend, IoT, automação e engenharia de software." },
  { q: "Preciso pagar cursos externos?", a: "Não. Tudo o que você precisa está centralizado: conteúdos, exercícios, projetos, materiais e livros. Você ainda pode organizar cursos da Udemy e YouTube que já tenha." },
  { q: "Como funciona o dashboard?", a: "Após o login, você acessa um painel com suas trilhas, progresso, recomendações, stack, materiais, exercícios, projetos e área de carreira — tudo em um só lugar." },
];
