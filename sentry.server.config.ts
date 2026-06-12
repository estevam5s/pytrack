import * as Sentry from "@sentry/nextjs";

// Só inicializa se o DSN estiver configurado (no-op sem conta Sentry).
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 0.1,
    environment: process.env.VERCEL_ENV ?? "development",
  });
}
