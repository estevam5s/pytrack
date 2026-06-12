import { createClient } from "@/lib/supabase/server";
import { getMaterials } from "@/lib/data/queries";
import { PageHeader } from "@/components/dashboard/page-header";
import { MaterialView } from "@/components/dashboard/material-view";

export const metadata = { title: "Material · PyTrack" };

export default async function MaterialPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const materials = await getMaterials();

  return (
    <div>
      <PageHeader
        title="Material complementar"
        description="Documentação, artigos, cheatsheets, repositórios e guias. Adicione links ou faça upload de arquivos (PDF, etc.), edite, baixe e organize por tipo."
      />
      <MaterialView materials={materials} userId={user?.id ?? ""} />
    </div>
  );
}
