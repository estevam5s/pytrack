export interface ActivityCounts {
  modules: number;
  lessons: number;
  exercises: number;
  questions: number;
  books: number;
  courses: number;
}

export const XP_WEIGHTS = {
  modules: 50,
  lessons: 8,
  exercises: 5,
  questions: 3,
  books: 40,
  courses: 60,
};

export interface LevelTier {
  name: string;
  min: number;
  emoji: string;
}

export const LEVEL_TIERS: LevelTier[] = [
  { name: "Iniciante", min: 0, emoji: "🌱" },
  { name: "Explorador", min: 250, emoji: "🧭" },
  { name: "Intermediário", min: 700, emoji: "⚙️" },
  { name: "Praticante", min: 1600, emoji: "🚀" },
  { name: "Avançado", min: 3500, emoji: "🔥" },
  { name: "Especialista", min: 7000, emoji: "🐍" },
];

export function computeXp(c: ActivityCounts): number {
  return (
    c.modules * XP_WEIGHTS.modules +
    c.lessons * XP_WEIGHTS.lessons +
    c.exercises * XP_WEIGHTS.exercises +
    c.questions * XP_WEIGHTS.questions +
    c.books * XP_WEIGHTS.books +
    c.courses * XP_WEIGHTS.courses
  );
}

export interface LevelInfo {
  tier: LevelTier;
  next: LevelTier | null;
  index: number;
  xp: number;
  intoTier: number;
  tierSpan: number;
  progressToNext: number; // 0-100
}

export function levelFromXp(xp: number): LevelInfo {
  let index = 0;
  for (let i = 0; i < LEVEL_TIERS.length; i++) {
    if (xp >= LEVEL_TIERS[i].min) index = i;
  }
  const tier = LEVEL_TIERS[index];
  const next = LEVEL_TIERS[index + 1] ?? null;
  const intoTier = xp - tier.min;
  const tierSpan = next ? next.min - tier.min : 1;
  const progressToNext = next
    ? Math.min(100, Math.round((intoTier / tierSpan) * 100))
    : 100;
  return { tier, next, index, xp, intoTier, tierSpan, progressToNext };
}

/** Mapeia o nível conquistado para o enum learning_level (declarado). */
export function levelToLearning(
  index: number,
): "basico" | "intermediario" | "avancado" {
  if (index >= 4) return "avancado";
  if (index >= 2) return "intermediario";
  return "basico";
}
