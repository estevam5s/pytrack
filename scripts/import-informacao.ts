/**
 * Importa o conteúdo de informacao.md para a tabela `contents` do Supabase.
 *
 * Executa o parser e faz upsert via service role (ignora RLS).
 * Uso:  npx tsx scripts/import-informacao.ts
 *
 * Por padrão usa `?dry=1` apenas imprime o que seria importado. Passe `--apply`
 * para gravar no banco.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { toLearningContents } from "../lib/parser/informacao";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE;

async function main() {
  const apply = process.argv.includes("--apply");
  const md = readFileSync(resolve(process.cwd(), "informacao.md"), "utf8");
  const contents = toLearningContents(md);

  console.log(`Parser extraiu ${contents.length} conteúdos de informacao.md`);
  for (const c of contents.slice(0, 8)) {
    console.log(` • [${c.level}] ${c.title}`);
  }
  console.log(" ...");

  if (!apply) {
    console.log(
      "\nDry-run. Rode com --apply para inserir no Supabase (precisa de SUPABASE_SERVICE_ROLE).",
    );
    return;
  }

  if (!url || !serviceRole) {
    throw new Error(
      "Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE no ambiente.",
    );
  }

  const supabase = createClient(url, serviceRole, {
    auth: { persistSession: false },
  });

  const rows = contents.map((c, i) => ({
    title: c.title,
    description: c.description,
    category: c.category,
    level: c.level,
    area: c.area,
    order_index: 1000 + i,
    estimated_hours: c.estimatedHours ?? 0,
  }));

  const { error, count } = await supabase
    .from("contents")
    .insert(rows, { count: "exact" });

  if (error) throw error;
  console.log(`\nImportados ${count ?? rows.length} conteúdos para o Supabase.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
