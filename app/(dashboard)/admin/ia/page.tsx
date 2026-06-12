import { redirect } from "next/navigation";
import Link from "next/link";
import { Bot, Zap, Activity, Users, Server, CheckCircle2, XCircle, Sparkles, Package } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { isAdmin } from "@/lib/admin";
import { PageHeader } from "@/components/dashboard/page-header";
import { getAiAdminData } from "@/lib/admin-ai";
import { AiModelsBrowser } from "@/components/admin/ai-models-browser";
import { AiModelsConfig } from "@/components/admin/ai-models-config";

export const metadata = { title: "Gerenciar IA · Admin · PyTrack" };
export const dynamic = "force-dynamic";

export default async function AdminIaPage() {
  const me = await getCurrentUser();
  if (!isAdmin(me?.email)) redirect("/inicio");

  const a = await getAiAdminData();
  const activeProvider = a.providers.nvidia.primary ? "NVIDIA" : "OpenRouter";

  return (
    <div>
      <PageHeader title="Gerenciar IA" description="Central de toda a Inteligência Artificial da plataforma: provedores, modelos, custos e onde a IA é usada." />

      {/* provedores */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card flex items-center gap-3 p-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green/10 text-green"><Sparkles className="h-5 w-5" /></span>
          <div><p className="text-lg font-bold">{activeProvider}</p><p className="text-xs text-text-secondary">Provedor ativo</p></div>
        </div>
        <ProviderCard name="NVIDIA NIM" active={a.providers.nvidia.active} primary={a.providers.nvidia.primary} />
        <ProviderCard name="OpenRouter" active={a.providers.openrouter.active} primary={a.providers.openrouter.primary} />
        <div className="card flex items-center gap-3 p-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary-light"><Package className="h-5 w-5" /></span>
          <div><p className="text-lg font-bold">{a.modelCount}</p><p className="text-xs text-text-secondary">Modelos no catálogo · {a.freeCount} grátis</p></div>
        </div>
      </div>

      {/* uso */}
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <Stat icon={Activity} label="Chamadas de IA (total)" value={a.usage.totalCalls} />
        <Stat icon={Zap} label="Chamadas hoje" value={a.usage.callsToday} />
        <Stat icon={Users} label="Usuários que usaram IA" value={a.usage.activeUsers} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {/* modelos configurados (EDITÁVEL pelo painel) */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-1 flex items-center gap-2 font-bold"><Bot className="h-5 w-5 text-primary-light" /> Modelos da plataforma <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase text-primary-light">editável</span></h2>
            <AiModelsConfig initialNvidia={a.configuredRaw.nvidia} initialOpenrouter={a.configuredRaw.openrouter} initialProvider={a.configuredRaw.provider} />
            <p className="mt-4 rounded-lg border border-border bg-surface-2 p-3 text-xs text-text-secondary">
              💡 Os usuários do plano Suprema podem usar a <strong>própria chave de IA (BYOK)</strong> em Configurações, sem limite diário.
            </p>
          </div>

          {/* catálogo de modelos (importar) */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-1 flex items-center gap-2 font-bold"><Package className="h-5 w-5 text-primary-light" /> Catálogo de modelos (OpenRouter)</h2>
            <p className="mb-4 text-xs text-text-secondary">{a.modelCount} modelos disponíveis com preços reais. Copie o ID para usar na plataforma.</p>
            {a.models.length === 0 ? (
              <p className="text-sm text-text-secondary">Não foi possível carregar o catálogo agora. Tente recarregar.</p>
            ) : (
              <AiModelsBrowser models={a.models} />
            )}
          </div>
        </div>

        {/* onde a IA é usada */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-3 flex items-center gap-2 font-bold"><Server className="h-5 w-5 text-primary-light" /> Onde a IA é usada</h2>
          <div className="space-y-2">
            {a.features.map((f) => (
              <Link key={f.name} href={f.route} className="block rounded-xl border border-border bg-surface-2 p-3 transition-colors hover:border-primary/40">
                <p className="text-sm font-semibold">{f.name}</p>
                <p className="text-xs text-text-secondary">{f.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProviderCard({ name, active, primary }: { name: string; active: boolean; primary: boolean }) {
  return (
    <div className={`card flex items-center gap-3 p-4 ${primary ? "ring-1 ring-green/30" : ""}`}>
      <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${active ? "bg-green/10 text-green" : "bg-surface-2 text-text-secondary"}`}>
        {active ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
      </span>
      <div><p className="text-sm font-bold">{name}</p><p className="text-xs text-text-secondary">{active ? (primary ? "Conectado · ativo" : "Conectado") : "Não configurado"}</p></div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Bot; label: string; value: number }) {
  return <div className="card flex items-center gap-3 p-4"><Icon className="h-6 w-6 text-primary-light" /><div><p className="text-2xl font-bold">{value}</p><p className="text-xs text-text-secondary">{label}</p></div></div>;
}

