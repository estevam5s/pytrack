export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
}

export async function onRequestError(...args: unknown[]) {
  if (process.env.SENTRY_DSN) {
    const Sentry = await import("@sentry/nextjs");
    // @ts-expect-error - assinatura repassada ao Sentry
    Sentry.captureRequestError(...args);
  }
}
