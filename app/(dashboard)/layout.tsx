import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getLevelCounts, getSearchIndex } from "@/lib/data/queries";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { Header } from "@/components/layout/header";
import { CommandMenu } from "@/components/layout/command-menu";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { LevelUpNotifier } from "@/components/dashboard/level-up-notifier";
import { OnboardingTour } from "@/components/dashboard/onboarding-tour";
import { PomodoroProvider } from "@/components/home/pomodoro-provider";
import { userHasAccess, getUserTier } from "@/lib/stripe/subscriptions";
import { UpgradeBanner } from "@/components/billing/UpgradeBanner";
import { TooltipProvider } from "@/components/ui/tooltip";

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

  const [{ data: profile }, levelCounts, searchIndex] = await Promise.all([
    supabase
      .from("users_profile")
      .select("name, avatar_url")
      .eq("user_id", user.id)
      .single(),
    getLevelCounts(),
    getSearchIndex(),
  ]);

  return (
    <TooltipProvider delayDuration={200}>
      <div className="min-h-screen overflow-x-hidden bg-background">
        <LevelUpNotifier serverCounts={levelCounts} />
        <PomodoroProvider />
        <OnboardingTour />
        <MobileSidebar tier={tier} />
        <CommandMenu index={searchIndex} />
        <DashboardShell tier={tier}>
          <Header
            name={profile?.name ?? null}
            email={user.email ?? ""}
            avatarUrl={profile?.avatar_url ?? null}
            levelCounts={levelCounts}
          />
          <main className="mx-auto w-full max-w-[1720px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 xl:px-12">
            {!hasAccess && <UpgradeBanner />}
            {children}
          </main>
        </DashboardShell>
      </div>
    </TooltipProvider>
  );
}
