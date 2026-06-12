/**
 * Expansão do banco de exercícios: gera exercícios concretos e variados por
 * categoria, combinando padrões com tarefas reais. Gera ~1200 novos exercícios
 * de qualidade (ex_id "GX####", source "expansao") para dobrar o banco.
 *
 * Saída: supabase/expansion_exercises.json
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";

// pattern: frase com {s}. subjects: completam a frase de forma natural.
// Cada bloco: [group_label, level, type, patterns[], subjects[]]
const BLOCKS = [
  ["Fundamentos", "basico", "Implementação prática",
    ["Implemente uma função que {s}.", "Escreva um programa que {s}.", "Crie uma função pura que {s}."],
    ["valide um CPF e retorne True/False", "converta números romanos em inteiros", "calcule o MDC e o MMC de dois números",
     "verifique se uma palavra é palíndromo ignorando acentos", "conte vogais e consoantes de um texto",
     "converta segundos em horas, minutos e segundos", "formate um valor em moeda brasileira (R$)",
     "gere a sequência de Fibonacci até n termos", "verifique se um ano é bissexto", "calcule a média ponderada de notas",
     "transforme uma frase em camelCase e snake_case", "remova acentos de uma string", "valide um e-mail com regex simples",
     "converta temperatura entre Celsius, Fahrenheit e Kelvin", "calcule o fatorial de forma iterativa e recursiva",
     "conte a frequência de cada caractere de uma string", "verifique se dois textos são anagramas",
     "gere uma senha aleatória segura de tamanho configurável", "arredonde um número para múltiplos de 5",
     "implemente um conversor de bases numéricas (bin, oct, hex)", "calcule juros simples e compostos",
     "verifique se um número é primo de forma eficiente", "trunque um texto preservando palavras inteiras",
     "valide a força de uma senha e retorne um score", "normalize espaços em branco de um texto"]],

  ["Estruturas de Dados", "intermediario", "Implementação + análise",
    ["Implemente {s}.", "Resolva usando a estrutura adequada: {s}.", "Modele e implemente {s}."],
    ["uma pilha com operações push, pop e peek em O(1)", "uma fila circular com capacidade fixa",
     "uma lista ligada simples com inserção e remoção", "uma lista duplamente ligada",
     "uma fila de prioridade usando heapq", "um cache LRU com OrderedDict",
     "um cache LFU simples", "a busca binária em uma lista ordenada",
     "o algoritmo de ordenação merge sort", "o quick sort com pivô mediano",
     "a verificação de parênteses balanceados com pilha", "a detecção de ciclo em uma lista ligada",
     "a interseção e união de dois conjuntos sem usar set", "um histograma de frequência com defaultdict",
     "a transposição de uma matriz", "a multiplicação de duas matrizes",
     "uma árvore binária de busca com inserção e busca", "o percurso em ordem de uma árvore binária",
     "BFS em um grafo representado por lista de adjacência", "DFS recursivo e iterativo em um grafo",
     "o algoritmo de Dijkstra para menor caminho", "a ordenação topológica de um DAG",
     "union-find com compressão de caminho", "uma trie para autocomplete de palavras",
     "rotação de uma lista em k posições in-place", "achatar uma lista com aninhamento arbitrário",
     "encontrar o k-ésimo maior elemento", "agrupar anagramas de uma lista de palavras"]],

  ["Funções & Módulos", "intermediario", "Implementação prática",
    ["Implemente {s}.", "Crie {s}."],
    ["um decorator que mede e registra o tempo de execução", "um decorator de retry com backoff exponencial",
     "um decorator de cache (memoization) manual", "um decorator que valida os tipos dos argumentos",
     "a função compose(f, g) que compõe duas funções", "um pipeline de transformações sobre um iterável",
     "um gerador que produz números primos sob demanda", "um gerador que lê um arquivo grande linha a linha",
     "uma função curry simples", "um context manager para medir tempo com `with`",
     "um context manager que abre e fecha um recurso com segurança", "uma função com argumentos keyword-only",
     "um módulo utils com funções de string, número e data", "um decorator que limita a taxa de chamadas",
     "uma função que aceita *args e **kwargs e os encaminha", "um gerador infinito de IDs sequenciais"]],

  ["Arquivos & Dados", "intermediario", "Implementação prática",
    ["Escreva um script que {s}.", "Implemente uma rotina que {s}."],
    ["leia um CSV, limpe nulos e exporte um JSON", "converta um JSON aninhado em CSV achatado",
     "leia um arquivo grande em streaming e conte ocorrências", "mescle vários CSVs em um único arquivo",
     "valide um JSON contra um schema esperado", "gere um relatório XLSX a partir de uma lista de dicts",
     "leia uma planilha Excel e calcule totais por coluna", "compacte e descompacte um diretório em ZIP",
     "faça o parse de um arquivo de log e extraia erros", "leia um TOML de configuração e valide campos",
     "converta CSV em Parquet usando pyarrow", "renomeie arquivos em lote por um padrão",
     "calcule o hash SHA-256 de arquivos para detectar duplicatas", "leia um YAML e gere variáveis de ambiente",
     "extraia texto de um PDF e conte palavras", "gere um CSV de exemplo com dados sintéticos",
     "monitore um diretório e reaja a novos arquivos", "faça backup incremental de uma pasta"]],

  ["Automação & CLI", "intermediario", "Implementação prática",
    ["Crie uma automação que {s}.", "Implemente uma CLI que {s}."],
    ["renomeie fotos por data de criação", "envie um relatório por e-mail agendado",
     "faça scraping de uma tabela e salve em CSV", "baixe arquivos de uma lista de URLs com retry",
     "organize arquivos por extensão em pastas", "preencha um formulário web com Playwright",
     "gere QR codes a partir de uma lista", "consulte uma API pública e cacheie o resultado",
     "agende uma tarefa recorrente com APScheduler", "exponha comandos com Typer e Rich",
     "leia argumentos com argparse e valide entradas", "monitore um site e alerte em mudanças",
     "extraia links de uma página com BeautifulSoup", "automatize commits e push de um diretório",
     "converta imagens em lote para WebP", "gere um índice Markdown de uma pasta de notas"]],

  ["POO", "intermediario", "POO/Design",
    ["Modele com classes: {s}.", "Implemente usando POO: {s}.", "Projete as classes para {s}."],
    ["um sistema de contas bancárias com depósito, saque e extrato", "um carrinho de compras com itens e descontos",
     "uma biblioteca com livros, usuários e empréstimos", "um jogo de baralho com cartas e mãos",
     "uma máquina de estados para um pedido (criado, pago, enviado)", "um sistema de notificações com Observer",
     "uma fábrica de formas geométricas com área e perímetro", "um repositório genérico com Strategy de persistência",
     "um sistema de permissões com papéis (RBAC)", "uma calculadora de impostos com Strategy",
     "uma hierarquia de funcionários com polimorfismo de salário", "um construtor (Builder) de relatórios",
     "um adaptador entre duas APIs incompatíveis", "um decorator de funcionalidades de café (leite, açúcar)",
     "uma classe Vetor com operadores sobrecarregados (__add__, __eq__)", "um dataclass imutável com validação no __post_init__",
     "um Protocol para repositórios e duas implementações", "um singleton controlado para configuração",
     "um sistema de eventos com Command e desfazer (undo)", "uma classe Temperatura com properties e validação",
     "um ORM minimalista com __getattr__ e descritores", "um pool de objetos reutilizáveis"]],

  ["SQL & Banco de Dados", "intermediario", "Aplicação/API",
    ["Escreva uma consulta SQL que {s}.", "Implemente com SQLAlchemy: {s}.", "Modele o banco para {s}."],
    ["retorne os 10 clientes que mais compraram", "calcule o faturamento mensal com agregação",
     "faça JOIN entre pedidos, clientes e produtos", "encontre produtos sem nenhuma venda",
     "use window functions para ranquear vendas por região", "deduplique registros mantendo o mais recente",
     "crie índices adequados para uma query lenta", "implemente paginação eficiente com keyset",
     "modele um e-commerce com clientes, pedidos e itens", "use transações para transferência entre contas",
     "crie uma view materializada de métricas diárias", "implemente soft delete com filtro automático",
     "faça upsert (INSERT ... ON CONFLICT) idempotente", "normalize um esquema até a 3FN",
     "use CTE recursiva para uma hierarquia de categorias", "implemente um repositório CRUD com SQLAlchemy 2.0",
     "modele relacionamento muitos-para-muitos com tabela associativa", "calcule a taxa de churn mensal",
     "use Alembic para versionar uma migração", "consulte um JSONB no PostgreSQL"]],

  ["Data Science & ML", "intermediario", "Dados/ML",
    ["Usando pandas, {s}.", "Implemente um pipeline que {s}.", "Com NumPy/scikit-learn, {s}."],
    ["limpe valores nulos e padronize colunas", "agrupe vendas por categoria e calcule estatísticas",
     "faça merge de dois DataFrames e resolva conflitos", "crie uma feature de data (ano, mês, dia da semana)",
     "detecte e trate outliers com IQR", "normalize features com StandardScaler",
     "treine uma regressão linear e avalie com RMSE", "treine um classificador e avalie com matriz de confusão",
     "faça validação cruzada k-fold de um modelo", "calcule correlação e gere um heatmap",
     "vetorize textos com TF-IDF para classificação", "balanceie classes com oversampling",
     "faça EDA e gere um relatório de qualidade dos dados", "implemente um ETL de CSV para banco analítico",
     "otimize hiperparâmetros com GridSearch", "calcule a importância de features",
     "agrupe dados com K-Means e escolha k pelo cotovelo", "crie um pipeline sklearn com pré-processamento e modelo",
     "leia Parquet com Polars e agregue de forma lazy", "faça forecasting simples de série temporal",
     "construa um dashboard com Streamlit de um dataset", "trate dados faltantes com imputação por mediana"]],

  ["Web & APIs", "intermediario", "Aplicação/API",
    ["Implemente em FastAPI {s}.", "Crie uma API que {s}.", "Implemente {s}."],
    ["um CRUD de tarefas com validação Pydantic", "autenticação JWT com refresh token",
     "um endpoint de upload de arquivos com validação", "paginação, filtros e ordenação em uma listagem",
     "rate limiting por IP em um endpoint sensível", "um webhook que valida assinatura HMAC",
     "versionamento de API (v1, v2) por path", "tratamento central de erros com handlers",
     "documentação OpenAPI com exemplos e tags", "um endpoint assíncrono que chama outra API com httpx",
     "WebSocket de chat em tempo real", "health check e readiness para Kubernetes",
     "CORS restritivo e headers de segurança", "cache de respostas com Redis",
     "background tasks para enviar e-mail após cadastro", "um resolver GraphQL com Strawberry",
     "testes de API com TestClient e httpx", "um middleware de logging com correlation id",
     "dependency injection para sessão de banco", "um endpoint que exporta dados em CSV em streaming"]],

  ["Concorrência & Performance", "avancado", "Implementação + análise",
    ["Implemente e compare desempenho: {s}.", "Resolva com concorrência: {s}."],
    ["baixar 100 URLs com asyncio.gather e medir o tempo", "processar arquivos em paralelo com ProcessPoolExecutor",
     "um produtor/consumidor com asyncio.Queue", "rate limiting de chamadas async com semáforo",
     "um worker de fila com timeout e cancelamento", "comparar threading vs asyncio em tarefa I/O-bound",
     "comparar multiprocessing vs loop em tarefa CPU-bound", "memoization concorrente seguro com lock",
     "fazer profiling com cProfile e otimizar o gargalo", "reduzir alocações com __slots__ e medir memória",
     "implementar backpressure em um pipeline async", "paralelizar um map pesado e agregar resultados",
     "usar contextvars para propagar um request id", "implementar retries com backoff em chamadas async"]],

  ["Testes & Qualidade", "intermediario", "Testes/Qualidade",
    ["Escreva testes com pytest para {s}.", "Garanta qualidade: {s}."],
    ["uma função de validação de CPF", "um parser de datas em vários formatos",
     "uma calculadora de juros compostos", "um cliente HTTP usando responses para mockar",
     "um repositório com banco em memória (SQLite)", "uma função que depende do horário (use freezegun)",
     "casos de borda de uma função de divisão", "uma API FastAPI com TestClient",
     "property-based testing com Hypothesis de uma função pura", "fixtures compartilhadas para dados de teste",
     "cobertura mínima de 90% com pytest-cov", "mocks de uma chamada externa com unittest.mock",
     "testes parametrizados para múltiplos cenários", "um teste de integração com banco real em container",
     "configuração de pre-commit com Ruff e mypy", "testes de regressão para um bug corrigido"]],

  ["Python Avançado", "avancado", "POO/Design",
    ["Implemente {s}.", "Explore um recurso avançado: {s}."],
    ["um descritor que valida e converte um atributo", "uma metaclasse que registra subclasses automaticamente",
     "__init_subclass__ para validar a definição de subclasses", "um decorator de classe que adiciona métodos",
     "um context manager assíncrono com __aenter__/__aexit__", "um iterador customizado com __iter__/__next__",
     "sobrecarga de operadores para uma classe Matriz", "__getattr__ dinâmico para um objeto de configuração",
     "um gerenciador de contexto com ExitStack para múltiplos recursos", "um cache com weakref para objetos grandes",
     "pattern matching estrutural (match/case) para um interpretador", "slots e __dict__ comparando uso de memória",
     "um enum com comportamento e métodos", "tipagem genérica com TypeVar e Generic",
     "um Protocol com runtime_checkable", "lazy evaluation com functools.cached_property"]],

  ["Big Data", "avancado", "Dados/ML",
    ["Implemente com PySpark {s}.", "Em um cenário de Big Data, {s}."],
    ["uma agregação de logs por hora", "um job que lê Parquet particionado e filtra",
     "word count distribuído sobre um corpus grande", "um join entre dois grandes datasets com broadcast",
     "deduplicação de eventos por chave e janela", "um pipeline de ETL com leitura, transformação e escrita",
     "cálculo de métricas com window functions no Spark", "consumo de um tópico Kafka e agregação em micro-batches",
     "particionamento e bucketing para otimizar leitura", "tratamento de dados corrompidos com modo permissivo",
     "um pipeline incremental com checkpoint", "conversão de CSV massivo para Delta/Parquet"]],

  ["Segurança", "avancado", "Aplicação/API",
    ["Implemente com segurança: {s}.", "Resolva a vulnerabilidade: {s}."],
    ["hash de senhas com bcrypt e verificação", "geração e validação de JWT com expiração",
     "proteção contra SQL injection com queries parametrizadas", "sanitização de entrada para evitar XSS",
     "proteção CSRF com token por sessão", "criptografia simétrica de um arquivo com cryptography",
     "geração de tokens seguros com secrets", "rate limiting para mitigar brute force no login",
     "validação e limite de upload de arquivos", "rotação de chaves e armazenamento de secrets fora do código",
     "verificação de integridade com HMAC", "RBAC e ABAC para autorização de recursos",
     "auditoria de dependências com pip-audit e Bandit", "mascaramento de dados sensíveis em logs",
     "OAuth2 Authorization Code com PKCE", "política de senhas e bloqueio progressivo"]],

  ["Docker & DevOps", "avancado", "Infraestrutura prática",
    ["Configure: {s}.", "Implemente em DevOps: {s}."],
    ["um Dockerfile multi-stage para uma app FastAPI", "um docker-compose com app, Postgres e Redis",
     "healthchecks e usuário não-root em um container", "um pipeline CI no GitHub Actions (lint, test, build)",
     "deploy automatizado com rollback", "variáveis de ambiente e secrets no compose",
     "um Makefile com comandos de dev, test e deploy", "observabilidade com logs estruturados (structlog)",
     "métricas Prometheus em uma app Python", "tracing distribuído com OpenTelemetry",
     "um reverse proxy Nginx para a aplicação", "build reproduzível com lockfile (uv/poetry)",
     "gunicorn com workers uvicorn para produção", "um cron job em container para tarefa recorrente"]],
];

const REQS = [
  "Implemente a solução em arquivo próprio, com função/classe reutilizável.",
  "Trate entradas inválidas e casos de borda.",
  "Adicione type hints e comente apenas o não óbvio.",
];
const ACCEPT = [
  "A solução executa sem erros e cobre os casos descritos.",
  "O código é legível, organizado e com nomes claros.",
  "Há exemplo de uso e/ou teste demonstrando o comportamento.",
];
const CHECK = [
  "Implementação concluída.",
  "Testes ou validação manual concluídos.",
  "Código revisado, tipado e formatado.",
];

function slug(s) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 60);
}

const out = [];
let n = 0;
for (const [group, level, type, patterns, subjects] of BLOCKS) {
  for (const s of subjects) {
    for (const p of patterns) {
      n += 1;
      const title = p.replace("{s}", s);
      const id = `GX${String(n).padStart(4, "0")}`;
      out.push({
        ex_id: id,
        title,
        category: group,
        group_label: group,
        level,
        type,
        objective: title,
        requirements: REQS,
        acceptance: ACCEPT,
        checklist: CHECK,
        suggested_file: `exercicios/${slug(group)}/${slug(id + "_" + s)}.py`,
        suggested_test: `tests/test_${slug(id + "_" + s)}.py`,
        source: "expansao",
        order_index: 100000 + n,
      });
    }
  }
}

// Variantes "com testes" (objetivo distinto: implementar + testar) para
// aproximadamente dobrar o banco e reforçar a cultura de testes.
const TEST_REQS = [
  "Implemente a solução com função/classe reutilizável e type hints.",
  "Cubra casos normais, de borda e de erro com pytest.",
  "Garanta no mínimo 90% de cobertura no módulo.",
];
const bases = out.slice();
const variantTarget = 545;
for (let i = 0; i < bases.length && i < variantTarget; i++) {
  const b = bases[i];
  n += 1;
  const title = `${b.title.replace(/\.$/, "")} — e cubra com testes pytest (casos de borda).`;
  out.push({
    ...b,
    ex_id: `GV${String(i + 1).padStart(4, "0")}`,
    title,
    objective: title,
    type: "Testes/Qualidade",
    requirements: TEST_REQS,
    suggested_test: b.suggested_test,
    order_index: 200000 + i,
  });
}

writeFileSync(
  join(process.cwd(), "supabase", "expansion_exercises.json"),
  JSON.stringify(out),
);
const byG = {};
for (const e of out) byG[e.group_label] = (byG[e.group_label] || 0) + 1;
console.log(`Novos exercícios: ${out.length}`);
console.table(byG);
