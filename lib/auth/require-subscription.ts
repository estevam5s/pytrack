import "server-only";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { userHasAccess } from "@/lib/stripe/subscriptions";

/**
 * Garante usuário autenticado COM assinatura válida.
 * Sem login → /auth/login. Sem assinatura válida → /assinar.
 * (Se o billing não estiver configurado, libera — ver userHasAccess.)
 */
export async function requireSubscription() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");
  const ok = await userHasAccess(user.id);
  if (!ok) redirect("/assinar");
  return user;
}
