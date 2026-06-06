import {
  Award,
  Boxes,
  BrainCircuit,
  Cpu,
  Database,
  GraduationCap,
  Rocket,
  Server,
  Sprout,
  type LucideIcon,
} from "lucide-react";
import {
  Bookmark,
  Briefcase,
  Code2,
  FileText,
  FolderGit2,
  HelpCircle,
  Layers,
  MessageSquare,
  Newspaper,
  CalendarDays,
  Trophy,
  type LucideIcon as LI,
} from "lucide-react";
import type { CommunityPostCategory } from "@/types/community";

/* ---------------- Categorias ---------------- */
export interface CategoryDef {
  value: CommunityPostCategory;
  label: string;
  icon: LI;
  color: string; // classes para badge
}

export const CATEGORIES: CategoryDef[] = [
  { value: "duvida", label: "Dúvida", icon: HelpCircle, color: "border-blue/30 bg-blue/10 text-blue" },
  { value: "exercicio", label: "Exercício", icon: Code2, color: "border-primary/30 bg-primary/10 text-primary-light" },
  { value: "projeto", label: "Projeto", icon: FolderGit2, color: "border-green/30 bg-green/10 text-green" },
  { value: "vaga", label: "Vaga", icon: Briefcase, color: "border-secondary/30 bg-secondary/10 text-secondary" },
  { value: "material", label: "Material", icon: FileText, color: "border-magenta/30 bg-magenta/10 text-magenta" },
  { value: "conquista", label: "Conquista", icon: Trophy, color: "border-warning/30 bg-warning/10 text-warning" },
  { value: "discussao", label: "Discussão", icon: MessageSquare, color: "border-border bg-surface-2 text-text-secondary" },
  { value: "artigo", label: "Artigo", icon: Newspaper, color: "border-blue/30 bg-blue/10 text-blue" },
  { value: "evento", label: "Evento", icon: CalendarDays, color: "border-primary/30 bg-primary/10 text-primary-light" },
];

export const CATEGORY_MAP: Record<string, CategoryDef> = Object.fromEntries(
  CATEGORIES.map((c) => [c.value, c]),
);

/* ---------------- Filtros da sidebar ---------------- */
export const FEED_FILTERS = [
  { key: "feed", label: "Feed geral", icon: Layers },
  { key: "duvida", label: "Dúvidas", icon: HelpCircle },
  { key: "exercicio", label: "Exercícios", icon: Code2 },
  { key: "projeto", label: "Projetos", icon: FolderGit2 },
  { key: "vaga", label: "Vagas", icon: Briefcase },
  { key: "material", label: "Materiais", icon: FileText },
  { key: "conquista", label: "Conquistas", icon: Trophy },
  { key: "discussao", label: "Discussões", icon: MessageSquare },
  { key: "salvos", label: "Salvos", icon: Bookmark },
  { key: "meus", label: "Meus posts", icon: Newspaper },
] as const;

export const PYTHON_AREAS = [
  "Backend",
  "Dados",
  "IoT",
  "Automação",
  "Engenharia de Dados",
  "Engenharia de Software",
];

export const POPULAR_TAGS = [
  "python",
  "fastapi",
  "django",
  "pandas",
  "numpy",
  "pytest",
  "docker",
  "sql",
  "airflow",
  "machine-learning",
  "iot",
  "automação",
];

/* ---------------- Níveis ---------------- */
export interface LevelDef {
  name: string;
  min: number;
  icon: LucideIcon;
  color: string;
}

export const COMMUNITY_LEVELS: LevelDef[] = [
  { name: "Iniciante", min: 0, icon: Sprout, color: "text-green" },
  { name: "Explorador Python", min: 50, icon: Rocket, color: "text-blue" },
  { name: "Python Developer", min: 150, icon: Code2, color: "text-primary-light" },
  { name: "Data Apprentice", min: 350, icon: GraduationCap, color: "text-blue" },
  { name: "Backend Builder", min: 700, icon: Server, color: "text-primary-light" },
  { name: "IoT Maker", min: 1200, icon: Cpu, color: "text-green" },
  { name: "Data Engineer", min: 2000, icon: Database, color: "text-magenta" },
  { name: "Software Engineer", min: 3200, icon: Boxes, color: "text-primary-light" },
  { name: "Mentor Python", min: 5000, icon: Award, color: "text-warning" },
];

export function levelDef(name: string): LevelDef {
  return (
    COMMUNITY_LEVELS.find((l) => l.name === name) ?? COMMUNITY_LEVELS[0]
  );
}

export function levelFromXp(xp: number): LevelDef {
  let def = COMMUNITY_LEVELS[0];
  for (const l of COMMUNITY_LEVELS) if (xp >= l.min) def = l;
  return def;
}

export function nextLevel(xp: number): LevelDef | null {
  return COMMUNITY_LEVELS.find((l) => l.min > xp) ?? null;
}
