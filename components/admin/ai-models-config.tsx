"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Save, Loader2, GripVertical, RotateCcw, Play, Clock, Server, Check } from "lucide-react";
import { ModelIcon } from "./model-icon";
import { providerLabel } from "@/lib/ai-providers";
import { saveAiModels, saveAiProvider, testModel } from "@/lib/admin-ai-actions";

type Prov = "auto" | "nvidia" | "openrouter";

const DEFAULTS = {
  nvidia: ["meta/llama-3.3-70b-instruct", "nvidia/llama-3.1-nemotron-70b-instruct", "meta/llama-3.1-70b-instruct"],
  openrouter: ["deepseek/deepseek-chat-v3-0324:free", "meta-llama/llama-3.3-70b-instruct:free", "google/gemini-2.0-flash-exp:free", "qwen/qwen-2.5-72b-instruct:free"],
};

function ModelRow({ id, i, provider, onRemove }: { id: string; i: number; provider: "nvidia" | "openrouter"; onRemove: () => void }) {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<{ ms?: number; content?: string; error?: string } | null>(null);
  async function runTest() {
    setTesting(true); setResult(null);
    const r = await testModel(id, provider);
    setTesting(false);
    setResult(r as { ms?: number; content?: string; error?: string });
  }
  return (
    <div className="rounded-lg border border-border bg-surface-2 p-2">
      <div className="flex items-center gap-2">
        <GripVertical className="h-4 w-4 shrink-0 text-text-secondary/40" />
        <span className="w-5 text-center text-xs font-bold text-text-secondary">{i + 1}</span>
        <ModelIcon modelId={id} size={26} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{providerLabel(id)}</p>
          <p className="truncate font-mono text-[11px] text-text-secondary">{id}</p>
        </div>
        <button onClick={runTest} disabled={testing} title="Testar agora" className="shrink-0 inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-[11px] text-text-secondary hover:border-primary/40 hover:text-foreground disabled:opacity-50">
          {testing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />} Testar
        </button>
        <button onClick={onRemove} className="shrink-0 rounded p-1.5 text-text-secondary hover:text-red-400"><X className="h-4 w-4" /></button>
      </div>
      {result && (
        <div className={`mt-2 rounded-md border p-2 text-xs ${result.error ? "border-red-400/30 bg-red-400/5 text-red-400" : "border-green/30 bg-green/5"}`}>
          {result.error ? (
            <span>❌ {result.error}{result.ms != null && ` (${result.ms}ms)`}</span>
          ) : (
            <div>
              <p className="mb-1 flex items-center gap-2 font-medium text-green"><Check className="h-3.5 w-3.5" /> OK <span className="inline-flex items-center gap-1 text-text-secondary"><Clock className="h-3 w-3" /> {result.ms}ms</span></p>
              <p className="text-text-secondary">{result.content}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function List({ title, hint, items, setItems, provider }: { title: string; hint: string; items: string[]; setItems: (v: string[]) => void; provider: "nvidia" | "openrouter" }) {
  const [input, setInput] = useState("");
  function add() {
    const v = input.trim();
    if (v && !items.includes(v)) setItems([...items, v]);
    setInput("");
  }
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-text-secondary">{title}</h3>
        <span className="text-[11px] text-text-secondary/60">{hint}</span>
      </div>
      <div className="space-y-1.5">
        {items.map((id, i) => (
          <ModelRow key={id} id={id} i={i} provider={provider} onRemove={() => setItems(items.filter((x) => x !== id))} />
        ))}
        {items.length === 0 && <p className="rounded-lg border border-dashed border-border p-3 text-center text-xs text-text-secondary">Nenhum modelo. Adicione ao menos um.</p>}
      </div>
      <div className="mt-2 flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} placeholder="cole o ID do modelo (ex.: google/gemini-2.0-flash-exp:free)" className="flex-1 rounded-lg border border-border bg-surface-2 px-3 py-2 font-mono text-xs outline-none focus:border-primary" />
        <button onClick={add} className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm hover:border-primary/40"><Plus className="h-4 w-4" /></button>
      </div>
    </div>
  );
}

export function AiModelsConfig({ initialNvidia, initialOpenrouter, initialProvider = "auto" }: { initialNvidia: string[]; initialOpenrouter: string[]; initialProvider?: Prov }) {
  const router = useRouter();
  const [nvidia, setNvidia] = useState(initialNvidia);
  const [openrouter, setOpenrouter] = useState(initialOpenrouter);
  const [provider, setProvider] = useState<Prov>(initialProvider);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok?: string; err?: string }>({});

  async function save() {
    setSaving(true); setMsg({});
    const res = await saveAiModels({ nvidia, openrouter });
    setSaving(false);
    if (res.error) setMsg({ err: res.error });
    else { setMsg({ ok: "Modelos atualizados! As próximas chamadas de IA já usam a nova configuração." }); router.refresh(); }
  }

  async function changeProvider(p: Prov) {
    setProvider(p);
    const res = await saveAiProvider(p);
    if (res.error) setMsg({ err: res.error });
    else { setMsg({ ok: `Provedor definido como ${p === "auto" ? "Automático" : p}.` }); router.refresh(); }
  }

  return (
    <div className="space-y-5">
      {/* seletor de provedor padrão */}
      <div>
        <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-text-secondary"><Server className="h-3.5 w-3.5" /> Provedor padrão</h3>
        <div className="flex gap-2">
          {([["auto", "Automático"], ["nvidia", "NVIDIA"], ["openrouter", "OpenRouter"]] as [Prov, string][]).map(([p, label]) => (
            <button key={p} onClick={() => changeProvider(p)} className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${provider === p ? "border-primary/50 bg-primary/10 text-primary-light" : "border-border text-text-secondary hover:border-primary/30"}`}>
              {label}
            </button>
          ))}
        </div>
        <p className="mt-1.5 text-[11px] text-text-secondary">Automático usa NVIDIA se a chave existir, senão OpenRouter. Você pode forçar um provedor aqui.</p>
      </div>

      <p className="text-xs text-text-secondary">Edite a <strong>ordem de fallback</strong> dos modelos. Se o 1º falhar, a plataforma tenta o próximo. Use <strong>Testar</strong> para validar cada modelo. Salvar afeta <strong>toda a IA da plataforma</strong> na hora.</p>

      <List title="NVIDIA" hint="modelos NVIDIA NIM" items={nvidia} setItems={setNvidia} provider="nvidia" />
      <List title="OpenRouter" hint="modelos OpenRouter (grátis/pagos)" items={openrouter} setItems={setOpenrouter} provider="openrouter" />

      {msg.err && <p className="text-sm text-red-400">{msg.err}</p>}
      {msg.ok && <p className="text-sm text-green">{msg.ok}</p>}

      <div className="flex items-center gap-2">
        <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary-light px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Salvar configuração
        </button>
        <button onClick={() => { setNvidia(DEFAULTS.nvidia); setOpenrouter(DEFAULTS.openrouter); }} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2.5 text-sm text-text-secondary hover:text-foreground">
          <RotateCcw className="h-4 w-4" /> Restaurar padrão
        </button>
      </div>
    </div>
  );
}
