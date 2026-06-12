import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Github, Globe, Linkedin, MapPin, Sparkles, Pencil, Lock, Link2, MessageSquare, Award } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUserTier } from "@/lib/stripe/subscriptions";
import { tierAtLeast } from "@/lib/billing-access";
import { ProfileActions } from "@/components/community/profile-actions";
import { ProfileSections } from "@/components/rede/profile-sections";
import { VanityUrl } from "@/components/rede/vanity-url";
import { getProfileSections } from "@/lib/community/profile-queries";
import { getUserCertificates } from "@/lib/certificates";
import { getEarnedBadges } from "@/lib/badges";
import { TIER_COLOR, type BadgeTier } from "@/lib/badges-defs";

export const dynamic = "force-dynamic";

export default async function RedeProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user: me } } = await supabase.auth.getUser();

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("users_profile")
    .select("user_id, name, avatar_url, cover_url, headline, bio, location, github_url, linkedin_url, website_url, skills, current_level, xp, vanity_url")
    .eq("user_id", id)
    .maybeSingle();
  if (!profile) notFound();

  const isSelf = me?.id === id;

  // GATING SUPREMA: ver perfil de OUTROS membros exige plano Suprema
  const myTier = me ? await getUserTier(me.id) : "free";
  const canViewOthers = isSelf || tierAtLeast(myTier as never, "suprema" as never);

  if (!canViewOthers) {
    return (
      <div className="mx-auto max-w-lg py-12 text-center">
        <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary-light"><Lock className="h-8 w-8" /></span>
        <h1 className="text-2xl font-bold">Perfis são exclusivos do plano Suprema</h1>
        <p className="mt-2 text-text-secondary">Para visualizar os perfis profissionais completos de outros membros da comunidade, assine o plano <strong className="text-foreground">Suprema</strong> (R$46/mês).</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/assinar?upgrade=suprema" className="rounded-xl bg-gradient-to-r from-primary to-primary-light px-6 py-3 text-sm font-semibold text-white">Assinar Suprema</Link>
          <Link href="/comunidade" className="rounded-xl border border-border px-6 py-3 text-sm">Voltar ao feed</Link>
        </div>
      </div>
    );
  }

  const [{ count: followers }, { count: following }, conn, followRow, { count: connCount }, sections] = await Promise.all([
    admin.from("community_follows").select("id", { count: "exact", head: true }).eq("following_id", id),
    admin.from("community_follows").select("id", { count: "exact", head: true }).eq("follower_id", id),
    me ? admin.from("community_connections").select("id, status, requester_id, receiver_id").or(`and(requester_id.eq.${me.id},receiver_id.eq.${id}),and(requester_id.eq.${id},receiver_id.eq.${me.id})`).maybeSingle() : Promise.resolve({ data: null }),
    me ? admin.from("community_follows").select("id").eq("follower_id", me.id).eq("following_id", id).maybeSingle() : Promise.resolve({ data: null }),
    admin.from("community_connections").select("id", { count: "exact", head: true }).eq("status", "accepted").or(`requester_id.eq.${id},receiver_id.eq.${id}`),
    getProfileSections(id),
  ]);

  const connection = (conn as { data: { id: string; status: string; requester_id: string } | null }).data;
  const isFollowing = Boolean((followRow as { data: unknown }).data);
  const skills = (profile.skills as string[]) ?? [];
  const [certs, badges] = await Promise.all([getUserCertificates(id), getEarnedBadges(id)]);

  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {/* cartão principal */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="h-40 bg-gradient-to-br from-primary/40 via-secondary/20 to-surface bg-cover bg-center sm:h-52" style={profile.cover_url ? { backgroundImage: `url(${profile.cover_url})` } : undefined} />
        <div className="relative px-6 pb-6">
          <div className="-mt-16 flex items-end justify-between">
            {profile.avatar_url ? (
              <Image src={profile.avatar_url} alt="" width={120} height={120} className="rounded-full border-4 border-card object-cover" style={{ height: 120, width: 120 }} />
            ) : (
              <span className="flex items-center justify-center rounded-full border-4 border-card bg-primary/15 text-4xl font-bold text-primary-light" style={{ height: 120, width: 120 }}>{(profile.name ?? "?").charAt(0).toUpperCase()}</span>
            )}
            {isSelf ? (
              <Link href="/comunidade/eu" className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2 px-4 py-2 text-sm font-semibold hover:text-foreground"><Pencil className="h-3.5 w-3.5" /> Editar perfil</Link>
            ) : me ? (
              <div className="flex items-center gap-2">
                <Link href={`/comunidade/mensagens/${id}`} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2 px-4 py-2 text-sm font-semibold hover:text-foreground"><MessageSquare className="h-4 w-4" /> Mensagem</Link>
                <ProfileActions targetUserId={id} connectionId={connection?.id ?? null} connectionStatus={connection?.status ?? null} isRequester={connection?.requester_id === me.id} isFollowing={isFollowing} />
              </div>
            ) : null}
          </div>

          <h1 className="mt-4 text-2xl font-bold">{profile.name ?? "Estudante Python"}</h1>
          {profile.headline && <p className="text-text-secondary">{profile.headline}</p>}

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-secondary">
            {profile.location && <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {profile.location}</span>}
            <span className="inline-flex items-center gap-1"><Sparkles className="h-3.5 w-3.5 text-primary-light" /> {profile.xp ?? 0} XP</span>
            <Link href="/comunidade/conexoes" className="font-medium text-primary-light hover:underline">{connCount ?? 0} conexões</Link>
            <span>{followers ?? 0} seguidores · {following ?? 0} seguindo</span>
          </div>

          {/* URL pública */}
          {profile.vanity_url && (
            <a href={`/in/${profile.vanity_url}`} className="mt-2 inline-flex items-center gap-1 text-xs text-text-secondary hover:text-primary-light"><Link2 className="h-3 w-3" /> www.pytrack.com.br/in/{profile.vanity_url as string}</a>
          )}

          <div className="mt-4 flex flex-wrap gap-3">
            {profile.github_url && <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-sm hover:text-foreground"><Github className="h-4 w-4" /> GitHub</a>}
            {profile.linkedin_url && <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-sm hover:text-foreground"><Linkedin className="h-4 w-4" /> LinkedIn</a>}
            {profile.website_url && <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-sm hover:text-foreground"><Globe className="h-4 w-4" /> Website</a>}
          </div>
        </div>
      </div>

      {/* sobre */}
      {profile.bio && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-2 font-bold">Sobre</h2>
          <p className="whitespace-pre-line text-sm leading-relaxed text-text-secondary">{profile.bio}</p>
        </div>
      )}

      {/* Conquistas (badges) */}
      {badges.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-bold"><Award className="h-5 w-5 text-[#d4af37]" /> Conquistas <span className="text-sm font-normal text-text-secondary">· {badges.length}</span></h2>
            {isSelf && <Link href="/comunidade/badges" className="text-xs text-primary-light hover:underline">Ver todas →</Link>}
          </div>
          <div className="flex flex-wrap gap-2">
            {badges.slice(0, 18).map((b) => {
              const color = TIER_COLOR[b.tier as BadgeTier];
              return (
                <span key={b.id} title={`${b.name} — ${b.description}`} className="flex h-11 w-11 items-center justify-center rounded-full text-lg" style={{ background: `${color}22`, border: `2px solid ${color}` }}>{b.emoji}</span>
              );
            })}
            {badges.length > 18 && <span className="flex h-11 items-center px-2 text-xs text-text-secondary">+{badges.length - 18}</span>}
          </div>
        </div>
      )}

      {/* Certificados de trilha */}
      {certs.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-3 flex items-center gap-2 font-bold"><Award className="h-5 w-5 text-[#d4af37]" /> Licenças e certificados PyTrack</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {certs.map((c) => (
              <a key={c.credential_code} href={`/certificado/${c.credential_code}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-lg border border-[#d4af37]/30 bg-[#d4af37]/5 p-3 transition-colors hover:border-[#d4af37]/60">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#d4af37]/15 text-[#d4af37]"><Award className="h-5 w-5" /></span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">Trilha {c.trilha_title}</p>
                  <p className="text-[11px] text-text-secondary">{c.level}{c.hours ? ` · ${c.hours}h` : ""} · {c.credential_code}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* URL vanity (editável — só dono) */}
      {isSelf && <VanityUrl current={(profile.vanity_url as string) ?? null} />}

      {/* todas as seções profissionais */}
      <ProfileSections sections={sections} skills={skills} isSelf={isSelf} targetId={id} viewerId={me?.id ?? null} />
    </div>
  );
}
