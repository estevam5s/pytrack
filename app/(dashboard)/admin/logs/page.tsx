import { redirect } from "next/navigation";
import { ScrollText, AlertCircle, AlertTriangle, Skull, Activity } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { isAdmin } from "@/lib/admin";
import { PageHeader } from "@/components/dashboard/page-header";
import { getLogsData } from "@/lib/admin-logs";
import { LogsViewer } from "@/components/admin/logs-viewer";

export const metadata = { title: "Logs do sistema · Admin · PyTrack" };
export const dynamic = "force-dynamic";

export default async function AdminLogsPage() {
  const me = await getCurrentUser();
  if (!isAdmin(me?.email)) redirect("/inicio");
  const { logs, stats, sources } = await getLogsData();

  return (
    <div>
      <PageHeader title="Logs do sistema" description="Erros e eventos da plataforma — cada funcionalidade que os usuários acessam é monitorada. Filtre, investigue e limpe os logs." />

      <div className="mb-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Stat icon={ScrollText} label="Total" value={stats.total} color="text-primary-light" />
        <Stat icon={Activity} label="Últimas 24h" value={stats.last24h} color="text-blue" />
        <Stat icon={Activity} label="7 dias" value={stats.last7d} color="text-secondary" />
        <Stat icon={AlertCircle} label="Errors" value={stats.errors} color="text-red-400" />
        <Stat icon={AlertTriangle} label="Warns" value={stats.warns} color="text-yellow-400" />
        <Stat icon={Skull} label="Fatais" value={stats.fatal} color="text-red-500" />
      </div>

      <LogsViewer logs={logs} sources={sources} />
    </div>
  );
}

function Stat({ icon: Icon, label, value, color }: { icon: typeof ScrollText; label: string; value: number; color: string }) {
  return <div className="card flex items-center gap-3 p-4"><Icon className={`h-6 w-6 ${color}`} /><div><p className="text-2xl font-bold">{value}</p><p className="text-xs text-text-secondary">{label}</p></div></div>;
}
