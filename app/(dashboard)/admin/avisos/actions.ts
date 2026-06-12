"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { isAdmin } from "@/lib/admin";
import { broadcastToUsers } from "@/lib/notifications/broadcast";

export interface BroadcastResult {
  error?: string;
  success?: string;
}

/**
 * Envia uma notificação para TODOS os usuários (novidades, features, trilhas,
 * exercícios, valores etc.). Cria uma linha em `notifications` por usuário —
 * aparece no sino, na rota /notificacoes e como popup no próximo acesso.
 */
export async function broadcast(
  _prev: BroadcastResult,
  formData: FormData,
): Promise<BroadcastResult> {
  const me = await getCurrentUser();
  if (!isAdmin(me?.email)) return { error: "Sem permissão." };

  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim() || null;
  const link = String(formData.get("link") ?? "").trim() || null;
  const type = String(formData.get("type") ?? "system");
  const audience = String(formData.get("audience") ?? "all"); // all | paid

  if (!title) return { error: "Informe um título." };

  const res = await broadcastToUsers({
    title,
    body,
    link,
    type,
    audience: audience === "paid" ? "paid" : "all",
  });
  if (res.error) return { error: res.error };
  if (res.sent === 0) return { error: "Nenhum destinatário encontrado." };

  revalidatePath("/notificacoes");
  return { success: `Aviso enviado para ${res.sent} usuário(s)! Aparece no sino, em /notificacoes e como popup.` };
}
