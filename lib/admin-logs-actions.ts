"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/admin";

async function ensureAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user && isAdmin(user.email);
}

// Apaga logs mais antigos que N dias (limpeza/retenção).
export async function clearOldLogs(days: number) {
  if (!(await ensureAdmin())) return { error: "Não autorizado." };
  const cutoff = new Date(Date.now() - days * 86400000).toISOString();
  const admin = createAdminClient();
  const { error, count } = await admin.from("error_logs").delete({ count: "exact" }).lt("created_at", cutoff);
  if (error) return { error: error.message };
  revalidatePath("/admin/logs");
  return { ok: true, removed: count ?? 0 };
}
