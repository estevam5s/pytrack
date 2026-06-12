import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { PythonIDE } from "@/components/ide/python-ide";

export const metadata = { title: "IDE Python · PyTrack" };
export const dynamic = "force-dynamic";

export default async function IdePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login?next=/ide");
  return <PythonIDE fullscreen />;
}
