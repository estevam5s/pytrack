import { redirect } from "next/navigation";
import { Puzzle } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { isAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
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

  // estatística: quantos Suprema podem baixar
  const { count: suprema } = await admin
    .from("subscriptions")
    .select("user_id", { count: "exact", head: true })
    .in("status", ["active", "trialing"]);

  return (
    <div>
      <PageHeader
        title="Gerenciar extensão VS Code"
        description="Faça upload de novas versões do .vsix, atualize a versão, link da Marketplace e changelog."
      />
      <div className="mb-4 flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-sm text-primary-light">
        <Puzzle className="h-4 w-4" /> Arquivos no bucket: {files?.length ?? 0} · Assinantes ativos: {suprema ?? 0}
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
