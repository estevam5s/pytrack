"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { notifyUser } from "@/lib/notify";

async function me() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

/** Envia pedido de conexão (estilo LinkedIn). */
export async function requestConnection(targetUserId: string) {
  const { supabase, user } = await me();
  if (!user) return { error: "Não autenticado" };
  if (user.id === targetUserId) return { error: "Você não pode se conectar consigo mesmo" };
  const { error } = await supabase.from("community_connections").insert({
    requester_id: user.id,
    receiver_id: targetUserId,
    status: "pending",
  });
  if (error && !error.message.includes("duplicate")) return { error: error.message };
  await notifyUser(targetUserId, {
    type: "community",
    title: "Novo pedido de conexão",
    body: "Alguém quer se conectar com você na comunidade.",
    link: `/comunidade/perfil/${user.id}`,
  });
  revalidatePath(`/comunidade/perfil/${targetUserId}`);
  return { ok: true };
}

export async function acceptConnection(connectionId: string) {
  const { supabase, user } = await me();
  if (!user) return { error: "Não autenticado" };
  const { data: conn, error } = await supabase
    .from("community_connections")
    .update({ status: "accepted", responded_at: new Date().toISOString() })
    .eq("id", connectionId)
    .eq("receiver_id", user.id)
    .select("requester_id")
    .maybeSingle();
  if (error) return { error: error.message };
  if (conn?.requester_id) {
    await notifyUser(conn.requester_id as string, {
      type: "community",
      title: "Conexão aceita! 🤝",
      body: "Seu pedido de conexão foi aceito.",
      link: `/comunidade/perfil/${user.id}`,
    });
  }
  revalidatePath("/comunidade");
  return { ok: true };
}

export async function removeConnection(targetUserId: string) {
  const { supabase, user } = await me();
  if (!user) return { error: "Não autenticado" };
  await supabase
    .from("community_connections")
    .delete()
    .or(
      `and(requester_id.eq.${user.id},receiver_id.eq.${targetUserId}),and(requester_id.eq.${targetUserId},receiver_id.eq.${user.id})`,
    );
  revalidatePath(`/comunidade/perfil/${targetUserId}`);
  return { ok: true };
}
