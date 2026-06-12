"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function uid() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function createEvent(input: {
  title: string; description?: string; cover_url?: string; location?: string;
  online_url?: string; is_online?: boolean; starts_at: string; ends_at?: string;
}) {
  const { supabase, user } = await uid();
  if (!user) return { error: "Não autenticado" };
  if (!input.title.trim() || !input.starts_at) return { error: "Título e data de início são obrigatórios." };
  const { error } = await supabase.from("community_events").insert({
    creator_id: user.id,
    title: input.title.trim(),
    description: input.description || null,
    cover_url: input.cover_url || null,
    location: input.location || null,
    online_url: input.online_url || null,
    is_online: input.is_online ?? true,
    starts_at: input.starts_at,
    ends_at: input.ends_at || null,
  });
  if (error) return { error: error.message };
  revalidatePath("/comunidade/eventos");
  return { ok: true };
}

export async function toggleAttend(eventId: string) {
  const { supabase, user } = await uid();
  if (!user) return { error: "Não autenticado" };
  const { data: existing } = await supabase.from("community_event_attendees")
    .select("id").eq("event_id", eventId).eq("user_id", user.id).maybeSingle();
  if (existing) {
    await supabase.from("community_event_attendees").delete().eq("id", existing.id);
  } else {
    await supabase.from("community_event_attendees").insert({ event_id: eventId, user_id: user.id });
  }
  revalidatePath("/comunidade/eventos");
  return { ok: true, attending: !existing };
}

export async function deleteEvent(eventId: string) {
  const { supabase, user } = await uid();
  if (!user) return { error: "Não autenticado" };
  await supabase.from("community_events").delete().eq("id", eventId).eq("creator_id", user.id);
  revalidatePath("/comunidade/eventos");
  return { ok: true };
}
