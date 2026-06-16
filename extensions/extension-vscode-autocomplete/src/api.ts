import * as vscode from "vscode";

export interface PlanInfo {
  tier: string;
  tierLabel: string;
  name: string | null;
  email: string | null;
  hasCompleto: boolean;
}

const COMPLETO_OR_ABOVE = ["completo", "suprema", "vitalicio"];

function baseUrl(): string {
  return (
    vscode.workspace
      .getConfiguration("pytrackAutocomplete")
      .get<string>("apiBaseUrl") || "https://www.pytrack.com.br"
  );
}

async function readJson(res: Response): Promise<Record<string, unknown>> {
  const text = await res.text();
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    if (text.trimStart().startsWith("<")) {
      throw new Error(
        `O servidor não respondeu em JSON (HTTP ${res.status}). Verifique "pytrackAutocomplete.apiBaseUrl".`,
      );
    }
    throw new Error(`Resposta inesperada do servidor (HTTP ${res.status}).`);
  }
}

/** Faz login na PyTrack e devolve o access_token. */
export async function apiLogin(
  email: string,
  password: string,
): Promise<string> {
  let res: Response;
  try {
    res = await fetch(`${baseUrl()}/api/extension/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch (e) {
    throw new Error(
      `Não foi possível conectar à PyTrack. Verifique sua internet. (${(e as Error).message})`,
    );
  }
  const data = await readJson(res);
  if (!res.ok) throw new Error((data.error as string) || "E-mail ou senha inválidos.");
  const token = data.access_token as string | undefined;
  if (!token) throw new Error("Login sem token de acesso.");
  return token;
}

/** Verifica o plano do usuário a partir do token de sessão. */
export async function apiPlan(token: string): Promise<PlanInfo> {
  let res: Response;
  try {
    res = await fetch(`${baseUrl()}/api/extension/sync`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    });
  } catch (e) {
    throw new Error(`Não foi possível conectar à PyTrack. (${(e as Error).message})`);
  }
  const data = await readJson(res);
  if (!res.ok) throw new Error((data.error as string) || "Sessão inválida ou expirada.");
  const tier = String(data.tier ?? "free");
  const userObj = (data.user ?? {}) as { name?: string | null; email?: string | null };
  return {
    tier,
    tierLabel: String(data.tierLabel ?? tier),
    name: userObj.name ?? null,
    email: userObj.email ?? null,
    hasCompleto: COMPLETO_OR_ABOVE.includes(tier),
  };
}

export { baseUrl };
