import { Layers } from "lucide-react";
import { getStackItems } from "@/lib/data/queries";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/cards/stat-card";
import { StackView } from "@/components/dashboard/stack-view";
import { EmptyState } from "@/components/ui/states";

export const metadata = { title: "Stack · PyTrack" };

export default async function StackPage() {
  const items = await getStackItems();
  const categories = new Set(items.map((i) => i.category)).size;

  return (
    <div>
      <PageHeader
        title="Stack do Python"
        description="As tecnologias essenciais do ecossistema, com os logos reais. Busque, filtre por categoria e nível e acesse a documentação oficial."
      />

      <div className="mb-7 grid gap-4 sm:grid-cols-2">
        <StatCard label="Tecnologias" value={items.length} icon={Layers} />
        <StatCard label="Categorias" value={categories} icon={Layers} accent="secondary" />
      </div>

      {items.length === 0 ? (
        <EmptyState title="Nenhuma tecnologia cadastrada" />
      ) : (
        <StackView items={items} />
      )}
    </div>
  );
}
