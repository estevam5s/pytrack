import { UserCog } from "lucide-react";
import { getProfile } from "@/lib/data/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileForm } from "@/components/forms/profile-form";

export const metadata = { title: "Perfil · Configurações · PyTrack" };

export default async function PerfilConfigPage() {
  const profile = await getProfile();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCog className="h-4 w-4 text-primary" /> Perfil e objetivo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ProfileForm
          initialName={profile?.name ?? ""}
          initialGoal={profile?.goal ?? ""}
          initialLevel={profile?.current_level ?? "basico"}
        />
      </CardContent>
    </Card>
  );
}
