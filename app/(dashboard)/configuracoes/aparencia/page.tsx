import { Palette } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/dashboard/settings-actions";

export const metadata = { title: "Aparência · Configurações · PyTrack" };

export default function AparenciaPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-4 w-4 text-primary" /> Aparência
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-3 text-sm text-text-secondary">
          Escolha o tema da plataforma. A preferência é salva neste navegador e
          aplicada em todo o site e no painel.
        </p>
        <ThemeToggle />
        <p className="mt-4 text-xs text-text-secondary">
          Dica: você também pode alternar o tema rapidamente pelo botão de
          sol/lua no topo do painel.
        </p>
      </CardContent>
    </Card>
  );
}
