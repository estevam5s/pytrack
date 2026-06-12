import { Github } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GithubConnect } from "@/components/settings/github-connect";

export const metadata = { title: "GitHub · Configurações · PyTrack" };
export const dynamic = "force-dynamic";

export default async function GithubSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data } = user
    ? await supabase.from("users_profile").select("github_username").eq("user_id", user.id).maybeSingle()
    : { data: null };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Github className="h-4 w-4" /> Integração com o GitHub
        </CardTitle>
      </CardHeader>
      <CardContent>
        <GithubConnect username={(data?.github_username as string) ?? null} />
      </CardContent>
    </Card>
  );
}
