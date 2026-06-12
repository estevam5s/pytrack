import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blog-posts";
import { getModule } from "@/lib/content/registry";
import { FREE_MODULE_SLUG } from "@/lib/billing-access";
import { PROJECTS } from "@/lib/site-data";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.pytrack.com.br";

export default function sitemap(): MetadataRoute.Sitemap {
  // prioridade calibrada para guiar os sitelinks do Google
  const routes: { path: string; p: number; f: "daily" | "weekly" | "monthly" }[] = [
    { path: "", p: 1.0, f: "daily" },
    { path: "/precos", p: 0.9, f: "weekly" },
    { path: "/trilhas", p: 0.9, f: "weekly" },
    { path: "/recursos", p: 0.8, f: "weekly" },
    { path: "/projetos", p: 0.8, f: "weekly" },
    { path: "/carreira", p: 0.8, f: "weekly" },
    { path: "/blog", p: 0.7, f: "daily" },
    { path: "/aprender", p: 0.7, f: "weekly" },
    { path: "/sobre", p: 0.6, f: "monthly" },
    { path: "/contato", p: 0.5, f: "monthly" },
    { path: "/apps", p: 0.7, f: "weekly" },
    { path: "/bot", p: 0.6, f: "weekly" },
    { path: "/docs", p: 0.7, f: "weekly" },
    { path: "/docs/apps", p: 0.6, f: "weekly" },
    { path: "/docs/api", p: 0.6, f: "weekly" },
    { path: "/status", p: 0.4, f: "weekly" },
    { path: "/termos", p: 0.3, f: "monthly" },
    { path: "/privacidade", p: 0.3, f: "monthly" },
    { path: "/auth/login", p: 0.5, f: "monthly" },
    { path: "/auth/register", p: 0.6, f: "monthly" },
    { path: "/assinar", p: 0.7, f: "weekly" },
  ];
  const staticEntries: MetadataRoute.Sitemap = routes.map((r) => ({
    url: `${BASE}${r.path}`,
    lastModified: new Date(),
    changeFrequency: r.f,
    priority: r.p,
  }));

  // páginas de projetos (detalhe) — bom para indexação de cauda longa
  const projectEntries: MetadataRoute.Sitemap = PROJECTS.map((p) => ({
    url: `${BASE}/projetos/${p.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const blogEntries: MetadataRoute.Sitemap = BLOG_POSTS.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const lessons = getModule(FREE_MODULE_SLUG)?.lessons ?? [];
  const lessonEntries: MetadataRoute.Sitemap = lessons.map((l) => ({
    url: `${BASE}/aprender/${l.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...projectEntries, ...blogEntries, ...lessonEntries];
}
