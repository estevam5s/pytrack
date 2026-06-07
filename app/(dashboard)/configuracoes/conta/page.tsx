import { Calendar, Mail, UserCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/data/queries";
import { getUserTier } from "@/lib/stripe/subscriptions";
import { TIER_LABEL } from "@/lib/billing-access";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AvatarUpload } from "@/components/profile/avatar-upload";
import { cn } from "@/lib/utils";

export const metadata = { title: "Conta · Configurações · PyTrack" };

export default async function ContaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const profile = await getProfile();
  const tier = user ? await getUserTier(user.id) : "free";

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCircle className="h-4 w-4 text-primary" /> Conta
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
          {user && (
            <AvatarUpload
              userId={user.id}
              url={profile?.avatar_url ?? null}
              name={profile?.name ?? null}
              size={72}
            />
          )}
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <h2 className="text-lg font-bold">
                {profile?.name ?? "Estudante Python"}
              </h2>
              <Badge
                className={cn(
                  tier === "suprema" || tier === "completo"
                    ? "border-primary/30 bg-primary/10 text-primary-light"
                    : tier === "essencial"
                      ? "border-secondary/30 bg-secondary/10 text-secondary"
                      : "border-border bg-surface-2 text-text-secondary",
                )}
              >
                Plano {TIER_LABEL[tier]}
              </Badge>
            </div>
            <div className="mt-1.5 flex flex-col gap-1 text-sm text-text-secondary sm:flex-row sm:gap-4">
              <span className="inline-flex items-center justify-center gap-1.5">
                <Mail className="h-3.5 w-3.5" /> {user?.email}
              </span>
              <span className="inline-flex items-center justify-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" /> Desde {memberSince}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
