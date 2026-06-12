// Gerador determinístico de desafios de programação Python (2000+).
// Do básico ao especialista, com tecnologias do ecossistema Python.

export type ChDifficulty = "facil" | "medio" | "dificil" | "expert";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: ChDifficulty;
  topic: string;
  techs: string[]; // ícones lucide do ecossistema Python
  xp: number;
}

const XP: Record<ChDifficulty, number> = { facil: 30, medio: 60, dificil: 120, expert: 200 };
export const CH_DIFF_LABEL: Record<ChDifficulty, string> = { facil: "Fácil", medio: "Médio", dificil: "Difícil", expert: "Expert" };

// padrões de desafio: [título, descrição, dificuldade, tópico, techs]
const PATTERNS: [string, string, ChDifficulty, string, string[]][] = [
  // Strings & básico
  ["Contar Vogais em uma String", "Crie uma função que conta quantas vogais existem em uma string.", "facil", "Strings", ["code"]],
  ["Inverter uma String", "Implemente a inversão de uma string sem usar slicing reverso.", "facil", "Strings", ["code"]],
  ["Verificar Palíndromo", "Determine se uma palavra é um palíndromo, ignorando maiúsculas e espaços.", "facil", "Strings", ["code"]],
  ["Remover Espaços de uma String", "Remova todos os espaços em branco de uma string preservando o conteúdo.", "facil", "Strings", ["code"]],
  ["Contar Dígitos em uma String", "Conte quantos caracteres numéricos existem em um texto.", "facil", "Strings", ["code"]],
  ["Compressão Avançada de String", "Implemente compressão RLE (aaa→a3) retornando a menor das duas formas.", "dificil", "Strings", ["code"]],
  ["Anagramas Agrupados", "Agrupe uma lista de palavras pelos seus anagramas.", "medio", "Strings", ["code"]],
  // Arrays
  ["Encontrar Elemento Mais Frequente", "Retorne o elemento que mais aparece em uma lista.", "medio", "Arrays", ["code"]],
  ["Rotacionar Array Para Direita", "Rotacione os elementos de um array k posições para a direita in-place.", "medio", "Arrays", ["code"]],
  ["Encontrar Índice de Soma Igual", "Ache o índice onde a soma à esquerda iguala a soma à direita.", "medio", "Arrays", ["code"]],
  ["Merge de K Arrays Ordenados", "Combine k arrays ordenados em um único array ordenado de forma eficiente.", "dificil", "Arrays", ["code", "sigma"]],
  ["Dois Números que Somam Alvo", "Encontre dois índices cujos valores somam um alvo (two sum).", "facil", "Arrays", ["code"]],
  ["Subarray de Soma Máxima", "Implemente Kadane para o subarray contíguo de soma máxima.", "medio", "Arrays", ["code"]],
  ["Janela Deslizante Máxima", "Encontre o máximo de cada janela de tamanho k.", "dificil", "Arrays", ["code"]],
  // Estruturas de dados
  ["Detecção de Ciclo em Lista Ligada", "Determine se uma lista ligada possui ciclo usando dois ponteiros.", "dificil", "Estruturas", ["code"]],
  ["Implementar uma Pilha com Min", "Pilha que retorna o mínimo em O(1).", "medio", "Estruturas", ["code"]],
  ["Fila com Duas Pilhas", "Implemente uma fila usando duas pilhas.", "medio", "Estruturas", ["code"]],
  ["LRU Cache", "Implemente um cache LRU com get/put em O(1).", "dificil", "Estruturas", ["code", "container"]],
  ["Validar Árvore de Busca Binária", "Verifique se uma árvore binária é uma BST válida.", "dificil", "Estruturas", ["code"]],
  // Algoritmos
  ["Ordenação Topológica de Dependências", "Ordene tarefas com dependências (DAG) ou detecte ciclo.", "dificil", "Algoritmos", ["code", "workflow"]],
  ["Avaliação de Expressões Matemáticas", "Avalie expressões com precedência e parênteses.", "dificil", "Algoritmos", ["code", "sigma"]],
  ["Busca Binária", "Implemente busca binária em um array ordenado.", "facil", "Algoritmos", ["code"]],
  ["Maior Subsequência Comum", "Calcule a LCS entre duas strings (programação dinâmica).", "expert", "Algoritmos", ["code", "sigma"]],
  ["Caminho Mínimo (Dijkstra)", "Encontre o caminho mínimo em um grafo ponderado.", "expert", "Algoritmos", ["code"]],
  ["Mochila 0/1", "Resolva o problema da mochila com programação dinâmica.", "expert", "Algoritmos", ["sigma"]],
  // Dados / Pandas
  ["Agrupar e Agregar com Pandas", "Agrupe um DataFrame por categoria e calcule a média de vendas.", "medio", "Data Science", ["table", "sigma"]],
  ["Limpeza de Dados Faltantes", "Trate valores nulos e duplicados em um dataset.", "medio", "Data Science", ["table"]],
  ["Pivot Table de Vendas", "Construa uma tabela dinâmica de vendas por mês e região.", "dificil", "Data Science", ["table", "bar-chart-3"]],
  ["Detecção de Outliers (IQR)", "Identifique outliers usando o intervalo interquartil.", "dificil", "Data Science", ["sigma", "line-chart"]],
  ["Merge de DataFrames", "Junte dois DataFrames por chave com diferentes estratégias de join.", "medio", "Data Science", ["table", "database"]],
  // Async
  ["Requisições Concorrentes com asyncio", "Busque N URLs em paralelo respeitando um limite de concorrência.", "dificil", "Async", ["workflow"]],
  ["Produtor-Consumidor com Queue", "Implemente produtor/consumidor com asyncio.Queue.", "dificil", "Async", ["workflow"]],
  ["Timeout e Retry Assíncrono", "Adicione timeout e retry com backoff a uma chamada async.", "dificil", "Async", ["workflow", "radio"]],
  // Web/APIs
  ["Endpoint de CRUD com FastAPI", "Implemente um CRUD básico com validação Pydantic.", "medio", "Web/APIs", ["zap"]],
  ["Paginação de API", "Implemente paginação eficiente por cursor.", "dificil", "Web/APIs", ["zap", "database"]],
  ["Autenticação JWT", "Implemente geração e validação de tokens JWT.", "dificil", "Web/APIs", ["zap", "cpu"]],
  ["Rate Limiter de Requisições", "Implemente um rate limiter token bucket.", "dificil", "Web/APIs", ["zap", "radio"]],
  // Banco
  ["Consulta com JOIN e Agregação", "Escreva uma query que junta pedidos e clientes e agrega por mês.", "medio", "Banco de Dados", ["database"]],
  ["Otimizar Query Lenta", "Adicione índices e reescreva uma query para evitar full scan.", "dificil", "Banco de Dados", ["database"]],
  ["Migração com Alembic", "Crie uma migração que adiciona coluna com default sem travar.", "dificil", "Banco de Dados", ["database"]],
  // Automação
  ["Web Scraping de Tabela", "Extraia uma tabela HTML e salve em CSV.", "medio", "Automação", ["code"]],
  ["Bot de Automação de Planilha", "Automatize a consolidação de várias planilhas.", "medio", "Automação", ["table"]],
  ["CLI com Typer", "Crie uma CLI com subcomandos e opções tipadas.", "medio", "Automação", ["code"]],
  // ML
  ["Regressão Linear do Zero", "Implemente regressão linear com gradiente descendente.", "expert", "Machine Learning", ["sigma", "line-chart"]],
  ["Classificador KNN", "Implemente o algoritmo K-Nearest Neighbors.", "dificil", "Machine Learning", ["sigma"]],
  ["Pipeline de Pré-processamento", "Monte um pipeline scikit-learn com normalização e encoding.", "dificil", "Machine Learning", ["sigma", "workflow"]],
  // DevOps
  ["Dockerfile Otimizado", "Escreva um Dockerfile multi-stage para uma app Python.", "medio", "DevOps", ["container"]],
  ["Health Check e Graceful Shutdown", "Implemente health check e desligamento gracioso.", "dificil", "DevOps", ["container", "radio"]],
  // Matemática
  ["Crivo de Eratóstenes", "Liste todos os primos até N de forma eficiente.", "medio", "Matemática", ["sigma"]],
  ["Fibonacci com Memoização", "Calcule Fibonacci com memoização e iterativo.", "facil", "Matemática", ["sigma"]],
  ["MDC e MMC", "Implemente o cálculo de MDC (Euclides) e MMC.", "facil", "Matemática", ["sigma"]],
];

// variações que tornam cada desafio único e progressivo
const VARIANTS = [
  "", "(otimizado em tempo)", "(otimizado em memória)", "(versão recursiva)", "(versão iterativa)",
  "(com testes)", "(entrada gigante)", "(streaming)", "(com restrições)", "(caso geral)",
  "(unicode)", "(tempo real)", "(distribuído)", "(thread-safe)", "(imutável)",
  "(funcional)", "(generators)", "(in-place)", "(O(n))", "(O(log n))",
  "(múltiplos casos)", "(edge cases)", "(grande escala)", "(low-level)", "(idiomático)",
  "(com cache)", "(tolerante a falhas)", "(paralelo)", "(com type hints)", "(zero dependências)",
  "(produção)", "(benchmark)", "(refatorado)", "(robusto)", "(seguro)",
  "(performático)", "(elegante)", "(documentado)", "(validado)", "(escalável)",
];

let CACHE: Challenge[] | null = null;

export function getAllChallenges(): Challenge[] {
  if (CACHE) return CACHE;
  const out: Challenge[] = [];
  let n = 1;
  for (const v of VARIANTS) {
    for (const [title, desc, diff, topic, techs] of PATTERNS) {
      out.push({
        id: `ch-${n}`,
        title: v ? `${title} ${v}` : title,
        description: desc,
        difficulty: diff,
        topic,
        techs,
        xp: XP[diff],
      });
      n++;
    }
  }
  CACHE = out;
  return out; // 40 variantes × 51 padrões = 2040 desafios
}
