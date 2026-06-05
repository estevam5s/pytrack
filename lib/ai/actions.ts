"use server";

import { chatJson } from "./openrouter";

// ============================== Exercícios ==============================
export interface ExerciseAnalysis {
  score: number;
  summary: string;
  strengths: string[];
  issues: string[];
  suggestions: string[];
  complexity: string;
  better_solution: string;
  model?: string;
  error?: string;
}

export async function analyzeExercise(input: {
  title: string;
  objective: string;
  requirements: string[];
  userCode: string;
}): Promise<ExerciseAnalysis> {
  const empty: ExerciseAnalysis = {
    score: 0,
    summary: "",
    strengths: [],
    issues: [],
    suggestions: [],
    complexity: "",
    better_solution: "",
  };

  if (!input.userCode.trim()) {
    return { ...empty, error: "Escreva seu código antes de analisar." };
  }

  const res = await chatJson<Partial<ExerciseAnalysis>>(
    [
      {
        role: "system",
        content:
          "Você é um revisor sênior de código Python. Avalie a solução do aluno para o exercício proposto. " +
          "Responda SOMENTE com um objeto JSON válido (sem texto fora do JSON, sem markdown) com as chaves EXATAS: " +
          "score (inteiro 0-10), summary (string curta em pt-BR), strengths (array de strings), " +
          "issues (array de strings com problemas/bugs/anti-padrões), suggestions (array de melhorias), " +
          "complexity (string, ex.: 'Tempo O(n), Espaco O(1)'), " +
          "better_solution (string com uma solução Python idiomática, tipada e comentada). " +
          "Escape corretamente aspas e quebras de linha dentro das strings. Seja específico, técnico e honesto.",
      },
      {
        role: "user",
        content:
          `Exercício: ${input.title}\n` +
          `Objetivo: ${input.objective}\n` +
          `Requisitos: ${input.requirements.join("; ")}\n\n` +
          `Código do aluno:\n\`\`\`python\n${input.userCode.slice(0, 6000)}\n\`\`\``,
      },
    ],
    { maxTokens: 1100, temperature: 0.2 },
  );

  const parsed = res.data;
  if (!parsed) {
    return {
      ...empty,
      error: res.error ?? "Não consegui interpretar a resposta da IA. Tente novamente.",
      model: res.model,
    };
  }

  return {
    score: Number(parsed.score ?? 0),
    summary: String(parsed.summary ?? ""),
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths.map(String) : [],
    issues: Array.isArray(parsed.issues) ? parsed.issues.map(String) : [],
    suggestions: Array.isArray(parsed.suggestions)
      ? parsed.suggestions.map(String)
      : [],
    complexity: String(parsed.complexity ?? ""),
    better_solution: String(parsed.better_solution ?? ""),
    model: res.model,
  };
}

// ============================ Consultor de carreira ====================
export interface CareerInput {
  levelName: string;
  tierIndex: number;
  xp: number;
  overallPct: number;
  hours: number;
  modulesCompleted: number;
  modulesTotal: number;
  lessons: number;
  exercises: number;
  questions: number;
  books: number;
  courses: number;
  byArea: { area: string; percentage: number }[];
  goal?: string;
}

export interface CareerAssessment {
  verdict: "apto" | "quase" | "em_formacao";
  readiness: number;
  title: string;
  summary: string;
  strengths: string[];
  gaps: string[];
  recommendations: string[];
  roadmap: string[];
  roles: string[];
  model?: string;
  error?: string;
}

export async function analyzeCareer(
  input: CareerInput,
): Promise<CareerAssessment> {
  const empty: CareerAssessment = {
    verdict: "em_formacao",
    readiness: 0,
    title: "",
    summary: "",
    strengths: [],
    gaps: [],
    recommendations: [],
    roadmap: [],
    roles: [],
  };

  const areas = input.byArea
    .map((a) => `${a.area}: ${a.percentage}%`)
    .join(", ");

  const res = await chatJson<Partial<CareerAssessment>>(
    [
      {
        role: "system",
        content:
          "Você é um consultor de carreira sênior em TI, especialista no ecossistema Python e em contratações. " +
          "Analise os dados de evolução do estudante e avalie, de forma honesta, fundamentada e motivadora, " +
          "se ele está apto a atuar profissionalmente com Python. " +
          "Responda SOMENTE com JSON válido com as chaves: " +
          "verdict ('apto' | 'quase' | 'em_formacao'), readiness (inteiro 0-100), " +
          "title (o cargo mais adequado ao nível atual, ex.: 'Python Developer Júnior'), " +
          "summary (parágrafo em pt-BR), strengths (array), gaps (array de lacunas a cobrir), " +
          "recommendations (array de ações concretas), roadmap (array ordenado de próximos passos), " +
          "roles (array de cargos-alvo realistas). Baseie-se nos dados; não invente números.",
      },
      {
        role: "user",
        content:
          `Perfil de evolução do estudante na plataforma PyTrack:\n` +
          `- Nível atual (gamificado): ${input.levelName} (tier ${input.tierIndex + 1}/6), ${input.xp} XP\n` +
          `- Conclusão geral das trilhas: ${input.overallPct}% (${input.modulesCompleted}/${input.modulesTotal} módulos)\n` +
          `- Horas estimadas estudadas: ${input.hours}h\n` +
          `- Lições lidas: ${input.lessons}\n` +
          `- Exercícios práticos concluídos: ${input.exercises}\n` +
          `- Perguntas de entrevista estudadas: ${input.questions}\n` +
          `- Livros lidos: ${input.books} | Cursos concluídos: ${input.courses}\n` +
          `- Domínio por área: ${areas || "sem dados"}\n` +
          (input.goal ? `- Objetivo declarado: ${input.goal}\n` : "") +
          `\nAvalie a prontidão para o mercado de trabalho em Python.`,
      },
    ],
    { maxTokens: 1300, temperature: 0.35 },
  );

  const p = res.data;
  if (!p) {
    return {
      ...empty,
      error: res.error ?? "Não consegui interpretar a resposta da IA. Tente novamente.",
      model: res.model,
    };
  }

  const verdict =
    p.verdict === "apto" || p.verdict === "quase" ? p.verdict : "em_formacao";
  const arr = (v: unknown) => (Array.isArray(v) ? v.map(String) : []);
  return {
    verdict,
    readiness: Math.max(0, Math.min(100, Number(p.readiness ?? 0))),
    title: String(p.title ?? ""),
    summary: String(p.summary ?? ""),
    strengths: arr(p.strengths),
    gaps: arr(p.gaps),
    recommendations: arr(p.recommendations),
    roadmap: arr(p.roadmap),
    roles: arr(p.roles),
    model: res.model,
  };
}
