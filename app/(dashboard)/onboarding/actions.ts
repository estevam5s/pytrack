"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function saveOnboardingGoal(goal: string, trilhaId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  await supabase
    .from("users_profile")
    .update({ onboarding_goal: goal, onboarding_done: true })
    .eq("user_id", user.id);

  redirect(trilhaId ? `/minhas-trilhas/${trilhaId}` : "/minhas-trilhas");
}
