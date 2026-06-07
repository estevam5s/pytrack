import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldCheck, Crown, Users, Inbox } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { isAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateUserForm } from "@/components/admin/create-user-form";

export const metadata = { title: "Admin · PyTrack" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!isAdmin(user?.email)) redirect("/configuracoes");

  // lista de usuários com plano vitalício (comp)
  let compUsers: { email: string; created_at: string }[] = [];
  try {
    const admin = createAdminClient();
    const { data: subs } = await admin
      .from("subscriptions")
      .select("user_id, created_at, metadata")
      .order("created_at", { ascending: false });
    const comp = (subs ?? []).filter(
      (s) => (s.metadata as Record<string, unknown> | null)?.comp,
    );
    const { data: users } = await admin.auth.admin.listUsers({ perPage: 1000 });
    const emailById = new Map(users.users.map((u) => [u.id, u.email ?? ""]));
    compUsers = comp.map((s) => ({
      email: emailById.get(s.user_id) ?? s.user_id,
      created_at: s.created_at,
    }));
  } catch {
    /* ignore */
  }

  return (
    <div className="space-y-6">
      <Card className="border-primary/30">
        <CardContent className="flex items-center gap-3 p-5">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary-light">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div>
            <p className="font-semibold">Painel de administração</p>
            <p className="text-sm text-text-secondary">
              Logado como <strong>{user?.email}</strong> · acesso vitalício.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* atalhos */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/configuracoes/admin/clientes" className="card card-hover flex items-center gap-3 p-5">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green/10 text-green">
            <Users className="h-5 w-5" />
          </span>
          <div>
            <p className="font-semibold">Clientes & receita</p>
            <p className="text-sm text-text-secondary">MRR, assinaturas, planos e Stripe.</p>
          </div>
        </Link>
        <Link href="/configuracoes/admin/mensagens" className="card card-hover flex items-center gap-3 p-5">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary-light">
            <Inbox className="h-5 w-5" />
          </span>
          <div>
            <p className="font-semibold">Mensagens</p>
            <p className="text-sm text-text-secondary">Canal de comunicação com os usuários.</p>
          </div>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-4 w-4 text-primary-light" /> Criar usuário Suprema (vitalício)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-text-secondary">
            Cria uma conta já confirmada, com o plano <strong>Suprema</strong> liberado para
            sempre (sem cobrança). Informe a senha — o usuário poderá trocá-la depois.
          </p>
          <CreateUserForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-4 w-4 text-secondary" /> Usuários vitalícios ({compUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {compUsers.length === 0 ? (
            <p className="text-sm text-text-secondary">Nenhum usuário vitalício ainda.</p>
          ) : (
            <ul className="divide-y divide-border">
              {compUsers.map((u) => (
                <li key={u.email} className="flex items-center justify-between py-2.5 text-sm">
                  <span>{u.email}</span>
                  <span className="text-xs text-text-secondary">
                    {new Date(u.created_at).toLocaleDateString("pt-BR")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
