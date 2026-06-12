import { redirect } from "next/navigation";
import { Languages, ExternalLink, Globe, Check, Info } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { isAdmin } from "@/lib/admin";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = { title: "Tradução do site · Admin · PyTrack" };
export const dynamic = "force-dynamic";

const SITE = "https://www.pytrack.com.br";

// todas as rotas públicas do site (para verificar a tradução, sem exceção)
const ROUTES = [
  { path: "/", label: "Início" },
  { path: "/trilhas", label: "Trilhas" },
  { path: "/recursos", label: "Recursos" },
  { path: "/projetos", label: "Projetos" },
  { path: "/carreira", label: "Carreira" },
  { path: "/precos", label: "Preços" },
  { path: "/blog", label: "Blog" },
  { path: "/aprender", label: "Aprender (grátis)" },
  { path: "/sobre", label: "Sobre" },
  { path: "/changelog", label: "Changelog" },
  { path: "/status", label: "Status" },
  { path: "/docs/api", label: "Documentação da API" },
  { path: "/termos", label: "Termos de uso" },
  { path: "/privacidade", label: "Privacidade" },
  { path: "/auth/login", label: "Entrar" },
  { path: "/auth/register", label: "Criar conta" },
];

// abre a rota já traduzida para inglês (via Google Translate)
function enUrl(path: string) {
  const host = "www-pytrack-com-br";
  return `https://${host}.translate.goog${path}?_x_tr_sl=pt&_x_tr_tl=en&_x_tr_hl=pt`;
}

export default async function AdminTraducaoPage() {
  const me = await getCurrentUser();
  if (!isAdmin(me?.email)) redirect("/inicio");

  return (
    <div>
      <PageHeader
        title="Tradução do site"
        description="Controle e verifique a tradução de todas as rotas do site (Português ⇄ Inglês)."
      />

      <div className="space-y-6">
        <Card className="border-primary/30">
          <CardContent className="flex items-start gap-3 p-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary-light">
              <Languages className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold">Tradução automática ativa</p>
              <p className="text-sm text-text-secondary">
                O site traduz <strong>todas as rotas, sem exceção</strong>, via tradução automática.
                Idiomas disponíveis: <strong>🇧🇷 Português, 🇺🇸 English, 🇪🇸 Español, 🇨🇳 中文, 🇰🇷 한국어</strong>.
                Os visitantes alternam pelo seletor de idioma no topo do site. Marcas como
                &ldquo;PyTrack&rdquo; e &ldquo;Python&rdquo; são preservadas.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* verificação rota por rota */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" /> Verificar tradução por rota ({ROUTES.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-text-secondary">
              Abra qualquer rota já traduzida para inglês e confira o resultado.
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {ROUTES.map((r) => (
                <div key={r.path} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface p-3 text-sm">
                  <span className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green" />
                    <span className="font-medium">{r.label}</span>
                    <code className="text-xs text-text-secondary">{r.path}</code>
                  </span>
                  <div className="flex items-center gap-2">
                    <a href={`${SITE}${r.path}`} target="_blank" rel="noopener noreferrer" className="rounded-md border border-border bg-surface-2 px-2 py-1 text-xs text-text-secondary hover:text-foreground">PT</a>
                    <a href={enUrl(r.path)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-md border border-primary/40 bg-primary/10 px-2 py-1 text-xs font-medium text-primary-light">
                      EN <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* como funciona / dicas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" /> Como funciona
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-text-secondary">
            <p>• A tradução cobre <strong>todo o conteúdo de todas as rotas</strong> automaticamente — inclusive textos novos que você adicionar no futuro.</p>
            <p>• O idioma padrão do site é configurável em <strong>Configuração do site → Idioma padrão</strong>.</p>
            <p>• Para impedir que um termo seja traduzido (ex.: nome de produto/código), envolva-o com a classe <code>notranslate</code> ou o atributo <code>translate=&quot;no&quot;</code>.</p>
            <p>• Os visitantes escolhem o idioma pelo botão <strong>PT/EN</strong> na barra de navegação; a preferência fica salva.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
