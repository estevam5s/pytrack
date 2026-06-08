import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { DataFastInit } from "@/components/datafast-init";
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

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://plataforma-python.vercel.app",
  ),
  title: {
    default: "PyTrack — Domine Python do básico à carreira",
    template: "%s · PyTrack",
  },
  description:
    "Plataforma completa para aprender todo o ecossistema Python: trilhas guiadas, exercícios com IA, IDE no navegador, projetos reais, comunidade e carreira. Comece grátis.",
  keywords: [
    "aprender python",
    "curso de python",
    "python para dados",
    "python backend",
    "fastapi",
    "django",
    "exercícios de python",
    "carreira python",
    "python do zero",
  ],
  authors: [{ name: "PyTrack" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "PyTrack",
    title: "PyTrack — Domine Python do básico à carreira",
    description:
      "Trilhas, exercícios com IA, IDE Python, projetos reais e comunidade. Aprenda Python de verdade.",
  },
  twitter: {
    card: "summary_large_image",
    title: "PyTrack — Domine Python do básico à carreira",
    description:
      "Trilhas, exercícios com IA, IDE Python, projetos e comunidade.",
  },
  robots: { index: true, follow: true },
};

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
      name: "PyTrack",
      url: SITE_URL,
      logo: `${SITE_URL}/new-logo.png`,
      description:
        "Plataforma de aprendizado de Python: trilhas, exercícios com IA, IDE, projetos e carreira.",
    },
    {
      "@type": "WebSite",
      name: "PyTrack",
      url: SITE_URL,
      inLanguage: "pt-BR",
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
        {children}
      </body>
    </html>
  );
}
