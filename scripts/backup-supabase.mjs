#!/usr/bin/env node
/**
 * Backup COMPLETO e seguro do Supabase (banco + storage + metadados).
 * Independente do painel — protege contra ban/perda da conta.
 *
 * Uso:
 *   SUPABASE_MANAGEMENT_TOKEN=sbp_... SUPABASE_PROJECT_REF=... \
 *   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE=... \
 *   node scripts/backup-supabase.mjs
 *
 * Gera em ./backups/<timestamp>/:
 *   - tables/<tabela>.json   (todas as linhas de cada tabela public)
 *   - storage/<bucket>/...   (todos os arquivos de cada bucket)
 *   - manifest.json          (resumo do backup)
 */
import { writeFile, mkdir } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { Readable } from "node:stream";
import path from "node:path";

const REF = process.env.SUPABASE_PROJECT_REF || "zohqgnhymtqppgzlammv";
const MGMT = process.env.SUPABASE_MANAGEMENT_TOKEN;
const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!MGMT || !SUPA_URL || !SERVICE) {
  console.error("Faltam env: SUPABASE_MANAGEMENT_TOKEN, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE");
  process.exit(1);
}

const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
const OUT = path.join("backups", stamp);

async function sql(query) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${REF}/database/query`, {
    method: "POST",
    headers: { Authorization: `Bearer ${MGMT}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error(`SQL falhou (${res.status}): ${query.slice(0, 60)}`);
  return res.json();
}

async function rest(p, init = {}) {
  return fetch(`${SUPA_URL}${p}`, {
    ...init,
    headers: { apikey: SERVICE, Authorization: `Bearer ${SERVICE}`, ...(init.headers || {}) },
  });
}

async function main() {
  await mkdir(path.join(OUT, "tables"), { recursive: true });
  console.log(`📦 Backup em ${OUT}`);

  // 1) tabelas públicas
  const tables = await sql(
    `select tablename from pg_tables where schemaname='public' order by tablename;`,
  );
  const manifest = { createdAt: new Date().toISOString(), ref: REF, tables: {}, storage: {} };

  for (const { tablename } of tables) {
    let from = 0;
    const PAGE = 1000;
    const rows = [];
    for (;;) {
      const res = await rest(`/rest/v1/${tablename}?select=*`, {
        headers: { Range: `${from}-${from + PAGE - 1}`, "Range-Unit": "items" },
      });
      if (!res.ok) break;
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) break;
      rows.push(...data);
      if (data.length < PAGE) break;
      from += PAGE;
    }
    await writeFile(path.join(OUT, "tables", `${tablename}.json`), JSON.stringify(rows, null, 2));
    manifest.tables[tablename] = rows.length;
    console.log(`  ✓ ${tablename}: ${rows.length} linhas`);
  }

  // 2) storage (buckets + arquivos)
  const buckets = await sql(`select id from storage.buckets order by id;`);
  for (const { id: bucket } of buckets) {
    const objs = await sql(
      `select name from storage.objects where bucket_id='${bucket}' order by name limit 100000;`,
    );
    let saved = 0;
    for (const { name } of objs) {
      const res = await rest(`/storage/v1/object/${bucket}/${name}`);
      if (!res.ok || !res.body) continue;
      const dest = path.join(OUT, "storage", bucket, name);
      await mkdir(path.dirname(dest), { recursive: true });
      await new Promise((resolve, reject) => {
        const ws = createWriteStream(dest);
        Readable.fromWeb(res.body).pipe(ws).on("finish", resolve).on("error", reject);
      });
      saved += 1;
    }
    manifest.storage[bucket] = saved;
    console.log(`  ✓ bucket ${bucket}: ${saved} arquivos`);
  }

  await writeFile(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
  console.log(`\n✅ Backup completo em ${OUT}`);
  console.log("   Guarde esta pasta fora do Supabase (S3/Google Drive/GitHub privado).");
}

main().catch((e) => {
  console.error("❌ Falha no backup:", e.message);
  process.exit(1);
});
