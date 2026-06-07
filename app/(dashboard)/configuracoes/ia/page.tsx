import { Bot, Info } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AiSettingsForm } from "@/components/settings/ai-settings-form";

export const metadata = { title: "IA & Modelos · Configurações · PyTrack" };
export const dynamic = "force-dynamic";

export default async function IaSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = user
    ? await supabase
        .from("user_ai_settings")
        .select("provider, base_url, model, enabled, api_key")
        .eq("user_id", user.id)
        .maybeSingle()
    : { data: null };

  const settings = {
    provider: data?.provider ?? "openrouter",
    base_url: data?.base_url ?? null,
    model: data?.model ?? null,
    enabled: data?.enabled ?? false,
    hasKey: Boolean(data?.api_key),
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/30">
        <CardContent className="flex items-center gap-3 p-5">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary-light">
            <Bot className="h-5 w-5" />
          </span>
          <div>
            <p className="font-semibold">IA & Modelos (use a sua própria IA)</p>
            <p className="text-sm text-text-secondary">
              A correção de exercícios (Essencial) e o consultor de carreira
              (Completo) usam IA. Se a IA padrão apresentar problemas, você pode
              usar a <strong>sua própria chave e modelo</strong>.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configuração</CardTitle>
        </CardHeader>
        <CardContent>
          <AiSettingsForm settings={settings} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-4 w-4 text-primary" /> Provedores e modelos suportados
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-text-secondary">
          <p>
            Funciona com qualquer API <strong>compatível com OpenAI</strong>. Exemplos:
          </p>
          <ul className="ml-4 list-disc space-y-1">
            <li><strong>OpenRouter</strong> (recomendado) — acessa Claude, Gemini, DeepSeek, Grok, Nvidia, GPT e mais com um só endpoint. Ex.: <code>anthropic/claude-3.5-sonnet</code>, <code>google/gemini-2.0-flash</code>, <code>deepseek/deepseek-chat</code>, <code>x-ai/grok-2</code>.</li>
            <li><strong>OpenAI</strong> — <code>gpt-4o-mini</code></li>
            <li><strong>DeepSeek</strong> — <code>deepseek-chat</code></li>
            <li><strong>Groq</strong> — <code>llama-3.3-70b-versatile</code></li>
            <li><strong>Nvidia NIM</strong> e <strong>Gemini</strong> (endpoint compatível com OpenAI)</li>
          </ul>
          <p>
            Deixe <em>desativado</em> para continuar usando a IA padrão da plataforma
            (que segue funcionando normalmente).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
