"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { fetchUrlMeta } from "@/lib/data/meta";
import type { BookInput } from "@/types";

export interface BookMeta {
  title?: string;
  author?: string;
  cover_url?: string;
  description?: string;
  error?: string;
}

/** Identifica a capa e os dados de um livro a partir de uma URL (loja, editora...). */
export async function fetchBookMeta(url: string): Promise<BookMeta> {
  const meta = await fetchUrlMeta(url);
  if (meta.error) return { error: meta.error };
  return {
    title: meta.title,
    author: meta.author,
    cover_url: meta.image,
    description: meta.description,
  };
}

export async function createBook(input: BookInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const { error } = await supabase
    .from("books")
    .insert({ ...input, user_id: user.id });
  if (error) return { error: error.message };
  revalidatePath("/livros");
  return { ok: true };
}

export async function updateBook(id: string, input: BookInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const { error } = await supabase
    .from("books")
    .update(input)
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) return { error: error.message };
  revalidatePath("/livros");
  return { ok: true };
}

export async function deleteBook(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const { error } = await supabase
    .from("books")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) return { error: error.message };
  revalidatePath("/livros");
  return { ok: true };
}
