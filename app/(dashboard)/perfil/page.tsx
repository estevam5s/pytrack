import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  computeStats,
  getBooks,
  getContents,
  getProfile,
  getProgressMap,
  getUdemyCourses,
} from "@/lib/data/queries";
import { PageHeader } from "@/components/dashboard/page-header";
import { ProfileView } from "@/components/profile/profile-view";

export const metadata = { title: "Perfil · PyTrack" };

export default async function PerfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const [profile, contents, progress, books, courses] = await Promise.all([
    getProfile(),
    getContents(),
    getProgressMap(),
    getBooks(),
    getUdemyCourses(),
  ]);

  if (!profile) redirect("/auth/login");

  const stats = computeStats(contents, progress);
  const booksRead = books.filter((b) => b.status === "concluido").length;
  const coursesCompleted = courses.filter(
    (c) => c.status === "concluido",
  ).length;

  return (
    <div>
      <PageHeader
        title="Perfil"
        description="Suas informações, nível em Python calculado pela sua atividade e todo o seu progresso na plataforma."
      />
      <ProfileView
        profile={profile}
        email={user.email ?? ""}
        stats={{
          modulesCompleted: stats.completed,
          modulesTotal: stats.total,
          overallPercentage: stats.overallPercentage,
          hoursStudied: stats.hoursStudied,
          booksRead,
          totalBooks: books.length,
          coursesCompleted,
          totalCourses: courses.length,
        }}
      />
    </div>
  );
}
