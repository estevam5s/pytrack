import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  computeStats, getBooks, getContents, getProfile, getProgressMap, getUdemyCourses,
} from "@/lib/data/queries";
import { ProfileView } from "@/components/profile/profile-view";

export const metadata = { title: "Editar perfil · PyTrack Rede" };
export const dynamic = "force-dynamic";

export default async function RedeEditProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const [profile, contents, progress, books, courses] = await Promise.all([
    getProfile(), getContents(), getProgressMap(), getBooks(), getUdemyCourses(),
  ]);
  if (!profile) redirect("/auth/login");

  const [{ count: followers }, { count: following }, { count: connections }] = await Promise.all([
    supabase.from("community_follows").select("id", { count: "exact", head: true }).eq("following_id", user.id),
    supabase.from("community_follows").select("id", { count: "exact", head: true }).eq("follower_id", user.id),
    supabase.from("community_connections").select("id", { count: "exact", head: true }).eq("status", "accepted").or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`),
  ]);

  const stats = computeStats(contents, progress);
  const booksRead = books.filter((b) => b.status === "concluido").length;
  const coursesCompleted = courses.filter((c) => c.status === "concluido").length;

  return (
    <div className="mx-auto max-w-3xl">
      <Link href={`/comunidade/perfil/${user.id}`} className="mb-4 inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar ao perfil
      </Link>
      <ProfileView
        profile={profile}
        email={user.email ?? ""}
        social={{ followers: followers ?? 0, following: following ?? 0, connections: connections ?? 0 }}
        stats={{
          modulesCompleted: stats.completed, modulesTotal: stats.total,
          overallPercentage: stats.overallPercentage, hoursStudied: stats.hoursStudied,
          booksRead, totalBooks: books.length, coursesCompleted, totalCourses: courses.length,
        }}
      />
    </div>
  );
}
