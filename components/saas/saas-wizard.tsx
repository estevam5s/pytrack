"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Loader2, Rocket, Check } from "lucide-react";
import { STACK_GROUPS, type StackChoice } from "@/lib/saas-builder";
import { createSaasProject } from "@/lib/saas-actions";

export function SaasWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [idea, setIdea] = useState("");
  const [stack, setStack] = useState<StackChoice>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = STACK_GROUPS.length + 1; // +1 = tela inicial

  function pick(key: keyof StackChoice, id: string) {
    setStack((s) => ({ ...s, [key]: id }));
  }

  async function finish() {
    setSaving(true); setError(null);
    const res = await createSaasProject({ name, idea, stack });
    setSaving(false);
    if (res.error) setError(res.error);
    else router.refresh();
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* progresso */}
      <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-surface-2">
        <div className="h-full rounded-full bg-gradient-to-r from-primary to-primary-light transition-all" style={{ width: `${((step + 1) / total) * 100}%` }} />
      </div>

      {step === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-6">
          <Rocket className="h-8 w-8 text-primary-light" />
          <h2 className="mt-2 text-2xl font-bold">Sobre o seu SaaS</h2>
          <p className="text-sm text-text-secondary">Dê um nome e descreva a ideia. Vamos montar um plano de construção sob medida.</p>
          <div className="mt-4 space-y-3">
            <div><label className="mb-1 block text-xs font-medium text-text-secondary">Nome do SaaS *</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: TaskFlow" className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-primary" /></div>
            <div><label className="mb-1 block text-xs font-medium text-text-secondary">Qual problema ele resolve?</label>
              <textarea value={idea} onChange={(e) => setIdea(e.target.value)} rows={3} placeholder="Ex.: Gestão de tarefas para freelancers com cobrança automática." className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-primary" /></div>
          </div>
          <button disabled={!name.trim()} onClick={() => setStep(1)} className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-primary-light px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
            Escolher a stack <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      ) : (
        (() => {
          const group = STACK_GROUPS[step - 1];
          const selected = stack[group.key];
          const isLast = step === STACK_GROUPS.length;
          return (
            <div className="rounded-2xl border border-border bg-card p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">Passo {step} de {STACK_GROUPS.length}</p>
              <h2 className="mt-1 text-xl font-bold">{group.title}</h2>
              <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {group.options.map((o) => (
                  <button key={o.id} onClick={() => pick(group.key, o.id)} className={`flex items-start gap-2 rounded-xl border p-3 text-left transition-colors ${selected === o.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
                    <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${selected === o.id ? "border-primary bg-primary text-white" : "border-border"}`}>{selected === o.id && <Check className="h-3 w-3" />}</span>
                    <span><span className="block text-sm font-semibold">{o.label}</span><span className="block text-xs text-text-secondary">{o.desc}</span></span>
                  </button>
                ))}
              </div>
              {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
              <div className="mt-5 flex justify-between">
                <button onClick={() => setStep(step - 1)} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm"><ArrowLeft className="h-4 w-4" /> Voltar</button>
                {isLast ? (
                  <button onClick={finish} disabled={saving} className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-primary-light px-5 py-2 text-sm font-semibold text-white disabled:opacity-60">
                    {saving && <Loader2 className="h-4 w-4 animate-spin" />} Gerar meu plano 🚀
                  </button>
                ) : (
                  <button onClick={() => setStep(step + 1)} className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-primary-light px-5 py-2 text-sm font-semibold text-white">Próximo <ArrowRight className="h-4 w-4" /></button>
                )}
              </div>
            </div>
          );
        })()
      )}
    </div>
  );
}
