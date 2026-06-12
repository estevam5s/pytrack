import { redirect } from "next/navigation";
import { Star, ThumbsUp, ThumbsDown, Minus } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { isAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { PageHeader } from "@/components/dashboard/page-header";

export const metadata = { title: "Recomendações (NPS) · Admin · PyTrack" };
export const dynamic = "force-dynamic";

export default async function AdminRecomendacoesPage() {
  const me = await getCurrentUser();
  if (!isAdmin(me?.email)) redirect("/inicio");

  const admin = createAdminClient();
  const { data: rows } = await admin.from("nps_responses").select("score, reason, email, created_at").order("created_at", { ascending: false }).limit(500);
  const list = rows ?? [];

  const promoters = list.filter((r) => (r.score as number) >= 9).length;
  const passives = list.filter((r) => (r.score as number) >= 7 && (r.score as number) <= 8).length;
  const detractors = list.filter((r) => (r.score as number) <= 6).length;
  const total = list.length;
  const nps = total ? Math.round(((promoters - detractors) / total) * 100) : 0;
  const avg = total ? (list.reduce((s, r) => s + (r.score as number), 0) / total).toFixed(1) : "—";

  // NPS por mês (últimos 6 meses com respostas)
  const byMonth = new Map<string, { prom: number; det: number; total: number }>();
  for (const r of list) {
    const key = (r.created_at as string).slice(0, 7); // YYYY-MM
    const m = byMonth.get(key) ?? { prom: 0, det: 0, total: 0 };
    const s = r.score as number;
    if (s >= 9) m.prom++; else if (s <= 6) m.det++;
    m.total++;
    byMonth.set(key, m);
  }
  const monthly = [...byMonth.entries()]
    .map(([month, m]) => ({ month, nps: m.total ? Math.round(((m.prom - m.det) / m.total) * 100) : 0, total: m.total }))
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6);
  const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  const monthLabel = (ym: string) => `${MONTHS[Number(ym.slice(5, 7)) - 1]}/${ym.slice(2, 4)}`;

  return (
    <div>
      <PageHeader title="Recomendações (NPS)" description="O quanto seus usuários recomendariam a PyTrack — e por quê. O NPS vai de -100 a +100." />

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="card p-5 text-center sm:col-span-2 lg:col-span-1">
          <p className={`text-4xl font-extrabold ${nps >= 50 ? "text-green" : nps >= 0 ? "text-yellow-400" : "text-red-400"}`}>{nps > 0 ? `+${nps}` : nps}</p>
          <p className="text-xs text-text-secondary">NPS</p>
        </div>
        <Stat icon={Star} label="Nota média" value={String(avg)} color="text-primary-light" />
        <Stat icon={ThumbsUp} label="Promotores (9–10)" value={promoters} color="text-green" />
        <Stat icon={Minus} label="Neutros (7–8)" value={passives} color="text-yellow-400" />
        <Stat icon={ThumbsDown} label="Detratores (0–6)" value={detractors} color="text-red-400" />
      </div>

      {/* evolução do NPS por mês */}
      {monthly.length > 0 && (
        <div className="mb-6 rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 font-bold">NPS ao longo do tempo</h2>
          <div className="flex h-48 items-end gap-4">
            {monthly.map((m) => {
              // barra: NPS de -100 a +100 → altura relativa ao zero (linha do meio)
              const pos = m.nps >= 0;
              const h = Math.min(50, Math.abs(m.nps) / 2); // % de metade da área
              return (
                <div key={m.month} className="flex flex-1 flex-col items-center">
                  <div className="relative flex h-40 w-full items-center justify-center">
                    <div className="absolute left-0 right-0 top-1/2 h-px bg-border" />
                    <div
                      className={`absolute w-2/3 rounded ${pos ? "bg-gradient-to-t from-green/70 to-green" : "bg-gradient-to-b from-red-400/70 to-red-400"}`}
                      style={pos ? { bottom: "50%", height: `${h}%` } : { top: "50%", height: `${h}%` }}
                      title={`NPS ${m.nps} · ${m.total} respostas`}
                    />
                    <span className={`absolute ${pos ? "bottom-[52%]" : "top-[52%]"} text-xs font-bold ${pos ? "text-green" : "text-red-400"}`}>{m.nps > 0 ? `+${m.nps}` : m.nps}</span>
                  </div>
                  <span className="mt-1 text-[11px] text-text-secondary">{monthLabel(m.month)}</span>
                  <span className="text-[10px] text-text-secondary/60">{m.total} resp.</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-4 font-bold">Respostas ({total})</h2>
        {total === 0 ? (
          <p className="text-sm text-text-secondary">Nenhuma resposta ainda. A pesquisa aparece para os usuários no painel.</p>
        ) : (
          <div className="space-y-2">
            {list.map((r, i) => {
              const s = r.score as number;
              const tone = s >= 9 ? "border-green/30 bg-green/5" : s >= 7 ? "border-yellow-400/30 bg-yellow-400/5" : "border-red-400/30 bg-red-400/5";
              return (
                <div key={i} className={`flex items-start gap-3 rounded-xl border p-3 ${tone}`}>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-sm font-bold">{s}</span>
                  <div className="min-w-0 flex-1">
                    {r.reason ? <p className="text-sm">{r.reason as string}</p> : <p className="text-sm italic text-text-secondary">Sem comentário</p>}
                    <p className="mt-0.5 text-[11px] text-text-secondary">{(r.email as string) || "anônimo"} · {new Date(r.created_at as string).toLocaleString("pt-BR")}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, color }: { icon: typeof Star; label: string; value: number | string; color: string }) {
  return <div className="card flex items-center gap-3 p-4"><Icon className={`h-6 w-6 ${color}`} /><div><p className="text-2xl font-bold">{value}</p><p className="text-xs text-text-secondary">{label}</p></div></div>;
}
