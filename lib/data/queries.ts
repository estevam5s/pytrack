import { createClient } from "@/lib/supabase/server";
import type {
  Book,
  CareerPath,
  Content,
  Exercise,
  InterviewQuestion,
  Job,
  Material,
  PracticeExercise,
  Progress,
  Project,
  StackItem,
  UdemyCourse,
  UserProfile,
  YoutubeItem,
} from "@/types";

export async function getProfile(): Promise<UserProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("users_profile")
    .select("*")
    .eq("user_id", user.id)
    .single();
  return data as UserProfile | null;
}

export async function getContents(): Promise<Content[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("contents")
    .select("*")
    .order("order_index");
  return (data as Content[]) ?? [];
}

export async function getProgressMap(): Promise<Record<string, Progress>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return {};

  const { data } = await supabase
    .from("progress")
    .select("*")
    .eq("user_id", user.id);

  const map: Record<string, Progress> = {};
  for (const row of (data as Progress[]) ?? []) map[row.content_id] = row;
  return map;
}

export async function getStackItems(): Promise<StackItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("stack_items")
    .select("*")
    .order("name");
  return (data as StackItem[]) ?? [];
}

export async function getUdemyCourses(): Promise<UdemyCourse[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("udemy_courses")
    .select("*")
    .order("created_at");
  return (data as UdemyCourse[]) ?? [];
}

export async function getMaterials(): Promise<Material[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("materials")
    .select("*")
    .order("title");
  return (data as Material[]) ?? [];
}

export async function getBooks(): Promise<Book[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("books").select("*").order("title");
  return (data as Book[]) ?? [];
}

export async function getCareerPaths(): Promise<CareerPath[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("career_paths")
    .select("*")
    .order("created_at");
  return (data as CareerPath[]) ?? [];
}

export async function getExercises(): Promise<Exercise[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("exercises")
    .select("*")
    .order("created_at");
  return (data as Exercise[]) ?? [];
}

export async function getInterviewQuestions(): Promise<InterviewQuestion[]> {
  const supabase = await createClient();
  const PAGE = 1000;
  const all: InterviewQuestion[] = [];
  for (let from = 0; from < 20000; from += PAGE) {
    const { data, error } = await supabase
      .from("interview_questions")
      .select("*")
      .order("order_index")
      .range(from, from + PAGE - 1);
    if (error || !data || data.length === 0) break;
    all.push(...(data as InterviewQuestion[]));
    if (data.length < PAGE) break;
  }
  return all;
}

export async function getPracticeExercises(): Promise<PracticeExercise[]> {
  const supabase = await createClient();
  // PostgREST limita respostas (max-rows, geralmente 1000); paginamos para
  // trazer todos os exercícios.
  const PAGE = 1000;
  const all: PracticeExercise[] = [];
  for (let from = 0; from < 20000; from += PAGE) {
    const { data, error } = await supabase
      .from("practice_exercises")
      .select("*")
      .order("order_index")
      .range(from, from + PAGE - 1);
    if (error || !data || data.length === 0) break;
    all.push(...(data as PracticeExercise[]));
    if (data.length < PAGE) break;
  }
  return all;
}

/** ex_ids concluídos pelo usuário atual (plataforma + bot do Telegram). */
export async function getExerciseCompletions(): Promise<string[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase
    .from("exercise_completions")
    .select("ex_id")
    .eq("user_id", user.id);
  return (data ?? []).map((r) => r.ex_id as string);
}

export async function getYoutubeContent(): Promise<YoutubeItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("youtube_content")
    .select("*")
    .order("created_at", { ascending: false });
  return (data as YoutubeItem[]) ?? [];
}

export async function getJobs(): Promise<Job[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });
  return (data as Job[]) ?? [];
}

export interface SearchItem {
  label: string;
  sub?: string;
  href: string;
  group: string;
  external?: boolean;
}

/** Índice leve para a busca global (⌘K): conteúdos, tecnologias, carreiras... */
export async function getSearchIndex(): Promise<SearchItem[]> {
  const supabase = await createClient();
  const [contents, stack, careers, books, materials, projects] =
    await Promise.all([
      supabase.from("contents").select("title, slug, area").order("order_index"),
      supabase.from("stack_items").select("name, category, documentation_url"),
      supabase.from("career_paths").select("title, area"),
      supabase.from("books").select("title, author"),
      supabase.from("materials").select("title, type, url"),
      supabase.from("projects").select("title, area").limit(400),
    ]);

  const items: SearchItem[] = [];

  for (const c of contents.data ?? [])
    items.push({
      label: c.title,
      sub: c.area,
      href: c.slug ? `/conteudos/${c.slug}` : "/minhas-trilhas",
      group: "Conteúdos",
    });
  for (const s of stack.data ?? [])
    items.push({
      label: s.name,
      sub: s.category,
      href: s.documentation_url ?? "/stack",
      group: "Tecnologias",
      external: !!s.documentation_url,
    });
  for (const c of careers.data ?? [])
    items.push({ label: c.title, sub: c.area, href: "/minha-carreira", group: "Carreiras" });
  for (const b of books.data ?? [])
    items.push({ label: b.title, sub: b.author ?? "Livro", href: "/livros", group: "Livros" });
  for (const m of materials.data ?? [])
    items.push({
      label: m.title,
      sub: m.type,
      href: m.url ?? "/material",
      group: "Materiais",
      external: !!m.url,
    });
  for (const p of projects.data ?? [])
    items.push({ label: p.title, sub: p.area ?? "Projeto", href: "/meus-projetos", group: "Projetos" });

  return items;
}

export async function getProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const PAGE = 1000;
  const all: Project[] = [];
  for (let from = 0; from < 20000; from += PAGE) {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at")
      .range(from, from + PAGE - 1);
    if (error || !data || data.length === 0) break;
    all.push(...(data as Project[]));
    if (data.length < PAGE) break;
  }
  return all;
}

/** Contadores leves (do servidor) para o cálculo de nível/XP global. */
export async function getLevelCounts(): Promise<{
  modules: number;
  books: number;
  courses: number;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { modules: 0, books: 0, courses: 0 };

  const [mods, books, courses] = await Promise.all([
    supabase
      .from("progress")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "concluido"),
    supabase
      .from("books")
      .select("id", { count: "exact", head: true })
      .eq("status", "concluido"),
    supabase
      .from("udemy_courses")
      .select("id", { count: "exact", head: true })
      .eq("status", "concluido"),
  ]);

  return {
    modules: mods.count ?? 0,
    books: books.count ?? 0,
    courses: courses.count ?? 0,
  };
}

export interface DashboardStats {
  total: number;
  started: number;
  completed: number;
  overallPercentage: number;
  hoursStudied: number;
  totalHours: number;
  byArea: { area: string; total: number; completed: number; percentage: number }[];
}

export function computeStats(
  contents: Content[],
  progress: Record<string, Progress>,
): DashboardStats {
  const total = contents.length;
  let started = 0;
  let completed = 0;
  let hoursStudied = 0;
  let totalHours = 0;
  // `units` acumula crédito fracionário: concluído = 1.0, em andamento = % /100.
  // Assim a proficiência reflete também o que está em progresso (antes era ignorado,
  // o que zerava o radar mesmo com várias lições começadas).
  const areaMap: Record<
    string,
    { total: number; completed: number; units: number }
  > = {};

  for (const c of contents) {
    totalHours += Number(c.estimated_hours) || 0;
    const p = progress[c.id];
    const status = p?.status ?? "nao_iniciado";
    areaMap[c.area] ??= { total: 0, completed: 0, units: 0 };
    areaMap[c.area].total += 1;

    const pct = Math.max(0, Math.min(100, Number(p?.progress_percentage) || 0));

    if (status === "em_andamento") started += 1;
    if (status === "concluido") {
      completed += 1;
      hoursStudied += Number(c.estimated_hours) || 0;
      areaMap[c.area].completed += 1;
      areaMap[c.area].units += 1;
    } else if (pct > 0) {
      hoursStudied += ((Number(c.estimated_hours) || 0) * pct) / 100;
      areaMap[c.area].units += pct / 100;
    }
  }

  const byArea = Object.entries(areaMap)
    .map(([area, v]) => ({
      area,
      total: v.total,
      completed: v.completed,
      // proficiência ponderada (conta progresso parcial), limitada a 100
      percentage: v.total
        ? Math.min(100, Math.round((v.units / v.total) * 100))
        : 0,
    }))
    .sort((a, b) => b.percentage - a.percentage);

  return {
    total,
    started,
    completed,
    overallPercentage: total ? Math.round((completed / total) * 100) : 0,
    hoursStudied: Math.round(hoursStudied),
    totalHours: Math.round(totalHours),
    byArea,
  };
}
