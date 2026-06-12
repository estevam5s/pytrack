"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2, Wand2, RefreshCw, ArrowRight, Lock, Compass, Route, X, Trash2 } from "lucide-react";
import { generateCareerPlan, clearCareerPlan, type CareerAnswers } from "@/lib/career-plan-actions";
import { TRILHAS } from "@/lib/trilhas";
import { Markdown } from "@/components/content/markdown";

interface Plan { plan: string; recommended_tracks: string[]; answers?: CareerAnswers }

const TRACK_TITLE = Object.fromEntries(TRILHAS.map((t) => [t.id, t.title]));
const DISMISS_KEY = "pytrack-career-dismissed";

// modal centralizado reutilizável
function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4" onClick={onClose}>
      <div className="my-8 w-full max-w-2xl rounded-2xl border border-border bg-card shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

export function CareerPlanPanel({ tier, initial }: { tier: string; initial: Plan | null }) {
  const router = useRouter();
  const isSuprema = tier === "suprema" || tier === "vitalicio";
  const [plan, setPlan] = useState<Plan | null>(initial);
  const [view, setView] = useState<"none" | "quiz" | "plan">("none");
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!plan && localStorage.getItem(DISMISS_KEY) === "1") setDismissed(true);
  }, [plan]);

  function dismiss() { localStorage.setItem(DISMISS_KEY, "1"); setDismissed(true); }
  function undismiss() { localStorage.removeItem(DISMISS_KEY); setDismissed(false); }

  // ——— não Suprema: upsell ———
  if (!isSuprema) {
    return (
      <div className="mb-6 overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary-light"><Wand2 className="h-5 w-5" /></span>
            <div>
              <p className="flex items-center gap-2 font-bold">Carreira Personalizada com IA <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-bold uppercase text-primary-light">Suprema</span></p>
              <p className="text-sm text-text-secondary">A IA entende seu momento de carreira e monta uma jornada de trilhas sob medida, que evolui com você.</p>
            </div>
          </div>
          <Link href="/assinar?upgrade=suprema" className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-primary-light px-4 py-2 text-sm font-semibold text-white"><Lock className="h-3.5 w-3.5" /> Desbloquear</Link>
        </div>
      </div>
    );
  }

  // ——— Suprema dispensou e não tem plano: link discreto p/ reativar ———
  if (dismissed && !plan) {
    return (
      <div className="mb-6 flex items-center justify-between rounded-xl border border-border bg-surface-2/40 px-4 py-2.5 text-sm text-text-secondary">
        <span className="inline-flex items-center gap-2"><Route className="h-4 w-4" /> Você está escolhendo as trilhas livremente.</span>
        <button onClick={() => { undismiss(); setView("quiz"); }} className="inline-flex items-center gap-1.5 text-primary-light hover:underline"><Sparkles className="h-3.5 w-3.5" /> Quero um plano com IA</button>
      </div>
    );
  }

  return (
    <>
      {/* card inline */}
      {plan ? (
        <div className="mb-6 rounded-2xl border border-primary/30 bg-card p-6">
          <div className="mb-3 flex items-center justify-between">
            <p className="flex items-center gap-2 font-bold"><Compass className="h-5 w-5 text-primary-light" /> Seu plano de carreira personalizado</p>
            <div className="flex gap-2">
              <button onClick={() => setView("plan")} className="rounded-lg bg-gradient-to-r from-primary to-primary-light px-3 py-1.5 text-xs font-semibold text-white">Ver plano</button>
              <button onClick={() => setView("quiz")} className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs hover:border-primary/40"><RefreshCw className="h-3.5 w-3.5" /> Refazer</button>
            </div>
          </div>
          {plan.recommended_tracks.length > 0 && (
            <div className="space-y-2">
              {plan.recommended_tracks.map((id, i) => (
                <Link key={id} href={`/minhas-trilhas/${id}`} className="flex items-center gap-3 rounded-xl border border-border bg-surface-2 p-3 transition-colors hover:border-primary/40">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary-light">{i + 1}</span>
                  <Route className="h-4 w-4 text-text-secondary" />
                  <span className="flex-1 text-sm font-medium">{TRACK_TITLE[id] ?? id}</span>
                  <ArrowRight className="h-4 w-4 text-text-secondary" />
                </Link>
              ))}
            </div>
          )}
          <p className="mt-3 text-xs text-text-secondary">Você também pode <span className="text-foreground">explorar qualquer trilha</span> livremente abaixo.</p>
        </div>
      ) : (
        <div className="mb-6 overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary-light"><Wand2 className="h-5 w-5" /></span>
              <div>
                <p className="font-bold">Carreira Personalizada com IA</p>
                <p className="text-sm text-text-secondary">Responda algumas perguntas e a IA monta sua jornada de trilhas sob medida — ou escolha você mesmo as trilhas abaixo.</p>
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <button onClick={() => setView("quiz")} className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-primary-light px-4 py-2 text-sm font-semibold text-white"><Sparkles className="h-4 w-4" /> Criar com IA</button>
              <button onClick={dismiss} className="rounded-lg border border-border px-4 py-2 text-sm text-text-secondary hover:text-foreground">Prefiro escolher</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: questionário */}
      {view === "quiz" && (
        <Modal onClose={() => setView("none")}>
          <Questionnaire
            onDone={(p) => { setPlan(p); setView("plan"); router.refresh(); }}
            onClose={() => setView("none")}
            hasPlan={!!plan}
            clear={async () => { await clearCareerPlan(); setPlan(null); setView("none"); router.refresh(); }}
          />
        </Modal>
      )}

      {/* MODAL: plano completo (markdown renderizado) */}
      {view === "plan" && plan && (
        <Modal onClose={() => setView("none")}>
          <div className="flex items-center justify-between border-b border-border p-5">
            <h3 className="flex items-center gap-2 font-bold"><Compass className="h-5 w-5 text-primary-light" /> Seu plano de carreira</h3>
            <button onClick={() => setView("none")} className="rounded-lg p-1 text-text-secondary hover:bg-surface-2"><X className="h-5 w-5" /></button>
          </div>
          <div className="max-h-[65vh] overflow-y-auto p-6">
            {plan.recommended_tracks.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {plan.recommended_tracks.map((id, i) => (
                  <Link key={id} href={`/minhas-trilhas/${id}`} className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary-light hover:bg-primary/20"><span className="font-bold">{i + 1}.</span> {TRACK_TITLE[id] ?? id}</Link>
                ))}
              </div>
            )}
            <Markdown>{plan.plan}</Markdown>
          </div>
          <div className="flex justify-between gap-2 border-t border-border p-4">
            <button onClick={async () => { await clearCareerPlan(); setPlan(null); setView("none"); router.refresh(); }} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm text-text-secondary hover:text-red-400"><Trash2 className="h-4 w-4" /> Apagar plano</button>
            <button onClick={() => setView("quiz")} className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-primary-light px-4 py-2 text-sm font-semibold text-white"><RefreshCw className="h-4 w-4" /> Refazer</button>
          </div>
        </Modal>
      )}
    </>
  );
}

function Questionnaire({ onDone, onClose, hasPlan, clear }: { onDone: (p: Plan) => void; onClose: () => void; hasPlan: boolean; clear: () => void }) {
  const [a, setA] = useState<CareerAnswers>({ objetivo: "", nivel: "Iniciante", area: "Backend", tempo: "10", prazo: "6 meses", contexto: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function gen() {
    setLoading(true); setError(null);
    const res = await generateCareerPlan(a);
    setLoading(false);
    if (res.error) setError(res.error);
    else onDone({ plan: res.plan ?? "", recommended_tracks: res.tracks ?? [], answers: a });
  }
  const set = (k: keyof CareerAnswers, v: string) => setA((p) => ({ ...p, [k]: v }));

  return (
    <>
      <div className="flex items-center justify-between border-b border-border p-5">
        <h3 className="flex items-center gap-2 font-bold"><Sparkles className="h-5 w-5 text-primary-light" /> Carreira Personalizada com IA</h3>
        <button onClick={onClose} className="rounded-lg p-1 text-text-secondary hover:bg-surface-2"><X className="h-5 w-5" /></button>
      </div>
      <div className="max-h-[65vh] overflow-y-auto p-6">
        <p className="mb-4 text-sm text-text-secondary">Responda e a IA monta sua jornada de trilhas sob medida.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Qual é o seu objetivo?"><input value={a.objetivo} onChange={(e) => set("objetivo", e.target.value)} placeholder="Ex.: Virar engenheiro de dados" className="input" /></Field>
          <Field label="Área de interesse">
            <select value={a.area} onChange={(e) => set("area", e.target.value)} className="input">{["Backend", "Dados / Analytics", "Machine Learning / IA", "DevOps / Cloud", "Visão Computacional", "NLP / LLMs", "Automação", "IoT", "Segurança", "Game Dev", "Ainda decidindo"].map((x) => <option key={x}>{x}</option>)}</select>
          </Field>
          <Field label="Nível atual"><select value={a.nivel} onChange={(e) => set("nivel", e.target.value)} className="input">{["Iniciante", "Intermediário", "Avançado"].map((x) => <option key={x}>{x}</option>)}</select></Field>
          <Field label="Horas de estudo/semana"><input type="number" value={a.tempo} onChange={(e) => set("tempo", e.target.value)} className="input" /></Field>
          <Field label="Em quanto tempo quer chegar lá?"><select value={a.prazo} onChange={(e) => set("prazo", e.target.value)} className="input">{["3 meses", "6 meses", "1 ano", "2 anos"].map((x) => <option key={x}>{x}</option>)}</select></Field>
          <Field label="Seu momento de carreira (opcional)"><input value={a.contexto} onChange={(e) => set("contexto", e.target.value)} placeholder="Ex.: Estou migrando de área" className="input" /></Field>
        </div>
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      </div>
      <div className="flex flex-wrap justify-end gap-2 border-t border-border p-4">
        {hasPlan && <button onClick={clear} className="mr-auto rounded-lg border border-border px-4 py-2 text-sm text-text-secondary">Apagar plano</button>}
        <button onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm">Cancelar</button>
        <button onClick={gen} disabled={loading || !a.objetivo.trim()} className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-primary-light px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />} Gerar minha jornada
        </button>
      </div>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="mb-1 block text-xs font-medium text-text-secondary">{label}</label>{children}</div>;
}
