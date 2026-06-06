import { PageHeader } from "@/components/dashboard/page-header";
import { PythonIDE } from "@/components/ide/python-ide";

export const metadata = { title: "IDE Python · PyTrack" };

export default function IdePage() {
  return (
    <div>
      <PageHeader
        title="IDE Python"
        description="Pratique Python direto no navegador — escreva, execute e veja o resultado na hora, sem instalar nada."
      />
      <PythonIDE />
    </div>
  );
}
