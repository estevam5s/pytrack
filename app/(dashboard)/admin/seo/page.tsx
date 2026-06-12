import { redirect } from "next/navigation";
import {
  Search,
  Gauge,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Users,
  ExternalLink,
  Link2,
  FileSearch,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getSeoSettings } from "@/lib/data/seo-settings";
import { SeoEditor } from "@/components/admin/seo-editor";
import { isAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GooglePreview } from "@/components/admin/google-preview";
import { cn } from "@/lib/utils";

export const metadata = { title: "SEO & Busca · Admin · PyTrack" };
export const dynamic = "force-dynamic";

const SITE = "https://www.pytrack.com.br";

async function fetchHome(): Promise<string> {
  try {
    const res = await fetch(SITE, { cache: "no-store", signal: AbortSignal.timeout(8000) });
    return await res.text();
  } catch {
    return "";
  }
}

export default async function AdminSeoPage() {
  const me = await getCurrentUser();
  if (!isAdmin(me?.email)) redirect("/inicio");

  const html = await fetchHome();
  const seo = await getSeoSettings();

  // extrai tags-chave da home
  const pick = (re: RegExp) => (html.match(re)?.[1] ?? "").trim();
  const title = pick(/<title>([^<]*)<\/title>/i);
  const description = pick(/<meta\s+name="description"\s+content="([^"]*)"/i);
  const ogTitle = pick(/<meta\s+property="og:title"\s+content="([^"]*)"/i);
  const ogImage = pick(/<meta\s+property="og:image"\s+content="([^"]*)"/i);
  const canonical = pick(/<link\s+rel="canonical"\s+href="([^"]*)"/i);
  const hasJsonLd = /application\/ld\+json/.test(html);
  const hasViewport = /name="viewport"/.test(html);
  const h1Count = (html.match(/<h1[\s>]/gi) ?? []).length;
  const imgCount = (html.match(/<img[\s>]/gi) ?? []).length;
  const imgAlt = (html.match(/<img[^>]*\salt=/gi) ?? []).length;

  // checklist de SEO
  const checks = [
    { ok: title.length > 10 && title.length <= 65, label: "Título (10–65 caracteres)", detail: `${title.length} caracteres` },
    { ok: description.length >= 70 && description.length <= 165, label: "Meta description (70–165)", detail: `${description.length} caracteres` },
    { ok: Boolean(ogTitle), label: "Open Graph (compartilhamento)", detail: ogTitle ? "presente" : "ausente" },
    { ok: Boolean(ogImage), label: "Imagem de compartilhamento (OG image)", detail: ogImage ? "presente" : "ausente" },
    { ok: hasJsonLd, label: "Dados estruturados (JSON-LD)", detail: hasJsonLd ? "Organization + WebSite + SiteNav" : "ausente" },
    { ok: hasViewport, label: "Mobile-friendly (viewport)", detail: hasViewport ? "ok" : "ausente" },
    { ok: h1Count === 1, label: "Exatamente 1 <h1>", detail: `${h1Count} encontrado(s)` },
    { ok: imgCount === 0 || imgAlt / imgCount > 0.7, label: "Imagens com alt", detail: `${imgAlt}/${imgCount} com alt` },
  ];
  const score = Math.round((checks.filter((c) => c.ok).length / checks.length) * 100);

  // analytics simples: usuários e novos cadastros
  let totalUsers = 0;
  let new7d = 0;
  let new30d = 0;
  try {
    const admin = createAdminClient();
    const { data } = await admin.auth.admin.listUsers({ perPage: 1000 });
    const now = Date.now();
    totalUsers = data.users.length;
    new7d = data.users.filter((u) => now - new Date(u.created_at).getTime() < 7 * 86400000).length;
    new30d = data.users.filter((u) => now - new Date(u.created_at).getTime() < 30 * 86400000).length;
  } catch {
    /* ignore */
  }

  return (
    <div>
      <PageHeader
        title="SEO & Busca no Google"
        description="Como a PyTrack aparece nas buscas, performance de SEO e analytics de visitantes."
      />

      <div className="space-y-6">
        {/* Editor de SEO (configura o que aparece no Google) */}
        <Card>
          <CardContent className="p-5">
            <p className="mb-3 flex items-center gap-2 text-sm font-semibold"><Gauge className="h-4 w-4 text-primary-light" /> Configurar SEO do site</p>
            <SeoEditor settings={seo} />
          </CardContent>
        </Card>

        {/* Score + analytics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary-light"><Gauge className="h-5 w-5" /></span>
              <p className={cn("mt-3 text-3xl font-bold", score >= 80 ? "text-green" : score >= 50 ? "text-warning" : "text-red-400")}>{score}/100</p>
              <p className="text-xs text-text-secondary">Score de SEO (home)</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue/10 text-blue"><Users className="h-5 w-5" /></span>
              <p className="mt-3 text-3xl font-bold">{totalUsers}</p>
              <p className="text-xs text-text-secondary">Usuários totais</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green/10 text-green"><Users className="h-5 w-5" /></span>
              <p className="mt-3 text-3xl font-bold">+{new7d}</p>
              <p className="text-xs text-text-secondary">Novos (7 dias)</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-magenta/10 text-magenta"><Users className="h-5 w-5" /></span>
              <p className="mt-3 text-3xl font-bold">+{new30d}</p>
              <p className="text-xs text-text-secondary">Novos (30 dias)</p>
            </CardContent>
          </Card>
        </div>

        {/* Preview do Google */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Search className="h-4 w-4 text-primary" /> Como aparece no Google</CardTitle>
          </CardHeader>
          <CardContent>
            <GooglePreview
              title={seo.title || title || "PyTrack — Domine Python do básico à carreira"}
              url={SITE}
              description={seo.description || description || "Plataforma completa para aprender Python, do básico à carreira, com trilhas, exercícios com IA e IDE no navegador."}
            />
            <p className="mt-4 text-xs text-text-secondary">
              Os <strong>sitelinks</strong> (sub-páginas listadas como na Rocketseat) são gerados
              automaticamente pelo Google com base na estrutura do site e nos dados estruturados
              (JSON-LD), que já estão configurados. Eles aparecem conforme o site ganha autoridade e tráfego.
            </p>
          </CardContent>
        </Card>

        {/* Checklist de SEO */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileSearch className="h-4 w-4 text-primary" /> Auditoria de SEO</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-border">
              {checks.map((c) => (
                <li key={c.label} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <span className="flex items-center gap-2">
                    {c.ok ? <CheckCircle2 className="h-4 w-4 text-green" /> : <AlertTriangle className="h-4 w-4 text-warning" />}
                    {c.label}
                  </span>
                  <span className="text-xs text-text-secondary">{c.detail}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Ferramentas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Link2 className="h-4 w-4 text-primary" /> Ferramentas & próximos passos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Tool href="https://search.google.com/search-console" title="Google Search Console" desc="Cadastre o site, envie o sitemap e veja impressões/cliques reais." />
            <Tool href="https://pagespeed.web.dev/?url=https://www.pytrack.com.br" title="PageSpeed Insights" desc="Mede performance, Core Web Vitals e velocidade." />
            <Tool href="https://search.google.com/test/rich-results?url=https://www.pytrack.com.br" title="Teste de Rich Results" desc="Valida os dados estruturados (JSON-LD) da PyTrack." />
            <Tool href={`${SITE}/sitemap.xml`} title="Sitemap" desc="Envie este sitemap no Search Console para indexação rápida." />
            <Tool href={`${SITE}/robots.txt`} title="robots.txt" desc="Regras de rastreamento para os buscadores." />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Tool({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface p-3 transition-colors hover:border-primary/40">
      <span>
        <span className="font-medium">{title}</span>
        <span className="block text-xs text-text-secondary">{desc}</span>
      </span>
      <ExternalLink className="h-4 w-4 shrink-0 text-text-secondary" />
    </a>
  );
}
