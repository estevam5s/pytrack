import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Building2, CheckCircle2, Briefcase } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ServicesEditor } from "@/components/rede/services-editor";

export const dynamic = "force-dynamic";

export default async function ServicosPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user: me } } = await supabase.auth.getUser();
  const isSelf = me?.id === id;

  const admin = createAdminClient();
  const [{ data: profile }, { data: svc }] = await Promise.all([
    admin.from("users_profile").select("name, avatar_url, headline").eq("user_id", id).maybeSingle(),
    admin.from("community_services").select("*").eq("user_id", id).maybeSingle(),
  ]);
  if (!profile) notFound();

  const services = (svc?.services as string[]) ?? [];
  const media = (svc?.media_urls as string[]) ?? [];

  return (
    <div className="mx-auto max-w-3xl space-y-3">
      <Link href={`/comunidade/perfil/${id}`} className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Voltar ao perfil</Link>

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-3">
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatar_url as string} alt="" className="h-14 w-14 rounded-full object-cover" />
          ) : <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-xl font-bold text-primary-light">{((profile.name as string) ?? "?").charAt(0)}</span>}
          <div>
            <h1 className="text-xl font-bold">Serviços de {(profile.name as string)?.split(" ")[0] ?? "membro"}</h1>
            {svc?.is_open ? (
              <span className="inline-flex items-center gap-1 text-sm text-green"><CheckCircle2 className="h-3.5 w-3.5" /> Aberto a propostas</span>
            ) : <p className="text-sm text-text-secondary">{profile.headline as string}</p>}
          </div>
        </div>
      </div>

      {isSelf && <ServicesEditor initial={svc ?? null} />}

      {/* Visão geral */}
      {svc?.overview && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-2 font-bold">Visão geral</h2>
          <p className="whitespace-pre-line text-sm leading-relaxed text-text-secondary">{svc.overview as string}</p>
        </div>
      )}

      {/* Serviços prestados */}
      {services.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-3 flex items-center gap-2 font-bold"><Briefcase className="h-4 w-4 text-primary-light" /> Serviços prestados</h2>
          <div className="flex flex-wrap gap-2">
            {services.map((s) => <span key={s} className="rounded-full border border-border bg-surface-2 px-3 py-1 text-sm">{s}</span>)}
          </div>
        </div>
      )}

      {/* Empresa afiliada */}
      {svc?.affiliated_company && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-3 flex items-center gap-2 font-bold"><Building2 className="h-4 w-4 text-primary-light" /> Empresa afiliada</h2>
          <div className="flex items-center gap-3">
            {svc.affiliated_company_logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={svc.affiliated_company_logo as string} alt="" className="h-12 w-12 rounded-lg border border-border object-contain" />
            ) : <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface-2"><Building2 className="h-5 w-5 text-text-secondary" /></span>}
            <p className="font-semibold">{svc.affiliated_company as string}</p>
          </div>
        </div>
      )}

      {/* Mídia */}
      {media.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-3 font-bold">Mídia</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {media.map((m) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={m} src={m} alt="" className="aspect-video w-full rounded-lg border border-border object-cover" />
            ))}
          </div>
        </div>
      )}

      {!svc && !isSelf && (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-text-secondary">Este membro ainda não configurou uma página de serviços.</div>
      )}
    </div>
  );
}
