"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { fetchUrlMeta } from "@/lib/data/meta";
import type { MaterialInput } from "@/types";

export interface MaterialMeta {
  title?: string;
  description?: string;
  error?: string;
}

export async function fetchMaterialMeta(url: string): Promise<MaterialMeta> {
  const meta = await fetchUrlMeta(url);
  if (meta.error) return { error: meta.error };
  return { title: meta.title, description: meta.description };
}

export async function createMaterial(input: MaterialInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };
  if (!input.title?.trim()) return { error: "Informe o título." };

  const { error } = await supabase
    .from("materials")
    .insert({ ...input, user_id: user.id });
  if (error) return { error: error.message };
  revalidatePath("/material");
  return { ok: true };
}

export async function updateMaterial(id: string, input: MaterialInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const { error } = await supabase
    .from("materials")
    .update(input)
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) return { error: error.message };
  revalidatePath("/material");
  return { ok: true };
}

export async function deleteMaterial(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const { error } = await supabase
    .from("materials")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) return { error: error.message };
  revalidatePath("/material");
  return { ok: true };
}
