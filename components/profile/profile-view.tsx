"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Calendar,
  Clock,
  Code2,
  Github,
  Globe,
  GraduationCap,
  Layers,
  Library,
  Linkedin,
  MapPin,
  MessageCircleQuestion,
  Pencil,
  Sparkles,
  Target,
} from "lucide-react";
import type { UserProfile } from "@/types";
import {
  computeXp,
  levelFromXp,
  LEVEL_TIERS,
  XP_WEIGHTS,
  type ActivityCounts,
} from "@/lib/level";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AvatarUpload } from "./avatar-upload";
import { ProfileEditDialog } from "./profile-edit-dialog";

export interface ProfileServerStats {
  modulesCompleted: number;
  modulesTotal: number;
  overallPercentage: number;
  hoursStudied: number;
  booksRead: number;
  totalBooks: number;
  coursesCompleted: number;
  totalCourses: number;
}

function readLocalCounts() {
  let lessons = 0;
  let exercises = 0;
  let questions = 0;
  if (typeof window === "undefined") return { lessons, exercises, questions };
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("pytrack-lessons-")) {
        const arr = JSON.parse(localStorage.getItem(key) ?? "[]");
        if (Array.isArray(arr)) lessons += arr.length;
      }
    }
    exercises = (JSON.parse(localStorage.getItem("pytrack-exercises-done") ?? "[]") as unknown[]).length;
    questions = (JSON.parse(localStorage.getItem("pytrack-questions-studied") ?? "[]") as unknown[]).length;
  } catch {
    /* ignore */
  }
  return { lessons, exercises, questions };
}

function Stat({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: typeof BookOpen;
  label: string;
  value: number | string;
  sub?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-text-secondary">
        <Icon className="h-4 w-4 text-primary" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-bold">{value}</p>
      {sub && <p className="text-[11px] text-text-secondary">{sub}</p>}
    </div>
  );
}

export function ProfileView({
  profile,
  email,
  stats,
}: {
  profile: UserProfile;
  email: string;
  stats: ProfileServerStats;
}) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [local, setLocal] = useState({ lessons: 0, exercises: 0, questions: 0 });

  useEffect(() => setLocal(readLocalCounts()), []);

  const counts: ActivityCounts = useMemo(
    () => ({
      modules: stats.modulesCompleted,
      lessons: local.lessons,
      exercises: local.exercises,
      questions: local.questions,
      books: stats.booksRead,
      courses: stats.coursesCompleted,
    }),
    [stats, local],
  );

  const xp = computeXp(counts);
  const level = levelFromXp(xp);

  const memberSince = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
      })
    : "—";

  const socials = [
    { icon: Github, url: profile.github_url, label: "GitHub" },
    { icon: Linkedin, url: profile.linkedin_url, label: "LinkedIn" },
    { icon: Globe, url: profile.website_url, label: "Website" },
  ].filter((s) => s.url);

  const breakdown = [
    { icon: Layers, label: "Módulos", value: counts.modules, xp: counts.modules * XP_WEIGHTS.modules },
    { icon: BookOpen, label: "Lições", value: counts.lessons, xp: counts.lessons * XP_WEIGHTS.lessons },
    { icon: Code2, label: "Exercícios", value: counts.exercises, xp: counts.exercises * XP_WEIGHTS.exercises },
    { icon: MessageCircleQuestion, label: "Perguntas", value: counts.questions, xp: counts.questions * XP_WEIGHTS.questions },
    { icon: Library, label: "Livros", value: counts.books, xp: counts.books * XP_WEIGHTS.books },
    { icon: GraduationCap, label: "Cursos", value: counts.courses, xp: counts.courses * XP_WEIGHTS.courses },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-primary/30 via-primary/10 to-secondary/20 sm:h-28" />
        <CardContent className="p-5 sm:p-6">
          <div className="-mt-16 flex flex-col items-center gap-4 sm:-mt-20 sm:flex-row sm:items-end">
            <AvatarUpload
              userId={profile.user_id}
              url={profile.avatar_url}
              name={profile.name}
              size={104}
            />
            <div className="flex flex-1 flex-col items-center sm:items-start">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <h1 className="text-xl font-bold sm:text-2xl">
                  {profile.name ?? "Estudante Python"}
                </h1>
                <Badge className="border-primary/40 bg-primary/15 text-primary">
                  {level.tier.emoji} {level.tier.name}
                </Badge>
              </div>
              <p className="text-sm text-text-secondary">{email}</p>
            </div>
            <Button
              variant="outline"
              onClick={() => setEditOpen(true)}
              className="w-full sm:w-auto"
            >
              <Pencil className="h-4 w-4" /> Editar perfil
            </Button>
          </div>

          {profile.bio && (
            <p className="mt-4 text-sm text-text-secondary">{profile.bio}</p>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-text-secondary sm:justify-start">
            {profile.location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> {profile.location}
              </span>
            )}
            {profile.goal && (
              <span className="inline-flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5" /> {profile.goal}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" /> Membro desde {memberSince}
            </span>
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.url!}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-text-secondary transition-colors hover:text-primary"
              >
                <s.icon className="h-3.5 w-3.5" /> {s.label}
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Nível Python */}
      <Card className="card-gradient">
        <CardContent className="p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15 text-3xl">
                {level.tier.emoji}
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
                  Nível Python
                </p>
                <p className="text-2xl font-bold">{level.tier.name}</p>
                <p className="text-sm text-secondary">
                  <Sparkles className="mr-1 inline h-3.5 w-3.5" />
                  {xp.toLocaleString("pt-BR")} XP
                </p>
              </div>
            </div>
            <div className="w-full sm:max-w-xs">
              {level.next ? (
                <>
                  <div className="mb-1.5 flex justify-between text-xs text-text-secondary">
                    <span>{level.tier.name}</span>
                    <span>
                      {level.next.emoji} {level.next.name}
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all"
                      style={{ width: `${level.progressToNext}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-right text-xs text-text-secondary">
                    faltam {(level.next.min - xp).toLocaleString("pt-BR")} XP
                  </p>
                </>
              ) : (
                <p className="text-sm font-medium text-secondary">
                  Nível máximo alcançado! 🐍
                </p>
              )}
            </div>
          </div>

          {/* trilha de níveis */}
          <div className="mt-5 flex items-center gap-1.5 overflow-x-auto pb-1">
            {LEVEL_TIERS.map((t, i) => (
              <div
                key={t.name}
                className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${
                  i <= level.index
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border bg-surface text-text-secondary"
                }`}
              >
                <span>{t.emoji}</span> {t.name}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Atividade / breakdown */}
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-secondary">
          Atividade e progresso
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {breakdown.map((b) => (
            <Stat
              key={b.label}
              icon={b.icon}
              label={b.label}
              value={b.value}
              sub={`${b.xp} XP`}
            />
          ))}
        </div>
      </div>

      {/* Estudo geral */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat
          icon={Sparkles}
          label="Conclusão geral"
          value={`${stats.overallPercentage}%`}
          sub={`${stats.modulesCompleted}/${stats.modulesTotal} módulos`}
        />
        <Stat
          icon={Clock}
          label="Horas estudadas"
          value={`${stats.hoursStudied}h`}
        />
        <Stat
          icon={Library}
          label="Livros lidos"
          value={stats.booksRead}
          sub={`de ${stats.totalBooks} na biblioteca`}
        />
      </div>

      <ProfileEditDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        profile={profile}
        onSaved={() => router.refresh()}
      />
    </div>
  );
}
