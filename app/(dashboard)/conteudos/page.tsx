import { redirect } from "next/navigation";

// O catálogo de conteúdos foi unificado nas Trilhas de aprendizado.
// Tudo agora vive em /minhas-trilhas (cada trilha agrupa seus módulos).
export default function ConteudosPage() {
  redirect("/minhas-trilhas");
}
