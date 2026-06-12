/**
 * Aplica o schema da Comunidade no Supabase via Management API.
 *
 * Uso:
 *   npx tsx scripts/apply-community-schema.ts
 *
 * Variáveis necessárias (.env / .env.local):
 *   NEXT_PUBLIC_SUPABASE_URL   — URL do projeto (deriva o project ref)
 *   SUPABASE_ACCESS_TOKEN      — Personal Access Token (sbp_...) da Supabase
 *
 * IMPORTANTE: a Management API exige um Personal Access Token (sbp_...),
 * NÃO o service_role key. O service_role serve para PostgREST/Storage, não
 * para executar DDL. Nunca exponha esses tokens no client-side.
 *
 * Alternativa: copie o conteúdo de supabase/community-schema.sql no SQL Editor
 * do Supabase, ou rode `supabase db push`.
 */
import fs from "node:fs";
import path from "node:path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const accessToken =
  process.env.SUPABASE_ACCESS_TOKEN || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !accessToken) {
  throw new Error(
    "Variáveis ausentes: defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_ACCESS_TOKEN.",
  );
}

async function applyCommunitySchema() {
  const filePath = path.join(process.cwd(), "supabase", "community-schema.sql");
  if (!fs.existsSync(filePath)) {
    throw new Error(`Arquivo não encontrado: ${filePath}`);
  }
  const sql = fs.readFileSync(filePath, "utf-8");
  const projectRef = new URL(supabaseUrl!).hostname.split(".")[0];

  console.log(`→ Aplicando community-schema.sql no projeto ${projectRef}...`);

  const response = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: sql }),
    },
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Falha ao aplicar schema (HTTP ${response.status}): ${error}`);
  }

  console.log("✅ Schema da comunidade aplicado com sucesso.");
}

applyCommunitySchema().catch((err) => {
  console.error("❌", err.message);
  process.exit(1);
});
