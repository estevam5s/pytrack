import type { Metadata } from "next";
import { CheckCircle2, XCircle, Activity } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";

export const metadata: Metadata = {
  title: "Status do sistema",
  description: "Status em tempo real da plataforma PyTrack: site, banco de dados, pagamentos e IA.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function ping(url: string, opts?: RequestInit): Promise<boolean> {
  try {
    const res = await fetch(url, {
      ...opts,
      signal: AbortSignal.timeout(6000),
      cache: "no-store",
    });
    return res.status < 500;
  } catch {
    return false;
  }
}

export default async function StatusPage() {
  const supaUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  const [site, db, auth, stripe, ai] = await Promise.all([
    ping("https://www.pytrack.com.br"),
    supaUrl ? ping(`${supaUrl}/rest/v1/`, { headers: { apikey: anon } }) : Promise.resolve(false),
    supaUrl ? ping(`${supaUrl}/auth/v1/health`) : Promise.resolve(false),
    ping("https://api.stripe.com/healthcheck"),
    ping("https://openrouter.ai/api/v1/models"),
  ]);

  const services = [
    { name: "Site & Dashboard", desc: "Aplicação web (Vercel)", up: site },
    { name: "Banco de dados", desc: "Supabase Postgres", up: db },
    { name: "Autenticação", desc: "Login, 2FA e sessões", up: auth },
    { name: "Pagamentos", desc: "Stripe (assinaturas e checkout)", up: stripe },
    { name: "Inteligência Artificial", desc: "Correção de exercícios e consultor", up: ai },
  ];

  const allUp = services.every((s) => s.up);
  const someDown = services.some((s) => !s.up);

  return (
    <>
      <PageHero
        badge="Status"
        title="Status do"
        highlight="sistema"
        description="Acompanhe em tempo real a disponibilidade dos serviços da PyTrack."
      />

      <section className="container max-w-3xl py-14">
        <div
          className={cnStatus(allUp)}
        >
          <Activity className="h-6 w-6" />
          <div>
            <p className="text-lg font-bold">
              {allUp ? "Todos os sistemas operacionais" : someDown ? "Instabilidade em alguns serviços" : "Serviços indisponíveis"}
            </p>
            <p className="text-sm opacity-80">
              Verificado agora: {new Date().toLocaleString("pt-BR")}
            </p>
          </div>
        </div>

        <div className="mt-6 divide-y divide-border overflow-hidden rounded-2xl border border-border">
          {services.map((s) => (
            <div key={s.name} className="flex items-center justify-between p-4">
              <div>
                <p className="font-semibold">{s.name}</p>
                <p className="text-xs text-text-secondary">{s.desc}</p>
              </div>
              {s.up ? (
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-green">
                  <CheckCircle2 className="h-4 w-4" /> Operacional
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-400">
                  <XCircle className="h-4 w-4" /> Fora do ar
                </span>
              )}
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-sm text-text-secondary">
          Está com problema que não aparece aqui? Fale com o suporte dentro da plataforma.
        </p>
      </section>
    </>
  );
}

function cnStatus(allUp: boolean) {
  return [
    "flex items-center gap-3 rounded-2xl border p-5",
    allUp
      ? "border-green/30 bg-green/10 text-green"
      : "border-warning/30 bg-warning/10 text-warning",
  ].join(" ");
}
