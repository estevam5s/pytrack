import Link from "next/link";
import { Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = { title: "Sobre · Configurações · PyTrack" };

export default function SobreConfigPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-4 w-4 text-primary" /> Sobre o PyTrack
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-text-secondary">
        <p>
          Plataforma de aprendizado de todo o ecossistema Python — trilhas,
          exercícios com IA, perguntas de entrevista, projetos e consultor de
          carreira.
        </p>
        <div className="flex flex-wrap gap-2">
          {["Next.js", "TypeScript", "Tailwind", "Supabase", "OpenRouter"].map(
            (t) => (
              <span
                key={t}
                className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs"
              >
                {t}
              </span>
            ),
          )}
        </div>
        <p className="text-xs">
          Versão 1.0 ·{" "}
          <Link href="/inicio" className="text-primary hover:underline">
            Voltar ao início
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
