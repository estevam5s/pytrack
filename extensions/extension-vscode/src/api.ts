import * as vscode from "vscode";

export interface SyncData {
  user: { id: string; email: string; name: string | null };
  tier: string;
  tierLabel: string;
  isSuprema: boolean;
  xp: number;
  level: string;
  subscription: { status: string; renewsAt: string | null };
  locked: boolean;
  message?: string;
  projects: Project[];
  lessons: Lesson[];
  exercises: Exercise[];
  counts?: { projects: number; lessons: number; exercises: number };
}

export interface Project { id: string; title: string; description: string; level: string; area: string; estimated_hours: number; }
export interface Lesson { slug: string; title: string; description: string; area: string; level: string; lessons_count: number; estimated_hours: number; }
export interface Exercise { ex_id: string; title: string; category: string; level: string; objective: string; }

function baseUrl(): string {
  return vscode.workspace.getConfiguration("pytrack").get<string>("apiBaseUrl") || "https://www.pytrack.com.br";
}

// Lê a resposta como JSON; se vier HTML (ex.: página de erro/404), dá uma
// mensagem clara em vez de "Unexpected token '<'".
async function readJson(res: Response): Promise<Record<string, unknown>> {
  const text = await res.text();
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    if (text.trimStart().startsWith("<")) {
      throw new Error(
        `O servidor não respondeu em JSON (HTTP ${res.status}). Verifique a configuração "pytrack.apiBaseUrl" e tente novamente em instantes.`,
      );
    }
    throw new Error(`Resposta inesperada do servidor (HTTP ${res.status}).`);
  }
}

export async function apiLogin(email: string, password: string): Promise<{ access_token: string; refresh_token: string; user: { id: string; email: string; name: string | null } }> {
  let res: Response;
  try {
    res = await fetch(`${baseUrl()}/api/extension/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch (e) {
    throw new Error(`Não foi possível conectar à PyTrack. Verifique sua internet. (${(e as Error).message})`);
  }
  const data = await readJson(res);
  if (!res.ok) throw new Error((data.error as string) || "E-mail ou senha inválidos.");
  return data as never;
}

export async function apiSync(token: string): Promise<SyncData> {
  let res: Response;
  try {
    res = await fetch(`${baseUrl()}/api/extension/sync`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    });
  } catch (e) {
    throw new Error(`Não foi possível conectar à PyTrack. (${(e as Error).message})`);
  }
  const data = await readJson(res);
  if (!res.ok) throw new Error((data.error as string) || "Falha ao sincronizar.");
  return data as never;
}

export { baseUrl };
