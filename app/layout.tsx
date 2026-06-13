import type { Metadata } from "next";
import Script from "next/script";
import { Inter, JetBrains_Mono } from "next/font/google";
import { DataFastInit } from "@/components/datafast-init";
import { GoogleAnalytics } from "@/components/analytics";
import { getSeoSettings } from "@/lib/data/seo-settings";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

// Metadata dinâmica — título/descrição/keywords/OG configuráveis em /admin/seo.
export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings();
  const keywords = seo.keywords.split(",").map((k) => k.trim()).filter(Boolean);
  const ogImg = seo.og_image.startsWith("http") || seo.og_image.startsWith("/") ? seo.og_image : `/${seo.og_image}`;
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://www.pytrack.com.br"),
    title: { default: seo.title, template: "%s · PyTrack" },
    description: seo.description,
    keywords,
    authors: [{ name: "PyTrack" }],
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName: "PyTrack",
      url: "https://www.pytrack.com.br",
      title: seo.title,
      description: seo.description,
      images: [{ url: ogImg, width: 1200, height: 630, alt: seo.title }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@pytrack",
      title: seo.title,
      description: seo.description,
      images: [ogImg],
    },
    robots: { index: true, follow: true },
    verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
  };
}

const THEME_SCRIPT = `
try {
  var t = localStorage.getItem('pytrack-theme');
  var el = document.documentElement;
  if (t === 'light') { el.classList.add('light'); el.classList.remove('dark'); }
  else { el.classList.add('dark'); el.classList.remove('light'); }
} catch (e) {}
`;

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://plataforma-python.vercel.app";

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "PyTrack",
      alternateName: "PyTrack — Aprenda Python",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/new-logo.png`,
        width: 512,
        height: 512,
      },
      description:
        "Plataforma de aprendizado de Python: trilhas, exercícios com IA, IDE no navegador, projetos e carreira.",
      email: "contato@estevamsouza.com.br",
      foundingDate: "2026",
      sameAs: [
        "https://github.com/PyTrackOrganization",
        "https://www.linkedin.com/company/pytrack/about/",
        "https://x.com/estevam5s",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "PyTrack",
      url: SITE_URL,
      inLanguage: "pt-BR",
      publisher: { "@id": `${SITE_URL}/#organization` },
      // habilita a caixa de busca de sitelinks no Google
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/blog?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      // ajuda o Google a montar os sitelinks (sub-páginas)
      "@type": "ItemList",
      "@id": `${SITE_URL}/#sitenav`,
      name: "Navegação PyTrack",
      itemListElement: [
        { "@type": "SiteNavigationElement", position: 1, name: "Trilhas", url: `${SITE_URL}/trilhas` },
        { "@type": "SiteNavigationElement", position: 2, name: "Recursos", url: `${SITE_URL}/recursos` },
        { "@type": "SiteNavigationElement", position: 3, name: "Projetos", url: `${SITE_URL}/projetos` },
        { "@type": "SiteNavigationElement", position: 4, name: "Carreira", url: `${SITE_URL}/carreira` },
        { "@type": "SiteNavigationElement", position: 5, name: "Preços", url: `${SITE_URL}/precos` },
        { "@type": "SiteNavigationElement", position: 6, name: "Blog", url: `${SITE_URL}/blog` },
        { "@type": "SiteNavigationElement", position: 7, name: "Entrar", url: `${SITE_URL}/auth/login` },
        { "@type": "SiteNavigationElement", position: 8, name: "Sobre", url: `${SITE_URL}/sobre` },
      ],
    },
    {
      "@type": "EducationalOrganization",
      "@id": `${SITE_URL}/#school`,
      name: "PyTrack",
      url: SITE_URL,
      description: "Escola digital focada no ecossistema Python — do básico à carreira.",
    },
    {
      // Curso (rich result de cursos no Google)
      "@type": "Course",
      "@id": `${SITE_URL}/#course`,
      name: "Aprenda Python — do básico à carreira",
      description:
        "Curso completo de Python com dezenas de trilhas guiadas, milhares de exercícios com IA, IDE no navegador, projetos reais e carreira.",
      provider: { "@id": `${SITE_URL}/#organization` },
      url: `${SITE_URL}/trilhas`,
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "online",
        courseWorkload: "P6M",
      },
      offers: {
        "@type": "Offer",
        category: "Subscription",
        price: "10.00",
        priceCurrency: "BRL",
        availability: "https://schema.org/InStock",
        url: `${SITE_URL}/precos`,
      },
    },
    {
      // Perguntas frequentes (rich result de FAQ no Google)
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "A PyTrack é gratuita?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Você começa com 7 dias grátis, sem cartão. Depois, os planos vão de R$10/mês (Essencial) ao Vitalício (pagamento único).",
          },
        },
        {
          "@type": "Question",
          name: "Preciso instalar o Python para usar a PyTrack?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Não. A PyTrack tem uma IDE Python que roda direto no navegador (WebAssembly), sem nenhuma instalação.",
          },
        },
        {
          "@type": "Question",
          name: "A PyTrack serve para quem é iniciante?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sim. Há trilhas guiadas do absoluto zero, com exercícios corrigidos por IA e projetos práticos, além de roadmap de carreira.",
          },
        },
        {
          "@type": "Question",
          name: "Quais áreas de Python a PyTrack cobre?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Backend, Dados, Machine Learning & IA, DevOps & Cloud, Arquitetura, IoT, Segurança, Automação, Web Full-Stack, MLOps, Agentes de IA e mais — dezenas de trilhas guiadas.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
      </head>
      <body className={`${inter.variable} ${mono.variable} font-sans`}>
        <DataFastInit />
        <GoogleAnalytics />
        {/* Utmify — captura de UTMs e integração com a Stripe */}
        <Script
          src="https://cdn.utmify.com.br/scripts/utms/latest.js"
          data-utmify-prevent-subids
          data-utmify-is-stripe
          strategy="afterInteractive"
        />
        {children}
      </body>
    </html>
  );
}
