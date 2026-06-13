import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getLevelCounts, getSearchIndex } from "@/lib/data/queries";
import { getActivityStreak } from "@/lib/streak";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { Header } from "@/components/layout/header";
import { CommandMenu } from "@/components/layout/command-menu";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { LevelUpNotifier } from "@/components/dashboard/level-up-notifier";
import { OnboardingTour } from "@/components/dashboard/onboarding-tour";
import { NpsSurvey } from "@/components/dashboard/nps-survey";
import { BroadcastPopup } from "@/components/dashboard/broadcast-popup";
import { PomodoroProvider } from "@/components/home/pomodoro-provider";
import { userHasAccess, getUserTier } from "@/lib/stripe/subscriptions";
import { isAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { UpgradeBanner } from "@/components/billing/UpgradeBanner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/components/site/language-provider";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  // o gating de assinatura é feito no middleware (freemium: rotas grátis
  // liberadas). Aqui só descobrimos se mostramos o banner de upgrade.
  const hasAccess = await userHasAccess(user.id);
  const tier = await getUserTier(user.id);

  const admin = isAdmin(user.email);

  // badge de suporte/mensagens não lidas (no item Configurações/Mensagens)
  let notif = 0;
  // contador de notificações gerais (sino no header)
  let notifCount = 0;
  try {
    if (admin) {
      const adminDb = createAdminClient();
      const { count } = await adminDb
        .from("support_messages")
        .select("id", { count: "exact", head: true })
        .eq("sender", "user")
        .eq("read_by_admin", false);
      notif = count ?? 0;
    } else {
      const { count } = await supabase
        .from("support_messages")
        .select("id", { count: "exact", head: true })
        .eq("sender", "admin")
        .eq("read_by_user", false);
      notif = count ?? 0;
    }
    const { count: nc } = await supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("is_read", false);
    notifCount = nc ?? 0;
  } catch {
    /* ignore */
  }

  const [{ data: profile }, levelCounts, searchIndex, streak] = await Promise.all([
    supabase
      .from("users_profile")
      .select("name, avatar_url, tutorial_done, xp, current_level")
      .eq("user_id", user.id)
      .single(),
    getLevelCounts(),
    getSearchIndex(),
    getActivityStreak(supabase, user.id), // streak unificado (exercícios + estudo)
  ]);

  const sidebarProfile = {
    name: (profile?.name as string) ?? user.email?.split("@")[0] ?? "Estudante",
    avatar: (profile?.avatar_url as string) ?? null,
    streak,
    serverCounts: levelCounts,
  };

  // presença: marca o "visto por último" (online/offline no suporte)
  supabase.rpc("touch_last_seen", { uid: user.id }).then(() => {});

  return (
    <TooltipProvider delayDuration={200}>
     <LanguageProvider>
      <div className="min-h-dvh overflow-x-hidden bg-background">
        <LevelUpNotifier serverCounts={levelCounts} />
        <PomodoroProvider />
        <OnboardingTour initialOpen={!profile?.tutorial_done} />
        <NpsSurvey />
        <BroadcastPopup />
        <MobileSidebar tier={tier} notif={notif} notifCount={notifCount} isAdmin={admin} profile={sidebarProfile} />
        <CommandMenu index={searchIndex} />
        <DashboardShell tier={tier} notif={notif} notifCount={notifCount} isAdmin={admin} profile={sidebarProfile}>
          <Header
            name={profile?.name ?? null}
            email={user.email ?? ""}
            avatarUrl={profile?.avatar_url ?? null}
            levelCounts={levelCounts}
            notifCount={notifCount}
          />
          <main className="w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8 xl:px-10 2xl:px-12">
            {!hasAccess && <UpgradeBanner createdAt={user.created_at} />}
            {children}
          </main>
        </DashboardShell>
      </div>
     </LanguageProvider>
    </TooltipProvider>
  );
}
