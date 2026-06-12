"use client";

import { useActionState, useState } from "react";
import { AlertCircle, CheckCircle2, Save, Zap } from "lucide-react";
import {
  saveAiSettings,
  testAiSettings,
  type AiSettingsResult,
} from "@/app/(dashboard)/configuracoes/ia/actions";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const PROVIDERS: Record<string, { label: string; base: string; modelHint: string }> = {
  openrouter: { label: "OpenRouter (recomendado)", base: "https://openrouter.ai/api/v1", modelHint: "anthropic/claude-3.5-sonnet" },
  openai: { label: "OpenAI", base: "https://api.openai.com/v1", modelHint: "gpt-4o-mini" },
  deepseek: { label: "DeepSeek", base: "https://api.deepseek.com/v1", modelHint: "deepseek-chat" },
  groq: { label: "Groq", base: "https://api.groq.com/openai/v1", modelHint: "llama-3.3-70b-versatile" },
  nvidia: { label: "Nvidia NIM", base: "https://integrate.api.nvidia.com/v1", modelHint: "meta/llama-3.1-70b-instruct" },
  gemini: { label: "Google Gemini", base: "https://generativelanguage.googleapis.com/v1beta/openai", modelHint: "gemini-2.0-flash" },
  custom: { label: "Outro (compatível com OpenAI)", base: "", modelHint: "modelo" },
};

interface Settings {
  provider: string | null;
  base_url: string | null;
  model: string | null;
  enabled: boolean;
  hasKey: boolean;
}

export function AiSettingsForm({ settings }: { settings: Settings }) {
  const [provider, setProvider] = useState(settings.provider ?? "openrouter");
  const [baseUrl, setBaseUrl] = useState(settings.base_url ?? PROVIDERS.openrouter.base);
  const [model, setModel] = useState(settings.model ?? "");

  const [saveState, saveAction] = useActionState<AiSettingsResult, FormData>(saveAiSettings, {});
  const [testState, testAction] = useActionState<AiSettingsResult, FormData>(testAiSettings, {});

  function onProvider(p: string) {
    setProvider(p);
    if (PROVIDERS[p]?.base) setBaseUrl(PROVIDERS[p].base);
  }

  const msg = saveState.error || saveState.success ? saveState : testState;

  return (
    <form className="space-y-4">
      {msg.error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          <AlertCircle className="h-4 w-4" /> {msg.error}
        </div>
      )}
      {msg.success && (
        <div className="flex items-center gap-2 rounded-lg border border-green/30 bg-green/10 px-3 py-2 text-sm text-green">
          <CheckCircle2 className="h-4 w-4" /> {msg.success}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Provedor</label>
          <select
            name="provider"
            value={provider}
            onChange={(e) => onProvider(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
          >
            {Object.entries(PROVIDERS).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Modelo</label>
          <Input name="model" value={model} onChange={(e) => setModel(e.target.value)} placeholder={PROVIDERS[provider]?.modelHint} />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Endpoint (base URL, compatível com OpenAI)</label>
        <Input name="base_url" value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} placeholder="https://openrouter.ai/api/v1" />
        <p className="text-xs text-text-secondary">O caminho <code>/chat/completions</code> é adicionado automaticamente.</p>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Chave de API</label>
        <Input name="api_key" type="password" placeholder={settings.hasKey ? "•••••••• (deixe em branco para manter)" : "sk-..."} autoComplete="off" />
        <p className="text-xs text-text-secondary">Sua chave é privada (protegida por RLS) e usada apenas nas suas chamadas de IA.</p>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="enabled" defaultChecked={settings.enabled} className="h-4 w-4 rounded border-border accent-[rgb(var(--primary))]" />
        Usar minha IA personalizada (se desmarcado, usa a IA padrão da plataforma)
      </label>

      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          formAction={saveAction}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary-light px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          <Save className="h-4 w-4" /> Salvar
        </button>
        <button
          type="submit"
          formAction={testAction}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-card",
          )}
        >
          <Zap className="h-4 w-4" /> Testar conexão
        </button>
      </div>
    </form>
  );
}
