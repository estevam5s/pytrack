#!/usr/bin/env node
/**
 * Enriquece as respostas das perguntas de entrevista (interview_questions) com IA.
 * Gera conteúdo ESPECÍFICO por pergunta: conceito, aplicação, erros comuns, como
 * fixar e um exemplo de código. Substitui as respostas genéricas.
 *
 * Uso:
 *   NVIDIA_API_KEY=... NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE=... \
 *   node scripts/enrich-questions.mjs [limite]
 *
 * Processa em lote (default 60). Pula as que já foram enriquecidas (flag enriched).
 */
const LIMIT = Number(process.argv[2] || 60);
const NVIDIA = process.env.NVIDIA_API_KEY;
const SUPA = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!NVIDIA || !SUPA || !SERVICE) {
  console.error("Faltam env: NVIDIA_API_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE");
  process.exit(1);
}

const HEADERS = { apikey: SERVICE, Authorization: `Bearer ${SERVICE}`, "Content-Type": "application/json" };

async function ai(question, category, seniority) {
  const body = {
    model: "meta/llama-3.3-70b-instruct",
    messages: [
      {
        role: "system",
        content:
          "Você é um entrevistador técnico sênior de Python. Para a pergunta dada, responda em JSON " +
          "com as chaves: concept (conceito-chave, 1-2 frases específicas), application (como/quando aplicar na " +
          "prática, específico), mistakes (erros comuns reais), fix_fast (como memorizar/fixar rápido), " +
          "code (um exemplo de código Python curto e relevante, com \\n para quebras). " +
          "Tudo em pt-BR, técnico, específico para ESTA pergunta (nada genérico). Responda SOMENTE o JSON.",
      },
      { role: "user", content: `Categoria: ${category}\nNível: ${seniority || "junior"}\nPergunta: ${question}` },
    ],
    temperature: 0.4,
    max_tokens: 700,
  };
  const res = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${NVIDIA}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`IA ${res.status}`);
  const data = await res.json();
  const txt = data.choices?.[0]?.message?.content ?? "";
  const m = txt.match(/\{[\s\S]*\}/);
  if (!m) throw new Error("sem JSON");
  return JSON.parse(m[0]);
}

async function main() {
  // pega perguntas ainda não enriquecidas
  const res = await fetch(
    `${SUPA}/rest/v1/interview_questions?select=id,num,question,category,seniority&enriched=is.false&order=num&limit=${LIMIT}`,
    { headers: HEADERS },
  );
  const rows = await res.json();
  if (!Array.isArray(rows) || rows.length === 0) {
    console.log("Nada para enriquecer (todas já enriquecidas ou coluna 'enriched' ausente).");
    return;
  }
  console.log(`Enriquecendo ${rows.length} perguntas...`);
  let ok = 0;
  for (const q of rows) {
    try {
      const r = await ai(q.question, q.category, q.seniority);
      await fetch(`${SUPA}/rest/v1/interview_questions?id=eq.${q.id}`, {
        method: "PATCH",
        headers: { ...HEADERS, Prefer: "return=minimal" },
        body: JSON.stringify({
          concept: r.concept ?? undefined,
          application: r.application ?? undefined,
          mistakes: r.mistakes ?? undefined,
          fix_fast: r.fix_fast ?? undefined,
          code: r.code ?? undefined,
          enriched: true,
        }),
      });
      ok++;
      if (ok % 10 === 0) console.log(`  ${ok}/${rows.length}...`);
    } catch (e) {
      console.log(`  [skip] #${q.num}: ${e.message}`);
    }
  }
  console.log(`✅ Enriquecidas: ${ok}/${rows.length}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
