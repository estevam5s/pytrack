import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pytrack.dev"),
  title: {
    default: "Python Learning Platform — Domine Python do básico à carreira",
    template: "%s · PyTrack",
  },
  description:
    "Aprenda Python com trilhas guiadas, exercícios, projetos reais, dashboard de evolução, materiais, livros e carreira.",
  keywords: [
    "Python",
    "Aprender Python",
    "Python para dados",
    "Python backend",
    "Python IoT",
    "Engenharia de Dados",
    "Dashboard de estudos",
  ],
  authors: [{ name: "PyTrack" }],
  openGraph: {
    title: "Python Learning Platform — Domine Python do básico à carreira",
    description:
      "Trilhas guiadas, exercícios com IA, projetos reais e um dashboard que mostra sua evolução em todo o ecossistema Python.",
    type: "website",
    locale: "pt_BR",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${jakarta.variable} ${mono.variable} font-sans`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
