import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
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
  title: "PyTrack — Plataforma de Aprendizado Python",
  description:
    "Dashboard educacional para dominar todo o ecossistema Python: do básico a Data, IoT, DevOps e Engenharia.",
};

const THEME_SCRIPT = `
try {
  var t = localStorage.getItem('pytrack-theme');
  var el = document.documentElement;
  if (t === 'light') { el.classList.add('light'); el.classList.remove('dark'); }
  else { el.classList.add('dark'); el.classList.remove('light'); }
} catch (e) {}
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className={`${inter.variable} ${mono.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
