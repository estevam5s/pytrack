#!/usr/bin/env node
/**
 * Expansão v2 do banco de exercícios — leva o total para 5.000+.
 * Gera exercícios ÚNICOS e variados cobrindo todo o ecossistema Python e
 * insere direto no Supabase (REST, service role). ex_id "HX####", source "expansao-v2".
 *
 * Uso:
 *   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE=... node scripts/expand-exercises-v2.mjs
 */
const SUPA = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPA || !SERVICE) { console.error("Faltam env Supabase"); process.exit(1); }
const HEADERS = { apikey: SERVICE, Authorization: `Bearer ${SERVICE}`, "Content-Type": "application/json" };

const slug = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50);

// [categoria, nível, tipo, padrões, subjects]
const BLOCKS = [
  ["Fundamentos & Sintaxe", "basico", "Implementação prática",
    ["Escreva uma função que {s}.", "Implemente um programa que {s}."],
    ["calcule o IMC e classifique a faixa", "converta números por extenso (até milhões)", "valide um CNPJ", "gere um cronograma de parcelas de um empréstimo", "verifique se uma data é válida", "calcule a idade a partir de uma data de nascimento", "conte palavras únicas de um texto", "inverta a ordem das palavras de uma frase", "capitalize títulos respeitando preposições", "detecte o tipo de um número (par/ímpar/primo/perfeito)", "some os dígitos de um número até virar um único dígito", "converta um número decimal em fração", "implemente a regra de três simples e composta", "calcule o troco com o menor número de cédulas", "transforme uma string em URL slug", "verifique se um texto contém apenas dígitos", "gere a tabuada de um número formatada", "calcule a distância entre dois pontos no plano", "implemente um cronômetro regressivo (contagem)", "valide e formate um número de telefone brasileiro"]],

  ["Strings & Regex", "intermediario", "Implementação prática",
    ["Implemente {s}.", "Escreva uma função que {s}."],
    ["um extrator de e-mails e telefones de um texto", "um validador de senha com regex e regras", "um substituidor de múltiplos padrões em um texto", "um tokenizador simples de palavras", "um destaque de termos em um texto (marcação)", "um corretor de espaços e pontuação duplicada", "um parser de logs no formato comum (Apache)", "um mascarador de dados sensíveis (CPF, cartão)", "um contador de hashtags e menções", "um conversor de Markdown simples para HTML", "um extrator de URLs com validação", "um analisador de formato de data flexível", "um gerador de iniciais a partir de nomes", "um normalizador de números de telefone internacionais", "um buscador de palavras repetidas consecutivas"]],

  ["POO & Design", "intermediario", "Modelagem orientada a objetos",
    ["Modele e implemente {s}.", "Implemente, com POO, {s}."],
    ["um sistema de contas bancárias com herança", "um carrinho de compras com itens e descontos", "uma biblioteca com livros, membros e empréstimos", "um jogo de baralho com cartas e mãos", "uma máquina de estados para um pedido", "um sistema de reservas de salas", "um catálogo de produtos com categorias", "uma hierarquia de formas geométricas com área", "um sistema de funcionários com folha de pagamento", "uma fila de atendimento com prioridades", "um padrão Observer para notificações", "um padrão Strategy para cálculo de frete", "um padrão Factory para criação de veículos", "um padrão Singleton para configuração", "um padrão Decorator para bebidas de uma cafeteria", "um repositório genérico em memória", "um sistema de permissões com papéis (RBAC)", "uma agenda de contatos com validações", "um inventário de jogo com itens empilháveis", "um sistema de votação com candidatos e apuração"]],

  ["Funcional & Iteradores", "intermediario", "Implementação prática",
    ["Implemente {s}.", "Crie {s} usando recursos funcionais."],
    ["um pipeline lazy com map/filter/reduce", "um agrupador (groupby) próprio", "um memoize com lru_cache e sem", "um gerador de combinações e permutações", "um flatten recursivo de estruturas", "um partial application manual", "um compositor de funções (compose/pipe)", "um iterador de janela deslizante (sliding window)", "um chunker que divide um iterável em blocos", "um take/drop while sobre iteráveis", "um zip_longest próprio", "um scan/accumulate manual", "um gerador de fibonacci infinito com itertools", "um dispatcher por tipo (singledispatch)", "um currying com functools"]],

  ["Arquivos, CSV & JSON", "intermediario", "Implementação prática",
    ["Escreva um script que {s}.", "Implemente uma rotina que {s}."],
    ["consolide vários CSVs com colunas diferentes", "converta JSON aninhado em planilha achatada", "valide um JSON contra um schema", "leia um arquivo de 1GB em streaming contando padrões", "deduplique registros de um CSV por chave", "gere um relatório XLSX com formatação", "faça o parsing de um arquivo .ini de configuração", "compacte e descompacte arquivos em zip", "monitore uma pasta e processe novos arquivos", "converta entre YAML, JSON e TOML", "extraia tabelas de um PDF de texto", "anonimize colunas sensíveis de um CSV", "calcule estatísticas (média, desvio) de um CSV", "particione um CSV grande por valor de coluna", "una dois datasets por chave (join)"]],

  ["Bancos de Dados & SQL", "intermediario", "Implementação com persistência",
    ["Implemente {s}.", "Crie {s} usando SQLite/SQLAlchemy."],
    ["um CRUD de tarefas em SQLite puro", "um ORM mínimo com SQLAlchemy Core", "uma migração de schema com Alembic", "um repositório com paginação e filtros", "um seed de dados de exemplo idempotente", "consultas com JOIN, GROUP BY e agregações", "transações com rollback em caso de erro", "um cache de consultas com invalidação", "um índice e medição de performance de query", "um backup e restore de uma tabela", "uma camada de acesso a dados (DAO) testável", "um upsert (insert or update) por chave única", "uma busca full-text simples", "um relatório com subconsultas correlacionadas", "um pool de conexões reutilizável"]],

  ["Web & APIs (FastAPI/Flask)", "avancado", "Implementação de API",
    ["Implemente {s}.", "Construa {s} com FastAPI."],
    ["uma API REST de tarefas com CRUD e validação", "autenticação JWT com refresh token", "rate limiting por IP em um endpoint", "upload e download de arquivos", "paginação, ordenação e filtros em uma listagem", "webhooks com verificação de assinatura", "documentação automática e exemplos", "tratamento global de erros com handlers", "versionamento de API (v1/v2)", "um middleware de logging de requisições", "cache de resposta com cabeçalhos HTTP", "validação de payload com Pydantic v2", "um endpoint de health-check e métricas", "background tasks para envio de e-mail", "CORS configurável por ambiente"]],

  ["Async & Concorrência", "avancado", "Programação assíncrona",
    ["Implemente {s}.", "Resolva com asyncio: {s}."],
    ["um downloader concorrente com limite de conexões", "um produtor/consumidor com asyncio.Queue", "um scraper assíncrono com httpx", "um timeout e cancelamento de tarefas", "um pool de workers com semáforo", "um retry assíncrono com backoff", "um agregador de várias APIs em paralelo (gather)", "um rate limiter assíncrono", "um pipeline assíncrono com streams", "comparação de threads vs async para I/O", "um servidor de eco com asyncio", "processamento paralelo com multiprocessing", "um lock e condições de corrida resolvidas", "um cache assíncrono com expiração", "um job scheduler assíncrono simples"]],

  ["Data Science (NumPy/Pandas)", "avancado", "Análise de dados",
    ["Implemente {s}.", "Usando pandas/numpy, {s}."],
    ["uma limpeza completa de um dataset sujo", "a detecção e tratamento de outliers", "um pivot table com agregações", "a junção de múltiplos DataFrames", "a normalização e padronização de features", "uma análise exploratória com estatísticas", "a criação de features derivadas (feature engineering)", "o agrupamento e cálculo de métricas por categoria", "a reamostragem de séries temporais", "o tratamento de valores ausentes com estratégias", "operações vetorizadas vs loops (benchmark)", "a leitura eficiente de arquivos grandes em chunks", "a aplicação de funções por linha/coluna", "a criação de um relatório resumido automatizado", "a deduplicação e validação de integridade"]],

  ["Machine Learning", "avancado", "Modelagem de ML",
    ["Implemente {s}.", "Com scikit-learn, {s}."],
    ["um pipeline de classificação com validação cruzada", "uma regressão linear do zero (gradiente)", "a avaliação com matriz de confusão e métricas", "um pré-processamento com ColumnTransformer", "a seleção de features por importância", "um modelo de clustering (KMeans) com avaliação", "um tuning de hiperparâmetros com GridSearch", "a divisão treino/validação/teste estratificada", "um detector de overfitting com curvas de aprendizado", "um sistema de recomendação por similaridade", "a serialização e carga de um modelo treinado", "um baseline e comparação de modelos", "a calibração de probabilidades", "um pipeline de texto com TF-IDF", "a avaliação de um modelo de regressão (RMSE, R²)"]],

  ["Automação, CLI & Scraping", "intermediario", "Automação",
    ["Escreva um script que {s}.", "Implemente uma automação que {s}."],
    ["renomeie arquivos em lote por padrão", "organize uma pasta por tipo de arquivo", "extraia dados de uma página web (scraping)", "automatize o envio de e-mails com anexos", "gere relatórios PDF a partir de dados", "monitore um site e avise sobre mudanças", "preencha planilhas automaticamente", "faça backup incremental de uma pasta", "uma CLI com argparse e subcomandos", "uma CLI rica com Typer e progresso", "agende tarefas com APScheduler", "baixe e processe um feed RSS", "automatize a publicação em uma API", "consolide notificações em um resumo diário", "limpe arquivos temporários por idade"]],

  ["Testes & Qualidade", "intermediario", "Testes/Qualidade",
    ["Escreva testes para {s}.", "Implemente e teste {s} com pytest."],
    ["uma função de validação com casos de borda", "um cálculo financeiro com fixtures", "uma API com client de teste", "um repositório com mocks de banco", "uma função assíncrona com pytest-asyncio", "parametrização de múltiplos cenários", "um teste de propriedade com hypothesis", "cobertura mínima de 90% em um módulo", "testes de integração com banco em memória", "um mock de requisições HTTP externas", "testes de regressão para um bug específico", "fixtures compartilhadas em conftest", "um teste de performance simples", "validação de contrato de API", "testes de exceções e mensagens de erro"]],

  ["DevOps, Docker & Cloud", "avancado", "DevOps",
    ["Implemente {s}.", "Configure {s}."],
    ["um Dockerfile multi-stage para uma app Python", "um docker-compose com app + Postgres + Redis", "um pipeline CI com lint, testes e build", "variáveis de ambiente e configuração 12-factor", "um health-check e readiness probe", "logs estruturados em JSON", "métricas com Prometheus client", "um deploy automatizado simples", "um script de migração em produção seguro", "cache de dependências no CI", "um worker em background com fila", "rotação e retenção de logs", "um endpoint de métricas customizadas", "um rollback automatizado", "secrets via variáveis de ambiente"]],

  ["Segurança", "avancado", "Segurança aplicada",
    ["Implemente {s}.", "Resolva o problema de segurança: {s}."],
    ["hash de senhas com bcrypt e verificação", "criptografia simétrica de um arquivo (Fernet)", "geração e validação de tokens JWT", "proteção contra SQL injection em queries", "validação e sanitização de entrada", "rate limiting para login (anti-brute-force)", "verificação de assinatura de webhook (HMAC)", "armazenamento seguro de segredos", "um cofre de senhas criptografado", "TOTP (autenticador) do zero", "controle de acesso por papéis (RBAC)", "mascaramento de dados sensíveis em logs", "validação de upload (tipo, tamanho, MIME)", "CSP e cabeçalhos de segurança em uma API", "detecção de senhas vazadas (k-anonymity)"]],

  ["Big Data & Streaming", "avancado", "Processamento em escala",
    ["Implemente {s}.", "Processe em escala: {s}."],
    ["um word count com PySpark", "um ETL de CSV grande com Polars", "um produtor/consumidor Kafka simples", "agregações em janela de tempo (streaming)", "particionamento de dados por chave", "a leitura de Parquet com filtros (predicate pushdown)", "um pipeline batch com checkpoints", "a deduplicação de eventos em streaming", "métricas em tempo real de um fluxo", "o join de dois streams por chave", "compressão e formatos colunares", "o processamento idempotente de eventos", "a detecção de anomalias em séries", "a contagem aproximada (HyperLogLog)", "um data lake versionado simples"]],

  ["Algoritmos & Entrevista", "avancado", "Resolução de problemas",
    ["Resolva: {s}.", "Implemente a solução ótima para {s}."],
    ["two sum em O(n)", "maior subarray contíguo (Kadane)", "produto de array exceto o próprio elemento", "validação de parênteses balanceados", "merge de k listas ordenadas", "rotação de matriz 90 graus in-place", "busca em matriz ordenada", "a subsequência crescente mais longa", "níveis de uma árvore binária (BFS)", "menor caminho em um grid (BFS)", "moedas para um valor (programação dinâmica)", "a mochila 0/1", "o caminho com soma máxima em uma árvore", "detecção de ciclo em um grafo", "o LRU cache em O(1)", "a mediana de um fluxo de números", "permutações únicas de uma lista", "agendamento de intervalos sem conflito", "o maior retângulo em um histograma", "a edição mínima entre duas strings (Levenshtein)"]],

  ["IoT & Embarcados", "intermediario", "Implementação prática",
    ["Implemente {s}.", "Simule {s}."],
    ["a leitura de sensores e cálculo de média móvel", "um publicador MQTT de telemetria", "um assinante MQTT que reage a comandos", "a detecção de anomalia em leituras de sensor", "um buffer circular para amostras", "a conversão de leituras analógicas em unidades", "um protocolo simples de mensagens binárias", "um agendador de coletas periódicas", "a compressão de séries temporais", "um watchdog que reinicia uma tarefa travada"]],
];

const REQS = [
  "Implemente a solução em arquivo próprio, seguindo o caminho sugerido.",
  "Separe a lógica principal em função, classe ou módulo reutilizável.",
  "Trate entradas inválidas e casos de borda com mensagens claras.",
];
const ACCEPT = [
  "O programa roda sem erros e produz a saída esperada.",
  "Casos de borda e entradas inválidas são tratados.",
  "O código é legível, com nomes claros e responsabilidades separadas.",
];
const CHECK = [
  "Implementei a solução conforme o objetivo.",
  "Testei com entradas normais e de borda.",
  "Revisei legibilidade e organização do código.",
];

const out = [];
let n = 0;
for (const [group, level, type, patterns, subjects] of BLOCKS) {
  subjects.forEach((s, i) => {
    const pat = patterns[i % patterns.length];
    const title = pat.replace("{s}", s);
    n += 1;
    out.push({
      ex_id: `HX${String(n).padStart(4, "0")}`,
      title,
      category: group,
      group_label: group,
      level,
      type,
      objective: title,
      requirements: REQS,
      acceptance: ACCEPT,
      checklist: CHECK,
      suggested_file: `exercicios/${slug(group)}/${slug(s)}.py`,
      suggested_test: `tests/test_${slug(s)}.py`,
      source: "expansao-v2",
      order_index: 300000 + n,
    });
  });
}

// variantes "com testes" para reforçar cultura de testes e ampliar o total
const base = out.slice();
base.forEach((b, i) => {
  n += 1;
  const title = `${b.title.replace(/\.$/, "")} — e cubra com testes pytest (casos de borda).`;
  out.push({
    ...b,
    ex_id: `HV${String(i + 1).padStart(4, "0")}`,
    title,
    objective: title,
    type: "Testes/Qualidade",
    requirements: ["Implemente com função/classe reutilizável e type hints.", "Cubra casos normais, de borda e de erro com pytest.", "Garanta no mínimo 90% de cobertura no módulo."],
    suggested_test: b.suggested_test,
    order_index: 400000 + i,
  });
});

console.log(`Gerados ${out.length} novos exercícios. Inserindo no Supabase...`);

// insere em lotes de 200
let inserted = 0;
for (let i = 0; i < out.length; i += 200) {
  const batch = out.slice(i, i + 200);
  const res = await fetch(`${SUPA}/rest/v1/practice_exercises`, {
    method: "POST",
    headers: { ...HEADERS, Prefer: "return=minimal" },
    body: JSON.stringify(batch),
  });
  if (!res.ok) {
    console.error("Erro no lote:", res.status, (await res.text()).slice(0, 200));
    break;
  }
  inserted += batch.length;
  console.log(`  inseridos ${inserted}/${out.length}`);
}
console.log(`✅ Total inserido: ${inserted}`);
