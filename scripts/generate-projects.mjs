/**
 * Gera 100+ projetos práticos para a rota /projetos.
 * Saída: supabase/projects_expansion.json (insert via REST, substitui tudo).
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";

// [titulo, descricao, dificuldade, area, [techs]]
const P = [
  // ---- Fundamentos & CLI ----
  ["Calculadora CLI", "Calculadora de linha de comando com histórico e operações encadeadas.", "basico", "Fundamentos", ["Python", "argparse"]],
  ["Gerenciador de tarefas (To-Do CLI)", "CRUD de tarefas com prioridades, status e persistência local.", "basico", "Fundamentos", ["Python", "SQLite", "Typer"]],
  ["Conversor de unidades", "Converte temperatura, moeda, distância e peso via CLI.", "basico", "Fundamentos", ["Python", "Rich"]],
  ["Gerador de senhas seguras", "Cria senhas fortes configuráveis e avalia a força.", "basico", "Fundamentos", ["Python", "secrets"]],
  ["Agenda de contatos", "Armazena contatos com busca, edição e exportação CSV.", "basico", "Fundamentos", ["Python", "JSON"]],
  ["Quiz de terminal", "Jogo de perguntas e respostas com pontuação e níveis.", "basico", "Fundamentos", ["Python", "Rich"]],
  ["Organizador de arquivos", "Organiza uma pasta por extensão e data automaticamente.", "basico", "Automação", ["Python", "pathlib", "shutil"]],
  ["Renomeador em lote", "Renomeia arquivos por padrões e metadados (EXIF de fotos).", "basico", "Automação", ["Python", "Pillow"]],
  ["Contador de palavras", "Analisa textos: frequência, leitura estimada e estatísticas.", "basico", "Fundamentos", ["Python", "collections"]],
  ["Cronômetro Pomodoro CLI", "Timer de foco/descanso com notificações e estatísticas.", "basico", "Fundamentos", ["Python", "Rich"]],

  // ---- Automação ----
  ["Web scraper de notícias", "Coleta manchetes, deduplica e exporta para CSV.", "intermediario", "Automação", ["httpx", "BeautifulSoup", "Pandas"]],
  ["Monitor de preços", "Acompanha preços de produtos e alerta em quedas.", "intermediario", "Automação", ["Playwright", "SQLite"]],
  ["Bot de download", "Baixa arquivos de uma lista com retry e barra de progresso.", "intermediario", "Automação", ["httpx", "Rich"]],
  ["Automação de planilhas", "Consolida vários Excel em relatórios formatados.", "intermediario", "Automação", ["openpyxl", "Pandas"]],
  ["Gerador de relatórios PDF", "Gera PDFs a partir de dados e templates.", "intermediario", "Automação", ["reportlab", "Jinja2"]],
  ["Crawler com Scrapy", "Crawler estruturado com pipelines e exportação.", "avancado", "Automação", ["Scrapy", "PostgreSQL"]],
  ["Automação de e-mail", "Envia e-mails personalizados em massa com agendamento.", "intermediario", "Automação", ["smtplib", "APScheduler"]],
  ["RPA de formulários web", "Preenche e submete formulários automaticamente.", "avancado", "Automação", ["Playwright"]],
  ["Backup automático", "Backup incremental de pastas com versionamento e hash.", "intermediario", "Automação", ["Python", "hashlib"]],
  ["Gerador de QR codes", "Gera QR codes em lote a partir de uma planilha.", "basico", "Automação", ["qrcode", "Pandas"]],

  // ---- Web & APIs ----
  ["API REST de tarefas", "CRUD completo com validação, auth JWT e testes.", "intermediario", "Backend", ["FastAPI", "SQLAlchemy", "PostgreSQL"]],
  ["Encurtador de URLs", "Encurta URLs com redirecionamento e estatísticas de cliques.", "intermediario", "Backend", ["FastAPI", "Redis"]],
  ["API de blog", "Posts, comentários, tags e autenticação de usuários.", "intermediario", "Backend", ["Django", "DRF"]],
  ["Sistema de autenticação", "Registro, login, refresh token e RBAC.", "avancado", "Backend", ["FastAPI", "JWT", "PostgreSQL"]],
  ["API de e-commerce", "Produtos, carrinho, pedidos e pagamento simulado.", "avancado", "Backend", ["FastAPI", "SQLAlchemy", "Redis"]],
  ["Chat em tempo real", "Salas de chat com WebSockets e histórico.", "avancado", "Backend", ["FastAPI", "WebSockets", "Redis"]],
  ["API GraphQL", "Camada GraphQL com resolvers e paginação.", "avancado", "Backend", ["Strawberry", "FastAPI"]],
  ["Webhook receiver", "Recebe e valida webhooks com assinatura HMAC.", "intermediario", "Backend", ["FastAPI"]],
  ["Gateway de upload", "Upload de arquivos com validação e armazenamento.", "intermediario", "Backend", ["FastAPI", "S3"]],
  ["Sistema de feature flags", "Ativa/desativa funcionalidades por usuário/ambiente.", "avancado", "Backend", ["FastAPI", "Redis"]],
  ["API de notificações", "Envia notificações por e-mail, push e in-app.", "avancado", "Backend", ["FastAPI", "Celery", "RabbitMQ"]],
  ["Portal de eventos", "Cadastro de eventos com inscrições e capacidade.", "intermediario", "Backend", ["Django"]],

  // ---- Banco de dados ----
  ["Modelagem de e-commerce", "Schema relacional completo com migrations e seeds.", "intermediario", "Banco de Dados", ["PostgreSQL", "Alembic"]],
  ["Camada de cache com Redis", "Cache-aside, invalidação e rate limiting.", "intermediario", "Banco de Dados", ["Redis", "FastAPI"]],
  ["Migração de dados", "ETL de migração entre dois bancos com validação.", "avancado", "Banco de Dados", ["SQLAlchemy", "Pandas"]],
  ["Busca full-text", "Busca textual com ranking e filtros.", "avancado", "Banco de Dados", ["Elasticsearch", "FastAPI"]],
  ["Repositório genérico", "Padrão repository com SQLAlchemy 2.0 e testes.", "intermediario", "Banco de Dados", ["SQLAlchemy", "Pytest"]],

  // ---- Data Science ----
  ["Análise exploratória de dataset", "EDA completo com limpeza, estatísticas e gráficos.", "intermediario", "Data Science", ["Pandas", "Matplotlib", "Seaborn"]],
  ["Dashboard de vendas", "Dashboard interativo de KPIs de vendas.", "intermediario", "Data Science", ["Streamlit", "Plotly"]],
  ["Pipeline ETL", "Extrai, transforma e carrega dados em formato analítico.", "avancado", "Data Science", ["Polars", "DuckDB", "Parquet"]],
  ["Análise de sentimentos", "Classifica sentimentos de avaliações de produtos.", "intermediario", "Data Science", ["scikit-learn", "Pandas"]],
  ["Detector de fraudes", "Modelo de detecção de transações fraudulentas.", "avancado", "Data Science", ["scikit-learn", "imbalanced-learn"]],
  ["Previsão de séries temporais", "Forecast de demanda com avaliação de erro.", "avancado", "Data Science", ["statsmodels", "Pandas"]],
  ["Web scraping + análise", "Coleta dados, limpa e gera insights visuais.", "intermediario", "Data Science", ["httpx", "Pandas", "Plotly"]],
  ["Relatório automatizado", "Gera relatório analítico recorrente em PDF/HTML.", "intermediario", "Data Science", ["Pandas", "Jinja2"]],
  ["Análise de logs", "Processa logs de servidor e detecta anomalias.", "avancado", "Data Science", ["Pandas", "DuckDB"]],
  ["Recomendador de filmes", "Sistema de recomendação por filtragem colaborativa.", "avancado", "Data Science", ["scikit-learn", "Pandas"]],

  // ---- Machine Learning ----
  ["Classificador de imagens", "CNN para classificar imagens com transfer learning.", "avancado", "Machine Learning", ["PyTorch", "torchvision"]],
  ["Reconhecimento de dígitos", "Modelo MNIST com avaliação e visualização.", "intermediario", "Machine Learning", ["PyTorch"]],
  ["Chatbot com RAG", "Assistente que responde com base em documentos.", "desafio", "Machine Learning", ["LangChain", "FAISS", "FastAPI"]],
  ["Detecção de objetos", "Detecta objetos em imagens/vídeo com YOLO.", "desafio", "Machine Learning", ["Ultralytics", "OpenCV"]],
  ["Sumarizador de textos", "Resume textos longos com modelo de NLP.", "avancado", "Machine Learning", ["Transformers"]],
  ["Servir modelo em produção", "API de inferência com monitoramento de drift.", "desafio", "Machine Learning", ["FastAPI", "MLflow", "Docker"]],
  ["Otimização de hiperparâmetros", "Pipeline com busca automática de hiperparâmetros.", "avancado", "Machine Learning", ["Optuna", "scikit-learn"]],
  ["Análise de tópicos", "Descobre tópicos em uma coleção de documentos.", "avancado", "Machine Learning", ["Gensim", "spaCy"]],

  // ---- DevOps ----
  ["Containerização de app", "Dockerfile multi-stage e docker-compose completo.", "intermediario", "DevOps", ["Docker", "Docker Compose"]],
  ["Pipeline CI/CD", "Lint, testes, build e deploy automatizados.", "avancado", "DevOps", ["GitHub Actions", "Docker"]],
  ["Deploy em Kubernetes", "Manifests, Helm chart e rollout de uma API.", "desafio", "DevOps", ["Kubernetes", "Helm"]],
  ["Stack de observabilidade", "Métricas, logs e tracing de uma app Python.", "desafio", "DevOps", ["Prometheus", "Grafana", "OpenTelemetry"]],
  ["IaC com Terraform", "Provisiona infraestrutura cloud de forma reproduzível.", "avancado", "DevOps", ["Terraform", "AWS"]],
  ["Reverse proxy + load balancer", "Nginx balanceando múltiplas instâncias.", "avancado", "DevOps", ["Nginx", "Docker"]],
  ["Bot de deploy", "Automatiza deploy e rollback com notificações.", "intermediario", "DevOps", ["Python", "Docker"]],
  ["Monitor de saúde de serviços", "Healthchecks, alertas e dashboard de uptime.", "intermediario", "DevOps", ["FastAPI", "Prometheus"]],

  // ---- IoT ----
  ["Estação meteorológica IoT", "Sensores publicam dados via MQTT para um dashboard.", "avancado", "IoT", ["MicroPython", "paho-mqtt", "InfluxDB"]],
  ["Controle de iluminação", "Liga/desliga luzes via API e agendamento.", "intermediario", "IoT", ["Raspberry Pi", "GPIO Zero"]],
  ["Monitor de umidade do solo", "Sensor de irrigação inteligente com alertas.", "intermediario", "IoT", ["MicroPython", "MQTT"]],
  ["Gateway IoT", "Coleta de múltiplos sensores e envio para a nuvem.", "desafio", "IoT", ["paho-mqtt", "FastAPI"]],
  ["Dashboard de sensores", "Visualização em tempo real de séries temporais.", "avancado", "IoT", ["Streamlit", "InfluxDB"]],
  ["Fechadura inteligente", "Controle de acesso com log e notificações.", "avancado", "IoT", ["Raspberry Pi", "FastAPI"]],

  // ---- Bots ----
  ["Bot do Telegram", "Bot com comandos, agendamento e integração com API.", "intermediario", "Automação", ["python-telegram-bot", "APScheduler"]],
  ["Bot do Discord", "Bot de comunidade com moderação e jogos.", "intermediario", "Automação", ["discord.py"]],
  ["Bot de lembretes", "Agenda e envia lembretes recorrentes.", "intermediario", "Automação", ["python-telegram-bot", "SQLite"]],
  ["Bot de cotações", "Consulta cotações de moedas/criptos sob demanda.", "intermediario", "Automação", ["httpx", "discord.py"]],
  ["Bot de suporte com IA", "Atendimento automatizado baseado em FAQ/IA.", "desafio", "Automação", ["FastAPI", "LangChain"]],

  // ---- Segurança ----
  ["Cofre de senhas", "Gerencia senhas com criptografia e senha mestra.", "avancado", "Segurança", ["cryptography", "SQLite"]],
  ["Scanner de portas", "Varre portas abertas de um host de forma assíncrona.", "intermediario", "Segurança", ["asyncio", "socket"]],
  ["Analisador de logs de segurança", "Detecta tentativas de brute force em logs.", "avancado", "Segurança", ["Pandas", "re"]],
  ["Gerador de hashes e verificador", "Calcula e verifica integridade de arquivos.", "basico", "Segurança", ["hashlib"]],
  ["Auditor de dependências", "Verifica vulnerabilidades em um projeto Python.", "intermediario", "Segurança", ["pip-audit", "Bandit"]],
  ["Tokenização e JWT", "Serviço de emissão/validação de tokens seguros.", "avancado", "Segurança", ["PyJWT", "FastAPI"]],

  // ---- Jogos ----
  ["Jogo da forca", "Forca com categorias e ranking.", "basico", "Jogos", ["Python"]],
  ["Snake clássico", "Jogo da cobrinha com pontuação.", "intermediario", "Jogos", ["Pygame"]],
  ["Jogo da velha com IA", "Tic-tac-toe imbatível com minimax.", "intermediario", "Jogos", ["Python"]],
  ["Plataforma 2D", "Jogo de plataforma com física simples.", "avancado", "Jogos", ["Arcade"]],
  ["Campo minado", "Minesweeper com interface gráfica.", "intermediario", "Jogos", ["Pygame"]],
  ["Quiz multiplayer", "Quiz em tempo real para vários jogadores.", "avancado", "Jogos", ["FastAPI", "WebSockets"]],

  // ---- Finanças ----
  ["Controle financeiro pessoal", "Registra receitas/despesas e gera gráficos.", "intermediario", "Finanças", ["Streamlit", "Pandas"]],
  ["Backtesting de estratégia", "Testa uma estratégia de investimento em dados históricos.", "avancado", "Finanças", ["Pandas", "Backtrader"]],
  ["Otimizador de portfólio", "Aloca ativos minimizando risco (Markowitz).", "desafio", "Finanças", ["NumPy", "SciPy"]],
  ["Conversor de moedas", "Consulta câmbio em tempo real e histórico.", "basico", "Finanças", ["httpx", "Pandas"]],
  ["Simulador de juros compostos", "Projeta investimentos com aportes e gráficos.", "basico", "Finanças", ["Streamlit"]],

  // ---- Desktop & Full-stack ----
  ["App desktop de notas", "Editor de notas com busca e tags.", "intermediario", "Desktop", ["PySide6"]],
  ["Leitor de RSS", "Agrega feeds e marca lidos.", "intermediario", "Automação", ["feedparser", "Tkinter"]],
  ["Editor Markdown", "Editor com preview em tempo real.", "intermediario", "Desktop", ["PySide6"]],
  ["Sistema de biblioteca full-stack", "Backend FastAPI + frontend consumindo a API.", "avancado", "Engenharia de Software", ["FastAPI", "PostgreSQL", "Docker"]],
  ["Rede social mínima", "Posts, seguidores e timeline.", "desafio", "Engenharia de Software", ["FastAPI", "PostgreSQL", "Redis"]],
  ["Plataforma de cursos", "Cursos, aulas, matrícula e progresso.", "desafio", "Engenharia de Software", ["Django", "PostgreSQL"]],
  ["Kanban colaborativo", "Quadro Kanban com atualização em tempo real.", "desafio", "Engenharia de Software", ["FastAPI", "WebSockets"]],

  // ---- Engenharia de Dados ----
  ["Pipeline orquestrado", "DAGs agendadas de ingestão e transformação.", "desafio", "Engenharia de Dados", ["Airflow", "Pandas", "Parquet"]],
  ["Data lake mínimo", "Ingestão em camadas (bronze/silver/gold).", "desafio", "Engenharia de Dados", ["Polars", "DuckDB", "Delta Lake"]],
  ["Streaming de eventos", "Processa eventos em tempo real de um tópico Kafka.", "desafio", "Engenharia de Dados", ["Kafka", "FastAPI"]],
  ["ETL incremental", "Carga incremental idempotente com observabilidade.", "avancado", "Engenharia de Dados", ["SQLAlchemy", "DuckDB"]],
  ["Qualidade de dados", "Valida contratos de dados em um pipeline.", "avancado", "Engenharia de Dados", ["Great Expectations", "Pandas"]],

  // ---- Projetos integradores ----
  ["Projeto final full-stack", "Aplicação completa: API, banco, frontend e deploy.", "desafio", "Engenharia de Software", ["FastAPI", "PostgreSQL", "Docker", "CI/CD"]],
  ["SaaS multi-tenant", "Plataforma com isolamento por tenant e billing.", "desafio", "Engenharia de Software", ["FastAPI", "PostgreSQL", "Redis"]],
  ["Marketplace", "Vendedores, produtos, pedidos e pagamentos.", "desafio", "Engenharia de Software", ["Django", "Celery", "PostgreSQL"]],
];

const REQ = {
  basico: ["Implemente a funcionalidade principal de forma clara e legível.", "Trate entradas inválidas e casos de borda.", "Inclua um exemplo de uso no README."],
  intermediario: ["Modele o domínio com boas práticas e separação de responsabilidades.", "Adicione validação e tratamento central de erros.", "Escreva testes automatizados (pytest).", "Documente a instalação e o uso."],
  avancado: ["Estruture em camadas (domínio, serviço, infraestrutura).", "Adicione testes com boa cobertura.", "Inclua logging estruturado e tratamento de falhas.", "Containerize a aplicação com Docker."],
  desafio: ["Arquitetura escalável, desacoplada e testável.", "Testes, CI/CD e observabilidade (logs, métricas).", "Deploy reproduzível com estratégia de rollback.", "Documente decisões técnicas (ADRs) no README."],
};
const STEPS = {
  basico: ["Planeje o escopo e a estrutura de pastas.", "Implemente o núcleo da solução.", "Adicione tratamento de erros e um exemplo.", "Escreva o README e finalize."],
  intermediario: ["Defina o domínio e a estrutura do projeto.", "Implemente as funcionalidades principais.", "Adicione validação, erros e testes.", "Documente e empacote/execute."],
  avancado: ["Modele em camadas e defina contratos.", "Implemente serviços e persistência.", "Adicione testes, logging e configuração por ambiente.", "Containerize com Docker e documente.", "Adicione CI e prepare o deploy."],
  desafio: ["Desenhe a arquitetura e as fronteiras dos componentes.", "Implemente o núcleo e as integrações.", "Adicione testes, observabilidade e segurança.", "Configure CI/CD e deploy reproduzível.", "Documente decisões e meça resultados."],
};

const out = P.map(([title, description, difficulty, area, technologies]) => ({
  title,
  description,
  difficulty,
  area,
  technologies,
  requirements: REQ[difficulty],
  steps: STEPS[difficulty],
  github_url: null,
  status: "nao_iniciado",
}));

writeFileSync(
  join(process.cwd(), "supabase", "projects_expansion.json"),
  JSON.stringify(out),
);
const byA = {};
const byD = {};
for (const p of out) {
  byA[p.area] = (byA[p.area] || 0) + 1;
  byD[p.difficulty] = (byD[p.difficulty] || 0) + 1;
}
console.log(`Projetos: ${out.length}`);
console.log("Por dificuldade:", byD);
console.log("Áreas:", Object.keys(byA).length);
