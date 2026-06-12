// Gerador determinístico de bugs reais do mercado (3200+), focado no
// ecossistema Python + arquitetura + banco de dados. IDs estáveis.

export type BugDifficulty = "facil" | "medio" | "dificil" | "expert";
export type BugCategory = "codigo" | "arquitetura" | "banco";

export interface Bug {
  id: string;
  title: string;
  description: string;
  difficulty: BugDifficulty;
  category: BugCategory;
  tech: string;   // ícone lucide
  xp: number;
}

const XP: Record<BugDifficulty, number> = { facil: 35, medio: 100, dificil: 175, expert: 250 };
export const DIFF_LABEL: Record<BugDifficulty, string> = { facil: "Fácil", medio: "Médio", dificil: "Difícil", expert: "Expert" };
export const CAT_LABEL: Record<BugCategory, string> = { codigo: "Código", arquitetura: "Arquitetura", banco: "Banco de Dados" };

// padrões de bugs reais — {título, descrição, dificuldade, categoria, tech}
const PATTERNS: [string, string, BugDifficulty, BugCategory, string][] = [
  ["Typo em variável causa undefined", "Um módulo processa dados do usuário e registra no console, mas um erro de digitação no nome da variável provoca um NameError em tempo de execução.", "facil", "codigo", "code"],
  ["Mutable default argument", "Uma função usa uma lista como valor padrão de parâmetro; chamadas sucessivas acumulam dados de execuções anteriores.", "medio", "codigo", "code"],
  ["Off-by-one em fatiamento", "Um loop que percorre uma lista ignora o último elemento por um erro de índice no range.", "facil", "codigo", "code"],
  ["Condição de corrida em contador", "Múltiplas threads incrementam um contador compartilhado sem lock, gerando contagem incorreta sob carga.", "expert", "codigo", "workflow"],
  ["Vazamento de memória por referência cíclica", "Objetos mantêm referências mútuas e o coletor não os libera, fazendo o consumo de RAM crescer indefinidamente.", "dificil", "codigo", "cpu"],
  ["N+1 queries no ORM", "Uma listagem itera entidades e acessa relacionamentos lazy, disparando uma query por item e degradando a performance.", "dificil", "banco", "database"],
  ["Deadlock entre transações", "Duas transações adquirem locks em ordem inversa e travam mutuamente o banco.", "expert", "banco", "database"],
  ["Encoding incorreto em leitura de arquivo", "Um CSV é lido sem especificar UTF-8 e quebra ao encontrar acentuação.", "facil", "codigo", "code"],
  ["Conexões não liberadas no pool", "Uma rota abre conexões com o banco e não as fecha em caso de exceção, esgotando o pool.", "dificil", "banco", "database"],
  ["Cache invalidado incorretamente", "Atualizações de dados não invalidam o cache, servindo informação obsoleta aos usuários.", "medio", "arquitetura", "container"],
  ["Timezone naive vs aware", "Datas sem timezone são comparadas com datas com timezone, gerando TypeError ou resultados errados.", "medio", "codigo", "code"],
  ["Float comparado com igualdade", "Cálculos financeiros comparam floats com == e falham por imprecisão de ponto flutuante.", "medio", "codigo", "sigma"],
  ["Injeção de SQL por string format", "Uma query monta SQL concatenando entrada do usuário, abrindo brecha de injeção.", "expert", "banco", "database"],
  ["Falta de índice em coluna de busca", "Consultas filtram por uma coluna sem índice, causando full scan em tabelas grandes.", "dificil", "banco", "database"],
  ["Exceção engolida silenciosamente", "Um try/except amplo captura todas as exceções e ignora, escondendo falhas reais.", "medio", "codigo", "check-check"],
  ["Retry sem backoff causa tempestade", "Um cliente repete requisições imediatamente após falha, sobrecarregando o serviço (retry storm).", "dificil", "arquitetura", "radio"],
  ["Idempotência ausente em webhook", "Webhooks reprocessam o mesmo evento e duplicam registros por falta de chave de idempotência.", "dificil", "arquitetura", "radio"],
  ["Split-brain em cluster", "Eleição de líder mal implementada permite dois líderes simultâneos no cluster.", "expert", "arquitetura", "workflow"],
  ["Esgotamento de pool de conexões", "Relatórios e jobs mantêm conexões abertas em paralelo até esgotar o limite do banco.", "dificil", "banco", "database"],
  ["Reordenação de eventos em fila", "Mensagens sem chave de partição chegam fora de ordem ao consumidor, corrompendo o estado.", "expert", "arquitetura", "flame"],
  ["Commit aceito sem quórum", "Replicação baseada em Raft aceita confirmações sem o quórum mínimo de réplicas.", "expert", "arquitetura", "workflow"],
  ["Vazamento de informação por timing", "A verificação de senha retorna mais rápido ao detectar prefixo incorreto, permitindo ataque de timing.", "expert", "arquitetura", "cpu"],
  ["Plano de execução com full scan", "Uma query com OR em colunas indexadas ignora o índice e faz varredura completa.", "dificil", "banco", "database"],
  ["Deadlock distribuído", "Serviços adquirem locks distribuídos em ordens diferentes e travam mutuamente.", "expert", "arquitetura", "workflow"],
  ["JSON parseado sem validação", "Um payload externo é desserializado e usado direto, quebrando ao faltar um campo.", "facil", "codigo", "code"],
  ["Paginação com offset gigante", "A paginação usa OFFSET alto em tabelas grandes, ficando lenta nas últimas páginas.", "medio", "banco", "database"],
  ["Async sem await", "Uma coroutine é chamada sem await e nunca executa, silenciando o efeito esperado.", "medio", "codigo", "workflow"],
  ["Bloqueio do event loop", "Uma operação síncrona pesada roda no event loop e trava todas as requisições assíncronas.", "dificil", "codigo", "workflow"],
  ["Migração sem rollback", "Uma migração de schema falha no meio e deixa o banco em estado inconsistente.", "dificil", "banco", "database"],
  ["Serialização quebra com Decimal", "A API serializa valores Decimal como string inesperadamente, quebrando o front.", "medio", "codigo", "code"],
  ["Falha ao tratar SIGTERM", "O serviço não trata o sinal de término e perde requisições em andamento no deploy.", "dificil", "arquitetura", "container"],
  ["Memory leak em cache sem TTL", "Um cache em memória cresce sem limite por não ter expiração nem tamanho máximo.", "dificil", "arquitetura", "cpu"],
  ["Hash de senha fraco", "Senhas são salvas com MD5 sem salt, vulneráveis a rainbow tables.", "expert", "arquitetura", "cpu"],
  ["Race em criação de recurso", "Duas requisições simultâneas criam o mesmo recurso por falta de constraint única.", "dificil", "banco", "database"],
  ["Loop infinito em recursão", "Uma função recursiva sem caso base estoura o limite de recursão.", "facil", "codigo", "code"],
  ["Vazamento de file descriptors", "Arquivos abertos em loop sem with/close esgotam os descritores do sistema.", "medio", "codigo", "cpu"],
  ["Concorrência otimista ausente", "Atualizações simultâneas sobrescrevem dados por falta de versionamento (lost update).", "dificil", "banco", "database"],
  ["Configuração sensível no código", "Chaves de API ficam hardcoded no repositório, expostas no histórico do Git.", "medio", "arquitetura", "git-branch"],
  ["Falta de rate limiting", "Um endpoint público não limita requisições e é derrubado por abuso.", "medio", "arquitetura", "radio"],
  ["CORS mal configurado", "A API libera CORS para qualquer origem, permitindo requisições maliciosas.", "medio", "arquitetura", "radio"],
  ["Falha ao validar tamanho de upload", "Uploads sem limite de tamanho permitem esgotar o disco do servidor.", "medio", "arquitetura", "container"],
  ["Transação longa segura locks", "Uma transação demorada mantém locks e bloqueia outras operações por muito tempo.", "dificil", "banco", "database"],
  ["Falta de tratamento de timeout", "Chamadas HTTP sem timeout penduram o worker indefinidamente quando o serviço externo cai.", "medio", "arquitetura", "radio"],
  ["Serialização não determinística", "A ordem de chaves em dict serializado varia e quebra assinaturas/caches baseados em hash.", "dificil", "codigo", "code"],
  ["Índice não usado por cast implícito", "Um filtro compara coluna numérica com string, invalidando o uso do índice.", "dificil", "banco", "database"],
  ["Estado global mutável", "Variáveis globais compartilhadas entre requisições vazam dados entre usuários.", "expert", "arquitetura", "cpu"],
  ["Falha em particionamento de Kafka", "Producers usam chave nula e quebram a ordenação por partição no Kafka.", "expert", "arquitetura", "flame"],
  ["Backpressure ignorado", "O consumidor não aplica backpressure e estoura a memória sob pico de mensagens.", "expert", "arquitetura", "flame"],
  ["Falha em circuit breaker", "Sem circuit breaker, falhas em cascata derrubam toda a malha de serviços.", "expert", "arquitetura", "workflow"],
  ["Decimal vs float no banco", "Valores monetários salvos como float perdem precisão ao longo do tempo.", "dificil", "banco", "database"],
  ["Falta de idempotência em pagamento", "Reenvios de cobrança duplicam transações por ausência de chave idempotente.", "expert", "arquitetura", "radio"],
  ["Sessão sem expiração", "Tokens de sessão nunca expiram, ampliando a janela de ataque em vazamentos.", "medio", "arquitetura", "cpu"],
  ["Falha em locale numérico", "Parsing de números ignora o locale e troca vírgula por ponto, corrompendo valores.", "facil", "codigo", "code"],
  ["Pool assíncrono mal dimensionado", "O pool async é menor que a concorrência real e cria fila de espera invisível.", "dificil", "arquitetura", "workflow"],
  ["Falha em retry idempotente", "Retentativas de uma operação não idempotente duplicam efeitos colaterais.", "dificil", "arquitetura", "radio"],
  ["Falta de validação de schema", "Mensagens sem validação de schema quebram o consumidor ao mudar o formato.", "medio", "arquitetura", "flame"],
  ["Memory bloat em DataFrame", "Um DataFrame carrega a tabela inteira em memória em vez de processar em chunks.", "dificil", "codigo", "sigma"],
  ["Vazamento de exceção assíncrona", "Exceções em tasks async não aguardadas somem silenciosamente.", "dificil", "codigo", "workflow"],
  ["Falta de unique constraint", "Registros duplicados surgem por ausência de restrição única no banco.", "medio", "banco", "database"],
  ["Falha em cache stampede", "Expiração simultânea de cache dispara recomputação em massa (stampede).", "expert", "arquitetura", "container"],
  ["Serialização circular em log", "Logar um objeto com referência cíclica trava o serializador.", "facil", "codigo", "code"],
  ["Falta de health check", "O orquestrador não detecta um container travado por ausência de health check.", "medio", "arquitetura", "container"],
  ["Falha em migração de dados grande", "Uma migração trava a tabela inteira por não rodar em lotes.", "dificil", "banco", "database"],
  ["Senha em log de debug", "Logs de debug imprimem o corpo da requisição com a senha em texto puro.", "medio", "arquitetura", "cpu"],
];

// contextos para gerar variações (mantém os bugs únicos e realistas)
const CONTEXTS = [
  "no serviço de pagamentos", "no módulo de autenticação", "no pipeline de dados", "na API de pedidos",
  "no worker de e-mails", "no serviço de notificações", "na importação de planilhas", "no gateway de checkout",
  "no microserviço de estoque", "no consumidor de eventos", "na geração de relatórios", "no cache de sessões",
  "no scraper de preços", "na fila de tarefas", "no serviço de busca", "no agendador de jobs",
  "no upload de mídia", "na sincronização com o ERP", "no webhook do Stripe", "no exportador de métricas",
  "no serviço de recomendação", "na ingestão de logs", "no processamento de imagens", "no chat em tempo real",
  "na API pública", "no painel administrativo", "no serviço de faturamento", "no conector de banco",
  "na rotina de backup", "no pipeline de ML", "no serviço de geolocalização", "no integrador de marketplaces",
  "no módulo de carrinho", "na API de usuários", "no serviço de cupons", "no orquestrador de deploys",
  "no rate limiter", "na camada de cache", "no broker de mensagens", "no balanceador de carga",
  "no serviço de feature flags", "na auditoria de acessos", "no exportador de PDF", "no conversor de moedas",
  "no agregador de pedidos", "no serviço de SMS", "na fila de prioridade", "no índice de produtos",
  "no replicador de réplicas", "no serviço de tokens", "no validador de documentos", "no painel de BI",
];

let CACHE: Bug[] | null = null;

export function getAllBugs(): Bug[] {
  if (CACHE) return CACHE;
  const bugs: Bug[] = [];
  let n = 1;
  for (const ctx of CONTEXTS) {
    for (const [title, desc, diff, cat, tech] of PATTERNS) {
      bugs.push({
        id: `bug-${n}`,
        title: `${title} ${ctx}`,
        description: desc,
        difficulty: diff,
        category: cat,
        tech,
        xp: XP[diff],
      });
      n++;
    }
  }
  CACHE = bugs;
  return bugs; // 52 contextos × 64 padrões = 3328 bugs
}

export function bugStats() {
  const all = getAllBugs();
  return { total: all.length };
}
