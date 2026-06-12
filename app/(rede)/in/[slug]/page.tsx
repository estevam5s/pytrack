import { notFound, redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

// URL pública profissional: /in/<slug> → redireciona para o perfil completo.
export default async function VanityRedirect({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const admin = createAdminClient();
  const { data } = await admin
    .from("users_profile")
    .select("user_id")
    .ilike("vanity_url", slug)
    .maybeSingle();
  if (!data) notFound();
  redirect(`/comunidade/perfil/${data.user_id}`);
}
