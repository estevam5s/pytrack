import { redirect } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { isAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SiteSettingsForm } from "@/components/admin/site-settings-form";

export const metadata = { title: "Configuração do site · Admin · PyTrack" };
export const dynamic = "force-dynamic";

export default async function AdminSitePage() {
  const me = await getCurrentUser();
  if (!isAdmin(me?.email)) redirect("/inicio");

  const admin = createAdminClient();
  const { data } = await admin.from("site_settings").select("*").eq("id", 1).maybeSingle();

  const settings = {
    default_locale: data?.default_locale ?? "pt",
    maintenance: data?.maintenance ?? false,
    signups_enabled: data?.signups_enabled ?? true,
    announcement: data?.announcement ?? null,
    announcement_type: data?.announcement_type ?? "info",
    announcement_link: data?.announcement_link ?? null,
    primary_contact: data?.primary_contact ?? "contato@estevamsouza.com.br",
    social_github: data?.social_github ?? "https://github.com/PyTrackOrganization",
    social_linkedin: data?.social_linkedin ?? "",
  };

  return (
    <div>
      <PageHeader
        title="Configuração do site"
        description="Gerencie idioma, contato, redes sociais, cadastros e manutenção do site."
      />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-primary" /> Configurações globais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SiteSettingsForm settings={settings} />
        </CardContent>
      </Card>
    </div>
  );
}
