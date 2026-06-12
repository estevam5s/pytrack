import "server-only";

type Level = "error" | "warn" | "info";

/**
 * Logger central. Sempre loga no console (visível em Vercel → Logs).
 * Se LOG_WEBHOOK_URL estiver definido (ex.: Better Stack/Logtail HTTP source,
 * Discord/Slack webhook), envia o evento para monitoramento externo.
 * Para Sentry, ver docs/MONITORING.md.
 */
export async function logEvent(
  level: Level,
  context: string,
  message: string,
  meta?: Record<string, unknown>,
): Promise<void> {
  const payload = {
    level,
    context,
    message,
    ...meta,
    ts: new Date().toISOString(),
    app: "pytrack",
  };

  // console (sempre)
  const line = `[${level}] ${context}: ${message}`;
  if (level === "error") console.error(line, meta ?? "");
  else if (level === "warn") console.warn(line, meta ?? "");
  else console.log(line, meta ?? "");

  // webhook externo (opcional)
  const url = process.env.LOG_WEBHOOK_URL;
  if (url) {
    try {
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      });
    } catch {
      /* não deixa o log derrubar o fluxo */
    }
  }

  // persiste erros/avisos no banco (observabilidade sempre disponível)
  if (level !== "info") {
    try {
      const { createAdminClient } = await import("@/lib/supabase/admin");
      await createAdminClient().from("error_logs").insert({
        level,
        source: context,
        message: message.slice(0, 2000),
        stack: (meta?.stack as string | undefined)?.slice(0, 6000) ?? null,
        path: (meta?.path as string | undefined) ?? null,
        user_id: (meta?.userId as string | undefined) ?? null,
        meta: meta ?? null,
      });
    } catch { /* nunca derruba o fluxo por falha de log */ }
  }

  // Sentry (se DSN configurado)
  if (level === "error" && process.env.SENTRY_DSN) {
    try {
      const Sentry = await import("@sentry/nextjs");
      Sentry.captureException(new Error(`[${context}] ${message}`), { extra: meta });
    } catch { /* ignore */ }
  }
}

export const logError = (context: string, error: unknown, meta?: Record<string, unknown>) =>
  logEvent("error", context, error instanceof Error ? error.message : String(error), {
    ...meta,
    stack: error instanceof Error ? error.stack : undefined,
  });
