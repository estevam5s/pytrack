import {
  ExternalLink,
  FileText,
  BookOpenText,
  Video,
  FileCode2,
  FolderGit2,
  Link2,
  ScrollText,
} from "lucide-react";
import { getMaterials } from "@/lib/data/queries";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/states";
import { LEVEL_LABELS, levelColor } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

const TYPE_ICON: Record<string, LucideIcon> = {
  Documentação: BookOpenText,
  Artigos: FileText,
  Vídeos: Video,
  Cheatsheets: FileCode2,
  Repositórios: FolderGit2,
  Guias: ScrollText,
  PDFs: FileText,
  "Links úteis": Link2,
};

export const metadata = { title: "Material · PyTrack" };

export default async function MaterialPage() {
  const materials = await getMaterials();
  const types = Array.from(new Set(materials.map((m) => m.type)));

  return (
    <div>
      <PageHeader
        title="Material complementar"
        description="Documentação, artigos, cheatsheets, repositórios e guias para aprofundar cada tópico."
      />

      {materials.length === 0 ? (
        <EmptyState title="Nenhum material cadastrado" />
      ) : (
        <div className="space-y-8">
          {types.map((type) => {
            const Icon = TYPE_ICON[type] ?? FileText;
            return (
              <section key={type}>
                <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Icon className="h-4 w-4 text-primary" />
                  {type}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {materials
                    .filter((m) => m.type === type)
                    .map((m) => (
                      <a
                        key={m.id}
                        href={m.url ?? "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Card hover className="group h-full">
                          <CardContent className="p-5">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-medium leading-snug">
                                {m.title}
                              </h3>
                              <ExternalLink className="h-4 w-4 shrink-0 text-text-secondary opacity-0 transition-opacity group-hover:opacity-100" />
                            </div>
                            <p className="mt-1.5 line-clamp-2 text-xs text-text-secondary">
                              {m.description}
                            </p>
                            <div className="mt-3 flex items-center gap-2">
                              <Badge className={levelColor(m.level)}>
                                {LEVEL_LABELS[m.level]}
                              </Badge>
                              {m.category && (
                                <span className="text-xs text-text-secondary">
                                  {m.category}
                                </span>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </a>
                    ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
