import { redirect } from "next/navigation";
import { Database, HardDrive, Table2, Layers, Shield } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { isAdmin } from "@/lib/admin";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const metadata = { title: "Banco de dados · Admin · PyTrack" };
export const dynamic = "force-dynamic";

const REF = "zohqgnhymtqppgzlammv";

async function runSql(query: string): Promise<unknown[]> {
  const token = process.env.SUPABASE_MANAGEMENT_TOKEN;
  if (!token) return [];
  try {
    const res = await fetch(`https://api.supabase.com/v1/projects/${REF}/database/query`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function fmtBytes(n: number) {
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)} GB`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)} MB`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)} KB`;
  return `${n} B`;
}

export default async function AdminBancoPage() {
  const me = await getCurrentUser();
  if (!isAdmin(me?.email)) redirect("/inicio");

  const hasToken = Boolean(process.env.SUPABASE_MANAGEMENT_TOKEN);

  // tamanho total + por tabela + contagem de linhas (via pg_catalog)
  const tables = (await runSql(`
    select t.tablename as name,
      pg_total_relation_size(quote_ident(t.schemaname)||'.'||quote_ident(t.tablename)) as total_bytes,
      coalesce(s.n_live_tup, 0) as rows,
      coalesce((select count(*) from pg_policies p where p.tablename = t.tablename and p.schemaname = 'public'), 0) as policies
    from pg_tables t
    left join pg_stat_user_tables s on s.relname = t.tablename and s.schemaname = t.schemaname
    where t.schemaname = 'public'
    order by total_bytes desc
    limit 60;
  `)) as { name: string; total_bytes: number; rows: number; policies: number }[];

  const dbSize = (await runSql(`select pg_database_size(current_database()) as size;`)) as { size: number }[];
  const buckets = (await runSql(`select id, public from storage.buckets order by id;`)) as { id: string; public: boolean }[];
  const objStats = (await runSql(`select count(*) as objects, coalesce(sum((metadata->>'size')::bigint),0) as bytes from storage.objects;`)) as { objects: number; bytes: number }[];
  const rlsOff = (await runSql(`select count(*) as off from pg_tables t join pg_class c on c.relname=t.tablename where t.schemaname='public' and c.relrowsecurity=false;`)) as { off: number }[];

  const totalDb = dbSize[0]?.size ?? 0;
  const totalTablesBytes = tables.reduce((a, t) => a + Number(t.total_bytes), 0);
  const totalRows = tables.reduce((a, t) => a + Number(t.rows), 0);
  const storageObjects = objStats[0]?.objects ?? 0;
  const storageBytes = objStats[0]?.bytes ?? 0;
  const maxTable = Math.max(1, ...tables.map((t) => Number(t.total_bytes)));

  return (
    <div>
      <PageHeader
        title="Banco de dados"
        description="Tamanho, tabelas, linhas, storage, RLS e backups do Supabase."
      />

      {!hasToken && (
        <Card className="mb-6 border-warning/30">
          <CardContent className="p-4 text-sm text-warning">
            Defina <code>SUPABASE_MANAGEMENT_TOKEN</code> nas variáveis de ambiente para carregar as estatísticas em tempo real.
          </CardContent>
        </Card>
      )}

      {/* KPIs */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardContent className="p-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary-light"><Database className="h-5 w-5" /></span>
          <p className="mt-3 text-2xl font-bold">{fmtBytes(totalDb)}</p>
          <p className="text-xs text-text-secondary">Tamanho do banco</p>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green/10 text-green"><Table2 className="h-5 w-5" /></span>
          <p className="mt-3 text-2xl font-bold">{tables.length}</p>
          <p className="text-xs text-text-secondary">Tabelas · {totalRows.toLocaleString("pt-BR")} linhas</p>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue/10 text-blue"><HardDrive className="h-5 w-5" /></span>
          <p className="mt-3 text-2xl font-bold">{fmtBytes(storageBytes)}</p>
          <p className="text-xs text-text-secondary">Storage · {storageObjects} arquivos / {buckets.length} buckets</p>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-magenta/10 text-magenta"><Shield className="h-5 w-5" /></span>
          <p className="mt-3 text-2xl font-bold">{(rlsOff[0]?.off ?? 0) === 0 ? "100%" : `${rlsOff[0]?.off} sem RLS`}</p>
          <p className="text-xs text-text-secondary">Proteção RLS</p>
        </CardContent></Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        {/* tabelas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" /> Tabelas ({tables.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[60vh] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-surface-2 text-left text-xs text-text-secondary">
                  <tr>
                    <th className="p-3 font-medium">Tabela</th>
                    <th className="p-3 text-right font-medium">Linhas</th>
                    <th className="p-3 text-right font-medium">Tamanho</th>
                    <th className="p-3 text-right font-medium">RLS</th>
                  </tr>
                </thead>
                <tbody>
                  {tables.map((t, i) => (
                    <tr key={t.name} className={cn("border-t border-border", i % 2 && "bg-surface/40")}>
                      <td className="p-3">
                        <span className="font-medium">{t.name}</span>
                        <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-surface-2">
                          <div className="h-full rounded-full bg-gradient-to-r from-primary to-primary-light" style={{ width: `${(Number(t.total_bytes) / maxTable) * 100}%` }} />
                        </div>
                      </td>
                      <td className="p-3 text-right tabular-nums text-text-secondary">{Number(t.rows).toLocaleString("pt-BR")}</td>
                      <td className="p-3 text-right tabular-nums">{fmtBytes(Number(t.total_bytes))}</td>
                      <td className="p-3 text-right">
                        <span className={cn("text-xs", Number(t.policies) > 0 ? "text-green" : "text-text-secondary/60")}>
                          {Number(t.policies) > 0 ? `${t.policies} pol.` : "—"}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {tables.length === 0 && (
                    <tr><td colSpan={4} className="p-6 text-center text-text-secondary">Sem dados (verifique o token).</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* storage + backups */}
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Buckets de Storage</CardTitle></CardHeader>
            <CardContent>
              {buckets.length === 0 ? (
                <p className="text-sm text-text-secondary">—</p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {buckets.map((b) => (
                    <li key={b.id} className="flex items-center justify-between">
                      <span>{b.id}</span>
                      <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", b.public ? "bg-green/10 text-green" : "bg-surface-2 text-text-secondary")}>
                        {b.public ? "público" : "privado"}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
          <Card className="border-primary/20">
            <CardHeader><CardTitle className="text-sm">Backups</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm text-text-secondary">
              <p>O Supabase faz <strong className="text-foreground">backups diários automáticos</strong>.</p>
              <p>Restauração e PITR no painel do Supabase: <strong>Database → Backups</strong>.</p>
              <a href={`https://supabase.com/dashboard/project/${REF}/database/backups`} target="_blank" rel="noopener noreferrer" className="inline-block text-primary-light hover:underline">
                Abrir backups no Supabase →
              </a>
              <p className="pt-1 text-xs">Schemas versionados em <code>supabase/*.sql</code> e guia em <code>docs/BACKUP.md</code>.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
