import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { isAdmin } from "@/lib/admin";
import { getLogoUrl } from "@/lib/data/site-settings";
import { PageHeader } from "@/components/dashboard/page-header";
import { BrandingManager } from "@/components/admin/branding-manager";

export const metadata = { title: "Marca / Logo · Admin · PyTrack" };
export const dynamic = "force-dynamic";

export default async function AdminMarcaPage() {
  const me = await getCurrentUser();
  if (!isAdmin(me?.email)) redirect("/inicio");
  const logo = await getLogoUrl();
  return (
    <div>
      <PageHeader title="Marca / Logo" description="Defina o logo do PyTrack — aplicado automaticamente no site, plataforma, e-mails e SEO." />
      <BrandingManager current={logo} />
    </div>
  );
}
