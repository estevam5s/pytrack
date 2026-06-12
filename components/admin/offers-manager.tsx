"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tag, Loader2, Trash2, Plus, Power, Copy, Check } from "lucide-react";
import { createOffer, toggleOffer, deleteOffer } from "@/lib/offers-actions";

interface Offer { id: string; title: string; description: string | null; discount_pct: number; duration_months: number; promo_code: string | null; plan: string; badge: string; active: boolean; ends_at: string | null; created_at: string }

// presets profissionais sugeridos
const PRESETS = [
  { label: "Black Friday — 50% no 1º mês", discountPct: 50, durationMonths: 1, badge: "🛍️ Black Friday", days: 7 },
  { label: "Lançamento — 30% por 3 meses", discountPct: 30, durationMonths: 3, badge: "🚀 Lançamento", days: 14 },
  { label: "Volta às aulas — 25% no 1º mês", discountPct: 25, durationMonths: 1, badge: "🎓 Volta às aulas", days: 10 },
  { label: "Flash — 40% por 24h", discountPct: 40, durationMonths: 1, badge: "⚡ Oferta relâmpago", days: 1 },
];

export function OffersManager({ offers }: { offers: Offer[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [pct, setPct] = useState(30);
  const [months, setMonths] = useState(1);
  const [plan, setPlan] = useState("all");
  const [badge, setBadge] = useState("🔥 Oferta por tempo limitado");
  const [days, setDays] = useState(7);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  function applyPreset(p: typeof PRESETS[number]) {
    setTitle(p.label.split(" — ")[0]); setPct(p.discountPct); setMonths(p.durationMonths); setBadge(p.badge); setDays(p.days);
    setDesc(`Aproveite ${p.discountPct}% de desconto${p.durationMonths > 1 ? ` por ${p.durationMonths} meses` : " no primeiro mês"}!`);
  }

  async function create() {
    setSaving(true); setError(null);
    const res = await createOffer({ title, description: desc, discountPct: pct, durationMonths: months, plan, badge, days });
    setSaving(false);
    if (res.error) setError(res.error);
    else { setTitle(""); setDesc(""); router.refresh(); }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
      {/* criar */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-3 flex items-center gap-2 font-bold"><Plus className="h-5 w-5 text-primary-light" /> Nova oferta</h2>
        <p className="mb-3 text-xs text-text-secondary">Atalhos:</p>
        <div className="mb-4 flex flex-wrap gap-1.5">
          {PRESETS.map((p) => <button key={p.label} onClick={() => applyPreset(p)} className="rounded-full border border-border px-2.5 py-1 text-xs hover:border-primary/40">{p.label}</button>)}
        </div>
        <div className="space-y-3">
          <In label="Título" value={title} onChange={setTitle} placeholder="Ex.: Black Friday" />
          <In label="Descrição" value={desc} onChange={setDesc} placeholder="Texto do banner" />
          <div className="grid grid-cols-3 gap-2">
            <Num label="Desconto (%)" value={pct} onChange={setPct} />
            <Num label="Meses" value={months} onChange={setMonths} />
            <Num label="Dura (dias)" value={days} onChange={setDays} />
          </div>
          <In label="Badge" value={badge} onChange={setBadge} />
          <div>
            <label className="mb-1 block text-xs font-medium text-text-secondary">Plano</label>
            <select value={plan} onChange={(e) => setPlan(e.target.value)} className="input">
              {["all", "essencial", "completo", "suprema"].map((p) => <option key={p} value={p}>{p === "all" ? "Todos os planos" : p}</option>)}
            </select>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button onClick={create} disabled={saving || !title.trim()} className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-primary-light px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Tag className="h-4 w-4" />} Criar oferta (gera cupom na Stripe)
          </button>
        </div>
      </div>

      {/* lista */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-3 font-bold">Ofertas ({offers.length})</h2>
        <div className="space-y-2">
          {offers.length === 0 && <p className="text-sm text-text-secondary">Nenhuma oferta ainda.</p>}
          {offers.map((o) => {
            const expired = o.ends_at && new Date(o.ends_at) < new Date();
            return (
              <div key={o.id} className={`rounded-xl border p-3 ${o.active && !expired ? "border-primary/40 bg-primary/5" : "border-border bg-surface-2"}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-sm font-semibold">{o.badge} <span className="rounded bg-primary/15 px-1.5 text-xs text-primary-light">-{o.discount_pct}%</span></p>
                    <p className="truncate text-xs text-text-secondary">{o.title} · {o.plan} · {o.ends_at ? `até ${new Date(o.ends_at).toLocaleDateString("pt-BR")}` : "sem fim"}{expired ? " · EXPIRADA" : ""}</p>
                    {o.promo_code && (
                      <button onClick={() => { navigator.clipboard.writeText(o.promo_code!); setCopied(o.id); setTimeout(() => setCopied(null), 1500); }} className="mt-1 inline-flex items-center gap-1 rounded bg-surface px-2 py-0.5 font-mono text-[11px] text-primary-light">
                        {copied === o.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />} {o.promo_code}
                      </button>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button onClick={async () => { await toggleOffer(o.id, !o.active); router.refresh(); }} title={o.active ? "Desativar" : "Ativar"} className={`rounded p-1.5 ${o.active ? "text-green" : "text-text-secondary hover:text-foreground"}`}><Power className="h-4 w-4" /></button>
                    <button onClick={async () => { if (confirm("Excluir oferta?")) { await deleteOffer(o.id); router.refresh(); } }} className="rounded p-1.5 text-text-secondary hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function In({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <div><label className="mb-1 block text-xs font-medium text-text-secondary">{label}</label><input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="input" /></div>;
}
function Num({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return <div><label className="mb-1 block text-xs font-medium text-text-secondary">{label}</label><input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} className="input" /></div>;
}
