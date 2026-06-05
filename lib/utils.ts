import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const LEVEL_LABELS: Record<string, string> = {
  basico: "Básico",
  intermediario: "Intermediário",
  avancado: "Avançado",
  desafio: "Desafio real",
};

export const STATUS_LABELS: Record<string, string> = {
  nao_iniciado: "Não iniciado",
  em_andamento: "Em andamento",
  concluido: "Concluído",
};

export function levelColor(level: string): string {
  switch (level) {
    case "basico":
      return "bg-success/15 text-success border-success/30";
    case "intermediario":
      return "bg-warning/15 text-warning border-warning/30";
    case "avancado":
      return "bg-primary/15 text-primary border-primary/40";
    case "desafio":
      return "bg-danger/15 text-danger border-danger/30";
    default:
      return "bg-muted text-text-secondary border-border";
  }
}

export function statusColor(status: string): string {
  switch (status) {
    case "concluido":
      return "bg-secondary/15 text-secondary border-secondary/30";
    case "em_andamento":
      return "bg-warning/15 text-warning border-warning/30";
    default:
      return "bg-muted text-text-secondary border-border";
  }
}

export function initials(name?: string | null): string {
  if (!name) return "PY";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}
