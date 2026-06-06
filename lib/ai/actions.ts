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

// ============================== Cursos (Udemy) ==============================
export interface CourseAnalysis {
  summary: string;
  stack: string[];
  learnings: string[];
  prerequisites: string[];
  audience: string;
  difficulty: number; // 0-100
  career_fit: string;
  tips: string[];
  model?: string;
  error?: string;
}

export async function analyzeUdemyCourse(input: {
  title: string;
  instructor?: string | null;
  category?: string | null;
  level?: string | null;
  duration?: string | null;
  description?: string | null;
}): Promise<CourseAnalysis> {
  const empty: CourseAnalysis = {
    summary: "",
    stack: [],
    learnings: [],
    prerequisites: [],
    audience: "",
    difficulty: 0,
    career_fit: "",
    tips: [],
  };

  const res = await chatJson<Partial<CourseAnalysis>>(
    [
      {
        role: "system",
        content:
          "Você é um mentor sênior do ecossistema Python que avalia cursos para estudantes. " +
          "Com base nos metadados do curso, produza uma análise útil e honesta. " +
          "Responda SOMENTE com JSON válido com as chaves: " +
          "summary (parágrafo em pt-BR sobre o que é o curso e seu valor), " +
          "stack (array de tecnologias/ferramentas prováveis abordadas), " +
          "learnings (array do que o aluno vai aprender), " +
          "prerequisites (array de pré-requisitos), " +
          "audience (para quem é o curso), " +
          "difficulty (inteiro 0-100), " +
          "career_fit (como o curso ajuda na carreira Python), " +
          "tips (array de dicas para aproveitar melhor). Não invente fatos específicos não inferíveis.",
      },
      {
        role: "user",
        content:
          `Analise este curso:\n` +
          `- Título: ${input.title}\n` +
          (input.instructor ? `- Instrutor: ${input.instructor}\n` : "") +
          (input.category ? `- Categoria: ${input.category}\n` : "") +
          (input.level ? `- Nível: ${input.level}\n` : "") +
          (input.duration ? `- Duração: ${input.duration}\n` : "") +
          (input.description ? `- Descrição: ${input.description}\n` : "") +
          `\nFoque no contexto de aprendizado de Python.`,
      },
    ],
    { maxTokens: 1100, temperature: 0.4 },
  );

  const p = res.data;
  if (!p) return { ...empty, error: res.error ?? "Não consegui analisar o curso.", model: res.model };
  const arr = (v: unknown) => (Array.isArray(v) ? v.map(String) : []);
  return {
    summary: String(p.summary ?? ""),
    stack: arr(p.stack),
    learnings: arr(p.learnings),
    prerequisites: arr(p.prerequisites),
    audience: String(p.audience ?? ""),
    difficulty: Math.max(0, Math.min(100, Number(p.difficulty ?? 0))),
    career_fit: String(p.career_fit ?? ""),
    tips: arr(p.tips),
    model: res.model,
  };
}

export interface CollectionAnalysis {
  summary: string;
  coverage: { area: string; level: string }[];
  strengths: string[];
  gaps: string[];
  recommendations: string[];
  suggested_order: string[];
  model?: string;
  error?: string;
}

export async function analyzeUdemyCollection(input: {
  courses: { title: string; category?: string | null; level?: string | null; status?: string | null }[];
}): Promise<CollectionAnalysis> {
  const empty: CollectionAnalysis = {
    summary: "",
    coverage: [],
    strengths: [],
    gaps: [],
    recommendations: [],
    suggested_order: [],
  };
  if (!input.courses.length) {
    return { ...empty, error: "Adicione cursos para analisar a trilha." };
  }

  const list = input.courses
    .map(
      (c, i) =>
        `${i + 1}. ${c.title}${c.category ? ` [${c.category}]` : ""}${c.level ? ` (${c.level})` : ""}${c.status ? ` - ${c.status}` : ""}`,
    )
    .join("\n");

  const res = await chatJson<Partial<CollectionAnalysis>>(
    [
      {
        role: "system",
        content:
          "Você é um mentor de carreira Python que avalia a TRILHA de cursos de um estudante como um todo. " +
          "Avalie cobertura do ecossistema, equilíbrio, lacunas e ordem ideal de estudo. " +
          "Responda SOMENTE com JSON válido com as chaves: " +
          "summary (parágrafo em pt-BR), " +
          "coverage (array de objetos {area, level} onde level é 'forte'|'media'|'fraca'), " +
          "strengths (array), gaps (array de áreas pouco cobertas), " +
          "recommendations (array de cursos/temas a adicionar), " +
          "suggested_order (array com a ordem ideal de estudo dos cursos atuais). Baseie-se na lista.",
      },
      {
        role: "user",
        content: `Cursos do estudante (Udemy):\n${list}\n\nAvalie a trilha de cursos no contexto do ecossistema Python.`,
      },
    ],
    { maxTokens: 1300, temperature: 0.4 },
  );

  const p = res.data;
  if (!p) return { ...empty, error: res.error ?? "Não consegui analisar a trilha.", model: res.model };
  const arr = (v: unknown) => (Array.isArray(v) ? v.map(String) : []);
  const cov = Array.isArray(p.coverage)
    ? p.coverage
        .map((c: unknown) => {
          const o = c as { area?: unknown; level?: unknown };
          return { area: String(o.area ?? ""), level: String(o.level ?? "media") };
        })
        .filter((c) => c.area)
    : [];
  return {
    summary: String(p.summary ?? ""),
    coverage: cov,
    strengths: arr(p.strengths),
    gaps: arr(p.gaps),
    recommendations: arr(p.recommendations),
    suggested_order: arr(p.suggested_order),
    model: res.model,
  };
}
