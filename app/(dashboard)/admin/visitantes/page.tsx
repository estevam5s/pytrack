import { redirect } from "next/navigation";
import { Globe, Users, Eye, Calendar, MapPin, TrendingUp } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { isAdmin } from "@/lib/admin";
import { PageHeader } from "@/components/dashboard/page-header";
import { getVisitAnalytics } from "@/lib/admin-visits";
import { WorldMap } from "@/components/admin/world-map";

export const metadata = { title: "Visitantes · Admin · PyTrack" };
export const dynamic = "force-dynamic";

export default async function AdminVisitantesPage() {
  const me = await getCurrentUser();
  if (!isAdmin(me?.email)) redirect("/inicio");

  const a = await getVisitAnalytics();
  const maxDay = Math.max(1, ...a.last14.map((d) => d.count));
  const maxCountry = Math.max(1, ...a.countries.map((c) => c.count));

  return (
    <div>
      <PageHeader title="Visitantes" description="Tráfego do site em tempo real, com localização geográfica no planeta inteiro." />

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={Eye} label="Visitas (total)" value={a.total} />
        <Stat icon={Users} label="Visitantes únicos" value={a.uniqueVisitors} />
        <Stat icon={Globe} label="Países" value={a.countriesCount} />
        <Stat icon={Calendar} label="Hoje / 7 dias" value={`${a.today} / ${a.week}`} />
      </div>

      {/* mapa-múndi */}
      <div className="mb-6 rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-4 flex items-center gap-2 font-bold"><Globe className="h-5 w-5 text-primary-light" /> Mapa de visitantes (mundo)</h2>
        <WorldMap data={a.countries.filter((c) => c.code !== "??")} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {/* visitas por dia */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-4 flex items-center gap-2 font-bold"><TrendingUp className="h-5 w-5 text-primary-light" /> Visitas (últimos 14 dias)</h2>
            <div className="flex h-40 items-end gap-1.5">
              {a.last14.map((d) => (
                <div key={d.day} className="flex flex-1 flex-col items-center gap-1" title={`${d.day}: ${d.count}`}>
                  <div className="w-full rounded-t bg-gradient-to-t from-primary to-primary-light" style={{ height: `${Math.max(2, (d.count / maxDay) * 100)}%` }} />
                  <span className="text-[9px] text-text-secondary">{d.day.slice(8)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* países */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-4 flex items-center gap-2 font-bold"><Globe className="h-5 w-5 text-primary-light" /> Visitas por país</h2>
            {a.countries.length === 0 ? (
              <p className="text-sm text-text-secondary">Nenhuma visita registrada ainda. Os dados aparecem conforme o site recebe tráfego.</p>
            ) : (
              <div className="space-y-2">
                {a.countries.slice(0, 25).map((c) => (
                  <div key={c.code} className="flex items-center gap-3">
                    <span className="text-lg">{c.flag}</span>
                    <span className="w-36 shrink-0 truncate text-sm">{c.name}</span>
                    <span className="relative h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
                      <span className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-primary-light" style={{ width: `${(c.count / maxCountry) * 100}%` }} />
                    </span>
                    <span className="w-12 shrink-0 text-right text-sm font-semibold">{c.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* páginas mais visitadas */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-3 font-bold">Páginas mais visitadas</h2>
            <div className="space-y-1.5">
              {a.topPaths.map((p) => (
                <div key={p.path} className="flex items-center justify-between text-sm">
                  <span className="truncate text-text-secondary">{p.path}</span>
                  <span className="ml-2 shrink-0 font-semibold">{p.count}</span>
                </div>
              ))}
              {a.topPaths.length === 0 && <p className="text-sm text-text-secondary">—</p>}
            </div>
          </div>

          {/* recentes */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-3 font-bold">Visitas recentes</h2>
            <div className="space-y-2">
              {a.recent.map((r, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm">
                  <span className="text-base">{r.flag}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs"><MapPin className="mr-1 inline h-3 w-3 text-text-secondary" />{r.city ? `${r.city}, ` : ""}{r.name}</p>
                    <p className="truncate text-[11px] text-text-secondary">{r.path} · {new Date(r.created_at).toLocaleTimeString("pt-BR")}</p>
                  </div>
                </div>
              ))}
              {a.recent.length === 0 && <p className="text-sm text-text-secondary">Nenhuma visita ainda.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Eye; label: string; value: number | string }) {
  return <div className="card flex items-center gap-3 p-4"><Icon className="h-6 w-6 text-primary-light" /><div><p className="text-2xl font-bold">{value}</p><p className="text-xs text-text-secondary">{label}</p></div></div>;
}
