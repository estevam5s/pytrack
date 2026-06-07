import { PageHeader } from "@/components/dashboard/page-header";
import { SettingsNav } from "./settings-nav";

export default function ConfiguracoesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <PageHeader
        title="Configurações"
        description="Gerencie sua conta, perfil, aparência e seus dados na plataforma."
      />
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <SettingsNav />
        <div className="min-w-0 space-y-6">{children}</div>
      </div>
    </div>
  );
}
