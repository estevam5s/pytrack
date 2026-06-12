import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getRecentJobs } from "@/lib/community/queries";
import { JobCard } from "@/components/community/job-card";
import { CreateJobDialog } from "@/components/community/create-job-dialog";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Vagas · PyTrack Rede" };
export const dynamic = "force-dynamic";

export default async function RedeVagasPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const jobs = await getRecentJobs(30);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vagas Python</h1>
          <p className="text-sm text-text-secondary">Oportunidades publicadas pela comunidade.</p>
        </div>
        <CreateJobDialog />
      </div>

      {jobs.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-sm text-text-secondary">Nenhuma vaga publicada ainda. Seja o primeiro a publicar!</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => <JobCard key={job.id} job={job} />)}
        </div>
      )}
    </div>
  );
}
