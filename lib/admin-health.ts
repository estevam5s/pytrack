import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export type HealthStatus = "ok" | "warn" | "down";
export interface ServiceCheck { name: string; status: HealthStatus; detail: string; emoji: string; latencyMs?: number }

const FACE: Record<HealthStatus, string> = { ok: "😄", warn: "😬", down: "😵" };

async function timed<T>(fn: () => Promise<T>): Promise<{ ms: number; value: T | null; err?: string }> {
  const t = Date.now();
  try { const value = await fn(); return { ms: Date.now() - t, value }; }
  catch (e) { return { ms: Date.now() - t, value: null, err: e instanceof Error ? e.message : "erro" }; }
}

export async function getPlatformHealth() {
  const admin = createAdminClient();

  // 1) Supabase (banco) — latência de um count simples
  const db = await timed(async () => await admin.from("users_profile").select("user_id", { count: "exact", head: true }));
  const dbStatus: HealthStatus = db.err ? "down" : db.ms > 1500 ? "warn" : "ok";

  // 2) Stripe — verifica a chave/conexão
  const stripeCheck = await timed(async () => {
    const { requireStripe } = await import("@/lib/stripe/server");
    return requireStripe().balance.retrieve();
  });
  const stripeStatus: HealthStatus = stripeCheck.err ? "down" : "ok";

  // 3) Webhook — secret configurado?
  const webhookOk = !!process.env.STRIPE_WEBHOOK_SECRET;

  // 4) E-mail (Resend)
  const resendOk = !!process.env.RESEND_API_KEY;

  // 5) Domínio / site
  const site = await timed(() => fetch(process.env.NEXT_PUBLIC_APP_URL ?? "https://www.pytrack.com.br", { method: "HEAD", cache: "no-store" }));
  const siteStatus: HealthStatus = site.err ? "warn" : (site.value as Response | null)?.ok ? "ok" : "warn";

  const services: ServiceCheck[] = [
    { name: "Supabase (banco)", status: dbStatus, emoji: FACE[dbStatus], detail: db.err ? db.err : `respondeu em ${db.ms}ms`, latencyMs: db.ms },
    { name: "Stripe (pagamentos)", status: stripeStatus, emoji: FACE[stripeStatus], detail: stripeCheck.err ? "chave inválida" : `conectado · ${stripeCheck.ms}ms` },
    { name: "Webhook Stripe", status: webhookOk ? "ok" : "warn", emoji: FACE[webhookOk ? "ok" : "warn"], detail: webhookOk ? "secret configurado" : "secret ausente" },
    { name: "E-mail (Resend)", status: resendOk ? "ok" : "warn", emoji: FACE[resendOk ? "ok" : "warn"], detail: resendOk ? "domínio verificado" : "não configurado" },
    { name: "Domínio / Site", status: siteStatus, emoji: FACE[siteStatus], detail: site.err ? "sem resposta" : `online · ${site.ms}ms`, latencyMs: site.ms },
  ];

  // métricas de negócio + capacidade
  const [usersList, subsRes, trialRes] = await Promise.all([
    admin.auth.admin.listUsers({ perPage: 1 }),
    admin.from("subscriptions").select("id", { count: "exact", head: true }).in("status", ["active", "trialing"]),
    admin.from("subscriptions").select("id", { count: "exact", head: true }).eq("status", "trialing"),
  ]);
  const usersTotal = (usersList.data as { total?: number })?.total ?? 0;
  const subsCount = subsRes.count ?? 0;
  const trialCount = trialRes.count ?? 0;

  // engajamento (últimos 7 dias)
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
  const dayAgo = new Date(Date.now() - 86400000).toISOString();
  const [{ data: activity }, { count: studyEvents }, { count: practiceEvents }] = await Promise.all([
    admin.from("daily_activity").select("user_id, seconds, day").gte("day", weekAgo.slice(0, 10)),
    admin.from("study_sessions").select("id", { count: "exact", head: true }).gte("created_at", dayAgo),
    admin.from("exercise_completions").select("id", { count: "exact", head: true }).gte("completed_at", dayAgo),
  ]);
  const act = activity ?? [];
  const totalSeconds = act.reduce((s, a) => s + ((a.seconds as number) ?? 0), 0);
  const activeUsers7d = new Set(act.map((a) => a.user_id)).size;
  const avgMinutes = activeUsers7d ? Math.round(totalSeconds / activeUsers7d / 60) : 0;

  // capacidade: free tier do Supabase ~ limites; estima saúde por nº de usuários
  const userCount = usersTotal;
  const capacityPct = Math.min(100, Math.round((userCount / 50000) * 100)); // 50k = referência free
  const capacityStatus: HealthStatus = capacityPct > 80 ? "warn" : "ok";

  // erros recentes (observabilidade)
  const [{ count: errors24h }, { data: recentErrors }] = await Promise.all([
    admin.from("error_logs").select("id", { count: "exact", head: true }).gte("created_at", dayAgo),
    admin.from("error_logs").select("source, message, level, created_at").order("created_at", { ascending: false }).limit(8),
  ]);

  const allOk = services.every((s) => s.status === "ok");
  const anyDown = services.some((s) => s.status === "down");
  const overall: HealthStatus = anyDown ? "down" : allOk ? "ok" : "warn";

  // vidas (corações) — 1 por serviço OK
  const lives = services.filter((s) => s.status === "ok").length;

  // insights
  const insights: string[] = [];
  if (anyDown) insights.push("⚠️ Um serviço crítico está fora. Verifique imediatamente.");
  if (!webhookOk) insights.push("Configure o STRIPE_WEBHOOK_SECRET — sem ele, pagamentos não liberam acesso.");
  if (capacityPct > 80) insights.push("Banco perto do limite do plano free — considere o Supabase Pro.");
  if (trialCount > 0) insights.push(`${trialCount} usuário(s) em trial — boa hora para um e-mail de conversão.`);
  if (avgMinutes > 0) insights.push(`Engajamento médio: ${avgMinutes} min/usuário ativo na semana.`);
  if ((errors24h ?? 0) > 10) insights.push(`${errors24h} erros nas últimas 24h — investigue os logs recentes.`);
  if (insights.length === 0) insights.push("Tudo verde! A plataforma está saudável e estável. 🎉");

  return {
    overall, overallEmoji: FACE[overall], lives, totalServices: services.length,
    services,
    metrics: { users: userCount, subscribers: subsCount, trialing: trialCount, capacityPct, capacityStatus },
    engagement: { activeUsers7d, totalHours: Math.round(totalSeconds / 3600), avgMinutes, studyEvents24h: studyEvents ?? 0, practiceEvents24h: practiceEvents ?? 0 },
    errors: { last24h: errors24h ?? 0, recent: (recentErrors ?? []).map((e) => ({ source: e.source as string, message: e.message as string, level: e.level as string, created_at: e.created_at as string })) },
    insights,
  };
}
