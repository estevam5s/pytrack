"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, RotateCcw, Github, Layers, Sparkles, Loader2, X, Copy } from "lucide-react";
import { buildRoadmap, totalSteps, optLabel, type StackChoice } from "@/lib/saas-builder";
import { toggleSaasStep, setSaasRepo, resetSaasProject, generateBoilerplate } from "@/lib/saas-actions";

interface Project { name: string; idea: string | null; stack: StackChoice; steps_done: string[]; repo_url: string | null }

export function SaasRoadmap({ project }: { project: Project }) {
  const router = useRouter();
  const phases = buildRoadmap(project.stack);
  const total = totalSteps(phases);
  const [done, setDone] = useState(new Set(project.steps_done));
  const [repo, setRepo] = useState(project.repo_url ?? "");
  const pct = Math.round((done.size / total) * 100);
  const [genLoading, setGenLoading] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const [genError, setGenError] = useState<string | null>(null);

  async function generate() {
    setGenLoading(true); setGenError(null);
    const res = await generateBoilerplate();
    setGenLoading(false);
    if (res.error) setGenError(res.error);
    else setCode(res.code ?? "");
  }

  async function toggle(stepId: string) {
    const next = new Set(done);
    const isDone = next.has(stepId);
    if (isDone) next.delete(stepId); else next.add(stepId);
    setDone(next);
    await toggleSaasStep(stepId, !isDone);
  }

  async function reset() {
    if (!confirm("Recomeçar do zero? Isso apaga seu plano atual.")) return;
    await resetSaasProject();
    router.refresh();
  }

  const stackEntries = Object.entries(project.stack).filter(([, v]) => v && v !== "none");

  return (
    <div className="mx-auto max-w-3xl">
      {/* header */}
      <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 to-transparent p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">{project.name}</h1>
            {project.idea && <p className="mt-1 text-sm text-text-secondary">{project.idea}</p>}
          </div>
          <button onClick={reset} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-text-secondary hover:text-foreground"><RotateCcw className="h-3.5 w-3.5" /> Recomeçar</button>
        </div>
        {/* stack escolhida */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {stackEntries.map(([k, v]) => (
            <span key={k} className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-2 px-2.5 py-1 text-xs"><Layers className="h-3 w-3 text-primary-light" /> {optLabel(k as keyof StackChoice, v as string)}</span>
          ))}
        </div>
        {/* progresso */}
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs text-text-secondary"><span>Progresso do projeto</span><span>{done.size}/{total} · {pct}%</span></div>
          <div className="h-2 overflow-hidden rounded-full bg-surface-2"><div className="h-full rounded-full bg-gradient-to-r from-primary to-primary-light transition-all" style={{ width: `${pct}%` }} /></div>
        </div>
        {/* repo */}
        <div className="mt-4 flex items-center gap-2">
          <Github className="h-4 w-4 text-text-secondary" />
          <input value={repo} onChange={(e) => setRepo(e.target.value)} onBlur={() => setSaasRepo(repo)} placeholder="URL do seu repositório (opcional)" className="flex-1 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-sm outline-none focus:border-primary" />
        </div>
        {/* gerar boilerplate por IA */}
        <button onClick={generate} disabled={genLoading} className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-primary-light px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
          {genLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Gerar boilerplate com IA
        </button>
        {genError && <p className="mt-2 text-sm text-red-400">{genError}</p>}
      </div>

      {/* modal do código gerado */}
      {code !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setCode(null)}>
          <div className="flex max-h-[85vh] w-full max-w-3xl flex-col rounded-2xl border border-border bg-card" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-border p-4">
              <h3 className="flex items-center gap-2 font-bold"><Sparkles className="h-4 w-4 text-primary-light" /> Boilerplate gerado por IA</h3>
              <div className="flex gap-2">
                <button onClick={() => navigator.clipboard.writeText(code)} className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-xs"><Copy className="h-3.5 w-3.5" /> Copiar</button>
                <button onClick={() => setCode(null)} className="rounded-lg border border-border p-1"><X className="h-4 w-4" /></button>
              </div>
            </div>
            <pre className="overflow-auto p-4 text-xs leading-relaxed"><code className="whitespace-pre-wrap">{code}</code></pre>
          </div>
        </div>
      )}

      {pct === 100 && (
        <div className="mt-4 rounded-xl border border-green/30 bg-green/5 p-4 text-center text-sm text-green">🎉 Parabéns! Você construiu seu SaaS do zero ao deploy. Hora de conseguir os primeiros clientes!</div>
      )}

      {/* fases */}
      <div className="mt-5 space-y-4">
        {phases.map((phase) => {
          const phaseDone = phase.steps.filter((s) => done.has(s.id)).length;
          return (
            <div key={phase.id} className="rounded-xl border border-border bg-card p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-bold">{phase.emoji} {phase.title}</h3>
                <span className="text-xs text-text-secondary">{phaseDone}/{phase.steps.length}</span>
              </div>
              <div className="space-y-1.5">
                {phase.steps.map((s) => {
                  const checked = done.has(s.id);
                  return (
                    <button key={s.id} onClick={() => toggle(s.id)} className="flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-surface-2">
                      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${checked ? "border-primary bg-primary text-white" : "border-border"}`}>{checked && <Check className="h-3.5 w-3.5" />}</span>
                      <span className={`text-sm ${checked ? "text-text-secondary line-through" : ""}`}>{s.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
