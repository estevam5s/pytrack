// Cliente OpenRouter (server-only). Tenta uma lista de modelos gratuitos em
// ordem até um responder, já que modelos :free são instáveis.

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

// Modelos validados (em 2026-06) para chat/JSON, do mais capaz ao fallback.
const MODELS = [
  "openai/gpt-oss-120b:free",
  "google/gemma-4-31b-it:free",
  "nvidia/nemotron-nano-9b-v2:free",
];

const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

export interface ChatOptions {
  maxTokens?: number;
  temperature?: number;
  json?: boolean;
}

export async function chatComplete(
  messages: ChatMessage[],
  opts: ChatOptions = {},
): Promise<{ content?: string; model?: string; error?: string }> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return { error: "OPENROUTER_API_KEY não configurada." };

  let lastError = "Nenhum modelo disponível.";

  for (const model of MODELS) {
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://pytrack.local",
          "X-Title": "PyTrack",
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: opts.maxTokens ?? 900,
          temperature: opts.temperature ?? 0.3,
          ...(opts.json
            ? { response_format: { type: "json_object" } }
            : {}),
        }),
        cache: "no-store",
      });

      if (!res.ok) {
        lastError = `HTTP ${res.status} (${model})`;
        continue;
      }
      const data = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
        error?: { message?: string };
      };
      const content = data.choices?.[0]?.message?.content;
      if (content && content.trim()) return { content, model };
      lastError = data.error?.message ?? `Resposta vazia (${model})`;
    } catch (e) {
      lastError = e instanceof Error ? e.message : String(e);
    }
  }
  return { error: lastError };
}

/** Chama o modelo pedindo JSON e tenta parsear, com 1 retry se falhar. */
export async function chatJson<T>(
  messages: ChatMessage[],
  opts: ChatOptions = {},
): Promise<{ data?: T; model?: string; raw?: string; error?: string }> {
  let lastErr = "Resposta inválida da IA.";
  let lastRaw: string | undefined;
  let lastModel: string | undefined;
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await chatComplete(messages, { ...opts, json: true });
    if (res.error || !res.content) {
      lastErr = res.error ?? lastErr;
      continue;
    }
    lastRaw = res.content;
    lastModel = res.model;
    const parsed = parseJsonLoose<T>(res.content);
    if (parsed) return { data: parsed, model: res.model };
  }
  return { error: lastErr, raw: lastRaw, model: lastModel };
}

/** Extrai um objeto JSON de uma resposta que pode vir cercada por texto/markdown. */
export function parseJsonLoose<T>(text: string): T | null {
  let s = text
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();

  try {
    return JSON.parse(s) as T;
  } catch {
    /* continua */
  }

  // Varredura com contagem de chaves respeitando strings (lida com '{' dentro de texto).
  const start = s.indexOf("{");
  if (start !== -1) {
    let depth = 0;
    let inStr = false;
    let esc = false;
    for (let i = start; i < s.length; i++) {
      const ch = s[i];
      if (inStr) {
        if (esc) esc = false;
        else if (ch === "\\") esc = true;
        else if (ch === '"') inStr = false;
      } else if (ch === '"') inStr = true;
      else if (ch === "{") depth++;
      else if (ch === "}") {
        depth--;
        if (depth === 0) {
          const cand = s.slice(start, i + 1);
          try {
            return JSON.parse(cand) as T;
          } catch {
            break;
          }
        }
      }
    }
    s = s.slice(start);
  }

  // Reparo leve: remove vírgulas finais.
  try {
    return JSON.parse(s.replace(/,\s*([}\]])/g, "$1")) as T;
  } catch {
    return null;
  }
}
