"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Loader2, Trash2, Mail, Users, CheckCircle2 } from "lucide-react";
import { sendCampaign, removeSubscriber } from "@/lib/admin-newsletter";

interface Sub { id: string; email: string; status: string; source: string; created_at: string }
interface Campaign { id: string; subject: string; status: string; sent_count: number; created_at: string; sent_at: string | null }

export function NewsletterManager({ data }: { data: { subscribers: Sub[]; active: number; total: number; bySource: Record<string, number>; campaigns: Campaign[] } }) {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function send() {
    if (!confirm(`Enviar para ${data.active} inscritos ativos?`)) return;
    setSending(true); setResult(null);
    const res = await sendCampaign(subject, body);
    setSending(false);
    if (res.error) setResult(`Erro: ${res.error}`);
    else { setResult(`✅ Enviada para ${res.sent} inscritos!`); setSubject(""); setBody(""); router.refresh(); }
  }
  async function del(id: string) { if (confirm("Remover inscrito?")) { await removeSubscriber(id); router.refresh(); } }

  return (
    <div className="space-y-6">
      {/* stats */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat icon={Users} label="Inscritos ativos" value={data.active} />
        <Stat icon={Mail} label="Total" value={data.total} />
        <Stat icon={Send} label="Campanhas enviadas" value={data.campaigns.filter((c) => c.status === "sent").length} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* composer */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-3 flex items-center gap-2 font-bold"><Send className="h-5 w-5 text-primary-light" /> Nova campanha</h2>
          <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Assunto do e-mail" className="mb-2 w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-primary" />
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={10} placeholder="Conteúdo (separe parágrafos com linha em branco)…" className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-primary" />
          {result && <p className={`mt-2 text-sm ${result.startsWith("Erro") ? "text-red-400" : "text-green"}`}>{result}</p>}
          <button onClick={send} disabled={sending || !subject.trim() || !body.trim()} className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-primary-light px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Enviar para {data.active} inscritos
          </button>

          {/* histórico */}
          {data.campaigns.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-semibold">Histórico</p>
              <div className="space-y-1.5">
                {data.campaigns.map((c) => (
                  <div key={c.id} className="flex items-center justify-between rounded-lg border border-border bg-surface-2 p-2.5 text-sm">
                    <span className="truncate">{c.subject}</span>
                    <span className="ml-2 inline-flex shrink-0 items-center gap-1 text-xs text-text-secondary">{c.status === "sent" ? <CheckCircle2 className="h-3.5 w-3.5 text-green" /> : null} {c.sent_count} envios</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* inscritos */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-3 font-bold">Inscritos ({data.total})</h2>
          <div className="max-h-[480px] space-y-1.5 overflow-y-auto">
            {data.subscribers.map((s) => (
              <div key={s.id} className="flex items-center justify-between gap-2 rounded-lg border border-border bg-surface-2 p-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm">{s.email}</p>
                  <p className="text-[11px] text-text-secondary">{s.source} · {s.status} · {new Date(s.created_at).toLocaleDateString("pt-BR")}</p>
                </div>
                <button onClick={() => del(s.id)} className="shrink-0 rounded p-1 text-text-secondary hover:text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            ))}
            {data.subscribers.length === 0 && <p className="py-4 text-center text-sm text-text-secondary">Nenhum inscrito ainda.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: number }) {
  return <div className="card flex items-center gap-3 p-4"><Icon className="h-6 w-6 text-primary-light" /><div><p className="text-2xl font-bold">{value}</p><p className="text-xs text-text-secondary">{label}</p></div></div>;
}
