"use client";

import { useState } from "react";
import { Sparkles, Loader2, BookOpen, CalendarRange, Compass, Wallet, Calculator } from "lucide-react";
import { generateStudyPlan } from "@/lib/planning-actions";

export function PlanningHub() {
  const [tab, setTab] = useState<"plano" | "financeiro">("plano");
  return (
    <div>
      <div className="mb-5 flex gap-2">
        <button onClick={() => setTab("plano")} className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium ${tab === "plano" ? "bg-primary text-white" : "border border-border text-text-secondary"}`}><Sparkles className="h-4 w-4" /> Plano de Estudos & Carreira (IA)</button>
        <button onClick={() => setTab("financeiro")} className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium ${tab === "financeiro" ? "bg-primary text-white" : "border border-border text-text-secondary"}`}><Wallet className="h-4 w-4" /> Planejamento Financeiro</button>
      </div>
      {tab === "plano" ? <StudyPlanner /> : <FinancialPlanner />}
    </div>
  );
}

function StudyPlanner() {
  const [goal, setGoal] = useState("");
  const [level, setLevel] = useState("Iniciante");
  const [hours, setHours] = useState("10");
  const [career, setCareer] = useState("Backend Developer");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setLoading(true); setError(null);
    const res = await generateStudyPlan({ goal, level, hours, career });
    setLoading(false);
    if (res.error) setError(res.error);
    else setPlan(res.plan ?? "");
  }

  return (
    <div>
      <div className="grid gap-3 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2">
        <Field label="Seu objetivo"><input value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="Ex.: Migrar para a área de dados em 6 meses" className="input" /></Field>
        <Field label="Carreira desejada">
          <select value={career} onChange={(e) => setCareer(e.target.value)} className="input">
            {["Backend Developer", "Data Analyst", "Data Scientist", "ML Engineer", "DevOps Engineer", "Full Stack", "Automação/QA"].map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Nível atual">
          <select value={level} onChange={(e) => setLevel(e.target.value)} className="input">
            {["Iniciante", "Intermediário", "Avançado"].map((l) => <option key={l}>{l}</option>)}
          </select>
        </Field>
        <Field label="Horas de estudo por semana"><input type="number" value={hours} onChange={(e) => setHours(e.target.value)} className="input" /></Field>
      </div>
      <button onClick={generate} disabled={loading || !goal.trim()} className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-primary-light px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Gerar meu plano com IA
      </button>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}

      {!plan && !loading && (
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Feature icon={BookOpen} title="Plano de Estudos" desc="Tópicos na ordem certa para o seu objetivo." />
          <Feature icon={CalendarRange} title="Planejamento Semanal" desc="O que estudar em cada dia da semana." />
          <Feature icon={Compass} title="Guia de Carreira" desc="Passos até o primeiro emprego ou cliente." />
        </div>
      )}

      {plan && (
        <div className="mt-6 rounded-2xl border border-border bg-card p-6">
          <div className="prose-plan whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">{plan}</div>
        </div>
      )}
    </div>
  );
}

function FinancialPlanner() {
  const [rate, setRate] = useState("80");
  const [hours, setHours] = useState("20");
  const [months, setMonths] = useState("12");
  const monthly = (Number(rate) || 0) * (Number(hours) || 0) * 4;
  const yearly = monthly * 12;
  const goalProgress = months ? (monthly * Number(months)) : 0;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="flex items-center gap-2 font-bold"><Calculator className="h-5 w-5 text-primary-light" /> Calculadora de renda (freelance Python)</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Field label="Valor/hora (R$)"><input type="number" value={rate} onChange={(e) => setRate(e.target.value)} className="input" /></Field>
          <Field label="Horas/semana"><input type="number" value={hours} onChange={(e) => setHours(e.target.value)} className="input" /></Field>
          <Field label="Meses de meta"><input type="number" value={months} onChange={(e) => setMonths(e.target.value)} className="input" /></Field>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Stat label="Renda mensal estimada" value={`R$ ${monthly.toLocaleString("pt-BR")}`} />
          <Stat label="Renda anual estimada" value={`R$ ${yearly.toLocaleString("pt-BR")}`} />
          <Stat label={`Em ${months} meses`} value={`R$ ${goalProgress.toLocaleString("pt-BR")}`} />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="font-bold">Faixas salariais Python (Brasil, 2026)</h3>
        <div className="mt-3 space-y-2 text-sm">
          {[["Júnior", "R$ 3.000 – 6.000"], ["Pleno", "R$ 6.000 – 12.000"], ["Sênior", "R$ 12.000 – 22.000"], ["Especialista (ML/Dados)", "R$ 18.000 – 35.000+"]].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between border-b border-border/50 pb-2"><span className="text-text-secondary">{k}</span><span className="font-semibold">{v}</span></div>
          ))}
        </div>
        <p className="mt-3 text-xs text-text-secondary">Use a meta de renda para definir quanto estudar e quando migrar de cargo. Dica: reserve 20–30% para impostos/INSS como autônomo.</p>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="mb-1 block text-xs font-medium text-text-secondary">{label}</label>{children}</div>;
}
function Stat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-border bg-surface-2 p-3 text-center"><p className="text-lg font-bold text-primary-light">{value}</p><p className="text-[10px] text-text-secondary">{label}</p></div>;
}
function Feature({ icon: Icon, title, desc }: { icon: typeof BookOpen; title: string; desc: string }) {
  return <div className="rounded-xl border border-border bg-card p-4"><Icon className="h-5 w-5 text-primary-light" /><p className="mt-2 text-sm font-semibold">{title}</p><p className="text-xs text-text-secondary">{desc}</p></div>;
}
