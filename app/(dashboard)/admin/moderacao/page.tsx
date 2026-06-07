import { redirect } from "next/navigation";
import { Flag, ShieldOff, Trash2, Ban, CheckCircle2 } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { isAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deletePostAdmin, resolveReport, setUserBlocked } from "./actions";
import { cn } from "@/lib/utils";

export const metadata = { title: "Moderação · Admin · PyTrack" };
export const dynamic = "force-dynamic";

export default async function ModeracaoPage() {
  const me = await getCurrentUser();
  if (!isAdmin(me?.email)) redirect("/inicio");

  const admin = createAdminClient();
  const { data: reports = [] } = await admin
    .from("community_reports")
    .select("id, reporter_id, post_id, comment_id, reason, description, status, created_at")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  // detalhes dos posts denunciados
  const postIds = [...new Set((reports ?? []).map((r) => r.post_id).filter(Boolean))] as string[];
  const postsById = new Map<string, { content: string; user_id: string }>();
  if (postIds.length) {
    const { data: posts } = await admin
      .from("community_posts")
      .select("id, content, user_id")
      .in("id", postIds);
    for (const p of posts ?? []) postsById.set(p.id, { content: p.content, user_id: p.user_id });
  }

  const { data: blocked = [] } = await admin
    .from("community_profiles")
    .select("user_id, username, is_blocked")
    .eq("is_blocked", true);

  return (
    <div>
      <PageHeader
        title="Moderação da comunidade"
        description="Trate denúncias, remova conteúdo e bloqueie usuários que violem as regras."
      />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flag className="h-4 w-4 text-primary" /> Denúncias pendentes ({(reports ?? []).length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(reports ?? []).length === 0 ? (
              <p className="text-sm text-text-secondary">Nenhuma denúncia pendente. 🎉</p>
            ) : (
              (reports ?? []).map((r) => {
                const post = r.post_id ? postsById.get(r.post_id) : null;
                return (
                  <div key={r.id} className="rounded-lg border border-border bg-surface p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-full border border-warning/30 bg-warning/10 px-2 py-0.5 text-[11px] font-semibold text-warning">
                        {r.reason}
                      </span>
                      <span className="text-xs text-text-secondary">
                        {new Date(r.created_at).toLocaleString("pt-BR")}
                      </span>
                    </div>
                    {r.description && <p className="mt-2 text-sm text-text-secondary">“{r.description}”</p>}
                    {post && (
                      <p className="mt-2 rounded-md bg-surface-2 p-2 text-sm">
                        {post.content.slice(0, 280)}
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {r.post_id && (
                        <form action={deletePostAdmin}>
                          <input type="hidden" name="post_id" value={r.post_id} />
                          <button className="inline-flex items-center gap-1 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400">
                            <Trash2 className="h-3.5 w-3.5" /> Remover post
                          </button>
                        </form>
                      )}
                      {post?.user_id && (
                        <form action={setUserBlocked}>
                          <input type="hidden" name="user_id" value={post.user_id} />
                          <input type="hidden" name="blocked" value="true" />
                          <button className="inline-flex items-center gap-1 rounded-md border border-border bg-surface-2 px-3 py-1.5 text-xs font-semibold text-text-secondary hover:text-foreground">
                            <Ban className="h-3.5 w-3.5" /> Bloquear autor
                          </button>
                        </form>
                      )}
                      <form action={resolveReport}>
                        <input type="hidden" name="report_id" value={r.id} />
                        <button className="inline-flex items-center gap-1 rounded-md border border-border bg-surface-2 px-3 py-1.5 text-xs font-semibold text-text-secondary hover:text-foreground">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Marcar resolvida
                        </button>
                      </form>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldOff className="h-4 w-4 text-red-400" /> Usuários bloqueados ({(blocked ?? []).length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(blocked ?? []).length === 0 ? (
              <p className="text-sm text-text-secondary">Nenhum usuário bloqueado.</p>
            ) : (
              <ul className="divide-y divide-border">
                {(blocked ?? []).map((b) => (
                  <li key={b.user_id} className="flex items-center justify-between py-2.5 text-sm">
                    <span>@{b.username ?? b.user_id.slice(0, 8)}</span>
                    <form action={setUserBlocked}>
                      <input type="hidden" name="user_id" value={b.user_id} />
                      <input type="hidden" name="blocked" value="false" />
                      <button className={cn("text-xs font-semibold text-primary-light hover:underline")}>
                        Desbloquear
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
