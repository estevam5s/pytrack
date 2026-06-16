import { redirect } from "next/navigation";
import { Puzzle } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { isAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { tierOf, tierAtLeast } from "@/lib/billing-access";
import { PageHeader } from "@/components/dashboard/page-header";
import { ExtensionManager } from "@/components/admin/extension-manager";

export const metadata = { title: "Gerenciar extensão · Admin · PyTrack" };
export const dynamic = "force-dynamic";

export default async function AdminExtensaoPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");
  if (!isAdmin(user.email)) redirect("/inicio");

  const admin = createAdminClient();
  const { data: meta } = await admin
    .from("extension_meta")
    .select("version, vsix_path, marketplace_url, changelog, updated_at")
    .eq("id", 1)
    .maybeSingle();

  // lista arquivos no bucket
  const { data: files } = await admin.storage.from("extension").list("", { limit: 50 });

  // assinantes: total ativos + quantos têm Suprema (que realmente usam a extensão)
  const { data: subs } = await admin
    .from("subscriptions")
    .select("status, stripe_price_id, metadata")
    .in("status", ["active", "trialing"]);
  const ativos = (subs ?? []).length;
  const suprema = (subs ?? []).filter((s) => tierAtLeast(tierOf(s as never), "suprema")).length;

  return (
    <div>
      <PageHeader
        title="Gerenciar extensão VS Code"
        description="Faça upload de novas versões do .vsix, atualize a versão, link da Marketplace e changelog."
      />
      <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-sm text-primary-light">
        <span className="inline-flex items-center gap-1.5"><Puzzle className="h-4 w-4" /> Arquivos no bucket: {files?.length ?? 0}</span>
        <span>Assinantes ativos: <strong>{ativos}</strong></span>
        <span>Podem usar a extensão (Suprema+): <strong>{suprema}</strong></span>
      </div>
      <div className="mb-4 rounded-lg border border-border bg-surface-2 px-3 py-2 text-xs text-text-secondary">
        📦 Extensões do VS Code (código em <code>extensions/</code>): <strong>extension-vscode</strong> (principal), <strong>extension-vscode-autocomplete</strong> e <strong>extension-vscode-theme</strong>.
      </div>
      <ExtensionManager
        meta={{
          version: meta?.version ?? "1.0.0",
          vsix_path: meta?.vsix_path ?? "",
          marketplace_url: meta?.marketplace_url ?? "",
          changelog: meta?.changelog ?? "",
          updated_at: meta?.updated_at ?? null,
        }}
        files={(files ?? []).map((f) => ({ name: f.name, size: (f.metadata?.size as number) ?? 0 }))}
      />
    </div>
  );
}
