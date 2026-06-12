// Definições das conquistas (badges) da PyTrack. 54+ badges.
import { TRILHAS } from "@/lib/trilhas";

export type BadgeTier = "bronze" | "prata" | "ouro" | "diamante";

export interface BadgeStats {
  xp: number;
  level: string;
  exercises: number;       // exercícios concluídos
  trails: string[];        // ids de trilhas 100%
  areaPct: Record<string, number>; // % concluído por área de conteúdo
  posts: number;
  connections: number;
  certificates: number;
  streak: number;          // dias consecutivos de atividade
}

export interface BadgeDef {
  id: string;
  name: string;
  description: string;
  emoji: string;
  tier: BadgeTier;
  category: "Trilhas" | "Tecnologias" | "Exercícios" | "XP" | "Social" | "Conquistas";
  check: (s: BadgeStats) => boolean;
}

// Áreas de conteúdo → badge de tecnologia (concluir ≥50% da área)
const TECH_AREAS: { area: string; emoji: string }[] = [
  { area: "Fundamentos", emoji: "🐍" },
  { area: "Backend", emoji: "🖧" },
  { area: "Data Science", emoji: "📊" },
  { area: "Machine Learning", emoji: "🤖" },
  { area: "DevOps", emoji: "🐳" },
  { area: "Automação", emoji: "⚙️" },
  { area: "Qualidade", emoji: "✅" },
  { area: "Banco de Dados", emoji: "🗄️" },
  { area: "Engenharia de Software", emoji: "🏗️" },
  { area: "Engenharia de Dados", emoji: "🔀" },
  { area: "IoT", emoji: "📡" },
  { area: "Performance & Async", emoji: "⚡" },
  { area: "Arquitetura", emoji: "📐" },
  { area: "Segurança", emoji: "🔐" },
  { area: "Finanças", emoji: "💹" },
  { area: "Algoritmos", emoji: "🧮" },
  { area: "Jogos", emoji: "🎮" },
  { area: "Desktop", emoji: "🖥️" },
  { area: "Redes", emoji: "🌐" },
  { area: "Matemática", emoji: "🔢" },
  { area: "Persistência", emoji: "💾" },
  { area: "Especializações", emoji: "🎯" },
];

const TRAIL_EMOJI: Record<string, string> = {
  "primeiros-passos": "🌱", "python-developer": "💻", backend: "🖧", "data-analytics": "📊",
  automacao: "⚙️", "desktop-apps": "🖥️", "engenharia-dados": "🔀", "machine-learning": "🤖",
  "devops-cloud": "🐳", arquitetura: "📐", iot: "📡", "cyber-security": "🔐", blockchain: "⛓️",
  bioinformatica: "🧬", "quant-financas": "💹", "construir-llm": "🧠", suprema: "👑",
};

function tierFor(i: number, total: number): BadgeTier {
  const r = i / total;
  return r < 0.25 ? "bronze" : r < 0.55 ? "prata" : r < 0.85 ? "ouro" : "diamante";
}

export const BADGES: BadgeDef[] = [
  // ---- Trilhas (17) ----
  ...TRILHAS.map((t, i) => ({
    id: `trilha-${t.id}`,
    name: `Mestre: ${t.title}`,
    description: `Concluiu 100% da trilha ${t.title}.`,
    emoji: TRAIL_EMOJI[t.id] ?? "🛤️",
    tier: tierFor(i, TRILHAS.length),
    category: "Trilhas" as const,
    check: (s: BadgeStats) => s.trails.includes(t.id),
  })),

  // ---- Tecnologias / Áreas (22) ----
  ...TECH_AREAS.map((a, i) => ({
    id: `tech-${a.area.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    name: `${a.area}`,
    description: `Dominou pelo menos metade dos conteúdos de ${a.area}.`,
    emoji: a.emoji,
    tier: tierFor(i, TECH_AREAS.length),
    category: "Tecnologias" as const,
    check: (s: BadgeStats) => (s.areaPct[a.area] ?? 0) >= 50,
  })),

  // ---- Exercícios (8) ----
  ...[1, 10, 25, 50, 100, 250, 500, 1000].map((n, i, arr) => ({
    id: `ex-${n}`,
    name: n === 1 ? "Primeiro Exercício" : `${n} Exercícios`,
    description: `Resolveu ${n} exercício${n > 1 ? "s" : ""} com correção por IA.`,
    emoji: "✍️",
    tier: tierFor(i, arr.length),
    category: "Exercícios" as const,
    check: (s: BadgeStats) => s.exercises >= n,
  })),

  // ---- XP (7) ----
  ...[100, 500, 1000, 2500, 5000, 10000, 25000].map((n, i, arr) => ({
    id: `xp-${n}`,
    name: `${n >= 1000 ? `${n / 1000}k` : n} XP`,
    description: `Acumulou ${n} pontos de experiência.`,
    emoji: "⭐",
    tier: tierFor(i, arr.length),
    category: "XP" as const,
    check: (s: BadgeStats) => s.xp >= n,
  })),

  // ---- Social (6) ----
  { id: "social-first-post", name: "Primeira Publicação", description: "Publicou no feed da comunidade.", emoji: "📝", tier: "bronze", category: "Social", check: (s) => s.posts >= 1 },
  { id: "social-10-posts", name: "Comunicador", description: "Publicou 10 vezes.", emoji: "📣", tier: "prata", category: "Social", check: (s) => s.posts >= 10 },
  { id: "social-50-posts", name: "Influência Python", description: "Publicou 50 vezes.", emoji: "🔥", tier: "ouro", category: "Social", check: (s) => s.posts >= 50 },
  { id: "social-first-conn", name: "Primeira Conexão", description: "Fez sua primeira conexão.", emoji: "🤝", tier: "bronze", category: "Social", check: (s) => s.connections >= 1 },
  { id: "social-10-conn", name: "Networking", description: "Fez 10 conexões.", emoji: "🌐", tier: "prata", category: "Social", check: (s) => s.connections >= 10 },
  { id: "social-50-conn", name: "Super Conectado", description: "Fez 50 conexões.", emoji: "💫", tier: "ouro", category: "Social", check: (s) => s.connections >= 50 },

  // ---- Conquistas / Certificados (5) ----
  { id: "cert-1", name: "Certificado", description: "Conquistou seu primeiro certificado de trilha.", emoji: "🎓", tier: "prata", category: "Conquistas", check: (s) => s.certificates >= 1 },
  { id: "cert-5", name: "Colecionador", description: "Conquistou 5 certificados.", emoji: "🏅", tier: "ouro", category: "Conquistas", check: (s) => s.certificates >= 5 },
  { id: "cert-10", name: "Lenda PyTrack", description: "Conquistou 10 certificados.", emoji: "👑", tier: "diamante", category: "Conquistas", check: (s) => s.certificates >= 10 },
  { id: "streak-7", name: "Comprometimento", description: "Estudou 7 dias seguidos. Disciplina é tudo!", emoji: "🔥", tier: "ouro", category: "Conquistas", check: (s) => s.streak >= 7 },
  { id: "streak-30", name: "Inabalável", description: "30 dias seguidos de estudo. Lenda!", emoji: "⚡", tier: "diamante", category: "Conquistas", check: (s) => s.streak >= 30 },
  { id: "level-inter", name: "Intermediário", description: "Alcançou o nível intermediário.", emoji: "📈", tier: "prata", category: "Conquistas", check: (s) => ["intermediario", "avancado", "expert"].includes(s.level) },
  { id: "level-avancado", name: "Avançado", description: "Alcançou o nível avançado.", emoji: "🚀", tier: "ouro", category: "Conquistas", check: (s) => ["avancado", "expert"].includes(s.level) },
];

export const TIER_COLOR: Record<BadgeTier, string> = {
  bronze: "#cd7f32", prata: "#9ca3af", ouro: "#d4af37", diamante: "#5eead4",
};
