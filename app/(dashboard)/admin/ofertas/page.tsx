import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { isAdmin } from "@/lib/admin";
import { PageHeader } from "@/components/dashboard/page-header";
import { OffersManager } from "@/components/admin/offers-manager";
import { getOffers } from "@/lib/offers-actions";

export const metadata = { title: "Ofertas · Admin · PyTrack" };
export const dynamic = "force-dynamic";

export default async function AdminOfertasPage() {
  const me = await getCurrentUser();
  if (!isAdmin(me?.email)) redirect("/inicio");
  const offers = await getOffers();
  return (
    <div>
      <PageHeader title="Ofertas & Promoções" description="Crie ofertas por tempo limitado e descontos nas mensalidades. Cada oferta gera um cupom na Stripe e aparece no banner do site." />
      <OffersManager offers={offers as never} />
    </div>
  );
}
