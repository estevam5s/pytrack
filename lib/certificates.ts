"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getContents, getProgressMap } from "@/lib/data/queries";
import { MODULES } from "@/lib/content/registry";
import { getTrilha, moduleInTrilha } from "@/lib/trilhas";

const LEVEL_LABEL: Record<string, string> = {
  basico: "Básico", intermediario: "Intermediário", avancado: "Avançado",
};

// % de conclusão real da trilha pelo usuário logado (servidor, fonte da verdade)
export async function getTrilhaCompletion(trilhaId: string): Promise<number> {
  const trilha = getTrilha(trilhaId);
  if (!trilha) return 0;
  const [contents, progress] = await Promise.all([getContents(), getProgressMap()]);
  const slugProgress = new Map<string, number>();
  for (const c of contents) if (c.slug) slugProgress.set(c.slug, progress[c.id]?.progress_percentage ?? 0);
  const mods = MODULES.filter((m) => moduleInTrilha(trilha, m.area, m.slug));
  if (!mods.length) return 0;
  return Math.round(mods.reduce((s, m) => s + (slugProgress.get(m.slug) ?? 0), 0) / mods.length);
}

function genCode(): string {
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
  return `PTBK-${year}-${rand}`;
}

// Emite o certificado se a trilha estiver 100% concluída. Idempotente.
export async function issueCertificate(trilhaId: string): Promise<{ ok?: boolean; code?: string; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };
  const trilha = getTrilha(trilhaId);
  if (!trilha) return { error: "Trilha não encontrada" };

  // já existe?
  const { data: existing } = await supabase.from("certificates").select("credential_code").eq("user_id", user.id).eq("trilha_id", trilhaId).maybeSingle();
  if (existing) return { ok: true, code: existing.credential_code as string };

  // verifica conclusão real
  const pct = await getTrilhaCompletion(trilhaId);
  if (pct < 100) return { error: `Trilha ${pct}% concluída. Conclua 100% para gerar o certificado.` };

  // nome do destinatário
  const { data: prof } = await supabase.from("users_profile").select("name").eq("user_id", user.id).maybeSingle();
  const name = (prof?.name as string) || user.email?.split("@")[0] || "Estudante PyTrack";

  // gera código único (tenta algumas vezes)
  let code = genCode();
  for (let i = 0; i < 5; i++) {
    const { error } = await supabase.from("certificates").insert({
      user_id: user.id, trilha_id: trilhaId, trilha_title: trilha.title,
      recipient_name: name, level: LEVEL_LABEL[trilha.level] ?? trilha.level,
      hours: trilha.adHours, credential_code: code,
    });
    if (!error) {
      revalidatePath(`/minhas-trilhas/${trilhaId}`);
      revalidatePath("/comunidade/eu");
      try { const { evaluateMyBadges } = await import("@/lib/badges"); await evaluateMyBadges(); } catch { /* best-effort */ }
      return { ok: true, code };
    }
    if (error.code === "23505" && error.message.includes("credential_code")) { code = genCode(); continue; }
    return { error: error.message };
  }
  return { error: "Falha ao gerar código único." };
}

// Verificação pública por código (autenticidade)
export async function verifyCertificate(code: string) {
  const admin = createAdminClient();
  const { data } = await admin.from("certificates")
    .select("recipient_name, trilha_title, trilha_id, level, hours, credential_code, issued_at, user_id")
    .ilike("credential_code", code)
    .maybeSingle();
  return data;
}

// compartilha o certificado como post na comunidade (conquista)
export async function shareCertificateOnFeed(code: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };
  const { data: cert } = await supabase.from("certificates").select("trilha_title, level, hours, credential_code, user_id").ilike("credential_code", code).maybeSingle();
  if (!cert || cert.user_id !== user.id) return { error: "Certificado não encontrado." };
  try { await supabase.rpc("community_ensure_profile", { uid: user.id }); } catch { /* ok */ }
  const link = `https://www.pytrack.com.br/certificado/${cert.credential_code}`;
  const content = `🎓 Conquistei o certificado da trilha **${cert.trilha_title}** na PyTrack! (${cert.level}${cert.hours ? ` · ${cert.hours}h` : ""})\n\nVerifique a autenticidade: ${link}`;
  const { error } = await supabase.from("community_posts").insert({
    user_id: user.id, category: "conquista", title: `Certificado: ${cert.trilha_title}`,
    content, tags: ["certificado", "pytrack"], visibility: "public",
  });
  if (error) return { error: error.message };
  revalidatePath("/comunidade");
  return { ok: true };
}

export async function getUserCertificates(userId: string) {
  const admin = createAdminClient();
  const { data } = await admin.from("certificates")
    .select("trilha_id, trilha_title, level, hours, credential_code, issued_at")
    .eq("user_id", userId)
    .order("issued_at", { ascending: false });
  return data ?? [];
}
