import { ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ClearLocalButton,
  ExportDataButton,
  ResetProgressButton,
} from "@/components/dashboard/settings-actions";

export const metadata = { title: "Dados e privacidade · Configurações · PyTrack" };

export default function DadosPage() {
  return (
    <Card className="border-danger/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-danger" /> Dados e privacidade
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start justify-between gap-4 rounded-lg border border-border bg-surface p-4">
          <div>
            <p className="text-sm font-medium">Exportar meus dados</p>
            <p className="text-xs text-text-secondary">
              Baixe seu perfil e progresso em JSON.
            </p>
          </div>
          <ExportDataButton />
        </div>
        <div className="flex items-start justify-between gap-4 rounded-lg border border-border bg-surface p-4">
          <div>
            <p className="text-sm font-medium">Limpar progresso local</p>
            <p className="text-xs text-text-secondary">
              Remove lições, exercícios e perguntas marcados neste navegador.
            </p>
          </div>
          <ClearLocalButton />
        </div>
        <div className="flex items-start justify-between gap-4 rounded-lg border border-danger/30 bg-danger/5 p-4">
          <div>
            <p className="text-sm font-medium text-danger">
              Resetar todo o progresso
            </p>
            <p className="text-xs text-text-secondary">
              Apaga seu progresso de módulos no banco. Não pode ser desfeito.
            </p>
          </div>
          <ResetProgressButton />
        </div>
      </CardContent>
    </Card>
  );
}
