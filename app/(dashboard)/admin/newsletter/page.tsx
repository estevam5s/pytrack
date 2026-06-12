import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { isAdmin } from "@/lib/admin";
import { PageHeader } from "@/components/dashboard/page-header";
import { NewsletterManager } from "@/components/admin/newsletter-manager";
import { getNewsletterData } from "@/lib/admin-newsletter";

export const metadata = { title: "Newsletter · Admin · PyTrack" };
export const dynamic = "force-dynamic";

export default async function AdminNewsletterPage() {
  const me = await getCurrentUser();
  if (!isAdmin(me?.email)) redirect("/inicio");

  const data = await getNewsletterData();

  return (
    <div>
      <PageHeader title="Newsletter" description="Gerencie os inscritos e envie campanhas mensais sobre Python e a plataforma." />
      <NewsletterManager data={data} />
    </div>
  );
}
