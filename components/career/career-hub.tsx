"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MessageSquare, TrendingUp, Trophy, ListChecks, Sparkles, Loader2, Plus, Trash2,
  Award, ThumbsUp, Users, Zap, Eye,
} from "lucide-react";
import { addCareerEntry, deleteCareerEntry, weeklyCheckin } from "@/lib/career-actions";

interface Entry { id: string; kind: string; title: string; description: string | null; entry_date: string }

const KINDS = [
  { id: "conquista", label: "Conquista", icon: Trophy },
  { id: "feedback", label: "Feedback Recebido", icon: ThumbsUp },
  { id: "1a1", label: "Nota de 1:1", icon: Users },
  { id: "skill", label: "Skill Adquirida", icon: Zap },
  { id: "visibilidade", label: "Ação de Visibilidade", icon: Eye },
];
const KIND_ICON: Record<string, typeof Trophy> = { conquista: Trophy, feedback: ThumbsUp, "1a1": Users, skill: Zap, visibilidade: Eye, checkin: MessageSquare };

export function CareerHub({ entries }: { entries: Entry[] }) {
  const [tab, setTab] = useState<"coach" | "evolucao">("coach");
  return (
    <div>
      <div className="mb-5 grid gap-3 sm:grid-cols-4">
        <Stat icon={MessageSquare} label="Sessões" value={entries.filter((e) => e.kind === "checkin").length} />
        <Stat icon={Trophy} label="Conquistas" value={entries.filter((e) => e.kind === "conquista").length} />
        <Stat icon={ListChecks} label="Registros" value={entries.length} />
        <Stat icon={TrendingUp} label="Skills" value={entries.filter((e) => e.kind === "skill").length} />
      </div>

      <div className="mb-5 flex gap-2">
        <Tab active={tab === "coach"} onClick={() => setTab("coach")} icon={MessageSquare}>Coach</Tab>
        <Tab active={tab === "evolucao"} onClick={() => setTab("evolucao")} icon={TrendingUp}>Evolução</Tab>
      </div>

      {tab === "coach" ? <Coach /> : <Evolucao entries={entries} />}
    </div>
  );
}

function Coach() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setLoading(true); setError(null);
    const res = await weeklyCheckin(text);
    setLoading(false);
    if (res.error) setError(res.error);
    else { setFeedback(res.feedback ?? ""); setText(""); router.refresh(); }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h2 className="flex items-center gap-2 font-bold"><Sparkles className="h-5 w-5 text-primary-light" /> Coach de Carreira</h2>
      <p className="text-sm text-text-secondary">Faça um check-in semanal para refletir sobre seu progresso e receber feedback da IA.</p>
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} placeholder="Como foi sua semana? O que aprendeu, no que avançou, quais desafios enfrentou?" className="mt-3 w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-primary" />
      <button onClick={submit} disabled={loading || !text.trim()} className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-primary-light px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Iniciar Check-in Semanal
      </button>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      {feedback && (
        <div className="mt-4 rounded-xl border border-primary/30 bg-primary/5 p-4">
          <p className="mb-1 text-xs font-semibold text-primary-light">Feedback do Coach</p>
          <p className="whitespace-pre-wrap text-sm text-text-secondary">{feedback}</p>
        </div>
      )}
    </div>
  );
}

function Evolucao({ entries }: { entries: Entry[] }) {
  const router = useRouter();
  const [kind, setKind] = useState("conquista");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [saving, setSaving] = useState(false);

  async function add() {
    setSaving(true);
    await addCareerEntry(kind, title, desc);
    setSaving(false);
    setTitle(""); setDesc(""); router.refresh();
  }
  async function del(id: string) { await deleteCareerEntry(id); router.refresh(); }

  return (
    <div>
      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-1 flex items-center gap-2 font-bold"><TrendingUp className="h-5 w-5 text-primary-light" /> Linha do Tempo</h2>
        <p className="mb-3 text-sm text-text-secondary">Registre conquistas, feedbacks e marcos da sua carreira.</p>
        <div className="flex flex-wrap gap-1.5">
          {KINDS.map((k) => <button key={k.id} onClick={() => setKind(k.id)} className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${kind === k.id ? "bg-primary text-white" : "border border-border text-text-secondary"}`}><k.icon className="h-3.5 w-3.5" /> {k.label}</button>)}
        </div>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título (ex.: Liderei o projeto X)" className="mt-3 w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-primary" />
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={2} placeholder="Descrição (opcional)" className="mt-2 w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-primary" />
        <button onClick={add} disabled={saving || !title.trim()} className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Adicionar</button>
      </div>

      <div className="mt-4 space-y-2">
        {entries.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-text-secondary">Nenhuma entrada ainda. Comece registrando uma conquista!</div>
        ) : entries.map((e) => {
          const Icon = KIND_ICON[e.kind] ?? Award;
          return (
            <div key={e.id} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary-light"><Icon className="h-4 w-4" /></span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{e.title}</p>
                {e.description && <p className="text-sm text-text-secondary">{e.description}</p>}
                <p className="mt-0.5 text-xs text-text-secondary/70">{new Date(e.entry_date).toLocaleDateString("pt-BR")}</p>
              </div>
              <button onClick={() => del(e.id)} className="rounded p-1 text-text-secondary hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Trophy; label: string; value: number }) {
  return <div className="card flex items-center gap-3 p-4"><Icon className="h-6 w-6 text-primary-light" /><div><p className="text-xl font-bold">{value}</p><p className="text-xs text-text-secondary">{label}</p></div></div>;
}
function Tab({ active, onClick, icon: Icon, children }: { active: boolean; onClick: () => void; icon: typeof Trophy; children: React.ReactNode }) {
  return <button onClick={onClick} className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium ${active ? "bg-primary text-white" : "border border-border text-text-secondary"}`}><Icon className="h-4 w-4" /> {children}</button>;
}
