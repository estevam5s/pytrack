import "server-only";

type Level = "error" | "warn" | "info";

/**
 * Logger central. Sempre loga no console (visível em Vercel → Logs).
 * Se LOG_WEBHOOK_URL estiver definido (ex.: Better Stack/Logtail HTTP source,
 * Discord/Slack webhook), envia o evento para monitoramento externo.
 * Para Sentry, ver MONITORING.md.
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
}

export const logError = (context: string, error: unknown, meta?: Record<string, unknown>) =>
  logEvent("error", context, error instanceof Error ? error.message : String(error), {
    ...meta,
    stack: error instanceof Error ? error.stack : undefined,
  });
