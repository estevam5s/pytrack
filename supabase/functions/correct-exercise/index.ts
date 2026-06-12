// Supabase Edge Function — Correção de exercícios por IA (BYOK).
// Recebe { objective, code, language? } + Authorization: Bearer <jwt do usuário>.
// Usa a chave de IA do usuário (user_ai_settings) ou a chave da plataforma (NVIDIA) como fallback.
// Retorna { score, feedback, strengths, improvements, bestSolution }.
//
// Deploy: supabase functions deploy correct-exercise --project-ref zohqgnhymtqppgzlammv

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const PROVIDER_URL: Record<string, string> = {
  openai: "https://api.openai.com/v1/chat/completions",
  openrouter: "https://openrouter.ai/api/v1/chat/completions",
  nvidia: "https://integrate.api.nvidia.com/v1/chat/completions",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}

interface Correction {
  score: number | null;
  feedback: string;
  strengths: string[];
  improvements: string[];
  bestSolution: string;
}

// Parser robusto: tenta JSON; se falhar (a IA costuma quebrar o JSON com código
// multilinha/aspas), extrai os campos com regex. Nunca lança.
function parseAiResult(text: string): Correction {
  // remove cercas de código markdown
  const clean = text.replace(/```json/gi, "").replace(/```/g, "").trim();

  // 1) tentativa direta de JSON
  const match = clean.match(/\{[\s\S]*\}/);
  if (match) {
    try {
      const o = JSON.parse(match[0]);
      return {
        score: typeof o.score === "number" ? o.score : Number(o.score) || null,
        feedback: String(o.feedback ?? "").trim(),
        strengths: Array.isArray(o.strengths) ? o.strengths.map(String) : [],
        improvements: Array.isArray(o.improvements) ? o.improvements.map(String) : [],
        bestSolution: String(o.bestSolution ?? ""),
      };
    } catch {
      /* cai para o fallback por regex */
    }
  }

  // 2) fallback: extrai campos individualmente
  const str = (key: string): string => {
    // captura "key": "....." lidando com aspas escapadas e quebras
    const re = new RegExp(`"${key}"\\s*:\\s*"((?:\\\\.|[^"\\\\])*)"`, "i");
    const m = clean.match(re);
    return m ? m[1].replace(/\\n/g, "\n").replace(/\\"/g, '"').replace(/\\\\/g, "\\") : "";
  };
  const arr = (key: string): string[] => {
    const re = new RegExp(`"${key}"\\s*:\\s*\\[([\\s\\S]*?)\\]`, "i");
    const m = clean.match(re);
    if (!m) return [];
    return (m[1].match(/"((?:\\.|[^"\\])*)"/g) ?? []).map((s) => s.slice(1, -1).replace(/\\"/g, '"'));
  };
  const scoreM = clean.match(/"score"\s*:\s*(\d{1,3})/);
  const score = scoreM ? Math.min(100, parseInt(scoreM[1], 10)) : null;

  // bestSolution pode conter ``` ; tenta capturar bloco de código se houver
  let best = str("bestSolution");
  if (!best) {
    const codeM = text.match(/```(?:python)?\s*([\s\S]*?)```/);
    if (codeM) best = codeM[1].trim();
  }

  const feedback = str("feedback") || clean.slice(0, 600);
  return {
    score,
    feedback: feedback || "Avaliação concluída.",
    strengths: arr("strengths"),
    improvements: arr("improvements"),
    bestSolution: best,
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "Método não permitido." }, 405);

  const authHeader = req.headers.get("Authorization") ?? "";
  const jwt = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!jwt) return json({ error: "Não autenticado." }, 401);

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const admin = createClient(SUPABASE_URL, SERVICE);

  // valida o usuário
  const { data: userData, error: userErr } = await admin.auth.getUser(jwt);
  if (userErr || !userData.user) return json({ error: "Sessão inválida." }, 401);
  const userId = userData.user.id;

  let body: { objective?: string; code?: string; language?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Corpo inválido." }, 400);
  }
  const { objective = "", code = "", language = "python" } = body;
  if (!code.trim()) return json({ error: "Envie o código a ser avaliado." }, 400);

  // chave de IA do usuário (BYOK) ou fallback da plataforma (NVIDIA)
  const { data: ai } = await admin
    .from("user_ai_settings")
    .select("provider, base_url, model, api_key, enabled")
    .eq("user_id", userId)
    .maybeSingle();

  let provider = ai?.provider ?? "nvidia";
  let model = ai?.model ?? "meta/llama-3.3-70b-instruct";
  let apiKey = ai?.enabled ? ai?.api_key : null;
  let url = ai?.base_url || PROVIDER_URL[provider] || PROVIDER_URL.nvidia;

  if (!apiKey) {
    // fallback: chave da plataforma (NVIDIA) configurada como secret da função
    apiKey = Deno.env.get("NVIDIA_API_KEY") ?? "";
    provider = "nvidia";
    model = "meta/llama-3.3-70b-instruct";
    url = PROVIDER_URL.nvidia;
    if (!apiKey) return json({ error: "Nenhuma IA configurada. Adicione sua chave em Configurações → IA." }, 400);
  }

  const system =
    "Você é um revisor de código sênior de Python. Avalie a solução do aluno para o objetivo dado. " +
    "Responda SOMENTE com um objeto JSON VÁLIDO (sem markdown, sem texto fora do JSON) com as chaves: " +
    "score (número 0-100), feedback (texto curto e construtivo em pt-BR), " +
    "strengths (array de strings), improvements (array de strings), bestSolution (string com uma solução de referência idiomática em " +
    language + "). " +
    "IMPORTANTE: no campo bestSolution, escape corretamente as quebras de linha como \\n e as aspas como \\\". " +
    "Mantenha o código curto (até ~15 linhas). Seja rigoroso mas encorajador.";

  const userMsg = `Objetivo do exercício:\n${objective}\n\nSolução do aluno:\n\`\`\`${language}\n${code}\n\`\`\``;

  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (provider === "anthropic") headers["x-api-key"] = apiKey;
    else headers["Authorization"] = `Bearer ${apiKey}`;

    const aiRes = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: system },
          { role: "user", content: userMsg },
        ],
        temperature: 0.3,
        max_tokens: 1200,
      }),
    });
    const aiData = await aiRes.json();
    if (!aiRes.ok) {
      return json({ error: aiData?.error?.message ?? "Falha na IA. Verifique sua chave/modelo." }, 502);
    }
    const text: string = aiData.choices?.[0]?.message?.content ?? "";
    const parsed = parseAiResult(text);

    // registra XP por tentativa avaliada (best-effort)
    try {
      await admin.rpc("community_add_xp", { uid: userId, amount: 10 });
    } catch { /* opcional */ }

    return json(parsed);
  } catch (e) {
    return json({ error: `Erro ao avaliar: ${(e as Error).message}` }, 500);
  }
});
