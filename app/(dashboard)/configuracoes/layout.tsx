import { PageHeader } from "@/components/dashboard/page-header";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { isAdmin } from "@/lib/admin";
import { SettingsNav } from "./settings-nav";

export default async function ConfiguracoesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const admin = isAdmin(user?.email);

  return (
    <div>
      <PageHeader
        title="Configurações"
        description="Gerencie sua conta, perfil, aparência e seus dados na plataforma."
      />
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <SettingsNav isAdmin={admin} />
        <div className="min-w-0 space-y-6">{children}</div>
      </div>
    </div>
  );
}
