import Link from "next/link";
import { redirect } from "next/navigation";
import { Users, UserPlus, UserCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata = { title: "Minha rede · PyTrack Rede" };
export const dynamic = "force-dynamic";

async function profilesFor(ids: string[]) {
  if (!ids.length) return new Map<string, { name: string; avatar: string | null; headline: string | null }>();
  const admin = createAdminClient();
  const { data } = await admin.from("users_profile").select("user_id, name, avatar_url, headline").in("user_id", ids);
  return new Map((data ?? []).map((p) => [p.user_id, { name: (p.name as string) ?? "Estudante Python", avatar: (p.avatar_url as string) ?? null, headline: (p.headline as string) ?? null }]));
}

function UserRow({ id, p }: { id: string; p?: { name: string; avatar: string | null; headline: string | null } }) {
  return (
    <Link href={`/comunidade/perfil/${id}`} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:border-primary/40">
      {p?.avatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={p.avatar} alt="" className="h-12 w-12 rounded-full object-cover" />
      ) : (
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 font-bold text-primary-light">{(p?.name ?? "?").charAt(0).toUpperCase()}</span>
      )}
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">{p?.name ?? "Estudante Python"}</p>
        {p?.headline && <p className="truncate text-xs text-text-secondary">{p.headline}</p>}
      </div>
    </Link>
  );
}

export default async function RedeConexoesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const admin = createAdminClient();
  const [{ data: followersRows }, { data: followingRows }, { data: connRows }] = await Promise.all([
    admin.from("community_follows").select("follower_id").eq("following_id", user.id),
    admin.from("community_follows").select("following_id").eq("follower_id", user.id),
    admin.from("community_connections").select("requester_id, receiver_id").eq("status", "accepted").or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`),
  ]);

  const followers = (followersRows ?? []).map((r) => r.follower_id as string);
  const following = (followingRows ?? []).map((r) => r.following_id as string);
  const connections = (connRows ?? []).map((r) => (r.requester_id === user.id ? r.receiver_id : r.requester_id) as string);
  const profs = await profilesFor(Array.from(new Set([...followers, ...following, ...connections])));

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold tracking-tight">Minha rede</h1>
      <p className="mb-4 text-sm text-text-secondary">Suas conexões, seguidores e quem você segue.</p>

      <Tabs defaultValue="conexoes">
        <TabsList>
          <TabsTrigger value="conexoes"><UserCheck className="mr-1.5 h-4 w-4" /> Conexões ({connections.length})</TabsTrigger>
          <TabsTrigger value="seguidores"><Users className="mr-1.5 h-4 w-4" /> Seguidores ({followers.length})</TabsTrigger>
          <TabsTrigger value="seguindo"><UserPlus className="mr-1.5 h-4 w-4" /> Seguindo ({following.length})</TabsTrigger>
        </TabsList>

        {[
          ["conexoes", connections, "Você ainda não tem conexões. Conecte-se com pessoas na comunidade!"],
          ["seguidores", followers, "Ninguém te segue ainda. Publique e interaja para crescer sua rede!"],
          ["seguindo", following, "Você ainda não segue ninguém. Explore a comunidade!"],
        ].map(([key, ids, empty]) => (
          <TabsContent key={key as string} value={key as string}>
            {(ids as string[]).length === 0 ? (
              <Card><CardContent className="p-8 text-center text-sm text-text-secondary">{empty as string}</CardContent></Card>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2">
                {(ids as string[]).map((id) => <UserRow key={id} id={id} p={profs.get(id)} />)}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
